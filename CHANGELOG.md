<!--  markdownlint-disable  no-duplicate-heading  -->
# CHANGELOG

　現状プロジェクトは日本語で行われているため変更履歴も日本語で記述します。

　すべての主要な変更はこの文章で管理されます。

　フォーマットは[Keep a ChangeLogs 1.0.0](https://keepachangelog.com/ja/1.0.0/)に従い、バージョニングは[Semantic Versioning 2.0.0](https://semver.org/lang/ja/spec/v2.0.0.html)に従います。

## [Unreleased]

* コメント翻訳機能
* i18n対応
* アクセシビリティ対応
* MultiCommentViewer連携対応
* 開発者モード実装
* マルチディスプレイ対応
* 自動起動機能

## [1.0.4] - 2021-09-05

### Changed

* Electron14へ更新。

### Security

* 依存パッケージの更新

## [1.0.3] - 2021-06-20

### Changed

* Electron13・webpack5へ更新。

### Security

* 依存パッケージの更新

## [1.0.2] - 2021-04-11

### Changed

* Electron 12・Node.js 14に更新し、メモリ使用量や動作に関するパフォーマンスが改善される見込みです。

### Security

* 依存パッケージの更新

## [1.0.1] - 2021-02-22

### Fixed

* リリースされなかった問題に対処

## [1.0.0] - 2021-02-21

### Added

* 自動更新機能
* ログ記録機能
* 起動時通知機能

### Changed

* 設定画面からコメント欄表示を可能化
* 初回起動時に設定画面が開くように動作変更
* 公式インストーラーを64bitから32bitに変更し32bit版Windowsにも対応
* README.mdに対応サイト、対応アプリ、使い方、アンインストール方法などを追記

### Fixed

* コメント欄表示位置の保存機能が機能していなかったため修正

### Security

* 解析ツールの追加
* 依存パッケージの更新
* sandbox化・セーフティダイアログを有効化・WebSQLを無効化
* 任意の文字列をシェルに渡さないよう修正
* 一部CSPを導入
* ナビゲート無効化
* a要素を安全化
* あらゆる権限要求を無効化

## [0.1.0] - 2020-11-15

### Added

* コメント表示機能
* コメントに対するCSS設定機能
* コメント欄の配置場所の変更と配置保存機能
* コメント欄の大きさ任意指定と保存機能
* 初回起動時の案内表示機能
* CSSリセット機能
* 設定初期化機能

[1.0.4]: https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/releases/tag/v0.1.0
