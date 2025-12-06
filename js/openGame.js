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

  /* If page does NOT have cloak UI (some pages won't), stop */
  if (!cloakTitleInput || !customLabel || !customInput) {
    console.warn("Cloak UI not found on this page. Continuing...");
  } else {

    /* ---- Load saved data ---- */
    let savedTitle = localStorage.getItem(CLOAK_TITLE_KEY) || "";
    let savedIcon = localStorage.getItem(CLOAK_ICON_KEY) || "";

    cloakTitleInput.value = savedTitle;

    /* ---- Highlight correct icon ---- */
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

    /* ---- Save title changes ---- */
    cloakTitleInput.addEventListener("input", () => {
      localStorage.setItem(CLOAK_TITLE_KEY, cloakTitleInput.value);
    });

    /* ---- Choose preset icon ---- */
    iconOptions.forEach(img => {
      img.addEventListener("click", () => {
        const src = img.dataset.src;
        localStorage.setItem(CLOAK_ICON_KEY, src);
        highlightIcon(src);
      });
    });

    /* ---- Custom upload ---- */
    customLabel.addEventListener("click", () => {
      customInput.click();
    });

    customInput.addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        const dataURL = e.target.result;

        localStorage.setItem(CLOAK_ICON_KEY, dataURL);
        highlightIcon(dataURL);
      };
      reader.readAsDataURL(file);
    });

    /* ---- Drag and drop custom icon ---- */
    customLabel.addEventListener("dragover", e => {
      e.preventDefault();
      customLabel.style.opacity = 0.7;
    });
    customLabel.addEventListener("dragleave", e => {
      customLabel.style.opacity = 1;
    });
    customLabel.addEventListener("drop", e => {
      e.preventDefault();
      customLabel.style.opacity = 1;

      const file = e.dataTransfer.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        const dataURL = e.target.result;
        localStorage.setItem(CLOAK_ICON_KEY, dataURL);
        highlightIcon(dataURL);
      };
      reader.readAsDataURL(file);
    });

  } // end-if cloak UI exists

}); // end DOMContentLoaded


/* =====================================================
    === patched openGame() ================================
    ===================================================== */

const originalOpenGame = openGame;

openGame = function(url) {
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
  iframe.src = url.startsWith("http") ? url : "https://" + url;

  win.document.body.style.margin = "0";
  win.document.body.appendChild(iframe);
};
