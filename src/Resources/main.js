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

const placePiece = (color, top, left) => {
    if(color=='white' || color=='black'){
        const piece = `<div class="${color}ChessPiece"
             style="position:absolute; top:${top+chessPiecesRadius}px; left:${left+chessPiecesRadius}px" >
        </div>`;
        goboard.innerHTML += piece;
    }
}

const boardClick = (data) => {
    socket.emit("place piece", {
        "color": user["color"], 
        "offsetX": data.offsetX,
        "offsetY": data.offsetY 
    });
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

    //delete test
    

    socket.on("draw piece", function(data){
        placePiece(data["color"], data["offsetY"], data["offsetX"])
    })

    socket.on("user disconnected", function (userName) {
        console.log(`User ${userName} Disconnected`)
    });
};

//Game starts here
gameStart();