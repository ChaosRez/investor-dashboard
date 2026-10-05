"""
Unit tests for ApexETF Synchronization and Configuration Module
"""

import contextlib
import io
import json
import os
import ssl
import stat
import subprocess
import sys
import tempfile
import threading
import unittest
import urllib.error
from datetime import datetime, timedelta, timezone
from email.utils import format_datetime
from unittest import mock

from apex_etf import sync
from apex_etf.config import ETF_MARKET_MAP, WATCHLIST_TICKERS, PUBLIC_DIR, DATA_DIR
from apex_etf.macro_news import VERIFIED_MACRO_NEWS
from apex_etf.sync import fetch_json, fetch_url

class TestSyncModule(unittest.TestCase):
    def test_watchlist_tickers_configured(self):
        self.assertGreaterEqual(len(WATCHLIST_TICKERS), 10)
        # All 10 user watchlist tickers must be mapped
        for t in ["XEON", "AII", "WTAI", "BATT", "RARE", "XCS6", "IMAE", "IUSQ", "SXR8", "VHYL"]:
            self.assertIn(t, WATCHLIST_TICKERS)
            self.assertIn(t, ETF_MARKET_MAP)

    def test_market_map_structure(self):
        for ticker, meta in ETF_MARKET_MAP.items():
            self.assertIn("symbol", meta, f"Missing symbol for {ticker}")
            self.assertIn("exchange", meta, f"Missing exchange for {ticker}")
            self.assertIn("isin", meta, f"Missing isin for {ticker}")
            self.assertTrue(meta["isin"].startswith(("IE", "LU", "DE", "FR")), f"Invalid ISIN prefix for {ticker}")

    def test_macro_news_grounding(self):
        self.assertGreater(len(VERIFIED_MACRO_NEWS), 0)
        for news in VERIFIED_MACRO_NEWS:
            self.assertIn("id", news)
            self.assertIn("title", news)
            self.assertIn("source", news)
            self.assertIn("relatedEtfs", news)
            self.assertIn("retailAction", news)
            for rel in news["relatedEtfs"]:
                self.assertIn("ticker", rel)
                self.assertIn("relation", rel)

    def test_fetch_resilience_on_invalid_url(self):
        # Invalid URLs should return None safely without raising unhandled exceptions
        res_str = fetch_url("http://invalid-nonexistent-domain-xyz-12345.org", timeout=1)
        self.assertIsNone(res_str)
        res_json = fetch_json("http://invalid-nonexistent-domain-xyz-12345.org", timeout=1)
        self.assertIsNone(res_json)

def _epoch(y, m, d, h=7, mi=0, sec=0):
    return int(datetime(y, m, d, h, mi, sec, tzinfo=timezone.utc).timestamp())


def yahoo_chart(closes, trade=(2026, 10, 2, 15, 36, 10), price=171.14, chart_previous_close=169.74):
    """Trimmed v8/chart?range=5d&interval=1d payload (VWCE.DE shape): one daily bar per close."""
    days = [(2026, 9, 28), (2026, 9, 29), (2026, 9, 30), (2026, 10, 1), (2026, 10, 2)][-len(closes):]
    return {"chart": {"result": [{
        "meta": {
            "currency": "EUR", "regularMarketPrice": price, "chartPreviousClose": chart_previous_close,
            "regularMarketTime": _epoch(*trade), "fiftyTwoWeekHigh": 171.5, "fiftyTwoWeekLow": 138.24,
        },
        "timestamp": [_epoch(*d) for d in days],
        "indicators": {"quote": [{"close": closes}]},
    }]}}


class _FakeResponse:
    def __init__(self, body=b"ok"):
        self._body = body

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False

    def read(self):
        return self._body


