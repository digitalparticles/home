const images = document.querySelectorAll('.carousel-track img');
let index = 0;

document.querySelector('.fade-carousel').addEventListener('click', () => {
    images[index].classList.remove('active');
    index = (index + 1) % images.length;
    images[index].classList.add('active');
});