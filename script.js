// A3 System custom script
// Wrapped so its variables stay private and can't clash with other scripts.
(function () {
/////////// NAVBAR HIDES ON SCROLL
document.addEventListener("DOMContentLoaded", function () {
  const showAnim = gsap
    .from(".nav_wrap", {
      yPercent: -100,
      paused: true,
      duration: 0.3,
      force3D: false, // This keeps your backdrop-filter alive!
    })
    .progress(1);

  ScrollTrigger.create({
    start: "top top",
    end: 99999,
    onUpdate: (self) => {
      // If scrolling down, hide nav. If scrolling up, show nav.
      self.direction === 1 ? showAnim.reverse() : showAnim.play();
    },
  });
});

/////////// MENU ANIMATIONS
window.addEventListener("DOMContentLoaded", (event) => {
  let navButton = $(".nav_btn");
  let logo = $(".nav_logo_link");
  let menuWrap = $(".menu_wrap");
  let menuBackground = $(".menu_background");
  let lines = $(".nav_btn_line");

  let showMainMenu = gsap.timeline({
    paused: true,
    defaults: { duration: 1.1, ease: "power4.out" },
    onReverseComplete: () => {
      navButton.attr("aria-label", "Open Main Menu");
    },
    onComplete: () => {
      menuWrap.find("button").first().focus();
      navButton.attr("aria-label", "Close Main Menu");
    },
  });
  showMainMenu.set(menuWrap, { display: "block" });
  showMainMenu.to("html", { "--navbar--text": "#131936" }, "<");
  showMainMenu.set(menuBackground, { display: "block" }, "<");
  showMainMenu.from(
    menuWrap,
    { y: "-50%", opacity: 0, filter: "blur(20px)" },
    "<"
  );
  showMainMenu.from(menuBackground, { opacity: 0 }, "<");
  showMainMenu.to(lines.eq(0), { y: 6, rotate: 45, duration: 0.4 }, "<");
  showMainMenu.to(lines.eq(1), { autoAlpha: 0, duration: 0.2 }, "<");
  showMainMenu.to(lines.eq(2), { y: -7, rotate: -45, duration: 0.4 }, "<");
  showMainMenu.to(logo, { color: "var(--brand-colors--almost-black)" }, "<");

  navButton.on("click", function () {
    if (showMainMenu.progress() === 0) {
      showMainMenu.play();
    } else {
      showMainMenu.reverse();
      navButton.attr("aria-label", "Open Main Menu");
    }
  });

  menuBackground.on("click", function () {
    showMainMenu.reverse();
  });
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") showMainMenu.reverse();
  });

  // Close menu when clicking an anchor link inside the menu
  menuWrap.find("a").on("click", function () {
    showMainMenu.reverse();
  });
});

/////// HOME HERO SLIDER
document
  .querySelectorAll(".temp-hero-slider_component")
  .forEach((component) => {
    // 1. Find the common parent
    const parentSection = component.closest(".section.is-hero");
    if (!parentSection) return;

    // 2. Find the specific elements within that parent
    const bgCmsWrap = component.querySelector(".swiper");
    const textCmsWrap = parentSection.querySelector(
      ".hero_text-slider_component .swiper"
    );

    if (!bgCmsWrap || !textCmsWrap) return;

    // Initialize Text Swiper
    const textSwiper = new Swiper(textCmsWrap, {
      direction: "vertical",
      slidesPerView: 1,
      speed: 1000,
      loop: true,
      allowTouchMove: false,
      parallax: true,
    });

    // Initialize Background Swiper
    const bgSwiper = new Swiper(bgCmsWrap, {
      slidesPerView: 1,
      speed: 1200,
      loop: true,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      autoplay: {
        delay: 1300,
        disableOnInteraction: false,
      },
      controller: {
        control: textSwiper,
      },
      pagination: {
        el: component.querySelector(".temp-slider_bullet_wrap"),
        bulletActiveClass: "is-active",
        bulletClass: "temp-slider_bullet_item",
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
      },
    });
  });

