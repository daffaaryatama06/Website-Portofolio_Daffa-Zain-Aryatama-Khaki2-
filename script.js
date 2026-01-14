const reveals = document.querySelectorAll(".reveal");

function revealOnScroll(){
  reveals.forEach((el, i) => {
    const top = el.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if(top < windowHeight - 100){
      el.style.transitionDelay = `${i * 0.08}s`; // 🔥 stagger otomatis
      el.classList.add("active");
    }
  });
}

// 🔥 Jalankan saat page load
window.addEventListener("load", revealOnScroll);

// Force hero active immediately
const heroText = document.querySelector(".hero-text");
const heroImgWrap = document.querySelector(".hero-img");

if(heroText) heroText.classList.add("active");
if(heroImgWrap) heroImgWrap.classList.add("active");


// 🔥 Jalankan saat scroll
window.addEventListener("scroll", revealOnScroll);



// ===============================
// Parallax hero image
// ===============================
const heroImg = document.querySelector(".hero-img img");
const heroTitle = document.querySelector(".hero-title");

document.addEventListener("mousemove", (e) => {
  if(!heroImg || !heroTitle) return;

  const x = (window.innerWidth / 2 - e.clientX) / 120;
  const y = (window.innerHeight / 2 - e.clientY) / 120;

  heroImg.style.transform = `translateX(${-x}px) translateY(${-y}px) scale(1.01)`;

  heroTitle.style.transform = `perspective(800px) rotateY(${x * 0.8}deg) rotateX(${y * -0.8}deg)`;
});




// ===============================
// Navbar active state
// ===============================
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar nav a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if(scrollY >= sectionTop){
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(a => {
    a.classList.remove("active");
    if(a.getAttribute("href") === "#" + current){
      a.classList.add("active");
    }
  });
});

// ===============================
// Preloader + Hero Cinematic Sync
// ===============================
const preloader = document.querySelector(".preloader");

window.addEventListener("load", () => {
  setTimeout(() => {
    preloader.classList.add("hide");

    // 🔥 Setelah preloader hilang, baru play hero intro
    const hero = document.querySelector(".hero-intro");
    if(hero){
      setTimeout(() => {
        hero.classList.add("play");
      }, 600); // delay kecil setelah preloader fade
    }

  }, 1200); // durasi opening
});


// ===============================
// Custom cursor
// ===============================
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

document.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;

  cursorDot.style.left = x + "px";
  cursorDot.style.top = y + "px";

  cursorRing.style.left = x + "px";
  cursorRing.style.top = y + "px";
});


// ===============================
// Scroll progress bar
// ===============================
const progressBar = document.querySelector(".scroll-progress");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;

  progressBar.style.width = progress + "%";
});

// ===============================
// Project showcase spotlight + cursor hint
// ===============================
const showcases = document.querySelectorAll(".project-showcase");

showcases.forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--x", x + "%");
    card.style.setProperty("--y", y + "%");

  });
});


// ===============================
// Skill cards 3D tilt + spotlight
// ===============================
const skillCards = document.querySelectorAll(".skill-card");

skillCards.forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 6;
    const rotateY = ((x - centerX) / centerX) * -6;

    card.style.transform = `
      perspective(800px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-8px)
    `;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    card.style.setProperty("--x", percentX + "%");
    card.style.setProperty("--y", percentY + "%");
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});


// ===============================
// About card spotlight effect
// ===============================
const aboutCard = document.querySelector(".about-card");

if(aboutCard){
  aboutCard.addEventListener("mousemove", (e) => {
    const rect = aboutCard.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    aboutCard.style.setProperty("--x", x + "%");
    aboutCard.style.setProperty("--y", y + "%");
  });
}


// ===============================
// PROJECT MODAL LOGIC
// ===============================
const modal = document.getElementById("projectModal");
const modalImg = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalTag = document.getElementById("modalTag");
const modalRole = document.getElementById("modalRole");
const modalTools = document.getElementById("modalTools");

