const uuid = require("uuid");
const db = require("../models");
const Helpers = require("../helpers/helpers.js");
const path = require("path");
const fs = require("fs");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { randomInt } = require("crypto");
var jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const currentDate = new Date();



class EventService {
  constructor() {
    this.helper = new Helpers();
  }


async getEvents(){
    try{
        let events = await db.events.findAll({
            order: [['dateCreated', 'DESC']], 
        });
        if(events){
            return {
                success: true,
                error: false,
                message:"Events gotten",
                data: events
            };
        }else{
            return {
                success: false,
                error: true,
                message:"Unable to fetch events, try again later",
                data: null
            };
        }
    }catch(error){
        console.log(error);
        return {
            success: false,
            error: true,
            message:"Unable to subscribe, try again later",
            data: null
        };
    }
}

async getRecentEvents(){
  try{
      let events = await db.events.findAll({
          order: [['dateCreated', 'DESC']], 
          limit: 5
      });
      if(events){
          return {
              success: true,
              error: false,
              message:"Events gotten",
              data: events
          };
      }else{
          return {
              success: false,
              error: true,
              message:"Unable to fetch events, try again later",
              data: null
          };
      }
  }catch(error){
      console.log(error);
      return {
          success: false,
          error: true,
          message:"Unable to subscribe, try again later",
          data: null
      };
  }
}


async addEvents(input){
  try{
    let e = await db.events.create({
        id: uuid.v4(),
        title:input.title,
        poster: input.poster,
        url: input.url,
        description: input.description,
        eventDate: input.eventDate,
        dateCreated: this.helper.getMySQLDateTimeWithTimeZone(),
        dateModified: this.helper.getMySQLDateTimeWithTimeZone()

    });   
    return e;
  }catch(error){
    return false;
  }
}


async updateEvents(input){
    try{
        let e = await db.events.update(
            {
              title: input.title,
              poster: input.poster,
              url: input.url,
              description: input.description,
              eventDate: input.eventDate,
              dateModified: this.helper.getMySQLDateTimeWithTimeZone()
            },
            {
              where: {
                id: input.id
              }
            }
          );
          
      console.log(e);
      return e;
    }catch(error){
        console.log(error);
      return false;
    }
  }

  async getNextEvent(){
    try{
        let e = await db.events.findOne({
          where: {
            eventDate: {
              [Op.gte]: currentDate,
            },
          },
          order: [['eventDate', 'ASC']], 
        });
          
      console.log(e);
      return e;
    }catch(error){
        console.log(error);
      return false;
    }
  }

}
module.exports = EventService;
