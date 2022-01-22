// import moment from 'moment'
const moment = require('moment');

// https://www.wantedly.com/companies/tutorial/post_articles/296220
const { pushData } = require('apify');
const puppeteer = require('puppeteer');

// 即時関数を使う理由 https://qiita.com/katsukii/items/cfe9fd968ba0db603b1e
// module.exports = average;
module.exports = {
// const average = (async () => {
// exports.average = (async () => {
// exports.average = (async (exeTime) => {
  average :async (exeTime) => {
    // const exeTime = moment().format()    // 2020-04-22T22:14:25+09:00
    console.log(`average実行開始:${exeTime}`)

    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    // ※都道府県別ランキングは、e燃費に投稿された直近30日の看板価格データを使用しています。※沖縄県のガソリン価格は税制優遇されている、ランキング対象からは除外させていただいております。
    const url = 'https://e-nenpi.com/gs/prefavg'
    await page.goto(url);

    // puppeteerでの要素の取得方法 https://qiita.com/go_sagawa/items/85f97deab7ccfdce53ea
    // let itemSelector="some selecter > ul > li:nth-child(1) > a";
    // let listSelector="some selecter > ul > li > a";

    const itemSelector="#main > div.unit.nottl.unit-contents > div > table > tbody > tr.rank1.odd";
    // const listSelector="#main > div.unit.nottl.unit-contents > div > table > tbody > tr.rank1.odd"; //rank1全て?
    const listSelector="#main > div.unit.nottl.unit-contents > div > table > tbody > tr.rank1"; // rank1すべて?
    // const listSelector="#main > div.unit.nottl.unit-contents > div > table > tbody > tr"; // tr全て?
    const tableSelector="#main > div.unit.nottl.unit-contents > div > table"; // table

    // 生データ取得
    let RawData = await page.evaluate((selector) => {
      return document.querySelector(selector).textContent;
    }, tableSelector);
    // console.log(JSON.stringify(RawData))
    
    // 生データを成形
    let rows = prettyPrint(RawData);
    // console.log(rows)

    // vuetify用に成形
    let TBL = forVuetifyTBL(rows);
    // console.log(TBL)

    await browser.close();
    return {exeTime, rows, TBL}
// })();
  },
  
  allOverJapan :async (exeTime) => {
    // const exeTime = moment().format()    // 2020-04-22T22:14:25+09:00
    console.log(`allOverJapan実行開始:${exeTime}`)

    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    // ※都道府県別ランキングは、e燃費に投稿された直近30日の看板価格データを使用しています。※沖縄県のガソリン価格は税制優遇されている、ランキング対象からは除外させていただいております。
    // const url = 'https://e-nenpi.com/gs/price_graph/2/1/0/'
    const url = 'https://e-nenpi.com/gs/price_graph/6/1/0/'
    await page.goto(url);

    // puppeteerでの要素の取得方法 https://qiita.com/go_sagawa/items/85f97deab7ccfdce53ea
    // let itemSelector="some selecter > ul > li:nth-child(1) > a";
    // let listSelector="some selecter > ul > li > a";

    const signboardPriceSelector = "#highcharts-0 > svg > g.highcharts-data-labels.highcharts-series-0"
    // #highcharts-0 > svg > g.highcharts-data-labels.highcharts-series-0 > g:nth-child(37) > text > tspan
    const actualSellingPriceSelector = "#highcharts-0 > svg > g.highcharts-data-labels.highcharts-series-1"
    const xAxisSelector = "#highcharts-0 > svg > g.highcharts-axis-labels.highcharts-xaxis-labels"

    // 生データ取得
    // let signboardPriceSelector2 =`#highcharts-0 > svg > g.highcharts-data-labels.highcharts-series-0 > g:nth-child(${n}) > text > tspan`

    let signboardPriceRawData = await getGraphData(page, signboardPriceSelector)
    // let n = 0
    // let test = [];
    // while (test.length == n){
    //   try {
    //     n++;
    //     let signboardPriceSelector2 =`#highcharts-0 > svg > g.highcharts-data-labels.highcharts-series-0 > g:nth-child(${n}) > text > tspan`
    //     let signboardPriceRawData = await page.evaluate((selector) => {
    //       return document.querySelector(selector).textContent;
    //     }, signboardPriceSelector2);
    //     // console.log(signboardPriceRawData)
    //     test.push(signboardPriceRawData)
    //   } catch(error) {
    //     console.log(error.message)
    //     break;
    //   }
    // }
    // console.log(test)

    // let signboardPriceRawData = await page.evaluate((selector) => {
    //     return document.querySelector(selector).textContent;
    // }, signboardPriceSelector);
    // console.log(signboardPriceRawData)

    // let actualSellingPriceRawData = await page.evaluate((selector) => {
    //   return document.querySelector(selector).textContent;
    // }, actualSellingPriceSelector);
    // console.log(JSON.stringify(actualSellingPriceRawData))

    // let xAxisRawData = await page.evaluate((selector) => {
    //   return document.querySelector(selector).textContent;
    // }, xAxisSelector);
    // console.log(JSON.stringify(xAxisRawData))

    // // 分割 https://qiita.com/turmericN/items/0819317b5c075d971bfa
    // // let cdn1 = await signboardPriceRawData.match(/.{5}/g);
    // // console.log(cdn1)
    // // ["UGG", "UGU", "UAU", "UAA", "UGG", "UUU"]

    // let cdn2 = actualSellingPriceRawData.match(/.{5}/g);
    // console.log(cdn2)

    // let cdn3 = xAxisRawData.split("月");
    // console.log(cdn3)

    // // 生データを成形
    // let rows = prettyPrint(RawData);
    // // console.log(rows)

    // // vuetify用に成形
    // let TBL = forVuetifyTBL(rows);
    // // console.log(TBL)

    await browser.close();
    // return {exeTime, rows, TBL}
// })();
  }
}
// // 非同期処理とPromise https://zenn.dev/bowtin/articles/ab7d30c33fa747
// average
//   // .then(result => console.log(average))
//   // .then(result => console.dir(result))
//   .then(result => console.log(JSON.stringify(result,null,'\t')))
//   .catch((err) => console.log(`average失敗${err}`));

