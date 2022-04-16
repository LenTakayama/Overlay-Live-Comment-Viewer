import { Configs } from '~/@types/main';
window.eval = global.eval = () => {
  throw new Error("Can't use eval().");
};

class Index {
  private configs?: Configs;
  constructor() {
    // 各値をセット
    this.getConfigs().then((value) => {
      this.configs = value;
      this.setDisplayConfigs();
    });

    // バージョン表示を生成
    const version = window.electronApis.getVersion();
    const versionText = document.createElement('p');
    versionText.textContent = `Version:${version.app}\nNode:${version.node}\nElectron:${version.electron}`;
    document.getElementById('version')?.appendChild(versionText);

    // 各種要素に対してイベントを設定
    this.addDisplayClickEvent();
    this.addSaveClickEvent();
    this.addResetClickEvent();
    this.addDefaultCssClickEvent();
    this.addDropFileEvent();
    this.addOneCommeBootButtonClick();
    this.addCssSelectBoxChangeEvent();

    // 仕様変更によりローカルストレージを使わなくなったためデータを削除
    this.resetLocalStorage();
  }

  private resetLocalStorage(): void {
    window.localStorage.clear();
  }

  private async getConfigs(): Promise<Configs> {
    return await window.electronApis.getConfigs();
  }

  private getInputElementById(id: string): HTMLInputElement {
    return <HTMLInputElement>document.getElementById(id);
  }
  private getSelectElementById(id: string): HTMLSelectElement {
    return <HTMLSelectElement>document.getElementById(id);
  }

  private setDisplayConfigs() {
    if (this.configs) {
      // URL・CSS
      this.getInputElementById('url').value = this.configs.loadUrl.url
        ? this.configs.loadUrl.url
        : '';
      this.getInputElementById('css').value = this.configs.insertCss.css
        ? this.configs.insertCss.css
        : '';
      this.getSelectElementById('select_css').value =
        this.configs.insertCss.cssMode;
      // 配置・サイズ設定
      this.getInputElementById('right').checked =
        this.configs.windowConfig.right;
      this.getInputElementById('bottom').checked =
        this.configs.windowConfig.bottom;
      this.getInputElementById('width').value =
        this.configs.windowConfig.width.toString();
      this.getInputElementById('height').value =
        this.configs.windowConfig.height.toString();
      // 通知設定
      this.getInputElementById('onBoot').checked =
        this.configs.notificationConfig.onBoot;
      this.getInputElementById('noSound').checked =
        this.configs.notificationConfig.noSound;
      // わんコメ設定
      this.getInputElementById('one_comme_onboot').checked =
        this.configs.oneCommeConfig.isBoot;
      this.getInputElementById('one_comme_path').value =
        this.configs.oneCommeConfig.path;
    }
  }

  // コメント表示ボタン
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
      // CSS・URL
      const urlValue = this.getInputElementById('url').value;
      const cssValue = this.getInputElementById('css').value;
      const cssModeValue = this.getSelectElementById('select_css').value;
      // 配置・サイズ設定
      const isRight = this.getInputElementById('right').checked;
      const isBottom = this.getInputElementById('bottom').checked;
      const widthValue = this.getInputElementById('width').value;
      const heightValue = this.getInputElementById('height').value;
      // 通知設定
      const isNoSound = this.getInputElementById('noSound').checked;
      const isOnBoot = this.getInputElementById('onBoot').checked;
      // わんコメ設定
      const isOneCommeBoot = (<HTMLInputElement>(
        document.getElementById('one_comme_onboot')
      )).checked;
      const oneCommePath = (<HTMLInputElement>(
        document.getElementById('one_comme_path')
      )).value;

      await window.electronApis.pushConfigs({
        loadUrl: { url: urlValue },
        insertCss: { css: cssValue, cssMode: cssModeValue },
        windowConfig: {
          bottom: isBottom,
          right: isRight,
          height: Number(heightValue),
          width: Number(widthValue),
        },
        notificationConfig: {
          noSound: isNoSound,
          onBoot: isOnBoot,
        },
        oneCommeConfig: { isBoot: isOneCommeBoot, path: oneCommePath },
      });
    });
  }

  private addResetClickEvent(): void {
    document.getElementById('reset')?.addEventListener('click', async () => {
      if (confirm('設定を初期設定に戻しますがよろしいでしょうか？')) {
        await window.electronApis.sendResetConfigsRequest().then((configs) => {
          this.configs = configs;
          this.setDisplayConfigs();
        });
      }
    });
  }

  private addDefaultCssClickEvent(): void {
    document
      .getElementById('default-css')
      ?.addEventListener('click', async () => {
        if (confirm('CSSを初期設定に戻しますがよろしいでしょうか？')) {
          if (this.configs?.insertCss.css) {
            this.configs.insertCss.css = undefined;
          }
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
      async () => await window.electronApis.sendOneCommeBootRequest()
    );
  }

  private addCssSelectBoxChangeEvent() {
    const element = <HTMLSelectElement>document.getElementById('select_css');
    element.addEventListener('change', () => {
      const select = element.value;
      const css = this.getInputElementById('css').value;
      window.electronApis.sendCssMode(select, css);
    });
  }
}

window.onload = () => {
  new Index();
};
