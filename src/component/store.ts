import ElectronStore from 'electron-store';
import { WindowSize } from '~/types/main';
import { getOneCommePath } from '../integrations/oneComme';

export const store = new ElectronStore({
  name: 'config',
  migrations: {
    '1.0.0': (migStore) => {
      const oldData = <WindowSize>migStore.get('window-size', {
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
    'comment-window-config': {
      right: true,
      bottom: false,
      width: 400,
      height: 500,
    },
    'insert-css': {
      css: null,
    },
    'load-url': {
      url: null,
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
