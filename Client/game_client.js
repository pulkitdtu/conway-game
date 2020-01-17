
console.log('client started');
var context = document.getElementById("game_canvas").getContext("2d");
window.controller.init();
//setTimeout(function(){connect()}, 5000); //connect();
function connect()
{
var uri = "ws://127.0.0.1:10000";
if(window.webSocketAddress) 
  uri = window.webSocketAddress + ":" + String( window.port);
if(location.origin.includes("http"))
  uri = location.origin.replace(/^http/, 'ws');

console.log("uri : " + uri);
 
var socket = new WebSocket(uri);
socket.onopen = function (e) {
  console.log('socket.onopen called.');
  window.controller.startConnection(socket);
};
socket.onmessage = function (e) {
  window.controller.receive(e);
};
socket.onclose = function (e) {
  console.log('socket closed');
  draw();
  //setTimeout(function(){connect()}, 5000);
 };
socket.onerror = function (e) {
  console.log('socket error');
  socket.onclose(e);
 };
}

//document.getElementById("game_canvas2").addEventListener("mousedown", getPosition, false);
document.getElementById("game_canvas2").addEventListener("pointerdown" , getPosition, false);
function getPosition(event) {
  var x = new Number();
  var y = new Number();
  var canvas = document.getElementById("game_canvas");
  if (event.x != undefined && event.y != undefined) {
    x = event.x;
    y = event.y;
  }
  else // Firefox method to get the position
  {
    x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  x -= canvas.parentElement.offsetLeft + canvas.offsetLeft - document.body.scrollLeft;
  y -= canvas.parentElement.offsetTop + canvas.offsetTop - document.body.scrollTop ;
  window.controller.sendUpdate(x,y);
}


document.getElementById("clear").addEventListener("click", window.controller.clear);

document.getElementById("patternButton").addEventListener("click", window.controller.submitPattern);

document.getElementById("grid").addEventListener("click", window.controller.gridCheck);
document.getElementById("grid").click();

draw();
var uri = null;
function draw()
{
  if(uri)// uri is used as alock here. If it is filled then function is already in process.
    return;
uri = "ws://127.0.0.1:10000";
if(window.webSocketAddress) 
  uri = window.webSocketAddress + ":" + String( window.port);
if(location.origin.includes("http"))
  uri = location.origin.replace(/^http/, 'ws');
var ctx = document.getElementById("game_canvas2").getContext("2d"),
    dashLen = 220, dashOffset = dashLen, speed = 15,
    txt = "CONNECTING to server at - "+ uri +" ...", x = 30;
ctx.i = 0, ctx.lineNumber = 1;
ctx.save();
document.getElementById("grid").disabled = true;
ctx.font = "50px Comic Sans MS, cursive, TSCu_Comic, sans-serif"; 
ctx.lineWidth = 5; ctx.lineJoin = "round"; ctx.globalAlpha = 2/3;
ctx.strokeStyle = ctx.fillStyle = "#1f2f90";
loop();
//(
  function loop() {
  //ctx.clearRect(x, 0, 60, 150);
  ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]); // create a long dash mask
  dashOffset -= speed;                                   // reduce dash length
  ctx.strokeText(txt[ctx.i], x, ctx.lineNumber * 90);                               // stroke letter

  if (dashOffset > 0) requestAnimationFrame(loop);             // animate
  else {
    if(txt[ctx.i] == '-') ctx.lineNumber = 2, x =0;
    ctx.fillText(txt[ctx.i], x, ctx.linesNumber * 90);                               // fill final letter
    dashOffset = dashLen;                                      // prep next char
    x += ctx.measureText(txt[ctx.i++]).width + ctx.lineWidth * Math.random();
    ctx.setTransform(1, 0, 0, 1, 0, 3 * Math.random());        // random y-delta
    ctx.rotate(Math.random() * 0.005);                         // random rotation
    if (ctx.i < txt.length) requestAnimationFrame(loop);
    else 
    {
      ctx.restore();
      setTimeout(()=>{
        document.getElementById("grid").click();
        setTimeout(()=>{
            document.getElementById("grid").click();}, 1000);uri = null}, 
      1000);
      
      connect();// connect at the end of draw.
      document.getElementById("grid").disabled = false;
    }
  }
}
}
//)();


//document.getElementById("grid").textContent = "Uncheck to Disable grid";

// var color = [255,100,200];
//   game_canvas.updateIndicesPlusGrid(3,3, color);
//   game_canvas.updateIndicesPlusGrid(3,4, color);
//   game_canvas.updateIndicesPlusGrid(3,5, color);
//   game_canvas.updateIndicesPlusGrid(2,5, color);game_canvas.updateIndicesPlusGrid(1,4, color);
//   window.grid.partialHash();
//socket.hello = function (e) { };
//socket.send('hello');