/////// ABOUT PROJECTS SLIDER
document.querySelectorAll(".about-projects_component").forEach((component) => {
  // 1. Find the common parent
  const parentSection = component.closest(".section");
  if (!parentSection) return;

  // 2. Find the specific elements within that parent
  const bgCmsWrap = component.querySelector(".swiper.is-temp");
  const textCmsWrap = parentSection.querySelector(
    ".hero_text-slider_component .swiper"
  );

  if (!bgCmsWrap || !textCmsWrap) return;

  // Initialize Text Swiper
  const textSwiper = new Swiper(textCmsWrap, {
    direction: "vertical",
    slidesPerView: 1,
    speed: 1000,
    loop: true,
    allowTouchMove: false,
    parallax: true,
  });

  // Initialize Background Swiper
  const bgSwiper = new Swiper(bgCmsWrap, {
    slidesPerView: 1,
    speed: 1200,
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    autoplay: {
      delay: 1300,
      disableOnInteraction: false,
    },
    controller: {
      control: textSwiper,
    },
    navigation: {
      nextEl: component.querySelector(".next-btn"),
      prevEl: component.querySelector(".prev-btn"),
    },
  });
});

/////// DARK SECTIONS SWITCHER
const darkSections = document.querySelectorAll("[dark-section]");

darkSections.forEach((section) => {
  // Change the variables only inside the section
  //gsap.to(section, {
  // Change the variables globally
  gsap.to(document.documentElement, {
    // These must match the names of your Webflow Variables exactly
    "--_color-themes---text-color": "#ffffff",
    "--_color-themes---background-color": "#000000",
    duration: 1.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: section,
      start: "top 30%",
      end: "bottom 30%",
      // Reverts the variables to their original values when scrolling away
      toggleActions: "play reverse play reverse",
    },
  });
});

/////// PULSING NIP ANIMATION
gsap.to(".nip_inner", {
  scale: 1.2, // Subtle growth
  duration: 1.5, // Slower duration feels more "calm"
  repeat: -1, // Infinite loop
  yoyo: true, // Reverses the animation
  ease: "sine.inOut", // Natural acceleration/deceleration
  overwrite: "auto", // Prevents conflicts if other scripts touch these elements
});

/////// MARQUEE
$(".brands-marquee_component").each(function (index) {
  const swiper = new Swiper($(this).find(".swiper")[0], {
    slidesPerView: 2,
    spaceBetween: 8,
    speed: 5000,
    loop: true,
    allowTouchMove: false,
    centerInsufficientSlides: true,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    breakpoints: {
      // when it gets bigger than 478px
      478: {
        slidesPerView: 3,
        spaceBetween: 8,
      },
      //when it gets bigger than 991px
      768: {
        slidesPerView: 4,
        spaceBetween: 8,
      },
      // when it gets bigger than 991px
      991: {
        slidesPerView: 6,
        //slidesPerGroup: 2,
        spaceBetween: 24,
      },
    },
  });
});

