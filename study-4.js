"use strict";


const nodes = document.querySelectorAll(".data-node");

const selectedPercent =
    document.getElementById("selectedPercent");

const selectedLabel =
    document.getElementById("selectedLabel");

const mainNumber =
    document.getElementById("mainNumber");


function selectNode(node) {

    const percent =
        node.dataset.percent;

    const label =
        node.dataset.label;


    // Remove previous active state
    nodes.forEach(item => {
        item.classList.remove("active");
    });


    // Highlight selected node
    node.classList.add("active");


    // Update center
    selectedPercent.textContent =
        `${percent}%`;

    selectedLabel.textContent =
        label;


    // Animate main number
    animateNumber(
        Number(mainNumber.textContent),
        Number(percent),
        450
    );
}


function resetVisualization() {

    nodes.forEach(item => {
        item.classList.remove("active");
    });

    selectedPercent.textContent =
        "53%";

    selectedLabel.textContent =
        "All social media users";

    animateNumber(
        Number(mainNumber.textContent),
        53,
        400
    );
}


nodes.forEach(node => {

    node.addEventListener(
        "mouseenter",
        () => selectNode(node)
    );

    node.addEventListener(
        "focus",
        () => selectNode(node)
    );

    node.addEventListener(
        "click",
        () => selectNode(node)
    );

});


document
    .getElementById("orbitContainer")
    .addEventListener(
        "mouseleave",
        resetVisualization
    );


function animateNumber(
    start,
    end,
    duration
) {

    const startTime =
        performance.now();


    function update(currentTime) {

        const elapsed =
            currentTime - startTime;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        // Smooth easing
        const eased =
            1 - Math.pow(
                1 - progress,
                3
            );


        const current =
            Math.round(
                start +
                (end - start) *
                eased
            );


        mainNumber.textContent =
            current;


        if (progress < 1) {
            requestAnimationFrame(update);
        }

    }


    requestAnimationFrame(update);
}