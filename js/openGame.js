document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
      === TAB CLOAK SYSTEM ================================
      ===================================================== */
  const CLOAK_TITLE_KEY = "cloakTitle";
  const CLOAK_ICON_KEY = "cloakIcon";

  /* =====================================================
      === OPEN GAME TYPE SETTING ==========================
      ===================================================== */
  const OPEN_GAME_TYPE_KEY = "openGameType";
  const openGameTypeSelect = document.getElementById("openGameType");

  if (openGameTypeSelect) {
    // Load saved type (default: popup)
    const savedType = localStorage.getItem(OPEN_GAME_TYPE_KEY) || "popup";
    openGameTypeSelect.value = savedType;

    // Save on change
    openGameTypeSelect.addEventListener("change", () => {
      localStorage.setItem(OPEN_GAME_TYPE_KEY, openGameTypeSelect.value);
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
      // Prevent image from being draggable
      img.setAttribute('draggable', 'false');
      
      // Use capture phase to prevent any other handlers
      img.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const src = img.dataset.src;
        localStorage.setItem(CLOAK_ICON_KEY, src);
        highlightIcon(src);
        return false;
      }, true); // Use capture phase
      
      // Also prevent context menu and middle-click
      img.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, true);
      
      img.addEventListener("auxclick", (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, true);
      
      // Prevent mousedown from causing any navigation
      img.addEventListener("mousedown", (e) => {
        if (e.button === 1) { // Middle mouse button
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }, true);
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
    const openType = localStorage.getItem("openGameType") || "popup";
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

    // Apply tab cloak immediately to the new window (if possible)
    // Note: Due to cross-origin restrictions, we can't directly modify the window
    // But loader.html will apply the cloak via localStorage when it loads
    try {
      // Try to apply cloak immediately if we have access
      const cloakTitle = localStorage.getItem("cloakTitle");
      const cloakIcon = localStorage.getItem("cloakIcon");
      
      if (win && !win.closed) {
        // Use postMessage to send cloak settings to loader.html if needed
        // But loader.html already reads from localStorage, so this is redundant
        // The cloak will be applied by loader.html when it loads
      }
    } catch (e) {
      // Cross-origin restriction - loader.html will handle it via localStorage
      console.log("Tab cloak will be applied by loader.html");
    }

    // Call original function ONCE if it exists
    if (originalopenGame && originalopenGame !== window.openGame) {
      console.log("Calling original openGame function");
      originalopenGame(url);
    }
  };

  console.log("openGame function initialized");
})();
