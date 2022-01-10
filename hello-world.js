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

  await browser.close();
})();