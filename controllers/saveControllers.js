// const gasoline_average = require('../models/user_schema');
const gasoline_average = require('../models/gasoline_average');
// const User = require('./models/user_schema');

const scrape = require('../scrape');

require('dotenv').config(); // 環境変数
// const jwtKey = process.env.JWT_KEY
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

// const jwt = require('jsonwebtoken')

module.exports = {
  // 新規データ保存
  // postNewData : async (req, res) => {
  postNewData : async (exeTime, res) => {
    try {  
      await console.log(`start postNewData. retriving average`)
      // const data = await average.average();
      // const data = await average.average;
      const data = await scrape.average(exeTime);
      await console.log(`retrived average`)
      // await console.log(`${data}`)
      const newData = await new gasoline_average({
        // name: req.body.name,
        // email: req.body.email,
        // password: hashedPassword,        
        exeTime: data.exeTime,
        rows: data.rows,
        TBL: data.TBL,
      });
  
      const savedData = await newData.save();
  
      await console.log(`saved data and display data`)
      console.log(savedData);
      // res.json(savedData)
  
    } catch (err) {
      console.log(err);
    }
  },
  
  // // 取得
  // getNewData : async (req, res) => {
  //   try {
  //     await console.log(`start postNewData. retriving average`)
  //     // const data = await average.average();
  //     const data = await average.average;
  //     await console.log(`retrived average`)
  //     console.log(data);
  //     // res.json(data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },

  // getTest : async (req, res) => {
  //   // 拡張機能REST clientのテスト
  //   res.send('hello world');
    
  //   // 初期ユーザ登録
  //   // try {
  //   //   const hashedPassword = await bcrypt.hash('password', saltRounds);
  
  //   //   const newUser = await new gasoline_average({
  //   //     name: 'John',
  //   //     email: 'john@example.com',
  //   //     password: hashedPassword,
  //   //   });
  
  //   //   await newUser.save();
  //   //   res.send('hello world');
  //   // } catch (err) {
  //   //   console.log(err);
  //   // }
  // },
};
