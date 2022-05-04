import { ipcMain } from 'electron';
import { Application } from './application';
import { Configs } from '~/@types/main';
import { bootOneComme } from './integrations/oneComme';
import { IPC_CHANNELS } from './ipcChannels';

export function addIpcMainHandles(application: Application): void {
  ipcMain.handle(IPC_CHANNELS.GET_CONFIGS_CHANNEL, (): Configs => {
    return application.getConfigs();
  });
  ipcMain.handle(
    IPC_CHANNELS.PUSH_CONFIGS_CHANNEL,
    (_e, configs: Configs): Configs => {
      return application.setConfigs(configs);
    }
  );
  ipcMain.handle(
    IPC_CHANNELS.RESET_CONFIGS_REQUEST_CHANNEL,
    async (): Promise<Configs> => {
      const isAgree = await application.settingWindow.openConfirmDialog(
        application.settingWindow.REST_CONFIG_MESSAGE
      );
      if (isAgree) {
        application.resetConfig();
        return application.getConfigs();
      }
      return Promise.reject('user reject reset config');
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.REQUEST_RESET_CSS_CHANNEL,
    async (): Promise<Configs> => {
      const isAgree = await application.settingWindow.openConfirmDialog(
        application.settingWindow.REST_CSS_MESSAGE
      );
      if (isAgree) {
        application.viewWindow.resetCss();
        return application.getConfigs();
      }
      return Promise.reject('user reject reset css');
    }
  );

  ipcMain.handle('display-comment', () => {
    if (!application.viewWindow.window) {
      application.createViewWindow();
    }
  });
  ipcMain.handle(IPC_CHANNELS.REQUEST_HIDE_COMMENT_CHANNEL, () => {
    if (application.viewWindow.window) {
      application.viewWindow.close();
    }
  });

  ipcMain.handle(IPC_CHANNELS.ONE_COMME_BOOT_REQUEST_CHANNEL, () => {
    bootOneComme(application.store);
    return;
  });
}
