import { MenuItem, Menu } from 'electron';

export function createMenu(): Menu {
  const menu = new Menu();
  menu.append(new MenuItem({ role: 'cut' }));
  menu.append(new MenuItem({ role: 'copy' }));
  menu.append(new MenuItem({ role: 'paste' }));
  return menu;
}
