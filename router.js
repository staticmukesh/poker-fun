let express = require('express');
let oauth = require('./oauth');
let config = require('./config');
let parser = require('./expenses');

let router = express.Router();

router.get('/me', function(req, res){
    let access_token = req.session.access_token;
    oauth.client.get(`${config.config.splitwise_basesite}/api/v3.0/get_current_user`, access_token, function(err, data){
        if (err) {
            return res.redirect(301, '/login');
        }

        let resp = JSON.parse(data);
        return res.send(`<h1>Welcome ${resp.user.first_name} ${resp.user.last_name} </h1>`);
    });
});

router.get('/api/expenses', function(req, res){
    let data = require('./expenses.json');
    let parser = require('./expenses');

    return res.render('index', {"data": parser(data)});
})

router.get('/', function(req, res){
    let access_token = req.session.access_token;
    oauth.client.get(`${config.config.splitwise_basesite}/api/v3.0/get_expenses?group_id=${config.config.poker_group_id}&limit=0`, access_token, function(err, data){
        if (err) {
            return res.redirect('/login');
        }

        return res.render('index', {"data": parser(JSON.parse(data))});
    });
})

router.get('/callback', function(req, res){
    oauth.client.getOAuthAccessToken(req.query.code,{
        'redirect_uri': config.config.splitwise_callback_url,
        'grant_type': 'authorization_code'
    }, function(err, access_token, refresh_token, results){
        if (err){
            return res.json(JSON.stringify(err)).status(500);
        } else if (results.error) {
            return res.json(JSON.stringify(results.error)).status(500);
        }

        req.session.access_token = access_token;
        req.session.save(function(err){
            if (err) {
                return res.status(500).send(err);
            } else {
                return res.redirect('/');
            }
        });
    });
});

router.get('/login', function(req, res){
    return res.render('login', {'oauth_url': oauth.auth_url});
});

router.get('/logout', function(req, res){
    delete req.session.access_token;
    req.session.save(function(err){
        if (err != null) {
            return res.status(500).send(err);
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;