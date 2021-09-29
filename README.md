# ibmcloud-discovery-export

## 1. Discoveryの情報をエクスポート
エクスポートするのは「ドキュメント」、「トレーニング」、「コンフィグ」、「エクスパンション」の4つ

仕様については下記リンクにあるQiitaの記事をご覧ください。

https://qiita.com/RyotaAmano/items/d4a2fd8a0f67b45e69c6

またプログラムの使用については**自己責任**でお願いいたします。

### 使用方法
1. プログラムのクローン
```
git clone https://github.com/Ryota-Amano/ibmcloud-discovery-export.git
```
2. node_moduleのインストール
```
cd ibmcloud-discovery-export
npm i
```

3. 資格情報の入力
```Authentication.yaml
apikey: CHANGE_APIKEY
url: CHANGE_URL
environmentId: CHANGE_ENVIRONMENTID
collectionId: CHANGE_COLLECTIONID
configurationId: CHANGE_CONFIGURATIONID
version: CHANGE_VERSION '2019-04-30'
exportName: CHANGE_EXPORTNAME　出力されるフォルダ名になります。エクスポート一覧で表示されます
description: CHANGE_DESCRIPTION　エクスポート一覧で表示されます。
```
4. tsファイルのコンパイル
```
npm run build
```
5．プログラムの開始
`npm start`

### 実行例
`npm start`でプログラムを実行

①　初回実行

![例2](https://user-images.githubusercontent.com/61644554/135296368-d4969063-7f97-439d-b3d6-17a249b79677.png)

②　再度実行

![例１](https://user-images.githubusercontent.com/61644554/135296514-9ab43d01-7634-4a4a-ab24-be8d7a460b2f.png)


`Do you want to use previously saved credentials?` 前回保存した資格情報を使用しますか　→　**y**または**n**を入力

`Please select the index number to use.` 使用する資格情報の左にあるインデックス番号を選んでください。　→　**数値**を入力

`WARN: The test folder already exists. Do you want to overwrite and export ?` エクスポートされるフォルダは既に存在します。上書きしますか　→　**y**または**n**を入力

### scriptについて
* `npm start`

  `npm run build`を実行し、tscによってコンパイル後のjavascriptファイルを実行する

* `npm run build`

  distフォルダの初期化、tsファイルのコンパイル
