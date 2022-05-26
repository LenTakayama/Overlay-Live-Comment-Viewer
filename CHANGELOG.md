<!--  markdownlint-disable  no-duplicate-heading  -->

# CHANGELOG

現状プロジェクトは日本語で行われているため変更履歴も日本語で記述します。

すべての主要な変更はこの文章で管理されます。

フォーマットは[Keep a ChangeLogs 1.0.0](https://keepachangelog.com/ja/1.0.0/)に従い、バージョニングは[Semantic Versioning 2.0.0](https://semver.org/lang/ja/spec/v2.0.0.html)に従います。

## [Unreleased]

- コメント翻訳機能
- i18n 対応
- アクセシビリティ対応
- MultiCommentViewer 連携対応
- 開発者モード実装
- マルチディスプレイ対応
- 自動起動機能

## [1.1.3] - 2020-05-26

### Fixed

- 起動時に reading 'noSound'エラーが発生するバグに対応

## [1.1.0] - 2022-05-01

### Added

- わんコメ非公式連携を実装
  - わんコメ起動・連携起動機能
  - わんコメテンプレートをドラッグ＆ドロップによる読み込みに対応
- CSS を YouTube 用のデフォルトとカスタムで切り替えれるよう追加
- コメント非表示ボタンを設定画面に追加
- Tray のアイコンをダブルクリックすると設定画面が開くよう機能追加

### Changed

- Electron 17 へ更新
- Nodejs 16 へ更新
- リファクタリングを実施し保守性の向上
- コード改善を実施し安定性の向上
- 現在設定値が設定画面に表示されるように変更
- 起動時に設定画面が開くように動作変更（設定から変更可能）
- 設定画面ウインドウサイズを変更可能にした

### Fixed

- アプリ終了時に Tray から消えないケースに一部対応
- CSS を編集すると例外が発生しエラーになる問題を解決

### Security

- 依存パッケージの更新

## [1.0.4] - 2021-09-05

### Changed

- Electron14 へ更新。

### Security

- 依存パッケージの更新

## [1.0.3] - 2021-06-20

### Changed

- Electron13・webpack5 へ更新。

### Security

- 依存パッケージの更新

## [1.0.2] - 2021-04-11

### Changed

- Electron 12・Node.js 14 に更新し、メモリ使用量や動作に関するパフォーマンスが改善される見込みです。

### Security

- 依存パッケージの更新

## [1.0.1] - 2021-02-22

### Fixed

- リリースされなかった問題に対処

## [1.0.0] - 2021-02-21

### Added

- 自動更新機能
- ログ記録機能
- 起動時通知機能

### Changed

- 設定画面からコメント欄表示を可能化
- 初回起動時に設定画面が開くように動作変更
- 公式インストーラーを 64bit から 32bit に変更し 32bit 版 Windows にも対応
- README.md に対応サイト、対応アプリ、使い方、アンインストール方法などを追記

### Fixed

- コメント欄表示位置の保存機能が機能していなかったため修正

### Security

- 解析ツールの追加
- 依存パッケージの更新
- sandbox 化・セーフティダイアログを有効化・WebSQL を無効化
- 任意の文字列をシェルに渡さないよう修正
- 一部 CSP を導入
- ナビゲート無効化
- a 要素を安全化
- あらゆる権限要求を無効化

## [0.1.0] - 2020-11-15

### Added

- コメント表示機能
- コメントに対する CSS 設定機能
- コメント欄の配置場所の変更と配置保存機能
- コメント欄の大きさ任意指定と保存機能
- 初回起動時の案内表示機能
- CSS リセット機能
- 設定初期化機能

[unreleased]: https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/compare/master...develop
[1.1.3]: https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/compare/v1.1.0...v1.1.3
[1.1.0]: https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/compare/v1.0.4...v1.1.0
[1.0.4]: https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/LenTakayama/Overlay-Live-Comment-Viewer/releases/tag/v0.1.0
