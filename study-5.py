"""Reproducible, intentionally small Bayesian-network synthetic session study.

Run: python bayesian_shopper_study.py path/to/online_shoppers_intention.csv
Outputs: shopper_synthetic_study.html and synthetic_shopper_sessions.csv
"""
import csv
import html
import json
import random
import sys
from collections import Counter, defaultdict
from pathlib import Path

SEED = 2419
RNG = random.Random(SEED)
NODES = [
    ("month", []),
    ("visitor", ["month"]),
    ("traffic", ["month"]),
    ("engagement", ["visitor", "traffic"]),
    ("exit", ["engagement", "visitor"]),
    ("purchase", ["engagement", "exit", "traffic"]),
]


def transform(row):
    n = float(row["ProductRelated"])
    e = float(row["ExitRates"])
    return {
        "month": row["Month"],
        "visitor": row["VisitorType"],
        "traffic": row["TrafficType"] if row["TrafficType"] in {"1", "2", "3", "4"} else "Other",
        "engagement": "0–5" if n <= 5 else "6–15" if n <= 15 else "16–40" if n <= 40 else "41+",
        "exit": "Low" if e < .03 else "Medium" if e < .10 else "High",
        "purchase": "Yes" if row["Revenue"].upper() == "TRUE" else "No",
    }


def fit(rows):
    tables = {}
    choices = {}
    for node, parents in NODES:
        counts = defaultdict(Counter)
        choices[node] = sorted({r[node] for r in rows})
        for r in rows:
            counts[tuple(r[p] for p in parents)][r[node]] += 1
        tables[node] = counts
    return tables, choices


def generate(tables, choices, length):
    result = []
    for _ in range(length):
        row = {}
        for node, parents in NODES:
            counts = tables[node][tuple(row[p] for p in parents)]
            # Unseen parent combinations use a uniform Dirichlet prior.
            labels = choices[node]
            weights = [counts[v] + 1 for v in labels]
            row[node] = RNG.choices(labels, weights=weights)[0]
        result.append(row)
    return result


def share(rows, field, value):
    return sum(r[field] == value for r in rows) / len(rows)


def rate(rows, field=None, value=None):
    sub = [r for r in rows if field is None or r[field] == value]
    return (sum(r["purchase"] == "Yes" for r in sub) / len(sub)) if sub else None


def groups(rows_a, rows_b, field, labels):
    return [{"label": label, "real": rate(rows_a, field, label),
             "synthetic": rate(rows_b, field, label),
             "n": sum(r[field] == label for r in rows_a)} for label in labels]


def write_html(train, holdout, synthetic, dest):
    fields = [("Visitor type", "visitor", ["Returning_Visitor", "New_Visitor", "Other"]),
              ("Product pages viewed", "engagement", ["0–5", "6–15", "16–40", "41+"]),
              ("Exit rate band", "exit", ["Low", "Medium", "High"]),
              ("Traffic type", "traffic", ["1", "2", "3", "4", "Other"])]
    sections = [{"title": title, "field": field, "rows": groups(holdout, synthetic, field, labels)}
                for title, field, labels in fields]
    marginals = [{"label": field, "real": [share(holdout, field, v) for v in labels],
                  "synthetic": [share(synthetic, field, v) for v in labels], "values": labels}
                 for _, field, labels in fields]
    max_gap = max(abs(rate(holdout, f, v) - rate(synthetic, f, v))
                  for _, f, labels in fields for v in labels
                  if sum(r[f] == v for r in holdout) >= 30)
    data = {"n_train": len(train), "n_holdout": len(holdout), "n_synthetic": len(synthetic),
            "real_rate": rate(holdout), "synthetic_rate": rate(synthetic),
            "max_gap": max_gap, "sections": sections, "marginals": marginals}
    payload = json.dumps(data).replace("<", "\\u003c")
    page = r'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Digital shopping sessions | Synthetic data study</title>
