const express = require('express');
global.app = express(); 
global.moment = require('moment');
const expressValidator = require('express-validator');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');  
const flash = require('express-flash-messages');
const database = require("./config/mongodb_config");

// Required middleware
app.use(expressValidator());
app.use(cors()); 
app.use(fileUpload()); 
  
// Global Constants
global.nodeSiteUrl = 'https://fbexpo.onrender.com'; // Node server URL  
global.nodeAdminUrl = 'https://fbexpo.onrender.com/admin'; // Admin URL  
global.sk = "77777777777777"; // Secret key
global.gloBaseUrl = "";
global.siteTitle = 'FBExpo Admin';
global.successStatus = 200;
global.failStatus = 401; 
global.SessionExpireStatus = 500;  
global.CURRENCY = 'NGN';   

// View engine setup (EJS)
app.set('view engine', 'ejs');
const path = require('path');
app.set('views', path.join(__dirname, 'views'));  
app.use(express.static(__dirname + '/public'));  
app.use(flash());

// Session & Cookie setup
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
app.use(cookieParser()); 
app.use(expressSession({
    secret: 'D%$*&^lk32',
    resave: false,
    saveUninitialized: true
}));  

// Middleware for JSON & URL-encoded data
app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
});   
app.use(bodyParser.json());  
app.use(express.urlencoded({ limit: '100mb', extended: true })); 

// Routes
app.get('/', (req, res) => {    
    res.redirect('/welcome');
});

const apiRouter = require('./routes/api');
const webRouter = require('./routes/web');
app.use('/', webRouter); 
app.use('/api', apiRouter); 

// 404 Handler
app.use((req, res) => {
    res.redirect('/404');
});

/**
 * Start the server after connecting to the database
 */
async function startServer() {
    try {
        console.log("[Init]: Connecting to database...");
        await database.initialize();
        
        const server = app.listen(8083, () => { 
            console.log(`Server running on http://localhost:${server.address().port}`);
        });
    } catch (error) {
        console.error("[ERROR] Failed to start server:", error);
        process.exit(1);
    }
}

// Start the application
startServer();

// Global error handler
process.on('uncaughtException', (err) => { 
    console.error('Uncaught Exception:', err);
});