class TestFetching(unittest.TestCase):
    def test_requests_identify_honestly(self):
        # Yahoo answers HTTP 429 to browser-spoofing and urllib default User-Agents.
        seen = {}

        def fake_urlopen(req, timeout=None):
            seen["ua"] = req.get_header("User-agent")
            return _FakeResponse()

        with mock.patch("urllib.request.urlopen", fake_urlopen):
            self.assertEqual(fetch_url("https://example.test"), "ok")
        self.assertTrue(seen["ua"].startswith("ApexETF/"))
        self.assertNotIn("Chrome", seen["ua"])

    def test_failures_report_a_reason(self):
        cases = [
            (urllib.error.HTTPError("u", 429, "Too Many Requests", {}, None), "HTTP 429"),
            (urllib.error.URLError(ssl.SSLCertVerificationError("unable to get local issuer certificate")),
             "TLS certificate could not be verified"),
            (urllib.error.URLError(TimeoutError("timed out")), "timed out"),
            (urllib.error.URLError(ConnectionRefusedError()), "network unreachable"),
        ]
        for exc, expected in cases:
            with self.subTest(expected=expected), mock.patch("urllib.request.urlopen", side_effect=exc):
                errors = []
                self.assertIsNone(fetch_url("https://example.test", errors=errors))
                self.assertEqual(errors, [expected])

    def test_invalid_json_is_reported(self):
        errors = []
        with mock.patch("urllib.request.urlopen", return_value=_FakeResponse(b"<html>not json</html>")):
            self.assertIsNone(fetch_json("https://example.test", errors=errors))
        self.assertEqual(errors, ["invalid JSON"])


class TestDailyChange(unittest.TestCase):
    def test_uses_previous_session_close_not_range_start(self):
        # chartPreviousClose (169.74) is the close *before the 5-day range*; the real prior close is 169.38.
        payload = yahoo_chart([169.12, 169.40, 169.78, 169.38, None])
        with mock.patch.object(sync, "fetch_json", return_value=payload):
            quote = sync.sync_etf_market_data("VWCE")
        self.assertEqual(quote["previousClose"], 169.38)
        self.assertEqual(quote["dayChange"], 1.76)
        self.assertEqual(quote["dayChangePercent"], 1.04)  # not the 0.82% five-session move

    def test_ignores_todays_in_progress_bar(self):
        # While the market is open today's bar already carries a close (== the current price).
        payload = yahoo_chart([169.12, 169.40, 169.78, 169.38, 170.90], price=170.90)
        self.assertEqual(sync.previous_session_close(payload["chart"]["result"][0]), 169.38)

    def test_falls_back_to_range_level_field_without_daily_bars(self):
        result = {"meta": {"regularMarketPrice": 10.0, "chartPreviousClose": 9.5}}
        self.assertEqual(sync.previous_session_close(result), 9.5)

    def test_quote_carries_the_timestamp_name_the_dashboard_reads(self):
        with mock.patch.object(sync, "fetch_json", return_value=yahoo_chart([169.12, 169.40, 169.78, 169.38, None])):
            quote = sync.sync_etf_market_data("VWCE")
        self.assertTrue(quote["lastPriceUpdated"])
        self.assertEqual(quote["lastPriceUpdated"], quote["marketTime"])

    def test_http_429_is_reported_not_swallowed(self):
        errors = []
        with mock.patch("urllib.request.urlopen",
                        side_effect=urllib.error.HTTPError("u", 429, "Too Many Requests", {}, None)):
            self.assertIsNone(sync.sync_etf_market_data("VWCE", errors=errors))
        self.assertEqual(errors, ["HTTP 429"])


class TestJustEtfParsing(unittest.TestCase):
    CURRENT = (
        '<tr><td class="vallabel" data-testid="etf-basics_label_fund-size"> Fund size </td> '
        '<td> <div> EUR 53,011 m <span class="indicator-3"></span> </div> </td></tr>'
        '<tr><td class="vallabel" data-testid="etf-basics_label_ter"> Total expense ratio </td> '
        '<td> <div class="val" data-testid="tl_etf-basics_value_ter">0.14% p.a.</div> </td></tr>'
    )
    LEGACY = "<div>Fund size</div><div>130,706 m EUR</div><div>Total expense ratio</div><div>0.22% p.a.</div>"

    def scrape(self, html, errors=None):
        with mock.patch.object(sync, "fetch_url", return_value=html):
            return sync.scrape_justetf_fund_data("IE00BK5BQT80", errors=errors)

    def test_current_markup(self):
        self.assertEqual(self.scrape(self.CURRENT), {"aumMillionsEUR": 53011.0, "ter": 0.14})

    def test_legacy_markup_still_parses(self):
        self.assertEqual(self.scrape(self.LEGACY), {"aumMillionsEUR": 130706.0, "ter": 0.22})

    def test_unrecognised_layout_is_reported(self):
        errors = []
        self.assertIsNone(self.scrape("<html><body>cookie wall</body></html>", errors))
        self.assertEqual(errors, ["page layout not recognised"])


