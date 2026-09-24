/* =========================================
   BUSINESS SURVIVAL DATA
   Source:
   U.S. Bureau of Labor Statistics
   Business Employment Dynamics
========================================= */


// Overall survival of establishments
// born in March 2013.

const survivalData = [
    100.0,
    79.6,
    68.9,
    61.4,
    55.3,
    50.6,
    46.7,
    42.8,
    39.9,
    37.6,
    34.7
];


// Ten-year survival by industry.

const industries = [

    {
        name: "Agriculture, forestry, fishing & hunting",
        value: 50.5
    },

    {
        name: "Utilities",
        value: 45.7
    },

    {
        name: "Manufacturing",
        value: 43.6
    },

    {
        name: "Real estate & rental",
        value: 42.2
    },

    {
        name: "Retail trade",
        value: 41.7
    },

    {
        name: "Construction",
        value: 40.1
    },

    {
        name: "Other services",
        value: 39.6
    },

    {
        name: "Educational services",
        value: 38.9
    },

    {
        name: "Accommodation & food services",
        value: 38.2
    },

    {
        name: "Finance & insurance",
        value: 37.5
    },

    {
        name: "Health care & social assistance",
        value: 35.7
    },

    {
        name: "Arts, entertainment & recreation",
        value: 35.4
    },

    {
        name: "Total private sector",
        value: 34.7,
        total: true
    },

    {
        name: "Administrative & waste services",
        value: 34.2
    },

    {
        name: "Transportation & warehousing",
        value: 34.0
    },

    {
        name: "Management of companies",
        value: 33.0
    },

    {
        name: "Professional, scientific & technical",
        value: 30.9
    },

    {
        name: "Wholesale trade",
        value: 30.1
    },

    {
        name: "Information",
        value: 29.1
    },

    {
        name: "Mining, quarrying, oil & gas",
        value: 24.5
    }

];


/* =========================================
   ELEMENTS
========================================= */

const particleGrid = document.getElementById("particleGrid");
const yearSlider = document.getElementById("yearSlider");
const currentYear = document.getElementById("currentYear");
const currentRate = document.getElementById("currentRate");

const yearData = document.getElementById("yearData");
const industryList = document.getElementById("industryList");


/* =========================================
   CREATE 100 PARTICLES
========================================= */

const particles = [];

for (let i = 0; i < 100; i++) {

    const particle = document.createElement("div");

    particle.classList.add("particle");

    particleGrid.appendChild(particle);

    particles.push(particle);
}


/* =========================================
   UPDATE PARTICLES
========================================= */

function updateVisualization(year) {

    const rate = survivalData[year];

    currentYear.textContent = year;
    currentRate.textContent = rate.toFixed(1) + "%";


    /*
        We have 100 particles.

        A rate of 79.6%, for example,
        displays approximately 80 active particles.
    */

    const survivingParticles = Math.round(rate);


    particles.forEach((particle, index) => {

        if (index < survivingParticles) {

            particle.classList.remove("inactive");

        } else {

            particle.classList.add("inactive");

        }

    });


    updateActiveYear(year);

}


/* =========================================
   SLIDER
========================================= */

yearSlider.addEventListener("input", function () {

    const year = Number(this.value);

    updateVisualization(year);

});


/* =========================================
   YEAR TABLE
========================================= */

survivalData.forEach((rate, year) => {

    const cell = document.createElement("div");

    cell.classList.add("year-cell");

    cell.dataset.year = year;

    cell.innerHTML = `
        <span>YEAR ${year}</span>
        <strong>${rate.toFixed(1)}%</strong>
    `;

    yearData.appendChild(cell);

});


function updateActiveYear(year) {

    const cells = document.querySelectorAll(".year-cell");

    cells.forEach((cell) => {

        if (Number(cell.dataset.year) === year) {

            cell.style.background = "#f4f7fb";

        } else {

            cell.style.background = "transparent";

        }

    });

}


/* =========================================
   INDUSTRY COMPARISON
========================================= */

industries.forEach((industry) => {

    const row = document.createElement("div");

    row.classList.add("industry-row");

    if (industry.total) {
        row.classList.add("total");
    }


    /*
        Scale bars relative to 60%.

        60% represents the full width of
        the comparison track.
    */

    const barWidth = Math.min(
        (industry.value / 60) * 100,
        100
    );


    row.innerHTML = `

        <div class="industry-name">
            ${industry.name}
        </div>

        <div class="industry-bar-track">

            <div
                class="industry-bar"
                style="width: ${barWidth}%"
            ></div>

        </div>

        <div class="industry-value">
            ${industry.value.toFixed(1)}%
        </div>

    `;


    industryList.appendChild(row);

});


/* =========================================
   INITIAL STATE
========================================= */

updateVisualization(0);