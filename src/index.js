require("dotenv").config();
const path = require("path");
const express = require("express");
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const cors = require('cors')
const {mapShips} = require('./game/mapShips');
const {struct} = require('./game/mapShips');

const shipsMap = mapShips()
const shipStruct = struct();
const destroyed = [];

const PORT = process.env.PORT || "8080";

let score = 0;

app.use(cors())
app.use(express.static(path.join(__dirname, "/public/")));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(express.static(path.join(__dirname, 'public')))

app.get("/", (req, res) => {
  res.render("index", { title: "Batalha Naval" });
});

app.get("/game", (req, res) => {
  res.render("game-screen", { score: score });
});

function shot(id){
  let wasHit = false;
  let i = (id/10)|0;
  let j = id % 10;
  if(shipsMap[i][j] != undefined){
    wasHit = true;
    shipsMap[i][j].status = 'destroyed';
  }
  return wasHit;
}

function sink(ship){
  for(let i = 0; i < ship.length; i++){
    io.emit('sink', ship[i].position);
  }
}

function destroyed(ship){
  isDestroyed = true;
  for(let i = 0; i < ship.length; i++){
    if(ship[i].status == 'ok'){
      isDestroyed = false;
    }
  }
  return isDestroyed;
}

function verifyShips(){
  for(let i = 0; i < shipStruct.length; i++){
    let ship = shipStruct[i];
    if(destroyed(ship)){
      sink(ship);
      shipStruct.splice(i, 1);
    }
  }
}

/* Socket */
io.on('connection', (socket) => {
  socket.on('click', (id) => {
    if(shot(id)) {
      score++
      io.emit('hit', id, score);
      verifyShips();
    } else {
      io.emit('miss', id);
    }
    if(shipStruct.length == 0){
      score = 0;
      io.emit('won');
      setTimeout(function(){
        process.exit(0)
      }, 100);
    }
  });
});


http.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`)
})
