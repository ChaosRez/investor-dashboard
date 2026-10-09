import json
import pytest
import re
import os
import sys

# Resolve paths from this file so the suite works from any checkout (and CI)
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Ensure we can import analysis.py
sys.path.insert(0, os.path.join(REPO_ROOT, 'src'))
from apex_etf.analysis import calculate_portfolio_overlap

DATA_DIR = os.path.join(REPO_ROOT, 'public', 'data')

@pytest.fixture
def etfs_data():
    with open(os.path.join(DATA_DIR, 'etfs.json'), 'r') as f:
        return json.load(f)

@pytest.fixture
def correlations_data():
    with open(os.path.join(DATA_DIR, 'correlations.json'), 'r') as f:
        return json.load(f)

@pytest.fixture
def news_data():
    with open(os.path.join(DATA_DIR, 'news.json'), 'r') as f:
        return json.load(f)

@pytest.fixture
def education_data():
    with open(os.path.join(DATA_DIR, 'education.json'), 'r') as f:
        return json.load(f)

# 1. ETF Data Structural Integrity & 2. Data Consistency Cross-Checks
def test_etf_structural_integrity(etfs_data):
    assert isinstance(etfs_data, list)
    assert len(etfs_data) > 0
    
    tickers = set()
    isins = set()
    
    required_fields = [
        "ticker", "isin", "wkn", "name", "issuer", "benchmarkIndex", 
        "assetClass", "distributionPolicy", "isAccumulating", "ter", 
        "aumMillionsEUR", "domicile", "replication", "topHoldings", 
        "countryBreakdown", "sectorBreakdown", "historicalStatsCurvo", 
        "quantitativeStatsPV"
    ]
    
    isin_pattern = re.compile(r'^[A-Z]{2}[A-Z0-9]{10}$')
    
    for etf in etfs_data:
        # Required fields
        for field in required_fields:
            assert field in etf, f"Missing field {field} in {etf.get('ticker')}"
            
        ticker = etf['ticker']
        isin = etf['isin']
        
        # No duplicates
        assert ticker not in tickers, f"Duplicate ticker {ticker}"
        assert isin not in isins, f"Duplicate ISIN {isin}"
        tickers.add(ticker)
        isins.add(isin)
        
        # Pattern matching
        assert isin_pattern.match(isin), f"Invalid ISIN format {isin}"
        
        # Numerical constraints
        assert 0.01 <= etf['ter'] <= 1.0, f"TER {etf['ter']} out of bounds for {ticker}"
        assert etf['aumMillionsEUR'] > 0, f"AUM not positive for {ticker}"
        
        # Top Holdings
        assert isinstance(etf['topHoldings'], list)
        holdings_weight_sum = 0
        for holding in etf['topHoldings']:
            assert 'name' in holding and 'weight' in holding
            weight = holding['weight']
            assert 0 <= weight <= 100
            holdings_weight_sum += weight
        
        # 1 to 100 is reasonable for top 10 (small cap & bond funds have thousands of holdings)
        assert 1.0 <= holdings_weight_sum <= 100, f"Holdings sum {holdings_weight_sum} out of bounds for {ticker}"
        
        # Breakdowns
        country_sum = sum(etf['countryBreakdown'].values()) if isinstance(etf['countryBreakdown'], dict) else 0
        sector_sum = sum(etf['sectorBreakdown'].values()) if isinstance(etf['sectorBreakdown'], dict) else 0
        
        # If there are breakdowns (sometimes 0 for e.g. bonds or empty), sum to roughly 100%
        if etf['countryBreakdown']:
            assert 95 <= country_sum <= 105, f"Country breakdown sum {country_sum} for {ticker}"
        if etf['sectorBreakdown']:
            assert 95 <= sector_sum <= 105, f"Sector breakdown sum {sector_sum} for {ticker}"
            
        # Consistency checks
        assert isinstance(etf['isAccumulating'], bool)
        if etf['isAccumulating']:
            assert etf['distributionPolicy'] == "Accumulating"
        else:
            assert etf['distributionPolicy'] == "Distributing"
            
        assert etf['domicile'] in ["Ireland", "Luxembourg"]
        
        # Historical stats
        hist = etf['historicalStatsCurvo']
        assert all(k in hist for k in ['cagr', 'sharpe', 'stdev', 'maxDrawdown'])
        assert hist['maxDrawdown'] < 0, f"maxDrawdown {hist['maxDrawdown']} should be negative"
        assert -2 <= hist['sharpe'] <= 5, f"sharpe {hist['sharpe']} out of bounds"
        # A sanity range, not a plausibility judgement: a fund under two years old annualises a short,
        # possibly spectacular history (AII: +121% from Dec 2024 to Oct 2026 is a 54.8% CAGR).
        assert -50 <= hist['cagr'] <= 100, f"cagr {hist['cagr']} out of bounds"
        assert 0 <= hist['stdev'] <= 50, f"stdev {hist['stdev']} out of bounds"
        
        # Quant stats
        quant = etf['quantitativeStatsPV']
        assert all(k in quant for k in ['sortino', 'calmar', 'var95', 'marketBeta'])
        assert quant['var95'] < 0, f"var95 {quant['var95']} should be negative"
        assert -0.5 <= quant['marketBeta'] <= 3.0, f"marketBeta {quant['marketBeta']} out of bounds"

