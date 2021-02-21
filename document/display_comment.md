# 配信サイト別コメント表示のさせかた

　基本的にOBSのブラウザソースと同じことできます。

## YouTube

　URL欄には「www.youtube.com/live_chat?is_popout=1&v=（放送ID>）」の形式で入力してください。一番先頭には「https://」を含んでください。

　視聴画面からだとチャット欄右上の3つの点が並んだボタンをクリックし、「チャットをポップアップ」を押し表示されたウインドウのURLを貼り付けてください。

　YouTube Stdioからでは上記と流れは同じですがURLの前方が「studio.youtube.com」となっているので「studio.」を消してください。

## ツイキャス

  URL欄には「twitcasting.tv/（アカウント名）/windowcomment?embedded=1」の形式で入力してください。一番先頭には「https://」を含んでください。

  幅は250ぐらいがいい感じになります。文字が若干小さいためCSSで修正するといい感じになるかも知れません。（こちらのいい感じのCSSは現在準備中です）

## OPENREC

　[OPENREC公式ページ](https://openrec.zendesk.com/hc/ja/articles/360013072432)に記載されている内容を参考にしてください。

　公式で配布されているCSSは透過されないのでユーザーの方で調整していただく必要があります。（こちらも整備を行う予定です）

## Streamlabs

  動作未確認。
