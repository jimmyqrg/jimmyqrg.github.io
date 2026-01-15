(async function () {
  const OLD_DOMAIN = "https://login.jimmyqrg.com";

  // 1. Load currentDomain.txt
  let newDomain;
  try {
    const res = await fetch("/currentDomain.txt", { cache: "no-store" });
    newDomain = (await res.text()).trim();
    if (!newDomain) throw new Error("currentDomain.txt is empty");
  } catch (e) {
    console.error("Failed to load currentDomain.txt", e);
    return;
  }

  const NEW_DOMAIN = "https://" + newDomain;

  // 2. Replace inside attributes AND inline JS
  function replaceInElement(el) {
    // Replace all attributes
    for (const attr of el.attributes || []) {
      if (attr.value.includes(OLD_DOMAIN)) {
        el.setAttribute(
          attr.name,
          attr.value.split(OLD_DOMAIN).join(NEW_DOMAIN)
        );
      }
    }

    // Replace inline event handlers (onclick, onmouseover, etc.)
    for (const key in el) {
      if (key.startsWith("on") && typeof el[key] === "function") {
        const src = el.getAttribute(key);
        if (src && src.includes(OLD_DOMAIN)) {
          el.setAttribute(
            key,
            src.split(OLD_DOMAIN).join(NEW_DOMAIN)
          );
        }
      }
    }
  }

  // 3. Scan entire document
  function scan(root) {
    if (root.nodeType !== 1) return;
    replaceInElement(root);
    root.querySelectorAll("*").forEach(replaceInElement);
  }

  scan(document.documentElement);

  // 4. Catch dynamically added elements
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      m.addedNodes.forEach(node => scan(node));
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
