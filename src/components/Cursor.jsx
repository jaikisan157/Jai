import React, { useEffect, useRef, useCallback } from 'react';

const Cursor = () => {
  // DOM references
  const coreRef = useRef(null);
  const ringRef = useRef(null);
  const trailContainerRef = useRef(null);
  const magnifierLayerRef = useRef(null);
  const magnifierZoomRef = useRef(null);

  // Position tracking
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const ringX = useRef(0);
  const ringY = useRef(0);

  // State flags
  const isHovering = useRef(false);
  const isClicking = useRef(false);
  const rotationAngle = useRef(0);
  const requestRef = useRef(null);
  const lastTrailTime = useRef(0);
  const activeLensTarget = useRef(null);

  // Detect touch devices
  const isTouchDevice = () => {
    return window.matchMedia('(pointer: coarse)').matches ||
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0);
  };

  const isInteractive = (element) => {
    if (!element) return false;
    const selectors = [
      'a', 'button', 'input', 'textarea', 'select',
      '[role="button"]', '[tabindex]:not([tabindex="-1"])',
      '.interactive', '.cursor-pointer', '[data-cursor]'
    ];
    return selectors.some(selector =>
      element.matches?.(selector) || element.closest?.(selector)
    );
  };

  const addTrailParticle = (x, y) => {
    const particle = document.createElement('div');
    particle.className = 'cursor-trail-particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    trailContainerRef.current?.appendChild(particle);

    let opacity = 0.5;
    let scale = 1;
    const animateParticle = () => {
      opacity -= 0.025;
      scale -= 0.02;
      if (opacity <= 0) {
        particle.remove();
        return;
      }
      particle.style.opacity = opacity;
      particle.style.transform = `translate(-50%, -50%) scale(${scale})`;
      requestAnimationFrame(animateParticle);
    };
    requestAnimationFrame(animateParticle);
  };

  const updateCore = useCallback((x, y) => {
    if (coreRef.current) {
      coreRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  }, []);

  const animate = useCallback(() => {
    const ringEasing = 0.12;
    ringX.current += (mouseX.current - ringX.current) * ringEasing;
    ringY.current += (mouseY.current - ringY.current) * ringEasing;

    if (ringRef.current) {
      rotationAngle.current = (rotationAngle.current + 2.5) % 360;
      ringRef.current.style.transform = `translate3d(${ringX.current}px, ${ringY.current}px, 0) rotate(${rotationAngle.current}deg)`;
    }

    // Update magnifying lens clip-path to follow exact mouse coordinates
    if (magnifierLayerRef.current && activeLensTarget.current) {
      magnifierLayerRef.current.style.clipPath = `circle(32px at ${mouseX.current}px ${mouseY.current}px)`;
    }
    // Update zoom origin so the lens translates the zoom correctly
    if (magnifierZoomRef.current && activeLensTarget.current) {
      magnifierZoomRef.current.style.transformOrigin = `${mouseX.current}px ${mouseY.current}px`;
    }

    const now = performance.now();
    const speed = Math.hypot(mouseX.current - ringX.current, mouseY.current - ringY.current);
    if (now - lastTrailTime.current > 25 && speed > 2) {
      addTrailParticle(mouseX.current, mouseY.current);
      lastTrailTime.current = now;
    }

    requestRef.current = requestAnimationFrame(animate);
  }, []);

  const handleMouseMove = useCallback((e) => {
    mouseX.current = e.clientX;
    mouseY.current = e.clientY;
    updateCore(mouseX.current, mouseY.current);

    const target = e.target;
    const interactive = isInteractive(target);

    if (interactive !== isHovering.current) {
      isHovering.current = interactive;
      if (coreRef.current && ringRef.current) {
        if (interactive) {
          coreRef.current.classList.add('hover');
          ringRef.current.classList.add('hover');
        } else {
          coreRef.current.classList.remove('hover');
          ringRef.current.classList.remove('hover');
        }
      }
    }
  }, [updateCore]);

  // Handle building the magnifying glass clone on mouseover
  const handleMouseOver = useCallback((e) => {
    let target = e.target;
    
    // Find a reasonable block-level container so we capture sibling context (fixes missing bullets/adjacent text)
    let block = target.closest('p, h1, h2, h3, h4, h5, h6, ul, ol, li, a, button, blockquote, .interactive') || target;
    
    // Skip full page layouts or giant wrappers
    if (['BODY', 'HTML', 'MAIN', 'SECTION', 'HEADER', 'FOOTER'].includes(block.tagName)) return;

    // Skip lens on interactive elements (buttons, links) since they have their own hover animations
    if (isInteractive(target) || isInteractive(block)) {
      clearLens();
      return;
    }
    
    // Optimization: avoid re-cloning if we're already locked onto the same block
    if (activeLensTarget.current === block) return;
    activeLensTarget.current = block;
    
    const rect = block.getBoundingClientRect();
    // Prevent cloning massive elements that span the whole screen to save performance safely
    if (rect.width > window.innerWidth * 0.8 || rect.height > window.innerHeight * 0.8) return;
    
    if (magnifierZoomRef.current && magnifierLayerRef.current) {
      const computed = window.getComputedStyle(block);
      const clone = block.cloneNode(true);
      
      // Inherit exact visual coordinates and appearance
      clone.style.position = 'fixed';
      clone.style.top = rect.top + 'px';
      clone.style.left = rect.left + 'px';
      clone.style.width = rect.width + 'px';
      clone.style.height = rect.height + 'px';
      clone.style.margin = '0';
      clone.style.boxSizing = 'border-box';
      clone.style.pointerEvents = 'none';
      clone.style.transition = 'none';
      clone.style.transform = 'none';
      clone.style.animation = 'none';

      const copyStyles = ['color', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textAlign', 'textTransform', 'display', 'alignItems', 'justifyContent', 'padding', 'backgroundColor', 'backgroundImage', 'webkitTextFillColor', 'backgroundClip', 'whiteSpace', 'wordBreak'];
      copyStyles.forEach(prop => {
        clone.style[prop] = computed[prop];
      });

      // Detect actual background color by walking up the DOM tree
      const getBg = (el) => {
        let node = el;
        while (node && node !== document.body) {
          const bg = window.getComputedStyle(node).backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
          node = node.parentElement;
        }
        return window.getComputedStyle(document.body).backgroundColor;
      };
      const sectionBg = getBg(block);
      magnifierLayerRef.current.style.backgroundColor = sectionBg;

      magnifierZoomRef.current.innerHTML = '';
      magnifierZoomRef.current.appendChild(clone);
      magnifierLayerRef.current.style.opacity = '1';
    }
  }, []);

  const clearLens = useCallback(() => {
    activeLensTarget.current = null;
    if (magnifierLayerRef.current) magnifierLayerRef.current.style.opacity = '0';
  }, []);

  const handleMouseOut = useCallback((e) => {
    // We only clear if the mouse actually leaves the stored target
    if (activeLensTarget.current === e.target) {
      clearLens();
    }
  }, [clearLens]);

  // Click effect – shrink & pulse
  const handleMouseDown = useCallback(() => {
    if (isClicking.current) return;
    isClicking.current = true;
    if (coreRef.current && ringRef.current) {
      coreRef.current.classList.add('click');
      ringRef.current.classList.add('click');
    }
    setTimeout(() => {
      if (coreRef.current && ringRef.current) {
        coreRef.current.classList.remove('click');
        ringRef.current.classList.remove('click');
      }
      isClicking.current = false;
    }, 200);
  }, []);

  const handleWindowLeave = useCallback(() => {
    if (coreRef.current && ringRef.current) {
      coreRef.current.classList.add('hidden');
      ringRef.current.classList.add('hidden');
      clearLens();
    }
  }, [clearLens]);

  const handleWindowEnter = useCallback(() => {
    if (coreRef.current && ringRef.current) {
      coreRef.current.classList.remove('hidden');
      ringRef.current.classList.remove('hidden');
    }
  }, []);

  // Setup and cleanup
  useEffect(() => {
    if (isTouchDevice()) {
      document.body.classList.add('touch-device');
      return;
    }

    document.body.classList.add('custom-cursor-active');

    if (coreRef.current) coreRef.current.style.transform = 'translate3d(-100px, -100px, 0)';
    if (ringRef.current) ringRef.current.style.transform = 'translate3d(-100px, -100px, 0)';

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.documentElement.addEventListener('mouseleave', handleWindowLeave);
    document.documentElement.addEventListener('mouseenter', handleWindowEnter);

    // Clear lens on scroll to prevent tracking desync
    window.addEventListener('scroll', clearLens, { passive: true });

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.documentElement.removeEventListener('mouseleave', handleWindowLeave);
      document.documentElement.removeEventListener('mouseenter', handleWindowEnter);
      window.removeEventListener('scroll', clearLens);

      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      document.body.classList.remove('custom-cursor-active');
      document.body.classList.remove('touch-device');
      if (trailContainerRef.current) trailContainerRef.current.innerHTML = '';
    };
  }, [handleMouseMove, handleMouseDown, handleMouseOver, handleMouseOut, handleWindowLeave, handleWindowEnter, clearLens, animate]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      body.custom-cursor-active, body.custom-cursor-active * { cursor: none !important; }
      body.touch-device, body.touch-device * { cursor: auto !important; }
      
      .cursor-core {
        position: fixed; top: 0; left: 0; width: 12px; height: 12px; margin: -6px 0 0 -6px;
        background: #ffffff; mix-blend-mode: difference;
        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        pointer-events: none; z-index: 10000; will-change: transform;
        transition: all 0.1s cubic-bezier(0.2, 0.9, 0.4, 1.1), width 0.2s, height 0.2s, margin 0.2s;
      }
      
      .cursor-ring {
        position: fixed; top: 0; left: 0; width: 42px; height: 42px; margin: -21px 0 0 -21px;
        border: 1.5px solid #ffffff; mix-blend-mode: difference;
        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; background: transparent;
        pointer-events: none; z-index: 9999; will-change: transform;
        transition: all 0.2s ease-out, width 0.2s, height 0.2s, margin 0.2s;
      }
      
      .cursor-trail-particle {
        position: fixed; top: 0; left: 0; width: 6px; height: 6px;
        background: #ffffff; mix-blend-mode: difference;
        border-radius: 20% 80% 80% 20% / 20% 20% 80% 80%;
        pointer-events: none; z-index: 9997; will-change: transform, opacity;
        transform: translate(-50%, -50%);
      }
      
      .cursor-core.hover {
        width: 24px; height: 24px; margin: -12px 0 0 -12px;
        border-radius: 40% 60% 60% 40% / 40% 40% 60% 60%;
      }
      
      .cursor-ring.hover {
        width: 70px; height: 70px; margin: -35px 0 0 -35px; border-width: 2px;
        transform: rotate(15deg) scale(1.05);
      }
      
      .cursor-core.click { width: 8px; height: 8px; margin: -4px 0 0 -4px; transition-duration: 0.05s; }
      .cursor-ring.click { width: 30px; height: 30px; margin: -15px 0 0 -15px; transform: rotate(45deg) scale(0.8); }
      .cursor-core.hidden, .cursor-ring.hidden { opacity: 0; transform: scale(0.2); transition: opacity 0.2s, transform 0.2s; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <>
      {/* Magnifier Lens Background & Wrapper */}
      <div 
        ref={magnifierLayerRef} 
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none', zIndex: 9998, overflow: 'hidden',
          opacity: 0, transition: 'opacity 0.2s',
          clipPath: 'circle(32px at -100px -100px)'
        }}
      >
        <div 
          ref={magnifierZoomRef}
          style={{ width: '100vw', height: '100vh', transform: 'scale(1.4)', transformOrigin: '0px 0px' }}
        />
      </div>
      <div ref={coreRef} className="cursor-core" />
      <div ref={ringRef} className="cursor-ring" />
      <div ref={trailContainerRef} />
    </>
  );
};

export default Cursor;