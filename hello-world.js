// https://qiita.com/k1832/items/87a8cf609b4ccf2c6195

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  await page.screenshot({path: 'example.png'});

  await browser.close();
})();