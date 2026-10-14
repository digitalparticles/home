
/*
 PENROSE PARTICLES
 STUDY 08 — THE SYNTHETIC SELF

 Historical data:
 Pew Research Center, June 2026

 Future model:
 Illustrative assumptions only
*/


// ---------------------------------
// 1. HISTORICAL ADOPTION DATA
// ---------------------------------

const adoptionData = {
    years: [2023, 2024, 2025, 2026],

    all: [18, 23, 34, 44],

    young: [33, 43, 58, 61],

    middle: [21, 27, 41, 55],

    older: [13, 17, 25, 37],

    senior: [4, 6, 10, 19]
};


// ---------------------------------
// 2. REUSABLE BAR CHART FUNCTION
// ---------------------------------

function createBarChart(container, labels, values) {

    container.replaceChildren();

    values.forEach((value, index) => {

        const row = document.createElement("div");
        row.className = "bar-row";

        const name = document.createElement("span");
        name.className = "bar-name";
        name.textContent = labels[index];

        const track = document.createElement("div");
        track.className = "bar-track";

        const fill = document.createElement("div");
        fill.className = "bar-fill";
        fill.style.width =
            Math.max(0, Math.min(100, value)) + "%";

        track.appendChild(fill);

        const amount = document.createElement("span");
        amount.className = "bar-value";
        amount.textContent = value.toFixed(1) + "%";

        row.append(name, track, amount);
        container.appendChild(row);

    });

}


// ---------------------------------
// 3. HISTORICAL ADOPTION CHART
// ---------------------------------

const ageSelect = document.getElementById("ageGroup");
const adoptionChart =
    document.getElementById("adoptionChart");

function updateAdoptionChart() {

    const selected = ageSelect.value;

    createBarChart(
        adoptionChart,
        adoptionData.years.map(String),
        adoptionData[selected]
    );

}

ageSelect.addEventListener(
    "change",
    updateAdoptionChart
);

updateAdoptionChart();


// ---------------------------------
// 4. FUTURE SCENARIO MODEL
// ---------------------------------

const growthSlider =
    document.getElementById("growth");

const delegationSlider =
    document.getElementById("delegation");

const yearSelect =
    document.getElementById("year");

const growthValue =
    document.getElementById("growthValue");

const delegationValue =
    document.getElementById("delegationValue");

const adoptionResult =
    document.getElementById("adoptionResult");

const delegationResult =
    document.getElementById("delegationResult");

const scenarioChart =
    document.getElementById("scenarioChart");

const scenarioExplanation =
    document.getElementById("scenarioExplanation");


// The 2026 all-adult ChatGPT estimate
// is the illustrative starting baseline.

const BASE_YEAR = 2026;
const BASE_ADOPTION = 44;


// Model an annual RELATIVE increase, capped at 100%.
// This is not a statistical forecast.

function calculateAdoption(year, annualGrowth) {

    const elapsedYears = year - BASE_YEAR;

    const projected =
        BASE_ADOPTION *
        Math.pow(1 + annualGrowth / 100, elapsedYears);

    return Math.min(100, projected);

}


// Decision delegation is applied only
// to the hypothetical AI-using population.

function calculateDelegation(adoption, share) {

    return adoption * share / 100;

}


function updateScenario() {

    const growth = Number(growthSlider.value);

    const delegation =
        Number(delegationSlider.value);

    const selectedYear =
        Number(yearSelect.value);

    const adoption =
        calculateAdoption(selectedYear, growth);

    const delegated =
        calculateDelegation(adoption, delegation);


    // Update displayed assumptions

    growthValue.textContent = growth + "%";

    delegationValue.textContent =
        delegation + "%";


    // Update results

    adoptionResult.textContent =
        adoption.toFixed(1) + "%";

    delegationResult.textContent =
        delegated.toFixed(1) + "%";


    // Visualize shares of ALL adults

    createBarChart(
        scenarioChart,
        [
            "AI users",
            "Delegating"
        ],
        [
            adoption,
            delegated
        ]
    );


    // Explain the illustrative results

    scenarioExplanation.textContent =
        "Under these assumptions, " +
        adoption.toFixed(1) +
        "% of adults would use AI in " +
        selectedYear +
        ", and " +
        delegated.toFixed(1) +
        "% of all adults would delegate decisions. " +
        "These are calculated scenarios, " +
        "not observed outcomes or predictions.";

}


// ---------------------------------
// 5. USER INTERACTIONS
// ---------------------------------

growthSlider.addEventListener(
    "input",
    updateScenario
);

delegationSlider.addEventListener(
    "input",
    updateScenario
);

yearSelect.addEventListener(
    "change",
    updateScenario
);


// ---------------------------------
// 6. RESET BUTTON
// ---------------------------------

document.getElementById(
    "resetScenario"
).addEventListener("click", () => {

    growthSlider.value = 5;
    delegationSlider.value = 30;
    yearSelect.value = "2036";

    updateScenario();

});


// ---------------------------------
// 7. INITIAL RENDER
// ---------------------------------

updateScenario();
