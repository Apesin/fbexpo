const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');
const { json } = require("express");
const Helpers = require("../helpers/helpers.js");

class MailService {
    constructor() {
      this.helper = new Helpers();
    }


async sendMail(email,message,subject){


let html;

fs.readFile('src/mail_templates/message.html', 'utf8', (err, template) => {
    if (err) {
        console.error('Error reading HTML template:', err);
        return;
    }

    // Define your dynamic data
    const data = {
        subject: subject,
        message: message
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

}

module.exports = MailService;



// module.exports = {
//     sendMail,
//     sendMessageMail
// }