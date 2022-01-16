// https://reffect.co.jp/node-js/express-js%e3%81%a7json-web-tokenjwt%e3%81%ae%e8%a8%ad%e5%ae%9a%e3%82%92%e8%a1%8c%e3%81%86

require('dotenv').config(); // 環境変数
// const express = require('express');
// const app = express();
const mongoose = require('mongoose');
// const averageController = require("./controllers/averageControllers");

// const port = process.env.PORT_Exchange_Gas;
const mongoURL =process.env.MONGODB_URL_Exchange_Gas;
const DB_name = process.env.DB_Exchange_Gas;

module.exports = {
  connect :() => {
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
    // averageController.postNewData(exeTime)
  }
}
// express上で動く必要ないことに気づいた...
// app.set('json spaces', 2) // jsonをpretty表示 https://stackoverflow.com/questions/32679505/node-and-express-send-json-formatted