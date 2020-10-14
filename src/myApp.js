//main server
const http = require('http');
const config = require('./config.js').config
const fs = require('fs');
const ejs = require('ejs');
const qs = require('querystring');
var app = express();

const hostname = config.hostname;
const port = config.port;	//port大于1024随便定

const server = http.createServer(app);
app.get('/',function(req,res){
	console.log('GET /');
	res.render('index.html');

});

server.listen(3000);