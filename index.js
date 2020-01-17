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
    filePath = __dirname+'/Client'+filePath.slice(1,filePath.length);// removing the . at the first place of filePath.
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
		console.log('no such file or directory');
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




server.listen(webSocketsServerPort, function() {console.log((new Date()) + " Server is listening on port "+ webSocketsServerPort);});
var wsServer = new webSocketServer({ httpServer: server});
wsServer.on('request', function(request) {
    controller.addClient(request);//var connection = request.accept();connection.close();
});

