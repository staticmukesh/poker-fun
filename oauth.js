let oauth = require('oauth');
let config = require('./config');

const client = new oauth.OAuth2(
    config.config.splitwise_client_id,
    config.config.splitwise_client_secret,
    config.config.splitwise_basesite,
    config.config.splitwise_authorize_url,
    config.config.splitwise_token_url,
    null
);

const auth_url = client.getAuthorizeUrl({
    redirect_uri: config.config.splitwise_callback_url,
    response_type: 'code'
});

module.exports = {
    client: client,
    auth_url: auth_url,
}