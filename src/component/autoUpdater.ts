import { app, dialog } from 'electron';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import { log } from './log';

autoUpdater.logger = log;
autoUpdater.allowPrerelease = false;

log.info('App starting...');
autoUpdater.on('error', (err: Error) => {
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
  confirmAppUpdate();
});
app.once('ready', async () => {
  autoUpdater.checkForUpdates();
});

/**
 * 今すぐアップデートするか聞き、アップデートを行う
 */
async function confirmAppUpdate(): Promise<void> {
  const result = await dialog.showMessageBox({
    message:
      'アップデートが可能です。今アップデートを行いますか\n※ここでアップデートを行わなくても次回アプリ起動時に自動でアップデートされます',
    type: 'info',
    buttons: ['Yes', 'No'],
    title: 'Update Confirm - OLCV',
  });
  if (result.response == 0) {
    autoUpdater.quitAndInstall();
  }
}
