var Request = require("request"); 
const Jimp = require('jimp');
//var Categories = require.main.require('./models/Categories');   
const controller = 'Cars'; 
const module_name = 'Cars'; 
const db = require("../../models");
const Helpers = require('../../helpers/helpers');
const GalleryService = require("../../services/gallery.services");
const galleryService = new GalleryService();
  
/** 
 *  list
 *  Purpose: This function is used to show listing of all arecord
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json   
*/
async function list(req, res) { 

    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {};    
    action = 'list'; 
    const allRecord = await galleryService.getCars();
    res.render('admin/Cars/list',{
        page_title:" List",
        data:allRecord.data, 
        controller:controller, 
        action:action,
        module_name:module_name
    });    
};      
exports.list = list;
 
/** 
 *  Edit
 *  Purpose: This function is used to get constructor List
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json  
*/
async function edit(req, res) { 
    res.set('content-type' , 'text/html; charset=mycharset'); 
    var action = 'edit';
    var entityDetail = {}; 
    var errorData = {};

    const messages = req.flash('error');
    res.locals.messages = messages;


    if (req.params.id) {
        var id = req.params.id; 
        const entityDetail = await db.cars.findOne({
            where: { id: id }
        });    

        if (!entityDetail) {     
            req.flash('error', 'Invalid URL');  
            return res.redirect(nodeAdminUrl + '/Cars/list');  
        }     

        if (req.method === "POST") {  
            var input = JSON.parse(JSON.stringify(req.body)); 
            console.group(input);
            req.checkBody('car_name', 'Car name is required').notEmpty();
            req.checkBody('description', 'Description is required').notEmpty(); 
            req.checkBody('color', 'Color is required').notEmpty(); 
            req.checkBody('body', 'Body is required').notEmpty(); 
            // req.checkBody('vin', 'VIN is required').notEmpty(); 
            req.checkBody('engine_size', 'Engine size is required').notEmpty(); 
            req.checkBody('cylinder', 'Cylinder is required').notEmpty(); 
            req.checkBody('doors', 'Doors are required').notEmpty(); 
            req.checkBody('fuel', 'Fuel is required').notEmpty(); 
            req.checkBody('selling_price', 'Selling price is required').notEmpty();   
            req.checkBody('model', 'Model is required').notEmpty(); 
            req.checkBody('mileage', 'Mileage is required').notEmpty(); 
            req.checkBody('transmission', 'Transmission is required').notEmpty(); 
            req.checkBody('status', 'Status is required').notEmpty(); 

            var errors = req.validationErrors();    
            if (errors) {	   
                if (errors.length > 0) {
                    errors.forEach(function (errors1) {
                        var field1 = String(errors1.param); 
                        var msg = errors1.msg; 
                        errorData[field1] = msg;   
                        entityDetail[field1] = req.body[field1];
                    }); 
                }    
            } else {  
                var saveResult = '';  
                // Upload Image  
                if (req.files && req.files.thumbnail !== "undefined") { 
                    let thumbnail = req.files.thumbnail;  
                    var timestamp = new Date().getTime();   
                    var filename = timestamp + '-' + thumbnail.name;   
                    input.thumbnail = filename;

                    // Check image width using Jimp
                    try {
                        const image = await Jimp.read(thumbnail.data);
                        const imageWidth = image.bitmap.width;

                        if (imageWidth < 1000) {
                            req.flash('error', 'Image width is too small. Please upload a larger image.');  
                            // res.locals.message = req.flash();   
                            // return res.redirect(nodeAdminUrl + '/Cars/' + action + '/' + id);
                            errorData.thumbnail = "Image width is too small. Please upload a larger image.";
                            errorData.error = "Image width is too small. Please upload a larger image.";

                            res.render('admin/' + controller + '/edit', {page_title: "Edit", data: entityDetail, errorData: errorData, controller: controller, action: action});  
                            return false;
                        }

                        // If width is fine, save the image
                        await thumbnail.mv('public/upload/gallery/' + filename);
                    } catch (err) {
                        console.log(err);    
                        errorData.thumbnail = 'Could not upload image. Please try again!';
                            errorData.error = 'Could not upload image. Please try again!';
                        res.render('admin/' + controller + '/edit', {page_title: "Edit", data: entityDetail, errorData: errorData, controller: controller, action: action});  
                        return false;
                    }  
                }   

                var msg = controller + ' updated successfully.';  
                input.id = req.params.id;
                var saveResult = await galleryService.updateCar(input);  
                req.flash('success', msg);    
                res.locals.message = req.flash(); 
                if (saveResult) {     
                    return res.redirect(nodeAdminUrl + '/' + controller + '/list');     
                }        
            }  
        }  

        res.render('admin/' + controller + '/edit', {page_title: "Edit", data: entityDetail, errorData: errorData, controller: controller, action: action});  
    } else { 
        req.flash('error', 'Invalid URL.');  
        return res.redirect(nodeAdminUrl + '/' + controller + '/list');     
    }   
};          

