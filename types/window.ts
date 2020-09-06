import { IpcRenderer } from 'electron';
interface MyWindow extends Window {
  ipcRenderer: IpcRenderer;
}
declare const window: MyWindow;
export default window;
