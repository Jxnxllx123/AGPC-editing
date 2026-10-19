// =========================================================
// 📅 EVENTS UI SYSTEM
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    if (document.body.classList.contains("events-page")) {
        loadDetailedEvents();
    } else {
        loadEvents();
        initUpcomingSwiper();
    }
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
  const dateText = start.toLocaleDateString(
    currentLang === "zh" ? "zh-CN" : "en-GB",
    { day: "numeric", month: "short" }
  );

  const timeText =
    event.startTime && event.endTime
      ? formatTimeRange(event.startTime, event.endTime)
      : "";

  const dateLine = timeText
    ? `${dateText} · ${timeText}`
    : dateText;

  const title = event.title[currentLang];
  const subtitle = event.subtitle?.[currentLang] || "";

  container.innerHTML += `
    <div class="swiper-slide">
      <article class="event-card event-card-image">

        <div class="event-flyer">
          ${event.image ? `
            <img
              src="${event.image}"
              alt=""
              aria-hidden="true"
            >
          ` : ""}
        </div>

        <div class="event-info">
          <span class="event-card-eyebrow">
            ${currentLang === "zh" ? "即将举行" : "UPCOMING EVENT"}
          </span>

          <h3>${title}</h3>

          ${subtitle ? `
            <p class="event-subtitle">${subtitle}</p>
          ` : ""}

          <p class="event-card-date">${dateLine}</p>

          ${event.gallery?.length ? `
            <button
              type="button"
              class="event-card-button"
              onclick="openEventGallery('${event.id}')"
            >
              ${currentLang === "zh" ? "了解更多" : "Learn More"}
              <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
            </button>
          ` : ""}
        </div>

      </article>
    </div>
  `;
}


// =========================================================
// 🎠 UPCOMING EVENTS SWIPER
// =========================================================



function initUpcomingSwiper() {
  const swiperElement = document.querySelector(
    ".upcoming-events-swiper"
  );

  if (!swiperElement) return;

  const slideCount = document.querySelectorAll(
    "#upcoming-events .swiper-slide"
  ).length;

  // Prevent duplicate Swiper instances
  if (swiperElement.swiper) {
    swiperElement.swiper.destroy(true, true);
  }

  new Swiper(swiperElement, {
    slidesPerView: 1,
    slidesPerGroup: 1,

    // More breathing room between cards
    spaceBetween: 24,

    loop: slideCount > 2,

    navigation: {
      nextEl: ".events-next",
      prevEl: ".events-prev"
    },

    pagination: {
      el: ".upcoming-events-swiper .swiper-pagination",
      clickable: true
    },

    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },

    speed: 700,

    breakpoints: {
      576: {
        slidesPerView: 1.5,
        spaceBetween: 24
      },
      768: {
        slidesPerView: 1.5,
        spaceBetween: 28
      },
      992: {
        slidesPerView: 1.5,
        spaceBetween: 32
      },
      1200: {
        slidesPerView: 1.6,
        spaceBetween: 36
      }
    },

    observer: true,
    observeParents: true,
    watchOverflow: true
  });
}




function loadDetailedEvents() {
    const container = document.getElementById(
        "events-list-container"
    );

    if (!container || !window.EVENTS) return;

    const now = new Date();

    const upcomingEvents = EVENTS
        .map(event => {
            const nextEvent = event.type === "recurring"
                ? getNextOccurrence(event)
                : event;

            return nextEvent;
        })
        .filter(event => {
            const date = new Date(
                `${event.startDate.split("T")[0]}T${event.startTime || "00:00"}`
            );

            return date >= now;
        })
        .sort((a, b) => {
            const dateA = new Date(
                `${a.startDate.split("T")[0]}T${a.startTime || "00:00"}`
            );

            const dateB = new Date(
                `${b.startDate.split("T")[0]}T${b.startTime || "00:00"}`
            );

            return dateA - dateB;
        });

    if (!upcomingEvents.length) {
        container.innerHTML = `
            <p class="events-empty"
               data-en="There are no upcoming events at the moment."
               data-zh="目前没有即将举行的活动。">
                There are no upcoming events at the moment.
            </p>
        `;
        return;
    }

    container.innerHTML = upcomingEvents.map(
        (event, index) => renderDetailedEvent(event, index)
    ).join("");

    // Reapply the active language to newly rendered content.
    if (typeof applyLanguage === "function") {
        applyLanguage(currentLang);
    }
}


function renderDetailedEvent(event, index) {
    const lang = typeof currentLang === "string"
        ? currentLang
        : "en";

    const title = event.title?.[lang] || event.title?.en || "";
    const subtitle = event.subtitle?.[lang] || "";
    const description = event.description?.[lang] || "";
    const location = event.location?.[lang] || "";

    const date = new Date(
        `${event.startDate.split("T")[0]}T00:00:00`
    );

    const dateText = date.toLocaleDateString(
        lang === "zh" ? "zh-CN" : "en-GB",
        {
            day: "numeric",
            month: "short"
        }
    );

    const weekday = date.toLocaleDateString(
        lang === "zh" ? "zh-CN" : "en-GB",
        { weekday: "short" }
    );

    const time = event.startTime && event.endTime
        ? formatTimeRange(event.startTime, event.endTime)
        : event.startTime || "";

    const gallery = Array.isArray(event.gallery)
        ? event.gallery
        : [];

    const image = event.image
        ? `<img class="timeline-event-image"
                src="${event.image}"
                alt="">`
        : "";

    const galleryMarkup = gallery.length
        ? `
            <div class="event-photo-grid">
                ${gallery.map((src, photoIndex) => `
                    <button type="button"
                            class="event-photo"
                            onclick="openEventGallery('${event.id}', ${photoIndex})"
                            aria-label="${lang === "zh" ? "查看照片" : "View photo"} ${photoIndex + 1}">
                        <img src="${src}" alt="${title}">
                    </button>
                `).join("")}
            </div>
        `
        : "";

    const hasDetails = description || location || gallery.length;

    return `
        <article class="timeline-event" style="--event-index:${index}">
            <div class="timeline-date">
                <span class="timeline-weekday">${weekday}</span>
                <span class="timeline-day">${date.getDate()}</span>
                <span class="timeline-month">
                    ${date.toLocaleDateString(
                        lang === "zh" ? "zh-CN" : "en-GB",
                        { month: "short" }
                    )}
                </span>
            </div>

            <div class="timeline-event-card">
                ${image}

                <div class="timeline-event-content">
                    <span class="event-card-eyebrow">
                        ${lang === "zh" ? "即将举行" : "UPCOMING EVENT"}
                    </span>

                    <h3>${title}</h3>

                    ${subtitle ? `<p class="event-subtitle">${subtitle}</p>` : ""}

                    <p class="event-card-date">
                        ${dateText}${time ? ` · ${time}` : ""}
                    </p>

                    ${location ? `<p class="event-location">${location}</p>` : ""}

                    ${hasDetails ? `
                        <details class="event-details">
                            <summary>
                                ${lang === "zh" ? "了解更多" : "Explore event"}
                            </summary>

                            ${description ? `<p class="event-description">${description}</p>` : ""}

                            ${galleryMarkup}
                        </details>
                    ` : ""}
                </div>
            </div>
        </article>
    `;
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
    startDate: [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-")
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