const prevBtn = modal.querySelector(".prev");
const nextBtn = modal.querySelector(".next");
const closeBtn = modal.querySelector(".project-modal-close");
const backdrop = modal.querySelector(".project-modal-backdrop");

let currentImages = [];
let currentIndex = 0;
let activeCard = null;
let activeCardImage = null;


// Open modal
document.querySelectorAll(".project-showcase").forEach(card => {
  card.addEventListener("click", (e) => {
    e.preventDefault();

    const img = card.querySelector("img");
    activeCard = card;
    activeCardImage = img;
    const rect = img.getBoundingClientRect();

    // Clone image
    const clone = img.cloneNode(true);
    clone.classList.add("shared-image-clone");

    // Set initial position
    clone.style.top = rect.top + "px";
    clone.style.left = rect.left + "px";
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";

    document.body.appendChild(clone);

    // Prepare modal data
    const images = card.dataset.images.split(",");
    currentImages = images;
    currentIndex = 0;

    modalImg.src = images[0];
    modalTitle.textContent = card.dataset.title;
    modalDesc.textContent = card.dataset.desc;
    modalTag.textContent = card.dataset.tag;
    modalRole.textContent = card.dataset.role;
    modalTools.textContent = card.dataset.tools;

    // Show modal (but image hidden)
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Get target position (modal image container)
    const target = modal.querySelector(".project-modal-left");
    const targetRect = target.getBoundingClientRect();

    // Force reflow
    clone.getBoundingClientRect();

    // Animate clone to modal position
    clone.style.top = targetRect.top + "px";
    clone.style.left = targetRect.left + "px";
    clone.style.width = targetRect.width + "px";
    clone.style.height = targetRect.height + "px";
    clone.style.borderRadius = "0px";

    // After animation done
    setTimeout(() => {
      modalImg.style.opacity = "1";
      clone.remove();
    }, 900);
  });
});


// Close modal
function closeModal(){
  if(!activeCardImage) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    return;
  }

  const modalImageRect = modalImg.getBoundingClientRect();
  const cardRect = activeCardImage.getBoundingClientRect();

  // Clone modal image
  const clone = modalImg.cloneNode(true);
  clone.classList.add("shared-image-clone");

  clone.style.top = modalImageRect.top + "px";
  clone.style.left = modalImageRect.left + "px";
  clone.style.width = modalImageRect.width + "px";
  clone.style.height = modalImageRect.height + "px";
  clone.style.borderRadius = "0px";

  document.body.appendChild(clone);

  // Hide modal immediately
  modal.classList.remove("active");
  document.body.style.overflow = "";
  modalImg.style.opacity = "0";

  // Force reflow
  clone.getBoundingClientRect();

  // Animate back to card
  clone.style.top = cardRect.top + "px";
  clone.style.left = cardRect.left + "px";
  clone.style.width = cardRect.width + "px";
  clone.style.height = cardRect.height + "px";
  clone.style.borderRadius = "24px";

  // Cleanup
  setTimeout(() => {
    clone.remove();
    activeCard = null;
    activeCardImage = null;
  }, 900);
}



closeBtn.addEventListener("click", closeModal);
backdrop.addEventListener("click", closeModal);


function changeImage(newIndex){
  // kasih animasi keluar
  modalImg.classList.remove("fade-in");
  modalImg.classList.add("fade-out");

  setTimeout(() => {
    currentIndex = newIndex;
    modalImg.src = currentImages[currentIndex];

    // tunggu image ganti lalu masuk
    modalImg.classList.remove("fade-out");
    modalImg.classList.add("fade-in");
  }, 250);
}

// Next
nextBtn.addEventListener("click", () => {
  const nextIndex = (currentIndex + 1) % currentImages.length;
  changeImage(nextIndex);
});

// Prev
prevBtn.addEventListener("click", () => {
  const prevIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  changeImage(prevIndex);
});







