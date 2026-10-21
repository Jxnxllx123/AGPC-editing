
/* =========================================
   AGPC MINISTRIES — EDITORIAL TABS
   ========================================= */

function getEditorialLanguage() {
    const activeOption = document.querySelector(
        "#languageToggle .lang-toggle-option.is-active"
    );

    if (activeOption) {
        return activeOption.dataset.lang === "zh" ? "zh" : "en";
    }

    return document.documentElement.lang === "zh" ? "zh" : "en";
}


function updateMinistryMainImage(section, item, lang, fallbackSrc) {
    const image = section.querySelector(".editorial-image");

    if (!image) return;

    const imageSrc = item?.images?.[0] || fallbackSrc;

    if (imageSrc) {
        image.src = imageSrc;
    }

    if (item?.title) {
        image.alt = item.title[lang] || item.title.en || "Ministry";
    }
}


function getMinistryData() {
    return {
        fellowship:
            typeof FELLOWSHIP_DATA !== "undefined"
                ? FELLOWSHIP_DATA
                : [],

        education:
            typeof EDUCATION_DATA !== "undefined"
                ? EDUCATION_DATA
                : []
    };
}

/* Create an element safely */
function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

/* Render an image gallery */
function renderGallery(images, lang) {
    if (!images || images.length === 0) return null;

    const gallery = createElement("div", "editorial-gallery");

    const mainImage = createElement(
        "img",
        "editorial-main-image"
    );

    mainImage.src = images[0];
    mainImage.alt = lang === "zh" ? "事工活动照片" : "Ministry activity";
    mainImage.loading = "lazy";

    gallery.appendChild(mainImage);

    if (images.length > 1) {
        const thumbnails = createElement(
            "div",
            "editorial-thumbnails"
        );

        images.forEach((src, index) => {
            const thumbnail = createElement("button", "editorial-thumb");
            thumbnail.type = "button";
            thumbnail.setAttribute(
                "aria-label",
                `${lang === "zh" ? "查看照片" : "View photo"} ${index + 1}`
            );

            const image = createElement("img");
            image.src = src;
            image.alt = "";
            image.loading = "lazy";

            thumbnail.appendChild(image);

            if (index === 0) {
                thumbnail.classList.add("is-active");
            }

            thumbnail.addEventListener("click", () => {
                mainImage.src = src;

                thumbnails
                    .querySelectorAll(".editorial-thumb")
                    .forEach(button => {
                        button.classList.toggle(
                            "is-active",
                            button === thumbnail
                        );
                    });
            });

            thumbnails.appendChild(thumbnail);
        });

        gallery.appendChild(thumbnails);
    }

    return gallery;
}

/* Render one education class or fellowship group */

function renderEntry(item, lang) {
    const entry = createElement("article", "editorial-entry");

    if (item.title) {
        entry.appendChild(
            createElement(
                "h3",
                "editorial-entry-title",
                item.title[lang] || item.title.en || ""
            )
        );
    }

    if (item.schedule) {
        entry.appendChild(
            createElement(
                "p",
                "editorial-schedule",
                item.schedule[lang] || item.schedule.en || ""
            )
        );
    }

    return entry;
}


/* Render content into a ministry panel */
function renderMinistryPanel(button) {
    const section = button.closest(".editorial-section");
    if (!section) return;

    const panel = section.querySelector(".editorial-panel");
    if (!panel) return;

    const ministry = button.dataset.ministry;
    const panelKey = button.dataset.panel;
    const lang = getEditorialLanguage();
    const data = getMinistryData();

    panel.replaceChildren();

    /* Update active tab appearance */
    section.querySelectorAll(".editorial-tab").forEach(tab => {
        const active = tab === button;

        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-pressed", String(active));
    });

    /* =====================================
       FELLOWSHIP
       ===================================== */

    if (ministry === "fellowship") {
        const fellowship = data.fellowship;

        const groupIndex = {
          "youth": 1,
          "young-adults": 2,
          "young-adults-adults": 3,
          "evening": 4
      }[panelKey];
       
        const introduction = fellowship[0]?.text?.[lang];

        if (introduction) {
            panel.appendChild(
                createElement(
                    "p",
                    "editorial-data-intro",
                    introduction
                )
            );
        }

        const item = fellowship[groupIndex];

       updateMinistryMainImage(
          section,
          item,
          lang,
          "Images/Ministries/fellowship.png"
      );

        if (item) {
            panel.appendChild(renderEntry(item, lang));
        } else {
            panel.appendChild(
                createElement(
                    "p",
                    "editorial-empty",
                    lang === "zh"
                        ? "此团契的资料暂未提供。"
                        : "Details for this fellowship are not available yet."
                )
            );
        }

        return;
    }

    /* =====================================
       EDUCATION
       ===================================== */

    if (ministry === "education") {
        const education = data.education;

        const introduction = education[0]?.text?.[lang];

        if (introduction) {
            panel.appendChild(
                createElement(
                    "p",
                    "editorial-data-intro",
                    introduction
                )
            );
        }

        if (panelKey === "sunday-school") {

           updateMinistryMainImage(section, education[1], lang);
            // All supplied Sunday School classes
            education.slice(1).forEach(item => {
                panel.appendChild(renderEntry(item, lang));
            });

        } else if (panelKey === "bible-study") {
            panel.appendChild(
                createElement(
                    "p",
                    "editorial-empty",
                    lang === "zh"
                        ? "查经资料即将推出。"
                        : "Bible Study details will be added here."
                )
            );
        }

        return;
    }

    /* Other ministries can keep their existing content
       until their data has been connected. */
}

/* Initialise all tabs */
function initialiseEditorialTabs() {
    document.querySelectorAll(".editorial-section").forEach(section => {
        const tabs = section.querySelectorAll(".editorial-tab");

        tabs.forEach(button => {
            button.addEventListener("click", () => {
                renderMinistryPanel(button);
            });
        });

        const activeTab =
            section.querySelector(".editorial-tab.is-active") ||
            tabs[0];

        if (activeTab) {
            renderMinistryPanel(activeTab);
        }
    });
}

/* Refresh panels when the language changes */
document.addEventListener("DOMContentLoaded", () => {
    initialiseEditorialTabs();

    const languageToggle = document.querySelector("#languageToggle");

    if (languageToggle) {
        languageToggle.addEventListener("click", () => {
            requestAnimationFrame(() => {
                document.querySelectorAll(
                    ".editorial-section .editorial-tab.is-active"
                ).forEach(renderMinistryPanel);
            });
        });
    }
});
