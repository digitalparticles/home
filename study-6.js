// ==========================================================
// PENROSE PARTICLES
// STUDY 06
// CAN YOU TELL WHICH CUSTOMER IS FAKE?
//
// Website presentation layer.
// No JSON file or fetch() required.
// ==========================================================


// ==========================================================
// 1. STUDY RESULTS
// ==========================================================
//
// These values are displayed directly on the webpage.
//
// IMPORTANT:
// Classifier accuracy and synthetic-data similarity should
// ultimately be replaced with the results produced by the
// Python experiment.
// ==========================================================

const studyResults = {

    // ------------------------------------------------------
    // DATASET
    // ------------------------------------------------------

    realSessions: 12330,

    syntheticSessions: 12330,


    // ------------------------------------------------------
    // CLASSIFIER
    // ------------------------------------------------------
    //
    // Placeholder until the Python experiment is run.
    //
    // 50% = classifier is basically guessing
    // Higher = classifier can detect synthetic observations
    // ------------------------------------------------------

    detectionAccuracy: 50.0,

    rocAuc: 0.500,


    // ------------------------------------------------------
    // DISTRIBUTION SIMILARITY
    // ------------------------------------------------------
    //
    // Placeholder until calculated by Python.
    // ------------------------------------------------------

    averageSimilarity: 0,


    // ------------------------------------------------------
    // PURCHASE RATE
    // ------------------------------------------------------

    realPurchaseRate: 15.47,

    syntheticPurchaseRate: 0,


    // ------------------------------------------------------
    // RETURNING VISITORS
    // ------------------------------------------------------

    realReturningVisitors: 85.57,

    syntheticReturningVisitors: 0,


    // ------------------------------------------------------
    // WEEKEND SESSIONS
    // ------------------------------------------------------

    realWeekendSessions: 23.26,

    syntheticWeekendSessions: 0,


    // ------------------------------------------------------
    // VARIABLE SIMILARITY
    // ------------------------------------------------------
    //
    // These remain zero until we insert the actual results
    // from the Python synthetic-data experiment.
    // ------------------------------------------------------

    similarity: {

        Month: 0,

        VisitorType: 0,

        TrafficType: 0,

        Weekend: 0,

        PagesGroup: 0,

        DurationGroup: 0,

        BounceGroup: 0,

        ExitGroup: 0,

        ValueGroup: 0,

        Revenue: 0

    }

};


// ==========================================================
// 2. FRIENDLY VARIABLE NAMES
// ==========================================================

const friendlyNames = {

    Month:
        "Month",

    VisitorType:
        "Visitor type",

    TrafficType:
        "Traffic source",

    Weekend:
        "Weekend",

    PagesGroup:
        "Pages viewed",

    DurationGroup:
        "Session duration",

    BounceGroup:
        "Bounce behaviour",

    ExitGroup:
        "Exit behaviour",

    ValueGroup:
        "Page value",

    Revenue:
        "Purchase outcome"

};


// ==========================================================
// 3. FORMAT PERCENTAGES
// ==========================================================

function percent(value) {

    return `${Number(value).toFixed(1)}%`;

}


// ==========================================================
// 4. CALCULATE DIFFERENCE
// ==========================================================

function difference(real, synthetic) {

    const diff = Math.abs(
        Number(real) - Number(synthetic)
    );

    return `${diff.toFixed(1)} pp`;

}


// ==========================================================
// 5. CLASSIFIER INTERPRETATION
// ==========================================================

function classifierInterpretation(accuracy) {

    if (accuracy < 55) {

        return (
            "The classifier performed close to random guessing. " +
            "For the variables tested, the real and synthetic " +
            "shopping sessions were difficult to distinguish."
        );

    }


    if (accuracy < 70) {

        return (
            "The classifier detected some differences between " +
            "the real and synthetic shopping sessions, although " +
            "the two populations still shared substantial " +
            "statistical structure."
        );

    }


    return (
        "The classifier was able to distinguish the synthetic " +
        "sessions from the real sessions relatively well. " +
        "This suggests that important parts of the original " +
        "data distribution were not completely reproduced."
    );

}


// ==========================================================
// 6. BUILD SIMILARITY BARS
// ==========================================================

