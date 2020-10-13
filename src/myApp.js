const http = require('http');
const config = require('./config.js').config
const fs = require('fs');
const ejs = require('ejs');
const qs = require('querystring');

const hostname = config.hostname;
const port = config.port;	//port大于1024随便定
var template = fs.readFileSync('./HTML/forum.ejs','utf-8');
var posts = [];

const server = http.createServer((req,res) => {

	console.log('req.url:' + req.url)
	fs.readFile('./HTML/flap.html','utf-8',function(err,data){
		if(err){
			res.setHeader('Content-Type','text/plain');
			res.statusCode = 404;
			res.end('Not Found');
			console.log(err)
		}
		else{
			res.setHeader('Content-Type','text/html');
			res.statusCode = 200;
			res.end(data);
			console.log('find flap.html successfully!');
		}
	})
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

function showForm(p_posts,res){
	var data = ejs.render(template,{
		title: 'hello ejs',
		posts: p_posts
	});
	res.setHeader('Content-Type','text/html');
	res.statusCode = 200;
	res.end(data);
}