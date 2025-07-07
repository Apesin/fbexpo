const uuid = require("uuid");
const db = require("../models");
const Helpers = require("../helpers/helpers.js");
const { randomInt } = require("crypto");

class TokenService {
  constructor() {
    this.helper = new Helpers();
  }
  async generateOTP(data) {
    if (!data.userId) {
      return {
        message: "User not found.",
        success: false,
        error: false,
        data: null,
      };
    }
    try {
      let otp = randomInt(100000, 999999);
      if(otp > 1000){
      let result = await db.usersToken.create({
        tokenId: uuid.v4(),
        userId: data.userId,
        name: data.name,
        value: otp,
        status: "Active",
        dateGenerated: this.helper.getDateTime(),
        expiryDate: data.expiryDate,
      });
      if (result) {
        return {
          message: "OTP Generated and saved.",
          success: true,
          error: false,
          data: result,
        };
      } else {
        return {
          message: "There was an error generating OTP.",
          success: false,
          error: false,
          data: null,
        };
      }
    }else{
      return {
        message: "There was an error generating OTP.",
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


  async generateVerificationOTP(data) {
    console.log(data);
    if (!data.userId) {
      return {
        message: "User not found.",
        success: false,
        error: false,
        data: null,
      };
    }
    try {
      let otp = randomInt(100000, 999999);
      if(otp > 1000){
      let result = await db.usersToken.create({
        tokenId: uuid.v4(),
        userId: data.userId,
        name: data.name,
        value: otp,
        status: "Active",
        dateGenerated: this.helper.getDateTime(),
        expiryDate: this.helper.getDateTime(),
      });
      if (result) {
        return {
          message: "OTP Generated and saved.",
          success: true,
          error: false,
          data: result,
        };
      } else {
        return {
          message: "There was an error generating OTP.",
          success: false,
          error: false,
          data: null,
        };
      }
    }else{
      return {
        message: "There was an error generating OTP.",
        success: false,
        error: false,
        data: null,
      };
    } }catch (error) {
      console.log(error);
      return {
        message: "Database connection error",
        success: false,
        error: true,
        data: null,
      };
    }
  }

async verifyOTP(data) {
  if(!data.token){
    return {
      message: "OTP not found.",
      success: false,
      error: false,
      data: null,
    };
  }
  let result = await db.usersToken.findOne({ where: { value: data.token,
  name: data.name, userId: data.userId, status: "Active" } });
  if (result) {
    let result1 = await db.usersToken.update({
      status: "Expired",}, {returning: true, where: { value: data.token,
        name: data.name, userId: data.userId, status: "Active" }}
    );
    if(result1){
      return {
        message: "OTP verified.",
        success: true,
        error: false,
        data: result,
      };
    }else{
      return {
        message: "Unable to verify OTP.",
        success: false,
        error: false,
        data: null,
      };
    }
  }else{
    return {
      message: "OTP has expired.",
      success: false,
      error: false,
      data: null,
    };
  }
}

  async updateOTP(data) {
    if (!data.token) {
      return {
        message: "OTP not found.",
        success: false,
        error: false,
        data: null,
      };
    }
    let result = await db.usersToken.update(
      { status: "Expired" },
      { returning: true, where: { value: data.token } }
    );

    if (result) {
      return {
        message: "OTP verified.",
        success: true,
        error: false,
        data: result,
      };
    } else {
      return {
        message: "Unable to update OTP.",
        success: false,
        error: false,
        data: null,
      };
    }
  }

  async getOTPByOTP(otp) {
    if (!data.otp) {
      return {
        message: "OTP not found.",
        success: false,
        error: false,
        data: null,
      };
    }
    try {
      let result = await db.usersToken.findOne({ where: { value: otp } });
      if (result) {
        return {
          message: "OTP not found.",
          success: true,
          error: false,
          data: null,
        };
      } else {
        return {
          message: "OTP not found.",
          success: false,
          error: false,
          data: null,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        message: "OTP not found.",
        success: false,
        error: true,
        data: null,
      };
    }
  }

async createWalletMnemonic(data) {
  if (!data.userId) {
    return {
      message: "User not found.",
      success: false,
      error: false,
      data: null,
    };
  }
  try {
    let result = await db.wallets.create({
      userId: data.userId,
      mnemonic: data.mnemonic,
      account: 0,
      status: "Active",
      dateGenerated: this.helper.getDateTime(),
    });
    if (result) {
      return {
        message: "Wallet Mnemonic Generated and saved.",
        success: true,
        error: false,
        data: result,
      };
    } else {
      return {
        message: "There was an error generating Wallet Mnemonic.",
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
}

module.exports = TokenService;