# 3. Correlations Data
def test_correlations_data(correlations_data, etfs_data):
    assert 'tickers' in correlations_data
    assert 'matrix' in correlations_data
    
    tickers = correlations_data['tickers']
    matrix = correlations_data['matrix']
    
    etf_tickers = {e['ticker'] for e in etfs_data}
    
    for t1 in tickers:
        assert t1 in etf_tickers, f"Ticker {t1} from correlations not in etfs.json"
        
        for t2 in tickers:
            val = matrix[t1][t2]
            assert -1.0 <= val <= 1.0, f"Correlation {val} out of bounds"
            assert matrix[t1][t2] == matrix[t2][t1], f"Matrix not symmetric at {t1},{t2}"
            
        assert matrix[t1][t1] == 1.0, f"Diagonal not 1.0 at {t1},{t1}"

# 4. API Overlap Calculation
def test_api_overlap_calculation(etfs_data):
    etfs_by_ticker = {e['ticker'].upper(): e for e in etfs_data}

    # Overlap VWCE and IWDA
    portfolio1 = {"VWCE": 60, "IWDA": 40}
    res1 = calculate_portfolio_overlap(portfolio1, etfs_by_ticker)
    
    assert 'summary' in res1
    assert 'topAggregatedHoldings' in res1
    assert 'countryBreakdown' in res1
    assert 'sectorBreakdown' in res1
    assert 'pairwiseOverlaps' in res1
    assert 'warnings' in res1
    
    summary1 = res1['summary']
    assert 'weightedTER' in summary1
    assert 'weightedTrackingDifference' in summary1
    assert 'accumulatingShare' in summary1
    assert summary1['weightedTER'] > 0
    
    overlaps1 = res1['pairwiseOverlaps']
    assert len(overlaps1) > 0
    for ov in overlaps1:
        assert 'etf1' in ov
        assert 'etf2' in ov
        assert 'overlapPercentage' in ov
        if {ov['etf1'], ov['etf2']} == {"VWCE", "IWDA"}:
            assert ov['overlapPercentage'] > 50, "Expected high overlap between VWCE and IWDA"
            
    # Overlap VWCE and AGGU
    portfolio2 = {"VWCE": 80, "AGGU": 20}
    res2 = calculate_portfolio_overlap(portfolio2, etfs_by_ticker)
    overlaps2 = res2['pairwiseOverlaps']
    for ov in overlaps2:
        if {ov['etf1'], ov['etf2']} == {"VWCE", "AGGU"}:
            assert ov['overlapPercentage'] < 30, "Expected low overlap between VWCE and AGGU"

# 5. News Data
def test_news_data(news_data, etfs_data):
    etf_tickers = {e['ticker'] for e in etfs_data}
    
    for item in news_data:
        assert all(k in item for k in ["title", "date", "source", "summary", "relatedEtfs"])
        bias = item.get("signalBias") or item.get("signal", {}).get("bias", "")
        assert any(b.lower() in bias.lower() for b in ["Bullish", "Bearish", "Watch", "Neutral", "Caution"]), f"Invalid signalBias {bias}"
        
        assert isinstance(item["relatedEtfs"], list)
        for rel in item["relatedEtfs"]:
            assert "ticker" in rel
            assert rel["ticker"] in etf_tickers, f"News ticker {rel['ticker']} not in etfs.json"