exports.edit = edit;
/** 
 *  Edit
 *  Purpose: This function is used to get constructor List
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json  
*/
async function add(req, res) { 
    res.set('content-type' , 'text/html; charset=mycharset'); 
    var page_title = 'Add'; 
    var errorData = {}; 
    var data = {};  
    var action = 'add'; 
    var errorData = {};    

    const messages = req.flash('error');
    res.locals.messages = messages;


    if (req.method == "POST") { 
        var input = JSON.parse(JSON.stringify(req.body));  
        console.log(input);
        req.checkBody('car_name', 'Car name is required').notEmpty();
        req.checkBody('description', 'Description is required').notEmpty(); 
        req.checkBody('color', 'color is required').notEmpty(); 
        req.checkBody('body', 'body is required').notEmpty(); 
        // req.checkBody('vin', 'vin is required').notEmpty(); 
        req.checkBody('engine_size', 'engine_size is required').notEmpty(); 
        req.checkBody('cylinder', 'cylinder is required').notEmpty(); 
        req.checkBody('doors', 'doors is required').notEmpty(); 
        req.checkBody('fuel', 'fuel is required').notEmpty(); 
        req.checkBody('selling_price', 'selling price is required').notEmpty(); 
        req.checkBody('model', 'model is required').notEmpty(); 
        req.checkBody('mileage', 'mileage is required').notEmpty(); 
        req.checkBody('transmission', 'transmission is required').notEmpty(); 
        req.checkBody('status', 'status is required').notEmpty(); 

        var errors = req.validationErrors();    
        if(errors){	  
            if(errors.length > 0){
                errors.forEach(function (errors1) {
                    var field1 = String(errors1.param); 
                    console.log(errors1);
                    var msg = errors1.msg; 
                    errorData[field1] = msg;   
                    data.field1 = req.field1; 
                }); 
            }     
            data = input;   
        } else { 
            // Upload Image 
            if (req.files && req.files.thumbnail !== "undefined") { 
                let thumbnail = req.files.thumbnail;  
                var timestamp = new Date().getTime(); 
                var imagePath = '';   
                var filename = timestamp + '-' + thumbnail.name;   
                input.thumbnail = filename; 

                // Check image width using Jimp
                try {
                    const image = await Jimp.read(thumbnail.data);
                    const imageWidth = image.bitmap.width;

                    if (imageWidth < 1000) { // Replace 1000 with your desired minimum width
                        req.flash('error', 'Image width is too small. Please upload a larger image.');  
                        res.locals.message = req.flash();   
                        errorData.error =  'Image width is too small. Please upload a larger image.';
                        errorData.thumbnail =  'Image width is too small. Please upload a larger image.';
                        res.render('admin/'+controller+'/add', {page_title: page_title, data: data, errorData: errorData, controller: controller, action: action});    
                        return false;
                    }

                    // If width is fine, save the image
                    await thumbnail.mv('public/upload/gallery/' + filename);
                } catch (err) {
                    console.log(err);    
                    req.flash('error', 'Could not upload image. Please try again!');  
                    res.locals.message = req.flash();   
                    errorData.error =  'Could not upload image. Please try again!';
                    errorData.thumbnail =  'Could not upload image. Please try again!';
                    res.render('admin/'+controller+'/add', {page_title: page_title, data: data, errorData: errorData, controller: controller, action: action});    
                    return false;
                }
            }  

            // Save to DB 
            var saveResult = await galleryService.addCar(input);   
            if (saveResult) {    
                req.flash('success', controller+' added successfully.');  
                res.locals.message = req.flash();  
                res.set('content-type', 'text/html; charset=mycharset');  
                return res.redirect(nodeAdminUrl+'/'+controller+'/list');     
            } else {
                req.flash('error', 'Could not save record. Please try again');  
                res.locals.message = req.flash();  
            }      
        } 
    }   

    res.render('admin/'+controller+'/add', {page_title: page_title, data: data, errorData: errorData, controller: controller, action: action});    
};          

exports.add = add;

