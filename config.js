let fs = require('fs');
let env = process.env.ENV;

if (env == undefined || env.length == 0) {
    env = 'dev';
} else {
    env = env.toLocaleLowerCase();
}

let config = JSON.parse(fs.readFileSync(`./config-${env}.json`));

module.exports = {
    'config': config
}