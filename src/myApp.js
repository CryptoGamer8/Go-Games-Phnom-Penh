const express = require("express");
const socket = require("socket.io");
const config = require("./config.js").config;

// App setup
const PORT = config.port;
const publicPath = config.publicPath;
const app = express();
const server = app.listen(PORT, function () {
	console.log(`Listening on http://localhost:${PORT}`);
});

// Static files
app.use(express.static(publicPath));

// Socket setup
const io = socket(server);
const activeUsers = new Set();
var board = {
	"XSize": 0,		//x grid size
	"YSize": 0,		//y grid size
	"XMargin": 0,	//x top left of chess grid
	"YMargin": 0   //y top left of chess grid
}

io.on("connection", function(socket) {
	console.log("Socket connection was created");
	socket.on("boarder config", function(data){
		board["XSize"] = data["XSize"];
		board["YSize"] = data["YSize"];
		board["XMargin"] = data["XMargin"];
		board["YMargin"] = data["YMargin"];
	});

	socket.on("new user", function (data) {
		socket.userId = data;
		activeUsers.add(data);
		// Assign a side to user, here size: 1->black, 2->white, 3+->viewer
		io.emit("assign side", {
			"userNum":activeUsers.size, 
			"userID":socket.userId
		});
		console.log("new user socket being called");
	});

	socket.on("place piece", (data) => {
		//modify this
		if (true){
			io.emit("place piece", getPrecisePos(data));
			console.log('place piece socket being called');
		}
	});

	socket.on("disconnect", () => {
		activeUsers.delete(socket.userId);
		io.emit("user disconnected", socket.userId);
		console.log("disconnect socket being called");
	});

	//test code here
	// socket.on("test boardClick",(data) => {
	// 	console.log(data["offsetX"]);
	// 	console.log(data["offsetY"]);
	// });
});

const getPrecisePos = (data) => {
	if(Object.keys(data).length!=3){
		console.log("getPrecisePos data format is wrong");
		return;
	}
	var x = Math.round((data["offsetX"] - board["XMargin"])/board["XSize"]);
	var y = Math.round((data["offsetY"] - board["YMargin"])/board["YSize"]);
	return {
		"player": data["player"],
		"offsetX": x*board["XSize"] + board["XMargin"],
		"offsetY": y*board["YSize"] + board["YMargin"]
	}
}