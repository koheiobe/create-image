# 概要

svg パーツを合成し、大喜利画像を生成するためのスクリプト群

## 実行環境

node: v16.15.1
補足: nodenv 推奨 →https://zenn.dev/yu_undefined/scraps/c8d2d7ce15c6de

## 事前準備

下記コマンドをフォルダーのルートにて実行

`npm i`

## 使い方

1. folder のルート階層にて`npm run create-image` で下記 folder を生成

- ./svg/parts/outputs
- ./svg/parts/partsAnswersList.csv

2. Twitter(その他 sns)に投稿する画像を `./svg/parts/outputs` より選択しブラウザにドラッグ&ドロップ
3. ブラウザに表示された画像をスクリーンショット(Mac の場合 `cmd + shift + 4`)で取得
4. SNS に投稿
5. 回答があったら、回答を `partsAnswersList.csv` の `answer` 欄に記載
6. 回答を追記したら再度 `npm run create-image` を実行
7. `./svg/parts/outputAnswers` に新たに画像が出力されていることを確認
8. 該当画像を選択しブラウザにドラッグ&ドロップしてスクリーンショットで画像を取得

## パーツを追加する場合

1. `./svg/parts/パーツ名` の対応するパーツ名にそれぞれパーツを追加
2. `./svg/parts/outputs` に新たに画像が追加されていることを確認する
3. あとは `使い方` セクションと同じ

## TODO

web font および svg 内で文字列を自動折り返しするために `foreignObject` タグを使っている関係上、
svg -> png 変換が困難。時間があったらまた調査する
