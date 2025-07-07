var Request = require("request");      
const AccountService = require("../../services/account.services");
const accountService = new AccountService();
const controller = 'Users'; 
const module_name = 'Users'; 
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
    const allRecord = await accountService.getAllUsers(); 
    res.render('admin/Users/list',{
        page_title:" List",
        data:allRecord.data, 
        controller:controller, 
        action:action,
        module_name:module_name
    });    
};      
exports.list = list;


async function players_list(req, res) { 

    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {};    
    action = 'list'; 
    const allRecord = await accountService.getAllUsers(); 
    res.render('admin/Users/players',{
        page_title:" List",
        data:allRecord.data, 
        controller:controller, 
        action:action,
        module_name:module_name
    });    
};      
exports.players_list = players_list;
 
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
        const entityDetail = await accountService.getUserById(id);    
        if(entityDetail.data == null){     
            req.flash('error', 'Invalid url')  
            return res.redirect(nodeAdminUrl+'/Users/list');  
        }     
        if (req.method == "POST") {  
            var input = JSON.parse(JSON.stringify(req.body)); 
            
            console.log(input); console.log('Here');  
            req.checkBody('fullname', 'Fullname is required').notEmpty();
            req.checkBody('phoneNumber', 'Phone number is required').notEmpty(); 
            req.checkBody('accountLevel', 'Account Type is required').notEmpty(); 
            req.checkBody('email', 'email is required').notEmpty(); 
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
                            return res.redirect(nodeAdminUrl+'/Users/'+action); 
                        }     
                    });  
                }   
                var msg =  controller+' updated successfully.';  
                var saveResult = await accountService.updateUsers(input,id);  
                req.flash('success', msg)    
                res.locals.message = req.flash(); 
                if(saveResult){     
                    return res.redirect(nodeAdminUrl+'/'+controller+'/list');     
                }        
            }  
        }  
        res.render('admin/'+controller+'/edit',{page_title:" Edit",data:entityDetail.data,errorData:errorData,controller:controller,action:action});  
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
        req.checkBody('fullname', 'Fullname is required').notEmpty();
        req.checkBody('phoneNumber', 'Phone number is required').notEmpty(); 
        req.checkBody('accountLevel', 'Account Type is required').notEmpty(); 
        req.checkBody('password', 'Password is required').notEmpty(); 
        req.checkBody('email', 'email is required').notEmpty();  
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
                        return res.redirect(nodeAdminUrl+'/Users/add'); 
                    }     
                }); 
            }  
            // Decrypt password with password hash
            // var salt = bcrypt.genSaltSync(saltRounds);
            // var password = bcrypt.hashSync(input.password, salt);
            // input.password = password;    
            
            // const SaveData = new Users(input);
            // var saveResult=   await SaveData.save();   

            var saveResult = await accountService.createUserAccount(input);
            if(saveResult.success){    
                req.flash('success', controller+' added successfully.')  
                res.locals.message = req.flash();  
                res.set('content-type' , 'text/html; charset=mycharset');  
                return res.redirect(nodeAdminUrl+'/'+controller+'/list');     
            }else{
                req.flash('error', saveResult.message)  
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
        categoryDetail = await accountService.deleteUser(req.params.id);   

        if(categoryDetail.data != 1){      
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
   
