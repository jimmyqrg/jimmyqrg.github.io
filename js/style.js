// ===== Cursor Setting =====
// Apply cursor setting immediately on page load (before DOMContentLoaded)
      (function() {
        const enableCursor = localStorage.getItem("enableCursor") !== "false";
        if (enableCursor) {
          // Try to add immediately if body exists, otherwise wait for DOMContentLoaded
          if (document.body) {
            document.body.classList.add("custom-cursor-enabled");
          } else {
            document.addEventListener("DOMContentLoaded", function() {
              document.body.classList.add("custom-cursor-enabled");
            });
          }
        }
      })();

// ===== Background Effects with Mouse Tracking =====
let bgEffectsInitialized = false;
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBgEffects);
} else {
  initBgEffects();
}

// ===== DOMContentLoaded handlers =====
      document.addEventListener("DOMContentLoaded", function () {
  // === Enable Cursor Setting ===
  const enableCursorCheckbox = document.getElementById("enableCursor");
  // Default to true if not set
  const enableCursorEnabled = localStorage.getItem("enableCursor") !== "false";
  if (enableCursorCheckbox) {
    enableCursorCheckbox.checked = enableCursorEnabled;
    // Apply cursor state on load
    if (enableCursorEnabled) {
      document.body.classList.add("custom-cursor-enabled");
    }
    enableCursorCheckbox.addEventListener("change", () => {
      const isEnabled = enableCursorCheckbox.checked;
      localStorage.setItem("enableCursor", isEnabled ? "true" : "false");
      // Toggle cursor class
      if (isEnabled) {
        document.body.classList.add("custom-cursor-enabled");
      } else {
        document.body.classList.remove("custom-cursor-enabled");
      }
    });
  } else {
    // If checkbox not found, apply default (enabled)
    document.body.classList.add("custom-cursor-enabled");
  }

  // === 3D Mouse Tracking for Blocks (index.html only) ===
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

  // === 3D Tilt Effect for Images (jqrg-games/index.html) ===
  const imageButtons = document.querySelectorAll(".image, .collection-img");
  if (imageButtons.length > 0) {
    // Achievement system variables
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
              img.style.boxShadow = `0 0 25px hsla(${hue}, 100%, 70%, 0.8),
            0 0 45px hsla(${(hue + 60) % 360}, 100%, 65%, 0.6),
            0 0 65px hsla(${(hue + 120) % 360}, 100%, 60%, 0.4)`;
            }
          });

          button.addEventListener("mouseleave", () => {
            button.style.setProperty("--rotateX", "0deg");
            button.style.setProperty("--rotateY", "0deg");
            button.style.setProperty("--tilt-speed", "0s");

            const img = button.querySelector("img");
            if (img) {
              img.style.boxShadow =
                "0 0 25px rgba(77, 140, 255, 0.8)," +
                "0 0 45px rgba(138, 77, 255, 0.6)," +
                "0 0 65px rgba(255, 77, 184, 0.4)";
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

        // Make image containers clickable
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

          if (
            img.hasAttribute("onclick") &&
            img.getAttribute("onclick").includes("window.open")
          ) {
            const onclickCode = img.getAttribute("onclick");
            container.setAttribute("onclick", onclickCode);
            img.removeAttribute("onclick");
          }

          if (
            img.hasAttribute("onclick") &&
            img.getAttribute("onclick").includes("openGame")
          ) {
            const onclickCode = img.getAttribute("onclick");
            container.setAttribute("onclick", onclickCode);
            img.removeAttribute("onclick");
          }
        });

    // Add CSS for image container clicks
    if (!document.getElementById("style-js-injected")) {
        const style = document.createElement("style");
      style.id = "style-js-injected";
        style.textContent = `
      .image, .collection-img {
        cursor: pointer !important;
        position: relative;
      }
      .image::after, .collection-img::after {
        pointer-events: none !important;
      }
      .image:active, .collection-img:active {
        transform: scale(0.98) !important;
        transition: transform 0.1s ease !important;
      }
    `;
        document.head.appendChild(style);
    }
  }

  // Strategy cards tilt
  const strategyCards = document.querySelectorAll('.strategy-item');
  if (strategyCards.length > 0) {
    strategyCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Wrap modal contents in .modal-body for scrolling while keeping outline
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
      });