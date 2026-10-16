// =========================================================
// 📅 EVENTS UI SYSTEM
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  loadEvents();

  // Wait for events to be inserted before initializing Swiper
  requestAnimationFrame(() => {
    initUpcomingSwiper();
  });
});


// =========================================================
// 📌 LOAD UPCOMING EVENTS
// =========================================================

function loadEvents() {

  const now = new Date();
  const upcoming = document.getElementById("upcoming-events");

  if (!upcoming) return;

  upcoming.innerHTML = "";

  EVENTS.forEach(event => {

    let finalEvent = event;

    // Handle recurring events
    if (event.type === "recurring") {
      finalEvent = getNextOccurrence(event);
    }

    // Combine date + time for accurate comparison
    const eventDateTime = new Date(
      `${finalEvent.startDate.split("T")[0]}T${finalEvent.startTime || "00:00"}`
    );

    // Only show upcoming events
    if (eventDateTime >= now) {
      renderEvent(finalEvent);
    }

  });
}


// =========================================================
// 📌 RENDER EVENT CARD
// =========================================================

function renderEvent(event) {

  const container = document.getElementById("upcoming-events");

  if (!container) return;

  const start = new Date(event.startDate);

  const dateText = start.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short"
  });

  const timeText =
    (event.startTime && event.endTime)
      ? formatTimeRange(event.startTime, event.endTime)
      : "";

  const dateLine = timeText
    ? `${dateText} • ${timeText}`
    : dateText;

  container.innerHTML += `
    <div class="swiper-slide">

      <div class="event-card">

        ${event.flyer ? `
          <div class="event-flyer">
            <img
              src="${event.flyer}"
              alt="${event.title[currentLang]}"
            >
          </div>
        ` : ""}

        <div class="event-info">

          <h5 class="mb-1">
            ${event.title[currentLang]}
          </h5>

          ${event.subtitle ? `
            <p class="event-subtitle mb-1">
              ${event.subtitle[currentLang]}
            </p>
          ` : ""}

          <p class="text-muted mb-2">
            ${dateLine}
          </p>

          ${event.gallery?.length ? `
            <a
              class="btn btn-outline-primary btn-sm"
              onclick='openEventGallery("${event.id}")'
            >
              ${currentLang === "zh"
                ? "了解更多"
                : "Learn More"}
            </a>
          ` : ""}

        </div>

      </div>

    </div>
  `;
}


// =========================================================
// 🎠 UPCOMING EVENTS SWIPER
// =========================================================

function initUpcomingSwiper() {

  const swiperElement =
    document.querySelector(".upcoming-events-swiper");

  if (!swiperElement) return;

  const slideCount =
    document.querySelectorAll(
      "#upcoming-events .swiper-slide"
    ).length;

  new Swiper(".upcoming-events-swiper", {

    slidesPerView: 1.3,

    centeredSlides: true,

    spaceBetween: 20,

    loop: slideCount > 1,

    navigation: {
      nextEl: ".upcoming-events-swiper .swiper-button-next",
      prevEl: ".upcoming-events-swiper .swiper-button-prev",
    },

    pagination: {
      el: ".upcoming-events-swiper .swiper-pagination",
      clickable: true,
    },

    observer: true,
    observeParents: true,

    watchOverflow: true

  });
}


// =========================================================
// 🔁 RECURRING EVENTS
// =========================================================

function getNextOccurrence(event) {

  let date = new Date(
    `${event.startDate}T${event.startTime || "00:00"}`
  );

  const now = new Date();

  // -----------------------------------------
  // EVERY WEEK
  // -----------------------------------------

  if (event.recurrence === "weekly") {

    while (date < now) {

      date.setDate(date.getDate() + 7);

      // Skip fifth Saturday if required
      if (
        event.skipFifthSaturday &&
        isFifthSaturday(date)
      ) {

        date.setDate(date.getDate() + 7);

      }

    }

    // Also make sure the starting date itself
    // isn't a fifth Saturday
    while (
      event.skipFifthSaturday &&
      isFifthSaturday(date)
    ) {

      date.setDate(date.getDate() + 7);

    }

  }


  // -----------------------------------------
  // EVERY 2 WEEKS
  // -----------------------------------------

  else if (event.recurrence === "biweekly") {

    while (date < now) {

      date.setDate(date.getDate() + 14);

      // Skip fifth Saturday if required
      if (
        event.skipFifthSaturday &&
        isFifthSaturday(date)
      ) {

        date.setDate(date.getDate() + 14);

      }

    }

    while (
      event.skipFifthSaturday &&
      isFifthSaturday(date)
    ) {

      date.setDate(date.getDate() + 14);

    }

  }


  // -----------------------------------------
  // SAME DATE EVERY MONTH
  // -----------------------------------------

  else if (event.recurrence === "monthly") {

    const originalDay =
      new Date(event.startDate).getDate();

    while (date < now) {

      // Move to first day of next month first
      date.setDate(1);

      date.setMonth(date.getMonth() + 1);

      // Find last day of new month
      const lastDay =
        new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        ).getDate();

      // Use original day if possible,
      // otherwise use last day of month
      date.setDate(
        Math.min(originalDay, lastDay)
      );

    }

  }


  // -----------------------------------------
  // SPECIFIC WEEKDAY EVERY MONTH
  // -----------------------------------------
  //
  // Example:
  //
  // recurrence: "monthly-weekday"
  // week: 2
  // dayOfWeek: 6
  //
  // = 2nd Saturday of every month
  //
  // -----------------------------------------

  else if (
    event.recurrence === "monthly-weekday"
  ) {

    date =
      getMonthlyWeekdayOccurrence(
        event,
        now
      );

  }


  return {
    ...event,
    startDate: date.toISOString()
  };
}


