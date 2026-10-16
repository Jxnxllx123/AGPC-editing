let currentLang = "en";

function setLanguage(lang) {
  currentLang = lang;

  localStorage.setItem("language", lang);

  // update all static text (data-en / data-zh)
  document.querySelectorAll("[data-en], [data-zh]").forEach(el => {
  const en = el.getAttribute("data-en");
  const zh = el.getAttribute("data-zh");

  // combined (has both)
  if (en && zh) {
    el.textContent = lang === "en" ? en : zh;
  }

  // english-only → always English
  else if (en && !zh) {
    el.textContent = en;
  }

  // chinese-only → always Chinese
  else if (!en && zh) {
    el.textContent = zh;
  }
});

    // update history document link
  const historyLink = document.getElementById("historyDocumentLink");

  if (historyLink) {
    historyLink.href = lang === "en"
      ? "CHURCH HISTORY_EN.pdf"
      : "CHURCH HISTORY_CH.pdf";
  }

  // re-render dynamic sections
  if (typeof renderHomepageSermons === "function") {
    renderHomepageSermons(2);
  }

  if (typeof loadEvents === "function") {
    loadEvents();
  }
}

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

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("languageToggle");

  if (!btn) return;

  const savedLang = localStorage.getItem("language") || "en";
  setLanguage(savedLang);

  btn.addEventListener("click", () => {
    const newLang = currentLang === "en" ? "zh" : "en";
    setLanguage(newLang);

    btn.textContent = newLang === "en" ? "中文" : "EN";
  });
});
