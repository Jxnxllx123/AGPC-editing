
let currentLang = "en";

/* =========================================
   LANGUAGE TRANSLATION
========================================= */

function setLanguage(lang) {
    currentLang = lang === "zh" ? "zh" : "en";

    localStorage.setItem("language", currentLang);
    document.documentElement.lang = currentLang;

    // Translate elements marked with data-en and data-zh.
    document.querySelectorAll("[data-en], [data-zh]").forEach(el => {
        const translatedText = el.getAttribute(
            currentLang === "zh" ? "data-zh" : "data-en"
        );

        if (translatedText === null) return;

        // Translate image descriptions without changing the image.
        if (el instanceof HTMLImageElement) {
            el.alt = translatedText;
            return;
        }

        // Translate accessibility labels.
        if (el.hasAttribute("aria-label")) {
            el.setAttribute("aria-label", translatedText);
        }

        // Update text without removing nested HTML elements.
        const textNodes = Array.from(el.childNodes).filter(
            node => node.nodeType === Node.TEXT_NODE
        );

        if (textNodes.length > 0) {
            textNodes[0].nodeValue = translatedText;
            textNodes.slice(1).forEach(node => {
                node.nodeValue = "";
            });
        } else if (el.children.length === 0) {
            el.textContent = translatedText;
        }
    });

    // Update church history PDF.
    const historyLink = document.getElementById("historyDocumentLink");

    if (historyLink) {
        historyLink.href = currentLang === "en"
            ? "CHURCH HISTORY_EN.pdf"
            : "CHURCH HISTORY_CH.pdf";
    }

    // Refresh dynamic content.
    if (typeof renderHomepageSermons === "function") {
        renderHomepageSermons(2);
    }

    if (typeof loadEvents === "function") {
        loadEvents();
    }

    // Notify all language-aware components.
    document.dispatchEvent(
        new CustomEvent("languageChanged", {
            detail: { lang: currentLang }
        })
    );
}
/* =========================================
   DATE HELPERS
========================================= */

function parseDate(dateStr) {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
}

function formatDate(dateStr) {
    return parseDate(dateStr).toLocaleDateString(
        currentLang === "zh" ? "zh-SG" : "en-GB",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}

/* =========================================
   LANGUAGE PILL INITIALISATION
========================================= */

function initialiseLanguageToggle() {
    const btn = document.getElementById("languageToggle");

    if (!btn) return;

    const options = btn.querySelectorAll(".lang-toggle-option");

    if (options.length !== 2) {
        console.error("Language toggle requires two language options.");
        return;
    }

    function updateToggle(lang) {
        btn.dataset.lang = lang;
        btn.setAttribute("aria-pressed", String(lang === "zh"));

        options.forEach(option => {
            option.classList.toggle(
                "active",
                option.dataset.lang === lang
            );
        });
    }

    const savedLang = localStorage.getItem("language");
    const initialLang = savedLang === "zh" ? "zh" : "en";

    updateToggle(initialLang);
    setLanguage(initialLang);

    btn.addEventListener("click", () => {
        const nextLang = currentLang === "en" ? "zh" : "en";

        updateToggle(nextLang);
        setLanguage(nextLang);
    });
}

document.addEventListener(
    "DOMContentLoaded",
    initialiseLanguageToggle
);
