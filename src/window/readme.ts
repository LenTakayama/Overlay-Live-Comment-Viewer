import { BrowserWindow } from 'electron';
import { resolve } from 'path';
import { ElectronWindow } from '~/@types/main';
import { getResourceDirectory } from '~/src/utility';
import { closeWindow } from './utility';

export class ReadmeWindow implements ElectronWindow {
  public window?: BrowserWindow;

  create(): void {
    this.window = new BrowserWindow({
      show: false,
      frame: true,
      autoHideMenuBar: true,
      height: 700,
      width: 500,
      webPreferences: {
        sandbox: true,
        safeDialogs: true,
        enableWebSQL: false,
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
    this.window.loadURL(resolve(getResourceDirectory(), 'readme.html'));
    this.window.once('ready-to-show', () => this.window?.show());
    this.window.once('closed', () => this.close());
  }

  public close(): void {
    closeWindow(this.window);
    this.window = undefined;
  }
}
