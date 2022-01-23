// import moment from 'moment'
const moment = require('moment');

// https://www.wantedly.com/companies/tutorial/post_articles/296220
const { pushData } = require('apify');
const puppeteer = require('puppeteer');
const { exists } = require('./models/gasoline_average');

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
    // try {
      // const exeTime = moment().format()    // 2020-04-22T22:14:25+09:00
      console.log(`allOverJapan実行開始:${exeTime}`)

      const browser = await puppeteer.launch();

      // ※都道府県別ランキングは、e燃費に投稿された直近30日の看板価格データを使用しています。※沖縄県のガソリン価格は税制優遇されている、ランキング対象からは除外させていただいております。
      // const url = 'https://e-nenpi.com/gs/price_graph/2/1/0/'
      const url = 'https://e-nenpi.com/gs/price_graph/6/1/0/' // 最近5年間のレギュラー価格
      const urls = [
        'https://e-nenpi.com/gs/price_graph/6/1/0/', // 最近5年間のレギュラー価格
        'https://e-nenpi.com/gs/price_graph/6/2/0/', // 最近5年間のハイオク価格
        'https://e-nenpi.com/gs/price_graph/6/3/0/', // 最近5年間の軽油価格
      ];
      
      // puppeteerでの要素の取得方法 https://qiita.com/go_sagawa/items/85f97deab7ccfdce53ea
      // let itemSelector="some selecter > ul > li:nth-child(1) > a";
      // let listSelector="some selecter > ul > li > a";
      const titleSelecotr = "#main > div.unit.unit-contentsTitle > div.titleArea > div > h1 > span";
      const signboardPriceSelector = "#highcharts-0 > svg > g.highcharts-data-labels.highcharts-series-0"
      const actualSellingPriceSelector = "#highcharts-0 > svg > g.highcharts-data-labels.highcharts-series-1"
      const xAxisSelector = "#highcharts-0 > svg > g.highcharts-axis-labels.highcharts-xaxis-labels"

      let allOverJapan = []

    // for (const url of urls) {
      for (i=0; i < urls.length; i++) {
        const page = await browser.newPage();
        // await page.goto(url);
        await page.goto(urls[i])
              .catch((err)=> console.error(err))

        // 生データ取得
        let title = await page.evaluate((selector) => { // 取得
          return document.querySelector(selector).textContent;
        },  titleSelecotr); // 結合セレクタ or 実行元のセレクタ
        console.log(title)

        // 看板価格の取得
        let signboardPriceRawData = await getGraphData(page, signboardPriceSelector, true)
        console.log(signboardPriceRawData)

        // 実売価格の取得
        let actualSellingPriceRawData = await getGraphData(page, actualSellingPriceSelector, true)
        console.log(actualSellingPriceRawData)
        // console.log(JSON.stringify(actualSellingPriceRawData,null," "))

        // グラフのx軸取得
        let xAxisRawData = await getGraphData(page, xAxisSelector, false)
        // console.log(xAxisRawData)
        let splitMonth = xAxisRawData[0].split('月')
        // console.log(splitMonth)
        let formatYM = []
        splitMonth.forEach(element => {
          // let year = moment(element, 'YYMM').format('YYYY')
          // let month = moment(element, 'YYMM').format('MM')
          let ym = moment(element, 'YYMM').format('YYYYMM')
          // if(year!="Invalid date" && month!="Invalid date") formatYM.push(ym)
          if(ym!="Invalid date") formatYM.push(ym)
        });
        // console.log(formatYM)

        // let allOverJapan = []
        for(j=0; j< signboardPriceRawData.length; j++){
          // let obj ={}
          if(i == 0){
            let calYM = moment(formatYM[0]).add(j, 'months'); // iか月足す
            let obj ={
              year:  moment(calYM).format('YYYY'),
              month: moment(calYM).format('MM'),
              regular:{},highOctane:{},lightOil:{}
            }
            allOverJapan.push(obj)
            // console.log(moment(calYM, 'YYMM').format('YYYYMM'))
            // obj.year = moment(calYM).format('YYYY')
            // obj.month = moment(calYM).format('MM')
          }
          // console.log(allOverJapan[j].month)
          switch (title){
            case '最近5年間のレギュラー価格':
              // obj.regular.signboardPrice = Number(signboardPriceRawData[j])
              // obj.regular.actualSellingPrice = Number(actualSellingPriceRawData[j])
              allOverJapan[j].regular.signboardPrice = Number(signboardPriceRawData[j])
              allOverJapan[j].regular.actualSellingPrice = Number(actualSellingPriceRawData[j])
              break;
            case '最近5年間の軽油価格':
              allOverJapan[j].highOctane.signboardPrice = Number(signboardPriceRawData[j])
              allOverJapan[j].highOctane.actualSellingPrice = Number(actualSellingPriceRawData[j])
              break;
            case '最近5年間のハイオク価格':
              allOverJapan[j].lightOil.signboardPrice = Number(signboardPriceRawData[j])
              allOverJapan[j].lightOil.actualSellingPrice = Number(actualSellingPriceRawData[j])
              break;
          }
          // allOverJapan.push(obj)
        }
      }
      console.log(allOverJapan)

      await browser.close();
      // return {exeTime, rows, TBL}
    // } 
    //   catch (error) {
    //   console.log("エラー")
    //   return null
    //   // throw "reject"
    //   // return console.error(error.message)
    // }
  return null
// })();
  }
}
// // 非同期処理とPromise https://zenn.dev/bowtin/articles/ab7d30c33fa747
// average
//   // .then(result => console.log(average))
//   // .then(result => console.dir(result))
//   .then(result => console.log(JSON.stringify(result,null,'\t')))
//   .catch((err) => console.log(`average失敗${err}`));

// グラフのデータを取得 {スクレイピングページ, セレクタ, 結合有無}
const getGraphData = async (page, exeSelector, isJoin) => {
  let n = 0 // 取得する子要素番号
  let RawDatas = []; // 取得した生データ
  // console.log(nonJoinSelector)
  while (n < 100 && RawDatas.length == n){ // 一致する間は繰り返す
    try {
      n++;  //console.log(n);
      let joinSelector;
      if(isJoin){
        let dynamicSelector = ` > g:nth-child(${n}) > text > tspan`; // 子要素
        joinSelector = exeSelector + dynamicSelector;// 実行元のセレクタ + 子要素セレクタ(動的)
      }
      // console.log(joinSelector)
      let RawData = await page.evaluate((selector) => { // 取得
        return document.querySelector(selector).textContent;
      // }, partialSelector + dynamicSelector); // 実行元のセレクタ + 子要素セレクタ(動的)
      },  joinSelector || exeSelector); // 結合セレクタ or 実行元のセレクタ
      // console.log(RawData)
      RawDatas.push(RawData) // 格納
      if(!isJoin) break; // 結合しない場合 1回のみでループ終了
    } catch(error) { // 取得できない場合
      console.error(error.message)
      break;
    }
  }
  // console.log(RawDatas);
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