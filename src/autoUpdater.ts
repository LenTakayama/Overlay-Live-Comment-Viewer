import { app } from 'electron';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import log from 'electron-log';

log.transports.file.level = 'info';
autoUpdater.logger = log;
autoUpdater.allowPrerelease = false;

log.info('App starting...');
autoUpdater.on('error', (err: Error) => {
  log.error('Error in auto updater. ' + err);
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
