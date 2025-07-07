const uuid = require("uuid");
const db = require("../models");
const Helpers = require("../helpers/helpers.js");
const path = require("path");
const fs = require("fs");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { randomInt } = require("crypto");
var jwt = require('jsonwebtoken');


class BlogService {
  constructor() {
    this.helper = new Helpers();
  }


async getBlog(){
    try{
        let blog = await db.blog.findAll({
            order: [['dateCreated', 'DESC']], 
        });
        if(blog){
            return {
                success: true,
                error: false,
                message:"blog gotten",
                data: blog
            };
        }else{
            return {
                success: false,
                error: true,
                message:"Unable to fetch blog, try again later",
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

async getRecentBlog(){
  try{
      let blog = await db.blog.findAll({
          order: [['dateCreated', 'DESC']], 
          limit: 5
      });
      if(blog){
          return {
              success: true,
              error: false,
              message:"blog gotten",
              data: blog
          };
      }else{
          return {
              success: false,
              error: true,
              message:"Unable to fetch blog, try again later",
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

async getBlogDetails(id){
    try{
        let blog = await db.blog.findOne({
            where: {
                id: id
            }
        });
        if(blog){
            return {
                success: true,
                error: false,
                message:"blog gotten",
                data: blog
            };
        }else{
            return {
                success: false,
                error: true,
                message:"Unable to fetch blog, try again later",
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


async addBlog(input){
  try{
    let e = await db.blog.create({
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


async updateBlog(input){
    try{
        let e = await db.blog.update(
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


}
module.exports = BlogService;