const getGraphData = async (page, partialSelector) => {
  let n = 0 // 取得する子要素番号
  let RawDatas = []; // 取得した生データ
  while (RawDatas.length == n){ // 一致する間は繰り返す
    try {
      n++;
      let dynamicSelector = ` > g:nth-child(${n}) > text > tspan` // 子要素
      let RawData = await page.evaluate((selector) => { // 取得
        return document.querySelector(selector).textContent;
      }, partialSelector + dynamicSelector);
      // console.log(RawData)
      RawDatas.push(RawData) // 格納
    } catch(error) { // 取得できない場合
      console.log(error.message)
      break;
    }
  }
  console.log(RawDatas);
  return RawDatas;
}

const prettyPrint = (RawData) =>{
  const headerDelimiter = "\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t;"
  const rowDelimiter = '\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t' // table行の区切り文字
  const columnDelimiter = '\n\t\t\t\t\t\t\t\t' // 列ごとの区切り文字
  // 行ごとに分割
  let trimRawData = RawData.trim()                // 前後の区切り文字 削除
  // console.log(JSON.stringify(trimRawData))
  let rowSplit = trimRawData.split(rowDelimiter)  // table行ごとに分割
  // console.log(JSON.stringify(rowSplit,null," "))

  // 列を整形
  let rows = rowSplit.map(row => {
    // console.log(JSON.stringify(row,null," "))
    let rowTrim = row.trim()              // 各行前後の不要区切り文字を削除
    return rowTrim.split(columnDelimiter) //　列ごとの区切り文字を削除
  });
  // console.log(JSON.stringify(rows,null," "))
  // console.log(JSON.stringify(rows))// rows↓
  return rows;
  // [
  //   ["順位","レギュラー","都道府県","ハイオク","都道府県","軽油","都道府県"],
  //   ["1","149.17円","岩手県","160.26円","岩手県","127.00円","香川県"],
  //   ["2","152.00円","香川県","162.00円","香川県","129.00円","愛媛県"],
  //   // ...
  //   ["46","---","佐賀県","---","佐賀県","---","佐賀県"],
  //   ["--","155.04円","沖縄県","166.94円","沖縄県","135.71円","沖縄県"]
  // ]
}

// vuetifyで使いやすいように整形
const forVuetifyTBL = (rows) =>{
  // ヘッダー
  let headers = rows[0].map((text,index) => {
    let header ={}
    header.text = text
    // switch (text){
    switch (index){
      case 0:
        header.value = 'rank';        break;
      case 1:
        header.value = 'regular';     break;
      case 2:
        header.value = 'rglrPrefacture';  break;
      case 3:
        header.value = 'highOctane';  break;
      case 4:
        header.value = 'hghoctnPrefacture';  break;
      case 5:
        header.value = 'lightOil';    break;
      case 6:
        header.value = 'lghtOlPrefacture';  break;
    }
    return header
  })
  // console.log(headers)

  // アイテム(データ部分)
  let items = rows.map((row, line) => { // 行ごとにループ
    if(line !== 0){
      let item = {}; // オブジェクト枠作成
      row.forEach((value, index) => {　// 列項目ごとにループ
        item[`${headers[index].value}`] = value // item.項目名 = 項目値
      })
      // console.log(item) //一行 処理結果
      return item // mapにより自動で配列へ格納される
    }
  })
  items.splice(0,1) // 0個目のundinedを削除
  // console.log(items)

  return {headers, items};
  // console.log(headers)// headers↓
  // [
  //   { text: '順位', value: 'rank' },
  //   { text: 'レギュラー', value: 'regular' },
  //   { text: '都道府県', value: 'rglrPrefacture' },
  //   { text: 'ハイオク', value: 'highOctane' },
  //   { text: '都道府県', value: 'hghoctnPrefacture' },
  //   { text: '軽油', value: 'lightOil' },
  //   { text: '都道府県', value: 'lghtOlPrefacture' }
  // ]

  // console.log(items)// items↓
  // [
  //   {
  //     rank: '1',
  //     regular: '149.17円',
  //     rglrPrefacture: '岩手県',
  //     highOctane: '160.26円',
  //     hghoctnPrefacture: '岩手県',
  //     lightOil: '127.00円',
  //     lghtOlPrefacture: '香川県'
  //   },
  // // ...,
  //   {
  //     rank: '--',
  //     regular: '155.04円',
  //     rglrPrefacture: '沖縄県',
  //     highOctane: '166.94円',
  //     hghoctnPrefacture: '沖縄県',
  //     lightOil: '135.71円',
  //     lghtOlPrefacture: '沖縄県'
  //   }
  // ]
}