# ============================================================
# PENROSE PARTICLES
# STUDY 6 — CAN YOU TELL WHICH CUSTOMER IS FAKE?
#
# Synthetic customer behaviour using a Bayesian Network
# ============================================================

import json
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, roc_auc_score


# ------------------------------------------------------------
# 1. SETTINGS
# ------------------------------------------------------------

RANDOM_STATE = 42
np.random.seed(RANDOM_STATE)

DATA_FILE = "data/online_shoppers_intention.csv"
OUTPUT_FILE = "study-6-results.json"


# ------------------------------------------------------------
# 2. LOAD REAL DATA
# ------------------------------------------------------------

df = pd.read_csv(DATA_FILE)

print("Real dataset loaded.")
print("Rows:", len(df))
print("Columns:", len(df.columns))


# ------------------------------------------------------------
# 3. SELECT VARIABLES
# ------------------------------------------------------------
#
# We deliberately use a smaller group of variables so the
# resulting model remains understandable.
#
# ProductRelated          = number of product pages visited
# ProductRelated_Duration = time spent on product pages
# BounceRates             = session bounce rate
# ExitRates               = session exit rate
# PageValues              = estimated value of pages visited
# Month                   = month of session
# TrafficType             = traffic source category
# VisitorType             = returning/new visitor
# Weekend                 = whether visit occurred on weekend
# Revenue                 = whether session resulted in purchase
# ------------------------------------------------------------

columns = [
    "ProductRelated",
    "ProductRelated_Duration",
    "BounceRates",
    "ExitRates",
    "PageValues",
    "Month",
    "TrafficType",
    "VisitorType",
    "Weekend",
    "Revenue"
]

real = df[columns].copy()


# ------------------------------------------------------------
# 4. CLEAN DATA
# ------------------------------------------------------------

real["Weekend"] = real["Weekend"].astype(bool)
real["Revenue"] = real["Revenue"].astype(bool)

real = real.dropna().reset_index(drop=True)

print("Rows after cleaning:", len(real))


# ------------------------------------------------------------
# 5. CREATE DISCRETE BEHAVIOURAL STATES
# ------------------------------------------------------------
#
# Bayesian networks work naturally with conditional
# probabilities. Continuous variables are therefore grouped
# into behavioural categories.
# ------------------------------------------------------------

real["PagesGroup"] = pd.cut(
    real["ProductRelated"],
    bins=[-1, 5, 15, 40, np.inf],
    labels=["Very Low", "Low", "Medium", "High"]
)

real["DurationGroup"] = pd.cut(
    real["ProductRelated_Duration"],
    bins=[-1, 300, 1000, 3000, np.inf],
    labels=["Short", "Medium", "Long", "Very Long"]
)

real["BounceGroup"] = pd.cut(
    real["BounceRates"],
    bins=[-0.001, 0.01, 0.05, 0.10, np.inf],
    labels=["Very Low", "Low", "Medium", "High"]
)

real["ExitGroup"] = pd.cut(
    real["ExitRates"],
    bins=[-0.001, 0.02, 0.05, 0.10, np.inf],
    labels=["Very Low", "Low", "Medium", "High"]
)

real["ValueGroup"] = pd.cut(
    real["PageValues"],
    bins=[-0.001, 0.01, 5, 20, np.inf],
    labels=["None", "Low", "Medium", "High"]
)


# ------------------------------------------------------------
# 6. HELPER FUNCTION
# ------------------------------------------------------------

def sample_from_distribution(series):
    """
    Sample one value according to the observed probability
    distribution in a pandas Series.
    """

    probabilities = series.value_counts(normalize=True)

    return np.random.choice(
        probabilities.index,
        p=probabilities.values
    )


# ------------------------------------------------------------
# 7. GENERATE SYNTHETIC CUSTOMERS
# ------------------------------------------------------------
#
# Simplified Bayesian dependency structure:
#
# Month ───────────────┐
#                     ↓
# VisitorType → PagesGroup
#                     ↓
#               DurationGroup
#                     ↓
#                 ExitGroup
#                     ↓
#                 Revenue
#
# TrafficType ─────────┘
#
# Revenue also depends on engagement/value information.
#
# IMPORTANT:
# These arrows represent probabilistic dependencies used for
# simulation. They should not automatically be interpreted
# as proven causal relationships.
# ------------------------------------------------------------

synthetic_rows = []

n_synthetic = len(real)

