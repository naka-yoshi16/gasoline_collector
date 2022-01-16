'use strict';

// https://qiita.com/n0bisuke/items/66abf6ca1c12f495aa04
const cron = require('node-cron');

const moment = require('moment');
const mongo = require('./mongo')
const averageController = require("./controllers/averageControllers");
// cron.schedule('*/3 * * * * *', () => console.log('3秒ごとに実行'));
// cron.schedule('*/3 * * * * *', () => {
//   const exeTime = moment().format()    // 2020-04-22T22:14:25+09:00
//   // let exeTime = await moment().format()    // 2020-04-22T22:14:25+09:00
//   console.log(`実行開始:${exeTime}`)
// });


// cron.schedule('* * * * *', () => console.log('毎分実行'));
cron.schedule('* * * * *', () => {
  console.log('毎分実行')

  const exeTime = moment().format()    // 2020-04-22T22:14:25+09:00
  console.log(`実行開始:${exeTime}`)

  mongo.connect() // mongo接続

  averageController.postNewData(exeTime)
});

