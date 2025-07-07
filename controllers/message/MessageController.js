var Request = require("request");      
const controller = 'Messages'; 
const module_name = 'Messages'; 
const bcrypt = require('bcrypt');
const saltRounds = 10;
const someOtherPlaintextPassword = 'not_bacon';
const MessageService = require("../../services/message.services");
const messageService = new MessageService();
const MailService = require("../../services/mail.services");
const mailService = new MailService();

async function sendMessage(req, res) { 
    let body = req.body;
    res.set('content-type' , 'application/json'); 
    data = {};    
    action = 'landing'; 
    let result = await messageService.sendMessage(body);
    if (result.error) {
        return res.status(500).json(result);
      } else {
        return res.status(200).json(result);
      }
};      
exports.sendMessage = sendMessage;

async function getMessages(req, res) { 
  
      res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {};    
    action = 'landing'; 
    let msgs = await messageService.getMessages();
    res.render('admin/Messages/list',{
        page_title:"Brian Car Shop - Message",
        controller:controller, 
        module_name:module_name,
        action:'list',
        nodeSiteUrl: nodeSiteUrl,
        messages: msgs

    });    
};      
exports.getMessages = getMessages;

async function reply(req, res) { 
  let subject = req.params.subject;
  let email = req.params.email;
  let id = req.params.id;
  res.set('content-type' , 'text/html; charset=mycharset'); 
data = {};    
action = 'landing'; 
res.render('admin/Messages/reply',{
    page_title:"Brian Car Shop - Reply Message",
    controller:controller, 
    module_name:module_name,
    action:'list',
    nodeSiteUrl: nodeSiteUrl,
    subject: subject,
    email: email,
    id: id

});    
};      
exports.reply = reply;

async function sendReply(req, res) { 
  let body = req.body;
  res.set('content-type' , 'application/json'); 
  data = {};    
  action = 'landing'; 
  let result = await messageService.sendMail(body);
  if (result.error) {
      return res.status(500).json(result);
    } else {
      return res.status(200).json(result);
    }
};
exports.sendReply = sendReply;