for i in range(n_synthetic):

    # Root variables
    month = sample_from_distribution(real["Month"])
    visitor = sample_from_distribution(real["VisitorType"])
    traffic = sample_from_distribution(real["TrafficType"])
    weekend = sample_from_distribution(real["Weekend"])

    # --------------------------------------------------------
    # Pages visited conditional on visitor type
    # --------------------------------------------------------

    subset = real[
        real["VisitorType"] == visitor
    ]

    pages_group = sample_from_distribution(
        subset["PagesGroup"]
    )

    # --------------------------------------------------------
    # Duration conditional on page activity
    # --------------------------------------------------------

    subset = real[
        real["PagesGroup"] == pages_group
    ]

    duration_group = sample_from_distribution(
        subset["DurationGroup"]
    )

    # --------------------------------------------------------
    # Bounce behaviour conditional on engagement
    # --------------------------------------------------------

    subset = real[
        (real["PagesGroup"] == pages_group) &
        (real["DurationGroup"] == duration_group)
    ]

    if len(subset) < 10:
        subset = real

    bounce_group = sample_from_distribution(
        subset["BounceGroup"]
    )

    # --------------------------------------------------------
    # Exit behaviour conditional on bounce behaviour
    # --------------------------------------------------------

    subset = real[
        real["BounceGroup"] == bounce_group
    ]

    exit_group = sample_from_distribution(
        subset["ExitGroup"]
    )

    # --------------------------------------------------------
    # Page value conditional on engagement
    # --------------------------------------------------------

    subset = real[
        (real["PagesGroup"] == pages_group) &
        (real["DurationGroup"] == duration_group)
    ]

    if len(subset) < 10:
        subset = real

    value_group = sample_from_distribution(
        subset["ValueGroup"]
    )

    # --------------------------------------------------------
    # Purchase conditional on several behavioural variables
    # --------------------------------------------------------

    subset = real[
        (real["VisitorType"] == visitor) &
        (real["PagesGroup"] == pages_group) &
        (real["ValueGroup"] == value_group)
    ]

    if len(subset) < 20:
        subset = real[
            (real["PagesGroup"] == pages_group) &
            (real["ValueGroup"] == value_group)
        ]

    if len(subset) < 20:
        subset = real

    revenue = sample_from_distribution(
        subset["Revenue"]
    )

    synthetic_rows.append({
        "Month": month,
        "VisitorType": visitor,
        "TrafficType": traffic,
        "Weekend": weekend,
        "PagesGroup": pages_group,
        "DurationGroup": duration_group,
        "BounceGroup": bounce_group,
        "ExitGroup": exit_group,
        "ValueGroup": value_group,
        "Revenue": revenue
    })


synthetic = pd.DataFrame(synthetic_rows)

print("Synthetic customers generated:", len(synthetic))


# ------------------------------------------------------------
# 8. PREPARE REAL DATA FOR COMPARISON
# ------------------------------------------------------------

comparison_columns = [
    "Month",
    "VisitorType",
    "TrafficType",
    "Weekend",
    "PagesGroup",
    "DurationGroup",
    "BounceGroup",
    "ExitGroup",
    "ValueGroup",
    "Revenue"
]

real_model = real[comparison_columns].copy()

real_model["Dataset"] = 0
synthetic["Dataset"] = 1


# ------------------------------------------------------------
# 9. MIX REAL + SYNTHETIC DATA
# ------------------------------------------------------------

combined = pd.concat(
    [real_model, synthetic],
    ignore_index=True
)

X = combined.drop(columns=["Dataset"])
y = combined["Dataset"]


# ------------------------------------------------------------
# 10. CLASSIFIER
# ------------------------------------------------------------
#
# The classifier's job is unusual:
#
# 0 = REAL
# 1 = SYNTHETIC
#
# If the datasets are very similar, distinguishing them should
# be difficult.
# ------------------------------------------------------------

categorical_features = list(X.columns)

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_features
        )
    ]
)

classifier = RandomForestClassifier(
    n_estimators=300,
    max_depth=8,
    random_state=RANDOM_STATE,
    n_jobs=-1
)

model = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", classifier)
])


# ------------------------------------------------------------
# 11. TRAIN / TEST SPLIT
# ------------------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.30,
    random_state=RANDOM_STATE,
    stratify=y
)

model.fit(X_train, y_train)


# ------------------------------------------------------------
# 12. TEST CLASSIFIER
# ------------------------------------------------------------

predictions = model.predict(X_test)

probabilities = model.predict_proba(X_test)[:, 1]

accuracy = accuracy_score(
    y_test,
    predictions
)

auc = roc_auc_score(
    y_test,
    probabilities
)

print()
print("REAL VS SYNTHETIC CLASSIFIER")
print("----------------------------")
print("Accuracy:", round(accuracy, 4))
print("ROC AUC:", round(auc, 4))


# ------------------------------------------------------------
# 13. PURCHASE RATE COMPARISON
# ------------------------------------------------------------

real_purchase_rate = (
    real_model["Revenue"].mean() * 100
)

synthetic_purchase_rate = (
    synthetic["Revenue"].mean() * 100
)


# ------------------------------------------------------------
# 14. RETURNING VISITOR COMPARISON
# ------------------------------------------------------------

real_returning = (
    (real_model["VisitorType"] == "Returning_Visitor")
    .mean() * 100
)

synthetic_returning = (
    (synthetic["VisitorType"] == "Returning_Visitor")
    .mean() * 100
)


# ------------------------------------------------------------
# 15. WEEKEND COMPARISON
# ------------------------------------------------------------