class TestRunFullSyncReporting(unittest.TestCase):
    """run_full_sync must say what actually refreshed instead of always claiming success."""

    QUOTE = {"livePrice": 123.45, "currency": "EUR", "previousClose": 120.0, "dayChange": 3.45,
             "dayChangePercent": 2.88, "fiftyTwoWeekHigh": 130.0, "fiftyTwoWeekLow": 100.0,
             "exchange": "XETRA (Frankfurt)", "marketTime": "2026-10-03T10:00:00+00:00",
             "lastPriceUpdated": "2026-10-03T10:00:00+00:00"}
    NEWS = [{"id": "n1", "title": "t", "isLiveStream": True}]

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.data_dir = os.path.join(self.tmp.name, "public", "data")
        os.makedirs(self.data_dir)
        os.makedirs(os.path.join(self.tmp.name, "public", "js"))
        etfs = [
            {"ticker": "VWCE", "isin": "IE00BK5BQT80", "currentPriceEUR": 100.0, "aumMillionsEUR": 1.0, "ter": 0.3},
            {"ticker": "NOSYM", "isin": "IE00B579F325"},  # fictional: no Yahoo symbol configured
        ]
        with open(os.path.join(self.data_dir, "etfs.json"), "w", encoding="utf-8") as f:
            json.dump(etfs, f)
        for patcher in (
            mock.patch.object(sync, "DATA_DIR", self.data_dir),
            mock.patch.object(sync, "BASE_DIR", self.tmp.name),
            mock.patch.object(sync.time, "sleep"),
        ):
            patcher.start()
            self.addCleanup(patcher.stop)

    def run_sync(self, quote="ok", fund="ok", ecb="ok", mw="ok"):
        def quote_fn(ticker, errors=None):
            if quote == "ok":
                return dict(self.QUOTE)
            errors.append("HTTP 429")
            return None

        def fund_fn(isin, errors=None):
            if fund == "ok":
                return {"aumMillionsEUR": 2.0, "ter": 0.2}
            errors.append("page layout not recognised")
            return None

        def feed(state, reason):
            def fn(errors=None):
                if state == "ok":
                    return list(self.NEWS)
                errors.append(reason)
                return []
            return fn

        with mock.patch.object(sync, "sync_etf_market_data", quote_fn), \
             mock.patch.object(sync, "scrape_justetf_fund_data", fund_fn), \
             mock.patch.object(sync, "sync_live_ecb_news", feed(ecb, "TLS certificate could not be verified")), \
             mock.patch.object(sync, "sync_live_marketwatch_news", feed(mw, "HTTP 503")):
            return sync.run_full_sync()

    def etfs_on_disk(self):
        with open(os.path.join(self.data_dir, "etfs.json"), encoding="utf-8") as f:
            return {e["ticker"]: e for e in json.load(f)}

    def test_everything_delivered_is_success(self):
        result = self.run_sync()
        self.assertEqual(result["status"], "success")
        self.assertEqual(result["warnings"], [])
        self.assertEqual(result["quotesUpdated"], 1)
        self.assertEqual(result["quotesSkipped"], ["NOSYM"])  # unmapped is not a failure
        self.assertEqual(result["fundDataUpdated"], 2)
        self.assertEqual(result["newsSources"], {"ecb": 1, "marketwatch": 1})
        self.assertEqual(len(result["sources"]), 4)
        saved = self.etfs_on_disk()["VWCE"]
        self.assertEqual(saved["currentPriceEUR"], 123.45)
        self.assertEqual(saved["aumMillionsEUR"], 2.0)
        self.assertTrue(os.path.exists(os.path.join(self.tmp.name, "public", "js", "data-store.js")))

    def test_rejected_quotes_are_not_reported_as_synced(self):
        result = self.run_sync(quote="fail")
        self.assertEqual(result["status"], "partial")
        self.assertEqual(result["etfsSynced"], 2)  # legacy field: ETFs processed
        self.assertEqual(result["quotesUpdated"], 0)
        self.assertEqual(result["quotesFailed"], ["VWCE"])
        self.assertIn("Yahoo Finance: 1 of 1 price requests failed (HTTP 429).", result["warnings"])
        self.assertNotIn("Yahoo", " ".join(result["sources"]))
        self.assertFalse(next(d for d in result["details"] if d["ticker"] == "VWCE")["quoteUpdated"])
        self.assertEqual(self.etfs_on_disk()["VWCE"]["currentPriceEUR"], 100.0)  # untouched

    def test_feed_failures_are_named(self):
        result = self.run_sync(ecb="fail", mw="fail")
        self.assertIn("ECB feed: no headlines (TLS certificate could not be verified).", result["warnings"])
        self.assertIn("MarketWatch feed: no headlines (HTTP 503).", result["warnings"])
        self.assertEqual(result["liveNewsItemsFetched"], 0)

    def test_a_silent_feed_keeps_its_cached_headlines_through_a_sync(self):
        yesterday = format_datetime(datetime.now(timezone.utc) - timedelta(days=1))
        previous = [
            {"id": "ecb-1", "source": sync.ECB_SOURCE, "isLiveStream": True, "date": yesterday, "title": "ECB: kept"},
            {"id": "mw-1", "source": sync.MARKETWATCH_SOURCE, "isLiveStream": True, "date": yesterday, "title": "MW: replaced"},
        ]
        with open(os.path.join(self.data_dir, "news.json"), "w", encoding="utf-8") as f:
            json.dump(previous, f)

        result = self.run_sync(ecb="fail", mw="ok")

        with open(os.path.join(self.data_dir, "news.json"), encoding="utf-8") as f:
            saved = {n["id"]: n for n in json.load(f)}
        self.assertTrue(saved["ecb-1"]["isStale"])           # kept, honestly labelled
        self.assertNotIn("mw-1", saved)                      # MarketWatch delivered: its old item is replaced
        self.assertIn("n1", saved)                           # ... by the fresh one
        self.assertEqual(result["newsCachedKept"], {"ecb": 1, "marketwatch": 0})
        self.assertEqual(result["liveNewsItemsFetched"], 1)  # cached copies are not "fetched"
        self.assertIn("ECB feed: no headlines (TLS certificate could not be verified); showing 1 cached headline.", result["warnings"])

    def test_nothing_refreshed_is_failed(self):
        result = self.run_sync(quote="fail", fund="fail", ecb="fail", mw="fail")
        self.assertEqual(result["status"], "failed")
        self.assertEqual(result["sources"], [])
        self.assertEqual(len(result["warnings"]), 4)

    def test_missing_dataset_is_an_error(self):
        os.remove(os.path.join(self.data_dir, "etfs.json"))
        self.assertEqual(sync.run_full_sync(), {"error": "etfs.json not found"})


