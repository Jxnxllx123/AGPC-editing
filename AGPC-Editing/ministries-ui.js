// ------------------------
// Generic Modal Renderer
// ------------------------
function changeGalleryImage(id, imgSrc) {
  const el = document.getElementById(id);
  if (el) el.src = imgSrc;
}

function renderModalSafe(containerId, dataArray) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Clear previous content
  container.innerHTML = "";

  dataArray.forEach((item, index) => {
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel-item");
    if (index === 0) carouselItem.classList.add("active");

    const slideInner = document.createElement("div");
    slideInner.className = "d-flex flex-column justify-content-center text-center";
    slideInner.style.minHeight = "350px";
    slideInner.style.width = "100%";

    const slideContent = document.createElement("div");
    slideContent.style.width = "100%";
    slideContent.style.maxWidth = "700px";
    slideContent.style.margin = "auto";

    // ===== TITLE =====
    if (item.title) {
      const h4 = document.createElement("h4");
      h4.dataset.en = item.title.en || "";
      h4.dataset.zh = item.title.zh || "";
      h4.textContent = item.title.en || "";
      slideContent.appendChild(h4);
    }

    // ===== TEXT SLIDE =====
    if (item.text) {
      const p = document.createElement("p");
      p.dataset.en = item.text.en;
      p.dataset.zh = item.text.zh;
      p.textContent = item.text.en;
      slideContent.appendChild(p);
    }

    // ===== IMAGE GALLERY =====
    if (item.images && item.images.length > 0) {
      const galleryId = `${containerId}-gallery-${index}`;
      const mainImg = document.createElement("img");
      mainImg.id = `${galleryId}-main`;
      mainImg.src = item.images[0];
      mainImg.className = "img-fluid rounded shadow-sm mb-3";
      mainImg.style.height = "300px";
      mainImg.style.width = "100%";
      mainImg.style.objectFit = "cover";

      const thumbsDiv = document.createElement("div");
      thumbsDiv.className = "d-flex gap-2 justify-content-center flex-wrap";

      item.images.forEach(imgSrc => {
        const thumb = document.createElement("img");
        thumb.src = imgSrc;
        thumb.className = "rounded shadow-sm gallery-thumb";
        thumb.style.height = "70px";
        thumb.style.width = "70px";
        thumb.style.objectFit = "cover";
        thumb.style.cursor = "pointer";

        // Event delegation: store main image ID
        thumb.dataset.target = `${galleryId}-main`;

        thumbsDiv.appendChild(thumb);
      });

      slideContent.appendChild(mainImg);
      slideContent.appendChild(thumbsDiv);
    }

    // ===== SCHEDULE =====
    if (item.schedule) {
      const p = document.createElement("p");
      p.className = "fw-bold mt-2";
      p.dataset.en = item.schedule.en;
      p.dataset.zh = item.schedule.zh;
      p.textContent = item.schedule.en;
      slideContent.appendChild(p);
    }

    slideInner.appendChild(slideContent);
    carouselItem.appendChild(slideInner);
    container.appendChild(carouselItem);
  });

  // Apply language if setLanguage exists
  if (typeof setLanguage === "function") {
    setLanguage(currentLang);
  }
}

// ------------------------
// Initialize Modals
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Fellowship and Education modals
  renderModalSafe("fellowshipCarouselInner", FELLOWSHIP_DATA);
  renderModalSafe("educationCarouselInner", EDUCATION_DATA);

  // Event delegation for all gallery thumbnails
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("gallery-thumb")) {
      const targetId = e.target.dataset.target;
      if (targetId) {
        changeGalleryImage(targetId, e.target.src);
      }
    }
  });
});