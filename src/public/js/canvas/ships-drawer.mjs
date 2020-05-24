import handles from './ships-settings.mjs'
import { utils } from './utils.mjs'
import createMatrix from './create-matrix.mjs'

let ships_canvas = document.getElementById("ships-canvas");
let ships_context = ships_canvas.getContext("2d");

let ships_width = (ships_canvas.width = 1800);
let ships_height = (ships_canvas.height = window.innerHeight );

let matrix = createMatrix()
let offset = {};
let isDragging = false;
let dragHandle;

const X_MAX_BOUND = 490;
const Y_MAX_BOUND = 490;

const X_MIN_BOUND = 50;
const Y_MIN_BOUND = 50;

drawShips();

function drawShips() {
  ships_context.clearRect(0, 0, ships_width, ships_height);
  handles.map(handle => {
    if (isDragging && handle === dragHandle) {
      ships_context.shadowColor = "black";
      ships_context.shadowOffsetX = 4;
      ships_context.shadowOffsetY = 4;
      ships_context.shadowBlur = 8;
    }

    ships_context.fillStyle = "#000";
    ships_context.beginPath();
    ships_context.rect(handle.x, handle.y, handle.width, handle.height);
    ships_context.fill();
    ships_context.shadowColor = null;
    ships_context.shadowOffsetX = null;
    ships_context.shadowOffsetY = null;
    ships_context.shadowBlur = null;
  })
}

document.body.addEventListener("mousedown", function (event) {
  handles.map(handle => {
    if (utils.pointInRect(event.clientX, event.clientY, handle)) {
      isDragging = true;
      document.body.addEventListener("mousemove", onMouseMove);
      document.body.addEventListener("mouseup", onMouseUp);
      dragHandle = handle;
      offset.x = event.clientX - handle.x;
      offset.y = event.clientY - handle.y;
      drawShips();
    }
  })
});

function onMouseMove(event) {
  dragHandle.x = event.clientX - offset.x;
  dragHandle.y = event.clientY - offset.y;
  drawShips();
}

function onMouseUp(event) {
  if (
    utils.inRange(dragHandle.x + dragHandle.width, X_MIN_BOUND, X_MAX_BOUND) &&
    utils.inRange(dragHandle.y + dragHandle.height, Y_MIN_BOUND, Y_MAX_BOUND)
  ) {
    let closestPosition = getClosestPosition(dragHandle)
    console.log(closestPosition)
    if (dragHandle.x + dragHandle.width > 450)
      dragHandle.x = closestPosition.x - 40
    else
      dragHandle.x = closestPosition.x
    dragHandle.y = closestPosition.y
  } else { // handle out of bounds
    dragHandle.x = dragHandle.origin_x;
    dragHandle.y = dragHandle.origin_y;
  }

  isDragging = false;
  document.body.removeEventListener("mousemove", onMouseMove);
  document.body.removeEventListener("mouseup", onMouseUp);

  drawShips();
}

function getClosestPosition(point) {
  let distance;
  let lowestDistance = Number.MAX_VALUE
  let target = {}

  let k = -1, m = -1;

  for(let i = 0; i < matrix.length; i++) {
    for(let j = 0; j < matrix[i].length;j++){
      distance = utils.distanceXY(matrix[i][j].x, matrix[i][j].y, point.x, point.y)
      if(distance <= lowestDistance && !matrix[i][j].filled) {
        lowestDistance = distance
        target = matrix[i][j]
        k = i;
        m = j;
      }
    }
  }

  if(k >= 0 && m >= 0)
    matrix[k][m].filled = true

  return target
}
