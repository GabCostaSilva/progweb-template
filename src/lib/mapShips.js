let shipStruct = require('./ships')

let forbidden  = {
  type: 'forbidden'
};

let field = createField();

function createField(){
  let arr = new Array(10);

  for (let i = 0; i < 10; i++){
    arr[i] = new Array(10);
  }

  return arr;
}

function validatePosition(i, j, orientation, size){ // checks if the position is valid.
  let isValid = true;
  if(orientation){
    for(i; i < size && isValid; i++){
      if(field[i][j]!= undefined){
        isValid = false;
      }
    }
  }
  else{
    for(i; i < size && isValid; i++){
      if(field[j][i]!= undefined){
        isValid = false;
      }
    }
  }

  return isValid;
}

function setShipsPositions(){
  for(let ship of shipStruct){
    let x, y, orientation;
    do{
      x = random(0, 9 - ship.part.length);
      y = random(0, 9);
      orientation = random(0, 1); // horizontal if is 0, and vertical if is 1.
    }while(!validatePosition(x, y, orientation, ship.part.length + x));

    if(orientation){
      if(x > 0){
        field[x-1][y] = forbidden;
      }
      if(x+ship.part.length < 10){
        field[x + ship.part.length][y] = forbidden;
      }
      for(let i = 0; i < ship.part.length; i++){
        field[x+i][y] = ship.part[i];
        if(y > 0){
          field[x+i][y-1] = forbidden;
        }
        if(y < 9){
          field[x+i][y+1] = forbidden;
        }
      }
    }
    else{
      if(x > 0){
        field[y][x-1] = forbidden;
      }
      if(x+ship.part.length < 10){
        field[y][x + ship.part.length] = forbidden;
      }
      for(let i = 0; i < ship.part.length; i++){
        field[y][x+i] = ship.part[i];
        if(y > 0){
          field[y-1][x+i] = forbidden;
        }
        if(y < 9){
          field[y+1][x+i] = forbidden;
        }
      }
    }
  }
}

function random(min, max) {
  return Math.floor(Math.random() * (min + max + 1) - min);
}

exports.mapShips = function() {
  let shipsMap = []
  setShipsPositions()
  for(let i = 0; i < field.length; i++){
    for(let j = 0; j < field[i].length; j++){
      if(field[i][j] != undefined && field[i][j] !== forbidden){
        shipsMap.push([i, j].join(''))
      }
    }
  }

  return shipsMap
}
