// Utility script to update all URLs containing learn.jimmyqrg.com with domain from currentDomain.txt
(function() {
  const updateUrls = async function() {
  try {
    const response = await fetch('/currentDomain.txt');
    const domain = (await response.text()).trim();
    
    // Update window.currentDomain for use in other scripts
    window.currentDomain = domain;
    if (typeof window !== 'undefined') {
      window.currentDomainCache = domain;
    }
    
    // Replace all URLs in onclick attributes
    document.querySelectorAll('[onclick]').forEach(element => {
      const onclick = element.getAttribute('onclick');
      if (onclick && onclick.includes('learn.jimmyqrg.com')) {
        const updated = onclick.replace(/https?:\/\/teacher\.jimmyqrg\.com/g, `https://${domain}`);
        element.setAttribute('onclick', updated);
      }
    });
    
    // Replace all URLs in href attributes
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.includes('learn.jimmyqrg.com')) {
        link.setAttribute('href', href.replace(/https?:\/\/teacher\.jimmyqrg\.com/g, `https://${domain}`));
      }
    });
    
    // Replace all URLs in src attributes
    document.querySelectorAll('[src]').forEach(element => {
      const src = element.getAttribute('src');
      if (src && src.includes('learn.jimmyqrg.com')) {
        element.setAttribute('src', src.replace(/https?:\/\/teacher\.jimmyqrg\.com/g, `https://${domain}`));
      }
    });
    
    // Replace all URLs in data-src attributes
    document.querySelectorAll('[data-src]').forEach(element => {
      const dataSrc = element.getAttribute('data-src');
      if (dataSrc && dataSrc.includes('learn.jimmyqrg.com')) {
        element.setAttribute('data-src', dataSrc.replace(/https?:\/\/teacher\.jimmyqrg\.com/g, `https://${domain}`));
      }
    });
    
    // Replace text content containing the domain
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.includes('learn.jimmyqrg.com')) {
        node.textContent = node.textContent.replace(/teacher\.jimmyqrg\.com/g, domain);
      }
    }
    
  } catch (error) {
    console.error('Failed to load currentDomain.txt, using fallback:', error);
    window.currentDomain = 'learn.jimmyqrg.com';
    window.currentDomainCache = 'learn.jimmyqrg.com';
  }
  };
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateUrls);
  } else {
    updateUrls();
  }
})();

