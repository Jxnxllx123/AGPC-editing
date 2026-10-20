// =========================================================
// 📖 SERMONS UI LOGIC
// =========================================================

const pageSize = 6;
let currentPage = { en: 1, zh: 1, both: 1 };
let searchQuery = ""; // ✅ move to top

document.addEventListener("DOMContentLoaded", () => {
  renderHomepageSermons();

  renderSermonPage("en");
  renderSermonPage("zh");
  renderSermonPage("both");

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

function renderHomepageSermons() {
  const container = document.getElementById("latest-sermons");
  if (!container) return;

  const now = new Date();

  const upcoming = SERMONS
    .filter(s => {
      const date = parseDate(s.date);
      return date && date >= now;
    })
    .sort((a, b) => parseDate(a.date) - parseDate(b.date));

  if (!upcoming.length) {
    container.innerHTML = `
      <p class="text-center">
        No upcoming sermons at the moment.
      </p>`;
    return;
  }

  // Find the nearest upcoming calendar date
  const nextDate = parseDate(upcoming[0].date);

  const dateKey = d =>
    `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  const nextKey = dateKey(nextDate);

  const nextSermons = upcoming.filter(
    s => dateKey(parseDate(s.date)) === nextKey
  );

  // A combined service takes priority on that date
  const combined = nextSermons.find(s => s.lang === "both");

  const selected = combined
    ? [combined]
    : nextSermons.filter(s => s.lang === "en" || s.lang === "zh");

  container.innerHTML = selected.map(s => {
    const bilingual = s.lang === "both";

    const titleEn = bilingual ? s.title.en : s.title;
    const titleZh = bilingual ? s.title.zh : "";

    const pastorEn = bilingual ? s.pastor.en : s.pastor;
    const pastorZh = bilingual ? s.pastor.zh : "";

    const timeText = s.time
      ? formatTimeRange(...s.time.split(" - "))
      : "";

    const dateText = formatDate(s.date);

    return `
      <div class="col-12 ${selected.length > 1 ? "col-md-6" : ""}">
        <div class="upcoming-sermon-card">
          <span class="upcoming-label">
            ${bilingual ? "COMBINED SERVICE" :
              s.lang === "zh" ? "华语崇拜" : "ENGLISH SERVICE"}
          </span>

          <h3>${titleEn}</h3>

          ${bilingual ? `<h4 class="upcoming-title-zh">${titleZh}</h4>` : ""}

          <p class="upcoming-speaker">
            ${pastorEn}${bilingual ? ` / ${pastorZh}` : ""}
          </p>

          <div class="upcoming-meta">
            <span>📅 ${dateText}</span>
            ${timeText ? `<span>◷ ${timeText}</span>` : ""}
          </div>
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
      const hasVideo =
        typeof s.video === "string" &&
        s.video.trim() !== "";

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
  let paginationId;

  if (lang === "en") paginationId = "en-pagination";
  if (lang === "zh") paginationId = "zh-pagination";
  if (lang === "both") paginationId = "both-pagination";

  const pagination = document.getElementById(paginationId);
  if (!pagination) return;

  // Clear old controls before checking the page count
  pagination.innerHTML = "";

  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return;

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
