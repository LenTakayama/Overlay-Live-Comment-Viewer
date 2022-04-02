import { ipcMain } from 'electron';
import { Application } from './application';
import { store } from './component/store';
import { getExtraDirectory, getResourceDirectory } from './utility';
import { join, resolve } from 'path';
import { readFileSync } from 'fs';
import { NotificationConfig, OneCommeConfig } from '~/@types/main';
import { openOneComme } from './integrations/oneComme';

export function addIpcMainHandles(application: Application): void {
  ipcMain.handle('ready-index-page', () => {
    return store.get('notification');
  });

  ipcMain.handle('load-url', (_ipcEvent, message: string) => {
    application.viewWindow?.window.webContents.loadURL(message);
    store.set('load-url', {
      url: message,
    });
    return;
  });

  ipcMain.handle('insert-css', async (_ipcEvent, message: string) => {
    const insertCSSKey = application.viewWindow?.insertCSSKey;
    if (insertCSSKey) {
      application.viewWindow?.window.webContents.removeInsertedCSS(
        await insertCSSKey
      );
    }
    application.viewWindow?.window.webContents.insertCSS(message);
    store.set('insert-css', {
      css: message,
    });
    return;
  });

  ipcMain.handle(
    'window-config',
    (
      _ipcEvent,
      msgWidth: number,
      msgHeight: number,
      msgRight: boolean,
      msgBottom: boolean
    ) => {
      application.viewWindow?.window.setSize(msgWidth, msgHeight);
      application.viewWindow?.setWindowPosition(
        msgWidth,
        msgHeight,
        msgRight,
        msgBottom
      );
      store.set('comment-window-config', {
        right: msgRight,
        bottom: msgBottom,
        width: msgWidth,
        height: msgHeight,
      });
      return;
    }
  );

  ipcMain.handle('reset-config', async () => {
    const viewWindowWebContents = application.viewWindow?.window.webContents;
    if (viewWindowWebContents) {
      viewWindowWebContents.loadURL(
        join(getResourceDirectory(), 'notfound.html')
      );
      const insertCSSKey = application.viewWindow?.insertCSSKey;
      if (insertCSSKey) {
        viewWindowWebContents.removeInsertedCSS(await insertCSSKey);
      }
      viewWindowWebContents.insertCSS(
        readFileSync(
          resolve(getExtraDirectory(), 'comment.bundle.css')
        ).toString()
      );
    }
    if (application.viewWindow?.window) {
      application.viewWindow?.window.setSize(400, 500);
      application.viewWindow.setWindowPosition(400, 500, true, false);
    }
    store.clear();
  });

  ipcMain.handle('default-css', async () => {
    const viewWindowWebContents = application.viewWindow?.window.webContents;
    if (viewWindowWebContents) {
      const insertCSSKey = application.viewWindow?.insertCSSKey;
      if (insertCSSKey) {
        viewWindowWebContents.removeInsertedCSS(await insertCSSKey);
      }
      viewWindowWebContents.insertCSS(
        readFileSync(
          resolve(getExtraDirectory(), 'comment.bundle.css')
        ).toString()
      );
    }
    store.delete('insert-css');
  });

  ipcMain.handle('display-comment', () => {
    if (!application.viewWindow?.window) {
      application.createViewWindow();
    }
  });

  ipcMain.handle(
    'set-notification-config',
    (_event, config: NotificationConfig) =>
      store.set('notification', {
        noSound: config.noSound,
        onBoot: config.onBoot,
      })
  );

  ipcMain.handle('one-comme-config', (_event, config: OneCommeConfig) => {
    store.set('oneCommeConfig', {
      isBoot: config.isBoot,
      path: config.path,
    });
  });

  ipcMain.handle('one-comme-boot', () => {
    const oneCommeConfig = store.get('oneCommeConfig');
    openOneComme(oneCommeConfig.path);
  });
}
