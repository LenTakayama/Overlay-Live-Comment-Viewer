import { log } from './component/log';
import { Application } from './application';
import { store } from './component/store';
import './component/autoUpdater';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const application = new Application(store, log);
