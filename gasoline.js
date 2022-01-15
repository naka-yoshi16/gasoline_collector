// https://www.wantedly.com/companies/tutorial/post_articles/296220

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  const url = 'https://e-nenpi.com/gs/prefavg'
  await page.goto(url);

  // puppeteerでの要素の取得方法 https://qiita.com/go_sagawa/items/85f97deab7ccfdce53ea
  // let itemSelector="some selecter > ul > li:nth-child(1) > a";
  // let listSelector="some selecter > ul > li > a";

  let itemSelector="#main > div.unit.nottl.unit-contents > div > table > tbody > tr.rank1.odd";
  // let listSelector="#main > div.unit.nottl.unit-contents > div > table > tbody > tr.rank1.odd"; //rank1全て?
  let listSelector="#main > div.unit.nottl.unit-contents > div > table > tbody > tr.rank1"; // rank1すべて?
  // let listSelector="#main > div.unit.nottl.unit-contents > div > table > tbody > tr"; // tr全て?
  let tableSelector="#main > div.unit.nottl.unit-contents > div > table"; // table

  // 一つセレクターの一つの要素をとる
  // var data = await page.evaluate((selector) => {
  //   return document.querySelector(selector).textContent;
  // }, itemSelector);
  // console.log(data)
  // let format = data.trim()
  // let split = format.split('\n\t\t\t\t\t\t\t\t')
  // console.log(JSON.stringify(format))
  // console.log(JSON.stringify(split))

  var data = await page.evaluate((selector) => {
    return document.querySelector(selector).textContent;
  }, tableSelector);
  // console.log(JSON.stringify(data))
  let format = data.trim() // 前後の区切り文字 削除
  // console.log(JSON.stringify(format))
  let columnDelimiter = '\n\t\t\t\t\t\t\t\t'
  let headerDelimiter = "\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t;"
  let rowDelimiter = '\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t'
  
  let columnSplit = format.split(columnDelimiter)
  let rowSplit = format.split(rowDelimiter) // 行ごとに分割
  console.log(JSON.stringify(rowSplit,null," "))
  // console.log(JSON.stringify(format))
  // console.log(JSON.stringify(columnSplit))
  // console.log(JSON.stringify(rowSplit))
  // let row = []
  let row = rowSplit.map(element => {
    // console.log(JSON.stringify(element,null," "))
    // row.push(element)
    let trim = element.trim() // 各行前後の不要区切り文字を削除
    return trim.split(columnDelimiter)
  });
  // console.log(JSON.stringify(row,null," "))
  console.log(JSON.stringify(row))
  // let resultww = rowSplit.forEach(element => {
  //   console.log(JSON.stringify(element.trim(),null," "))
  //   row.push(element)
  // });
  // console.log(JSON.stringify(row));
  let result2 = row.forEach(element => {
    // console.log(JSON.stringify(element.split(columnDelimiter)))
    // element.split(columnDelimiter)
  });
  // console.log(JSON.stringify(result2))

  // // 一つセレクターの複数要素をとる
  // var data = await page.evaluate((selector) => {
  //   return {
  //       href: document.querySelector(selector).href,
  //       textContent: document.querySelector(selector).textContent,
  //       innerHTML: document.querySelector(selector).innerHTML
  //   };
  // }, itemSelector);
  // console.log(data)

  // // 複数セレクターの一つの要素をとる
  // let datas = await page.evaluate((selector) => {
  //   const list = Array.from(document.querySelectorAll(selector));
  //   return list.map(data => data.textContent);
  // }, listSelector);
  // let format = datas[0].trim()
  // let split = format.split('\n\t\t\t\t\t\t\t\t')
  // console.log(datas)
  // console.log(JSON.stringify(datas))
  // console.log(JSON.stringify(datas[0]))
  // console.log(JSON.stringify(format))
  // console.log(JSON.stringify(split))


  // サイトのセレクタを取得(selectorをコピー)
  // 1位の価格
  // let rank1text = await page.evaluate(() => {
  //       let rank1 = '#main > div.unit.nottl.unit-contents > div > table > tbody > tr.rank1.odd'
  //       // let rank1 = '#main > div.unit.nottl.unit-contents > div > table > tbody'
  //       // let textContent = document.querySelector(rank1).textContent;
  //       let textContent = document.querySelectorAll(rank1);
  //       return textContent;
  //       // return innerHTML;
  //     })
  // // console.log(rank1text)
  // console.log(JSON.stringify(rank1text))

  // querySelector
  // let rank1text = await page.evaluate(() => {
  //       let rank1 = '#main > div.unit.nottl.unit-contents > div > table > tbody > tr.rank1.odd'
  //       let textContent = document.querySelector(rank1).textContent;
  //       // let innerHTML = document.querySelector(rank1).innerHTML
  //       return textContent;
  //       // return innerHTML;
  //     })
  // console.log(rank1text)

  // tableごと取得
  // let tabledata = await page.evaluate(() => {
  //   let sele_table = '#main > div.unit.nottl.unit-contents > div > table'
  //       return document.querySelector(sele_table).textContent;
  //     })
  // console.log(tabledata)

  await browser.close();

})();