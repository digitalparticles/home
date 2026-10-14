
"""
PENROSE PARTICLES
STUDY 07 — THE AI TRUST PARADOX

Descriptive analysis only.
"""

import sys
import pandas as pd


# --------------------------------
# 1. LOADING MY DATA
# --------------------------------

if len(sys.argv) != 2:
    raise SystemExit(
        "Usage: python study-7.py source.csv"
    )

df = pd.read_csv(
    sys.argv[1],
    dtype=str,
    keep_default_na=False,
    encoding="utf-8-sig"
)

if len(df) != 1493:
    print(
        f"Warning: Expected 1,493 complete "
        f"Edition 2 records; found {len(df):,}."
    )


# --------------------------------
# 2. IDENTIFY SURVEY QUESTIONS
# --------------------------------

def field(number):

    matches = [
        c for c in df
        if c.lstrip().startswith(str(number) + ".")
    ]

    if len(matches) != 1:
        raise ValueError(
            f"Expected one column for Q{number}, "
            f"found {len(matches)}: {matches[:4]}"
        )

    return matches[0]


# --------------------------------
# 3. DEFINE CONSUMER GROUPS
# --------------------------------

online = (
    df[field(2)].str.strip()
    != "I shop only in physical stores"
)

ai = (
    df[field(12)]
    .str.strip()
    .str.casefold()
    == "yes"
)

trend_ai = online & ai

q13 = (
    df[field(13)]
    .str.strip()
    .str.casefold()
)

verification = q13.isin([
    "yes - always",
    "yes - sometimes"
])


# --------------------------------
# 4. REPORT SAMPLE SIZES
# --------------------------------

print(f"Full sample: {len(df)}")
print(f"Online shopper base: {online.sum()}")
print(f"AI shoppers (full): {ai.sum()}")
print(f"AI shoppers (online only): {trend_ai.sum()}")


# --------------------------------
# 5. PERCENTAGE HELPER
# --------------------------------

def pct(a, b):
    return f"{100 * a / b:.1f}%" if b else "N/A"


# --------------------------------
# 6. AI USE AND VERIFICATION
# --------------------------------

print(
    "AI use among online shoppers:",
    pct(trend_ai.sum(), online.sum())
)

print(
    "Verification among online AI users:",
    pct(
        (trend_ai & verification).sum(),
        trend_ai.sum()
    )
)

print(
    "Always verify among online AI users:",
    pct(
        (
            trend_ai &
            q13.eq("yes - always")
        ).sum(),
        trend_ai.sum()
    )
)


# --------------------------------
# 7. PURCHASE AUTONOMY
# --------------------------------

questions = [
    (
        44,
        "AI completed purchase",
        "yes"
    ),
    (
        37,
        "Zero unsupervised spend",
        "nothing"
    ),
    (
        38,
        "Refuses agent payment access",
        "no"
    )
]

for q, label, positive in questions:

    values = (
        df[field(q)]
        .str.strip()
        .str.casefold()
    )

    print(
        label + ":",
        pct(
            (ai & values.eq(positive)).sum(),
            ai.sum()
        )
    )


# --------------------------------
# 8. THE TRUST PARADOX
# --------------------------------

completed = (
    df[field(44)]
    .str.strip()
    .str.casefold()
    .eq("yes")
)

groups = [
    "yes - always",
    "yes - sometimes",
    "no"
]

for group in groups:

    mask = ai & q13.eq(group)

    if mask.sum():

        result = pct(
            (mask & completed).sum(),
            mask.sum()
        )

        print(
            f"Completed purchase / verification "
            f"group [{group}] "
            f"(n={mask.sum()}):",
            result
        )
