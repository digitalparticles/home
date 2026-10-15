
// Study 10 — The Resignation Equation
// Demonstration coefficients only.
// Not intended for real employee assessment.

(() => {
    "use strict";

    const $ = id => document.getElementById(id);

    const inputs = [
        "overtime",
        "satisfaction",
        "income",
        "tenure"
    ];

    const defaults = {
        overtime: 0,
        satisfaction: 3,
        income: 6500,
        tenure: 5
    };

    // ILLUSTRATIVE EXCEL FORMULA

    const formula =
        "=1/(1+EXP(-(-1.55+1.05*B2-0.45*(B3-2.5)-0.00006*(B4-6500)-0.065*(B5-5))))";


    // LOGISTIC REGRESSION

    function score(s) {

        const z =
            -1.55
            + 1.05 * s.overtime
            - 0.45 * (s.satisfaction - 2.5)
            - 0.00006 * (s.income - 6500)
            - 0.065 * (s.tenure - 5);

        return {
            z,
            p: 1 / (1 + Math.exp(-z))
        };

    }


    // READ INPUT VALUES

    function scenario() {

        return Object.fromEntries(
            inputs.map(id => [id, Number($(id).value)])
        );

    }


    // VALIDATION

    function valid(s) {

        return inputs.every(
            id => $(id).value.trim() !== ""
        )

            && [
                s.overtime,
                s.satisfaction,
                s.income,
                s.tenure
            ].every(Number.isFinite)

            && [0, 1].includes(s.overtime)

            && Number.isInteger(s.satisfaction)
            && s.satisfaction >= 1
            && s.satisfaction <= 4

            && s.income >= 1000
            && s.income <= 20000

            && Number.isInteger(s.tenure)
            && s.tenure >= 0
            && s.tenure <= 40;

    }


    const pct = n => (n * 100).toFixed(1) + "%";


    // CREATE ONE COMPARISON CHART

    function compareCard(title, rows) {

        const card = document.createElement("div");
        card.className = "comparison-card";

        const heading = document.createElement("h3");
        heading.textContent = title;

        card.append(heading);

        rows.forEach(({ name, p }) => {

            const row = document.createElement("div");
            row.className = "compare-row";

            const label = document.createElement("span");
            label.textContent = name;

            const track = document.createElement("div");
            track.className = "mini-track";

            const fill = document.createElement("div");
            fill.style.width = (p * 100).toFixed(2) + "%";

            track.append(fill);

            const value = document.createElement("b");
            value.textContent = pct(p);

            row.append(label, track, value);
            card.append(row);

        });

        return card;
    }


    // SENSITIVITY COMPARISONS

    function comparisons(s) {

        const group = $("comparison");
        group.replaceChildren();

        const matrices = [

            [
                "Overtime",
                [
                    ["No", 0],
                    ["Yes", 1]
                ],
                "overtime"
            ],

            [
                "Job satisfaction",
                [
                    ["1 — Low", 1],
                    ["2 — Medium", 2],
                    ["3 — High", 3],
                    ["4 — Very high", 4]
                ],
                "satisfaction"
            ],

            [
                "Monthly income",
                [
                    ["$3,000", 3000],
                    ["$6,500", 6500],
                    ["$10,000", 10000]
                ],
                "income"
            ],

            [
                "Tenure",
                [
                    ["1 year", 1],
                    ["5 years", 5],
                    ["10 years", 10],
                    ["20 years", 20]
                ],
                "tenure"
            ]

        ];

        matrices.forEach(([title, choices, key]) => {

            const rows = choices.map(([name, val]) => {

                const changed = {
                    ...s,
                    [key]: val
                };

                return {
                    name,
                    p: score(changed).p
                };

            });

            group.append(compareCard(title, rows));

        });

    }


    // UPDATE ENTIRE DASHBOARD

    function update() {

        const s = scenario();

        if (!valid(s)) {

            $("leaveProb").textContent = "Check inputs";
            $("stayProb").textContent = "—";
            $("zScore").textContent = "—";

            $("kpiProbability").textContent = "—";
            $("barLabel").textContent = "Enter valid values";

            $("probFill").style.width = "0%";

            $("probTrack").setAttribute(
                "aria-valuenow", "0"
            );

            $("comparison").replaceChildren();
            $("downloadScenario").disabled = true;

            return;
        }

        $("downloadScenario").disabled = false;

        const { z, p } = score(s);

        // SPREADSHEET RESULTS

        $("leaveProb").textContent = pct(p);
        $("stayProb").textContent = pct(1 - p);
        $("zScore").textContent = z.toFixed(3);

        // KPI OUTPUT

        $("kpiProbability").textContent = pct(p);

        // PROBABILITY METER

        $("barLabel").textContent = pct(p);

        $("probFill").style.width =
            (p * 100).toFixed(2) + "%";

        $("probTrack").setAttribute(
            "aria-valuenow",
            (p * 100).toFixed(1)
        );

        // COMPARISON CHARTS

        comparisons(s);

    }


    // EXPORT CSV

    function download(name, content, type) {

        const blob = new Blob([content], { type });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = name;

        document.body.append(a);
        a.click();
        a.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1500);

    }


    // INPUT EVENTS

    inputs.forEach(id => {

        $(id).addEventListener("input", update);

    });


    // RESET BUTTON

    $("reset").addEventListener("click", () => {

        inputs.forEach(id => {
            $(id).value = defaults[id];
        });

        update();

    });


    // COPY FORMULA BUTTON

    $("copyFormula").addEventListener("click", async () => {

        try {

            await navigator.clipboard.writeText(formula);

            $("copyFormula").textContent = "Copied!";

            setTimeout(() => {
                $("copyFormula").textContent = "Copy Excel formula";
            }, 1500);

        } catch {

            window.prompt("Copy Excel formula:", formula);

        }

    });


    // DOWNLOAD SCENARIO BUTTON

    $("downloadScenario").addEventListener("click", () => {

        const s = scenario();

        if (!valid(s)) return;

        const { z, p } = score(s);

        const csv =
            "OverTime,JobSatisfaction,MonthlyIncome,YearsAtCompany,DemoLogitScore,DemoLeaveProbability,ModelStatus\n"

            + [
                s.overtime,
                s.satisfaction,
                s.income,
                s.tenure,
                z.toFixed(6),
                p.toFixed(6),
                "Illustrative_Not_Trained"
            ].join(",")

            + "\n";

        download(
            "study-10-scenario.csv",
            csv,
            "text/csv;charset=utf-8"
        );

    });


    // INITIALIZE

    $("formula").textContent = formula;

    update();

})();
