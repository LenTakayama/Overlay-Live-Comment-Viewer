import { BrowserWindow, dialog, Menu } from 'electron';
import { join } from 'path';
import { ElectronWindow } from '~/@types/main';
import { getResourceDirectory } from '~/src/utility';
import { closeWindow } from './utility';

export class SettingWindow implements ElectronWindow {
  public window?: BrowserWindow;
  public menu: Menu;
  readonly REST_CSS_MESSAGE = 'ユーザーカスタムCSSとCSSの選択を初期化します';

  constructor(menu: Menu) {
    this.menu = menu;
  }

  public create() {
    this.window = new BrowserWindow({
      show: false,
      frame: true,
      autoHideMenuBar: true,
      height: 760,
      width: 400,
      webPreferences: {
        sandbox: true,
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
    this.window.webContents.on('context-menu', () => {
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
  /**
   * 「OK」と「キャンセル」の選択肢を持ったダイアログを出し、その選択結果を返す
   * @param message 「〇〇します」の形のメッセージ
   */
  public async openConfirmDialog(message: string): Promise<boolean> {
    if (this.window) {
      const dialogResponse = await dialog.showMessageBox(this.window, {
        type: 'question',
        message: message,
        buttons: ['OK', 'cancel'],
        title: 'Setting Confirm - OLCV',
      });
      // buttonsのインデックスと連携するため 0 - OK,
      if (dialogResponse.response == 0) {
        return true;
      }
    }
    return false;
  }
}