/////// SWIPERONE LOGIC
document.addEventListener("DOMContentLoaded", () => {
  // Helper to init Swiper only if element exists
  const safeSwiper = (el, options) => (el ? new Swiper(el, options) : null);

  // 1. Find all "Project" components
  const components = document.querySelectorAll(".swiperone_component");

  components.forEach((component, index) => {
    // --- A. GALLERY LOGIC (Iterate over ALL gallery-containers) ---
    // CHANGED: Use querySelectorAll to find every gallery in this component
    const galleryWrappers = component.querySelectorAll(".gallery-container");

    galleryWrappers.forEach((galleryWrapper) => {
      const thumbEl = galleryWrapper.querySelector(".is-thumbs");
      const mainEl = galleryWrapper.querySelector(".is-main-image");

      // Initialize Thumbs
      const thumbsInstance = safeSwiper(thumbEl, {
        spaceBetween: 16,
        slidesPerView: 3,
        watchSlidesProgress: true,
        breakpoints: {
          640: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        },
      });

      // Initialize Main Image (linked to thumbs)
      if (thumbsInstance) {
        safeSwiper(mainEl, {
          spaceBetween: 0,
          effect: "fade",
          speed: 800,
          fadeEffect: { crossFade: true },
          thumbs: { swiper: thumbsInstance },
          // OPTIONAL: Add 'nested: true' if this gallery is inside another swiper
          // to prevent the parent from swiping when you swipe the gallery.
          nested: true,
        });
      }
    });

    // --- B. VISUAL MASTER ---
    const visualMaster = safeSwiper(
      component.querySelector(".is-visual-master"),
      {
        allowTouchMove: false,
        speed: 1000,
        effect: "creative",
        creativeEffect: {
          prev: {
            shadow: true,
            translate: ["-20%", 0, -1],
            opacity: 0,
            scale: 0.8,
          },
          next: { translate: ["100%", 0, 0] },
        },
      }
    );

    // --- C. TEXT SWIPER ---
    const textSwiper = safeSwiper(component.querySelector(".is-text-slide"), {
      speed: 1000,
      pagination: {
        el: component.querySelector(".custom-pagination"),
        clickable: true,
        renderBullet: (i, c) => `<span class="${c}">${i + 1}</span>`,
      },
      navigation: {
        nextEl: component.querySelector(".next-btn"),
        prevEl: component.querySelector(".prev-btn"),
      },
      on: {
        slideChange: function () {
          component.setAttribute("data-active-index", this.activeIndex);
        },
      },
    });

    // --- D. CONTROLLER SYNC ---
    if (textSwiper && visualMaster) {
      textSwiper.controller.control = visualMaster;
      visualMaster.controller.control = textSwiper;
    }
  });
});

////////// HEADQUARTER SLIDER
document
  .querySelectorAll(".headquarte-slider_component")
  .forEach((component) => {
    const cmsWrap = component.querySelector(".swiper");
    if (!cmsWrap) return;

    const swiper = new Swiper(cmsWrap, {
      slidesPerView: 1,
      speed: 800,
      loop: true,
      effect: "fade",
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: component.querySelector(".next-btn"),
        prevEl: component.querySelector(".prev-btn"),
      },
    });
  });

////////// LUTRON SLIDER
document.querySelectorAll(".lutron-slider_component").forEach((component) => {
  const cmsWrap = component.querySelector(".swiper");
  if (!cmsWrap) return;

  const swiper = new Swiper(cmsWrap, {
    slidesPerView: 1,
    speed: 800,
    loop: true,
    effect: "creative",
    creativeEffect: {
      prev: {
        shadow: true,
        translate: ["-20%", 0, -1],
        opacity: 0,
        scale: 0.8,
      },
      next: { translate: ["100%", 0, 0] },
    },
    // effect: "fade",
    // autoplay: {
    //   delay: 4000,
    //   disableOnInteraction: false,
    // },
    navigation: {
      nextEl: component.querySelector(".next-btn"),
      prevEl: component.querySelector(".prev-btn"),
    },
    pagination: {
      el: component.querySelector(".custom-pagination"),
      clickable: true,
      renderBullet: (i, c) => `<span class="${c} is-white">${i + 1}</span>`,
    },
  });
});

/////// PROJECTS THUMBS GALLERY
document.querySelectorAll(".project_card").forEach((component) => {
  const cmsWrap = component.querySelector(".swiper");
  if (!cmsWrap) return;

  const swiper = new Swiper(cmsWrap, {
    slidesPerView: 1,
    speed: 250,
    loop: true,
    effect: "fade",
    // autoplay: {
    //   delay: 4000,
    //   disableOnInteraction: false,
    // },
    navigation: {
      nextEl: component.querySelector(".next-btn"),
      prevEl: component.querySelector(".prev-btn"),
    },
  });
});

/////// FADE UP EFFECT
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, i) => {
          const el = entry.target;
          // Stagger only within the batch that entered together
          el.style.transitionDelay = `${i * 0.12}s`;
          el.classList.add("is-visible");
          // Clear the delay so later transitions (hover, filters) aren't held back
          el.addEventListener("transitionend", () => (el.style.transitionDelay = ""), { once: true });
          observer.unobserve(el);
        });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0 }
  );

  document.querySelectorAll("[fade-up]").forEach((el) => {
    const targets = el.getAttribute("fade-up") === "stagger" ? Array.from(el.children) : [el];
    targets.forEach((t) => observer.observe(t));
  });
});

