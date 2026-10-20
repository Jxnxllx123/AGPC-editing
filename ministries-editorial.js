console.log("Editorial JS is loaded!");
/* ================================================
   AGPC MINISTRIES — EDITORIAL TABS
================================================ */

const ministryPanels = {
    youth: {
        eyebrow: {
            en: "FIND YOUR PEOPLE",
            zh: "找到属于你的群体"
        },
        title: {
            en: "Find your people.",
            zh: "找到属于你的群体。"
        },
        description: {
            en: "Discover a community where you can build friendships and grow in faith.",
            zh: "在团契中建立友谊，在信仰中一同成长。"
        }
    },

    "young-adults": {
        eyebrow: {
            en: "GROW THROUGH LIFE",
            zh: "在人生中一同成长"
        },
        title: {
            en: "Grow through every season.",
            zh: "在人生不同阶段一同成长。"
        },
        description: {
            en: "Build meaningful friendships and journey together in faith.",
            zh: "建立有意义的友谊，在信仰道路上彼此同行。"
        }
    },

    evening: {
        eyebrow: {
            en: "GATHER & CONNECT",
            zh: "相聚与连结"
        },
        title: {
            en: "Faith beyond Sunday.",
            zh: "让信仰延伸到主日以外。"
        },
        description: {
            en: "Discover fellowship and community through evening gatherings.",
            zh: "透过晚堂聚会建立团契，彼此连结。"
        }
    }
};

/* Get the currently selected language */
function getEditorialLanguage() {
    const activeLanguage = document.querySelector(
        ".lang-toggle-option.is-active"
    );

    return activeLanguage?.dataset.lang === "zh" ? "zh" : "en";
}

/* Update the fellowship panel */
function updateFellowshipPanel(button) {
    const content = ministryPanels[button.dataset.panel];

    if (!content) return;

    const section = button.closest(".editorial-section");
    if (!section) return;

    const panel = section.querySelector(".editorial-panel");
    if (!panel) return;

    const eyebrow = panel.querySelector(".panel-eyebrow");
    const title = panel.querySelector("[data-panel-title]");
    const description = panel.querySelector(
        "[data-panel-description]"
    );

    const lang = getEditorialLanguage();

    if (eyebrow) eyebrow.textContent = content.eyebrow[lang];
    if (title) title.textContent = content.title[lang];
    if (description) {
        description.textContent = content.description[lang];
    }

    /* Update the selected tab */
    section.querySelectorAll(".editorial-tab").forEach(tab => {
        const active = tab === button;

        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-pressed", String(active));
    });
}

/* Initialise the fellowship tabs */
document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector("#fellowship");

    if (!section) return;

    const tabs = section.querySelectorAll(".editorial-tab");

    tabs.forEach(button => {
        button.addEventListener("click", () => {
            updateFellowshipPanel(button);
        });
    });

    /* Show the selected tab's content on page load */
    const activeTab = section.querySelector(
        ".editorial-tab.is-active"
    ) || tabs[0];

    if (activeTab) {
        updateFellowshipPanel(activeTab);
    }
});
