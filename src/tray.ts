import { app, dialog, Menu, nativeImage, Tray } from 'electron';
import { autoUpdater } from 'electron-updater';
import { join } from 'path';
import { gt } from 'semver';
import { Application } from './application';
import { getExtraDirectory } from './utility';

// readyイベント前に呼び出せない
export function createTray(application: Application): Tray {
  const config = application.store.get('onBootConfig');
  const tray = new Tray(
    nativeImage.createFromPath(join(getExtraDirectory(), 'win_icon.ico'))
  );
  const menu = Menu.buildFromTemplate([
    {
      id: '1',
      label: 'コメント表示',
      click: () => {
        if (application.viewWindow.window) {
          application.viewWindow.window.showInactive();
        } else {
          application.createSettingWindow();
        }
      },
    },
    {
      id: '2',
      label: 'コメント非表示',
      click: () => {
        application.viewWindow.close();
      },
    },
    {
      id: '3',
      label: '設定',
      click: () => {
        if (application.settingWindow.window) {
          application.settingWindow.window.show();
        } else {
          application.createSettingWindow();
        }
      },
    },
    { type: 'separator' },
    {
      id: '4',
      label: '更新確認',
      click: () =>
        autoUpdater.checkForUpdatesAndNotify().then((result) => {
          if (result) {
            // 更新先が現在バージョンより大きかった場合updater側で処理するため何もしない
            if (gt(result.updateInfo.version, app.getVersion())) return;
          }
          dialog.showMessageBox({
            type: 'info',
            message: '更新はありませんでした',
            title: 'Update Checker - OLCV',
          });
        }),
    },
    {
      id: '5',
      label: 'ヘルプ',
      click: () => {
        if (application.readmeWindow.window) {
          application.readmeWindow.window.show();
        } else {
          application.createReadmeWindow();
        }
      },
    },
    { type: 'separator' },
    {
      id: '6',
      label: '終了',
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setToolTip('OLCV');
  tray.setContextMenu(menu);
  tray.on('click', () => {
    tray.popUpContextMenu(menu);
  });
  tray.on('double-click', () => {
    if (application.settingWindow.window) {
      application.settingWindow.window.focus();
    } else {
      application.createSettingWindow();
    }
  });
  if (config.notification) {
    tray.displayBalloon({
      title: 'OLCV起動完了',
      content: '通知領域のアイコンからコメントの表示と設定が出来ます',
      noSound: config.noSound,
    });
  }
  return tray;
}
