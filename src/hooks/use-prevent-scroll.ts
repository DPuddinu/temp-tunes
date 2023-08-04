// This code comes from https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/overlays/src/usePreventScroll.ts

import { useLayoutEffect } from 'react';

interface PreventScrollOptions {
  /** Whether the scroll lock is disabled. */
  isDisabled?: boolean;
  focusCallback?: () => void;
}

function chain(...callbacks: any[]): (...args: any[]) => void {
  return (...args: any[]) => {
    for (const callback of callbacks) {
      if (typeof callback === 'function') {
        callback(...args);
      }
    }
  };
}

function isMac(): boolean | undefined {
  return testPlatform(/^Mac/);
}

function isIPhone(): boolean | undefined {
  return testPlatform(/^iPhone/);
}

function isIPad(): boolean | undefined {
  return (
    testPlatform(/^iPad/) ||
    // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
    (isMac() && navigator.maxTouchPoints > 1)
  );
}

function isIOS(): boolean | undefined {
  return isIPhone() || isIPad();
}

function testPlatform(re: RegExp): boolean | undefined {
  return typeof window !== 'undefined' && window.navigator != null ? re.test(window.navigator.platform) : undefined;
}

const visualViewport = typeof document !== 'undefined' && window.visualViewport;

export function isScrollable(node: Element): boolean {
  const style = window.getComputedStyle(node);
  return /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
}

export function getScrollParent(node: Element): Element {
  if (isScrollable(node)) {
    node = node.parentElement as HTMLElement;
  }

  while (node && !isScrollable(node)) {
    node = node.parentElement as HTMLElement;
  }

  return node || document.scrollingElement || document.documentElement;
}

// HTML input types that do not cause the software keyboard to appear.
const nonTextInputTypes = new Set([
  'checkbox',
  'radio',
  'range',
  'color',
  'file',
  'image',
  'button',
  'submit',
  'reset',
]);

// The number of active usePreventScroll calls. Used to determine whether to revert back to the original page style/scroll position
let preventScrollCount = 0;
let restore: () => void;

/**
 * Prevents scrolling on the document body on mount, and
 * restores it on unmount. Also ensures that content does not
 * shift due to the scrollbars disappearing.
 */
export function usePreventScroll(options: PreventScrollOptions = {}) {
  const { isDisabled } = options;

  useLayoutEffect(() => {
    if (isDisabled) {
      return;
    }

    preventScrollCount++;
    if (preventScrollCount === 1) {
      if (isIOS()) {
        restore = preventScrollMobileSafari();
      } else {
        restore = preventScrollStandard();
      }
    }

    return () => {
      preventScrollCount--;
      if (preventScrollCount === 0) {
        restore();
      }
    };
  }, [isDisabled]);
}

// For most browsers, all we need to do is set `overflow: hidden` on the root element, and
// add some padding to prevent the page from shifting when the scrollbar is hidden.
function preventScrollStandard() {
  return chain(
    setPaddingRight(document.documentElement, 'paddingRight', `${window.innerWidth - document.documentElement.clientWidth}px`),
    setOverflow(document.documentElement, 'overflow', 'hidden'),
  );
}

