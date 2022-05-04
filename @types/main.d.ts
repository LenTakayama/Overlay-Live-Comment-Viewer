import { BrowserView, BrowserWindow, Menu, Tray } from 'electron';
import ElectronStore from 'electron-store';
import { ReadmeWindow } from '~/src/window/readme';
import { SettingWindow } from '~/src/window/setting';
import { ViewWindow } from '~/src/window/view';

export type InsertCSS = {
  css?: string;
  cssMode: string;
};

export type LoadURL = {
  url?: string;
};

export type WindowSize = {
  width: number;
  height: number;
};

export type WindowConfig = {
  right: boolean;
  bottom: boolean;
  width: number;
  height: number;
};

export type OnBootConfig = {
  noSound: boolean;
  notification: boolean;
  openSetting: boolean;
};

export type OneCommeConfig = {
  isBoot: boolean;
  path: string;
};

// 廃止
export type NotificationConfig = {
  noSound: boolean;
  onBoot: boolean;
};

export type Configs = {
  loadUrl: LoadURL;
  insertCss: InsertCSS;
  windowConfig: WindowConfig;
  onBootConfig: OnBootConfig;
  oneCommeConfig: OneCommeConfig;
};

export type StoreSchema = {
  version: string;
  'comment-window-config': WindowConfig;
  'insert-css': InsertCSS;
  'load-url': LoadURL;
  onBootConfig: OnBootConfig;
  oneCommeConfig: OneCommeConfig;
};

export interface ElectronWindow {
  window?: BrowserWindow;
  create(): void;
  close(): void;
}

export interface ApplicationInterface {
  settingWindow: SettingWindow;
  viewWindow: ViewWindow;
  readmeWindow: ReadmeWindow;
  tray?: Tray;
  createSettingWindow(): void;
  createViewWindow(): void;
  createReadmeWindow(): void;
}
