const socket = io();

var goboard = document.getElementById("goboard");
var player = `Viewer`;
var userName;

const activePlayers = [`black`, `white`]
const placePiece = (color, top, left) => {
    const piece = `<div class="${color}ChessPiece"
         style="position:absolute; top:${top}px; left:${left}px" >
    </div>`;
    goboard.innerHTML += piece;
}
const gridSide = 76 //side length of board grid in px
const topLeft = [45, 45] //coordinate of top left corner of gameboard, in X, Y
const boardClick = (data) => {
    socket.emit("place piece", [player, data.offsetY, data.offsetX])
    console.log(data.offsetX, data.offsetY)
}
const newUserConnected = (user) => {
    userName = user || `User${Math.floor(Math.random() * 1000000)}`;
    socket.emit("new user", userName);
};
socket.on("new user", function (data) {

});
socket.on("assign side", function(data){
    if (data[1] != userName){
        return
    }

    if (data[0] < 3) {
        player = activePlayers[data[0]-1];
        goboard.addEventListener("click", boardClick);
    }
})
socket.on("place piece", function(data){
    placePiece(data[0], data[1], data[2])
})

socket.on("user disconnected", function (userName) {
    console.log(`User ${userName} Disconnected`)
});

//Game starts here
newUserConnected();


