import { Versions } from './front';
import { Configs, CssMode, NotificationConfig, OneCommeConfig } from './main';

declare global {
  interface Window {
    electronApis: {
      getConfigs(): Promise<Configs>;
      pushConfigs(config: Configs): Promise<void>;
      sendResetConfigsRequest(): Promise<Configs>;
      sendDefaultCss(): Promise<void>;
      getVersion(): Versions;
      displayComment(): Promise<void>;
      sendOneCommeBootRequest(): Promise<void>;
      sendCssMode(cssMode: string, css: string): Promise<void>;
    };
  }
}
