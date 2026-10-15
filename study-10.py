
"""
Study 10 — The Resignation Equation
Penrose Particles

Dataset:
IBM HR Analytics Employee Attrition & Performance

Download:
https://www.kaggle.com/datasets/pavansubhasht/ibm-hr-analytics-attrition-dataset

Required CSV filename:
WA_Fn-UseC_-HR-Employee-Attrition.csv

Install:
pip install pandas scikit-learn

Run:
python study-10-analysis.py

Important:
The IBM dataset is fictional.
This analysis is educational and should not be
used for real employment decisions.
"""

from pathlib import Path
import json

import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    roc_auc_score,
    brier_score_loss,
    classification_report
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


# FILE LOCATION

BASE = Path(__file__).resolve().parent

source = BASE / "WA_Fn-UseC_-HR-Employee-Attrition.csv"

if not source.exists():
    raise SystemExit(
        f"Missing CSV: {source}\n"
        "Download it from the Kaggle URL above."
    )


# LOAD DATA

df = pd.read_csv(source)

features = [
    "OverTime",
    "JobSatisfaction",
    "MonthlyIncome",
    "YearsAtCompany"
]

required = features + ["Attrition"]

missing = [
    name for name in required
    if name not in df.columns
]

if missing:
    raise ValueError(f"Missing columns: {missing}")


# CLEAN DATA

df = df[required].dropna().copy()

df = df[df["Attrition"].isin(["Yes", "No"])]

y = (df["Attrition"] == "Yes").astype(int)

X = df[features]


# EXPLORATORY ANALYSIS

print("Rows:", len(df))

print(
    "Attrition (Yes):",
    int(y.sum()),
    "Rate:",
    round(y.mean(), 4)
)

print("\nAttrition rate by overtime:")

print(
    df.assign(Left=y)
      .groupby("OverTime")["Left"]
      .agg(["count", "mean"])
)

print("\nAttrition rate by satisfaction:")

print(
    df.assign(Left=y)
      .groupby("JobSatisfaction")["Left"]
      .agg(["count", "mean"])
)


# TRAIN / TEST SPLIT

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.25,
    random_state=42,
    stratify=y
)


# PREPROCESSING

prep = ColumnTransformer([

    (
        "overtime",
        OneHotEncoder(
            categories=[["No", "Yes"]],
            drop="first",
            handle_unknown="ignore"
        ),
        ["OverTime"]
    ),

    (
        "numeric",
        StandardScaler(),
        [
            "JobSatisfaction",
            "MonthlyIncome",
            "YearsAtCompany"
        ]
    )

])


# MODEL

model = Pipeline([

    ("prep", prep),

    (
        "logit",
        LogisticRegression(max_iter=2000)
    )

])


# TRAIN

model.fit(X_train, y_train)


# TEST SET PREDICTIONS

prob = model.predict_proba(X_test)[:, 1]


# EVALUATION

auc = roc_auc_score(y_test, prob)

brier = brier_score_loss(y_test, prob)

print("\nHoldout ROC AUC:", round(auc, 3))

print("Holdout Brier score:", round(brier, 3))

print(
    classification_report(
        y_test,
        prob >= 0.5,
        zero_division=0
    )
)


# EXTRACT COEFFICIENTS

coeff = model.named_steps["logit"].coef_[0]

scaler = (
    model.named_steps["prep"]
    .named_transformers_["numeric"]
)

raw_num = coeff[1:] / scaler.scale_

intercept = float(
    model.named_steps["logit"].intercept_[0]
    - (raw_num * scaler.mean_).sum()
)


# EXPORT MODEL RESULTS

result = {

    "source": "IBM HR Analytics — fictional employee dataset",

    "rows": int(len(df)),

    "train_rows": int(len(X_train)),

    "test_rows": int(len(X_test)),

    "positive_rate": float(y.mean()),

    "roc_auc_test": float(auc),

    "brier_test": float(brier),

    "formula": (
        "sigmoid(intercept + overtime_yes*OverTimeYes "
        "+ satisfaction*JobSatisfaction "
        "+ income*MonthlyIncome "
        "+ tenure*YearsAtCompany)"
    ),

    "intercept": intercept,

    "coefficients": {

        "overtime_yes": float(coeff[0]),

        "satisfaction": float(raw_num[0]),

        "income": float(raw_num[1]),

        "tenure": float(raw_num[2])

    },

    "caution": (
        "Fitted to fictional data; "
        "not suitable for employment decisions."
    )

}


# SAVE JSON FILE

output = BASE / "study-10-model.json"

output.write_text(
    json.dumps(result, indent=2),
    encoding="utf-8"
)

print("Wrote", output)
