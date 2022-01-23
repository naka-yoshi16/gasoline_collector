const scrape = require('./scrape');

const moment = require('moment');
const exeTime = moment().format()    // 2020-04-22T22:14:25+09:00
console.log(`実行開始:${exeTime}`)

// (async() => {
const asyncFunc = async () => {
  const data = await scrape.allOverJapan(exeTime)
  await console.log(JSON.stringify(data,null," "))
// })();
}
asyncFunc()