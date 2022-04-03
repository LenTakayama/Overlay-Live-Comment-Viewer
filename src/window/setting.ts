import { BrowserWindow, Menu } from 'electron';
import { join } from 'path';
import { ElectronWindow } from '~/@types/main';
import { getResourceDirectory } from '~/src/utility';
import { closeWindow } from './utility';

export class SettingWindow implements ElectronWindow {
  public window?: BrowserWindow;
  public menu: Menu;

  constructor(menu: Menu) {
    this.menu = menu;
  }

  public create() {
    this.window = new BrowserWindow({
      show: false,
      frame: true,
      autoHideMenuBar: true,
      resizable: false,
      height: 760,
      width: 400,
      webPreferences: {
        sandbox: true,
        safeDialogs: true,
        enableWebSQL: false,
        preload: join(getResourceDirectory(), 'preload.js'),
      },
    });
    this.window.webContents.session.webRequest.onHeadersReceived(
      (details, callback) => {
        callback({
          responseHeaders: {
            ...details.responseHeaders,
            'Content-Security-Policy': ["default-src 'self'"],
          },
        });
      }
    );
    this.window.loadURL(join(getResourceDirectory(), 'index.html'));
    this.window.once('ready-to-show', () => this.window?.show());
    this.window.webContents.once('context-menu', () => {
      this.menu.popup();
    });
    this.window.once('closed', () => {
      this.close();
    });
    process.env.NODE_ENV === 'development'
      ? this.window.webContents.openDevTools({ mode: 'detach' })
      : null;
  }
  public close(): void {
    closeWindow(this.window);
    this.window = undefined;
  }
}
