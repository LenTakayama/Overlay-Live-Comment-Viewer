import {
  app,
  BrowserView,
  BrowserWindow,
  ipcMain,
  screen,
  Menu,
  Tray,
  nativeImage,
  MenuItem,
  shell,
} from 'electron';
import Store from 'electron-store';
import { autoUpdater } from 'electron-updater';
import { resolve, join } from 'path';
import {
  InsertCSS,
  LoadURL,
  NotificationConfig,
  WindowConfig,
  WindowSize,
} from '~/types/main';
import { readFileSync } from 'fs';
import log from 'electron-log';
import '@/src/autoUpdater';

const store = new Store({
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
  },
});

log.transports.file.level = 'info';
log.transports.file.resolvePath = (variables: log.PathVariables) => {
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

let commentWindow: BrowserWindow | null = null;
let commentView: BrowserView | null = null;
let indexWindow: BrowserWindow | null = null;
let readmeWindow: BrowserWindow | null = null;
let insertCSSKey: Promise<string> | null = null;
let tray: Tray | null = null;
let menu: Menu | null = null;

const positionData = (
  width: number,
  height: number,
  right?: boolean,
  bottom?: boolean
): { x: number; y: number } => {
  const res = {
    x: 5,
    y: 10,
  };
  const displaySize = screen.getPrimaryDisplay().size;
  if (right) {
    res.x = displaySize.width - width - 5;
  }
  if (bottom) {
    res.y = displaySize.height - height - 40;
  }
  return res;
};

const getResourceDirectory = () => {
  return process.env.NODE_ENV === 'development'
    ? join(process.cwd(), 'build')
    : join(__dirname);
};

const getExtraDirectory = () => {
  return process.env.NODE_ENV === 'development'
    ? join(process.cwd(), 'public')
    : join(process.resourcesPath, 'public');
};

const createCommentWindow = () => {
  // 設定をロード
  const loadURL = <LoadURL>store.get('load-url');
  const insertCSS = <InsertCSS>store.get('insert-css');
  const windowConfig = <WindowConfig>store.get('comment-window-config');
  const position = positionData(
    windowConfig.width,
    windowConfig.height,
    windowConfig.right,
    windowConfig.bottom
  );
  commentWindow = new BrowserWindow({
    x: position.x,
    y: position.y,
    width: windowConfig.width,
    height: windowConfig.height,
    transparent: true,
    frame: false,
    resizable: false,
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      safeDialogs: true,
      enableWebSQL: false,
    },
  });
  commentView = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      safeDialogs: true,
      enableWebSQL: false,
    },
  });

  commentWindow.setIgnoreMouseEvents(true);
  commentWindow.setBrowserView(commentView);

  commentView.setBounds({
    x: 0,
    y: 0,
    width: windowConfig.width,
    height: windowConfig.height,
  });
  commentView.setAutoResize({ width: true, height: true });
  commentView.webContents.loadURL(
    loadURL.url ? loadURL.url : join(getResourceDirectory(), 'notfound.html')
  );
  commentView.webContents.on('did-finish-load', () => {
    if (commentView) {
      insertCSSKey = commentView.webContents.insertCSS(
        insertCSS.css
          ? insertCSS.css
          : readFileSync(
              resolve(getExtraDirectory(), 'comment.bundle.css')
            ).toString()
      );
      commentWindow?.showInactive();
    }
  });
  commentWindow.webContents.session.webRequest.onHeadersReceived(
    (details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          // 'Content-Security-Policy': ["default-src 'self'"],
        },
      });
    }
  );
  app.once('window-all-closed', () => null);
};

const createIndexWindow = () => {
  indexWindow = new BrowserWindow({
    show: false,
    frame: true,
    autoHideMenuBar: true,
    resizable: false,
    height: 760,
    width: 400,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      safeDialogs: true,
      enableWebSQL: false,
      preload: join(getResourceDirectory(), 'preload.js'),
    },
  });
  const menu = new Menu();
  menu.append(new MenuItem({ role: 'cut' }));
  menu.append(new MenuItem({ role: 'copy' }));
  menu.append(new MenuItem({ role: 'paste' }));
  indexWindow.loadURL(resolve(getResourceDirectory(), 'index.html'));
  indexWindow.webContents.on('context-menu', () => {
    menu.popup();
  });
  indexWindow.on('ready-to-show', () => indexWindow?.show());
  indexWindow.on('closed', () => (indexWindow = null));
  indexWindow.webContents.session.webRequest.onHeadersReceived(
    (details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': ["default-src 'self'"],
        },
      });
    }
  );
  app.once('window-all-closed', () => null);
  process.env.NODE_ENV === 'development'
    ? indexWindow.webContents.openDevTools({ mode: 'detach' })
    : null;
};

const createReadmeWindow = () => {
  readmeWindow = new BrowserWindow({
    show: false,
    frame: true,
    autoHideMenuBar: true,
    height: 700,
    width: 500,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      safeDialogs: true,
      enableWebSQL: false,
    },
  });
  readmeWindow.loadURL(resolve(getResourceDirectory(), 'readme.html'));
  readmeWindow.on('ready-to-show', () => readmeWindow?.show());
  readmeWindow.on('closed', () => (readmeWindow = null));
  readmeWindow.webContents.session.webRequest.onHeadersReceived(
    (details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': ["default-src 'self'"],
        },
      });
    }
  );
  app.once('window-all-closed', () => null);
};

