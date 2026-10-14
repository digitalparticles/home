
/*
 * PENROSE PARTICLES
 * STUDY 07 — THE AI TRUST PARADOX
 *
 * Figures are published aggregate survey
 * percentages, not fabricated individual records.
 */

const datasets = {

    completion: {
        rows: [
            ["Always verify", 28.8],
            ["Sometimes verify", 18.5],
            ["Never verify", 8.8]
        ],

        note:
            "Share reporting a fully completed AI purchase, " +
            "by verification frequency, among AI-research users " +
            "(n=550 overall). Observational comparison; group " +
            "denominators differ. Source: Product.ai Edition 2, §5.3."
    },

    verification: {
        rows: [
            ["June 2026", 85.7],
            ["October 2026", 89.9]
        ],

        note:
            "Verification among online-shopping AI users; " +
            "June n=623, October n=517. Different survey samples, " +
            "not a longitudinal panel. " +
            "Source: Product.ai Editions 1 and 2."
    }

};

const chart = document.getElementById("barChart");
const mode = document.getElementById("mode");
const note = document.getElementById("chartNote");

function render() {

    const d = datasets[mode.value];

    chart.replaceChildren();

    for (const [label, value] of d.rows) {

        const row = document.createElement("div");
        row.className = "bar-row";

        const name = document.createElement("span");
        name.textContent = label;

        const track = document.createElement("div");
        track.className = "track";

        const fill = document.createElement("div");
        fill.className = "fill";
        fill.style.width = value + "%";

        track.append(fill);

        const amount = document.createElement("span");
        amount.className = "bar-value";
        amount.textContent = value.toFixed(1) + "%";

        row.append(name, track, amount);

        chart.append(row);
    }

    note.textContent = d.note;
}

mode.addEventListener("change", render);

render();
