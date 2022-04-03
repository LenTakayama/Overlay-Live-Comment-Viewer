import { BrowserView, BrowserWindow, screen } from 'electron';
import { join } from 'path';
import { readFileSync } from 'fs';
import { ElectronWindow, StoreSchema } from '~/@types/main';
import { getResourceDirectory, getExtraDirectory } from '~/src/utility';
import { closeWindow } from './utility';
import ElectronStore from 'electron-store';

export class ViewWindow implements ElectronWindow {
  public window?: BrowserWindow;
  public view?: BrowserView;
  public store: ElectronStore<StoreSchema>;
  public insertCSSKey?: Promise<string>;

  constructor(store: ElectronStore<StoreSchema>) {
    this.store = store;
  }
  public create(): void {
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
      loadURL.url ? loadURL.url : this.returnNotfoundHtml()
    );
    this.view.webContents.once('did-finish-load', () => {
      this.insertCSSKey = this.view?.webContents.insertCSS(
        insertCSS.css ? insertCSS.css : this.returnDefaultCss()
      );
      this.window?.showInactive();
    });

    this.window.once('ready-to-show', () => this.window?.show());
    this.window.once('closed', () => this.close());
  }
  public close(): void {
    closeWindow(this.window);
    this.window = undefined;
  }

  public setWindowPositionAndSize(
    width: number,
    height: number,
    right?: boolean,
    bottom?: boolean
  ): void {
    if (this.window) {
      const calcData = this.calcWindowPosition(width, height, right, bottom);
      this.window?.setSize(width, height);
      this.window?.setPosition(calcData.x, calcData.y);
    }
    this.store.set('comment-window-config', {
      right: right,
      bottom: bottom,
      width: width,
      height: height,
    });
  }
  public resetWindowPositionAndSize(): void {
    this.setWindowPositionAndSize(400, 500, true, false);
  }
  public setURL(url: string): void {
    this.view?.webContents.loadURL(url);
    this.store.set('load-url', {
      url: url,
    });
  }
  public clearURL(): void {
    this.view?.webContents.loadURL(this.returnNotfoundHtml());
  }
  public async setCSS(css: string): Promise<void> {
    await this.removeCSS();
    this.view?.webContents.insertCSS(css);
    this.store.set('insert-css', {
      css: css,
    });
  }
  public async removeCSS(): Promise<void> {
    const insertCSSKey = this.insertCSSKey;
    if (insertCSSKey) {
      this.view?.webContents.removeInsertedCSS(await insertCSSKey);
    }
  }
  public async resetCSS(): Promise<void> {
    await this.removeCSS();
    this.setCSS(this.returnDefaultCss());
    this.store.delete('insert-css');
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
  private returnDefaultCss(): string {
    return readFileSync(
      join(getExtraDirectory(), 'comment.bundle.css')
    ).toString();
  }
  private returnNotfoundHtml(): string {
    return join(getResourceDirectory(), 'notfound.html');
  }
}
