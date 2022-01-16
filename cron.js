'use strict';

// https://qiita.com/n0bisuke/items/66abf6ca1c12f495aa04
const cron = require('node-cron');

const moment = require('moment');
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


  require('dotenv').config(); // 環境変数
  const express = require('express');
  const app = express();
  const mongoose = require('mongoose');
  const averageController = require("./controllers/averageControllers");
  const errorController = require("./controllers/errorController");

  const port = process.env.PORT_Exchange_Gas;
  const DB_name = process.env.DB_Exchange_Gas;
  const mongoURL =process.env.MONGODB_URL_Exchange_Gas;

  const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  };

  mongoose.connect(mongoURL, options);

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, `DB ${DB_name} connection error:`));
  db.once('open', () => console.log(`DB ${DB_name} connection successful`));

  // averageController.postNewData
  // averageController.postNewData()
  averageController.postNewData(exeTime)
});

