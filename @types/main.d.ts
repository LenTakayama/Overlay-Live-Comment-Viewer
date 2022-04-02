import { BrowserView, BrowserWindow, Menu, Tray } from 'electron';
import ElectronStore from 'electron-store';
import { ReadmeWindow } from '~/src/window/readme';
import { SettingWindow } from '~/src/window/setting';
import { ViewWindow } from '~/src/window/view';

export type InsertCSS = {
  css: string | null;
};

export type LoadURL = {
  url: string | null;
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

export type NotificationConfig = {
  noSound: boolean;
  onBoot: boolean;
};

export type OneCommeConfig = {
  isBoot: boolean;
  path: string;
};

export type StoreSchema = {
  version: string;
  'comment-window-config': {
    right: boolean;
    bottom: boolean;
    width: number;
    height: number;
  };
  'insert-css': {
    css?: string;
  };
  'load-url': {
    url?: string;
  };
  notification: {
    noSound: boolean;
    onBoot: boolean;
  };
  oneCommeConfig: {
    isBoot: boolean;
    path: string;
  };
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
