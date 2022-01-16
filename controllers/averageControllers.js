// const gasoline_average = require('../models/user_schema');
const gasoline_average = require('../models/gasoline_average');
// const User = require('./models/user_schema');

const average = require('../average');

require('dotenv').config(); // 環境変数
// const jwtKey = process.env.JWT_KEY
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

// const jwt = require('jsonwebtoken')

module.exports = {
  // 登録済ユーザの取得
  getRegisterdUsers : async (req, res) => {
    try {
      const users = await gasoline_average.find();
      res.json(users);
    } catch (err) {
      console.log(err);
    }
  },
  // 取得
  getNewData : async (req, res) => {
    try {
      await console.log(`start postNewData. retriving average`)
      // const data = await average.average();
      const data = await average.average;
      await console.log(`retrived average`)
      res.json(data);
    } catch (err) {
      console.log(err);
    }
  },
  // POSTリクエストによるユーザの登録
  // postRegistUser : async (req, res) => {
  postNewData : async (req, res) => {
    try {  
      await console.log(`start postNewData. retriving average`)
      // const data = await average.average();
      const data = await average.average;
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
      res.json(savedData)
  
    } catch (err) {
      console.log(err);
    }
  },
  
  getTest : async (req, res) => {
    // 拡張機能REST clientのテスト
    res.send('hello world');
    
    // 初期ユーザ登録
    // try {
    //   const hashedPassword = await bcrypt.hash('password', saltRounds);
  
    //   const newUser = await new gasoline_average({
    //     name: 'John',
    //     email: 'john@example.com',
    //     password: hashedPassword,
    //   });
  
    //   await newUser.save();
    //   res.send('hello world');
    // } catch (err) {
    //   console.log(err);
    // }
  },
};
