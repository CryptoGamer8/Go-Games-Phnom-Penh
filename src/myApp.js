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
const activeUsers = {};	// "userName":"color"
const viewers = {}; // "userName":"color"

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

/* single unit format:
	"100x+y":{
		"id":
		"color":'"white",
		"delFlag":"false"
		}
}*/
var existPiece = {};

var pieceID = 0;
var moveUser = 0; // 0->black moveable; 1 -> white moveable.

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
		// Assign a side to user, here size: 1->black, 2->white, 3+->viewer
		if(Object.keys(activeUsers).length==0) {
			user.color="black";
			activeUsers[user["userName"]] = user["color"];
		}
		else if(Object.keys(activeUsers).length==1) {
			for(var key in activeUsers){
				if(activeUsers[key]=="black"){
					user.color="white";
				}
				else{
					user.color="black";
				}
			}
			activeUsers[user["userName"]] = user["color"];
		}
		else{
			viewers[user["userName"]] = "viewer";
		}

		io.emit("new user",user); //emit user information
		//modify this
		io.emit("board status", existPiece); //emit board status 

		console.log("new user socket being called");
	});

	/*  receive mouse click position and user color from one client, determine whether it is a 
		valid click event. If true, add piece details to exsitPiece to maintain board status and 
		emit 'precise pos' to client.

		data : position of mouse click
	*/
	socket.on("place piece", (data) => {
		console.log('place piece socket being called');
		var x = Math.round((data["offsetX"] - board["XMargin"])/board["XSize"]);
		var y = Math.round((data["offsetY"] - board["YMargin"])/board["YSize"]);
		//modify this
		if (canPlacePiece(x,y,data["color"])){
			data = getArrayPos(data);
			addToExistPiece(data);
			data = getPrecisePos(data);
			io.emit("draw piece", data);
		}
	});

	/* receive mouse click position and user color from one client, determine whether it is a
	   valid delete event. If true, delete piece details in exsitPiece and emit 'precise pos' to
	   client.

	   data : position of mouse click
	*/
	socket.on("transfer deleted piece",(data)=>{
		//modify this
		if(data["delFlag"]==true){
			//tell if piece exist
			if(true){
				console.log('delete piece being called');
				var id = delExistPiece(data);
				if(id!=-1)
					io.emit("delete piece", id);
			}
		}
	});

	socket.on("user disconnect", (user) => {
		console.log("disconnect socket being called");
		console.log(user);
		if(user["color"]=="viewer"){
			delete viewers[user["userName"]];
		}
		else{
			delete activeUsers[user["userName"]];
		}
		console.log(activeUsers);
	});
});

/* get array position from [0,0] to [8,8], e.g. [1,1]
input data format: {
	"color":
	"delFlag":
	"offsetX":
	"offsetY":
	}
*/
const getArrayPos = (data) => {
	var x = Math.round((data["offsetX"] - board["XMargin"])/board["XSize"]);
	var y = Math.round((data["offsetY"] - board["YMargin"])/board["YSize"]);

	return {
		"id": pieceID++,
		"color": data["color"],
		"delFlag": data["delFlag"],
		"X": x,
		"Y": y
	}
}

/* add given piece to existPiece to maintain the board status
   data: format same to output of getArrayPos
*/
const addToExistPiece = (data) => {
	if(data["delFlag"]==false){
		var index = 100*data["X"]+data["Y"];
		existPiece[index] = {
			"color":data["color"],
			"delFlag":data["delFlag"],
			"id":data["id"]
		}
	}
}

/*	delete given piece in existPiece to maintain the board status. If delete successfully, 
	return id; else return -1.
	data: mouse click position
 */
const delExistPiece = (data) => {
	if(data["delFlag"]==true){
		var x = Math.round((data["offsetX"] - board["XMargin"])/board["XSize"]);
		var y = Math.round((data["offsetY"] - board["YMargin"])/board["YSize"]);
		var index = 100*x+y;
		console.log(existPiece);
		console.log(index);
		if(index in existPiece){
			var id = existPiece[index]["id"];
			delete existPiece[index];
			return id;
		}
		else return -1;
	}
}
/* get precise position from given data
	input data format: {
	"id":
	"color" :
	"delFlag" :
	"X" : 0-8
	"Y" : 0-8
}*/
const getPrecisePos = (data) => {
	return {
		"id": data["id"],
		"color": data["color"],
		"delFlag": data["delFlag"],
		"offsetX": data["X"]*board["XSize"] + board["XMargin"],
		"offsetY": data["Y"]*board["YSize"] + board["YMargin"]
	}
}

/* input data format:
	x,y: board index  0-8
*/
const canPlacePiece = (x,y,color) =>{
	var index = 100*x + y;
	if(pieceInBoard(x,y) && !(index in existPiece)){
		if(color=='black' && moveUser==0){
			moveUser = 1;
			return true;
		}
		else if(color=='white' && moveUser==1){
			moveUser = 0;
			return true;
		}
	}
	return false;
}

const pieceInBoard = (x,y) => {
	return x>=0 && x<boardSize && y>=0 && y<boardSize;
}
