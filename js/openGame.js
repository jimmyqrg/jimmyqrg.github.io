document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
      === TAB CLOAK SYSTEM ================================
      ===================================================== */
  const CLOAK_TITLE_KEY = "cloakTitle";
  const CLOAK_ICON_KEY = "cloakIcon";

  /* =====================================================
      === OPEN GAME TYPE SETTING ==========================
      ===================================================== */
  const OPEN_GAME_TYPE_KEY = "openGameLoaderType";
  const openGameLoaderTypeSelect = document.getElementById("openGameLoaderType");

  if (openGameLoaderTypeSelect) {
    // Load saved type (default: popup)
    const savedType = localStorage.getItem(OPEN_GAME_TYPE_KEY) || "popup";
    openGameLoaderTypeSelect.value = savedType;

    // Save on change
    openGameLoaderTypeSelect.addEventListener("change", () => {
      localStorage.setItem(OPEN_GAME_TYPE_KEY, openGameLoaderTypeSelect.value);
    });
  }

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
    === SINGLE openGame() function - FIXED ==============
    ===================================================== */

// This runs immediately when script loads
(function() {
  // Save reference to original function if it exists
  const originalopenGame = typeof window.openGame === 'function' ? window.openGame : null;

  // Define our openGame function
  window.openGame = function(url) {
    if (!url) return;

    // Get user's preferred open type
    const openType = localStorage.getItem("openGameLoaderType") || "popup";
    const target = "/loader.html?content=" + encodeURIComponent(url)

    console.log("Opening game with type:", openType, "URL:", url);

    let win = null;

    if (openType === "newtab") {
      // Open in new tab
      win = window.open(target, "_blank");
    } else {
      // Default: open in popup
      const popupFeatures = [
        "popup=yes",
        "toolbar=no",
        "location=no",
        "menubar=no",
        "status=no",
        "scrollbars=yes",
        "resizable=yes",
        "width=900",
        "height=600",
        "left=" + (window.screenX + 80),
        "top=" + (window.screenY + 60)
      ].join(",");

      win = window.open(target, "_blank", popupFeatures);
    }

    // If popup blocked
    if (!win) {
      alert("Please enable popups to open the game.");
      return;
    }

    // Call original function ONCE if it exists
    if (originalopenGame && originalopenGame !== window.openGame) {
      console.log("Calling original openGame function");
      originalopenGame(url);
    }
  };

  console.log("openGame function initialized");
})();
