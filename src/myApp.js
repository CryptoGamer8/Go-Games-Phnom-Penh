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
const boardSize = 9;

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
};

var user = {
	"userName":"root",
	"color":"viewer"
}

var existPiece = createPieceRocords();

io.on("connection", function(socket) {
	console.log("Socket connection was created");

	socket.on("boarder config", function(data){
		board["XSize"] = data["XSize"];
		board["YSize"] = data["YSize"];
		board["XMargin"] = data["XMargin"];
		board["YMargin"] = data["YMargin"];
	});

	socket.on("new visitor", function (_userName) {
		userName = _userName;
		socket.userId = userName;
		user = {
			"userName":userName,
			"color": "viewer"
			};
		if(activeUsers.size==0) {
			user.color="black";
		}
		else if(activeUsers.size==1) {
			user.color="white";
		}
		// Assign a side to user, here size: 1->black, 2->white, 3+->viewer
		activeUsers.add(user);

		io.emit("new user",user); //emit user information
		io.emit("board status", existPiece);
		
		console.log("new user socket being called");
	});

	socket.on("place piece", (data) => {
		//modify this
		console.log(data);
		if (true){
			data = getPrecisePos(data);
			io.emit("draw piece", data);
			console.log('place piece socket being called');
			console.log(existPiece);
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
	
	if(0 <=x< boardSize && 0<=y<boardSize){
		if(data["color"]=='black'){
			existPiece[x][y] = 1;
		}
		else if(data["color"]=='white'){
			existPiece[x][y] = 2;
		}
		else{
			existPiece[x][y] = 0;
		}
	}
	return {
		"color": data["color"],
		"offsetX": x*board["XSize"] + board["XMargin"],
		"offsetY": y*board["YSize"] + board["YMargin"]
	}
}

function createPieceRocords() {
	var arr = new Array(boardSize);
	for(var i = 0;i<boardSize;i++){
		arr[i] = new Array(boardSize);
	}
	return arr;
}

//pieceData: [x,y,color] color: 1-> black, 0->white.
const drawBoard = (pieceData) => {

} 