const createMenu = () => {
  const config = store.get('notification');
  tray = new Tray(
    nativeImage.createFromPath(resolve(getExtraDirectory(), 'win_icon.png'))
  );
  menu = Menu.buildFromTemplate([
    {
      id: '1',
      label: 'コメント表示',
      click: () => {
        if (commentWindow) {
          commentWindow.showInactive();
        } else {
          createCommentWindow();
        }
      },
    },
    {
      id: '2',
      label: 'コメント非表示',
      click: () => {
        if (commentWindow) {
          commentWindow.destroy();
          commentWindow = null;
        }
      },
    },
    {
      id: '3',
      label: '設定',
      click: () => {
        if (indexWindow) {
          indexWindow.show();
        } else {
          createIndexWindow();
        }
      },
    },
    { type: 'separator' },
    {
      id: '4',
      label: '更新確認',
      click: () => autoUpdater.checkForUpdatesAndNotify(),
    },
    {
      id: '5',
      label: 'ヘルプ',
      click: () => {
        if (readmeWindow) {
          readmeWindow.show();
        } else {
          createReadmeWindow();
        }
      },
    },
    { type: 'separator' },
    {
      id: '6',
      label: '終了',
      click: () => {
        tray = null;
        app.quit();
      },
    },
  ]);
  tray.setToolTip('OLCV');
  tray.setContextMenu(menu);
  tray.on('click', () => {
    if (menu) {
      tray?.popUpContextMenu(menu);
    }
  });
  if (config.onBoot) {
    tray.displayBalloon({
      title: 'OLCV起動完了',
      content: '通知領域のアイコンからコメントの表示と設定が出来ます',
      noSound: config.noSound,
    });
  }
};

app.on('web-contents-created', (_event, contents) => {
  contents.on('new-window', (event, url) => {
    event.preventDefault();
    if (
      url ===
        'https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/blob/develop/README.md' ||
      url === 'https://twitter.com/Len_Takayama' ||
      url ===
        'https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/issues'
    ) {
      shell.openExternal(url);
    }
  });
  contents.on('will-navigate', (event) => {
    event.preventDefault();
  });
  contents.session.setPermissionRequestHandler(
    (_webContents, _permission, callback) => callback(false)
  );
});

// 起動スクリプト
app.on('ready', () => {
  // 多重起動防止
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
  } else {
    app.on('second-instance', () => {
      // Someone tried to run a second instance, we should focus our window.
      if (indexWindow) {
        if (indexWindow.isMinimized()) indexWindow.restore();
        indexWindow.focus();
      }
    });
  }
  createMenu();
  const loadVersion = <string>store.get('version', 'none version');
  if (loadVersion !== app.getVersion()) {
    store.set('version', app.getVersion());
    // バージョンが一致してない場合初回起動かアップデートどちらかとみなせる
    if (loadVersion === 'none version') {
      createIndexWindow();
    }
    createReadmeWindow();
  }
});

ipcMain.handle('ready-index-page', () => {
  return store.get('notification');
});

ipcMain.handle('load-url', (_ipcEvent, message: string) => {
  commentView?.webContents.loadURL(message);
  store.set('load-url', {
    url: message,
  });
  return;
});

ipcMain.handle('insert-css', async (_ipcEvent, message: string) => {
  if (insertCSSKey) {
    commentView?.webContents.removeInsertedCSS(await insertCSSKey);
  }
  commentView?.webContents.insertCSS(message);
  store.set('insert-css', {
    css: message,
  });
  return;
});

ipcMain.handle(
  'window-config',
  (
    _ipcEvent,
    msgWidth: number,
    msgHeight: number,
    msgRight: boolean,
    msgBottom: boolean
  ) => {
    commentWindow?.setSize(msgWidth, msgHeight);
    const position = positionData(msgWidth, msgHeight, msgRight, msgBottom);
    commentWindow?.setPosition(position.x, position.y);
    store.set('comment-window-config', {
      right: msgRight,
      bottom: msgBottom,
      width: msgWidth,
      height: msgHeight,
    });
    return;
  }
);

ipcMain.handle('reset-config', async () => {
  const commentViewWebContents = commentView?.webContents;
  if (commentViewWebContents) {
    commentViewWebContents.loadURL(
      join(getResourceDirectory(), 'notfound.html')
    );
    if (insertCSSKey) {
      commentViewWebContents.removeInsertedCSS(await insertCSSKey);
    }
    commentViewWebContents.insertCSS(
      readFileSync(
        resolve(getExtraDirectory(), 'comment.bundle.css')
      ).toString()
    );
  }
  if (commentWindow) {
    commentWindow.setSize(400, 500);
    const position = positionData(400, 500, true, false);
    commentWindow.setPosition(position.x, position.y);
  }
  store.clear();
});

ipcMain.handle('default-css', async () => {
  const commentViewWebContents = commentView?.webContents;
  if (commentViewWebContents) {
    if (insertCSSKey) {
      commentViewWebContents.removeInsertedCSS(await insertCSSKey);
    }
    commentViewWebContents.insertCSS(
      readFileSync(
        resolve(getExtraDirectory(), 'comment.bundle.css')
      ).toString()
    );
  }
  store.delete('insert-css');
});

ipcMain.handle('display-comment', () => {
  if (!commentWindow) {
    createCommentWindow();
  }
});

ipcMain.handle(
  'set-notification-config',
  (_event, config: NotificationConfig) =>
    store.set('notification', {
      noSound: config.noSound,
      onBoot: config.onBoot,
    })
);

app.once('window-all-closed', () => null);
