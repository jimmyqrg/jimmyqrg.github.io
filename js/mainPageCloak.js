// Main Page Cloak System
// Applies "Home | Schoology" title and schoology.png icon when enabled
// Only applies to pages outside of /jqrg-games/games/

(function() {
  // Check if we're in the games folder (don't apply cloak there)
  const path = window.location.pathname;
  if (path.includes('/jqrg-games/games/')) {
    return; // Don't apply cloak to game files
  }

  // Check if main page cloak is enabled
  const cloakEnabled = localStorage.getItem('mainPageCloak') === 'true';
  
  if (cloakEnabled) {
    // Apply cloak immediately
    document.title = 'Home | Schoology';
    
    // Update or create favicon link
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = '/cloak-images/schoology.png';
    favicon.type = 'image/png';
    
    // Also handle shortcut icon
    let shortcutIcon = document.querySelector('link[rel="shortcut icon"]');
    if (!shortcutIcon) {
      shortcutIcon = document.createElement('link');
      shortcutIcon.rel = 'shortcut icon';
      document.head.appendChild(shortcutIcon);
    }
    shortcutIcon.href = '/cloak-images/schoology.png';
    shortcutIcon.type = 'image/png';
  }
})();
