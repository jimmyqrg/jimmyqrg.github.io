// Utility to get current domain from currentDomain.txt
let currentDomainCache = null;

async function getCurrentDomain() {
  if (currentDomainCache) {
    return currentDomainCache;
  }
  
  try {
    const response = await fetch('/currentDomain.txt');
    const domain = (await response.text()).trim();
    currentDomainCache = domain;
    return domain;
  } catch (error) {
    console.error('Failed to load currentDomain.txt, using fallback:', error);
    return 'teacher.jimmyqrg.com'; // Fallback
  }
}

// Synchronous version (requires domain to be loaded first)
function getCurrentDomainSync() {
  return currentDomainCache || 'teacher.jimmyqrg.com';
}

// Helper function to build full URL
async function getFullUrl(path) {
  const domain = await getCurrentDomain();
  // Remove leading slash from path if domain doesn't end with slash
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  return `https://${domain}${cleanPath}`;
}

