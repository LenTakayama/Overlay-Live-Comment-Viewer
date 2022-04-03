import { ipcMain } from 'electron';
import { Application } from './application';
import { NotificationConfig, OneCommeConfig } from '~/@types/main';
import { bootOneComme, saveOneCommeConfig } from './integrations/oneComme';

export function addIpcMainHandles(application: Application): void {
  ipcMain.handle('ready-index-page', () => {
    return application.store.get('notification');
  });

  ipcMain.handle('load-url', (_ipcEvent, message: string) => {
    application.viewWindow.setURL(message);
    return;
  });

  ipcMain.handle('insert-css', async (_ipcEvent, message: string) => {
    application.viewWindow.setCSS(message);
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
      application.viewWindow.setWindowPositionAndSize(
        msgWidth,
        msgHeight,
        msgRight,
        msgBottom
      );
      return;
    }
  );

  ipcMain.handle('reset-config', async () => {
    application.resetConfig();
  });

  ipcMain.handle('default-css', async () => {
    application.viewWindow.resetCSS();
  });

  ipcMain.handle('display-comment', () => {
    if (!application.viewWindow.window) {
      application.createViewWindow();
    }
  });

  ipcMain.handle(
    'set-notification-config',
    (_event, config: NotificationConfig) => {
      application.saveNotificationConfig(config);
    }
  );

  ipcMain.handle('one-comme-config', (_event, config: OneCommeConfig) => {
    saveOneCommeConfig(application.store, config);
    return;
  });

  ipcMain.handle('one-comme-boot', () => {
    bootOneComme(application.store);
    return;
  });
}
