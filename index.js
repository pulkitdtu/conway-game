'use strict';
const controller = require('./controller.js');
const webSocketsServerPort = process.env.PORT || 10000;
console.log('request starting...: '+ webSocketsServerPort);
const game      = require('./game.js');

controller.init();


var webSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
var path = require('path');


var server = http.createServer(function (request, response) {
    //console.log('request starting...');
    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';
    filePath = '/Client'+filePath.slice(1,filePath.length);// removing the . at the first place of filePath.
    console.log('request starting...: '+ filePath);
    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }
    
    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

})



//var server = http.createServer(function(request, response) {response.writeen });
server.listen(webSocketsServerPort, function() {console.log((new Date()) + " Server is listening on port "+ webSocketsServerPort);});
//var wsServer = new webSocketServer({ httpServer: server});
//wsServer.on('request', function(request) {
//    controller.addClient(request);//var connection = request.accept();connection.close();
//});




//for (var i=0; i < clients.size; i++) {console.log('send message to'+clients[i].remoteAddress);clients[i].sendUTF("message");}

// game.init();
// game.testConsole();
// //game.update(1, 1, "#000001");
// //game.update(2, 1, "#000001");
// //game.update(1, 2, "#000001");
//   var color = [255,100,200];
//   game.update(3,3, color);
//   game.update(3,4, color);
//   game.update(3,5, color);
//   game.update(2,5, color);game.update(1,4, color);
  
  var partialHashBuff = game.partialHash();
  var buff =  game.fullHash();
  controller.sendFullHash();
  var debug;
// game.testConsole();
// //game.step();
// game.step2();
// game.testConsole();
// //game.step();
// for(var i=1;i<10;i++)
//   game.step2();
// game.testConsole();
// console.time();
// for(var i=1;i<10;i++)
//     game.step2();
// console.timeEnd();
// game.testConsole();
// console.time();
// game.step2();
// console.timeEnd();
// game.testConsole();
// console.time();
// game.step2();
// console.timeEnd();
// game.testConsole();
// console.time();
// game.step2();
// console.timeEnd();
// game.testConsole();
// console.time();
// game.step2();
// console.timeEnd();
// game.testConsole();
// console.time();
// game.step2();
// console.timeEnd();
// game.testConsole();
// console.time();
// game.step2();
// console.timeEnd();
// game.testConsole();
// game.testConsole();

// var http = require('http');
// var url=require('url');
// console.log('Hello World');
// var count = 1;
// var viewModel = {
// 	array : new Array(200 * 200),

// 	sendUpdate : function()
// 	{

// 	},

// 	receiveCommand : function()
// 	{
		
// 	},
// 	partialHash : function()// after every 10 seconds.// hash of only filled boxes
// 	{


// 	},
// 	completeHash  : function()// after every 60 seconds.// hash of filled boxes + colors
// 	{

// 	}
// };
// var server=http.createServer((function(request,response)
// {
// 	response.writeHead(200,
// 	{"Content-Type" : "text/plain"});
// 	if( !request.url.includes('.ico') ) 
// 	{
// 		var q=url.parse(request.url,true).query;
// 		var txt=q.year +" " +q.month;
// 		console.log(count++ + " request : "+request.url);
// 		//response.write(request.url);
		
// 		response.end(request.url);
// 	}
// 	//response.end("\nHello World\n");
// 	//response.end(txt);
// 	//response.write( request.url);
// 	//console.log(count++);
// }));	
// server.listen(7000);
