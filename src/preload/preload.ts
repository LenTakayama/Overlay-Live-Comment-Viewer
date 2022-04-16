import { contextBridge, ipcRenderer } from 'electron';
import { version } from '~/package.json';
import { IPC_CHANNELS } from '~/src/ipcChannels';
import { Configs } from '~/@types/main';

contextBridge.exposeInMainWorld('electronApis', {
  getConfigs: async (): Promise<Configs> =>
    await ipcRenderer.invoke(IPC_CHANNELS.GET_CONFIGS_CHANNEL),
  pushConfigs: async (config: Configs) => {
    await ipcRenderer.invoke(IPC_CHANNELS.PUSH_CONFIGS_CHANNEL, config);
  },
  sendResetConfigsRequest: async (): Promise<Configs> =>
    await (<Promise<Configs>>(
      ipcRenderer.invoke(IPC_CHANNELS.RESET_CONFIGS_REQUEST_CHANNEL)
    )),
  sendDefaultCss: async () => await ipcRenderer.invoke('default-css'),
  getVersion: () => {
    return {
      app: version,
      node: process.versions.node,
      electron: process.versions.electron,
    };
  },
  displayComment: async () => await ipcRenderer.invoke('display-comment'),
  hideComment: async () =>
    await ipcRenderer.invoke(IPC_CHANNELS.REQUEST_HIDE_COMMENT_CHANNEL),
  sendOneCommeBootRequest: async () => {
    await ipcRenderer.invoke(IPC_CHANNELS.ONE_COMME_BOOT_REQUEST_CHANNEL);
  },
  sendCssMode: async (cssMode: string, css: string) =>
    await ipcRenderer.invoke(IPC_CHANNELS.SEND_CSS_MODE_CHANNEL, cssMode, css),
});
