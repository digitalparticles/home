// const images = document.querySelectorAll('.carousel-track img');
// let index = 0;



// document.querySelector('.fade-carousel').addEventListener('click', () => {
//     images[index].classList.remove('active');
//     index = (index + 1) % images.length;
//     images[index].classList.add('active');
// });

document.querySelectorAll(".fade-carousel").forEach((carousel) => {
    const images = carousel.querySelectorAll("img");
    let currentIndex = 0;

    setInterval(() => {
        images[currentIndex].classList.remove("active");
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add("active");
    }, 3000);
});