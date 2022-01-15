// https://qiita.com/k1832/items/87a8cf609b4ccf2c6195

const puppeteer = require('puppeteer');

(async () => {
  // const browser = await puppeteer.launch();  
  const options = {
    headless: false, // ヘッドレスをオフに
    slowMo: 100  // 動作を遅く
  };
  const browser = await puppeteer.launch(options);

  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  await page.screenshot({path: 'example.png'});

  // //XPath
  // const elems = await page.$x('//a[@class="major-link"]'); // page.$x()の返り値は配列（該当する要素が一つの場合でも要素数1の配列を返す）

  // //セレクタ
  // const elem = await page.$("#form"); // page.$()の返り値は単数要素（該当する要素が複数ある場合でも最初に見つけた要素だけ1つ返す）
  // const elems = await page.$$("a.red-link"); // page.$$()の返り値は配列

  await browser.close();
})();