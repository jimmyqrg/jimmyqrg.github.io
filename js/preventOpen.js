// ================================
// Ultimate Anti-New-Tab / Anti-Pop-up
// ================================

(function() {
    "use strict";

    // --- Block window.open ---
    const blockedOpen = function(url, name, features) {
        console.log("Blocked attempt to open a new tab/window:", url);
        return null;
    };
    Object.defineProperty(window, "open", {value: blockedOpen, writable: false, configurable: false});

    // --- Block showModalDialog ---
    if ("showModalDialog" in window) {
        Object.defineProperty(window, "showModalDialog", {
            value: blockedOpen,
            writable: false,
            configurable: false
        });
    }

    // --- Block location changes ---
    const blockedAssign = function(url) {
        console.log("Blocked attempt to change location:", url);
    };
    Object.defineProperty(window.location, "assign", {value: blockedAssign, writable: false, configurable: false});
    Object.defineProperty(window.location, "replace", {value: blockedAssign, writable: false, configurable: false});
    Object.defineProperty(window, "location", {
        get() { return window.location; },
        set(url) { console.log("Blocked attempt to set window.location:", url); }
    });

    // --- Block <a target="_blank"> clicks ---
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

    // --- Block dynamically added iframes ---
    const originalAppend = Node.prototype.appendChild;
    Node.prototype.appendChild = function(el) {
        if (el.tagName === "IFRAME") {
            console.log("Blocked iframe append:", el.src);
            return el;
        }
        return originalAppend.call(this, el);
    };

    // --- Block setTimeout / setInterval that call window.open ---
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;
    window.setTimeout = function(fn, delay, ...args) {
        const wrapped = function() {
            try { fn.apply(this, args); } catch(e) { console.log("Blocked dangerous timeout call"); }
        };
        return originalSetTimeout.call(this, wrapped, delay);
    };
    window.setInterval = function(fn, delay, ...args) {
        const wrapped = function() {
            try { fn.apply(this, args); } catch(e) { console.log("Blocked dangerous interval call"); }
        };
        return originalSetInterval.call(this, wrapped, delay);
    };

    // --- Block eval / Function creating window.open ---
    const originalEval = window.eval;
    window.eval = function(code) {
        if (typeof code === "string" && code.includes("window.open")) {
            console.log("Blocked window.open via eval");
            return null;
        }
        return originalEval.call(this, code);
    };
    const OriginalFunction = Function;
    window.Function = function(...args) {
        const body = args[args.length-1];
        if (typeof body === "string" && body.includes("window.open")) {
            console.log("Blocked window.open via Function constructor");
            return function() {};
        }
        return OriginalFunction.apply(this, args);
    };

    // --- Block onunload / onbeforeunload tricks ---
    window.onbeforeunload = null;
    window.onunload = null;

    console.log("Ultimate anti-pop-up / anti-new-tab protection active!");
})();
