import { BrowserWindow } from 'electron';

export function closeWindow(window: BrowserWindow): void {
  window.close;
  if (window.isDestroyed()) {
    window.destroy();
  }
}