// game_canvas.updateFromOffsetPositions(10 * 10, 10 * 10, "#00002");
// game_canvas.updateFromOffsetPositions(10 * 10, 11 * 10, "#00002");
// game_canvas.updateFromOffsetPositions(10 * 10, 12 * 10, "#00002");
// game_canvas.updateFromOffsetPositions(9 * 10, 12 * 10, "#00002");
// game_canvas.updateFromOffsetPositions(8 * 10, 11 * 10, "#00002");

//game_canvas.updateFromOffsetPositions(10 * 10, 40 * 10, "#00002");
//game_canvas.updateFromOffsetPositions(11 * 10, 40 * 10, "#00002");
//game_canvas.updateFromOffsetPositions(12 * 10, 40 * 10, "#00002");

// game_canvas.updateFromOffsetPositions(13 * 10, 40 * 10, "#00002");
// game_canvas.updateFromOffsetPositions(14 * 10, 40 * 10, "#00002");
// game_canvas.updateFromOffsetPositions(15 * 10, 40 * 10, "#00002");
// game_canvas.updateFromOffsetPositions(16 * 10, 40 * 10, "#00002");
// game_canvas.updateFromOffsetPositions(17 * 10, 40 * 10, "#00002");
// game_canvas.updateFromOffsetPositions(18 * 10, 40 * 10, "#00002");
// game_canvas.updateFromOffsetPositions(19 * 10, 40 * 10, "#00002");





//var timerExecutor = setInterval(timerFunction, 2);

//function timerFunction() {
  //lock
  //game_canvas.step();
  //console.log('timer ticked');
  //
  //for(var i =0;i <40; i++ )
    //window.controller.sendUpdate(10 + 10 *i, 10 +  10 *i);
//}
//WebSocket s =
// let socket = net.createConnection({ port: 8000, host: 'localhost' });
// socket.on('connect', () => {
//   let networker = new Networker(socket, (data) => {
//     console.log('received:', data.toString());
//   });
//   networker.init();
//   networker.send('Hi Server!');
// });
// D:\Client\node_modules\.bin>browserify ../../game_client.js -o ../../game_clientConverted.js

  //console.log('blob message from server', e.data);
  //console.log('message form server', e.srcElement.result);

  // var reader = new FileReader();
  // reader.onload = function (e1) {
  //   let a = new Uint8Array(e1.srcElement.result);
  //   console.log(a);
  // }
  // reader.readAsArrayBuffer(e.data);
  //window.controller.receive(e);
  // if(e.data.type == '')
  // reader.readAsText(e.data);
  // socket.send(' you send a message');

  //import a from "./networker";
//var net = require('net');
//var has = require('isarray');

//var networker = require('./networker');



// var uri = "ws://127.0.0.1:10000";
// if(window.webSocketAddress) 
//   uri = window.webSocketAddress + ":" + String( window.port);
// if(location.origin.includes("http"))
//   uri = location.origin.replace(/^http/, 'ws');
// var ctx = document.getElementById("game_canvas2").getContext("2d"),
//     dashLen = 220, dashOffset = dashLen, speed = 15,
//     txt = "CONNECTING to server at - "+ uri +" ...", x = 30;
// ctx.i = 0, ctx.lineNumber = 1;
// ctx.save();
// ctx.font = "50px Comic Sans MS, cursive, TSCu_Comic, sans-serif"; 
// ctx.lineWidth = 5; ctx.lineJoin = "round"; ctx.globalAlpha = 2/3;
// ctx.strokeStyle = ctx.fillStyle = "#1f2f90";
// loop();
// //(
//   function loop() {
//   //ctx.clearRect(x, 0, 60, 150);
//   ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]); // create a long dash mask
//   dashOffset -= speed;                                   // reduce dash length
//   ctx.strokeText(txt[ctx.i], x, ctx.lineNumber * 90);                               // stroke letter

//   if (dashOffset > 0) requestAnimationFrame(loop);             // animate
//   else {
//     if(txt[ctx.i] == '-') ctx.lineNumber = 2, x =0;
//     ctx.fillText(txt[ctx.i], x, ctx.linesNumber * 90);                               // fill final letter
//     dashOffset = dashLen;                                      // prep next char
//     x += ctx.measureText(txt[ctx.i++]).width + ctx.lineWidth * Math.random();
//     ctx.setTransform(1, 0, 0, 1, 0, 3 * Math.random());        // random y-delta
//     ctx.rotate(Math.random() * 0.005);                         // random rotation
//     if (ctx.i < txt.length) requestAnimationFrame(loop);
//     else 
//     {
//       ctx.restore();
//       setTimeout(()=>{
//         document.getElementById("grid").click();
//         setTimeout(()=>{
//             document.getElementById("grid").click();}, 4000);}, 
//       4000);
//       connect();
//     }
//   }
// }
// //)();