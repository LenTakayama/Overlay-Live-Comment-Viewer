import { Versions } from './front';
import { NotificationConfig } from './main';

declare global {
  interface Window {
    electronApis: {
      init(): Promise<NotificationConfig>;
      sendLoadURL(url: string): Promise<void>;
      sendInsertCSS(css: string): Promise<void>;
      sendWindowConfig(
        width: number,
        height: number,
        right: boolean,
        bottom: boolean
      ): Promise<void>;
      sendReset(): Promise<void>;
      sendDefaultCss(): Promise<void>;
      getVersion(): Versions;
      displayComment(): Promise<void>;
      sendNotificationConfig(config: NotificationConfig): Promise<void>;
    };
  }
}
