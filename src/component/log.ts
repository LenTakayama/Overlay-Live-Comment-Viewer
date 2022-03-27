import ElectronLog from 'electron-log';
import { join } from 'path';

const log = ElectronLog;
log.transports.file.level = 'info';
log.transports.file.resolvePath = (variables: ElectronLog.PathVariables) => {
  if (variables.electronDefaultDir && variables.fileName) {
    return join(variables.electronDefaultDir, variables.fileName);
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