real_weekend = (
    real_model["Weekend"].mean() * 100
)

synthetic_weekend = (
    synthetic["Weekend"].mean() * 100
)


# ------------------------------------------------------------
# 16. DISTRIBUTION SIMILARITY
# ------------------------------------------------------------

def distribution_distance(real_series, synthetic_series):
    """
    Total Variation Distance.

    0 means distributions are identical.
    1 means completely different.
    """

    real_dist = real_series.value_counts(normalize=True)
    synth_dist = synthetic_series.value_counts(normalize=True)

    categories = set(real_dist.index).union(
        set(synth_dist.index)
    )

    distance = 0

    for category in categories:

        real_probability = real_dist.get(category, 0)
        synth_probability = synth_dist.get(category, 0)

        distance += abs(
            real_probability -
            synth_probability
        )

    return distance / 2


variables_to_compare = [
    "Month",
    "VisitorType",
    "TrafficType",
    "Weekend",
    "PagesGroup",
    "DurationGroup",
    "BounceGroup",
    "ExitGroup",
    "ValueGroup",
    "Revenue"
]

similarity_results = {}

for variable in variables_to_compare:

    distance = distribution_distance(
        real_model[variable],
        synthetic[variable]
    )

    similarity = (1 - distance) * 100

    similarity_results[variable] = round(
        similarity,
        2
    )


average_similarity = np.mean(
    list(similarity_results.values())
)


# ------------------------------------------------------------
# 17. PURCHASE BY VISITOR TYPE
# ------------------------------------------------------------

real_purchase_by_visitor = (
    real_model
    .groupby("VisitorType", observed=False)["Revenue"]
    .mean()
    .mul(100)
    .round(2)
    .to_dict()
)

synthetic_purchase_by_visitor = (
    synthetic
    .groupby("VisitorType", observed=False)["Revenue"]
    .mean()
    .mul(100)
    .round(2)
    .to_dict()
)


# ------------------------------------------------------------
# 18. FEATURE IMPORTANCE
# ------------------------------------------------------------

encoder = (
    model
    .named_steps["preprocessor"]
    .named_transformers_["categorical"]
)

feature_names = encoder.get_feature_names_out(
    categorical_features
)

importances = (
    model
    .named_steps["classifier"]
    .feature_importances_
)

importance_df = pd.DataFrame({
    "feature": feature_names,
    "importance": importances
})

importance_df = (
    importance_df
    .sort_values(
        "importance",
        ascending=False
    )
    .head(8)
)

feature_importance = []

for _, row in importance_df.iterrows():

    feature_importance.append({
        "feature": row["feature"],
        "importance": round(
            float(row["importance"] * 100),
            2
        )
    })


# ------------------------------------------------------------
# 19. INTERPRET CLASSIFIER RESULT
# ------------------------------------------------------------

if accuracy < 0.55:

    classifier_interpretation = (
        "The classifier performed close to random guessing. "
        "For the variables tested, real and synthetic sessions "
        "were difficult to distinguish."
    )

elif accuracy < 0.70:

    classifier_interpretation = (
        "The classifier detected some differences between the "
        "real and synthetic sessions, although the two datasets "
        "still shared substantial statistical structure."
    )

else:

    classifier_interpretation = (
        "The classifier could distinguish the synthetic sessions "
        "from real sessions relatively well. This suggests that "
        "important parts of the real data distribution were not "
        "fully reproduced."
    )


# ------------------------------------------------------------
# 20. EXPORT RESULTS FOR WEBSITE
# ------------------------------------------------------------

results = {

    "study": {
        "title": "Can You Tell Which Customer Is Fake?",
        "real_rows": int(len(real_model)),
        "synthetic_rows": int(len(synthetic)),
        "random_state": RANDOM_STATE
    },

    "classifier": {
        "accuracy": round(
            float(accuracy * 100),
            2
        ),
        "roc_auc": round(
            float(auc),
            3
        ),
        "interpretation": classifier_interpretation
    },

    "similarity": {
        "average": round(
            float(average_similarity),
            2
        ),
        "variables": similarity_results
    },

    "purchase": {
        "real": round(
            float(real_purchase_rate),
            2
        ),
        "synthetic": round(
            float(synthetic_purchase_rate),
            2
        )
    },

    "returning_visitors": {
        "real": round(
            float(real_returning),
            2
        ),
        "synthetic": round(
            float(synthetic_returning),
            2
        )
    },

    "weekend": {
        "real": round(
            float(real_weekend),
            2
        ),
        "synthetic": round(
            float(synthetic_weekend),
            2
        )
    },

    "purchase_by_visitor": {
        "real": real_purchase_by_visitor,
        "synthetic": synthetic_purchase_by_visitor
    },

    "feature_importance": feature_importance
}


with open(
    OUTPUT_FILE,
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        results,
        file,
        indent=4
    )


print()
print("Study complete.")
print("Results exported to:", OUTPUT_FILE)