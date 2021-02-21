# Overlay-Live-Comment-Viewer

![CI](https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/workflows/CI/badge.svg)
![CD](https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/workflows/CD(delivery)/badge.svg)

## できること

* 常に前面にライブ放送のコメントが表示されます
* CSSを編集してお好みの表示にできます

## 使いみち

* ゲームしながら推しのラジオを聞きつつコメントも見たいとき
* ゲーム配信でコメントを素早く確認したいとき

## 対応サイト

　詳しい使い方は[コメント表示方法](https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/blob/develop/document/display_comment.md)を参照してください

* YouTube Live
* ツイキャス
* OPENREC（不完全対応）

## 同時使用対応ソフト（動作確認済のもの）

　有志および作者により対応ソフトの動作確認を行っています。動作確認済情報お待ちしております。

* Google Chrome
* Apex Legends
  * ボーダーレスウィンドウないしはウインドウモード
  * フルスクリーンモードは非対応
* War Thunder
* Cites: Skylines
* World of Warships

## インストール方法

　[リリースページ](https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/releases)からダウンロードできます。
　現在インストーラーはWindows 32bit版を配布しているため64bit・32bit両方とも対応しています。

　それ以外の環境ではzipファイルからビルドする必要があります。他の環境でもインストーラーが欲しい場合問い合わせしていただければ検討を行います。

　起動すると通知領域（デフォルトの場合時間表示などがある画面右下）にこのアプリアイコンが表示されます。アイコンをクリックするとメニューが開き設定画面やコメント表示を開くことができます。

## アンインストール方法

　アンインストーラーから削除してください。

### Windows 10の場合

* スタートメニューから「OverLayLiveCommentViwer」を右クリック、アンインストールをクリックすることでアンインストーラーが起動します
* もしくは設定＞アプリ＞アプリと機能の中から「OverLayLiveCommentViwer（バージョン表記）」をクリック、アンインストールをクリックすることでアンインストーラーが起動します

#### 完全な削除

　アンインストーラーで削除されないものがいくつかあります。気になる場合は削除できます。

* 設定ファイルはアンインストーラーで削除されません
  * %USERPROFILE%\AppData\Roaming\overlay-live-comment-viewer
* 自動更新ソフトもアンインストーラーで削除されません
  * %USERPROFILE%\AppData\Local\overlay-live-comment-viewer-updater

## おかしいときに試してほしいこと

　なんかコメントの表示がおかしい、表示されない、表示位置がおかしい場合はコメント非表示してからコメント表示を再度行うことでリセットされるのでまず試してみてください。

　それでも治らない場合はOLCVの再インストールを試してみてください。それでも解決しない場合はご一報を。

## 応用編

　URLとCSSを自由に設定できるのでOBSのブラウザソースと似たようなことができます。
　たとえば[Discord StreamKit](https://streamkit.discord.com/overlay)を使ってチャット欄を表示しながらゲームもできたります。

　[#hack_OLCV](https://twitter.com/hashtag/hack_OLCV?src=hash)で応用や利用報告を募集してます。

## これから対応すること

* さまざまなライブプラットフォームコメントを表示
* 翻訳機能
* ロゴをいい感じにする
* Hot Reload（開発者向け）
* テストコードの整備（開発者向け）

## デフォルトのコメント表示

 Chat v2.0 Style Generator日本語版からCSSをお借りしました。
 <http://css4obs.starfree.jp/>

## ロゴ

 Wixロゴメーカーでロゴを作成しました<https://ja.wix.com/logo/maker>

## 質問とか要望とか開発とか

　最新の情報はTwitterのハッシュタグ[#OLCV_info](https://twitter.com/hashtag/OLCV_info?src=hash)にて呟いてます。

　Issuesに質問や要望を書き込んでください。対応できそうなものは対応します。

　またこのリポジトリはOSSです。

　詳しくはCONTRIBUTINGを参照してください。

## Special Thanks

* 霧島響希様
* あきゅむ様
