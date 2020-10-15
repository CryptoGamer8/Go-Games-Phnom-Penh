const socket = io();

const gridSize = 76; //side length of board grid in px
const XMargin = 45; //coordinate of top left corner of gameboard
const YMargin = 45;
const activePlayers = [`black`, `white`];

var goboard = document.getElementById("goboard");
var player = `Viewer`;
var userName;

const placePiece = (color, top, left) => {
    const piece = `<div class="${color}ChessPiece"
         style="position:absolute; top:${top+gridSize/2}px; left:${left+gridSize/2}px" >
    </div>`;
    goboard.innerHTML += piece;
}

const boardClick = (data) => {
    socket.emit("place piece", {
        "player": player, 
        "offsetX": data.offsetX,
        "offsetY": data.offsetY 
    });

    //test code here
    // socket.emit("test boardClick",{
    //     "offsetX": data.offsetX,
    //     "offsetY": data.offsetY
    // })
    // console.log(data.offsetX, data.offsetY)
}

const gameStart = (user) => {
    userName = user || `User${Math.floor(Math.random() * 1000000)}`;
    

    socket.emit("boarder config",{
        "XSize":gridSize,
        "YSize":gridSize,
        "XMargin":XMargin,
        "YMargin":YMargin
    })
    socket.emit("new user", userName);
    socket.on("new user", function (data) {

    });

    //assign side and add onclick listener
    socket.on("assign side", function(data){
        if (data["userID"] != userName){
            return
        }
        if (data["userNum"] < 3) {
            player = activePlayers[data["userNum"]-1];
            goboard.addEventListener("click", boardClick);
        }
    });

    socket.on("place piece", function(data){
        placePiece(data["player"], data["offsetY"], data["offsetX"])
    })

    socket.on("user disconnected", function (userName) {
        console.log(`User ${userName} Disconnected`)
    });
};

//Game starts here
gameStart();