SRC_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src")


class TestCertificateFallback(unittest.TestCase):
    """A stale system CA bundle must not silently kill a feed, and must never weaken verification."""

    URL = "https://feed.example.test/rss"

    def fetch(self, errors=None):
        with contextlib.redirect_stderr(io.StringIO()), mock.patch.object(sync, "_logged_fallbacks", set()):
            return fetch_url(self.URL, errors=errors)

    def test_retries_with_another_bundle_when_the_default_one_rejects_the_certificate(self):
        calls = []
        rejected = urllib.error.URLError(ssl.SSLCertVerificationError("unable to get local issuer certificate"))

        def fake_urlopen(req, timeout=None, context=None):
            calls.append(context)
            if context is None:
                raise rejected
            return _FakeResponse(b"<rss/>")

        fallback_ctx = object()
        with mock.patch("urllib.request.urlopen", fake_urlopen), \
             mock.patch.object(sync, "_fallback_ssl_contexts", return_value=iter([("/fake/bundle.pem", fallback_ctx)])):
            errors = []
            self.assertEqual(self.fetch(errors), "<rss/>")
        self.assertEqual(calls, [None, fallback_ctx])
        self.assertEqual(errors, [])

    def test_a_certificate_no_bundle_can_verify_is_still_refused(self):
        tried = []

        def fake_urlopen(req, timeout=None, context=None):
            tried.append(context)
            raise urllib.error.URLError(ssl.SSLCertVerificationError("self signed certificate"))

        with mock.patch("urllib.request.urlopen", fake_urlopen), \
             mock.patch.object(sync, "_fallback_ssl_contexts", return_value=iter([("/a.pem", "A"), ("/b.pem", "B")])):
            errors = []
            self.assertIsNone(self.fetch(errors))
        self.assertEqual(tried, [None, "A", "B"])
        self.assertEqual(errors, ["TLS certificate could not be verified"])

    def test_other_failures_never_reach_for_another_bundle(self):
        with mock.patch("urllib.request.urlopen", side_effect=urllib.error.URLError(ConnectionRefusedError())), \
             mock.patch.object(sync, "_fallback_ssl_contexts", side_effect=AssertionError("fallback must not run")):
            errors = []
            self.assertIsNone(self.fetch(errors))
        self.assertEqual(errors, ["network unreachable"])

    def test_strict_mode_turns_the_fallback_off(self):
        rejected = urllib.error.URLError(ssl.SSLCertVerificationError("unable to get local issuer certificate"))
        with mock.patch("urllib.request.urlopen", side_effect=rejected), \
             mock.patch.dict(os.environ, {"APEX_STRICT_TLS": "1"}), \
             mock.patch.object(sync, "_fallback_ssl_contexts", side_effect=AssertionError("strict mode must not fall back")):
            errors = []
            self.assertIsNone(self.fetch(errors))
        self.assertEqual(errors, ["TLS certificate could not be verified"])

    def test_fallback_contexts_keep_verification_on(self):
        contexts = list(sync._fallback_ssl_contexts())
        if not contexts:
            self.skipTest("no alternative CA bundle on this machine")
        for path, ctx in contexts:
            self.assertEqual(ctx.verify_mode, ssl.CERT_REQUIRED, path)
            self.assertTrue(ctx.check_hostname, path)


