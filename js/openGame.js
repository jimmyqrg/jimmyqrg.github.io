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

  /* Only initialize cloak UI if it exists */
  if (cloakTitleInput && customLabel && customInput) {

    // Load saved data
    let savedTitle = localStorage.getItem(CLOAK_TITLE_KEY) || "";
    let savedIcon = localStorage.getItem(CLOAK_ICON_KEY) || "";

    cloakTitleInput.value = savedTitle;

    // Highlight correct icon
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

    // Drag & drop
    customLabel.addEventListener("dragover", e => { e.preventDefault(); customLabel.style.opacity = 0.7; });
    customLabel.addEventListener("dragleave", e => { customLabel.style.opacity = 1; });
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

}); // end DOMContentLoaded

/* =====================================================
    === patched openGame() ================================
    ===================================================== */

// Ensure global openGame exists
if (typeof window.openGame !== "function") {
  window.openGame = function(url) { // fallback in case original does not exist
    const win = window.open("about:blank", "_blank");
    if (!win) return;

    win.document.title = localStorage.getItem("cloakTitle") || "Loading...";

    const icon = localStorage.getItem("cloakIcon");
    if (icon) {
      const link = win.document.createElement("link");
      link.rel = "icon";
      link.href = icon;
      win.document.head.appendChild(link);
    }

    const iframe = win.document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.top = 0;
    iframe.style.left = 0;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.src = url.startsWith("http") ? url : url; // keep relative URLs intact

    win.document.body.style.margin = "0";
    win.document.body.appendChild(iframe);
  };
} else {
  // Patch existing openGame
  const originalOpenGame = window.openGame;
  window.openGame = function(url) {
    const win = window.open("about:blank", "_blank");
    if (!win) return;

    win.document.title = localStorage.getItem("cloakTitle") || "Loading...";

    const icon = localStorage.getItem("cloakIcon");
    if (icon) {
      const link = win.document.createElement("link");
      link.rel = "icon";
      link.href = icon;
      win.document.head.appendChild(link);
    }

    const iframe = win.document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.top = 0;
    iframe.style.left = 0;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.src = url;

    win.document.body.style.margin = "0";
    win.document.body.appendChild(iframe);
  };
}
