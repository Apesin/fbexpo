var Request = require("request");      


const AccountService = require('../../services/account.services');

const controller = 'General'; 
const module_name = 'General'; 
const GalleryService = require("../../services/gallery.services");
const galleryService = new GalleryService();
const SettingsService = require("../../services/settings.services");
const settingsService = new SettingsService();
const db = require("../../models");
const { body, validationResult } = require('express-validator');


/** 
 *  list
 *  Purpose: This function is used to show listing of all arecord
 *  Pre-condition:  None
 *  Post-condition: None. 
 *  Parameters: ,
 *  Returns: json   
*/
async function landing(req, res) { 

    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {};    
    action = 'landing';     

    res.render('landingpage/index',{
        page_title:"Welcome to FBExpo",
        controller:controller, 
        module_name:module_name,
        nodeSiteUrl: nodeSiteUrl,
    
    });    
}
exports.landing = landing;

async function register(req, res) {
    // Set response headers
    res.set('content-type', 'text/html; charset=utf-8');
    
    // Initialize variables
    const page_title = 'Player Registration - FBExpo';
    const action = 'register';
    let errorData = {}; 
    let data = {};  
    
    // Handle flash messages
    res.locals.messages = {
        error: req.flash('error'),
        success: req.flash('success')
    };

    // Handle POST request
    if (req.method === "POST") { 
        try {
            const input = JSON.parse(JSON.stringify(req.body));
            
            // Input validation
            req.checkBody('name', 'Name is required').notEmpty();
            if(input.role === 'player'){
                 req.checkBody('dob', 'Invalid date format').custom(value => {
                return value && !isNaN(new Date(value).getTime());
            });

             req.checkBody('nationality', 'Nationality is required').notEmpty();
            req.checkBody('playerStatus', 'Select player status').isIn(['Professional', 'Amateur']);
            req.checkBody('clubStatus', 'Club status is required');
             if (input.videoLink?.trim()) {
                req.checkBody('videoLink', 'Invalid video link').isURL();
            }
            
            req.checkBody('hasAgent', 'Invalid value').isIn(['on', 'off']);
            if (input.hasAgent === 'true') {
                req.checkBody('agentConsent', 'Agent consent required').isIn(['on', 'off']);
            }

            req.checkBody('location', 'Location is required').notEmpty();
            req.checkBody('position', 'Position is required').notEmpty();
            req.checkBody('height', 'Height is required').notEmpty();

            
            }
           
            
           
            req.checkBody('email', 'Invalid email').isEmail();
            req.checkBody('phone', 'Phone number is required').notEmpty();

            // Process validation errors
            const errors = req.validationErrors();    
            if (errors) {
                console.log("ERRORS", errors);
                errors.forEach(error => {
                    errorData[error.param] = error.msg;
                    data[error.param] = input[error.param];
                });
                 return res.status(400).json({
                    success: false,
                    errors: errorData, // Your existing error object
                    formData: input    // Preserve form data
                });
            }

            // Prepare player data
            const playerData = {
                name: input.name,
                dob: input.dob,
                email: input.email,
                phone: input.phone,
                position: input.position,
                height: input.height,
                nationality: input.nationality,
                playerStatus: input.playerStatus,
                clubStatus: input.clubStatus,
                currentSalary: input.currentSalary,
                currentLocation: input.location,
                videoLink: input.videoLink || null,
                stats: input.stats || null,
                hasAgent: input.hasAgent === 'on',
                agentConsent: input.hasAgent === 'on' ? input.agentConsent === 'on' : null,
                contact: {
                    email: input.email,
                    phone: input.phone
                },
                createdAt: new Date(),
                role: input.role || 'player'
            };

            // Save to database
            const accountService = new AccountService();
            const saveResult = await accountService.register(playerData);
            
            if (saveResult.success === true) {
             return res.status(200).json({
                success: true,
                errors: null,
            });

            }else{
             return res.status(500).json({
                success: false,
                errors: 
                    {
                        "error" : saveResult.message 
                    }
            });
            }

           
            
        } catch (err) {
            console.error('Registration error:', err);
            errorData.error = err.message;
            return res.status(400).json({
                success: false,
                errors: errorData, // Your existing error object
                formData: input    // Preserve form data
            });
        }
    }
    
    // Handle GET request or render after error
    return renderForm();

    // Helper function to render the form
    function renderForm() {
        res.render('landingpage/register', {
            page_title,
            data,
            errorData,
            controller,
            module_name,
            nodeSiteUrl,
            action,
            messages: res.locals.messages
        });
    }
}

exports.register = register;

async function registerSuccess(req, res) {
    
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {};    
    action = 'landing';     

    res.render('landingpage/registration-success',{
        page_title:"Welcome to FBExpo",
        controller:controller, 
        module_name:module_name,
        nodeSiteUrl: nodeSiteUrl,
    
    });  
};

exports.registerSuccess = registerSuccess;

async function page404(req, res) { 

    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {};    
    action = 'landing'; 
    res.render('landingpage/page404',{
        page_title:"Biran Car Shop - 404",
        controller:controller, 
        module_name:module_name,
        nodeSiteUrl: nodeSiteUrl,
    });    
};      
exports.page404 = page404;