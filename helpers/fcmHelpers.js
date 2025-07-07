const db = require("../models");

var gcm = require('node-gcm');

var message = new gcm.Message();

var sender = new gcm.Sender(process.env.FCM_SERVER_KEY);

class FCMHelpers {
// ... or some given values

async sendNot(data,type){
    let result = await db.fcmTokens.findAll({
        where: { userId: data.to, accountType: type },
      });
      if (result.length > 0) {
       result.forEach(element => {
        this.sendNotification(data,element.token);
       });
      }
}

async sendAdminNot(data,location){
    let result = await db.users.findAll({
        where: { location: location },
      });
      if (result.length > 0) {
       result.forEach(element => {
           var newData = {
            to: element.id,
            message: data.message,
           };
        this.sendNot(newData,"admin");
       });
      }
}

async sendTaskNot(message,id, type){
    let result = await db.tasks.findOne({
        where: { id: id },
      });
      if (result) {
        var newData = {
            to: result.resident_initiated,
        message : message == "closed" ? "Your task "+result.task+" has been closed" : "Your "+result.task+" task has been rejected",
        };
        this.sendNot(newData,type);
      }
}

sendNotification(data, fcmToken) {
    console.log(data);
    var message = new gcm.Message({
        // collapseKey: 'demo',
        priority: 'high',
        contentAvailable: true,
        delayWhileIdle: true,
        timeToLive: 3,
        restrictedPackageName: "",
        dryRun: false,
        data: {
            key1: 'message1',
            key2: 'message2'
        },
        notification: {
            title: data.name,
            // icon: "ic_launcher",
            body: data.message
        }
    });

    message.addData({
        key1: 'message1',
        key2: 'message2'
    });

    var registrationTokens = [];
registrationTokens.push(fcmToken);

sender.sendNoRetry(message, { registrationTokens: registrationTokens }, function(err, response) {
  if(err) console.error(err);
  else    console.log(response);
});

}

// // Change the message data
// // ... as key-value
// message.addData('key1','message1');
// message.addData('key2','message2');



// ... or retrying
// sender.send(message, { registrationTokens: registrationTokens }, function (err, response) {
//   if(err) console.error(err);
//   else    console.log(response);
// });

// ... or retrying a specific number of times (10)
importantMessage(){
    sender.send(message, { registrationTokens: registrationTokens }, 10, function (err, response) {
        if(err) console.error(err);
        else    console.log(response);
      });
}

// Q: I need to remove all "bad" token from my database, how do I do that?
//    The results-array does not contain any tokens!
// A: The array of tokens used for sending will match the array of results, so you can cross-check them.
removeStaleT(){
    sender.send(message, { registrationTokens: registrationTokens }, function (err, response) {
        var failed_tokens = registrationTokens.filter((token, i) => response[i].error != null);
        console.log('These tokens are no longer ok:', failed_tokens);
      });
}

}
module.exports = FCMHelpers;