/** 
 *  delete
 *  Purpose: This function is used to get constructor delete
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json  
*/
async function deleteRecord(req, res) { 
   
    var categoryDetail = {}; 
    if(req.params.id){ 
        categoryDetail = await db.cars.destroy({
            where:{
                id: req.params.id
            }
        });
        if(categoryDetail){      
            req.flash('error', 'Invalid url')  
            return res.redirect(nodeAdminUrl+'/'+controller+'/list'); 
        }else{
            req.flash('success', 'Record deleted succesfully.');    
            return res.redirect(nodeAdminUrl+'/'+controller+'/list');  
        }    
    }else{  
        req.flash('error', 'Invalid url.');   
        return res.redirect(nodeAdminUrl+'/'+controller+'/list');      
    }    
};          
exports.deleteRecord = deleteRecord;  
   
////Gallery images

async function addGallery(req, res) { 
    
    res.set('content-type' , 'text/html; charset=mycharset'); 
    var page_title = 'Add'; 
    var errorData = {}; 
    var data = {};  
    var action = 'add'; 
    var errorData = {};    
    let id = req.params.id;
    console.log(id);

    if (req.method == "POST") { 
        var input = JSON.parse(JSON.stringify(req.body));  
        var errors = req.validationErrors();    
        if(errors){	  
            if(errors.length > 0){
                errors.forEach(function (errors1) {
                    var field1 = String(errors1.param); 
                    console.log(errors1);
                    var msg = errors1.msg; 
                    errorData[field1] = msg;   
                    data.field1 = req.field1; 
                }); 
            }     
            data = input;   
        }else{ 
            // Upload Image 
            if (req.files && req.files.file !== "undefined") { 
                let file = req.files.file;  
                var timestamp = new Date().getTime(); 
                var imagePath = '';   
                filename = timestamp+'-'+file.name;   
                input.file =   filename; 
                file.mv('public/upload/gallery/'+filename, function(err) { 
                    if (err){    
                        console.log(err);    
                        req.flash('error', 'Could not upload image. Please try again!')  
                        res.locals.message = req.flash();   
                        return res.redirect(nodeAdminUrl+'/Cars/galleryList/'+id); 
                    }     
                }); 
            }  
            // Save to DB 
            input.carId = req.params.id;
            var saveResult=   await galleryService.addGallery(input);   
            console.log(saveResult);
            if(saveResult){    
                req.flash('success', controller+' added successfully.')  
                res.locals.message = req.flash();  
                res.set('content-type' , 'text/html; charset=mycharset');  
                return res.redirect(nodeAdminUrl+'/'+controller+'/galleryList/'+id);     
            }else{
                req.flash('error', 'Could not save record. Please try again')  
                res.locals.message = req.flash();  
            }      
        } 
    }   
    res.render('admin/'+controller+'/addGallery',{page_title:page_title,data:data, errorData:errorData,controller:controller,action:action,id:id});    
};          
exports.addGallery = addGallery; 

async function galleryList(req, res) { 
    let id = req.params.id;
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {};    
    action = 'list'; 
    const allRecord = await galleryService.getCarGallery(id);
    res.render('admin/Cars/galleryList',{
        page_title:" List",
        data:allRecord.data, 
        controller:controller, 
        action:action,
        module_name:module_name,
        id:id
    });    
};      
exports.galleryList = galleryList;

async function deleteGallery(req, res) { 
    let id = req.params.id;
    let fileId = req.params.fileId;
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {};    
    action = 'list'; 
    await db.gallery.destroy({
        where: {
            id: fileId
        }
    });
    const allRecord = await galleryService.getCarGallery(id);
    res.render('admin/Cars/galleryList',{
        page_title:" List",
        data:allRecord.data, 
        controller:controller, 
        action:action,
        module_name:module_name,
        id:id
    });    
};      
exports.deleteGallery = deleteGallery;


async function getCarsLandingPage(req, res) { // page and limit are optional parameters
    try {
        page = 1, limit = 8
        let offset = (page - 1) * limit;

        let albums = await db.cars.findAll({
            order: [['dateCreated', 'DESC']], 
            limit: limit,
            offset: offset
        });

        if (albums.length > 0) {
            return {
                success: true,
                error: false,
                message: "Cars fetched successfully",
                data: albums,
                pagination: {
                    currentPage: page,
                    pageSize: limit,
                    hasMore: albums.length === limit
                }
            };
        } else {
            return {
                success: false,
                error: true,
                message: "No more cars to load",
                data: null
            };
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: true,
            message: "Unable to fetch cars, try again later",
            data: null
        };
    }
}
exports.getCarsLandingPage = getCarsLandingPage;