var express = require('express');
var router = express.Router(); 
var GeneralController    =  require('../controllers/general/GeneralController');   
var AdminController    =  require('../controllers/admin/AdminController');   
var UserController = require("../controllers/admin/UsersController");
var jwt = require('jsonwebtoken');

router.get('/welcome', GeneralController.landing);
router.get('/register', GeneralController.register);
router.post('/register', GeneralController.register);
router.get('/registration-success', GeneralController.registerSuccess);
router.get('/login', GeneralController.landing);

/** Routes for admin  */     
router.post('/admin/login', AdminController.login);     
router.get('/admin/login', AdminController.login);     
router.get('/admin/Dashboard', requiredAuthentication, AdminController.dashboard);  
router.get('/admin/logout', AdminController.logout);         

router.get('/admin/Users/players',requiredAuthentication, UserController.players_list);     


router.get('/404', GeneralController.page404);


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