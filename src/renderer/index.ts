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
    this.addDropFileEvent();
    this.addOneCommeBootButtonClick();
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
      (<HTMLInputElement>document.getElementById('right')).checked =
        /true/.test(right);
    } else {
      (<HTMLInputElement>document.getElementById('right')).checked = true;
    }
    if (bottom) {
      (<HTMLInputElement>document.getElementById('bottom')).checked =
        /true/.test(bottom);
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
      const isOneCommeBoot = (<HTMLInputElement>(
        document.getElementById('one_comme_onboot')
      )).checked;
      const oneCommePath = (<HTMLInputElement>(
        document.getElementById('one_comme_path')
      )).value;
      Promise.all([
        window.electronApis.sendWindowConfig(
          Number(widthValue),
          Number(heightValue),
          isRight,
          isBottom
        ),
        window.electronApis.sendNotificationConfig({
          noSound: noSound,
          onBoot: onBoot,
        }),
        window.electronApis.sendOneCommeConfig({
          isBoot: isOneCommeBoot,
          path: oneCommePath,
        }),
      ])
        .then()
        // eslint-disable-next-line no-console
        .catch((err) => console.error(err));
      // ロード時にセットするためにローカルストレージに保存
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

  private addDropFileEvent() {
    const element = document.getElementById('drop-area');
    if (element) {
      element.addEventListener(
        'dragover',
        function (e) {
          e.stopPropagation();
          e.preventDefault();
          this.style.background = '#e1e7f0';
        },
        false
      );
      element.addEventListener(
        'dragleave',
        function (e) {
          e.stopPropagation();
          e.preventDefault();
          this.style.background = 'darkgrey';
        },
        false
      );
      const urlElement = document.getElementById('url');
      if (urlElement) {
        element.addEventListener(
          'drop',
          function (e) {
            e.stopPropagation();
            e.preventDefault();
            this.style.background = 'darkgrey';
            const files = e.dataTransfer?.files;
            if (!files) {
              return;
            }
            if (files.length > 1)
              return alert('アップロードできるファイルは1つだけです。');
            (<HTMLInputElement>urlElement).value = files.item(0)?.path
              ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                files.item(0)!.path
              : '';
          },
          false
        );
      }
    }
  }

  private addOneCommeBootButtonClick() {
    const button = document.getElementById('one_comme_boot');
    button?.addEventListener(
      'click',
      async () => await window.electronApis.sendOneCommeBoot()
    );
  }
}

window.onload = () => {
  new Index();
};
