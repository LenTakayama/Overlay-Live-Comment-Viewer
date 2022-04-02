import { BrowserView, BrowserWindow, screen } from 'electron';
import { join, resolve } from 'path';
import { readFileSync } from 'fs';
import { ElectronWindow, StoreSchema } from '~/@types/main';
import { getResourceDirectory, getExtraDirectory } from '~/src/utility';
import { closeWindow } from './utility';
import ElectronStore from 'electron-store';

export class ViewWindow implements ElectronWindow {
  public window: BrowserWindow;
  public view: BrowserView;
  public store: ElectronStore<StoreSchema>;
  public insertCSSKey?: Promise<string>;

  constructor(store: ElectronStore<StoreSchema>) {
    this.store = store;
    const loadURL = this.store.get('load-url');
    const insertCSS = this.store.get('insert-css');
    const windowConfig = this.store.get('comment-window-config');
    const position = this.calcWindowPosition(
      windowConfig.width,
      windowConfig.height,
      windowConfig.right,
      windowConfig.bottom
    );
    this.window = new BrowserWindow({
      x: position.x,
      y: position.y,
      width: windowConfig.width,
      height: windowConfig.height,
      transparent: true,
      frame: false,
      resizable: false,
      hasShadow: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      show: false,
      webPreferences: {
        sandbox: true,
        safeDialogs: true,
        enableWebSQL: false,
      },
    });
    this.view = new BrowserView({
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
            // 'Content-Security-Policy': ["default-src 'self'"],
          },
        });
      }
    );

    this.window.setIgnoreMouseEvents(true);
    this.window.setBrowserView(this.view);

    this.view.setBounds({
      x: 0,
      y: 0,
      width: windowConfig.width,
      height: windowConfig.height,
    });
    this.view.setAutoResize({ width: true, height: true });
    this.view.webContents.loadURL(
      loadURL.url ? loadURL.url : join(getResourceDirectory(), 'notfound.html')
    );
    this.view.webContents.once('did-finish-load', () => {
      this.insertCSSKey = this.view.webContents.insertCSS(
        insertCSS.css
          ? insertCSS.css
          : readFileSync(
              resolve(getExtraDirectory(), 'comment.bundle.css')
            ).toString()
      );
      this.window.showInactive();
    });

    this.addEventHandler();
    return;
  }

  public close(): void {
    closeWindow(this.window);
  }

  private addEventHandler(): void {
    this.window.once('ready-to-show', () => this.window.show());
    this.window.once('closed', () => this.close());
  }

  private calcWindowPosition(
    width: number,
    height: number,
    right?: boolean,
    bottom?: boolean
  ): { x: number; y: number } {
    const res = {
      x: 5,
      y: 10,
    };
    const displaySize = screen.getPrimaryDisplay().size;
    if (right) {
      res.x = displaySize.width - width - 5;
    }
    // 通知領域用のマージン
    if (bottom) {
      res.y = displaySize.height - height - 40;
    }
    return res;
  }

  public setWindowPosition(
    width: number,
    height: number,
    right?: boolean,
    bottom?: boolean
  ): void {
    const calcData = this.calcWindowPosition(width, height, right, bottom);
    this.window.setPosition(calcData.x, calcData.y);
  }
}
