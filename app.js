let express = require('express');
let session = require('express-session');
let FileStore = require('session-file-store')(session);

let config = require('./config');
let router = require('./router');

let app = express();

app.use(session({
    store: new FileStore,
    secret:  config.config.session_secret,
    resave: true,
    saveUninitialized: true
}));

app.use('/', router);

app.listen(config.config.port, function(){
    console.log(`Successfully started the server at ${config.config.port}`);
});