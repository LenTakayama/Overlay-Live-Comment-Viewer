import { app, shell } from 'electron';
import ElectronStore from 'electron-store';
import { existsSync } from 'fs';
import { sep, join } from 'path';
import { OneCommeConfig, StoreSchema } from '~/@types/main';

const ONE_COMME_DIR_NAME = 'live-comment-viewer';
const ONE_COMME_APP_NAME = 'わんコメ - OneComme.exe';

export function getOneCommePath(): string {
  // OLCVはローカルインストールとグローバルインストール両方が存在する
  const pathArray = app.getAppPath().split(sep);
  // OLCVと同じ階層にあるかまず確認する
  pathArray.push('..', ONE_COMME_DIR_NAME, ONE_COMME_APP_NAME);
  const currentPath = join(...pathArray);
  if (existsSync(currentPath)) {
    return currentPath;
  }
  // なければAppDataから辿る
  // FIXME: Windowsのみ対応
  const userDataPathArray = app.getPath('appData').split(sep);
  userDataPathArray.push(
    '..',
    'local',
    'Programs',
    ONE_COMME_DIR_NAME,
    ONE_COMME_APP_NAME
  );
  const userDataPath = join(...userDataPathArray);
  if (existsSync(userDataPath)) {
    return userDataPath;
  } else {
    return '';
  }
}
export function onBootOpenOneComme(config: OneCommeConfig): void {
  if (config.isBoot && config.path) {
    shellOpenPath(config.path);
  }
}
export function bootOneComme(store: ElectronStore<StoreSchema>) {
  const config = store.get('oneCommeConfig');
  shellOpenPath(config.path);
}
export function saveOneCommeConfig(
  store: ElectronStore<StoreSchema>,
  config: OneCommeConfig
) {
  store.set('oneCommeConfig', config);
}

function shellOpenPath(path: string): void {
  shell.openPath(path);
}