class TestLiveNewsFeeds(unittest.TestCase):
    ECB_XML = (
        '<?xml version="1.0"?><rss version="2.0"><channel>'
        "<item><title> Christine Lagarde: Interview with La Croix</title>"
        "<link>https://www.ecb.europa.eu//press/inter/x.html</link>"
        "<pubDate>Wed, 30 Sep 2026 19:00:00 +0200</pubDate></item>"
        "</channel></rss>"
    )

    def test_ids_are_the_same_in_every_process(self):
        # Built-in hash() is salted per process; ids built from it never matched a previous sync.
        title = "Christine Lagarde: Interview with La Croix"
        ids = {
            subprocess.check_output(
                [sys.executable, "-c", f"from apex_etf.sync import _stable_id; print(_stable_id('ecb', {title!r}))"],
                env={**os.environ, "PYTHONHASHSEED": seed, "PYTHONPATH": SRC_DIR}, text=True,
            ).strip()
            for seed in ("1", "2", "3")
        }
        self.assertEqual(ids, {sync._stable_id("ecb", title)})

    def test_ecb_items_are_trimmed_stamped_and_attributed(self):
        with mock.patch.object(sync, "fetch_url", return_value=self.ECB_XML):
            (item,) = sync.sync_live_ecb_news()
        self.assertEqual(item["title"], "🇪🇺 ECB: Christine Lagarde: Interview with La Croix")  # no doubled space
        self.assertEqual(item["source"], sync.ECB_SOURCE)
        self.assertTrue(item["fetchedAt"])
        self.assertEqual(item["id"], sync._stable_id("ecb", "Christine Lagarde: Interview with La Croix"))


