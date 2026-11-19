import { useEffect, useRef, useCallback } from 'react';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const state = useRef({
    hovering: false,
    clicking: false,
    visible: false,
    ringX: 0,
    ringY: 0,
    curX: 0,
    curY: 0,
  });

  const updateStyles = useCallback(() => {
    const s = state.current;
    if (dotRef.current) {
      const dotSize = s.hovering ? 10 : s.clicking ? 6 : 8;
      dotRef.current.style.width = `${dotSize}px`;
      dotRef.current.style.height = `${dotSize}px`;
      dotRef.current.style.opacity = s.visible ? '1' : '0';
      dotRef.current.style.backgroundColor = '#000';
    }
    if (ringRef.current) {
      const ringSize = s.hovering ? 50 : s.clicking ? 24 : 36;
      ringRef.current.style.width = `${ringSize}px`;
      ringRef.current.style.height = `${ringSize}px`;
      ringRef.current.style.opacity = s.visible ? (s.hovering ? '0.8' : '0.5') : '0';
      ringRef.current.style.borderColor = s.hovering ? '#000' : 'rgba(0,0,0,0.7)';
      ringRef.current.style.borderWidth = s.hovering ? '2px' : '1.5px';
    }
  }, []);

  useEffect(() => {
    // Only mount cursor listeners for devices with fine pointer (mouse/trackpad)
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let rafId: number;
    const s = state.current;

    const onMove = (e: MouseEvent) => {
      s.curX = e.clientX;
      s.curY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${s.curX}px, ${s.curY}px) translate(-50%, -50%)`;
      }
      if (!s.visible) {
        s.visible = true;
        updateStyles();
      }
    };

    const animate = () => {
      s.ringX += (s.curX - s.ringX) * 0.1;
      s.ringY += (s.curY - s.ringY) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${s.ringX}px, ${s.ringY}px) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    const onDown = () => { s.clicking = true; updateStyles(); };
    const onUp = () => { s.clicking = false; updateStyles(); };
    const onLeave = () => { s.visible = false; updateStyles(); };
    const onEnter = () => { s.visible = true; updateStyles(); };

    const updateInteractives = () => {
      const els = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, label[for], .product-card'
      );
      els.forEach((el) => {
        el.addEventListener('mouseenter', onEnterInteractive);
        el.addEventListener('mouseleave', onLeaveInteractive);
      });
      return els;
    };

    const onEnterInteractive = () => { s.hovering = true; updateStyles(); };
    const onLeaveInteractive = () => { s.hovering = false; updateStyles(); };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    let els = updateInteractives();

    // Re-bind on DOM mutations (SPA navigation, dynamic content)
    const observer = new MutationObserver(() => {
      els.forEach((el) => {
        el.removeEventListener('mouseenter', onEnterInteractive);
        el.removeEventListener('mouseleave', onLeaveInteractive);
      });
      els = updateInteractives();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      els.forEach((el) => {
        el.removeEventListener('mouseenter', onEnterInteractive);
        el.removeEventListener('mouseleave', onLeaveInteractive);
      });
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [updateStyles]);

  return (
    <>
      {/* Dot — solid black, always visible */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none select-none rounded-full"
        style={{
          width: 8,
          height: 8,
          backgroundColor: '#000',
          opacity: 0,
          transition: 'opacity 0.25s, width 0.2s cubic-bezier(0.23,1,0.32,1), height 0.2s cubic-bezier(0.23,1,0.32,1), background-color 0.2s',
          willChange: 'transform',
        }}
      />
      {/* Ring — solid border, trails behind */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none select-none rounded-full"
        style={{
          width: 36,
          height: 36,
          borderStyle: 'solid',
          borderWidth: '1.5px',
          borderColor: 'rgba(0,0,0,0.7)',
          opacity: 0,
          transition: 'opacity 0.25s, width 0.3s cubic-bezier(0.23,1,0.32,1), height 0.3s cubic-bezier(0.23,1,0.32,1), border-color 0.2s, border-width 0.2s',
          willChange: 'transform',
        }}
      />
    </>
  );
}
