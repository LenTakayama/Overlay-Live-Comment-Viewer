import ElectronStore from 'electron-store';
import { getOneCommePath } from '../integrations/oneComme';
import { NotificationConfig, StoreSchema } from '@/@types/main';

export const store = new ElectronStore<StoreSchema>({
  name: 'config',
  migrations: {
    '>=1.1.0': (migStore) => {
      const insertCss = migStore.get('insert-css');
      migStore.set('insert-css', {
        css: insertCss.css,
        cssMode: 'youtube_default',
      });
      const notificationConfig = <NotificationConfig>(
        migStore.get('notification')
      );
      migStore.set('onBootConfig', {
        noSound: notificationConfig.noSound,
        notification: notificationConfig.onBoot,
        openSetting: true,
      });
      // スキーマからはずしたため削除しようとするとTSのチェックでエラーになるため除外
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      migStore.delete('notification');
    },
    '1.0.0': (migStore) => {
      const oldData = migStore.get('window-size', {
        height: 500,
        width: 400,
      });
      migStore.set('comment-window-config', {
        width: oldData.width,
        height: oldData.height,
        right: true,
        bottom: false,
      });
    },
  },
  defaults: {
    version: 'none version',
    'comment-window-config': {
      right: true,
      bottom: false,
      width: 400,
      height: 500,
    },
    'insert-css': {
      css: undefined,
      cssMode: 'youtube_default',
    },
    'load-url': {
      url: undefined,
    },
    onBootConfig: {
      noSound: false,
      notification: true,
      openSetting: true,
    },
    oneCommeConfig: {
      isBoot: false,
      path: getOneCommePath(),
    },
  },
});