<style>
:root{font-family:Inter,ui-sans-serif,system-ui,Arial,sans-serif;color:#1d2936;background:#f5f7f9}*{box-sizing:border-box}body{margin:0}main{max-width:1120px;margin:auto;padding:48px 28px 90px}header{border-bottom:1px solid #dce2e7;padding-bottom:25px}.eyebrow{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#557187;font-weight:700}h1{font-size:clamp(29px,4vw,44px);letter-spacing:-.045em;margin:12px 0}h2{font-size:21px;letter-spacing:-.025em;margin:0 0 18px}p{line-height:1.65;color:#4b5b68;max-width:790px}header p{margin-bottom:0}a{color:#146c83}.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:26px 0}.card,.panel{background:white;border:1px solid #e1e7ec;border-radius:8px}.card{padding:20px}.card small{display:block;color:#637586;font-size:12px}.card strong{display:block;font-size:26px;margin:8px 0 2px;letter-spacing:-.04em}.card span{font-size:11px;color:#758695}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.panel{padding:25px;margin-bottom:16px}.legend{font-size:12px;color:#536776;display:flex;gap:20px;margin-bottom:20px}.dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px}.dot.real,.bar.real{background:#173d53}.dot.syn,.bar.syn{background:#62aeb3}.row{margin:17px 0}.line{display:flex;justify-content:space-between;gap:12px;font-size:12px;margin-bottom:6px}.line b{font-weight:600}.line em{font-style:normal;color:#617483}.track{height:7px;background:#edf1f4;border-radius:8px;margin:4px 0}.bar{height:100%;border-radius:8px}.tabs{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0 22px}.tabs button{border:1px solid #ccd7dd;background:white;border-radius:5px;padding:8px 11px;cursor:pointer;color:#304b5c}.tabs button.active{background:#173d53;color:white;border-color:#173d53}.note{background:#edf5f6;border-left:3px solid #65aeb3;padding:15px 17px;font-size:13px;color:#355461;line-height:1.6}.diagram{display:flex;flex-wrap:wrap;gap:7px;align-items:center;margin:22px 0}.diagram span{background:#f0f4f6;border:1px solid #dce6ea;border-radius:5px;padding:9px 12px;font-size:12px}.diagram i{font-style:normal;color:#74919e}.method{font-size:13px}footer{border-top:1px solid #dce2e7;margin-top:26px;padding-top:15px;color:#6b7c89;font-size:12px}@media(max-width:750px){main{padding:25px 16px}.cards,.grid{grid-template-columns:1fr 1fr}}@media(max-width:480px){.cards,.grid{grid-template-columns:1fr}}
</style><main><header><div class="eyebrow">Penrose Particles · Data methods / 01</div><h1>Can synthetic shopping sessions preserve real browsing patterns?</h1><p>A compact Bayesian network generates sessions from a public ecommerce dataset. The comparison below uses a held-out portion of the original data, so the synthetic sample is evaluated against records the model did not fit.</p></header>
<section class="cards" id="cards"></section><section class="grid"><div class="panel"><h2>Purchase rate by segment</h2><div class="tabs" id="tabs"></div><div class="legend"><span><i class="dot real"></i>Held-out real</span><span><i class="dot syn"></i>Synthetic</span></div><div id="segment"></div></div><div class="panel"><h2>Segment proportions</h2><p class="method">How often each segment occurs in each dataset. Select a field on the left.</p><div class="legend"><span><i class="dot real"></i>Held-out real</span><span><i class="dot syn"></i>Synthetic</span></div><div id="marginal"></div></div></section>
<section class="panel"><h2>Generation model</h2><p>Each variable is sampled from a probability table conditioned on its listed parents. Categories are binned before fitting; each conditional outcome receives one smoothing count. The graph encodes a factorization assumption. It does not establish that changing a variable would cause a change in purchases.</p><div class="diagram"><span>Month → Visitor type</span><span>Month → Traffic type</span><span>Visitor + traffic → Product pages</span><span>Product pages + visitor → Exit band</span><span>Product pages + exit + traffic → Purchase</span></div><div class="note">This is a simplified six-variable demonstration. Other source columns are omitted, rare traffic codes are grouped, and every generated session is new. Do not interpret synthetic records as actual customers or use these observational associations as intervention effects.</div></section>
<section class="panel"><h2>Reading the results</h2><p id="finding"></p><p class="method">Reproduce this study with the accompanying Python file. The fixed seed is 2419; 80% of the source rows fit the model and 20% form the holdout. The synthetic dataset has the same number of rows as the holdout. Bars show descriptive rates; tiny groups can move substantially by chance.</p></section>
<footer>Source: C. Sakar and Y. Kastro, <a href="https://archive.ics.uci.edu/dataset/468/online+shoppers+purchasing+intention+dataset">Online Shoppers Purchasing Intention Dataset</a>, UCI Machine Learning Repository, DOI 10.24432/C5F88Q. Source data CC BY 4.0. Original study and synthetic data are distinct.</footer></main>
<script id="study" type="application/json">__DATA__</script><script>
const d=JSON.parse(document.getElementById('study').textContent), pct=x=>x==null?'—':(x*100).toFixed(1)+'%';
document.querySelector('#cards').innerHTML=[['Training sessions',d.n_train.toLocaleString(),'Original data'],['Held-out sessions',d.n_holdout.toLocaleString(),'Original data'],['Synthetic sessions',d.n_synthetic.toLocaleString(),'Generated'],['Purchase rate gap',((d.synthetic_rate-d.real_rate)*100).toFixed(1)+' pp','Synthetic minus holdout']].map(x=>`<div class="card"><small>${x[0]}</small><strong>${x[1]}</strong><span>${x[2]}</span></div>`).join('');
function rows(items,proportion){return items.map(r=>{let label=r.label==='Returning_Visitor'?'Returning':r.label==='New_Visitor'?'New':r.label;let a=proportion?r.real:r.real,b=proportion?r.synthetic:r.synthetic,max=proportion?1:.5;return `<div class="row"><div class="line"><b>${label}</b><em>${pct(a)} · ${pct(b)}${r.n!=null?' · n='+r.n:''}</em></div><div class="track"><div class="bar real" style="width:${Math.min(100,a/max*100)}%"></div></div><div class="track"><div class="bar syn" style="width:${Math.min(100,b/max*100)}%"></div></div></div>`}).join('')}
function select(i){document.querySelectorAll('#tabs button').forEach((b,j)=>b.classList.toggle('active',i===j));document.querySelector('#segment').innerHTML=rows(d.sections[i].rows,false);let m=d.marginals[i];document.querySelector('#marginal').innerHTML=rows(m.values.map((v,j)=>({label:v,real:m.real[j],synthetic:m.synthetic[j]})),true)}
document.querySelector('#tabs').innerHTML=d.sections.map((s,i)=>`<button type="button" data-i="${i}">${s.title}</button>`).join('');document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>select(+b.dataset.i));select(1);
document.querySelector('#finding').textContent=`The held-out purchase rate is ${pct(d.real_rate)}; the synthetic rate is ${pct(d.synthetic_rate)}. Among displayed segments with at least 30 held-out sessions, the largest absolute purchase-rate gap is ${(d.max_gap*100).toFixed(1)} percentage points. Compare both purchase rates and segment proportions: matching the overall total alone is insufficient evidence that the synthetic data retains useful relationships.`;
</script></html>'''
    dest.write_text(page.replace("__DATA__", payload), encoding="utf-8")
    return data


def main():
    source = Path(sys.argv[1])
    with source.open(newline="", encoding="utf-8") as f:
        rows = [transform(x) for x in csv.DictReader(f)]
    RNG.shuffle(rows)
    pivot = int(.8 * len(rows))
    train, holdout = rows[:pivot], rows[pivot:]
    tables, choices = fit(train)
    synthetic = generate(tables, choices, len(holdout))
    folder = Path.cwd()
    with (folder / "synthetic_shopper_sessions.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[n for n, _ in NODES]); writer.writeheader(); writer.writerows(synthetic)
    result = write_html(train, holdout, synthetic, folder / "shopper_synthetic_study.html")
    print(json.dumps({k: v for k, v in result.items() if k not in ("sections", "marginals")}, indent=2))


if __name__ == "__main__":
    main()
