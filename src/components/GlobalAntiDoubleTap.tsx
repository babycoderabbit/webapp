'use client';
import { useEffect } from 'react';

export function GlobalAntiDoubleTap() {
  useEffect(() => {
    let lastClickTime = 0;
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Allow double clicks on inputs where it might be needed for text selection
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      
      const now = Date.now();
      if (now - lastClickTime < 500) { // 500ms debounce
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
      lastClickTime = now;
    };
    
    document.addEventListener('click', clickHandler, true);
    return () => document.removeEventListener('click', clickHandler, true);
  }, []);
  
  return null;
}
