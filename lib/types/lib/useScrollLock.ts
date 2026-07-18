import { useEffect } from "react";

/**
 * Locks background page scroll while `active` is true.
 * Compensates for the removed scrollbar with padding so the page
 * does NOT shift/jump, and leaves no visible gutter strip.
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    const body = document.body;

    // Width freed when the scrollbar disappears — measure before locking.
    const scrollbarW = window.innerWidth - html.clientWidth;

    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPad: body.style.paddingRight,
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarW > 0) body.style.paddingRight = `${scrollbarW}px`;

    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.paddingRight = prev.bodyPad;
    };
  }, [active]);
}
