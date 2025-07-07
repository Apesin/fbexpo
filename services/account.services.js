const uuid = require("uuid");
const db = require("../models");
const Helpers = require("../helpers/helpers.js");
const path = require("path");
const fs = require("fs");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { randomInt } = require("crypto");
var jwt = require('jsonwebtoken');
const database = require('../config/mongodb_config.js');
const config = require('../config/config.js')
const bcrypt = require("bcrypt");
const jwtService = require("../services/jwt.service.js");

class AccountService {
  constructor() {
    this.helper = new Helpers();
  }

async register(body) {
  console.log("body", body);
    try {
        // 1. Validate Input

        // 2. Check if user already exists
        const existingUser = await this.checkExistingUser(body.email);
        console.log("isexisting", existingUser);
        if (existingUser) {
            return{
                success: false,
                message: 'Email already registered'
            };
        }

        // 3. Prepare user data
        const userData = this.prepareUserData(body);

        // if (!body.password || typeof body.password !== 'string') {
        //   throw new Error('Password is required and must be a string');
        // }

        // // 4. Hash password
        // const saltRounds = 10; // 10 is commonly used
        // const salt = await bcrypt.genSalt(saltRounds);
        // userData.password = await bcrypt.hash(body.password, salt);

        // 5. Save to database
        const result = await database
            .getCollection(config.COLLECTION_USERS)
            .insertOne(userData);

        // 6. Return success response
        return {
          success : true,
          message : "Registration successful"
        };

    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            message:  error.message ?? 'Registration failed',
            error: error.message
        };
    }
}


// Check if user exists
async  checkExistingUser(email) {
    return await database
        .getCollection(config.COLLECTION_USERS)
        .findOne({ email: email });
}

// Prepare user data
 prepareUserData(body) {
    return {
        name: body.name,
        email: body.email,
        phone: body.phone,
        role: body.role || 'player', // default role
        status: 'active',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        // Include player-specific data if needed
        ...(body.role === 'player' && {
            playerData: {
                dob: body.dob,
                nationality: body.nationality,
                playerStatus: body.playerStatus,
                clubStatus: body.clubStatus,
                videoLink: body.videoLink,
                stats: body.stats,
                hasAgent: body.hasAgent || false,
                agentConsent: body.agentConsent || false
            }
        })
    };
}


async  login(email, fcmToken = "") {
  const user = await database.getCollection(config.COLLECTION_USERS).findOne({
    email: email
  });

  if (!user) {
    // throw new httpError.Unauthorized("Credential is incorrect");
    return {
      success: false,
      message: "Credentials is incorrect"
    }
  }

// let verify = await verifyPassword(password, user.password);
//   if (!verify) {
//     throw new httpError.Unauthorized("Credential is incorrect");
  
//   }


  const token = jwtService.createToken({ userId : user.userId });

  if(fcmToken != ""){
    await database
    .getCollection(config.COLLECTION_USERS)
    .updateOne(
      { userId: user.userId },
      { $set: { fcmToken: fcmToken } }
    );
  }
  
  return {
      success: true,
      message: "Login successful",
      token: token
    };
}

///GET USER FROM TOKEN

async  getUserFromToken(token) {
  const payload = jwtService.decodeToken(token);

  if (!payload) {
    return null;
  }

  const userId = payload.userId;
  const user = await database
    .getCollection(config.COLLECTION_USERS)
    .findOne({ userId }, { projection: { _id: false, password: false } });

  return user;
}

///FIND USERS

async  findUsers(criteria) {
  return database
    .getCollection(config.COLLECTION_USERS)
    .find(criteria,{ projection: { _id: false, password: false } })
    .toArray();
}


  async verifyEmailOTP(data) {
    if (data.otp) {
      try {
        let user = await db.users.findOne({
          where: {
            userId: data.userId,
          },
        });
        if (user) {
          let token = await this.tokenService.verifyOTP({
            userId: data.userId,
            token: data.otp,
            name: "Email Verification",
          });
          if (token.success) {
              let t = await db.users.update({
                isEmailVerified: 1},
                  {returning: true, where: {userId: data.userId},
              });
                let wallet = await this.walletService.createMnemomics({
                    userId: data.userId,
                  });
        
              if(t){
            return {
              message: "Email verified successfully.",
              success: true,
              error: false,
              data: {
                userId : user.userId,
        fullname: user.fullname,
        email: user.email,
        phoneNumber : user.phoneNumber,
        pin : user.pin,
        referredBy : user.referredBy,
        referrerCode: user.referrerCode,
        dateCreated: user.dateCreated,
        dateModified: user.dateModified,
        isEmailVerified: user.isEmailVerified,
        isPhoneNumberVerified: user.isPhoneNumberVerified,
        isAccountVerified: user.isAccountVerified,
        status: user.status,
        wallet: wallet.data
              },
            };
        }else {
            return {
              message: "Email verification failed.",
              success: false,
              error: true,
              data: null,
            };
          }
          } else {
            return {
              message: "Email verification failed.",
              success: false,
              error: true,
              data: null,
            };
          }
        } else {
          return {
            message: "Invalid",
            success: false,
            error: false,
            data: null,
          };
        }
      } catch (error) {
        console.log("from account service", error);
        return {
          message: "Database connection error",
          success: false,
          error: true,
          data: null,
        };
      }
    } else {
      return {
        message: "No record found! Invalid OTP",
        success: false,
        error: false,
        data: null,
      };
    }
  }

