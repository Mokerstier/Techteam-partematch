/* jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/
/* eslint-env browser */
/* eslint 'no-console':0 */
const eventSlider = document.querySelector('.event-container');
// const dots = document.querySelectorAll('.dot');
const millis = 3000;
var eventCard = document.querySelectorAll('.event-card');
let slideIndex = 1;
let eventCards =[];
const leftArrow = document.querySelector('.left');
const rightArrow = document.querySelector('.right');
const scrollToLeft = Number(eventCard[0].offsetWidth+32);
// eslint-disable-next-line init-declarations
let delay;

eventCards.push(eventCard);

eventSlider.scrollLeft = 0;
function carousel(){
    console.log(slideIndex)
    eventSlider.classList.add('overflow-hid');
    // eslint-disable-next-line init-declarations
    let i;
    
    for (i=0; i < eventCard.length; i++){
        // eventCards.push(eventCard[i]);
        eventCard[i].classList.remove('slide-in');
        eventCard[i].classList.add('hide');
        
        // eventCard[i].style.display = 'none';
    }
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
    // eslint-disable-next-line no-plusplus
    eventSlider.scroll({top:0, left: -scrollToLeft, behavior: 'smooth'});
    slideIndex--;
    
}
// function currentSlide(n) {
//     clearInterval(delay);
//     slideIndex = n + 1;
//     nextSlide();
//     delay = setInterval(nextSlide, millis);
// }
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
