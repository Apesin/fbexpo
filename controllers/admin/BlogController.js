var Request = require("request");      
const controller = 'Blog'; 
const module_name = 'Blog'; 
const db = require("../../models");
const Helpers = require('../../helpers/helpers');
const BlogService = require("../../services/blog.services");
const blogService = new BlogService();

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
    const allRecord = await db.blog.findAll({
        order: [['dateCreated', 'DESC']], 
    });
    res.render('admin/Blog/list',{
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
        const entityDetail = await db.blog.findOne({
            where:{
                id : id
            }
        });    
        if(entityDetail == 0){     
            req.flash('error', 'Invalid url')  
            return res.redirect(nodeAdminUrl+'/Blog/list');  
        }     
        if (req.method == "POST") {  
            var input = JSON.parse(JSON.stringify(req.body)); 
            
            console.log(input); 
            req.checkBody('title', 'Event title/name is required').notEmpty();
            req.checkBody('url', 'URL is required').notEmpty(); 
            req.checkBody('description', 'Description is required').notEmpty(); 
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
                if (req.files && req.files.poster !== "undefined") { 
                    let poster = req.files.poster;  
                    var timestamp = new Date().getTime(); 
                    var imagePath = '';   
                    filename = timestamp+'-'+poster.name;   
                    input.poster =   filename; 
                    poster.mv('public/upload/blog/'+filename, function(err) { 
                        if (err){    
                            console.log(err);    
                            req.flash('error', 'Could not upload image. Please try again!')  
                            res.locals.message = req.flash();   
                            return res.redirect(nodeAdminUrl+'/Blog/'+action); 
                        }     
                    }); 
                }  
                var msg =  controller+' updated successfully.';  
                input.id = req.params.id;
                var saveResult = await blogService.updateBlog(input);  
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
        const uploadedFile = req.files;
        console.log(uploadedFile);
        var input = JSON.parse(JSON.stringify(req.body));  
        req.checkBody('title', 'Event title/name is required').notEmpty();
        req.checkBody('url', 'URL is required').notEmpty(); 
        req.checkBody('description', 'Description is required').notEmpty(); 
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
            if (req.files && req.files.poster !== "undefined") { 
                let poster = req.files.poster;  
                var timestamp = new Date().getTime(); 
                var imagePath = '';   
                filename = timestamp+'-'+poster.name;   
                input.poster =   filename; 
                poster.mv('public/upload/blog/'+filename, function(err) { 
                    if (err){    
                        console.log(err);    
                        req.flash('error', 'Could not upload image. Please try again!')  
                        res.locals.message = req.flash();   
                        return res.redirect(nodeAdminUrl+'/Blog/add'); 
                    }     
                }); 
            }  
            // Save to DB 
            var saveResult=  await blogService.addBlog(input);
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
        categoryDetail = await db.blog.destroy({
            where: {
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
   
