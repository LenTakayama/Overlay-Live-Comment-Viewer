import { app, dialog } from 'electron';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import log from 'electron-log';
import { join } from 'path';

log.transports.file.level = 'info';
log.transports.file.resolvePath = (variables: log.PathVariables) => {
  if (variables.electronDefaultDir && variables.fileName) {
    return join(variables.electronDefaultDir, variables.fileName);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return join(variables.libraryDefaultDir, variables.fileName!);
  }
};
autoUpdater.logger = log;
autoUpdater.allowPrerelease = false;

log.info('App starting...');
autoUpdater.on('error', (err: Error) => {
  log.error(`Error in auto updater. ${err.message}`);
  log.error(err);
  dialog.showErrorBox(
    '自動更新に失敗しました',
    `自動更新実行中にエラーが発生しました。再度更新チェックをお願いします。\n何度試してもエラーが解消しない場合Twitterで@len_takayama宛に連絡かGitHubでIssuesまたはDiscussionsを開いてください。\n\nError Message:\n${err.message}`
  );
});
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
});
autoUpdater.on('update-available', (info: UpdateInfo) => {
  log.info(`Update to ${info.version} is available`);
});
autoUpdater.on('update-not-available', (_info: UpdateInfo) => {
  log.info('Update not available.');
});
autoUpdater.on('download-progress', () => {
  log.info(`Download update.`);
});
autoUpdater.on('update-downloaded', (_info: UpdateInfo) => {
  log.info('Finish update downloaded');
});
app.on('ready', async () => {
  autoUpdater.checkForUpdatesAndNotify();
});
