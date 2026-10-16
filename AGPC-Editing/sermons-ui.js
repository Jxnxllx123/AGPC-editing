// =========================================================
// 📖 SERMONS UI LOGIC
// =========================================================

const pageSize = 6;
let currentPage = { en: 1, zh: 1, both: 1 };
let searchQuery = ""; // ✅ move to top

document.addEventListener("DOMContentLoaded", () => {
  renderHomepageSermons(2);
  renderSermonPage("en");
  renderSermonPage("zh");
  renderSermonPage("both");

  // 🔍 SEARCH LISTENER
  const searchInput = document.getElementById("sermonSearch");
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
  }
});

// =====================
// SEARCH
// =====================
function handleSearch(e) {
  searchQuery = e.target.value.toLowerCase();

  // reset pages when searching
  currentPage = { en: 1, zh: 1, both: 1 };

  renderSermonPage("en");
  renderSermonPage("zh");
  renderSermonPage("both");
}

// =====================
// HOMEPAGE
// =====================
function renderHomepageSermons(count = 2) {
  const container = document.getElementById("latest-sermons");
  if (!container) return;

  const now = new Date();

  let upcoming = SERMONS
    .filter(s => parseDate(s.date) >= now)
    .sort((a, b) => parseDate(a.date) - parseDate(b.date))
    .slice(0, count);

  if (upcoming.length === 0) {
    upcoming = [...SERMONS]
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))
      .slice(0, count);
  }

  container.innerHTML = upcoming.map(s => {

    let timeText = "";
    if (s.time) {
      const [start, end] = s.time.split(" - ");
      timeText = formatTimeRange(start, end);
    }

    const dateLine = timeText
      ? `${formatDate(s.date)} • ${timeText}`
      : formatDate(s.date);

    return `
      <div class="col-md-6">
        <div class="card p-3 text-center">
          <h5>${typeof s.title === "object" ? s.title[currentLang] : s.title}</h5>
          <p>
            ${typeof s.pastor === "object" ? s.pastor[currentLang] : s.pastor}
            • ${dateLine}
          </p>
        </div>
      </div>
    `;
  }).join("");
}

// =====================
// SERMON PAGE
// =====================
function renderSermonPage(lang) {
  let containerId;
  if (lang === "en") containerId = "english-grid";
  if (lang === "zh") containerId = "chinese-grid";
  if (lang === "both") containerId = "combined-grid";

  const data = SERMONS
    .filter(s => {
      const matchesLang = (lang === "both" ? s.lang === "both" : s.lang === lang);
      const hasVideo = s.video;

      const title = typeof s.title === "object" ? s.title[currentLang] : s.title;
      const pastor = typeof s.pastor === "object" ? s.pastor[currentLang] : s.pastor;

      // ✅ SAFE SEARCH
      const safeTitle = (title || "").toLowerCase();
      const safePastor = (pastor || "").toLowerCase();

      const matchesSearch =
        !searchQuery ||
        safeTitle.includes(searchQuery) ||
        safePastor.includes(searchQuery);

      return matchesLang && hasVideo && matchesSearch;
    })
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  // ✅ NO RESULTS MESSAGE
  if (data.length === 0) {
    container.innerHTML = `<p class="text-center">No sermons found.</p>`;
    return;
  }

  const start = (currentPage[lang] - 1) * pageSize;
  const pageItems = data.slice(start, start + pageSize);

  pageItems.forEach(s => {
    const dateLine = s.time
      ? `${formatDate(s.date)} • ${formatTimeRange(...s.time.split(" - "))}`
      : formatDate(s.date);

    container.innerHTML += `
      <div class="col mb-4">
        <div class="sermon-card">
          <div class="sermon-video-wrapper">
            <iframe 
              src="${s.video}" 
              title="${getSermonTitle(s)}" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>
          <div class="sermon-info mt-2">
            <h5 class="sermon-title">${getSermonTitle(s)}</h5>
            <p class="sermon-meta">
              ${typeof s.pastor === "object" ? s.pastor[currentLang] : s.pastor} • ${dateLine}
            </p>
          </div>
        </div>
      </div>
    `;
  });

  renderPagination(lang, data.length);
}

// =====================
// PAGINATION
// =====================
function renderPagination(lang, totalItems) {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return;

  let paginationId;
  if (lang === "en") paginationId = "en-pagination";
  if (lang === "zh") paginationId = "zh-pagination";
  if (lang === "both") paginationId = "both-pagination";

  const pagination = document.getElementById(paginationId);
  if (!pagination) return;

  pagination.innerHTML = "";

  // ⬅️ PREV
  pagination.innerHTML += `
    <span class="page-arrow ${currentPage[lang] === 1 ? 'disabled' : ''}"
      onclick="${currentPage[lang] === 1 ? '' : `goToPage('${lang}', ${currentPage[lang] - 1})`}">
      &lt;
    </span>
  `;

  // 🔢 NUMBERS
  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <span class="page-number ${i === currentPage[lang] ? 'active' : ''}"
        onclick="goToPage('${lang}', ${i})">
        ${i}
      </span>
    `;
  }

  // ➡️ NEXT
  pagination.innerHTML += `
    <span class="page-arrow ${currentPage[lang] === totalPages ? 'disabled' : ''}"
      onclick="${currentPage[lang] === totalPages ? '' : `goToPage('${lang}', ${currentPage[lang] + 1})`}">
      &gt;
    </span>
  `;
}

// =====================
// NAVIGATION
// =====================
function goToPage(lang, page) {
  currentPage[lang] = page;
  renderSermonPage(lang);
}

// =====================
// HELPERS
// =====================
function getSermonTitle(s) {
  if (s.lang === "both") return s.title[currentLang];
  return s.title;
}

function formatTimeRange(start, end) {
  if (!start || !end) return "";

  const format = (time) => {
    const [h, m] = time.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
  };

  return `${format(start)} – ${format(end)}`;
}