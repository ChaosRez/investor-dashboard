# Generate public/js/data-store.js
import json

with open("public/data/etfs.json", "r") as f:
    etfs = json.load(f)

with open("public/data/correlations.json", "r") as f:
    correlations = json.load(f)

with open("public/data/news.json", "r") as f:
    news = json.load(f)

with open("public/data/education.json", "r") as f:
    education = json.load(f)

js_content = f"""/**
 * ApexETF Real Data Store
 * Grounded verified data from justETF, extraETF, Curvo, Portfolio Visualizer, Morningstar, Trackinsight, and official KIDs.
 */

window.APEX_DATA_STORE = {{
  etfs: {json.dumps(etfs, indent=2)},
  correlations: {json.dumps(correlations, indent=2)},
  news: {json.dumps(news, indent=2)},
  education: {json.dumps(education, indent=2)}
}};
"""

with open("public/js/data-store.js", "w") as f:
    f.write(js_content)

print("Generated public/js/data-store.js successfully.")
