const uuid = require("uuid");
const db = require("../models");
const Helpers = require("../helpers/helpers.js");
const TokenService = require("./tokenServices.js");
const path = require("path");
const fs = require("fs");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");

class ProductsService {
  constructor() {
    this.helper = new Helpers();
    this.tokenService = new TokenService();
  }
  
  async getProducts(){
    try{
        let result = await db.products.findAll();
        if(result){
            return {
            message: "Products retrieved.",
            success: true,
            error: false,
            data: result,
            };
        }else{
            return {
            message: "No product found.",
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

  async createProduct(data){
    if(data){
      try{
        let result = await db.products.create({
          productId: uuid.v4(),
          productName: data.productName,
          productCode: data.productCode,
          dateCreated: this.helper.getDateTime(),
          dateModified: this.helper.getDateTime(),
          status: data.status
        });
        if(result){
            return {
            message: "Product created.",
            success: true,
            error: false,
            data: result,
            };
        }else{
            return {
            message: "Failed to create product.",
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
    }else{
        return {
            message: "Missing required fields.",
            success: false,
            error: false,
            data: null,
            };
    }
  }

  async editProduct(data,productId){
    if(productId){
      try{
        let product = await db.products.findOne({
            where: {
              productId: productId
            }
        });
        if(product){
            let result = await db.products.update({
              productName: data.productName ?? product.productName,
              productCode: data.productCode ?? product.productCode,
              dateModified: this.helper.getDateTime()
            },
            {returning: true, where: { productId: productId
            }});
            if(result){
                return {
                message: "product updated.",
                success: true,
                error: false,
                data: result,
                };
            }else{
                return {
                message: "Failed to update product.",
                success: false,
                error: false,
                data: null,
                };
            }
        }else{
            return {
            message: "product not found.",
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
    }else{
        return {
            message: "Missing required fields.",
            success: false,
            error: false,
            data: null,
            };
    }
  }

  async getProductById(productId){
    if(productId){
      try{
        let product = await db.products.findOne({
            where: {
              productId: productId
            }
        });
        if(product){
          return {
          message: "product gotten.",
          success: true,
          error: false,
          data: product,
          };
      }else{
          return {
          message: "Failed to get product.",
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
    }else{
        return {
            message: "Missing required fields.",
            success: false,
            error: false,
            data: null,
            };
    }
  }

  async deletePackage(productId){
    if(productId){
      try{
        let products = await db.products.findOne({
            where: {
              productId: productId
            }
        });
        if(products){
            let result = await db.products.destroy({
                where: {
                  productId: productId
                }
            });
            if(result){
                return {
                message: "product deleted.",
                success: true,
                error: false,
                data: result,
                };
            }else{
                return {
                message: "Failed to delete product.",
                success: false,
                error: false,
                data: null,
                };
            }
        }else{
            return {
            message: "product not found.",
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
    }else{
        return {
            message: "Missing required fields.",
            success: false,
            error: false,
            data: null,
            };
    }
  }


}
module.exports = ProductsService;
