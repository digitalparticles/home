
document.addEventListener("DOMContentLoaded", () => {

    // INPUT CELLS
    const days = document.getElementById("days");
    const amount = document.getElementById("amount");
    const review = document.getElementById("review");

    // OUTPUT CELLS
    const probability = document.getElementById("probability");
    const noReturn = document.getElementById("noReturn");
    const score = document.getElementById("score");

    // VISUAL CHART
    const barFill = document.getElementById("barFill");
    const probabilityBar = document.getElementById("probabilityBar");
    const chartSummary = document.getElementById("chartSummary");

    // BUTTONS
    const resetButton = document.getElementById("reset");
    const copyButton = document.getElementById("copy");

    // ILLUSTRATIVE MODEL COEFFICIENTS
    // These values are assumptions, not fitted Olist estimates.

    const model = {
        intercept: -2.2,
        daysLate: -0.12,
        amount: 0.004,
        review: 0.48
    };

    // EXCEL FORMULA

    const excelFormula =
        "=1/(1+EXP(-(-2.2-0.12*B2+0.004*(B3-100)+0.48*(B4-3))))";


    // LOGISTIC REGRESSION FUNCTION

    function calculateProbability(daysLate, purchaseAmount, reviewScore) {

        const z =
            model.intercept
            + model.daysLate * daysLate
            + model.amount * (purchaseAmount - 100)
            + model.review * (reviewScore - 3);

        const probability = 1 / (1 + Math.exp(-z));

        return {
            z: z,
            probability: probability
        };
    }


    // VALIDATE VISITOR INPUTS

    function validateInputs() {

        const d = Number(days.value);
        const a = Number(amount.value);
        const r = Number(review.value);

        const validDays =
            days.value !== "" &&
            Number.isInteger(d) &&
            d >= 0 &&
            d <= 365;

        const validAmount =
            amount.value !== "" &&
            Number.isFinite(a) &&
            a >= 0 &&
            a <= 100000;

        const validReview =
            review.value !== "" &&
            Number.isInteger(r) &&
            r >= 1 &&
            r <= 5;

        days.setAttribute("aria-invalid", String(!validDays));
        amount.setAttribute("aria-invalid", String(!validAmount));
        review.setAttribute("aria-invalid", String(!validReview));

        return validDays && validAmount && validReview;
    }


    // UPDATE DASHBOARD

    function updateDashboard() {

        if (!validateInputs()) {

            probability.textContent = "Check inputs";
            noReturn.textContent = "—";
            score.textContent = "—";

            barFill.style.width = "0%";

            probabilityBar.setAttribute("aria-valuenow", "0");

            chartSummary.textContent = "Enter valid values";

            return;
        }

        const d = Number(days.value);
        const a = Number(amount.value);
        const r = Number(review.value);

        const result = calculateProbability(d, a, r);

        const returnPercent = result.probability * 100;
        const noReturnPercent = 100 - returnPercent;

        // SPREADSHEET RESULTS

        probability.textContent =
            returnPercent.toFixed(1) + "%";

        noReturn.textContent =
            noReturnPercent.toFixed(1) + "%";

        score.textContent =
            result.z.toFixed(3);

        // PROBABILITY BAR

        barFill.style.width =
            returnPercent.toFixed(2) + "%";

        probabilityBar.setAttribute(
            "aria-valuenow",
            returnPercent.toFixed(1)
        );

        chartSummary.textContent =
            returnPercent.toFixed(1) + "% estimated return";
    }


    // UPDATE WHEN USER TYPES

    [days, amount, review].forEach(input => {

        input.addEventListener("input", updateDashboard);

    });


    // RESET TO DEFAULT EXAMPLE

    resetButton.addEventListener("click", () => {

        days.value = 3;
        amount.value = 150;
        review.value = 4;

        updateDashboard();

    });


    // COPY EXCEL FORMULA

    copyButton.addEventListener("click", async () => {

        try {

            await navigator.clipboard.writeText(excelFormula);

            copyButton.textContent = "Formula Copied!";

            setTimeout(() => {
                copyButton.textContent = "Copy Excel Formula";
            }, 1600);

        } catch (error) {

            window.prompt("Copy this Excel formula:", excelFormula);

        }

    });


    // INITIAL CALCULATION

    updateDashboard();

});
