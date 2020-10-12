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
	if(req.method === 'POST'){
		req.data = "";
		req.on("readable",function(){
			//表单数据收集
			var chr = req.read();
			if(chr)
				req.data += chr;
		});
		req.on("end",function(){
			//表单处理
			var query = qs.parse(req.data);
			posts.push(query.content);
			showForm(posts,res);
		})
	}
	else{
		showForm(posts,res);
	}
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

