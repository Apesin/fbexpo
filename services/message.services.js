const uuid = require("uuid");
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const db = require("../models/index.js");
const Helpers = require("../helpers/helpers.js");
const path = require("path");
const fs = require("fs");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { randomInt } = require("crypto");
var jwt = require('jsonwebtoken');

const mailService = require("../services/mail.services.js");


class MessageService {
  constructor() {
    this.helper = new Helpers();
  }


async sendMessage(body){
    try{
        let email=this.helper.validateEmail(body.email);
        if(email){

            let sub = await db.messages.create({
                id:uuid.v4(),
                name: body.name,
                email: body.email,
                message: body.message,
                carId: body.carId ?? "N/A",
                phoneNumber: body.phoneNumber ?? "N/A",
                dateCreated: this.helper.getMySQLDateTimeWithTimeZone(),
                dateModified: this.helper.getMySQLDateTimeWithTimeZone()
            });
            if(sub){
                return {
                    success: true,
                    error: false,
                    message:"Message sent successfully",
                    data: null
                };
            }else{
                return {
                    success: false,
                    error: true,
                    message:"Unable to send message, try again later",
                    data: null
                };
            }
        }else{
            return {
                success: false,
                error: true,
                message:"Unable to send message, try again later",
                data: null
            };
        }
    }catch(error){
        console.log(error);
        return {
            success: false,
            error: true,
            message:"Unable to send message, try again later",
            data: null
        };
    }
}

async getMessages(){
  try{
    let subscription =  await db.messages.findAll({
      order: [['dateCreated', 'DESC']], 
    });
    return subscription;
  }catch(error){
    return [];
  }
}

async getRecentMessages(){
  try{
    let subscription =  await db.messages.findAll({
      order: [['dateCreated', 'DESC']], 
      limit: 10
    });
    return subscription;
  }catch(error){
    return [];
  }
}

async sendMail(data){
  try {
    let subscription =  await db.messages.findOne({
        id: data.id
    });
    if(subscription){
      await this.sendMessageMail(
        subscription.email,
        data.subject,
        data.message,
      );
      return {
        message: "Message sent",
        success: true,
        error: false,
        data: null,
      };
    }else{
      return {
        message: "Unable to send reply",
        success: false,
        error: true,
        data: null,
      };
    }
  } catch (error) {
    return {
      message: error.message,
      success: false,
      error: true,
      data: null,
    };
  }
}


async sendMessageMail(email,message,subject){
    
  let html;
  
  fs.readFile('src/mail_templates/message.html', 'utf8', (err, template) => {
      if (err) {
          console.error('Error reading HTML template:', err);
          return;
      }
  
      // Define your dynamic data
      const data = {
          message: message,
          subject: subject
      };
  
      // Render the HTML template with dynamic data
       html = ejs.render(template, { data });
  
  let transporter = nodemailer.createTransport({
      host: 'boopar.com', // Replace with your SMTP server hostname
      port: 26, // Replace with the SMTP server port (usually 587 for TLS)
      auth: {
        user: 'accounts@boopar.com', // Your Gmail address
        pass: 'Success2024#', // Your Gmail password (or an application-specific password)
      },
      secure: false, // Set to true if your SMTP server uses SSL/TLS
      tls: {
        rejectUnauthorized: false, // Allow self-signed or mismatched certificates
      },
    });

    console.log(process.env.EMAIL);
  
  // Define email data
  let mailOptions = {
      from: '"'+process.env.APP_NAME+'" <'+process.env.EMAIL+'>', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: html // html body
  };
  
  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
  });
  
  });
  
  }


/////Commercial




}
module.exports = MessageService;
