/* ================================================ AGPC MINISTRIES — EDITORIAL TABS ================================================ */

const ministryPanels = { fellowship: { youth: { eyebrow: { en: "FIND YOUR PEOPLE", zh: "找到属于你的群体" }, title: { en: "A place to belong.", zh: "找到归属，建立连结。" }, description: { en: "Discover a community where you can build friendships and grow in faith.", zh: "在团契中建立友谊，在信仰中一同成长。" } },

    "young-adults": {
        eyebrow: {
            en: "GROW THROUGH LIFE",
            zh: "在人生中一同成长"
        },
        title: {
            en: "Faith for the journey.",
            zh: "在信仰路上彼此同行。"
        },
        description: {
            en: "Build meaningful friendships, share life's experiences and grow together in Christ.",
            zh: "建立有意义的友谊，分享人生经历，在基督里一同成长。"
        }
    },

    evening: {
        eyebrow: {
            en: "GATHER & CONNECT",
            zh: "相聚与连结"
        },
        title: {
            en: "Community after hours.",
            zh: "在晚堂中建立团契。"
        },
        description: {
            en: "Come together for fellowship, encouragement and a shared journey of faith.",
            zh: "透过晚堂聚会彼此鼓励，在信仰道路上同行。"
        }
    }
}


};

/* GET CURRENT LANGUAGE */

function getEditorialLanguage() { const activeOption = document.querySelector( "#languageToggle .lang-toggle-option.is-active" );

if (activeOption) {
    return activeOption.dataset.lang === "zh" ? "zh" : "en";
}

return document.documentElement.lang === "zh" ? "zh" : "en";


}

/* UPDATE A MINISTRY PANEL */

function updateEditorialPanel(button) { const ministry = button.dataset.ministry; const panelKey = button.dataset.panel;

const content = ministryPanels[ministry]?.[panelKey];

if (!content) return;

const section = button.closest(".editorial-section");
if (!section) return;

const panel = section.querySelector(".editorial-panel");
if (!panel) return;

const lang = getEditorialLanguage();

const eyebrow = panel.querySelector("[data-panel-eyebrow]");
const title = panel.querySelector("[data-panel-title]");
const description = panel.querySelector("[data-panel-description]");

if (eyebrow) eyebrow.textContent = content.eyebrow[lang];
if (title) title.textContent = content.title[lang];
if (description) description.textContent = content.description[lang];

section.querySelectorAll(".editorial-tab").forEach(tab => {
    const active = tab === button;

    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-pressed", String(active));
});


}

/* INITIALISE TABS */

function initialiseEditorialTabs() { document.querySelectorAll(".editorial-section").forEach(section => { const tabs = section.querySelectorAll(".editorial-tab");

    tabs.forEach(button => {
        button.addEventListener("click", () => {
            updateEditorialPanel(button);
        });
    });

    const activeTab = section.querySelector(
        ".editorial-tab.is-active"
    ) || tabs[0];

    if (activeTab) {
        updateEditorialPanel(activeTab);
    }
});


}

/* REFRESH PANELS WHEN LANGUAGE CHANGES */

document.addEventListener("DOMContentLoaded", () => { initialiseEditorialTabs();

const languageToggle = document.querySelector("#languageToggle");

if (languageToggle) {
    languageToggle.addEventListener("click", () => {
        // Wait until the existing language script updates its selection.
        requestAnimationFrame(() => {
            document.querySelectorAll(
                ".editorial-section .editorial-tab.is-active"
            ).forEach(updateEditorialPanel);
        });
    });
}


});
