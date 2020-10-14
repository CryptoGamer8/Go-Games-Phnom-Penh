// const http = require('http');
// const config = require('./config.js').config
// const fs = require('fs');
// const ejs = require('ejs');
// const qs = require('querystring');
//
// const hostname = config.hostname;
// const port = config.port;	//port大于1024随便定
//
// const server = http.createServer((req,res) => {
// 	fs.readFile('./HTML/index.html','utf-8',function(err,data){
// 		if(err){
// 			res.setHeader('Content-Type','text/plain');
// 			res.statusCode = 404;
// 			res.end('Not Found');
// 		}
// 		else{
// 			res.setHeader('Content-Type','text/html');
// 			res.statusCode = 200;
// 			res.end(data);
// 		}
// 	});
// });
//
// server.listen(port, hostname, () => {
// 	console.log(`Server running at http://${hostname}:${port}/`);
// });
const express = require("express");
const socket = require("socket.io");
const config = require("./config.js").config;

// App setup
const PORT = config.port;
const app = express();
const server = app.listen(PORT, function () {
	console.log(`Listening on port ${PORT}`);
	console.log(`http://localhost:${PORT}`);
});

// Static files
app.use(express.static("Resources"));

// Socket setup
const io = socket(server);

const activeUsers = new Set();

io.on("connection", function (socket) {
	console.log("Made socket connection");

	socket.on("new user", function (data) {
		socket.userId = data;
		activeUsers.add(data);
		// Assign a side to user, here size: 1->black, 2->white, 3+->viewer
		io.emit("assign side", [activeUsers.size, socket.userId]);
	});

	socket.on("place piece", function (data){
		//modify this
		if (true){
			io.emit("place piece", data)
		}
	})

	socket.on("disconnect", () => {
		activeUsers.delete(socket.userId);
		io.emit("user disconnected", socket.userId);
	});
});

server.listen(3000);