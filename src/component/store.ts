import ElectronStore from 'electron-store';
import { getOneCommePath } from '../integrations/oneComme';
import { StoreSchema } from '@/@types/main';

export const store = new ElectronStore<StoreSchema>({
  name: 'config',
  migrations: {
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
    notification: {
      noSound: false,
      onBoot: true,
    },
    oneCommeConfig: {
      isBoot: false,
      path: getOneCommePath(),
    },
  },
});
