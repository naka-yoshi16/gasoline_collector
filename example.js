// https://www.wantedly.com/companies/tutorial/post_articles/296220

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto('https://tutorial.co.jp/');

  // スクリーンショット
  //   await page.screenshot({path: 'tutorial.png'});

  // サイトの住所のセレクタを取得
  // 取得したセレクタを設定する
  let address = await page.evaluate(() => {
        return document.querySelector('body > section:nth-child(5) > div > div > div.col-md-10.m-auto > div > div:nth-child(2) > div > div > p').textContent;
      })
  console.log(address)

  // 取得したセレクタを設定する
  // let selector = 'body > section:nth-child(5) > div > div > div.col-md-10.m-auto > div > div:nth-child(1) > div > div > p'; // ここだと、下記で認識されない
  let name = await page.evaluate(() => {
        let selector = 'body > section:nth-child(5) > div > div > div.col-md-10.m-auto > div > div:nth-child(1) > div > div > p'; // ここだと、下記で認識される
        console.log(selector)
        return document.querySelector(selector).textContent;
        // return document.querySelector('body > section:nth-child(5) > div > div > div.col-md-10.m-auto > div > div:nth-child(1) > div > div > p').textContent;
      })
  console.log(name)

  
  // XPathで取得する
  // let xpath = await page.evaluate(() => {
  //       // return document.querySelector('//*[@id="Amplify_ToDo"]').textContent; // XPathをコピー
  //       // return document.querySelector('/html/body/div[1]/section[2]/div/div/div[1]/article/div[2]/div[2]/h2[1]/span').textContent; // 完全なXPathをコピー
  //     })
  
  // https://swfz.hatenablog.com/entry/2020/07/23/010044
  const xpath = '/html/body/section[2]/div/div/div[2]/div/div[1]/div/div/p';
  // const elementHandles = await page.$x('/html/body/section[2]/div/div/div[2]/div/div[1]/div/div/p'); // XPathをコピー
  const elementHandles = await page.$x(xpath); // 完全なXPathをコピー
  // console.log(elementHandles)
  // console.log(elementHandles[0])
  // console.log(elementHandles[0].getProperty('p'))
  // console.log(elementHandles[0].innerText)
  // const url = await(await elementHandles[0].getProperty('href')).jsonValue();
  // txt= await elementHandles.getProperty('textContent');
  // console.log(txt)

  await browser.close();

})();