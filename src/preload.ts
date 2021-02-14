import { contextBridge, ipcRenderer } from 'electron';
import { version } from '~/package.json';

contextBridge.exposeInMainWorld('electronApis', {
  sendLoadURL: async (url: string): Promise<void> =>
    await ipcRenderer.invoke('load-url', url),
  sendInsertCSS: async (css: string): Promise<void> =>
    await ipcRenderer.invoke('insert-css', css),
  sendWindowConfig: async (
    width: number,
    height: number,
    right: boolean,
    bottom: boolean
  ) => await ipcRenderer.invoke('window-config', width, height, right, bottom),
  sendReset: async () => await ipcRenderer.invoke('reset-config'),
  sendDefaultCss: async () => await ipcRenderer.invoke('default-css'),
  getVersion: () => {
    return {
      app: version,
      node: process.versions.node,
      electron: process.versions.electron,
    };
  },
  displayComment: async () => await ipcRenderer.invoke('display-comment'),
});
