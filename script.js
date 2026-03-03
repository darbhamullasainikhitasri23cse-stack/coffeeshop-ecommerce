const navLinks = document.querySelectorAll(".nav-menu .nav-link");
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

menuOpenButton.addEventListener("click", () => {
    //toggle mobile menu visibility
    document.body.classList.toggle("show-mobile-menu");
});
//Close menu when the close button is clicked
menuCloseButton.addEventListener("click", () => menuOpenButton.click());

//close menu when the nav link is clicked
navLinks.forEach(link => {
    link.addEventListener("click", () => menuOpenButton.click());
});



//initialize swiper
const swiper = new Swiper('.slider-wrapper', {
  loop: true,
  grabCursor:true,
  spaceBetween: 25,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  //Responsive breakpoints
  breakpoints: {
    0: {
        slidesPerView: 1
    },
      768: {
        slidesPerView: 2
    },
      1024: {
        slidesPerView: 3
    }
  }
});
//without  reloading the page for contact-form when you click submit button
document.querySelector(".contact-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const name = this.querySelector('input[name="name"]').value;
  const email = this.querySelector('input[name="email"]').value;
  const message = this.querySelector('textarea[name="message"]').value;

  const response = await fetch("http://localhost:5000/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, message })
  });

  const result = await response.json();
  alert(result.message);
  this.reset();
});