// =========================================================
// 📅 MONTHLY WEEKDAY OCCURRENCE
// =========================================================
//
// week:
// 1 = first
// 2 = second
// 3 = third
// 4 = fourth
// 5 = fifth
//
// dayOfWeek:
// 0 = Sunday
// 1 = Monday
// 2 = Tuesday
// 3 = Wednesday
// 4 = Thursday
// 5 = Friday
// 6 = Saturday
// =========================================================

function getMonthlyWeekdayOccurrence(
  event,
  now
) {

  let year = now.getFullYear();
  let month = now.getMonth();

  while (true) {

    const date =
      getNthWeekdayOfMonth(
        year,
        month,
        event.dayOfWeek,
        event.week
      );

    if (date) {

      const eventDateTime =
        new Date(date);

      const [hours, minutes] =
        (event.startTime || "00:00")
          .split(":")
          .map(Number);

      eventDateTime.setHours(
        hours,
        minutes,
        0,
        0
      );

      if (eventDateTime >= now) {

        // Skip fifth Saturday if required
        if (
          event.skipFifthSaturday &&
          isFifthSaturday(date)
        ) {

          month++;

          if (month > 11) {
            month = 0;
            year++;
          }

          continue;
        }

        return date;

      }

    }

    month++;

    if (month > 11) {
      month = 0;
      year++;
    }

  }
}


// =========================================================
// 📅 FIND NTH WEEKDAY OF MONTH
// =========================================================

function getNthWeekdayOfMonth(
  year,
  month,
  dayOfWeek,
  week
) {

  const firstDay =
    new Date(
      year,
      month,
      1
    );

  const firstDayOfWeek =
    firstDay.getDay();

  const offset =
    (dayOfWeek - firstDayOfWeek + 7) % 7;

  const day =
    1 +
    offset +
    ((week - 1) * 7);

  const date =
    new Date(
      year,
      month,
      day,
      0,
      0,
      0
    );

  // Make sure the date didn't spill
  // into the next month
  if (
    date.getMonth() !== month
  ) {

    return null;

  }

  return date;
}


// =========================================================
// 📅 CHECK FOR FIFTH SATURDAY
// =========================================================

function isFifthSaturday(date) {

  // Not a Saturday
  if (date.getDay() !== 6) {
    return false;
  }

  const day =
    date.getDate();

  // 29, 30 or 31 can be the fifth Saturday
  return day >= 29;
}


// =========================================================
// ⏰ TIME FORMAT
// =========================================================

function formatTimeRange(
  start,
  end
) {

  const format = (time) => {

    const [h, m] =
      time.split(":")
        .map(Number);

    const suffix =
      h >= 12
        ? "PM"
        : "AM";

    const hour =
      h % 12 || 12;

    return `${hour}:${m
      .toString()
      .padStart(2, "0")} ${suffix}`;

  };

  return `${format(start)} – ${format(end)}`;
}


// =========================================================
// 🖼️ EVENT GALLERY MODAL
// =========================================================

let currentGallery = [];
let currentIndex = 0;


function openEventGallery(eventId) {

  const event =
    EVENTS.find(
      e => e.id === eventId
    );

  if (
    !event ||
    !event.gallery?.length
  ) {
    return;
  }

  currentGallery =
    event.gallery;

  currentIndex = 0;

  renderGallery();

  const modal =
    new bootstrap.Modal(
      document.getElementById(
        "galleryModal"
      )
    );

  modal.show();
}


// =========================================================
// 🖼️ RENDER GALLERY
// =========================================================

function renderGallery() {

  const mainImg =
    document.getElementById(
      "mainGalleryImage"
    );

  const strip =
    document.getElementById(
      "thumbnailStrip"
    );

  if (
    !mainImg ||
    !strip
  ) {
    return;
  }

  mainImg.src =
    currentGallery[
      currentIndex
    ];

  strip.innerHTML = "";

  currentGallery.forEach(
    (img, index) => {

      strip.innerHTML += `
        <img
          src="${img}"
          onclick="switchImage(${index})"
          style="
            width:70px;
            height:70px;
            object-fit:cover;
            cursor:pointer;
            border:2px solid ${
              index === currentIndex
                ? "white"
                : "transparent"
            };
            opacity:${
              index === currentIndex
                ? "1"
                : "0.6"
            };
            border-radius:8px;
          "
        >
      `;

    }
  );
}


// =========================================================
// 🖼️ SWITCH GALLERY IMAGE
// =========================================================

function switchImage(index) {

  currentIndex = index;

  renderGallery();

}
