import { app, Menu, nativeImage, Tray } from 'electron';
import { autoUpdater } from 'electron-updater';
import { resolve } from 'path';
import { Application } from './application';
import { store } from './component/store';
import { getExtraDirectory } from './utility';

// readyイベント前に呼び出せない
export function createTray(main: Application): Tray {
  const config = store.get('notification');
  const tray = new Tray(
    nativeImage.createFromPath(resolve(getExtraDirectory(), 'win_icon.png'))
  );
  const menu = Menu.buildFromTemplate([
    {
      id: '1',
      label: 'コメント表示',
      click: () => {
        if (main.viewWindow) {
          main.viewWindow.window.showInactive();
        } else {
          main.createViewWindow();
        }
      },
    },
    {
      id: '2',
      label: 'コメント非表示',
      click: () => {
        if (main.viewWindow) {
          main.viewWindow.close();
        }
      },
    },
    {
      id: '3',
      label: '設定',
      click: () => {
        if (main.settingWindow) {
          main.settingWindow.window.show();
        } else {
          main.createSettingWindow();
        }
      },
    },
    { type: 'separator' },
    {
      id: '4',
      label: '更新確認',
      click: () => autoUpdater.checkForUpdatesAndNotify(),
    },
    {
      id: '5',
      label: 'ヘルプ',
      click: () => {
        if (main.readmeWindow) {
          main.readmeWindow.window.show();
        } else {
          main.createReadmeWindow();
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
  if (config.onBoot) {
    tray.displayBalloon({
      title: 'OLCV起動完了',
      content: '通知領域のアイコンからコメントの表示と設定が出来ます',
      noSound: config.noSound,
    });
  }
  return tray;
}
