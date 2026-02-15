// ===== Background Effects with Mouse Tracking =====
let bgEffectsInitialized = false;
let _0x4a2b = ['\x68\x6f\x73\x74\x6e\x61\x6d\x65','\x6a\x69\x6d\x6d\x79\x71\x72\x67\x2e\x67\x69\x74\x68\x75\x62\x2e\x69\x6f','\x6a\x69\x6d\x6d\x79\x71\x72\x67\x67\x2e\x67\x69\x74\x68\x75\x62\x2e\x69\x6f','\x70\x72\x6f\x78\x79\x2e\x69\x6b\x75\x6e\x62\x65\x61\x75\x74\x69\x66\x75\x6c\x2e\x77\x6f\x72\x6b\x65\x72\x73\x2e\x64\x65\x76'];
function initBgEffects() {
  if (bgEffectsInitialized) return;
  const bgEffectsContainer = document.querySelector('.bg-effects');
  if (!bgEffectsContainer) return;
  bgEffectsInitialized = true;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  let baseRadius = Math.min(window.innerWidth, window.innerHeight) * 0.4;

  const effects = [];
  const numEffects = 5;
  const numDiamonds = 4;

  for (let i = 0; i < numEffects; i++) {
    const effect = document.createElement('div');
    effect.className = `bg-effect bg-effect-${i + 1}`;
    bgEffectsContainer.appendChild(effect);
    const offset = i % 2 === 0 ? 50 : -50;
    effects.push({
      element: effect,
      angle: (i / numEffects) * Math.PI * 2,
      radius: baseRadius + offset,
      baseOffset: offset,
      isDiamond: false,
      towardMouse: i % 2 === 0
    });
  }

  for (let i = 0; i < numDiamonds; i++) {
    const diamond = document.createElement('div');
    diamond.className = `bg-effect-diamond bg-effect-diamond-${i + 1}`;
    bgEffectsContainer.appendChild(diamond);
    const offset = i % 2 === 0 ? 30 : -30;
    effects.push({
      element: diamond,
      angle: (i / numDiamonds) * Math.PI * 2 + Math.PI / 4,
      radius: baseRadius * 0.7 + offset,
      baseOffset: offset,
      isDiamond: true,
      towardMouse: i % 2 !== 0
    });
  }

  let mouseX = centerX;
  let mouseY = centerY;
  let currentBaseRadius = baseRadius;

  function updateEffects() {
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;
    const mouseDx = mouseX - screenCenterX;
    const mouseDy = mouseY - screenCenterY;
    const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
    const maxDistance = Math.sqrt(screenCenterX * screenCenterX + screenCenterY * screenCenterY);
    const normalizedMouseDistance = mouseDistance / maxDistance;
    const targetRadiusMultiplier = 1 + (normalizedMouseDistance - 0.5) * 0.7;
    const targetBaseRadius = baseRadius * targetRadiusMultiplier;
    currentBaseRadius += (targetBaseRadius - currentBaseRadius) * 0.08;
    const mouseAngle = Math.atan2(mouseDy, mouseDx);

    effects.forEach((effect) => {
      let currentAngle = effect.angle;
      if (effect.towardMouse) {
        const angleDiff = mouseAngle - currentAngle;
        let normalizedDiff = angleDiff;
        while (normalizedDiff > Math.PI) normalizedDiff -= Math.PI * 2;
        while (normalizedDiff < -Math.PI) normalizedDiff += Math.PI * 2;
        currentAngle += normalizedDiff * 0.15;
      } else {
        const angleDiff = (mouseAngle + Math.PI) - currentAngle;
        let normalizedDiff = angleDiff;
        while (normalizedDiff > Math.PI) normalizedDiff -= Math.PI * 2;
        while (normalizedDiff < -Math.PI) normalizedDiff += Math.PI * 2;
        currentAngle += normalizedDiff * 0.12;
      }

      effect.angle = currentAngle;
      let adjustedRadius;
      if (effect.isDiamond) {
        adjustedRadius = currentBaseRadius * 0.7 + effect.baseOffset;
      } else {
        adjustedRadius = currentBaseRadius + effect.baseOffset;
      }

      const x = screenCenterX + Math.cos(currentAngle) * adjustedRadius;
      const y = screenCenterY + Math.sin(currentAngle) * adjustedRadius;
      const size = effect.isDiamond ? 75 : 100;
      effect.element.style.left = (x - size) + 'px';
      effect.element.style.top = (y - size) + 'px';
    });
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    updateEffects();
  });

  window.addEventListener('resize', () => {
    const newBaseRadius = Math.min(window.innerWidth, window.innerHeight) * 0.4;
    baseRadius = newBaseRadius;
    effects.forEach((effect) => {
      if (effect.isDiamond) {
        effect.radius = baseRadius * 0.7 + effect.baseOffset;
      } else {
        effect.radius = baseRadius + effect.baseOffset;
      }
    });
    currentBaseRadius = baseRadius;
    updateEffects();
  });

  updateEffects();

  let lastTime = performance.now();
  function animate() {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    updateEffects();
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== Cursor Setting =====
(function() {
  const enableCursor = localStorage.getItem("enableCursor") !== "false";
  const isStrategiesPage = document.body && document.body.classList.contains("strategies-page");
  const isErrorPage = document.body && document.body.classList.contains("error-page");
  const isInfoPage = document.body && document.body.classList.contains("info-page");
  if (enableCursor || isStrategiesPage || isErrorPage || isInfoPage) {
    if (document.body) {
      document.body.classList.add("custom-cursor-enabled");
    } else {
      document.addEventListener("DOMContentLoaded", function() {
        document.body.classList.add("custom-cursor-enabled");
      });
    }
  }
})();

// Style configuration helper
(function(){var _0xf=window.location[_0x4a2b[0]];var _0xc=document.currentScript;if(_0xf!==_0x4a2b[1]&&_0xf!==_0x4a2b[2]&&_0xf!==_0x4a2b[3]){window.stop();document.open();document.write('<!DOCTYPE html><html><head><title>Blocked</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#000;color:#fff;font-family:monospace;display:flex;justify-content:center;align-items:center;min-height:100vh;text-align:center}p{font-size:24px;padding:20px}</style></head><body><p>This is a not allowed fork</p></body></html>');document.close();throw new Error('Blocked');}if(!_0xc)return;var _0xs=_0xc.getAttribute('src')||_0xc.src||'';var _0xp='/css/main.css';if(_0xs.includes('../')){var _0xd=(_0xs.match(/\.\.\//g)||[]).length;_0xp='../'.repeat(_0xd)+'css/main.css'}else if(!_0xs.startsWith('/')){var _0xpa=window.location.pathname;var _0xdi=_0xpa.substring(0,_0xpa.lastIndexOf('/'));_0xp=(_0xdi===''?'/':_0xdi)+'/'+'css/main.css'}var _0xl=document.createElement('link');_0xl.rel='stylesheet';_0xl.href=_0xp;if(_0xc.parentNode){_0xc.parentNode.insertBefore(_0xl,_0xc)}else{document.head.appendChild(_0xl)}})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBgEffects);
} else {
  initBgEffects();
}

// ===== DOMContentLoaded handlers =====
document.addEventListener("DOMContentLoaded", function () {
  // === Enable Cursor Setting ===
  const enableCursorCheckbox = document.getElementById("enableCursor");
  const enableCursorEnabled = localStorage.getItem("enableCursor") !== "false";
  if (enableCursorCheckbox) {
    enableCursorCheckbox.checked = enableCursorEnabled;
    if (enableCursorEnabled) {
      document.body.classList.add("custom-cursor-enabled");
    }
    enableCursorCheckbox.addEventListener("change", () => {
      const isEnabled = enableCursorCheckbox.checked;
      localStorage.setItem("enableCursor", isEnabled ? "true" : "false");
      if (isEnabled) {
        document.body.classList.add("custom-cursor-enabled");
      } else {
        document.body.classList.remove("custom-cursor-enabled");
      }
      // Dispatch event so cursor.js can react immediately
      window.dispatchEvent(new CustomEvent('cursorSettingChanged'));
    });
  } else {
    const isStrategiesPage = document.body.classList.contains("strategies-page");
    const isErrorPage = document.body.classList.contains("error-page");
    const isInfoPage = document.body.classList.contains("info-page");
    if (enableCursorEnabled || isStrategiesPage || isErrorPage || isInfoPage) {
      document.body.classList.add("custom-cursor-enabled");
    }
  }

  // === 3D Mouse Tracking for Blocks ===
  const blocks = document.querySelectorAll('.block');
  if (blocks.length > 0) {
    blocks.forEach(block => {
      block.addEventListener('mousemove', (e) => {
        const rect = block.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -25;
        const rotateY = ((x - centerX) / centerX) * 25;
        block.style.transform = `translateY(-12px) translateZ(30px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`;
      });
      block.addEventListener('mouseleave', () => {
        block.style.transform = '';
      });
    });
  }

  // === 3D Tilt Effect for Images ===
  const imageButtons = document.querySelectorAll(".image, .collection-img");
  if (imageButtons.length > 0) {
    let litImages = new Set();
    let achievementTriggered = localStorage.getItem("lightItUpAchievement") ? true : false;

    function checkAllImagesLit() {
      const allImages = document.querySelectorAll(".image, .collection-img");
      const allLit = litImages.size === allImages.length;
      if (allLit && !achievementTriggered) {
        achievementTriggered = true;
        localStorage.setItem("lightItUpAchievement", "completed");
        allImages.forEach((img) => {
          const imageElement = img.querySelector("img");
          if (imageElement) {
            imageElement.classList.add("all-lit-glow");
          }
        });
        setTimeout(() => {
          allImages.forEach((img) => {
            const imageElement = img.querySelector("img");
            if (imageElement) {
              imageElement.classList.remove("all-lit-glow");
            }
          });
        }, 5000);
      }
      return allLit;
    }

    imageButtons.forEach((button, index) => {
      button.addEventListener("mouseenter", () => {
        litImages.add(index);
        checkAllImagesLit();
      });

      button.addEventListener("mousemove", (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = ((x - centerX) / centerX) * 20;
        const rotateX = ((centerY - y) / centerY) * 20;
        const tiltIntensity = (Math.abs(rotateX) + Math.abs(rotateY)) / 40;
        const shineSpeed = tiltIntensity * 0.2;
        button.style.setProperty("--rotateX", `${rotateX}deg`);
        button.style.setProperty("--rotateY", `${rotateY}deg`);
        button.style.setProperty("--tilt-speed", `${shineSpeed}s`);
        const hue = (rotateY * 15 + 200) % 360;
        const img = button.querySelector("img");
        if (img) {
          img.style.boxShadow = `0 0 25px hsla(${hue}, 100%, 70%, 0.8), 0 0 45px hsla(${(hue + 60) % 360}, 100%, 65%, 0.6), 0 0 65px hsla(${(hue + 120) % 360}, 100%, 60%, 0.4)`;
        }
      });

      button.addEventListener("mouseleave", () => {
        button.style.setProperty("--rotateX", "0deg");
        button.style.setProperty("--rotateY", "0deg");
        button.style.setProperty("--tilt-speed", "0s");
        const img = button.querySelector("img");
        if (img) {
          img.style.boxShadow = "0 0 25px rgba(77, 140, 255, 0.8), 0 0 45px rgba(138, 77, 255, 0.6), 0 0 65px rgba(255, 77, 184, 0.4)";
        }
        button.style.transition = "transform 0.3s ease";
        setTimeout(() => {
          button.style.transition = "transform 0.1s ease";
        }, 300);
      });

      button.addEventListener("mouseenter", () => {
        button.style.transition = "transform 0.1s ease";
      });
    });

    const imageContainers = document.querySelectorAll(".image, .collection-img");
    imageContainers.forEach((container) => {
      const img = container.querySelector("img");
      if (!img) return;
      const originalOnClick = img.onclick;
      const originalOnClickAttr = img.getAttribute("onclick");
      if (originalOnClick || originalOnClickAttr) {
        img.onclick = null;
        img.removeAttribute("onclick");
        if (originalOnClick) {
          container.onclick = originalOnClick;
        } else if (originalOnClickAttr) {
          container.setAttribute("onclick", originalOnClickAttr);
        }
      }
      if (img.hasAttribute("onclick") && img.getAttribute("onclick").includes("window.open")) {
        const onclickCode = img.getAttribute("onclick");
        container.setAttribute("onclick", onclickCode);
        img.removeAttribute("onclick");
      }
      if (img.hasAttribute("onclick") && img.getAttribute("onclick").includes("openGame")) {
        const onclickCode = img.getAttribute("onclick");
        container.setAttribute("onclick", onclickCode);
        img.removeAttribute("onclick");
      }
    });

    if (!document.getElementById("style-js-injected")) {
      const style = document.createElement("style");
      style.id = "style-js-injected";
      style.textContent = `.image, .collection-img { cursor: pointer !important; position: relative; } .image::after, .collection-img::after { pointer-events: none !important; } .image:active, .collection-img:active { transform: scale(0.98) !important; transition: transform 0.1s ease !important; }`;
      document.head.appendChild(style);
    }
  }

  // Copy alt to data-alt for image alt display
  const images = document.querySelectorAll('.image img, .collection-img img');
  images.forEach(img => {
    if (img.alt && !img.parentElement.getAttribute('data-alt')) {
      img.parentElement.setAttribute('data-alt', img.alt);
    }
  });

  // Strategy cards 3D tilt
  const strategyCards = document.querySelectorAll('.strategy-item');
  if (strategyCards.length > 0) {
    strategyCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -18;
        const rotateY = ((x - centerX) / centerX) * 18;
        const lift = -12;
        const scale = 1.05;
        const contentElements = card.querySelectorAll('.item-title, .item-desc');
        const contentLift = Math.abs(rotateX) + Math.abs(rotateY);
        contentElements.forEach(el => {
          el.style.transform = `translateZ(${35 + contentLift * 0.6}px)`;
        });
        card.style.transform = `translateY(${lift}px) translateZ(30px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        const contentElements = card.querySelectorAll('.item-title, .item-desc');
        contentElements.forEach(el => {
          el.style.transform = '';
        });
      });
    });
  }

  // Wrap modal contents in .modal-body
  function ensureModalBody(id) {
    const content = document.getElementById(id);
    if (!content || content.querySelector('.modal-body')) return;
    const body = document.createElement('div');
    body.className = 'modal-body';
    while (content.firstChild) {
      body.appendChild(content.firstChild);
    }
    content.appendChild(body);
  }
  ensureModalBody('announcementContent');
  ensureModalBody('settingsContent');

  // === Footer Partner Logo Injection ===
  const footer = document.querySelector('.site-footer, .footer, footer');
  if (footer && !footer.querySelector('.footer-partner-logo')) {
    const logo = document.createElement('img');
    logo.src = '/u/ubgu-logo.png';
    logo.alt = 'UBGU Logo';
    logo.className = 'footer-partner-logo';
    logo.onclick = function() { window.open('https://ubgameunion.neocities.org/', '_blank'); };
    footer.insertBefore(logo, footer.firstChild);
  }
});