function preventScrollMobileSafari() {
  let scrollable: Element;
  let lastY = 0;
  const onTouchStart = (e: TouchEvent) => {
    // Store the nearest scrollable parent element from the element that the user touched.
    scrollable = getScrollParent(e.target as Element);
    if (scrollable === document.documentElement && scrollable === document.body) {
      return;
    }
    if (e?.changedTouches[0]?.pageY)
      lastY = e.changedTouches[0].pageY;
  };

  const onTouchMove = (e: TouchEvent) => {
    // Prevent scrolling the window.
    if (!scrollable || scrollable === document.documentElement || scrollable === document.body) {
      e.preventDefault();
      return;
    }

    // Prevent scrolling up when at the top and scrolling down when at the bottom
    // of a nested scrollable area, otherwise mobile Safari will start scrolling
    // the window instead. Unfortunately, this disables bounce scrolling when at
    // the top but it's the best we can do.
    const y = e?.changedTouches[0]?.pageY ?? 0;
    const scrollTop = scrollable.scrollTop;
    const bottom = scrollable.scrollHeight - scrollable.clientHeight;

    if (bottom === 0) {
      return;
    }

    if ((scrollTop <= 0 && y > lastY) || (scrollTop >= bottom && y < lastY)) {
      e.preventDefault();
    }

    lastY = y;
  };

  const onTouchEnd = (e: TouchEvent) => {
    const target = e.target as HTMLElement;

    // Apply this change if we're not already focused on the target element
    if (willOpenKeyboard(target) && target !== document.activeElement) {
      e.preventDefault();

      // Apply a transform to trick Safari into thinking the input is at the top of the page
      // so it doesn't try to scroll it into view. When tapping on an input, this needs to
      // be done before the "focus" event, so we have to focus the element ourselves.
      target.style.transform = 'translateY(-2000px)';
      target.focus();
      requestAnimationFrame(() => {
        target.style.transform = '';
      });
    }
  };

  const onFocus = (e: FocusEvent) => {
    const target = e.target as HTMLElement;
    if (willOpenKeyboard(target)) {
      // Transform also needs to be applied in the focus event in cases where focus moves
      // other than tapping on an input directly, e.g. the next/previous buttons in the
      // software keyboard. In these cases, it seems applying the transform in the focus event
      // is good enough, whereas when tapping an input, it must be done before the focus event. 🤷‍♂️
      target.style.transform = 'translateY(-2000px)';
      requestAnimationFrame(() => {
        target.style.transform = '';

        // This will have prevented the browser from scrolling the focused element into view,
        // so we need to do this ourselves in a way that doesn't cause the whole page to scroll.
        if (visualViewport) {
          if (visualViewport.height < window.innerHeight) {
            // If the keyboard is already visible, do this after one additional frame
            // to wait for the transform to be removed.
            requestAnimationFrame(() => {
              scrollIntoView(target);
            });
          } else {
            // Otherwise, wait for the visual viewport to resize before scrolling so we can
            // measure the correct position to scroll to.
            visualViewport.addEventListener('resize', () => scrollIntoView(target), { once: true });
          }
        }
      });
    }
  };

  const onWindowScroll = () => {
    // Last resort. If the window scrolled, scroll it back to the top.
    // It should always be at the top because the body will have a negative margin (see below).
    window.scrollTo(0, 0);
  };

  // Record the original scroll position so we can restore it.
  // Then apply a negative margin to the body to offset it by the scroll position. This will
  // enable us to scroll the window to the top, which is required for the rest of this to work.
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  const restoreStyles = chain(
    setPaddingRight(document.documentElement, 'paddingRight', `${window.innerWidth - document.documentElement.clientWidth}px`),
    setOverflow(document.documentElement, 'overflow', 'hidden'),
    setMarginTop(document.body, 'marginTop', `-${scrollY}px`),
  );

  // Scroll to the top. The negative margin on the body will make this appear the same.
  window.scrollTo(0, 0);

  document.addEventListener('touchstart', onTouchStart, { passive: false, capture: true })
  document.addEventListener('touchmove', onTouchMove, { passive: false, capture: true })
  document.addEventListener('touchend', onTouchEnd, { passive: false, capture: true })
  document.addEventListener('focus', onFocus, true)
  window.addEventListener('scroll', onWindowScroll)

  return () => {
    // Restore styles and scroll the page back to where it was.
    restoreStyles();
    document.removeEventListener('touchstart', onTouchStart)
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend', onTouchEnd)
    document.removeEventListener('focus', onFocus)
    window.removeEventListener('scroll', onWindowScroll)
    window.scrollTo(scrollX, scrollY);
  };
}

function setPaddingRight(element: HTMLElement, style: string, value: string) {
  const cur = element.style.paddingRight;
  element.style.paddingRight = value;

  return () => element.style.paddingRight = cur
}
function setOverflow(element: HTMLElement, style: string, value: string) {
  const cur = element.style.overflow;
  element.style.overflow = value;

  return () => element.style.overflow = cur
}

function setMarginTop(element: HTMLElement, style: string, value: string) {
  const cur = element.style.overflow;
  element.style.overflow = value;

  return () => element.style.overflow = cur
}

function scrollIntoView(target: Element) {
  const root = document.scrollingElement || document.documentElement;
  while (target && target !== root) {
    // Find the parent scrollable element and adjust the scroll position if the target is not already in view.
    const scrollable = getScrollParent(target);
    if (scrollable !== document.documentElement && scrollable !== document.body && scrollable !== target) {
      const scrollableTop = scrollable.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      const keyboardHeight = scrollable.getBoundingClientRect().bottom;

      if (targetTop > keyboardHeight) {
        scrollable.scrollTop += targetTop - scrollableTop;
      }
    }
    if (scrollable.parentElement)
      target = scrollable.parentElement;
  }
}

function willOpenKeyboard(target: Element) {
  return (
    (target instanceof HTMLInputElement && !nonTextInputTypes.has(target.type)) ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}
