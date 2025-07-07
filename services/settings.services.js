const uuid = require("uuid");
const db = require("../models");
const Helpers = require("../helpers/helpers.js");
const path = require("path");
const fs = require("fs");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { randomInt } = require("crypto");
var jwt = require('jsonwebtoken');


class AccountService {
  constructor() {
    this.helper = new Helpers();
  }


  async save_settings(body) {
    try {
      let update = await db.about.update({
        description: body.volunteer_text,
      }, {
        where: {
          id: 1
        }
      });
  
      if (update[0] > 0) { 
        return {
          success: true,
          error: false,
          message: "About saved",
          data: null
        };
      } else {
        return {
          success: false,
          error: true,
          message: "Unable to save about",
          data: null
        };
      }
  
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: true,
        message: "Unable to save about, try again later",
        data: null
      };
    }
  }
  

async get_settings(){
  try{
    let settings =  await db.about.findAll();
    return settings;
  }catch(error){
    return [];
  }
}




}
module.exports = AccountService;
