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
