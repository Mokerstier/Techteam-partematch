/* jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/
/* eslint-env browser */
/* eslint 'no-console':0 */
const eventSlider = document.querySelector('.event-container');
// const dots = document.querySelectorAll('.dot');
const millis = 5000;
let eventCard = document.querySelectorAll('.event-card');
let slideIndex = 1;

const leftArrow = document.querySelector('.left');
const rightArrow = document.querySelector('.right');

// eslint-disable-next-line init-declarations
let delay;
eventSlider.scrollLeft = 0;
function carousel(){
    console.log(slideIndex)
    eventSlider.classList.add('overflow-hid');
    // eslint-disable-next-line init-declarations
    let i;
    
    for (i=0; i < eventCard.length; i++){
        eventCard[i].classList.remove('slide-in');
        eventCard[i].classList.add('hide');
        
        // eventCard[i].style.display = 'none';
        
    }
    if(slideIndex < 1){
        slideIndex = 1;
        eventSlider.scrollLeft = 0;
    }
    if (slideIndex > 1){
        eventSlider.scrollLeft += (eventCard[0].offsetWidth+32);
    }
    if (slideIndex > eventCard.length) {
        slideIndex = 1;
        eventSlider.scrollLeft = 0;
    }
    // for (i = 0; i < dots.length; i++) {
    //   dots[i].className = dots[i].className.replace(" active", " inactive");
      
    // }
    // eventCard[slideIndex-1].style.display = "block";
    
    
    // dots[slideIndex - 1].classList.add('active');
    // dots[slideIndex - 1].classList.remove('inactive');
    
}
function nextSlide(){
    carousel();
    // eslint-disable-next-line no-plusplus
    slideIndex++;
}
function prevSlide(){
    slideIndex--;
    carousel();
    
    // eslint-disable-next-line no-plusplus
    
}
function currentSlide(n) {
    clearInterval(delay);
    slideIndex = n + 1;
    nextSlide();
    delay = setInterval(nextSlide, millis);
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

// dots.forEach(function (dots, index){
//     dots.addEventListener("click", function(){
//      console.log(dots + index);
//         currentSlide(index);
//     });
// });
