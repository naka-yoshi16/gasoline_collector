
const moment = require('moment');
  const exeTime = moment().format()    // 2020-04-22T22:14:25+09:00
  // let exeTime = await moment().format()    // 2020-04-22T22:14:25+09:00
  console.log(`実行開始:${exeTime}`)

  module.exports = exeTime