import {
  app,
  BrowserView,
  BrowserWindow,
  session,
  ipcMain,
  screen,
  Menu,
  Tray,
  nativeImage,
  shell,
  MenuItem,
} from 'electron';
import Store from 'electron-store';
import { resolve, join } from 'path';
import { InsertCSS, LoadURL, PositionConfig, WindowSize } from '~/types/main';
import { readFileSync } from 'fs';

const store = new Store({
  name: 'config',
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
  const loadURL = <LoadURL>store.get('load-url', {
    url: null,
  });
  const insertCSS = <InsertCSS>store.get('insert-css', {
    css: null,
  });
  const positionConfig = <PositionConfig>store.get('positionConfig', {
    right: true,
    bottom: false,
  });
  const windowSize = <WindowSize>store.get('window-size', {
    width: 400,
    height: 500,
  });
  const position = positionData(
    windowSize.width,
    windowSize.height,
    positionConfig.right,
    positionConfig.bottom
  );
  commentWindow = new BrowserWindow({
    x: position.x,
    y: position.y,
    width: windowSize.width,
    height: windowSize.height,
    transparent: true,
    frame: false,
    resizable: false,
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      worldSafeExecuteJavaScript: true,
    },
  });
  commentView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      worldSafeExecuteJavaScript: true,
    },
  });

  commentWindow.setIgnoreMouseEvents(true);
  commentWindow.setBrowserView(commentView);

  commentView.setBounds({
    x: 0,
    y: 0,
    width: windowSize.width,
    height: windowSize.height,
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
  app.once('window-all-closed', () => null);
  process.env.NODE_ENV === 'development'
    ? commentView.webContents.openDevTools({ mode: 'detach' })
    : null;
};

const createIndexWindow = () => {
  indexWindow = new BrowserWindow({
    show: false,
    frame: true,
    autoHideMenuBar: true,
    resizable: false,
    height: 700,
    width: 400,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      worldSafeExecuteJavaScript: true,
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
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      worldSafeExecuteJavaScript: true,
    },
  });
  readmeWindow.loadURL(resolve(getResourceDirectory(), 'readme.html'));
  readmeWindow.on('ready-to-show', () => readmeWindow?.show());
  readmeWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
  readmeWindow.on('closed', () => (readmeWindow = null));
  app.once('window-all-closed', () => null);
};

const createMenu = () => {
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
    {
      id: '4',
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
      id: '5',
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
};

const setHeader = () => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
      },
    });
  });
};

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
  setHeader();
  createMenu();
  const loadVersion = <string>store.get('version', 'none version');
  if (loadVersion !== app.getVersion()) {
    store.set('version', app.getVersion());
    createReadmeWindow();
  }
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
    store.set('window-size', {
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

app.once('window-all-closed', () => null);