async createUserAccount(body) {
  try{
  let referrerCode = randomInt(1000000000, 9999999999);

    console.log(body);
  if(!body.email || !body.password || !body.fullname || !body.phoneNumber){
    return {
      message: "Please fill all the fields",
      success: false,
      error: true,
      data: null,
    };
  }
    let exist = await db.users.findOne({
        where : {
          email : body.email
        }
      });
  if(exist){
      return {
        message: "Email is already in use",
        success: false,
        error: true,
        data: null,
      };
  }
  let exist1 = await db.users.findOne({
    where : {
      phoneNumber : body.phoneNumber
    }
  });
  if(exist1){
      return {
        message: "Phone number is already in use",
        success: false,
        error: true,
        data: null,
      };
  }
try {
    const salt = genSaltSync(10);
    let password = await hashSync(body.password, salt);
    let result = await db.users.create({
    "userId": uuid.v4(),
    "fullname": body.fullname,
    "email": body.email,
    "phoneNumber": body.phoneNumber,
    "password": password,
    "accountLevel": body.accountLevel,
    "pin" : "0",
    "referredBy" : "0",
    "referrerCode" : "0",
    "dateCreated": this.helper.getDateTime(),
    "dateModified": this.helper.getDateTime(),
    "isEmailVerified": 1,
    "isPhoneNumberVerified": 1,
    "isAccountVerified": 1,
    "status": body.status
  });
  let c = await db.wallets.create({
    walletId:uuid.v4(),
    accountBalance: 0,
    userId: result.userId,
    status: 1,
    "dateGenerated": this.helper.getDateTime()
    });

    const jwtSecret = genSaltSync(10);

  const jsontoken = jwt.sign(
    { result: result },
    jwtSecret,
    { expiresIn: "365Days" }
  );

  let u = await db.usersToken.create({
    tokenId:uuid.v4(),
    value: jsontoken,
    userId: result.userId,
    secret: jwtSecret,
    name: "Access code",
    status: 1,
    "dateGenerated": this.helper.getDateTime(),
    "expiryDate": this.helper.getDateTime()


  });

  if(result){
    return {
      message: "Success",
      success: true,
      error: false,
      data: {
        userId : result.userId,
        fullname: result.fullname,
        email: result.email,
        phoneNumber : result.phoneNumber,
        pin : result.pin,
        referredBy : result.referredBy,
        referrerCode: result.referrerCode,
        dateCreated: result.dateCreated,
        dateModified: result.dateModified,
        isEmailVerified: result.isEmailVerified,
        isPhoneNumberVerified: result.isPhoneNumberVerified,
        isAccountVerified: result.isAccountVerified,
        status: result.status
      },
    };
  }else{
    return {
      message: "Failed to create account",
      success: false,
      error: true,
      data: result,
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
  }catch(error){
    return {
      message: error.message,
      success: false,
      error: true,
      data: null,
    };
  }

}

async getUserByEmail(email){
  try {
    let result = await db.users.findOne({
      where: {
        email: email
      },
    });
    if(result){
      return {
        message: "Success",
        success: true,
        error: false,
        data: result,
      };
    }else{
      return {
        message: "No user found.",
        success: false,
        error: false,
        data: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      message: error.message,
      success: false,
      error: true,
      data: null,
    };
  }
}

async getUserById(id){
  try {
    let result = await db.users.findOne({
      where: {
        userId: id
      },
      attributes: {exclude: ['password']},
      include: [{
        model: db.wallets,
        as: "wallet",
        attributes: ["walletId", "accountBalance"]
        }]
    });
    if(result){
      return {
        message: "Success",
        success: true,
        error: false,
        data: result,
      };
    }else{
      return {
        message: "No user found.",
        success: false,
        error: false,
        data: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      message: error.message,
      success: false,
      error: true,
      data: null,
    };
  }
}

async createUserPin(body){
  try {
    let result = await db.users.update({
      pin: body.pin}, {returning: true, where: { userId: body.userId }}
    );
    if(result){
      return {
        message: "User pin updated successfuly.",
        success: true,
        error: false,
        data: null,
      };
    }else{
      return {
        message: "Failed to update user pin.",
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

async verifyUserPin(body){
  try {
    let result = await db.users.findOne({
      where: { userId: body.userId }}
    );
    if(result.pin == body.pin){
      return {
        message: "Pin verified",
        success: true,
        error: false,
        data: null,
      };
    }else{
      return {
        message: "Wrong pin",
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

async checkIfUserHasPin(body){
  try {
    let result = await db.users.findOne({
      where: { userId: body.userId }}
    );
    if(result.pin){
      return {
        message: "User has pin",
        success: true,
        error: false,
        data: null,
      };
    }else{
      return {
        message: "User does not have a pin",
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

async getUserReferrals(referrerId){
  console.log(referrerId);
  try {
    let result = await db.users.findAll(
      {
      where: {
        referredBy: referrerId
      }, attributes: ['referredBy', 'userId', 'fullname']
    });
    if(result){
      return {
        message: "Success",
        success: true,
        error: false,
        data: result,
      };
    }else{
      return {
        message: "No referral found.",
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

async forgotPassword(data) {
  if (data.email) {
    try {
      if (data.email) {
          let user = await db.users.findOne({
          where: {
          email: data.email,
           },
          });  
          
          if(!user){
              return {
          message: "Account not found.",
          success: false,
          error: true
        };
          }
          
        let token = await this.tokenService.generateVerificationOTP({
          phone: data.email,
          name: "Email Verification",
          userId: user.userId,
        });
        if (token.success) {
          let otp = await this.helper.sendSingleEmail({
            to: data.email,
            name: user.fullname,
            message: "Please enter the OTP " +token.data.value +" to confirm your email., \n BTCA.",
          });
          if(otp){
            return {
              message: "An OTP has been sent to your email.",
              success: true,
              error: false,
              data: {
                  userId : user.userId
              },
            };
          }else{
              return {
                  message: "Failed to send OTP.",
                  success: false,
                  error: false,
                  data: otp,
              };
          }
        }else{
          return {
            message: "Failed to send OTP.",
            success: false,
            error: true,
            data: null,
          };
        }
      } else {
        return {
          message: "OTP sent, you should receive an OTP if your record was found.",
          success: false,
          error: false,
          data: user,
        };
      }
    } catch (error) {
      return {
        message: "Database connection error",
        success: false,
        error: true,
        data: null,
      };
    }
  } else {
    return {
      message: "No record found! Invalid email",
      success: false,
      error: false,
      data: null,
    };
  }
}

async getAllUsers(){
  try {
    let result = await db.users.findAll({

      attributes: {exclude: ['password']},
      include: [{
        model: db.wallets,
        as: "wallet",
        attributes: ["walletId", "accountBalance"]
        }]
    });
    if(result){
      return {
        message: "Success",
        success: true,
        error: false,
        data: result,
      };
    }else{
      return {
        message: "No user found.",
        success: false,
        error: false,
        data: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      message: error.message,
      success: false,
      error: true,
      data: null,
    };
  }
}

async updateUsers(body, id){
  try {
    let result = await db.users.update({
      fullname: body.fullname,
      email: body.email,
      phoneNumber: body.phoneNumber,
      accountLevel: body.accountLevel
    },
       {returning: true, where: { userId: id
      }}
      );
    if(result){
      return {
        message: "Success",
        success: true,
        error: false,
        data: result,
      };
    }else{
      return {
        message: "No user found.",
        success: false,
        error: false,
        data: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      message: error.message,
      success: false,
      error: true,
      data: null,
    };
  }
}

async deleteUser(id){
  try {
    let result = await db.users.destroy(
       {returning: true, where: { userId: id
      }}
      );
      let w = await db.wallets.destroy(
        {returning: true, where: { userId: id
       }}
       );
       let t = await db.usersToken.destroy(
        {returning: true, where: { userId: id
       }}
       );
    if(result){
      return {
        message: "Success",
        success: true,
        error: false,
        data: result,
      };
    }else{
      return {
        message: "No user found.",
        success: false,
        error: false,
        data: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      message: error.message,
      success: false,
      error: true,
      data: null,
    };
  }
}

async sendMail(data){
  try {
    await this.helper.sendSingleEmail({
      to: data.email,
      name: data.fullname,
      message: data.message,
    });
    return {
      message: "Message sent",
      success: true,
      error: false,
      data: null,
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


/////Commercial

async validateToken(token){
  try {
    let result = await db.usersToken.findOne({
      where: {
        value: token
      }
    });
    if(result){
      return {
        message: "Success",
        success: true,
        error: false,
        data: result,
      };
    }else{
      return {
        message: "No user found.",
        success: false,
        error: false,
        data: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      message: error.message,
      success: false,
      error: true,
      data: null,
    };
  }
}




}
module.exports = AccountService;
