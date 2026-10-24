
/* =========================================================
   AGPC SERMONS UI
   - Featured latest sermon
   - All sermons archive
   - English, Chinese and Combined filters
   - Search and pagination
========================================================= */


const pageSize = 6;

let currentPage = {
    all: 1,
    en: 1,
    zh: 1,
    both: 1
};

let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
    renderHomepageSermons();
    renderFeaturedSermons();
    renderSermonArchive();
    initializeSermonFilters();
    initializeSermonModal();

    const searchInput = document.getElementById("sermonSearch");

    if (searchInput) {
        searchInput.addEventListener("input", event => {
            searchQuery = event.target.value.trim().toLowerCase();

            currentPage = {
                all: 1,
                en: 1,
                zh: 1,
                both: 1
            };

            renderSermonArchive();
        });
    }
});

function initializeSermonFilters() {
    const buttons = document.querySelectorAll(
        "#sermonTabs .sermon-filter"
    );

    const paneIds = {
        all: "all-sermons",
        en: "english",
        zh: "chinese",
        both: "combined"
    };

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;
            const targetId = paneIds[filter];

            if (!targetId) return;

            buttons.forEach(item => {
                const selected = item === button;

                item.classList.toggle("active", selected);
                item.setAttribute(
                    "aria-pressed",
                    String(selected)
                );
            });

            document.querySelectorAll(
                "#sermonTabContent .tab-pane"
            ).forEach(pane => {
                const selected = pane.id === targetId;

                pane.classList.toggle("active", selected);
                pane.classList.toggle("show", selected);
            });
        });
    });
}



/* =========================================================
   HOMEPAGE UPCOMING SERMONS
   Keep this separate from the video archive.
========================================================= */

