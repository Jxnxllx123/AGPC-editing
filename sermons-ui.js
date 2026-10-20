/* =========================================================
   AGPC SERMONS — UI LOGIC
   Features:
   - Featured sermons
   - All sermons archive
   - English / Chinese / Combined filters
   - Search
   - Pagination
========================================================= */

const SERMON_PAGE_SIZE = 6;

const sermonPages = {
  all: 1,
  en: 1,
  zh: 1,
  both: 1
};

let sermonSearchQuery = "";

// =========================================================
// INITIALISATION
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("sermonSearch");

  if (searchInput) {
    searchInput.addEventListener("input", event => {
      sermonSearchQuery = event.target.value.trim().toLowerCase();

      resetSermonPages();
      renderAllSermonViews();
    });
  }

  // Reset pagination when the visitor changes tabs.
  document.querySelectorAll("#sermonTabs [data-bs-toggle='tab']")
    .forEach(tab => {
      tab.addEventListener("shown.bs.tab", () => {
        resetSermonPages();
        renderAllSermonViews();
      });
    });

  renderAllSermonViews();
});

// =========================================================
// MAIN RENDERER
// =========================================================

function renderAllSermonViews() {
  renderFeaturedSermons();
  renderSermonPage("all");
  renderSermonPage("en");
  renderSermonPage("zh");
  renderSermonPage("both");
}

function resetSermonPages() {
  sermonPages.all = 1;
  sermonPages.en = 1;
  sermonPages.zh = 1;
  sermonPages.both = 1;
}

// =========================================================
// LANGUAGE
// =========================================================

function getSermonLanguage() {
  // Reuse the website's existing language setting if available.
  if (typeof currentLang !== "undefined") {
    return currentLang === "zh" ? "zh" : "en";
  }

  return document.documentElement.lang === "zh" ? "zh" : "en";
}

function getLocalizedValue(value) {
  if (typeof value === "string") return value;

  if (value && typeof value === "object") {
    const lang = getSermonLanguage();
    return value[lang] || value.en || value.zh || "";
  }

  return "";
}

function getSermonTitle(sermon) {
  return getLocalizedValue(sermon.title);
}

function getSermonPastor(sermon) {
  return getLocalizedValue(sermon.pastor);
}

// =========================================================
// DATE HELPERS
// Supports DD/MM/YYYY and readable month formats.
// =========================================================

