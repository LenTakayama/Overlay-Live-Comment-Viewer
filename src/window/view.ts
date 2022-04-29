import { BrowserView, BrowserWindow, screen } from 'electron';
import { join } from 'path';
import { readFileSync } from 'fs';
import { ElectronWindow, InsertCSS, StoreSchema } from '~/@types/main';
import { getResourceDirectory, getExtraDirectory } from '~/src/utility';
import { closeWindow } from './utility';
import ElectronStore from 'electron-store';

export class ViewWindow implements ElectronWindow {
  public window?: BrowserWindow;
  public view?: BrowserView;
  public store: ElectronStore<StoreSchema>;
  public insertCSSKey?: string;

  constructor(store: ElectronStore<StoreSchema>) {
    this.store = store;
  }
  public create(): void {
    const loadURL = this.store.get('load-url');
    const insertCss = this.store.get('insert-css');
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
    this.view.webContents
      .loadURL(loadURL.url ? loadURL.url : this.returnNotfoundHtml())
      .then(async () => {
        this.setCss(insertCss);
      });
    this.view.webContents.once('did-finish-load', async () => {
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
  public setURL(url?: string): void {
    const storeUrl = this.store.get('load-url');
    // 同じURLなら読み込まない
    if (storeUrl.url == url) {
      return;
    }
    if (url) {
      this.view?.webContents.loadURL(url);
    } else {
      this.clearURL();
    }
    this.store.set('load-url', {
      url: url,
    });
  }
  public clearURL(): void {
    this.view?.webContents.loadURL(this.returnNotfoundHtml());
  }

  /**
   * Cssを設定しストアに保存する
   * @param insertCss
   */
  public async setCss(insertCss: InsertCSS): Promise<void> {
    this.removeCss();
    let css = '';
    switch (insertCss.cssMode) {
      case 'youtube_default':
        css = this.returnDefaultCss();
        break;
      case 'user_custom':
        css = insertCss.css ? insertCss.css : '';
        break;
      default:
        break;
    }
    this.insertCSSKey = await this.view?.webContents.insertCSS(css);
    this.store.set('insert-css', insertCss);
  }
  /**
   * Cssの適用を削除するだけストアには反映しない
   */
  private async removeCss(): Promise<void> {
    if (this.insertCSSKey) {
      await this.view?.webContents.removeInsertedCSS(this.insertCSSKey);
      this.insertCSSKey = undefined;
    }
  }
  /**
   * ユーザーCSSを削除しYouTubeデフォルトCSSにする
   */
  public resetCss(): void {
    this.store.reset('insert-css');
    this.setCss(this.store.get('insert-css'));
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
