from pathlib import Path

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import plotly.express as px



# This makes paths work automatically from VS Code
HOME_DIR = Path(__file__).resolve().parent
DATA_DIR = HOME_DIR / "data"

INPUT_FILE = DATA_DIR / "Demographics_Study.xlsx"
PNG_OUTPUT = DATA_DIR / "regression_states_dots.png"
HTML_OUTPUT = HOME_DIR / "regression_states_dots.html"

# Check file exists
if not INPUT_FILE.exists():
    raise FileNotFoundError(f"Could not find Excel file here: {INPUT_FILE}")

# Load spreadsheet
df = pd.read_excel(INPUT_FILE)
df.columns = df.columns.str.strip()

# Your State column already has abbreviations
df["State_Code"] = df["State"].astype(str)

# Create regression variables
df["young_percent_2025"] = (df["Young_2025"] / df["Total _2025"]) * 100

df["population_growth_percent"] = (
    (df["Total _2025"] - df["Total _2024"]) / df["Total _2024"]
) * 100

x = df["young_percent_2025"]
y = df["population_growth_percent"]

# Regression
slope, intercept = np.polyfit(x, y, 1)

print("Regression formula:")
print(f"population_growth_percent = {intercept:.4f} + {slope:.4f} * young_percent_2025")

x_line = np.linspace(x.min(), x.max(), 100)
y_line = intercept + slope * x_line

df["predicted_growth"] = intercept + slope * df["young_percent_2025"]

# Save PNG scatterplot
plt.figure(figsize=(12, 8))

plt.scatter(
    df["young_percent_2025"],
    df["population_growth_percent"],
    color="blue",
    alpha=0.75
)

for _, row in df.iterrows():
    plt.text(
        row["young_percent_2025"] + 0.05,
        row["population_growth_percent"] + 0.02,
        row["State_Code"],
        fontsize=9
    )

plt.plot(
    x_line,
    y_line,
    color="black",
    linewidth=2,
    label="Regression line"
)

plt.title("Regression: Young Population Percentage vs Population Growth")
plt.xlabel("Young Population Percentage in 2025")
plt.ylabel("Population Growth Percentage, 2024 to 2025")
plt.grid(True, alpha=0.3)
plt.legend()

plt.savefig(PNG_OUTPUT, dpi=300, bbox_inches="tight")
print(f"Saved PNG: {PNG_OUTPUT}")

# Save HTML scatterplot
fig = px.scatter(
    df,
    x="young_percent_2025",
    y="population_growth_percent",
    text="State_Code",
    hover_name="State",
    hover_data={
        "young_percent_2025": ":.2f",
        "population_growth_percent": ":.2f",
        "predicted_growth": ":.2f",
    },
    title="Regression: Young Population Percentage vs Population Growth"
)

fig.add_scatter(
    x=x_line,
    y=y_line,
    mode="lines",
    name="Regression line",
    line=dict(color="black")
)

fig.update_traces(textposition="top right")

fig.update_layout(
    xaxis_title="Young Population Percentage in 2025",
    yaxis_title="Population Growth Percentage, 2024 to 2025"
)

fig.write_html(HTML_OUTPUT)
print(f"Saved HTML: {HTML_OUTPUT}")

# Show graph in VS Code
plt.show()
