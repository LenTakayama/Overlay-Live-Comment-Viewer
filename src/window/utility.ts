import { BrowserWindow } from 'electron';

export function closeWindow(window?: BrowserWindow): void {
  if (window && !window.isDestroyed()) {
    window.destroy();
  }
}
