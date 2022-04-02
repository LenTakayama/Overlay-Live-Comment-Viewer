import { app, shell, Tray } from 'electron';
import ElectronLog from 'electron-log';
import ElectronStore from 'electron-store';
import { ApplicationInterface, StoreSchema } from '~/@types/main';
import { onBootOpenOneComme } from './integrations/oneComme';
import { addIpcMainHandles } from './ipcMain';
import { createTray } from './tray';
import { createMenu } from './window/menu';
import { ReadmeWindow } from './window/readme';
import { SettingWindow } from './window/setting';
import { ViewWindow } from './window/view';

export class Application implements ApplicationInterface {
  public settingWindow?: SettingWindow;
  public viewWindow?: ViewWindow;
  public readmeWindow?: ReadmeWindow;
  public tray?: Tray;
  public store: ElectronStore<StoreSchema>;
  public log: ElectronLog.ElectronLog;

  constructor(store: ElectronStore<StoreSchema>, log: ElectronLog.ElectronLog) {
    this.store = store;
    this.log = log;

    this.addOnReadyEventHandler();
    this.addOnWebContentsCreatedEventHandler();
    app.on('window-all-closed', () => null);
    addIpcMainHandles(this);
  }
  public createSettingWindow(): void {
    const menu = createMenu();
    this.settingWindow = new SettingWindow(menu);
  }
  public createViewWindow(): void {
    this.viewWindow = new ViewWindow(this.store);
  }
  public createReadmeWindow(): void {
    this.readmeWindow = new ReadmeWindow();
  }

  private addOnReadyEventHandler() {
    // 起動スクリプト
    app.once('ready', () => {
      // 多重起動防止
      const gotTheLock = app.requestSingleInstanceLock();
      if (!gotTheLock) {
        app.quit();
      } else {
        app.on('second-instance', () => {
          // Someone tried to run a second instance, we should focus our window.
          if (this.settingWindow) {
            if (this.settingWindow.window.isMinimized())
              this.settingWindow.window.restore();
            this.settingWindow.window.focus();
          }
        });
      }
      // TrayはReadyの前に作成はできない
      this.tray = createTray(this);
      const loadVersion = this.store.get('version');
      // バージョンが一致してない場合初回起動かアップデートどちらかとみなせる
      if (loadVersion !== app.getVersion()) {
        this.store.set('version', app.getVersion());
        this.createReadmeWindow();
      }
      const oneCommeConfig = this.store.get('oneCommeConfig');
      onBootOpenOneComme(oneCommeConfig);
    });
  }
  private addOnWebContentsCreatedEventHandler(): void {
    app.on('web-contents-created', (_event, contents) => {
      contents.setWindowOpenHandler((details) => {
        const url = details.url;
        if (
          url ===
            'https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/blob/develop/README.md' ||
          url === 'https://twitter.com/Len_Takayama' ||
          url ===
            'https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/issues'
        ) {
          shell.openExternal(url);
        }
        return { action: 'deny' };
      });
      contents.on('will-navigate', (event) => {
        event.preventDefault();
      });
      contents.session.setPermissionRequestHandler(
        (_webContents, _permission, callback) => callback(false)
      );
    });
  }
}
