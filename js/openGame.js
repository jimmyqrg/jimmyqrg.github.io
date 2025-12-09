document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
      === TAB CLOAK SYSTEM ================================
      ===================================================== */
  const CLOAK_TITLE_KEY = "cloakTitle";
  const CLOAK_ICON_KEY = "cloakIcon";

  const cloakTitleInput = document.getElementById("cloakTitle");
  const iconOptions = document.querySelectorAll(".cloakIconOption");
  const customLabel = document.getElementById("customCloakLabel");
  const customInput = document.getElementById("customCloakInput");

  if (cloakTitleInput && customLabel && customInput) {
    // Load saved data
    const savedTitle = localStorage.getItem(CLOAK_TITLE_KEY) || "";
    const savedIcon = localStorage.getItem(CLOAK_ICON_KEY) || "";

    cloakTitleInput.value = savedTitle;

    function highlightIcon(src) {
      iconOptions.forEach(i => i.classList.remove("active"));
      customLabel.classList.remove("active");

      let found = false;
      iconOptions.forEach(i => {
        if (i.dataset.src === src) {
          i.classList.add("active");
          found = true;
        }
      });

      if (!found && src) customLabel.classList.add("active");
    }

    highlightIcon(savedIcon);

    // Save title changes
    cloakTitleInput.addEventListener("input", () => {
      localStorage.setItem(CLOAK_TITLE_KEY, cloakTitleInput.value);
    });

    // Choose preset icon
    iconOptions.forEach(img => {
      img.addEventListener("click", () => {
        const src = img.dataset.src;
        localStorage.setItem(CLOAK_ICON_KEY, src);
        highlightIcon(src);
      });
    });

    // Custom upload
    customLabel.addEventListener("click", () => customInput.click());
    customInput.addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => {
        const dataURL = e.target.result;
        localStorage.setItem(CLOAK_ICON_KEY, dataURL);
        highlightIcon(dataURL);
      };
      reader.readAsDataURL(file);
    });

    // Drag & drop custom icon
    customLabel.addEventListener("dragover", e => { 
      e.preventDefault(); 
      customLabel.style.opacity = 0.7; 
    });
    customLabel.addEventListener("dragleave", () => { 
      customLabel.style.opacity = 1; 
    });
    customLabel.addEventListener("drop", e => {
      e.preventDefault();
      customLabel.style.opacity = 1;

      const file = e.dataTransfer.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => {
        const dataURL = e.target.result;
        localStorage.setItem(CLOAK_ICON_KEY, dataURL);
        highlightIcon(dataURL);
      };
      reader.readAsDataURL(file);
    });
  } else {
    console.warn("Cloak UI not found. Skipping tab cloak initialization.");
  }
});

/* =====================================================
    === NEW openGame() for loader compatibility ==========
    ===================================================== */

function patchOpenGame() {
  const original = typeof openGame === "function" ? openGame : null;

  window.openGame = function(url) {
    if (!url) return;

    const target = "loader.html?content=" + encodeURIComponent(url);

    // Open the loader page directly — NO about:blank, NO iframe injection here
    const win = window.open(target, "_blank");

    if (!win) return;

    // Optional: call original handler if it existed
    if (original) original(url);
  };
}

patchOpenGame();
