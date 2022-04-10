import { Versions } from './front';
import { Configs, NotificationConfig, OneCommeConfig } from './main';

declare global {
  interface Window {
    electronApis: {
      getConfigs(): Promise<Configs>;
      pushConfigs(config: Configs): Promise<void>;
      sendResetConfigRequest(): Promise<Configs>;
      sendDefaultCss(): Promise<void>;
      getVersion(): Versions;
      displayComment(): Promise<void>;
      sendOneCommeBootRequest(): Promise<void>;
    };
  }
}
