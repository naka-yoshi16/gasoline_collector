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

  // // 一つセレクターの一つの要素をとる
  // var data = await page.evaluate((selector) => {
  //   return document.querySelector(selector).textContent;
  // }, itemSelector);
  // console.log(data)

  // // 一つセレクターの複数要素をとる
  // var data = await page.evaluate((selector) => {
  //   return {
  //       href: document.querySelector(selector).href,
  //       textContent: document.querySelector(selector).textContent,
  //       innerHTML: document.querySelector(selector).innerHTML
  //   };
  // }, itemSelector);
  // console.log(data)

  // 複数セレクターの一つの要素をとる
  let datas = await page.evaluate((selector) => {
    const list = Array.from(document.querySelectorAll(selector));
    return list.map(data => data.textContent);
  }, listSelector);
  // let format = datas[0].split('\t') 
  // let format = datas[0].split('\n') 
  // let format = datas[0].replace('/\t/','')
  // let format = datas[0].replace('/\n/','')
  let format = datas[0].trim()
  let split = format.split('\n\t\t\t\t\t\t\t\t')
  // let format = datas.trim()
  // let format = datas.foreach(element => {
  //   element.trim()
  // });
  console.log(datas)
  console.log(JSON.stringify(datas))
  console.log(JSON.stringify(datas[0]))
  console.log(JSON.stringify(format))
  console.log(JSON.stringify(split))


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