import { BrowserWindow } from 'electron';

export function closeWindow(window?: BrowserWindow): void {
  if (window) {
    window.close();
    if (!window.isDestroyed()) {
      window.destroy();
    }
  }
}
