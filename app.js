let express = require('express');
let session = require('express-session');
let FileStore = require('session-file-store')(session);

let config = require('./config');
let router = require('./router');

let app = express();

// template engine
app.set('views', './public/views');
app.set('view engine', 'pug');

// static files
app.use(express.static('public'));

app.use(session({
    store: new FileStore,
    secret:  config.config.session_secret,
    resave: true,
    saveUninitialized: true
}));

// block unauthenticated requests
app.use(function(req, res, next){
    let whitelisted_urls = ['/login', '/logout'];
    if (whitelisted_urls.filter(url => req.url == url)) {
        return next();
    }
    
    let access_token = req.session.access_token;
    if (!access_token) {
        return res.redirect('/login');
    } 
    return next();
});

app.use('/', router);

app.listen(config.config.port, function(){
    console.log(`Successfully started the server at ${config.config.port}`);
});