// PuppeteerCrawlerを使う例
const Apify = require('apify')

// クローリング結果を保存するディレクトリパスを指定。
process.env.APIFY_LOCAL_STORAGE_DIR = './apify_storage'

Apify.main(async () => {

  const requestList = new Apify.RequestList({
    sources: [
      // { url: 'https://news.ycombinator.com/' },
      // { url: 'http://www.yahoo.co.jp/' },
      // { url: 'https://weva.cloud/node-js%E3%81%A7web%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AA%E3%83%B3%E3%82%B0%E3%83%BB%E3%82%B9%E3%82%AF%E3%83%AC%E3%82%A4%E3%83%94%E3%83%B3%E3%82%B0%E3%81%99%E3%82%8B%E3%81%AA%E3%82%89apify-js%E3%81%8C/' },
      
    ],
  })

  await requestList.initialize()

  // https://sdk.apify.com/docs/api/puppeteer-crawler
  const crawler = new Apify.PuppeteerCrawler({
    requestList,
    handlePageFunction: async ({ page, request }) => {
        // This function is called to extract data from a single web page
        // 'page' is an instance of Puppeteer.Page with page.goto(request.url) already called
        // 'request' is an instance of Request class with information about the page to load
        await Apify.pushData({
            title: await page.title(),
            url: request.url,
            succeeded: true,
        });
    },
    handleFailedRequestFunction: async ({ request }) => {
        // This function is called when the crawling of a request failed too many times
        await Apify.pushData({
            url: request.url,
            succeeded: false,
            errors: request.errorMessages,
        });
    },
});

await crawler.run();

  // クローリング開始。
  await crawler.run()

  console.log('Crawler finished.')
})