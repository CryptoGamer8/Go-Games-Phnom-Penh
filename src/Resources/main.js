const socket = io();

const gridSize = 76; //side length of board grid in px
const XMargin = 45; //coordinate of top left corner of gameboard
const YMargin = 45;
const boardSize = 9;

var goboard = document.getElementById("goboard");

var user = {

};

// modify this later. read from .css
var chessPiecesRadius = -5;

const placePiece = (color, x, y) => {
    const piece = `<div class="${color}ChessPiece"
         style="position:absolute; left:${x}px; top:${y}px" >
    </div>`;
    goboard.innerHTML += piece;
}

const boardClick = (data) => {
    socket.emit("place piece", {
        "color": user["color"],
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

const gameStart = () => {
    socket.emit("boarder config",{
        "XSize":gridSize,
        "YSize":gridSize,
        "XMargin":XMargin,
        "YMargin":YMargin
    });

    socket.emit("new visitor", `User${Math.floor(Math.random() * 1000000)}`);

    socket.on("new user", function (data) {
        if(!Object.keys(user).length==0){
            return;
        }
        user = data;
        goboard.addEventListener("click", boardClick);
    });

    socket.on("board status", function(existPiece){
        for(var i = 0;i<boardSize;i++){
            for(var j=0;j<boardSize;j++){
                if(existPiece[i][j]==1)
                    placePiece('black',i,j);
                else if(existPiece[i][j]==2)
                    placePiece('white',i,j);
            }
        }
    });

    socket.on("place piece", function(data){
        placePiece(data["player"], data["offsetX"], data["offsetY"])
    })

    socket.on("user disconnected", function (userName) {
        console.log(`User ${userName} Disconnected`)
    });
};

//Game starts here
gameStart();