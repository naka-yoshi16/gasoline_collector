// https://reffect.co.jp/node-js/express-js%e3%81%a7json-web-tokenjwt%e3%81%ae%e8%a8%ad%e5%ae%9a%e3%82%92%e8%a1%8c%e3%81%86

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

app.set('json spaces', 2) // jsonをpretty表示 https://stackoverflow.com/questions/32679505/node-and-express-send-json-formatted

// テスト
app.get(`/api/${DB_name}/`, averageController.getTest);

// // 登録済ユーザの取得
// app.get(`/api/${DB_name}/users`, averageController.getRegisterdUsers);

// 取得
app.get(`/api/${DB_name}/getNewData`, averageController.getNewData);

// // POSTリクエストによるユーザの登録
// app.use(express.json())
// app.post(`/api/${DB_name}/register`, averageController.postRegistUser);
// app.post(`/api/${DB_name}/postNewData`, averageController.postNewData);
app.get(`/api/${DB_name}/postNewData`, averageController.postNewData);

// // ユーザ認証の確認
// app.post(`/api/${DB_name}/login`, averageController.postConfirmUser);

// // Tokenの確認
// app.get(`/api/${DB_name}/user`, averageController.postConfirmToken);

// エラー処理
app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(port, () => console.log(`Express Server listening on port ${port}!`));