/* jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/
/* eslint-env browser */
/* eslint 'no-console':0 */
const eventSlider = document.querySelector('.event-container');
// const dots = document.querySelectorAll('.dot');
const millis = 3000;
var eventCard = document.querySelectorAll('.event-card');
let slideIndex = 1;
const leftArrow = document.querySelector('.left');
const rightArrow = document.querySelector('.right');
const scrollToLeft = Number(eventCard[0].offsetWidth+16);
// eslint-disable-next-line init-declarations
let delay;


eventSlider.scrollLeft = 0;
function carousel(){
    eventSlider.classList.add('overflow-hid');
    // eslint-disable-next-line init-declarations
    
    let multiplier = slideIndex-1;
    if (multiplier == 0){
        multiplier = 1;
    }
    if(slideIndex < 1){
        slideIndex = 1;
        eventSlider.scroll({top:0, left: 0, behavior: 'smooth'});
    }
    if (slideIndex > 1){
        eventSlider.scroll({top: 0, left: scrollToLeft*(multiplier), behavior: 'smooth'});
    }
    if (slideIndex > eventCard.length) {
        slideIndex = 1;
        eventSlider.scroll({top:0, left: 0, behavior: 'smooth'});
    }
}
function nextSlide(){
    carousel();
    // eslint-disable-next-line no-plusplus
    slideIndex++;
}
function prevSlide(){
    eventSlider.scroll({top:0, left: -scrollToLeft, behavior: 'smooth'});
    // eslint-disable-next-line no-plusplus
    slideIndex--;
    
}

function pauseCaro(){
    clearInterval(delay, millis);
    
}

function starteventCard(){
    pauseCaro();
    nextSlide();
    delay = setInterval(nextSlide, millis);
}

leftArrow.addEventListener("click", prevSlide);
rightArrow.addEventListener("click", nextSlide);

eventSlider.addEventListener("mouseenter", pauseCaro);
eventSlider.addEventListener("mouseleave", starteventCard);
document.addEventListener('DOMContentLoaded', starteventCard);