function renderHomepageSermons() {
  const container = document.getElementById("latest-sermons");
  if (!container) return;

  const upcoming = SERMONS
    .filter(s => {
      const date = parseDate(s.date);
      return date && date >= new Date(new Date().setHours(0, 0, 0, 0));
    })
    .sort((a, b) => parseDate(a.date) - parseDate(b.date));

  if (!upcoming.length) {
    container.innerHTML = `
      <p class="text-center">No upcoming sermons at the moment.</p>
    `;
    return;
  }

  const nextDate = parseDate(upcoming[0].date);
  const dateKey = d =>
    `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  const nextSermons = upcoming.filter(
    s => dateKey(parseDate(s.date)) === dateKey(nextDate)
  );

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

    return `
      <div class="col-12 ${selected.length > 1 ? "col-md-6" : ""}">
        <div class="upcoming-sermon-card">
          <span class="upcoming-label">
            ${getServiceLabel(s.lang)}
          </span>

          <h3>${escapeHtml(titleEn)}</h3>

          ${bilingual
            ? `<h4 class="upcoming-title-zh">${escapeHtml(titleZh)}</h4>`
            : ""}

          <p class="upcoming-speaker">
            ${escapeHtml(pastorEn)}${bilingual
              ? ` / ${escapeHtml(pastorZh)}`
              : ""}
          </p>

          <div class="upcoming-meta">
            <span>📅 ${formatDate(s.date)}</span>
            ${timeText ? `<span>◷ ${timeText}</span>` : ""}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

/* =========================================================
   ARCHIVE INITIALISATION
========================================================= */

function renderSermonArchive() {
    renderSermonPage("all");
    renderSermonPage("en");
    renderSermonPage("zh");
    renderSermonPage("both");
}

/* =========================================================
   LATEST SUNDAY MESSAGES
   Normal Sunday: English + Chinese
   Combined Sunday: One combined sermon
========================================================= */


function renderFeaturedSermons() {
    const container = document.getElementById("featured-sermons");
    if (!container) return;

    const datedSermons = SERMONS
        .map(sermon => ({
            sermon,
            date: parseDate(sermon.date)
        }))
        .filter(item =>
            item.date instanceof Date &&
            !Number.isNaN(item.date.getTime())
        )
        .sort((a, b) => b.date.getTime() - a.date.getTime());

    if (!datedSermons.length) {
        container.innerHTML =
            `<p class="text-center">No sermons available yet.</p>`;
        return;
    }

    // Get the latest calendar date, ignoring time differences.
    const latestDate = datedSermons[0].date;

    const sameDay = datedSermons.filter(item =>
        item.date.getFullYear() === latestDate.getFullYear() &&
        item.date.getMonth() === latestDate.getMonth() &&
        item.date.getDate() === latestDate.getDate()
    );

    const combined = sameDay.find(
        item => item.sermon.lang === "both"
    );

    const featured = combined
        ? [combined.sermon]
        : sameDay
            .filter(item =>
                ["en", "zh"].includes(item.sermon.lang)
            )
            .map(item => item.sermon);

    container.innerHTML = featured.map(sermon => {
        const title = getSermonTitle(sermon);
        const pastor = getSermonPastor(sermon);
        const playable = hasVideo(sermon);

        const dateLine = sermon.time
            ? `${formatDate(sermon.date)} · ${
                formatTimeRange(...sermon.time.split(" - "))
              }`
            : formatDate(sermon.date);

        const videoContent = renderVideoContent(sermon);

        const columnClass = featured.length > 1
            ? "col-12 col-md-6"
            : "col-12 col-md-8 mx-auto";

        return `
            <div class="${columnClass}">
                <article
                    class="sermon-card featured-message-card
                        ${playable ? "sermon-card-playable" : ""}"
                    ${playable ? `
                        data-sermon-video="${escapeHtml(sermon.video)}"
                        data-sermon-title="${escapeHtml(title)}"
                        data-sermon-pastor="${escapeHtml(pastor)}"
                        role="button"
                        tabindex="0"
                        aria-label="Watch sermon: ${escapeHtml(title)}"
                    ` : ""}
                >
                    ${videoContent}

                    <div class="sermon-info">
                        <span class="sermon-service-label">
                            ${getServiceLabel(sermon.lang)}
                        </span>

                        <h3 class="sermon-title">
                            ${escapeHtml(title)}
                        </h3>

                        <p class="sermon-meta">
                            ${escapeHtml(pastor)}
                        </p>

                        <p class="sermon-meta">
                            ${escapeHtml(dateLine)}
                        </p>
                    </div>
                </article>
            </div>
        `;
    }).join("");
}


/* =========================================================
   SERMON ARCHIVE
========================================================= */

function renderSermonPage(lang) {
  const config = {
    all:  { grid: "all-sermons-grid", pagination: "all-pagination" },
    en:   { grid: "english-grid",     pagination: "en-pagination" },
    zh:   { grid: "chinese-grid",    pagination: "zh-pagination" },
    both: { grid: "combined-grid",   pagination: "both-pagination" }
  };

  const ids = config[lang];
  if (!ids) return;

  const container = document.getElementById(ids.grid);
  if (!container) return;

  // All = every service type.
  // English and Chinese also include Combined services.
  const data = SERMONS
    .filter(s => {
      const matchesLang =
          lang === "all" ||
          s.lang === lang ||
          (lang === "en" && s.lang === "both") ||
          (lang === "zh" && s.lang === "both");

      const searchableText = [
        getSermonTitle(s, "en"),
        getSermonTitle(s, "zh"),
        getSermonPastor(s, "en"),
        getSermonPastor(s, "zh")
      ].join(" ").toLowerCase();

      return matchesLang &&
        (!searchQuery || searchableText.includes(searchQuery));
    })
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const totalPages = Math.ceil(data.length / pageSize);

  // Keep the selected page valid after filtering or searching.
  if (totalPages === 0) {
    currentPage[lang] = 1;
  } else if (currentPage[lang] > totalPages) {
    currentPage[lang] = totalPages;
  }

  const start = (currentPage[lang] - 1) * pageSize;
  const pageItems = data.slice(start, start + pageSize);

  if (!data.length) {
    container.innerHTML = `
      <p class="text-center">
        ${currentLang === "zh" ? "找不到相关讲道。" : "No sermons found."}
      </p>
    `;
  } else {
    container.innerHTML = pageItems.map(s => {
      const title = getSermonTitle(s);
      const pastor = getSermonPastor(s);

      const dateLine = s.time
        ? `${formatDate(s.date)} · ${formatTimeRange(...s.time.split(" - "))}`
        : formatDate(s.date);

      
      const playable = hasVideo(s);
      
      const videoContent = renderVideoContent(s);


      return `
        <div class="col mb-4">
          <article
             class="sermon-card ${playable ? "sermon-card-playable" : ""}"
             ${playable ? `
                 data-sermon-video="${escapeHtml(s.video)}"
                 data-sermon-title="${escapeHtml(title)}"
                 data-sermon-pastor="${escapeHtml(pastor)}"
                 role="button"
                 tabindex="0"
                 aria-label="Watch sermon: ${escapeHtml(title)}"
             ` : ""}
         >
            ${videoContent}

            <div class="sermon-info mt-2">
              <span class="sermon-service-label">
                ${getServiceLabel(s.lang)}
              </span>

              <h5 class="sermon-title">
                ${escapeHtml(title)}
              </h5>

              <p class="sermon-meta">
                ${escapeHtml(pastor)} · ${dateLine}
              </p>
            </div>
          </article>
        </div>
      `;
    }).join("");
  }

  const pagination = document.getElementById(ids.pagination);

   if (pagination) {
       pagination.dataset.totalItems = data.length;
   }
   
   renderPagination(lang, data.length, ids.pagination);
   
}

/* =========================================================
   SERVICE LABELS
========================================================= */

function getServiceLabel(lang) {
  const labels = {
    en: currentLang === "zh" ? "英语崇拜" : "ENGLISH SERVICE",
    zh: currentLang === "zh" ? "华语崇拜" : "CHINESE SERVICE",
    both: currentLang === "zh" ? "联合崇拜" : "COMBINED SERVICE"
  };

  return labels[lang] || "";
}

/* =========================================================
   PAGINATION
========================================================= */

function renderPagination(lang, totalItems, paginationId) {
    const pagination = document.getElementById(paginationId);
    if (!pagination) return;

    const totalPages = Math.ceil(totalItems / pageSize);
    const page = currentPage[lang];

    if (totalPages <= 1) {
        pagination.innerHTML = "";
        return;
    }

    let html = `
        <button
            type="button"
            class="page-arrow"
            ${page === 1 ? "disabled" : ""}
            onclick="goToPage('${lang}', ${page - 1})"
            aria-label="Previous page">
            Previous
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button
                type="button"
                class="page-number ${i === page ? "active" : ""}"
                ${i === page
                    ? 'aria-current="page"'
                    : ""}
                onclick="goToPage('${lang}', ${i})">
                ${i}
            </button>
        `;
    }

    html += `
        <button
            type="button"
            class="page-arrow"
            ${page === totalPages ? "disabled" : ""}
            onclick="goToPage('${lang}', ${page + 1})"
            aria-label="Next page">
            Next
        </button>
    `;

    pagination.innerHTML = html;
}

