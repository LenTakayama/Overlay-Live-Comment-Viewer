import { app, BrowserWindow } from 'electron';
import { resolve, join } from 'path';

/**
 * Preload スクリプトの所在するディレクトリを取得
 *
 * 開発時には webpack の出力先を指定し、
 * electron-builder によるパッケージ後には 'asarUnpack' オプションに
 * 設定したディレクトリを返す
 */
const getResourceDirectory = () => {
  return join(process.cwd(), 'dist');
};

/**
 * BrowserWindowインスタンスを作成する関数
 */
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      /**
       * BrowserWindowインスタンス（レンダラープロセス）では
       * Node.jsの機能を無効化する（デフォルト）
       */
      nodeIntegration: false,
      /**
       * Preloadスクリプトは絶対パスで指定する
       */
      preload: resolve(getResourceDirectory(), 'preload.js'),
    },
  });

  // レンダラープロセスをロード
  mainWindow.loadFile('dist/index.html');
};

/**
 * アプリが起動したら BrowserWindow インスタンスを作成し、
 * レンダラープロセス（index.htmlとそこから呼ばれるスクリプト）を
 * ロードする
 */
app.whenReady().then(createWindow);

// すべてのウィンドウが閉じられたらアプリを終了する
app.once('window-all-closed', () => app.quit());
