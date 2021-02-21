import { Versions } from './front';

declare global {
  interface Window {
    electronApis: {
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
    };
  }
}
