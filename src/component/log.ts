import ElectronLog from 'electron-log';
import { join } from 'path';

const log = ElectronLog;
log.transports.console.level =
  process.env.NODE_ENV == 'development' ? 'debug' : 'info';
log.transports.file.level = 'info';
log.transports.file.resolvePath = (variables: ElectronLog.PathVariables) => {
  if (variables.electronDefaultDir) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return join(variables.electronDefaultDir, variables.fileName!);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return join(variables.libraryDefaultDir, variables.fileName!);
  }
};
// とりあえず未確認のエラーをハンドリング
log.catchErrors({
  showDialog: true,
});

export { log };
