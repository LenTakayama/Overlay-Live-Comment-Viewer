import { Versions } from '~/types/front';
window.eval = global.eval = () => {
  throw new Error("Can't use eval().");
};

class Index {
  private version!: Versions;
  private url: string | null = null;
  private css: string | null = null;
  constructor() {
    this.loadLocalStorage();
    this.version = window.electronApis.getVersion();
    this.displayVersion();
    this.initMain();
    this.addDisplayClickEvent();
    this.addSaveClickEvent();
    this.addResetClickEvent();
    this.addDefaultCssClickEvent();
  }

  private displayVersion(): void {
    const versionText = document.createElement('p');
    versionText.textContent = `Version:${this.version.app}\nNode:${this.version.node}\nElectron:${this.version.electron}`;
    document.getElementById('version')?.appendChild(versionText);
  }

  private loadLocalStorage(): void {
    const right = localStorage.getItem('right');
    const bottom = localStorage.getItem('bottom');
    const width = localStorage.getItem('width');
    const height = localStorage.getItem('height');
    if (right) {
      (<HTMLInputElement>(
        document.getElementById('right')
      )).checked = /true/.test(right);
    } else {
      (<HTMLInputElement>document.getElementById('right')).checked = true;
    }
    if (bottom) {
      (<HTMLInputElement>(
        document.getElementById('bottom')
      )).checked = /true/.test(bottom);
    } else {
      (<HTMLInputElement>document.getElementById('bottom')).checked = false;
    }
    if (width) {
      (<HTMLInputElement>document.getElementById('width')).value = width;
    } else {
      (<HTMLInputElement>document.getElementById('width')).value = '400';
    }
    if (height) {
      (<HTMLInputElement>document.getElementById('height')).value = height;
    } else {
      (<HTMLInputElement>document.getElementById('height')).value = '500';
    }
  }

  private async initMain() {
    const notificationConfig = await window.electronApis.init();
    (<HTMLInputElement>document.getElementById('noSound')).checked =
      notificationConfig.noSound;
    (<HTMLInputElement>document.getElementById('onBoot')).checked =
      notificationConfig.onBoot;
  }

  private addDisplayClickEvent(): void {
    document
      .getElementById('display')
      ?.addEventListener(
        'click',
        async () => await window.electronApis.displayComment()
      );
  }

  private addSaveClickEvent(): void {
    document.getElementById('save')?.addEventListener('click', async () => {
      const urlValue = (<HTMLInputElement>document.getElementById('url')).value;
      const cssValue = (<HTMLInputElement>document.getElementById('css')).value;
      const isRight = (<HTMLInputElement>document.getElementById('right'))
        .checked;
      const isBottom = (<HTMLInputElement>document.getElementById('bottom'))
        .checked;
      const widthValue = (<HTMLInputElement>document.getElementById('width'))
        .value;
      const heightValue = (<HTMLInputElement>document.getElementById('height'))
        .value;
      const noSound = (<HTMLInputElement>document.getElementById('noSound'))
        .checked;
      const onBoot = (<HTMLInputElement>document.getElementById('onBoot'))
        .checked;
      if (urlValue && urlValue !== this.url) {
        await window.electronApis.sendLoadURL(urlValue);
        this.url = urlValue;
      }
      if (cssValue && cssValue !== this.css) {
        await window.electronApis.sendInsertCSS(cssValue);
        this.css = cssValue;
      }
      // ロード時にセットするためにローカルストレージに保存
      await window.electronApis.sendWindowConfig(
        Number(widthValue),
        Number(heightValue),
        isRight,
        isBottom
      );
      await window.electronApis.sendNotificationConfig({
        noSound: noSound,
        onBoot: onBoot,
      });
      localStorage.setItem('width', widthValue);
      localStorage.setItem('height', heightValue);
      localStorage.setItem('right', isRight.toString());
      localStorage.setItem('bottom', isBottom.toString());
    });
  }

  private addResetClickEvent(): void {
    document.getElementById('reset')?.addEventListener('click', async () => {
      if (confirm('設定を初期設定に戻しますがよろしいでしょうか？')) {
        (<HTMLInputElement>document.getElementById('url')).value = '';
        (<HTMLInputElement>document.getElementById('css')).value = '';
        (<HTMLInputElement>document.getElementById('right')).checked = true;
        (<HTMLInputElement>document.getElementById('bottom')).checked = false;
        (<HTMLInputElement>document.getElementById('width')).value = '400';
        (<HTMLInputElement>document.getElementById('height')).value = '500';
        (<HTMLInputElement>document.getElementById('noSound')).checked = false;
        (<HTMLInputElement>document.getElementById('onBoot')).checked = true;
        localStorage.setItem('width', '400');
        localStorage.setItem('height', '500');
        localStorage.setItem('right', 'true');
        localStorage.setItem('bottom', 'false');
        await window.electronApis.sendReset();
      }
    });
  }

  private addDefaultCssClickEvent(): void {
    document
      .getElementById('default-css')
      ?.addEventListener('click', async () => {
        if (confirm('CSSを初期設定に戻しますがよろしいでしょうか？')) {
          this.css = null;
          await window.electronApis.sendDefaultCss();
        }
      });
  }
}

window.onload = () => {
  new Index();
};
