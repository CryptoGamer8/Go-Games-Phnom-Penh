const http = require('http');
const config = require('./config.js').config
const fs = require('fs');
const ejs = require('ejs');
const qs = require('querystring');

const hostname = config.hostname;
const port = config.port;	//port大于1024随便定

const server = http.createServer((req,res) => {
	fs.readFile('./HTML/goBoard.html','utf-8',function(err,data){
		if(err){
			res.setHeader('Content-Type','text/plain');
			res.statusCode = 404;
			res.end('Not Found');
		}
		else{
			res.setHeader('Content-Type','text/html');
			res.statusCode = 200;
			res.end(data);
		}
	});
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
