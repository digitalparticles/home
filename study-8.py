
"""
PENROSE PARTICLES
STUDY 08 — THE SYNTHETIC SELF

Research:
AI adoption and future decision delegation.

Data:
Pew Research Center, June 2026.
Product.ai, June 2026.

This script:
1. Reproduces historical adoption tables.
2. Calculates observed percentage-point changes.
3. Generates illustrative future scenarios.
4. Exports results as CSV files.

No respondent-level dataset is claimed.
Future scenarios are NOT forecasts.
"""

import csv
from pathlib import Path


# ------------------------------------
# 1. CONFIGURATION
# ------------------------------------

OUTPUT = Path("study-8-output")
OUTPUT.mkdir(exist_ok=True)

BASE_YEAR = 2026
BASE_ADOPTION = 44.0


# ------------------------------------
# 2. REAL HISTORICAL DATA
# ------------------------------------

# Source:
# Pew Research Center
# Americans and AI 2026, detailed tables
#
# Share of U.S. adults who ever use ChatGPT.
# Survey wording changed in 2026.

adoption = {
    "All adults": {
        2023: 18,
        2024: 23,
        2025: 34,
        2026: 44
    },
    "Ages 18-29": {
        2023: 33,
        2024: 43,
        2025: 58,
        2026: 61
    },
    "Ages 30-49": {
        2023: 21,
        2024: 27,
        2025: 41,
        2026: 55
    },
    "Ages 50-64": {
        2023: 13,
        2024: 17,
        2025: 25,
        2026: 37
    },
    "Ages 65+": {
        2023: 4,
        2024: 6,
        2025: 10,
        2026: 19
    }
}


# ------------------------------------
# 3. SAVE HISTORICAL DATA
# ------------------------------------

historical_rows = []

for group, observations in adoption.items():

    for year, value in observations.items():

        historical_rows.append({
            "age_group": group,
            "year": year,
            "usage_percent": value,
            "data_type": "observed_survey_estimate"
        })


def save_csv(filename, rows):

    if not rows:
        return

    destination = OUTPUT / filename

    with destination.open(
        "w",
        newline="",
        encoding="utf-8"
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=list(rows[0].keys())
        )

        writer.writeheader()
        writer.writerows(rows)

    print(f"Saved: {destination}")


save_csv(
    "historical_adoption.csv",
    historical_rows
)


# ------------------------------------
# 4. HISTORICAL CHANGE
# ------------------------------------

print("\nHISTORICAL ADOPTION")
print("-" * 55)

change_rows = []

for group, observations in adoption.items():

    start = observations[2023]
    end = observations[2026]

    difference = end - start

    relative_change = (
        (end - start) / start * 100
        if start > 0
        else None
    )

    print(
        f"{group:15} "
        f"{start:5.1f}% -> {end:5.1f}% "
        f"Change: {difference:+.1f} pp"
    )

    change_rows.append({
        "age_group": group,
        "start_year": 2023,
        "end_year": 2026,
        "start_percent": start,
        "end_percent": end,
        "percentage_point_change": difference,
        "relative_percent_change": round(
            relative_change, 2
        ) if relative_change is not None else "",
        "caution":
            "Question wording changed in 2026"
    })


save_csv(
    "adoption_changes.csv",
    change_rows
)


# ------------------------------------
# 5. CONSUMER TRUST DATA
# ------------------------------------

# Product.ai, Trust in AI Commerce Report
# April 2026 survey
# n = 623 AI product research users.
#
# Published figures rounded.

trust_data = [
    {
        "behavior": "Always verify",
        "percent": 45
    },
    {
        "behavior": "Sometimes verify",
        "percent": 41
    },
    {
        "behavior": "Do not verify",
        "percent": 14
    }
]

trust_rows = []

for item in trust_data:

    trust_rows.append({
        "behavior": item["behavior"],
        "percent": item["percent"],
        "sample_base": 623,
        "data_type": "published_rounded_aggregate"
    })


save_csv(
    "consumer_trust.csv",
    trust_rows
)


# ------------------------------------
# 6. FUTURE SCENARIO ASSUMPTIONS
# ------------------------------------

# These rates are intentionally chosen
# assumptions, NOT measured future growth.

scenarios = {
    "Low": {
        "annual_growth": 2,
        "delegation_share": 15
    },
    "Medium": {
        "annual_growth": 5,
        "delegation_share": 30
    },
    "High": {
        "annual_growth": 9,
        "delegation_share": 50
    }
}


# ------------------------------------
# 7. FUTURE MODEL
# ------------------------------------

def project_adoption(year, growth):

    years_elapsed = year - BASE_YEAR

    result = BASE_ADOPTION * (
        (1 + growth / 100) ** years_elapsed
    )

    return min(result, 100.0)


def project_delegation(
    adoption_percent,
    delegation_share
):

    return (
        adoption_percent *
        delegation_share / 100
    )


future_rows = []

for scenario_name, parameters in scenarios.items():

    growth = parameters["annual_growth"]

    share = parameters["delegation_share"]

    for year in range(2027, 2037):

        adoption_percent = project_adoption(
            year,
            growth
        )

        delegation_percent = project_delegation(
            adoption_percent,
            share
        )

        future_rows.append({
            "scenario": scenario_name,
            "year": year,
            "annual_growth_assumption": growth,
            "delegation_share_assumption": share,
            "ai_adoption_percent": round(
                adoption_percent, 2
            ),
            "delegating_all_adults_percent": round(
                delegation_percent, 2
            ),
            "data_type": "hypothetical_scenario"
        })


save_csv(
    "future_scenarios.csv",
    future_rows
)


# ------------------------------------
# 8. SCENARIO SUMMARY
# ------------------------------------

print("\nILLUSTRATIVE 2036 SCENARIOS")
print("-" * 55)

for row in future_rows:

    if row["year"] != 2036:
        continue

    print(
        f"{row['scenario']:8} | "
        f"AI adoption: "
        f"{row['ai_adoption_percent']:5.1f}% | "
        f"Delegating: "
        f"{row['delegating_all_adults_percent']:5.1f}%"
    )


# ------------------------------------
# 9. LIMITATIONS
# ------------------------------------

print("\nMETHODOLOGICAL NOTES")
print("-" * 55)

print(
    "1. Pew survey wording changed in 2026."
)

print(
    "2. Product.ai estimates use a different "
    "population and sample."
)

print(
    "3. Future rates are illustrative assumptions."
)

print(
    "4. These scenarios do not measure "
    "psychological dependency or causality."
)

print(
    "5. The trust experiment is referenced "
    "but not analyzed in this script."
)

print("\nAnalysis complete.")
