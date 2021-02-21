# OLCVへの貢献方法について

とりあえず暫定的に置いてみているため、このガイドラインは改定される場合があります。

## 質問

現在のところ件数は少ない（と想定している）のでIssueを作成してください。（専用テンプレートがあります）

GitHubのアカウントを保持してない、Issueを作成するのが躊躇われる場合は[@LenTakayama](https://twitter.com/Len_Takayama)へDMかリプライを送ってください。返信が遅くなるかもしれませんが[フォーム](https://forms.gle/JqHBLEWWoDkLowJq7)でも受け付けています。

## バグ報告・機能要求

質問と同じくIssueの作成をお願いします。可能であればIssueに集約したいですがアカウントがないなどであれば[@LenTakayama](https://twitter.com/Len_Takayama)または[フォーム](https://forms.gle/JqHBLEWWoDkLowJq7)に連絡お願いします。

## 開発

### ブランチ戦略・リリース管理

masterブランチをリリースブランチとして使用します。通常はdevelopブランチからブランチを切って、プルリクエスト経由でdevelopブランチへマージします。

package.jsonのVersionを書き換えたコミットにタグを付けてmasterブランチにプルリクエストを作ることによりリリースが行われます。

### スタイルガイド

TypeScriptおよびHTML、CSSなどはPrettierでフォーマットされます。

TypeScriptはTypeScript Deep DiveのStyleGuideに準じます。

MarkdownはMarkdownLintを使い体裁を整えてください。
