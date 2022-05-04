import { Versions } from './front';
import { Configs, CssMode, NotificationConfig, OneCommeConfig } from './main';

declare global {
  interface Window {
    electronApis: {
      getConfigs(): Promise<Configs>;
      pushConfigs(config: Configs): Promise<Configs>;
      sendResetConfigsRequest(): Promise<Configs>;
      sendRestCssRequest(): Promise<Configs>;
      getVersion(): Versions;
      displayComment(): Promise<void>;
      hideComment(): Promise<void>;
      sendOneCommeBootRequest(): Promise<void>;
    };
  }
}