class TestLiveNewsMerge(unittest.TestCase):
    """merge_live_news: a feed that goes quiet must not wipe the news radar."""

    NOW = datetime(2026, 10, 4, 12, 0, tzinfo=timezone.utc)

    def item(self, id_, source, date="Fri, 02 Oct 2026 10:00:00 +0200", **extra):
        return {"id": id_, "source": source, "isLiveStream": True, "date": date, "title": id_, **extra}

    def merge(self, previous, ecb, mw, now=None):
        return sync.merge_live_news(previous, {sync.ECB_SOURCE: ecb, sync.MARKETWATCH_SOURCE: mw}, now=now or self.NOW)

    def test_a_feed_that_delivered_replaces_its_old_items(self):
        old = [self.item("ecb-old", sync.ECB_SOURCE)]
        new = [self.item("ecb-new", sync.ECB_SOURCE, fetchedAt="2026-10-04T12:00:00+00:00")]
        merged, kept = self.merge(old, new, [])
        self.assertEqual([i["id"] for i in merged], ["ecb-new"])
        self.assertNotIn("isStale", merged[0])
        self.assertEqual(kept[sync.ECB_SOURCE], 0)

    def test_a_silent_feed_keeps_its_last_headlines_marked_stale(self):
        old = [
            self.item("ecb-1", sync.ECB_SOURCE, fetchedAt="2026-10-03T19:54:00+00:00"),
            self.item("mw-1", sync.MARKETWATCH_SOURCE),
        ]
        merged, kept = self.merge(old, [], [self.item("mw-2", sync.MARKETWATCH_SOURCE)])
        by_id = {i["id"]: i for i in merged}
        self.assertEqual(set(by_id), {"ecb-1", "mw-2"})  # mw-1 was replaced, ecb-1 kept
        self.assertTrue(by_id["ecb-1"]["isStale"])
        self.assertEqual(by_id["ecb-1"]["staleSince"], self.NOW.isoformat())
        self.assertEqual(by_id["ecb-1"]["fetchedAt"], "2026-10-03T19:54:00+00:00")  # last good fetch preserved
        self.assertNotIn("isStale", by_id["mw-2"])
        self.assertEqual(kept, {sync.ECB_SOURCE: 1, sync.MARKETWATCH_SOURCE: 0})

    def test_stale_since_records_the_first_missed_sync(self):
        first_miss = "2026-10-03T08:00:00+00:00"
        merged, _ = self.merge([self.item("ecb-1", sync.ECB_SOURCE, isStale=True, staleSince=first_miss)], [], [])
        self.assertEqual(merged[0]["staleSince"], first_miss)

    def test_kept_headlines_expire_after_a_week(self):
        old = [
            self.item("ecb-ancient", sync.ECB_SOURCE, date="Mon, 21 Sep 2026 09:00:00 +0200"),
            self.item("ecb-recent", sync.ECB_SOURCE, date="Fri, 02 Oct 2026 09:00:00 +0200"),
        ]
        merged, kept = self.merge(old, [], [])
        self.assertEqual([i["id"] for i in merged], ["ecb-recent"])
        self.assertEqual(kept[sync.ECB_SOURCE], 1)

    def test_an_undated_item_ages_out_from_its_first_miss(self):
        merged, _ = self.merge([self.item("ecb-undated", sync.ECB_SOURCE, date="")], [], [])
        self.assertEqual(len(merged), 1)  # first miss: kept and stamped
        merged, _ = self.merge(merged, [], [], now=self.NOW + timedelta(days=8))
        self.assertEqual(merged, [])

    def test_only_known_feeds_are_kept(self):
        old = [self.item("x", "Some Other Feed"), {"id": "macro", "source": sync.ECB_SOURCE, "isLiveStream": False}]
        merged, _ = self.merge(old, [], [])
        self.assertEqual(merged, [])


