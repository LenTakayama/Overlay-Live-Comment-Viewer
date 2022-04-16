import { ipcMain } from 'electron';
import { Application } from './application';
import { Configs } from '~/@types/main';
import { bootOneComme } from './integrations/oneComme';
import { IPC_CHANNELS } from './ipcChannels';

export function addIpcMainHandles(application: Application): void {
  ipcMain.handle(IPC_CHANNELS.GET_CONFIGS_CHANNEL, (): Configs => {
    return application.getConfigs();
  });

  ipcMain.handle(IPC_CHANNELS.RESET_CONFIGS_REQUEST_CHANNEL, async () => {
    application.resetConfig();
    return application.getConfigs();
  });

  ipcMain.handle('default-css', async () => {
    application.viewWindow.resetCss();
  });

  ipcMain.handle('display-comment', () => {
    if (!application.viewWindow.window) {
      application.createViewWindow();
    }
  });

  ipcMain.handle(IPC_CHANNELS.ONE_COMME_BOOT_REQUEST_CHANNEL, () => {
    bootOneComme(application.store);
    return;
  });

  ipcMain.handle(
    IPC_CHANNELS.SEND_CSS_MODE_CHANNEL,
    (_ev, cssMode: string, css: string) =>
      application.viewWindow.selectCss(cssMode, css)
  );
}
