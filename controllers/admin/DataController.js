var Request = require("request");      
//var Categories = require.main.require('./models/Categories');   
const controller = 'Data'; 
const module_name = 'Data'; 
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
  
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
    const allRecord = await Data.find({}); 
    res.render('admin/Data/list',{
        page_title:" List",
        data:allRecord, 
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
    if(req.params.id){
        var id =  req.params.id; 
        const entityDetail = await Data.findById({_id:id});    
        if(entityDetail == 0){     
            req.flash('error', 'Invalid url')  
            return res.redirect(nodeAdminUrl+'/Data/list');  
        }     
        if (req.method == "POST") {  
            var input = JSON.parse(JSON.stringify(req.body)); 
            
            console.log(input); console.log('Here');  
            req.checkBody('model_name', 'Model name is required').notEmpty();
            req.checkBody('scientific_name', 'Scientific name is required').notEmpty();  
            req.checkBody('english_name', 'English name is required').notEmpty(); 
            req.checkBody('is_plant', 'Specify whether it is plant or not').notEmpty();
            req.checkBody('is_living', 'Specify whether data is living or not').notEmpty();
            var errors = req.validationErrors();    
            if(errors){	   
                if(errors.length > 0){
                    errors.forEach(function (errors1) {
                        var field1 = String(errors1.param); 
                        var msg = errors1.msg; 
                        errorData[field1] = msg;   
                        entityDetail.field1 = req.field1;
                    }); 
                }    
            }else{  
                var saveResult = '';  
                // Upload Image  
                if (req.files && req.files.profile_pic !== "undefined") { 
                    let profile_pic = req.files.profile_pic;  
                    var timestamp = new Date().getTime();   
                    filename = timestamp+'-'+profile_pic.name;   
                    input.profile_pic =   filename; 
                    profile_pic.mv('public/upload/'+filename, function(err) {
                        if (err){    
                            console.log(err);    
                            req.flash('error', 'Could not upload image. Please try again!')  
                            res.locals.message = req.flash();   
                            return res.redirect(nodeAdminUrl+'/Data/'+action); 
                        }     
                    });  
                }   
                var msg =  controller+' updated successfully.';  
                var saveResult = await Data.findByIdAndUpdate(req.params.id, {$set: input});  
                req.flash('success', msg)    
                res.locals.message = req.flash(); 
                if(saveResult){     
                    return res.redirect(nodeAdminUrl+'/'+controller+'/list');     
                }        
            }  
        }  
        res.render('admin/'+controller+'/edit',{page_title:" Edit",data:entityDetail,errorData:errorData,controller:controller,action:action});  
    }else{ 
        req.flash('error', 'Invalid url.');  
        return res.redirect(nodeAdminUrl+'/'+controller+'/list');     
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
    if (req.method == "POST") { 
        var input = JSON.parse(JSON.stringify(req.body));  
        req.checkBody('model_name', 'Model name is required').notEmpty();
        req.checkBody('scientific_name', 'Scientific name is required').notEmpty();  
        req.checkBody('english_name', 'English name is required').notEmpty(); 
        req.checkBody('is_plant', 'Specify whether it is plant or not').notEmpty();
        req.checkBody('is_living', 'Specify whether data is living or not').notEmpty();  
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
            if (req.files && req.files.profile_pic !== "undefined") { 
                let profile_pic = req.files.profile_pic;  
                var timestamp = new Date().getTime(); 
                var imagePath = '';   
                filename = timestamp+'-'+profile_pic.name;   
                input.profile_pic =   filename; 
                profile_pic.mv('public/upload/'+filename, function(err) { 
                    if (err){    
                        console.log(err);    
                        req.flash('error', 'Could not upload image. Please try again!')  
                        res.locals.message = req.flash();   
                        return res.redirect(nodeAdminUrl+'/Data/add'); 
                    }     
                }); 
            }  
            // Save to DB 
            const SaveData = new Data(input);
            var saveResult=   await SaveData.save();   
            if(saveResult){    
                req.flash('success', controller+' added successfully.')  
                res.locals.message = req.flash();  
                res.set('content-type' , 'text/html; charset=mycharset');  
                return res.redirect(nodeAdminUrl+'/'+controller+'/list');     
            }else{
                req.flash('error', 'Could not save record. Please try again')  
                res.locals.message = req.flash();  
            }      
        } 
    }   
    res.render('admin/'+controller+'/add',{page_title:page_title,data:data, errorData:errorData,controller:controller,action:action});    
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
        categoryDetail = await Data.findByIdAndRemove(req.params.id);     
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
   
