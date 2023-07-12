var https = require('https');
var fs = require('fs');

var app = require('./app');

// SSL
var privateKey = fs.readFileSync('ssl/privkey.pem');
var certificate = fs.readFileSync('ssl/fullchain.pem');

var options = {
  key: privateKey,
  cert: certificate
};

console.log('Spinning up server...');
https.createServer(options, app).listen(5500);
