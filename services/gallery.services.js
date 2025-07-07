const uuid = require("uuid");
const db = require("../models");
const Helpers = require("../helpers/helpers.js");
const { json } = require("express");

class AlbumService {
  constructor() {
    this.helper = new Helpers();
  }


async getCars(){
    try{
        let albums = await db.cars.findAll({
            order: [['dateCreated', 'DESC']], 
        });
        if(albums){
            return {
                success: true,
                error: false,
                message:"Cars gotten",
                data: albums
            };
        }else{
            return {
                success: false,
                error: true,
                message:"Unable to fetch cars, try again later",
                data: null
            };
        }
    }catch(error){
        console.log(error);
        return {
            success: false,
            error: true,
            message:"Unable to fetch cars, try again later",
            data: null
        };
    }
}

async getCarDetails(id){
    try{
        let details = await db.cars.findOne({
            where: { id: id },
        });

        let albums = await db.gallery.findAll({
            where: {
              carId: id
            }
        });
        details.albums = albums;
        console.log(details);
        return details;
    }catch(e){
        console.log(e);
    }
}

async addCar(input){
  try{
    let e = await db.cars.create({
        id: uuid.v4(),
        thumbnail: input.thumbnail,
        description: input.description,
        car_name: input.car_name,
        features: JSON.stringify(input.features),
        color: input.color,
        body: input.body,
        vin: input.vin,
        engine_size: input.engine_size,
        cylinder: input.cylinder,
        doors: input.doors,
        fuel: input.fuel,
        drive_unit: input.drive_unit,
        // car_condition: input.car_condition,
        mileage: input.mileage,
        selling_price: input.selling_price,
        vehicle_history: input.vehicle_history,
        model: input.model,
        transmission: input.transmission,
        status: input.status,
        dateCreated: this.helper.getMySQLDateTimeWithTimeZone(),
        dateModified: this.helper.getMySQLDateTimeWithTimeZone()

    });   
    return e;
  }catch(error){
    console.log(error);
    return false;
  }
}

async updateCar(input){
    console.log(input.features);
    try{
        let e = await db.cars.update(
            {
                thumbnail: input.thumbnail,
                description: input.description,
                car_name: input.car_name,
                features: JSON.stringify(input.features),
                color: input.color,
                body: input.body,
                vin: input.vin,
                engine_size: input.engine_size,
                cylinder: input.cylinder,
                doors: input.doors,
                fuel: input.fuel,
                drive_unit: input.drive_unit,
                // car_condition: input.car_condition,
                mileage: input.mileage,
                selling_price: input.selling_price,
                vehicle_history: input.vehicle_history,
                model: input.model,
                transmission: input.transmission,
                status: input.status,
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

  async addGallery(input){
    try{
      let e = await db.gallery.create({
          id: uuid.v4(),
          carId:input.carId,
          file: input.file,
          dateCreated: this.helper.getMySQLDateTimeWithTimeZone(),
          dateModified: this.helper.getMySQLDateTimeWithTimeZone()
      });   
      return e;
    }catch(error){
      return false;
    }
  }

  async getGallery(){
    try{
        let albums = await db.gallery.findAll({
            order: [['dateCreated', 'DESC']], 
        });
        if(albums){
            return {
                success: true,
                error: false,
                message:"Gallery gotten",
                data: albums
            };
        }else{
            return {
                success: false,
                error: true,
                message:"Unable to fetch albums, try again later",
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

async getCarGallery(id){
  try{
      let albums = await db.gallery.findAll({
          where: {
            carId: id
          },
          order: [['dateCreated', 'DESC']], 
      });
      if(albums){
          return {
              success: true,
              error: false,
              message:"Gallery gotten",
              data: albums
          };
      }else{
          return {
              success: false,
              error: true,
              message:"Unable to fetch gallery, try again later",
              data: null
          };
      }
  }catch(error){
      console.log(error);
      return {
          success: false,
          error: true,
          message:"Unable to fetch galley, try again later",
          data: null
      };
  }
}

async getGalleryPreview(){
  try{
      let albums = await db.gallery.findAll({
          order: [['dateCreated', 'DESC']],
          limit: 10
      });
      if(albums){
          return {
              success: true,
              error: false,
              message:"Gallery gotten",
              data: albums
          };
      }else{
          return {
              success: false,
              error: true,
              message:"Unable to fetch albums, try again later",
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

}
module.exports = AlbumService;
