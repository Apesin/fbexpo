var Request = require("request");      
const controller = 'Settings'; 
const module_name = 'Settings'; 
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const SettingsService = require("../../services/settings.services");
const settingsService = new SettingsService();


async function view(req, res) { 
    res.set('content-type' , 'text/html; charset=mycharset'); 
    var page_title = 'View'; 
    var errorData = {}; 
    var data = await settingsService.get_settings();  
    console.log(data);
    var action = 'add'; 
    var errorData = {};    
    if (req.method == "POST") { 
        var input = JSON.parse(JSON.stringify(req.body));  
        req.checkBody('volunteer_text', 'volunteer text is required').notEmpty();


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
            // Save to DB 
            
            var saveResult =   await settingsService.save_settings(input);   
            if(saveResult.success){    
                req.flash('success', controller+' added successfully.')  
                res.locals.message = req.flash();  
                res.set('content-type' , 'text/html; charset=mycharset');  
                return res.redirect(nodeAdminUrl+'/'+controller+'/view');     
            }else{
                req.flash('error', 'Could not save record. Please try again')  
                res.locals.message = req.flash();  
            }      
        } 
    }   
    res.render('admin/'+controller+'/view',{page_title:page_title,data:data[0], errorData:errorData,controller:controller,action:action});    
};
exports.view = view; 

