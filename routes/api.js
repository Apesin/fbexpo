var express = require('express');
var router = express.Router(); 
var AdminController    =  require('../controllers/admin/AdminController');   
var CarsController    =  require('../controllers/admin/CarsController');   

var SettingsController = require('../controllers/admin/SettingsController');

var GeneralController    =  require('../controllers/general/GeneralController');   
var MessagesController    =  require('../controllers/message/MessageController');   
const db = require("../models");
var jwt = require('jsonwebtoken');




/** Routes for admin  */     
//router.get('/login', AdminController.login);     
router.post('/admin/login', AdminController.login);     
router.get('/admin/login', AdminController.login);     
router.get('/admin/Dashboard', requiredAuthentication, AdminController.dashboard);  
router.get('/admin/logout', AdminController.logout);         

/** Routes for users module  */ 
router.get('/admin/Messages/list',requiredAuthentication,  MessagesController.getMessages);     
router.get('/admin/Messages',requiredAuthentication,  MessagesController.getMessages);     
router.get('/admin/Messages/reply/:id/:subject',requiredAuthentication,  MessagesController.reply);     

/** Routes for Cars module  */ 
router.get('/admin/Cars/list',requiredAuthentication,  CarsController.list);     
router.get('/admin/Cars/edit/:id', requiredAuthentication, CarsController.edit);     
router.post('/admin/Cars/edit/:id',requiredAuthentication,  CarsController.edit); 
router.post('/admin/Cars/add',requiredAuthentication, CarsController.add); 
router.get('/admin/Cars/add', requiredAuthentication, CarsController.add); 
router.get('/admin/Cars/delete/:id', requiredAuthentication, CarsController.deleteRecord);
router.get('/admin/Cars/galleryList/:id', requiredAuthentication, CarsController.galleryList);
router.get('/admin/Cars/galleryDelete/:id/:fileId', requiredAuthentication, CarsController.deleteGallery);

router.get('/admin/Cars/addGallery/:id', requiredAuthentication, CarsController.addGallery);     
router.post('/admin/Cars/addGallery/:id',requiredAuthentication,  CarsController.addGallery); 

///general settings
router.get('/admin/Settings/view', requiredAuthentication, SettingsController.view);     
router.post('/admin/Settings/view', requiredAuthentication, SettingsController.view);     


router.post('/subscribe', MessagesController.sendMessage);
router.post('/send-reply', MessagesController.sendReply);


/** langind page */
// router.get('/home', GeneralController.landing);

module.exports = router;        
 

function requiredAuthentication(req, res, next) { 
    if(req.session){
        LoginUser = req.session.LoginUser; 
        if(LoginUser){    
            next();   
        }else{
            res.redirect(nodeAdminUrl+'/login');       
        } 
    }else{
        res.redirect(nodeAdminUrl+'/login');       
    }
}

async function requiredAccessCode(req, res, next) { 
    const authHeader = req.headers.authorization;
    const authCode = authHeader ? authHeader.split(' ')[1] : null;
    // console.log('Authorization Code:', authCode);
    let validator = await db.usersToken.findOne({
        where: {
          value: authCode
        }
      });
    if(validator){
        try{
            const decodedToken = jwt.verify(authCode, validator.secret);
            console.log(decodedToken);
            next();
        }catch(error){
            return res.status(401).json({
                success: false,
                error: true,
                message: error.message,
                data: null}) ;
        }
    }else{
        return res.status(401).json({
            success: false,
            error: true,
            message: 'Unauthorized access!',
            data: null}) ;
    }
        
        
}


