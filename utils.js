
let currentLang = "en";

/* =========================================
   LANGUAGE TRANSLATION
========================================= */

function setLanguage(lang) {
  currentLang = lang;

  localStorage.setItem("language", lang);

  // Update static text
  document.querySelectorAll("[data-en], [data-zh]").forEach(el => {
    const en = el.getAttribute("data-en");
    const zh = el.getAttribute("data-zh");

    if (en !== null && zh !== null) {
      el.textContent = lang === "en" ? en : zh;
    } else if (en !== null) {
      el.textContent = en;
    } else if (zh !== null) {
      el.textContent = zh;
    }
  });

  // Update church history PDF
  const historyLink = document.getElementById("historyDocumentLink");

  if (historyLink) {
    historyLink.href = lang === "en"
      ? "CHURCH HISTORY_EN.pdf"
      : "CHURCH HISTORY_CH.pdf";
  }

  // Refresh dynamic sections
  
  // Refresh dynamic sections
    if (typeof renderHomepageSermons === "function") {
    renderHomepageSermons(2);
  }

  if (typeof loadEvents === "function") {
    loadEvents();
  }

  // Refresh the events calendar when the language changes
  document.dispatchEvent(new Event("languageChanged"));

}

/* =========================================
   DATE HELPERS
========================================= */

function parseDate(dateStr) {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(dateStr) {
  return parseDate(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

/* =========================================
   LANGUAGE PILL INITIALISATION
========================================= */

function initialiseLanguageToggle() {
  const btn = document.getElementById("languageToggle");

  if (!btn) return;

  const options = btn.querySelectorAll(".lang-toggle-option");

  // Prevent initialisation if the HTML is incorrect
  if (options.length !== 2) {
    console.error(
      "Language toggle needs exactly two .lang-toggle-option spans."
    );
    return;
  }

  // Set the selected language visually
  function updateToggle(lang) {
    btn.dataset.lang = lang;

    btn.setAttribute("aria-label", "Switch language");
    btn.setAttribute("aria-pressed", String(lang === "zh"));

    options.forEach(option => {
      const isActive = option.dataset.lang === lang;

      option.classList.toggle("active", isActive);
    });
  }

  // Restore saved language
  const savedLang = localStorage.getItem("language");
  const initialLang = savedLang === "zh" ? "zh" : "en";

  setLanguage(initialLang);
  updateToggle(initialLang);

  // Switch language when clicked
  btn.addEventListener("click", () => {
    const nextLang = currentLang === "en" ? "zh" : "en";

    setLanguage(nextLang);
    updateToggle(nextLang);
  });
}

document.addEventListener("DOMContentLoaded", initialiseLanguageToggle);
