import { DisplayList } from '~/types/common';
import { Versions } from '~/types/front';

class Index {
  private version!: Versions;
  private url: string | null = null;
  private css: string | null = null;
  private displayList: DisplayList[] = [];
  private isEditDislpayInput = false;
  constructor() {
    this.loadLocalStorage();
    this.loadDisplayList();
    this.version = window.electronApis.getVersion();
    this.displayVersion();
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

  private async loadDisplayList() {
    this.displayList = await window.electronApis.getDisplayList();
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

  private addEditDisplayButtonClickEvent(): void {
    const selectValue = (<HTMLSelectElement>(
      document.getElementById('selectDisplay')
    )).value;
    const button = <HTMLButtonElement>(
      document.getElementById('editDisplayButton')
    );
    const input = <HTMLInputElement>document.getElementById('editDisplay');
    button?.addEventListener('click', () => {
      if (this.isEditDislpayInput) {
        this.isEditDislpayInput = false;
        button.value = '編集';
        // TODO: mainへ送信
      } else {
        this.isEditDislpayInput = true;
        button.value = '保存';
      }
    });
  }
}

window.onload = () => {
  new Index();
};