//////////// COUNTERUP STATS
const counters = document.querySelectorAll(".counter-value");
const options = {
  // Use a negative bottom margin to move the "trigger line" up.
  // This example triggers when the element is 20% above the bottom of the screen.
  rootMargin: "0px 0px -10% 0px",
  threshold: 0,
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const rawValue = el.dataset.count; // Get as string first
      const value = parseFloat(rawValue);

      // Check if there's a decimal point and count the digits after it
      const decimalCount = rawValue.includes(".")
        ? rawValue.split(".")[1].length
        : 0;

      const counter = new countUp.CountUp(el, value, {
        duration: 2,
        separator: ",",
        decimalPlaces: decimalCount, // Dynamically set decimals
      });

      if (!counter.error) counter.start();
      observer.unobserve(el);
    }
  });
}, options);

counters.forEach((el) => observer.observe(el));

/////// CUSTOM CURSOR
function initBasicCustomCursor() {
  gsap.set(".cursor", { xPercent: -50, yPercent: -50 });

  let xTo = gsap.quickTo(".cursor", "x", { duration: 0.6, ease: "power3" });
  let yTo = gsap.quickTo(".cursor", "y", { duration: 0.6, ease: "power3" });

  window.addEventListener("mousemove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });
}

// Initialize Basic Custom Cursor (only on devices with a real mouse)
document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    initBasicCustomCursor();
  } else {
    gsap.set(".cursor", { display: "none" });
  }
});

/////// ARROWS INSIDE SLIDER BUTTONS
// Adds a thin chevron to every empty .prev-btn / .next-btn.
// The arrow color uses the same formula as the button border in Webflow,
// so it always matches it (also when the dark-section switcher changes the theme).
document.addEventListener("DOMContentLoaded", () => {
  const ARROW_SIZE = 10; // px
  const paths = {
    prev: "M7.5 2 L3.5 6 L7.5 10",
    next: "M4.5 2 L8.5 6 L4.5 10",
  };

  const style = document.createElement("style");
  style.textContent = `
    .nav-btn .a3-arrow { stroke: color-mix(in srgb, var(--_color-themes---text-color), transparent 70%); }
    .nav-btn.is-white .a3-arrow { stroke: color-mix(in srgb, var(--brand-colors--white), transparent 50%); }
  `;
  document.head.appendChild(style);

  document.querySelectorAll(".prev-btn, .next-btn").forEach((btn) => {
    if (btn.children.length) return; // leave buttons that already have content
    const dir = btn.classList.contains("prev-btn") ? "prev" : "next";
    btn.innerHTML =
      `<svg viewBox="0 0 12 12" width="${ARROW_SIZE}" height="${ARROW_SIZE}" aria-hidden="true" ` +
      `style="display:block;position:relative;top:50%;margin:0 auto;transform:translateY(-50%);` +
      `pointer-events:none;overflow:visible">` +
      `<path class="a3-arrow" d="${paths[dir]}" fill="none" stroke-width="1.25" ` +
      `stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  });
});

/////// PAUSE AUTOPLAY SLIDERS WHEN OFF-SCREEN
// Runs after all sliders above are initialized. Only touches sliders that
// have autoplay on; they stop when scrolled out of view and resume on return.
document.addEventListener("DOMContentLoaded", () => {
  if (!("IntersectionObserver" in window)) return;

  const autoplaySwipers = Array.from(document.querySelectorAll(".swiper"))
    .map((el) => el.swiper)
    .filter((sw) => sw && sw.params.autoplay && sw.params.autoplay.enabled);

  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const sw = entry.target.swiper;
        if (!sw || sw.destroyed) return;
        if (entry.isIntersecting) {
          if (!sw.autoplay.running) sw.autoplay.start();
        } else if (sw.autoplay.running) {
          sw.autoplay.stop();
        }
      });
    },
    { rootMargin: "100px 0px" }
  );

  autoplaySwipers.forEach((sw) => visibilityObserver.observe(sw.el));
});
})();
