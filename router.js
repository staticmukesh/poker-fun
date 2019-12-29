let express = require('express');
let oauth = require('./oauth');
let config = require('./config');
let parser = require('./expenses');
let chart = require('./chart');
let node_cache = require('node-cache');

let router = express.Router();
let cache = new node_cache({ stdTTL: 300 });

const ExpenseDataKey = 'expense_data_key';

router.get('/test', function(req, res){
    let data = require('./expenses.json');
    let parser = require('./expenses');

    return res.render('index', {"data": parser(data)});
})

router.get('/', function(req, res){
    let data = cache.get(ExpenseDataKey);
    if (data != undefined) {
        try {
            let parsedData = parser(JSON.parse(data));
            return res.render('index', {"data": parsedData});
        } catch(exception) {
            console.log(exception);
        }
    }

    let access_token = req.session.access_token;
    oauth.client.get(`${config.config.splitwise_basesite}/api/v3.0/get_expenses?group_id=${config.config.poker_group_id}&limit=0`, access_token, function(err, data){
        if (err) {
            return res.redirect('/login');
        }
        
        data = JSON.parse(data);
        cache.set(ExpenseDataKey, data);
        return res.render('index', {"data": parser(data)});
    });
});

router.get('/users/:user_id', function(req, res){
    let data = cache.get(ExpenseDataKey);
    if (data != undefined) {
        try {
            let parsedData = chart.prepareForUser(req.params.user_id, data)
            return res.render('user', {"data": parsedData});
        } catch(exception) {
            console.log(exception);
        }
    }

    let access_token = req.session.access_token;
    oauth.client.get(`${config.config.splitwise_basesite}/api/v3.0/get_expenses?group_id=${config.config.poker_group_id}&limit=0`, access_token, function(err, data){
        if (err) {
            return res.redirect('/login');
        }

        data = JSON.parse(data);
        cache.set(ExpenseDataKey, data);
        let parsedData = chart.prepareForUser(req.params.user_id, data)
        return res.render('user', {"data": parsedData});
    });
});

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