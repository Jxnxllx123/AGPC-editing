
/* =========================================
   AGPC ANNOUNCEMENTS CAROUSEL

   This script:
   1. Loads announcement images.
   2. Displays one image at a time.
   3. Enables automatic sliding.
   4. Adds previous/next buttons.
   5. Adds pagination indicators.
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const announcementContainer =
        document.getElementById("announcements-list");

    // Stop if this page doesn't contain the announcements section
    if (!announcementContainer) return;

    // Stop if there are no announcements
    if (!ANNOUNCEMENTS || ANNOUNCEMENTS.length === 0) {
        document.querySelector(".announcements-section").style.display = "none";
        return;
    }


    /* =====================================
       1. DISPLAY ANNOUNCEMENT IMAGES
    ===================================== */

    announcementContainer.innerHTML = ANNOUNCEMENTS.map(function (item) {

        return `
            <div class="swiper-slide">
                <img
                    src="${item.image}"
                    alt="${item.alt}"
                    loading="lazy"
                    draggable="false"
                >
            </div>
        `;

    }).join("");


    /* =====================================
       2. INITIALISE SWIPER
    ===================================== */

    const shouldReduceMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const hasMultipleAnnouncements = ANNOUNCEMENTS.length > 1;

    new Swiper(".announcements-swiper", {

        slidesPerView: 1,
        spaceBetween: 20,

        // Loop only when there is more than one announcement
        loop: hasMultipleAnnouncements,

        // Automatically move to the next announcement
        autoplay: hasMultipleAnnouncements && !shouldReduceMotion
            ? {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            }
            : false,

        // Pagination dots
        pagination: {
            el: ".announcements-pagination",
            clickable: false
        },

        // Previous and next buttons
        navigation: {
            nextEl: ".announcements-next",
            prevEl: ".announcements-prev"
        },

        // Smooth transition
        speed: 700,

        // Allow touch/swipe on mobile
        allowTouchMove: hasMultipleAnnouncements,

        // Keyboard navigation
        keyboard: {
            enabled: true
        }

    });


    /* =====================================
       3. HIDE CONTROLS IF ONLY ONE IMAGE
    ===================================== */

    if (!hasMultipleAnnouncements) {

        document.querySelector(".announcements-controls").style.display = "none";

    }

});