class TestAtomicWrites(unittest.TestCase):
    def test_replaces_content_and_leaves_no_temp_files(self):
        with tempfile.TemporaryDirectory() as d:
            path = os.path.join(d, "x.json")
            sync._write_json_atomic(path, {"a": 1})
            sync._write_json_atomic(path, {"a": 2})
            with open(path, encoding="utf-8") as f:
                self.assertEqual(json.load(f), {"a": 2})
            self.assertEqual(os.listdir(d), ["x.json"])

    def test_unserialisable_data_leaves_the_existing_file_untouched(self):
        with tempfile.TemporaryDirectory() as d:
            path = os.path.join(d, "x.json")
            sync._write_json_atomic(path, {"ok": True})
            with self.assertRaises(TypeError):
                sync._write_json_atomic(path, {"bad": object()})
            with open(path, encoding="utf-8") as f:
                self.assertEqual(json.load(f), {"ok": True})
            self.assertEqual(os.listdir(d), ["x.json"])

    def test_a_failed_rename_cleans_up_its_temp_file(self):
        with tempfile.TemporaryDirectory() as d:
            with mock.patch("os.replace", side_effect=OSError("disk gone")), self.assertRaises(OSError):
                sync._write_json_atomic(os.path.join(d, "x.json"), {"a": 1})
            self.assertEqual(os.listdir(d), [])

    def test_keeps_the_existing_file_mode(self):
        with tempfile.TemporaryDirectory() as d:
            path = os.path.join(d, "x.json")
            sync._write_json_atomic(path, {})
            os.chmod(path, 0o640)
            sync._write_json_atomic(path, {"a": 1})
            self.assertEqual(stat.S_IMODE(os.stat(path).st_mode), 0o640)

    def test_a_concurrent_reader_never_sees_a_half_written_file(self):
        payload = {"rows": [{"n": i, "text": "x" * 40} for i in range(4000)]}  # ~250 KB
        with tempfile.TemporaryDirectory() as d:
            path = os.path.join(d, "big.json")
            sync._write_json_atomic(path, payload)
            stop = threading.Event()

            def writer():
                while not stop.is_set():
                    sync._write_json_atomic(path, payload)

            thread = threading.Thread(target=writer)
            thread.start()
            try:
                for _ in range(150):
                    with open(path, encoding="utf-8") as f:
                        self.assertEqual(len(json.load(f)["rows"]), 4000)  # raises on a partial file
            finally:
                stop.set()
                thread.join(5)


class TestSingleFlight(unittest.TestCase):
    def test_a_second_sync_is_rejected_while_one_is_running(self):
        started, release = threading.Event(), threading.Event()

        def slow_sync():
            started.set()
            release.wait(5)
            return {"status": "success"}

        with mock.patch.object(sync, "_run_full_sync", slow_sync):
            thread = threading.Thread(target=sync.run_full_sync)
            thread.start()
            self.assertTrue(started.wait(2))
            with self.assertRaises(sync.SyncInProgress):
                sync.run_full_sync()
            release.set()
            thread.join(2)
        with mock.patch.object(sync, "_run_full_sync", return_value={"status": "success"}):
            self.assertEqual(sync.run_full_sync(), {"status": "success"})  # lock was released

    def test_the_lock_is_released_when_a_sync_crashes(self):
        with mock.patch.object(sync, "_run_full_sync", side_effect=RuntimeError("boom")), self.assertRaises(RuntimeError):
            sync.run_full_sync()
        with mock.patch.object(sync, "_run_full_sync", return_value={"status": "success"}):
            sync.run_full_sync()


class TestQuoteCoverage(unittest.TestCase):
    """A fund without a quote symbol silently never gets a price (SGLD went unnoticed that way)."""

    def setUp(self):
        with open(os.path.join(DATA_DIR, "etfs.json"), encoding="utf-8") as f:
            self.etfs = json.load(f)

    def test_every_etf_in_the_dataset_has_a_quote_symbol(self):
        missing = [e["ticker"] for e in self.etfs if e["ticker"].upper() not in ETF_MARKET_MAP]
        self.assertEqual(missing, [], "add these to ETF_MARKET_MAP (Yahoo symbol + exchange), or they never get a live quote")

    def test_map_isins_match_the_dataset(self):
        wrong = {
            e["ticker"]: (ETF_MARKET_MAP[e["ticker"]]["isin"], e["isin"])
            for e in self.etfs
            if e["ticker"] in ETF_MARKET_MAP and ETF_MARKET_MAP[e["ticker"]]["isin"] != e["isin"]
        }
        self.assertEqual(wrong, {}, "(map ISIN, dataset ISIN): usually a different share class of the same fund")

    def test_every_map_entry_belongs_to_a_dataset_etf(self):
        self.assertEqual(sorted(set(ETF_MARKET_MAP) - {e["ticker"] for e in self.etfs}), [])


if __name__ == "__main__":
    unittest.main()