function goToPage(lang, page) {
    const paginationIds = {
        all: "all-pagination",
        en: "en-pagination",
        zh: "zh-pagination",
        both: "both-pagination"
    };

    const paginationId = paginationIds[lang];
    if (!paginationId) return;

    const pagination = document.getElementById(paginationId);
    if (!pagination) return;

    const totalPages = Math.ceil(
        pagination.dataset.totalItems / pageSize
    );

    if (totalPages < 1) return;

    currentPage[lang] = Math.max(
        1,
        Math.min(page, totalPages)
    );

    renderSermonPage(lang);

    // Keep the visitor near the archive while changing pages.
    document.getElementById("sermonTabContent")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* =========================================================
   HELPERS
========================================================= */

function hasVideo(sermon) {
  return typeof sermon.video === "string" &&
    sermon.video.trim() !== "";
}

function getSermonTitle(sermon, lang = currentLang) {
  if (typeof sermon.title === "object" && sermon.title !== null) {
    return sermon.title[lang] ||
      sermon.title.en ||
      sermon.title.zh ||
      "";
  }

  return sermon.title || "";
}

function getSermonPastor(sermon, lang = currentLang) {
  if (typeof sermon.pastor === "object" && sermon.pastor !== null) {
    return sermon.pastor[lang] ||
      sermon.pastor.en ||
      sermon.pastor.zh ||
      "";
  }

  return sermon.pastor || "";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function formatTimeRange(start, end) {
  if (!start || !end) return "";

  function format(time) {
    const [h, m] = time.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;

    return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
  }

  return `${format(start)} – ${format(end)}`;
}


/* =========================================================
   SERMON VIDEO MODAL
   Opens the selected sermon in a Bootstrap modal
========================================================= */


function initializeSermonModal() {
    const modalElement = document.getElementById("videoModal");
    const videoFrame = document.getElementById("modalVideo");
    const titleElement = document.getElementById("videoModalTitle");
    const pastorElement = document.getElementById("videoModalPastor");

    if (
          !modalElement ||
          !videoFrame ||
          !titleElement ||
          !pastorElement ||
          !window.bootstrap
      ) {
          return;
      }

    const sermonModal =
        bootstrap.Modal.getOrCreateInstance(modalElement);

    function getEmbedUrl(videoUrl) {
        try {
            const url = new URL(videoUrl, window.location.href);

            let videoId = "";

            if (url.hostname === "youtu.be" ||
                url.hostname.endsWith(".youtu.be")) {
                videoId = url.pathname.split("/").filter(Boolean)[0];
            } else if (
                url.hostname.includes("youtube.com") ||
                url.hostname.includes("youtube-nocookie.com")
            ) {
                if (url.pathname === "/watch") {
                    videoId = url.searchParams.get("v") || "";
                } else {
                    const match = url.pathname.match(
                        /^\/(?:embed|shorts|live)\/([^/?]+)/
                    );

                    if (match) videoId = match[1];
                }
            } else {
                // Allow existing direct embed URLs from other providers.
                return url.href;
            }

            if (!videoId) return "";

            return `https://www.youtube-nocookie.com/embed/${
                encodeURIComponent(videoId)
            }?autoplay=1`;
        } catch {
            return "";
        }
    }

    function openSermon(card) {
        const videoUrl = card.dataset.sermonVideo;
        if (!videoUrl) return;

        const embedUrl = getEmbedUrl(videoUrl);

        if (!embedUrl) {
            console.error("Invalid or unsupported sermon video URL.");
            return;
        }

        const title = card.dataset.sermonTitle || "Watch Sermon";
        const pastor = card.dataset.sermonPastor || "";

        titleElement.textContent = title;
        pastorElement.textContent = pastor;

        videoFrame.title = `Sermon video: ${title}`;
        videoFrame.src = embedUrl;

        sermonModal.show();
    }

    document.addEventListener("click", event => {
        const card = event.target.closest(
            ".sermon-card-playable[data-sermon-video]"
        );

        if (card) openSermon(card);
    });

    document.addEventListener("keydown", event => {
        const card = event.target.closest(
            ".sermon-card-playable[data-sermon-video]"
        );

        if (!card) return;

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openSermon(card);
        }
    });

    modalElement.addEventListener("hidden.bs.modal", () => {
        videoFrame.src = "";
        titleElement.textContent =
            currentLang === "zh" ? "观看讲道" : "Watch Sermon";
        pastorElement.textContent = "";
    });
}



function renderVideoContent(sermon) {
    if (!hasVideo(sermon)) {
        return `
            <div class="sermon-video-placeholder">
                <p>${currentLang === "zh"
                    ? "讲道视频即将上线"
                    : "Sermon video coming soon"}</p>
            </div>
        `;
    }

    let videoId = "";

    try {
        const url = new URL(sermon.video);

        if (url.hostname.includes("youtu.be")) {
            videoId = url.pathname.split("/").filter(Boolean)[0];
        } else if (url.pathname === "/watch") {
            videoId = url.searchParams.get("v") || "";
        } else {
            const match = url.pathname.match(
                /^\/(?:embed|shorts|live)\/([^/?]+)/
            );

            if (match) videoId = match[1];
        }
    } catch {
        videoId = "";
    }

    if (!videoId) {
        return `
            <div class="sermon-video-placeholder">
                <p>Video unavailable</p>
            </div>
        `;
    }

    return `
        <div class="sermon-video-thumbnail">
            <img
                src="https://img.youtube.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg"
                alt="${escapeHtml(getSermonTitle(sermon))}"
                loading="lazy"
            >

            <span class="sermon-play-icon" aria-hidden="true">
                <span class="play-triangle"></span>
            </span>
        </div>
    `;
}

