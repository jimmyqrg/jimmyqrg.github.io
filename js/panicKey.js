// -------------------------------
// Panic Key Logic
// -------------------------------

const PANIC_KEY_STORAGE = "panicKey";
const PANIC_LINK_STORAGE = "panicKeyLink";

// Load saved panic key (default = Right Shift)
let panicKey = localStorage.getItem(PANIC_KEY_STORAGE) || "ShiftRight";

// Load redirect link
let panicLink = localStorage.getItem(PANIC_LINK_STORAGE) || "";

// Listen for panic key press
document.addEventListener("keydown", (e) => {
  // If no redirect link is set, do nothing
  if (!panicLink) return;

  // Match the key code (e.code)
  if (e.code === panicKey) {
    // Immediately redirect
    window.location.href = panicLink;
  }
});

// If the link changes during page lifetime, update automatically
window.addEventListener("storage", (event) => {
  if (event.key === PANIC_KEY_STORAGE) {
    panicKey = event.newValue || "ShiftRight";
  }
  if (event.key === PANIC_LINK_STORAGE) {
    panicLink = event.newValue || "";
  }
});
