const socket = io();

const gridSize = 76; //side length of board grid in px
const XMargin = 45; //coordinate of top left corner of gameboard
const YMargin = 45;
const boardSize = 9;

var goboard = document.getElementById("goboard");

var user = {
   
};

var deleteFlag = false;

// modify this later. read from .css
var chessPiecesRadius = -5;
var pieceID = 0;

/*  all data unit format in this js
    {
    "color":
    "delFlag":
    "offsetX":
    "offsetY":
    }
*/


const placePiece = (data) => {
    console.log("placePiece being called");
    if(data["color"]=='white' || data["color"]=='black'){
        var piece = document.createElement("div");
        piece.innerHTML = `<div class="${data["color"]}ChessPiece" type = "chessPiece" id = "${data["id"]}"
             style="position:absolute; top:${data["offsetY"]+chessPiecesRadius}px; left:${data["offsetX"]+chessPiecesRadius}px" >
        </div>`;
        goboard.appendChild(piece);
        console.log(piece);
    }
}

const deletePiece = (id) => {
    if(true){
        console.log(id);
        var elem = document.getElementById(id);
        elem.remove();   
    }
}

// change delete flag
const deleteOn = () => {
    console.log("delete flag has been changed!");
    deleteFlag = !deleteFlag;
    if(deleteFlag == true)
        alert('You can delete any chess piece now');
    else{
        alert('You can place piece now');
    }
}

const boardClick = (data) => {
    if(!deleteFlag){
        socket.emit("place piece", {
            "color": user["color"], 
            "delFlag": deleteFlag,
            "offsetX": data.pageX - 25,
            "offsetY": data.pageY -25
        });
    }else{  
        socket.emit("transfer deleted piece",{
            "color": user["color"], 
            "delFlag": deleteFlag,
            "offsetX": data.pageX - 25,   //minus position of board image, be careful!
            "offsetY": data.pageY - 25
        });
    }
    
}

const gameStart = () => {
    socket.emit("boarder config",{
        "XSize":gridSize,
        "YSize":gridSize,
        "XMargin":XMargin,
        "YMargin":YMargin
    });
    
    socket.emit("new visitor", `User${Math.floor(Math.random() * 1000000)}`);

    socket.on("new user", function (data) {
        console.log("new user being called");
        if(!Object.keys(user).length==0){
            return;
        }
        user = data;
        alert("You are "+user["color"]+".");
        goboard.addEventListener("click", boardClick);
    });

//modify this with more precise position
    socket.on("board status", function(existPiece){
        console.log("board status being called");
        for(var key in existPiece){
            var x = Math.round(key/100);
            var y = Math.round(key%100);
            var data = {
                "color": existPiece[key]["color"],
                "id": existPiece[key]["id"],
                "offsetY":y*gridSize+YMargin,
                "offsetX":x*gridSize+XMargin
            };
            placePiece(data);
        }
    });

    socket.on("draw piece", function(data){
        console.log("draw piece being called");
        placePiece(data);
    });

    socket.on("delete piece", function(data){
        console.log("delete piece being called");
        deletePiece(data);
    });

    window.onbeforeunload = function(){
        socket.emit("user disconnect",user);
    }


};

//Game starts here
gameStart();