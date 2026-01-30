// ===== Animated Cursor on Hover =====
document.addEventListener("DOMContentLoaded", function() {
  (function() {
    // Function to check if cursor should be enabled
    function isCursorEnabled() {
      const enableCursorEnabled = localStorage.getItem("enableCursor") !== "false";
      const isStrategiesPage = document.body && document.body.classList.contains("strategies-page");
      const isErrorPage = document.body && document.body.classList.contains("error-page");
      const isInfoPage = document.body && document.body.classList.contains("info-page");
      return enableCursorEnabled || isStrategiesPage || isErrorPage || isInfoPage;
    }
    
    // Style elements and state variables (declared at top level so they're accessible everywhere)
    let defaultCursorStyle = null;
    let cursorStyle = null;
    let currentFrame = 1;
    let animationInterval = null;
    let isHovering = false;
    let isAnimatingBack = false;
    let hoverCheckInterval = null;
    let currentHoverableElement = null;
    let lastCheckedElement = null;
    let mouseX = 0, mouseY = 0;
    const totalFrames = 20;
    const animationSpeed = 4; // milliseconds per frame
    const basePath = '/cursor/animated-cursor/';
    let lastFrameSet = 0; // Track last frame to prevent unnecessary updates
    
    // Function to disable cursor completely
    function disableCursor() {
      // Stop all animations
      if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
      }
      if (hoverCheckInterval) {
        clearInterval(hoverCheckInterval);
        hoverCheckInterval = null;
      }
      
      // Remove all cursor styles
      if (defaultCursorStyle && defaultCursorStyle.parentNode) {
        defaultCursorStyle.remove();
      }
      if (cursorStyle && cursorStyle.parentNode) {
        cursorStyle.remove();
      }
      
      // Reset state
      isHovering = false;
      isAnimatingBack = false;
      currentHoverableElement = null;
      lastCheckedElement = null;
      document.body.classList.remove('cursor-hovering', 'cursor-animating-back');
    }
    
    // Function to enable cursor
    function enableCursor() {
      // Recreate style elements if needed
      if (!defaultCursorStyle || !defaultCursorStyle.parentNode) {
        defaultCursorStyle = document.getElementById('default-cursor-style');
        if (!defaultCursorStyle) {
          defaultCursorStyle = document.createElement('style');
          defaultCursorStyle.id = 'default-cursor-style';
          document.head.appendChild(defaultCursorStyle);
        }
      }
      defaultCursorStyle.textContent = `
        body.custom-cursor-enabled,
        body.custom-cursor-enabled * {
          cursor: url('/cursor/cursor-64.png') 32 32, auto !important;
        }
      `;
      
      if (!cursorStyle || !cursorStyle.parentNode) {
        cursorStyle = document.getElementById('animated-cursor-style');
        if (!cursorStyle) {
          cursorStyle = document.createElement('style');
          cursorStyle.id = 'animated-cursor-style';
          document.head.appendChild(cursorStyle);
        }
      }
    }
    
    // Preload all cursor images to prevent lag during animation
    const cursorImages = [];
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `${basePath}cursor${i}.png`;
      cursorImages.push(img);
    }

    // Preload all cursor images to prevent lag during animation
    const cursorImages = [];
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `${basePath}cursor${i}.png`;
      cursorImages.push(img);
    }

    // Initialize cursor state
    if (!isCursorEnabled()) {
      // Ensure cursor is disabled
      disableCursor();
    } else {
      // Create style element for default cursor (always visible when enabled)
      defaultCursorStyle = document.getElementById('default-cursor-style');
      if (!defaultCursorStyle) {
        defaultCursorStyle = document.createElement('style');
        defaultCursorStyle.id = 'default-cursor-style';
        document.head.appendChild(defaultCursorStyle);
      }
      // Set default cursor to always show when custom cursor is enabled
      defaultCursorStyle.textContent = `
        body.custom-cursor-enabled,
        body.custom-cursor-enabled * {
          cursor: url('/cursor/cursor-64.png') 32 32, auto !important;
        }
      `;

      // Create style element for dynamic cursor (hover animation)
      cursorStyle = document.getElementById('animated-cursor-style');
      if (!cursorStyle) {
        cursorStyle = document.createElement('style');
        cursorStyle.id = 'animated-cursor-style';
        document.head.appendChild(cursorStyle);
      }
    }

    // Function to check if element is hoverable (has pointer cursor)
    function isHoverableElement(element) {
      if (!element || element === document.body) return false;
      
      // Check common clickable elements
      if (element.tagName === 'A' || 
          element.tagName === 'BUTTON' || 
          element.hasAttribute('onclick') ||
          element.classList.contains('image') ||
          element.classList.contains('collection-img') ||
          element.classList.contains('block') ||
          element.classList.contains('block-link')) {
        return true;
      }
      
      // Check computed style for cursor: pointer
      try {
        const style = window.getComputedStyle(element);
        if (style.cursor === 'pointer' || style.cursor === 'grab') {
          return true;
        }
      } catch (e) {
        // Ignore errors
      }
      
      return false;
    }

    // Function to set cursor frame (throttled to prevent flashing)
    function setCursorFrame(frame) {
      // Check if cursor is still enabled
      if (!isCursorEnabled()) {
        disableCursor();
        return;
      }
      
      const frameNum = Math.max(1, Math.min(totalFrames, frame));
      
      // Only update if frame actually changed
      if (frameNum === lastFrameSet) {
        currentFrame = frameNum;
        return;
      }
      
      currentFrame = frameNum;
      lastFrameSet = frameNum;
      const cursorPath = `${basePath}cursor${currentFrame}.png`;
      // Apply cursor during both hovering and animating back - use more specific selector
      cursorStyle.textContent = `
        body.custom-cursor-enabled.cursor-hovering *,
        body.custom-cursor-enabled.cursor-animating-back *,
        body.custom-cursor-enabled.cursor-hovering,
        body.custom-cursor-enabled.cursor-animating-back {
          cursor: url('${cursorPath}') 32 32, pointer !important;
        }
      `;
    }
    

    // Function to animate forward (1 to 20)
    function animateForward() {
      // Don't restart if already animating forward or already at max frame
      if (isHovering && animationInterval && !isAnimatingBack) {
        // If we're already at max frame, just ensure cursor is visible
        if (currentFrame >= totalFrames) {
          setCursorFrame(totalFrames);
          return;
        }
        // If animation is in progress, don't restart
        return;
      }
      
      if (isAnimatingBack) {
        clearInterval(animationInterval);
        isAnimatingBack = false;
        document.body.classList.remove('cursor-animating-back');
      }
      
      isHovering = true;
      document.body.classList.add('cursor-hovering');
      
      // Only restart from frame 1 if we're not already partway through
      if (currentFrame <= 1 || isAnimatingBack) {
        currentFrame = 1;
      }
      setCursorFrame(currentFrame);
      
      // Clear any existing interval
      if (animationInterval) {
        clearInterval(animationInterval);
      }
      
      animationInterval = setInterval(() => {
        currentFrame++;
        setCursorFrame(currentFrame);
        
        if (currentFrame >= totalFrames) {
          clearInterval(animationInterval);
          animationInterval = null;
          // Keep cursor at max frame while hovering
          setCursorFrame(totalFrames);
        }
      }, animationSpeed);
    }

    // Function to animate backward (current to 1, then default)
    function animateBackward() {
      if (!isHovering && !isAnimatingBack) return;
      isHovering = false;
      isAnimatingBack = true;
      
      if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
      }
      
      // Add class to keep cursor style active during backward animation
      document.body.classList.add('cursor-animating-back');
      
      animationInterval = setInterval(() => {
        currentFrame--;
        setCursorFrame(currentFrame);
        
        if (currentFrame <= 1) {
          clearInterval(animationInterval);
          animationInterval = null;
          isAnimatingBack = false;
          // Remove both classes and reset cursor after reaching frame 1
          document.body.classList.remove('cursor-hovering', 'cursor-animating-back');
          setTimeout(() => {
            cursorStyle.textContent = '';
          }, 50);
        }
      }, animationSpeed);
    }

    // Function to check if element under cursor is hoverable
    function checkElementUnderCursor(x, y) {
      const element = document.elementFromPoint(x, y);
      if (!element) return null;
      
      let target = element;
      while (target && target !== document.body) {
        if (isHoverableElement(target)) {
          return target;
        }
        target = target.parentElement;
      }
      return null;
    }
    
    // Function to handle hover state changes
    function handleHoverChange(isHoveringNow, element) {
      if (isHoveringNow && !isHovering && !isAnimatingBack) {
        // Starting to hover
        currentHoverableElement = element;
        animateForward();
      } else if (!isHoveringNow && isHovering && !isAnimatingBack) {
        // Stopping hover
        currentHoverableElement = null;
        animateBackward();
      } else if (isHoveringNow && isHovering && !isAnimatingBack) {
        // Still hovering, just ensure cursor is visible (don't restart animation)
        if (currentFrame >= totalFrames) {
          setCursorFrame(totalFrames);
        }
      }
    }
    
    // Continuous hover checking (works even when mouse is stationary)
    function startHoverChecking() {
      if (hoverCheckInterval) return;
      
      hoverCheckInterval = setInterval(() => {
        if (!isCursorEnabled()) {
          // If cursor was disabled, stop checking and clean up
          if (hoverCheckInterval) {
            clearInterval(hoverCheckInterval);
            hoverCheckInterval = null;
          }
          return;
        }
        const hoverableElement = checkElementUnderCursor(mouseX, mouseY);
        const isHoveringNow = hoverableElement !== null;
        
        // Only trigger if state actually changed
        if (hoverableElement !== lastCheckedElement) {
          lastCheckedElement = hoverableElement;
          handleHoverChange(isHoveringNow, hoverableElement);
        }
      }, 50); // Check every 50ms
    }
    
    // Track mouse movement (always attached, checks enabled state internally)
    document.addEventListener('mousemove', function(e) {
      if (!isCursorEnabled()) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Immediate check on mouse move
      const hoverableElement = checkElementUnderCursor(mouseX, mouseY);
      const isHoveringNow = hoverableElement !== null;
      
      if (hoverableElement !== lastCheckedElement) {
        lastCheckedElement = hoverableElement;
        handleHoverChange(isHoveringNow, hoverableElement);
      }
    }, true);
    
    // Use mouseover/mouseout for immediate response (always attached, checks enabled state)
    function attachHoverListeners() {
      // These listeners are always attached, they check isCursorEnabled() internally
      // Use event delegation on document with capture phase
      document.addEventListener('mouseover', function(e) {
        if (!isCursorEnabled()) return;
        let target = e.target;
        let hoverable = false;
        let hoverableTarget = null;
        
        while (target && target !== document.body) {
          if (isHoverableElement(target)) {
            hoverable = true;
            hoverableTarget = target;
            break;
          }
          target = target.parentElement;
        }
        
        if (hoverable) {
          // Only start animation if not already hovering
          if (!isHovering && !isAnimatingBack) {
            currentHoverableElement = hoverableTarget;
            lastCheckedElement = hoverableTarget;
            animateForward();
          } else if (isHovering && !isAnimatingBack) {
            // Update tracked element but don't restart animation
            currentHoverableElement = hoverableTarget;
            lastCheckedElement = hoverableTarget;
            // Ensure cursor stays visible
            if (currentFrame >= totalFrames) {
              setCursorFrame(totalFrames);
            }
          }
        }
      }, true);
      
      document.addEventListener('mouseout', function(e) {
        if (!isCursorEnabled()) return;
        let target = e.target;
        let hoverable = false;
        
        while (target && target !== document.body) {
          if (isHoverableElement(target)) {
            hoverable = true;
            break;
          }
          target = target.parentElement;
        }
        
        if (hoverable) {
          // Check if we're moving to another hoverable element
          const relatedTarget = e.relatedTarget;
          let movingToHoverable = false;
          let checkTarget = relatedTarget;
          
          while (checkTarget && checkTarget !== document.body) {
            if (isHoverableElement(checkTarget)) {
              movingToHoverable = true;
              break;
            }
            checkTarget = checkTarget.parentElement;
          }
          
          if (!movingToHoverable && isHovering && !isAnimatingBack) {
            currentHoverableElement = null;
            lastCheckedElement = null;
            document.body.classList.remove('cursor-hovering');
            animateBackward();
          }
        }
      }, true);
    }
    
    // Handle mouse leaving the page (always attached, checks enabled state)
    document.addEventListener('mouseleave', function(e) {
      if (!isCursorEnabled()) return;
      if (isHovering && !isAnimatingBack) {
        currentHoverableElement = null;
        lastCheckedElement = null;
        document.body.classList.remove('cursor-hovering');
        animateBackward();
      }
    });
    
    // Attach listeners once (they check enabled state internally)
    attachHoverListeners();
    
    // Only start hover checking if cursor is enabled
    if (isCursorEnabled()) {
      startHoverChecking();
      
      // Also check on initial load in case mouse is already over an element
      setTimeout(() => {
        if (!isCursorEnabled()) return;
        const hoverableElement = checkElementUnderCursor(mouseX, mouseY);
        if (hoverableElement) {
          lastCheckedElement = hoverableElement;
          handleHoverChange(true, hoverableElement);
        }
      }, 100);
    }
    
    // Listen for changes to cursor setting
    function checkCursorSetting() {
      const shouldBeEnabled = isCursorEnabled();
      const isCurrentlyEnabled = document.body.classList.contains('custom-cursor-enabled');
      
      if (shouldBeEnabled && !isCurrentlyEnabled) {
        // Cursor was just enabled
        document.body.classList.add('custom-cursor-enabled');
        enableCursor();
        // Start hover checking if not already running
        if (!hoverCheckInterval) {
          startHoverChecking();
        }
      } else if (!shouldBeEnabled && isCurrentlyEnabled) {
        // Cursor was just disabled
        disableCursor();
        document.body.classList.remove('custom-cursor-enabled');
      }
    }
    
    // Check cursor setting periodically and on storage changes
    setInterval(checkCursorSetting, 500);
    window.addEventListener('storage', checkCursorSetting);
    
    // Also listen for the custom event that might be fired when setting changes
    window.addEventListener('cursorSettingChanged', checkCursorSetting);
  })();
});