function buildSimilarityBars(variables) {

    const container =
        document.getElementById(
            "similarityList"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    // Convert object to array and sort
    // from highest similarity to lowest.

    const sortedVariables =
        Object.entries(variables)
            .sort(
                (a, b) => b[1] - a[1]
            );


    sortedVariables.forEach(
        ([variable, value]) => {


            // ----------------------------------------------
            // CONTAINER
            // ----------------------------------------------

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "similarity-item";


            // ----------------------------------------------
            // VARIABLE NAME
            // ----------------------------------------------

            const name =
                document.createElement(
                    "span"
                );

            name.className =
                "similarity-name";

            name.textContent =
                friendlyNames[variable]
                || variable;


            // ----------------------------------------------
            // BAR TRACK
            // ----------------------------------------------

            const track =
                document.createElement(
                    "div"
                );

            track.className =
                "similarity-track";


            // ----------------------------------------------
            // BAR
            // ----------------------------------------------

            const fill =
                document.createElement(
                    "div"
                );

            fill.className =
                "similarity-fill";


            track.appendChild(fill);


            // ----------------------------------------------
            // VALUE
            // ----------------------------------------------

            const number =
                document.createElement(
                    "span"
                );

            number.className =
                "similarity-value";

            number.textContent =
                percent(value);


            // ----------------------------------------------
            // ADD EVERYTHING
            // ----------------------------------------------

            item.appendChild(name);

            item.appendChild(track);

            item.appendChild(number);

            container.appendChild(item);


            // ----------------------------------------------
            // ANIMATE BAR
            // ----------------------------------------------

            requestAnimationFrame(() => {

                fill.style.width =
                    `${value}%`;

            });

        }
    );

}


// ==========================================================
// 7. DISPLAY TOP METRICS
// ==========================================================

function displayTopMetrics() {


    // ------------------------------------------------------
    // REAL SESSIONS
    // ------------------------------------------------------

    const realRows =
        document.getElementById(
            "realRows"
        );

    if (realRows) {

        realRows.textContent =
            studyResults
                .realSessions
                .toLocaleString();

    }


    // ------------------------------------------------------
    // SYNTHETIC SESSIONS
    // ------------------------------------------------------

    const syntheticRows =
        document.getElementById(
            "syntheticRows"
        );

    if (syntheticRows) {

        syntheticRows.textContent =
            studyResults
                .syntheticSessions
                .toLocaleString();

    }


    // ------------------------------------------------------
    // DETECTION ACCURACY
    // ------------------------------------------------------

    const accuracy =
        document.getElementById(
            "accuracy"
        );

    if (accuracy) {

        accuracy.textContent =
            percent(
                studyResults
                    .detectionAccuracy
            );

    }


    // ------------------------------------------------------
    // LARGE ACCURACY NUMBER
    // ------------------------------------------------------

    const accuracyLarge =
        document.getElementById(
            "accuracyLarge"
        );

    if (accuracyLarge) {

        accuracyLarge.textContent =
            percent(
                studyResults
                    .detectionAccuracy
            );

    }


    // ------------------------------------------------------
    // SIMILARITY
    // ------------------------------------------------------

    const similarity =
        document.getElementById(
            "similarity"
        );

    if (similarity) {

        similarity.textContent =
            percent(
                studyResults
                    .averageSimilarity
            );

    }

}


// ==========================================================
// 8. DISPLAY CLASSIFIER EXPLANATION
// ==========================================================

function displayClassifierResult() {

    const element =
        document.getElementById(
            "classifierInterpretation"
        );


    if (!element) {

        return;

    }


    element.textContent =
        classifierInterpretation(
            studyResults
                .detectionAccuracy
        );

}


// ==========================================================
// 9. DISPLAY PURCHASE RATE
// ==========================================================

function displayPurchaseRate() {


    const real =
        document.getElementById(
            "realPurchase"
        );


    const synthetic =
        document.getElementById(
            "syntheticPurchase"
        );


    const differenceElement =
        document.getElementById(
            "purchaseDifference"
        );


    if (real) {

        real.textContent =
            percent(
                studyResults
                    .realPurchaseRate
            );

    }


    if (synthetic) {

        synthetic.textContent =
            percent(
                studyResults
                    .syntheticPurchaseRate
            );

    }


    if (differenceElement) {

        differenceElement.textContent =
            difference(
                studyResults
                    .realPurchaseRate,

                studyResults
                    .syntheticPurchaseRate
            );

    }

}


// ==========================================================
// 10. DISPLAY RETURNING VISITORS
// ==========================================================

function displayReturningVisitors() {


    const real =
        document.getElementById(
            "realReturning"
        );


    const synthetic =
        document.getElementById(
            "syntheticReturning"
        );


    const differenceElement =
        document.getElementById(
            "returningDifference"
        );


    if (real) {

        real.textContent =
            percent(
                studyResults
                    .realReturningVisitors
            );

    }


    if (synthetic) {

        synthetic.textContent =
            percent(
                studyResults
                    .syntheticReturningVisitors
            );

    }


    if (differenceElement) {

        differenceElement.textContent =
            difference(
                studyResults
                    .realReturningVisitors,

                studyResults
                    .syntheticReturningVisitors
            );

    }

}


// ==========================================================
// 11. DISPLAY WEEKEND SESSIONS
// ==========================================================

function displayWeekendSessions() {


    const real =
        document.getElementById(
            "realWeekend"
        );


    const synthetic =
        document.getElementById(
            "syntheticWeekend"
        );


    const differenceElement =
        document.getElementById(
            "weekendDifference"
        );


    if (real) {

        real.textContent =
            percent(
                studyResults
                    .realWeekendSessions
            );

    }


    if (synthetic) {

        synthetic.textContent =
            percent(
                studyResults
                    .syntheticWeekendSessions
            );

    }


    if (differenceElement) {

        differenceElement.textContent =
            difference(
                studyResults
                    .realWeekendSessions,

                studyResults
                    .syntheticWeekendSessions
            );

    }

}


// ==========================================================
// 12. START STUDY
// ==========================================================

function initialiseStudy() {


    displayTopMetrics();


    displayClassifierResult();


    displayPurchaseRate();


    displayReturningVisitors();


    displayWeekendSessions();


    buildSimilarityBars(
        studyResults.similarity
    );

}


// ==========================================================
// 13. RUN WHEN PAGE LOADS
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    initialiseStudy
);