function getSermonDate(value) {
  if (!value) return null;

  const input = String(value).trim();

  // Explicitly parse DD/MM/YYYY to avoid US date ambiguity.
  const numeric = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (numeric) {
    const day = Number(numeric[1]);
    const month = Number(numeric[2]);
    const year = Number(numeric[3]);

    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    date.setHours(0, 0, 0, 0);
    return date;
  }

  // Also supports dates such as "8 Sept 2024".
  const parsed = new Date(input);

  if (Number.isNaN(parsed.getTime())) return null;

  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

function getDateKey(date) {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(value) {
  const date = getSermonDate(value);

  if (!date) return String(value || "");

  return new Intl.DateTimeFormat(
    getSermonLanguage() === "zh" ? "zh-SG" : "en-SG",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  ).format(date);
}

// =========================================================
// TIME HELPERS
// =========================================================

function formatTimeRange(start, end) {
  if (!start || !end) return "";

  function formatTime(value) {
    const match = String(value).trim().match(
      /^(\d{1,2}):(\d{2})$/
    );

    if (!match) return String(value);

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (hours > 23 || minutes > 59) return String(value);

    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;

    return `${displayHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
  }

  return `${formatTime(start)} – ${formatTime(end)}`;
}

function getSermonDateLine(sermon) {
  const date = formatDate(sermon.date);

  if (!sermon.time) return date;

  const parts = String(sermon.time).split(/\s*-\s*/);

  if (parts.length !== 2) return date;

  const time = formatTimeRange(parts[0], parts[1]);

  return time ? `${date} · ${time}` : date;
}

// =========================================================
// SERVICE LABELS
// =========================================================

function getServiceLabel(sermon) {
  if (sermon.lang === "both") {
    return getSermonLanguage() === "zh"
      ? "联合崇拜"
      : "COMBINED SERVICE";
  }

  if (sermon.lang === "zh") {
    return getSermonLanguage() === "zh"
      ? "华语崇拜"
      : "CHINESE SERVICE";
  }

  return getSermonLanguage() === "zh"
    ? "英语崇拜"
    : "ENGLISH SERVICE";
}

// =========================================================
// SAFE HTML HELPERS
// =========================================================

function escapeSermonHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function getSermonVideoURL(sermon) {
  const value = String(sermon.video || "").trim();

  if (!value) return "";

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return "";
    }

    return url.href;
  } catch {
    return "";
  }
}

function hasSermonVideo(sermon) {
  return Boolean(getSermonVideoURL(sermon));
}

// =========================================================
// SEARCH AND FILTERING
// =========================================================

function matchesSermonSearch(sermon) {
  if (!sermonSearchQuery) return true;

  // Search both languages for bilingual records.
  const searchableValues = [
    sermon.title,
    sermon.pastor,
    sermon.date,
    sermon.time,
    getServiceLabel(sermon)
  ];

  const text = searchableValues
    .map(value => {
      if (value && typeof value === "object") {
        return Object.values(value).join(" ");
      }

      return String(value || "");
    })
    .join(" ")
    .toLowerCase();

  return text.includes(sermonSearchQuery);
}

function matchesSermonTab(sermon, tab) {
  switch (tab) {
    case "all":
      return ["en", "zh", "both"].includes(sermon.lang);

    case "en":
      return sermon.lang === "en" || sermon.lang === "both";

    case "zh":
      return sermon.lang === "zh" || sermon.lang === "both";

    case "both":
      return sermon.lang === "both";

    default:
      return false;
  }
}

function getSermonsForTab(tab) {
  if (!Array.isArray(window.SERMONS)) return [];

  return window.SERMONS
    .filter(sermon => {
      return (
        matchesSermonTab(sermon, tab) &&
        hasSermonVideo(sermon) &&
        matchesSermonSearch(sermon)
      );
    })
    .sort((a, b) => {
      const dateA = getSermonDate(a.date);
      const dateB = getSermonDate(b.date);

      // Undated records go last.
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;

      return dateB - dateA;
    });
}

// =========================================================
// FEATURED SERMONS
// Uses the nearest upcoming date when one exists;
// otherwise uses the latest available sermon date.
// A combined service takes priority on its date.
// =========================================================

function renderFeaturedSermons() {
  const container = document.getElementById("featured-sermons");

  // The featured section must exist in Sermons.html.
  if (!container) return;

  const sermons = Array.isArray(window.SERMONS)
    ? window.SERMONS.filter(sermon => {
        return (
          ["en", "zh", "both"].includes(sermon.lang) &&
          getSermonDate(sermon.date)
        );
      })
    : [];

  if (!sermons.length) {
    container.innerHTML = `
      <p class="text-center">No featured sermons available.</p>
    `;
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = sermons
    .filter(sermon => getSermonDate(sermon.date) >= today)
    .sort((a, b) => getSermonDate(a.date) - getSermonDate(b.date));

  const datedSermons = [...sermons].sort(
    (a, b) => getSermonDate(b.date) - getSermonDate(a.date)
  );

  // Prefer the nearest upcoming service date.
  // If there are no upcoming dates, use the latest past date.
  const selectedDate = upcoming.length
    ? getSermonDate(upcoming[0].date)
    : getSermonDate(datedSermons[0].date);

  const selectedKey = getDateKey(selectedDate);

  const sameDate = sermons.filter(sermon => {
    return getDateKey(getSermonDate(sermon.date)) === selectedKey;
  });

  const combined = sameDate.find(sermon => sermon.lang === "both");

  const featured = combined
    ? [combined]
    : sameDate.filter(sermon => sermon.lang === "en" || sermon.lang === "zh");

  if (!featured.length) {
    container.innerHTML = `
      <p class="text-center">No featured sermons available.</p>
    `;
    return;
  }

  container.innerHTML = featured.map(sermon => {
    const title = escapeSermonHTML(getSermonTitle(sermon));
    const pastor = escapeSermonHTML(getSermonPastor(sermon));
    const label = escapeSermonHTML(getServiceLabel(sermon));
    const dateLine = escapeSermonHTML(getSermonDateLine(sermon));
    const videoURL = getSermonVideoURL(sermon);

    return `
      <article class="col-12 ${featured.length > 1 ? "col-md-6" : ""}">
        <div class="featured-sermon-card">
          <span class="sermon-service-label">${label}</span>

          <h3 class="featured-sermon-title">${title}</h3>

          <p class="featured-sermon-pastor">${pastor}</p>

          <p class="featured-sermon-meta">${dateLine}</p>

          ${
            videoURL
              ? `
                <div class="sermon-video-wrapper">
                  <iframe
                    src="${escapeSermonHTML(videoURL)}"
                    title="${title}"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                  </iframe>
                </div>
              `
              : `
                <p class="featured-sermon-notice">
                  ${sermon.lang === "both"
                    ? "Combined service"
                    : "Service"} · Video coming soon
                </p>
              `
          }
        </div>
      </article>
    `;
  }).join("");
}

// =========================================================
// ARCHIVE RENDERING
// =========================================================

function getGridID(tab) {
  return {
    all: "all-sermons-grid",
    en: "english-grid",
    zh: "chinese-grid",
    both: "combined-grid"
  }[tab];
}

function getPaginationID(tab) {
  return {
    all: "all-pagination",
    en: "en-pagination",
    zh: "zh-pagination",
    both: "both-pagination"
  }[tab];
}

function renderSermonPage(tab) {
  const grid = document.getElementById(getGridID(tab));
  const pagination = document.getElementById(getPaginationID(tab));

  if (!grid) return;

  const sermons = getSermonsForTab(tab);
  const totalPages = Math.ceil(sermons.length / SERMON_PAGE_SIZE);

  if (totalPages === 0) {
    sermonPages[tab] = 1;
  } else {
    sermonPages[tab] = Math.min(
      Math.max(1, sermonPages[tab]),
      totalPages
    );
  }

  if (sermons.length === 0) {
    grid.innerHTML = `
      <p class="text-center sermon-empty-state">
        No sermons found.
      </p>
    `;

    if (pagination) pagination.innerHTML = "";
    return;
  }

  const start = (sermonPages[tab] - 1) * SERMON_PAGE_SIZE;
  const visibleSermons = sermons.slice(start, start + SERMON_PAGE_SIZE);

  grid.innerHTML = visibleSermons.map(sermon => {
    const title = escapeSermonHTML(getSermonTitle(sermon));
    const pastor = escapeSermonHTML(getSermonPastor(sermon));
    const label = escapeSermonHTML(getServiceLabel(sermon));
    const dateLine = escapeSermonHTML(getSermonDateLine(sermon));
    const videoURL = escapeSermonHTML(getSermonVideoURL(sermon));

    return `
      <article class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="sermon-card">
          <span class="sermon-service-label">${label}</span>

          <div class="sermon-video-wrapper">
            <iframe
              src="${videoURL}"
              title="${title}"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
            </iframe>
          </div>

          <div class="sermon-info mt-3">
            <h3 class="sermon-title">${title}</h3>
            <p class="sermon-meta">${pastor} · ${dateLine}</p>
          </div>
        </div>
      </article>
    `;
  }).join("");

  renderSermonPagination(tab, sermons.length);
}

// =========================================================
// PAGINATION
// =========================================================

function renderSermonPagination(tab, totalItems) {
  const pagination = document.getElementById(getPaginationID(tab));

  if (!pagination) return;

  const totalPages = Math.ceil(totalItems / SERMON_PAGE_SIZE);

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  const current = sermonPages[tab];

  let html = `
    <button
      type="button"
      class="page-arrow ${current === 1 ? "disabled" : ""}"
      ${current === 1 ? "disabled" : ""}
      aria-label="Previous page"
      onclick="goToSermonPage('${tab}', ${current - 1})">
      &lt;
    </button>
  `;

  for (let page = 1; page <= totalPages; page++) {
    html += `
      <button
        type="button"
        class="page-number ${page === current ? "active" : ""}"
        ${page === current ? 'aria-current="page"' : ""}
        aria-label="Page ${page}"
        onclick="goToSermonPage('${tab}', ${page})">
        ${page}
      </button>
    `;
  }

  html += `
    <button
      type="button"
      class="page-arrow ${current === totalPages ? "disabled" : ""}"
      ${current === totalPages ? "disabled" : ""}
      aria-label="Next page"
      onclick="goToSermonPage('${tab}', ${current + 1})">
      &gt;
    </button>
  `;

  pagination.innerHTML = html;
}

function goToSermonPage(tab, page) {
  const sermons = getSermonsForTab(tab);
  const totalPages = Math.ceil(sermons.length / SERMON_PAGE_SIZE);

  if (page < 1 || page > totalPages) return;

  sermonPages[tab] = page;
  renderSermonPage(tab);

  // Return to the beginning of the archive grid.
  const grid = document.getElementById(getGridID(tab));

  if (grid) {
    grid.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
