import { app, shell, Tray } from 'electron';
import ElectronLog from 'electron-log';
import ElectronStore from 'electron-store';
import { ApplicationInterface, Configs, StoreSchema } from '~/@types/main';
import { onBootOpenOneComme } from './integrations/oneComme';
import { addIpcMainHandles } from './ipcMain';
import { createTray } from './tray';
import { createMenu } from './window/menu';
import { ReadmeWindow } from './window/readme';
import { SettingWindow } from './window/setting';
import { ViewWindow } from './window/view';
import { url as urlList } from './allowURLs.json';

export class Application implements ApplicationInterface {
  public settingWindow: SettingWindow;
  public viewWindow: ViewWindow;
  public readmeWindow: ReadmeWindow;
  public tray?: Tray;
  public store: ElectronStore<StoreSchema>;
  public log: ElectronLog.ElectronLog;

  constructor(store: ElectronStore<StoreSchema>, log: ElectronLog.ElectronLog) {
    this.store = store;
    this.log = log;
    const menu = createMenu();
    this.settingWindow = new SettingWindow(menu);
    this.viewWindow = new ViewWindow(this.store);
    this.readmeWindow = new ReadmeWindow();

    this.addOnReadyEventHandler();
    this.addOnWebContentsCreatedEventHandler();
    app.on('window-all-closed', () => null);
    app.once('will-quit', (_e) => {
      this.tray?.destroy();
      this.tray = undefined;
    });
    addIpcMainHandles(this);
  }
  public createSettingWindow(): void {
    this.settingWindow.create();
  }
  public createViewWindow(): void {
    this.viewWindow.create();
  }
  public createReadmeWindow(): void {
    this.readmeWindow.create();
  }

  public getConfigs(): Configs {
    // TODO: パフォーマンスの問題が出てきたらプロパティに持つようにする
    const url = this.store.get('load-url');
    const css = this.store.get('insert-css');
    const windowConfig = this.store.get('comment-window-config');
    const onBootConfig = this.store.get('onBootConfig');
    const oneCommeConfig = this.store.get('oneCommeConfig');
    return {
      loadUrl: url,
      insertCss: css,
      windowConfig: windowConfig,
      onBootConfig: onBootConfig,
      oneCommeConfig: oneCommeConfig,
    };
  }
  public setConfigs(configs: Configs): Configs {
    this.viewWindow.setURL(configs.loadUrl.url);
    this.viewWindow.setCss(configs.insertCss);
    this.viewWindow.setWindowPositionAndSize(
      configs.windowConfig.width,
      configs.windowConfig.height,
      configs.windowConfig.right,
      configs.windowConfig.bottom
    );
    // 現状起動時にのみの設定のため保存するだけ
    this.store.set('onBootConfig', configs.onBootConfig);
    // 呼び出されるたびにストアからアクセスしているので保存するだけ
    this.store.set('oneCommeConfig', configs.oneCommeConfig);

    return this.getConfigs();
  }
  public resetConfig(): void {
    this.viewWindow.clearURL();
    this.viewWindow.resetCss();
    this.viewWindow.resetWindowPositionAndSize();
    this.store.clear();
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
          if (this.settingWindow.window) {
            if (this.settingWindow.window.isMinimized())
              this.settingWindow.window.restore();
            this.settingWindow.window.focus();
          }
        });
      }
      // TrayはReadyの前に作成はできない
      this.tray = createTray(this);
      const onBootOpenSetting = this.store.get('onBootConfig').openSetting;
      const loadVersion = this.store.get('version');
      // バージョンが一致してない場合、初回起動かアップデートどちらかとみなせる
      if (loadVersion !== app.getVersion()) {
        this.store.set('version', app.getVersion());
        this.createReadmeWindow();
      }
      if (onBootOpenSetting) {
        this.createSettingWindow();
      }
      const oneCommeConfig = this.store.get('oneCommeConfig');
      onBootOpenOneComme(oneCommeConfig);
    });
  }
  private addOnWebContentsCreatedEventHandler(): void {
    app.on('web-contents-created', (_event, contents) => {
      contents.setWindowOpenHandler((details) => {
        const url = details.url;
        if (urlList.includes(url)) {
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
