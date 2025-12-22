// -------------------------------
// Panic Key Logic
// -------------------------------

const PANIC_KEY_STORAGE = "panicKey";
const PANIC_LINK_STORAGE = "panicKeyLink";

// Load saved panic key (default = Right Shift)
let panicKey = localStorage.getItem(PANIC_KEY_STORAGE) || "ShiftRight";

// Load redirect link
let panicLink = localStorage.getItem(PANIC_LINK_STORAGE) || "https://www.jimmyqrg.com";

// Function to fix/normalize redirect links
function fixRedirectLink(link) {
  if (!link) return "https://www.jimmyqrg.com";
  
  // If it's already a full URL with protocol, use it as is
  if (link.startsWith("http://") || link.startsWith("https://")) {
    return link;
  }
  
  // If it starts with a path (e.g., "jqrg-games/eaglercraft")
  // or is a relative path, prepend the base URL
  if (link.startsWith("/") || link.includes("/")) {
    // Remove leading slash if present
    const cleanPath = link.startsWith("/") ? link.substring(1) : link;
    return `https://student.jimmyqrg.com/${cleanPath}`;
  }
  
  // If it's just a domain (e.g., "www.jimmyqrg.com"), add protocol
  if (link.includes(".") && !link.includes("/")) {
    return `https://${link}`;
  }
  
  // Default fallback
  return "https://www.jimmyqrg.com";
}

// Listen for panic key press
document.addEventListener("keydown", (e) => {
  // Always check localStorage directly to get the latest values
  // (storage events don't fire in the same window)
  const currentPanicKey = localStorage.getItem(PANIC_KEY_STORAGE) || "ShiftRight";
  const currentPanicLink = localStorage.getItem(PANIC_LINK_STORAGE) || "https://www.jimmyqrg.com";
  
  // Fix the redirect link if it's incorrect
  //const redirectLink = fixRedirectLink(currentPanicLink);

  if (currentPanicKey === "window.close"){
    window.close();
  }
  // Match the key code (e.code)
  if (e.code === currentPanicKey) {
    // Immediately redirect
    window.location.href = redirectLink;
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
