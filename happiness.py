from pathlib import Path

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import pearsonr

HOME_DIR = Path(__file__).resolve().parent
DATA_DIR = HOME_DIR / "data"
IMAGES_DIR = HOME_DIR / "imagesFromStudies"

INPUT_FILE = DATA_DIR / "WHR26_Data_Figure_2.1.xlsx"

FREEDOM_OUTPUT = IMAGES_DIR / "freedom_vs_happiness.png"
GDP_OUTPUT = IMAGES_DIR / "gdp_vs_happiness.png"
FACTORS_OUTPUT = IMAGES_DIR / "happiness_factors.png"

IMAGES_DIR.mkdir(exist_ok=True)

if not INPUT_FILE.exists():
    raise FileNotFoundError(f"Could not find Excel file here: {INPUT_FILE}")

df = pd.read_excel(INPUT_FILE)

happiness = "Life evaluation (3-year average)"

# Freedom vs Happiness
freedom = "Explained by: Freedom to make life choices"
data = df[[freedom, happiness]].dropna()

corr, p_value = pearsonr(data[freedom], data[happiness])
print("Freedom vs Happiness")
print(f"Correlation: {corr:.3f}")
print(f"P-value: {p_value:.6f}")

plt.figure(figsize=(8, 6))
plt.scatter(data[freedom], data[happiness], color="#4A90E2", alpha=0.7)

z = np.polyfit(data[freedom], data[happiness], 1)
p = np.poly1d(z)
plt.plot(data[freedom], p(data[freedom]), color="#083D77", linewidth=3)

plt.xlabel("Freedom to Make Life Choices")
plt.ylabel("Happiness Score")
plt.title("Freedom vs Happiness")
plt.grid(alpha=0.2)
plt.tight_layout()
plt.savefig(FREEDOM_OUTPUT, dpi=300, bbox_inches="tight")
plt.close()

# GDP vs Happiness
gdp = "Explained by: Log GDP per capita"
data = df[[gdp, happiness]].dropna()

corr, p_value = pearsonr(data[gdp], data[happiness])
print("GDP per Capita vs Happiness")
print(f"Correlation: {corr:.3f}")
print(f"P-value: {p_value:.6f}")

plt.figure(figsize=(8, 6))
plt.scatter(data[gdp], data[happiness], color="#4A90E2", alpha=0.7)

z = np.polyfit(data[gdp], data[happiness], 1)
p = np.poly1d(z)
plt.plot(data[gdp], p(data[gdp]), color="#083D77", linewidth=3)

plt.xlabel("Log GDP per Capita")
plt.ylabel("Happiness Score")
plt.title("GDP per Capita vs Happiness")
plt.grid(alpha=0.2)
plt.tight_layout()
plt.savefig(GDP_OUTPUT, dpi=300, bbox_inches="tight")
plt.close()

# All factors
factors = {
    "GDP per Capita": "Explained by: Log GDP per capita",
    "Social Support": "Explained by: Social support",
    "Life Expectancy": "Explained by: Healthy life expectancy",
    "Freedom": "Explained by: Freedom to make life choices",
    "Generosity": "Explained by: Generosity",
    "Corruption": "Explained by: Perceptions of corruption"
}

results = []

for name, col in factors.items():
    data = df[[col, happiness]].dropna()
    corr, _ = pearsonr(data[col], data[happiness])
    results.append([name, corr])

result_df = pd.DataFrame(results, columns=["Factor", "Correlation"]).sort_values("Correlation")

print(result_df)

colors = plt.cm.Blues(
    0.3 + 0.7 * (result_df["Correlation"] / result_df["Correlation"].max())
)

plt.figure(figsize=(10, 6))
bars = plt.barh(result_df["Factor"], result_df["Correlation"], color=colors)

for bar in bars:
    plt.text(
        bar.get_width() + 0.01,
        bar.get_y() + bar.get_height() / 2,
        f"{bar.get_width():.3f}",
        va="center",
        fontsize=10
    )

plt.title("Factors Most Strongly Associated with Happiness", fontsize=16, fontweight="bold")
plt.xlabel("Correlation with Happiness")
plt.xlim(0, 1)
plt.grid(axis="x", alpha=0.15)
plt.tight_layout()
plt.savefig(FACTORS_OUTPUT, dpi=300, bbox_inches="tight")
plt.close()

print(f"Saved: {FREEDOM_OUTPUT}")
print(f"Saved: {GDP_OUTPUT}")
print(f"Saved: {FACTORS_OUTPUT}")