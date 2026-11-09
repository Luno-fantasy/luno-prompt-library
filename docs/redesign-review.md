# Luno Prompt Archive — Editorial redesign v1.0

全8ページをアイボリー（#F4F0EA）と深紫（#35283D）のエディトリアルデザインへ変更。
トップは「The Art of Creating.」、コレクションはモバイル2列・PC3列（広い画面は4列）、詳細ギャラリーはモバイル2列・PC3列。既存画像は切り抜かず全体を表示し、画像未登録分は単色と文字で構成。

## レビュー画像

- [改装前・デスクトップ](review/before-desktop.jpg)
- [改装後・デスクトップ全体](review/after-desktop.jpg)
- [改装後・320pxトップ／390pxギャラリー](review/after-mobile.jpg)
- [改装後・モバイル詳細シート](review/after-mobile-modal.jpg)

## コンテンツ保護

| Collection | Prompts |
| --- | ---: |
| Celebration | 10 |
| Weekend | 10 |
| Four Seasons | 4 |
| Sweets | 36 |
| Behind the Spotlight | 40 |
| Gothic Succubus | 10 |
| Original Characters | 1 |
| Total | 111 |

`python scripts/verify-archive.py main` で各プロンプトの全フィールド・検索文字列の完全一致、37画像パス、ページリンク、既存画像ファイルの無変更を確認。
元のHTML属性とJavaScriptの呼び出し口を維持。外部フォント・フレームワークの追加なし。

## 検証

- 全111件の詳細モーダルを実際に開閉。男女切り替えがある全76件は両方の表示本文と元データを照合。
- 検索の部分一致・該当なし表示を確認。
- 本文・品質タグ・ネガティブタグの各コピー操作で成功表示と通知を確認。
- Escape閉じ、閉じた後のフォーカス復帰、Tabによるフォーカス循環を確認。
- 全8ページを320pxのフレームで確認。利用可能な幅305px（スクロールバー15px）とscrollWidthが一致し、すべて2列で横はみ出しなし。
- 390pxでギャラリーと下部シート、デスクトップで中央ダイアログを確認。
- トップに使用した全4画像の読み込みを確認。全既存画像パスはファイル存在確認済み。
- `node --check app.js`、`git diff --check` 通過。

## 検証上の制約と公開

Chromeの幅別表示による確認。iPhone実機のSafari、セーフエリア、画面キーボード、実際の貼り付け先へのクリップボード反映は未確認。コピー成功表示は確認したが、この確認環境ではクリップボード読み取りから内容を取得できなかったため、公開前に実機で3種類のコピーと貼り付けを確認する。

変更は作業ブランチのみ。承認前にmainへマージ・本番公開しない。承認後にmainへ反映し、GitHub Pages上でページ遷移・画像・検索・コピーを再確認する。
