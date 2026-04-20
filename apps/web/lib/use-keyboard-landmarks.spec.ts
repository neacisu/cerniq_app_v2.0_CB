import './testing/jest-runtime-globals';
import { afterEach, describe, expect, it } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { useKeyboardLandmarks } from './use-keyboard-landmarks';

describe('useKeyboardLandmarks', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('Alt+Shift+M focalizează #main-content', () => {
    const main = document.createElement('main');
    main.id = 'main-content';
    main.tabIndex = -1;
    document.body.appendChild(main);
    renderHook(() => useKeyboardLandmarks());
    globalThis.dispatchEvent(
      new KeyboardEvent('keydown', {
        code: 'KeyM',
        altKey: true,
        shiftKey: true,
        bubbles: true,
      }),
    );
    expect(document.activeElement).toBe(main);
  });
});
