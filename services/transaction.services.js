const uuid = require("uuid");
const db = require("../models");
const Helpers = require("../helpers/helpers.js");
const TokenService = require("./tokenServices.js");
const path = require("path");
const fs = require("fs");
const axios = require('axios');
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { log } = require("console");

class TransactionService {
  constructor() {
    this.helper = new Helpers();
    this.tokenService = new TokenService();
  }
  
  async getWalletTransactionHistory(walletAddress){
    try{
        let result = await db.transactions.findAll({
            where: {
                walletAddress : walletAddress
            }, order: [['dateCreated', 'DESC']]
        });
        if(result){
            return {
            message: "Transaction retrieved.",
            success: true,
            error: false,
            data: result,
            };
        }else{
            return {
            message: "No transaction found.",
            success: false,
            error: false,
            data: null,
            };
        }
    }catch(error){
      console.log(error);
      return {
        message: "Database connection error",
        success: false,
        error: true,
        data: null,
        };
    }
  }

  async getRecentTransaction(){
    try{
        let result = await db.transactions.findAll();
        if(result){
            return {
            message: "Transaction retrieved.",
            success: true,
            error: false,
            data: result,
            };
        }else{
            return {
            message: "No transaction found.",
            success: false,
            error: false,
            data: null,
            };
        }
    }catch(error){
      console.log(error);
      return {
        message: "Database connection error",
        success: false,
        error: true,
        data: null,
        };
    }
  }

  async getUserTransactionHistory(userId){
    try{
        let result = await db.transactions.findAll({
            where: {
                userId : userId
            }, order: [['dateCreated', 'DESC']]
        });
        if(result){
            return {
            message: "Transaction retrieved.",
            success: true,
            error: false,
            data: result,
            };
        }else{
            return {
            message: "No transaction found.",
            success: false,
            error: false,
            data: null,
            };
        }
    }catch(error){
      console.log(error);
      return {
        message: "Database connection error",
        success: false,
        error: true,
        data: null,
        };
    }
  }

  async addTransaction(body){
    try {
        let result = await db.transactions.create({
          "userId" : body.userId,
          "transactionReference" : body.transactionReference,
          "amount" : body.amount,
          "transactionType" : body.transactionType,
          "receiverWalletAddress" : body.receiverWalletAddress ?? "",
          "walletAddress": body.walletAddress,
          "dateCreated":this.helper.getDateTime(),
          "status": "ACTIVE",
          "narration" : body.narration ?? "",
          "transactionId": uuid.v4()
        });
        if(result){
          return {
            message: "transaction added successfully",
            success: true,
            error: false,
            data: result,
          };
        }else{
          return {
            message: "Unable to add transaction.",
            success: false,
            error: false,
            data: null,
          };
        }
      } catch (error) {
        console.log(error);
        return {
          message: "Database connection error",
          success: false,
          error: true,
          data: null,
        };
      }
  }

  async getGasFee(){
    try {
      let response = await axios.get('https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken');
    if(response.status){
      console.log(response);
      // console.log("gas fee is ", response.data.result.UsdPrice);
      // this._gasPrice = 1 * response.data.result.UsdPrice / Math
      // .pow(10,8);
      return {
        message: "Gass fee retrieved",
        success: true,
        error: false,
        gas_price : response.data.result
      };
    } else {
      console.log(error);
      return {
        message: response.message,
        success: false,
        error: true,
        data: null
      };
      
    }
    } catch (error) {
      console.log(error);
      return {
        message: "Database connection error",
        success: false,
        error: true,
        data: null,
      };
    }
  }

  async getTransactionsByAddress(address, type) {
    let apiUrl = "";
    const apiKey = '3T5Y1UHXPHU5U824CAVZE8DA7M3FGS5I4H';

    try {
      if(type == "all"){
       apiUrl = `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&apikey=${apiKey}`;
      }else if(type == "btca"){
         apiUrl = `https://api.bscscan.com/api?module=account&action=tokentx&address=${address}&contractaddress=${process.env.BTCAADDRESS}&apikey=${apiKey}`;

      }else if(type == "busd"){
         apiUrl = `https://api.bscscan.com/api?module=account&action=tokentx&address=${address}&contractaddress=${process.env.BUSDADDRESS}&apikey=${apiKey}`;

      }
      const response = await axios.get(apiUrl);
      return {
        message: response.message,
        success: true,
        error: false,
        data: response.data.result
      };
    } catch (error) {
      return {
        message: error.message,
        success: false,
        error: true,
        data: null,
      };
    }
  }
  



}
module.exports = TransactionService;
