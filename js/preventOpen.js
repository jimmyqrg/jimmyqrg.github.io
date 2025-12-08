// ================================
// Anti-Pop-up / Anti-New-Tab Script
// ================================

(function() {
    "use strict";

    // --- Block window.open ---
    const blockedOpen = function(url, name, features) {
        console.log("Blocked attempt to open a new tab/window:", url);
        return null;
    };

    Object.defineProperty(window, "open", {
        value: blockedOpen,
        writable: false,      // cannot be overwritten
        configurable: false,  // cannot be deleted
        enumerable: true
    });

    // --- Block target="_blank" links ---
    document.addEventListener("click", function(e) {
        let el = e.target;
        while (el && el !== document) {
            if (el.tagName === "A" && el.target === "_blank") {
                e.preventDefault();
                console.log("Blocked link click to new tab:", el.href);
            }
            el = el.parentNode;
        }
    });

    // --- Block window.showModalDialog (older pop-up method) ---
    if ("showModalDialog" in window) {
        Object.defineProperty(window, "showModalDialog", {
            value: function(url, arg, options) {
                console.log("Blocked attempt to show modal dialog:", url);
                return null;
            },
            writable: false,
            configurable: false,
            enumerable: true
        });
    }

    // --- Prevent location hacks ---
    const blockedAssign = function(url) {
        console.log("Blocked attempt to change location:", url);
    };
    Object.defineProperty(window.location, "assign", {
        value: blockedAssign,
        writable: false,
        configurable: false
    });
    Object.defineProperty(window.location, "replace", {
        value: blockedAssign,
        writable: false,
        configurable: false
    });

    // Optional: prevent iframe-based pop-ups
    const blockedAppend = function(el) {
        if (el.tagName === "IFRAME") {
            console.log("Blocked iframe append:", el.src);
            return;
        }
        return Node.prototype.appendChild.call(this, el);
    };
    Node.prototype.appendChild = blockedAppend;

    console.log("Anti-pop-up protection active!");
})();
