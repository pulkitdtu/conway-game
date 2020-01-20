
game = require('./../model/game.js');
colors = require('./../model/colors.js');

var timeron = false;
controller = 
{
    clients : new Set(),
    init: function()
    {
        game.init();
        colors.init();
    },
    receive : function(networkData, connection) // network data needs to be converted
    {
        
        if(timeron == true)
            console.log('timer is ticking now');
        console.log((new Date()) + ' Received Message from ' + connection.remoteAddress  + ': ' + networkData);// broadcast message to all connected clients
          console.log(networkData.binaryData);
        if(networkData.binaryData.length == 3)
        {
            connection.color = colors.popColor([networkData.binaryData[0], networkData.binaryData[1], networkData.binaryData[2]]);
            this.sendToClient(Buffer.from(connection.color), connection);
        }
        else if(networkData.binaryData.length ==2)
        {
            var clientColor = connection.color;
            var messageArray = [networkData.binaryData[0], networkData.binaryData[1]];
            var color = game.isFilled(networkData.binaryData[0], networkData.binaryData[1]) ? null : clientColor;
            game.update(networkData.binaryData[0], networkData.binaryData[1], color);
            var messageArray  =  (color == null) ?  [networkData.binaryData[0],networkData.binaryData[1],0,0,0]:  [networkData.binaryData[0], networkData.binaryData[1],color[0],color[1],color[2]];
            var buff = Buffer.from(messageArray);
            this.send(buff);
        }
        else if(networkData.binaryData.length == 1)
        {
            if(networkData.binaryData[0] == 1)
            {
                var buff = game.encode();
                this.sendToClient(buff, connection);
            }
            else if(networkData.binaryData[0] == 2)
            {
                for(i = 0; i< 37; i ++)
                    for(j = 0; j< 37; j++)
                        {game.update(i, j, null);
                            var messageArray = [i,j, 0,0,0];
                            var buff = Buffer.from(messageArray);
                            this.send(buff);
                        }
            }
        }
    },
    sendToClient: function(data, client)
    {
        client.sendBytes(data);
    },
    send : function(data)
    {
        for(let client of this.clients)
        {
            client.sendBytes(data);
        }
    },
    addClient(request)
    {
        console.log((new Date()) + ' Connection from origin '+ request.origin + '.');
        var connection = request.accept(null, request.origin); 
        connection.on('message', function(message) {// user sent some message
            controller.receive(message, connection);
      });
      connection.on('close', function(connection) {// user disconnected
          controller.removeClient(connection);
      });
        console.log((new Date()) + ' Connection accepted.' + connection.socket.address + ' ___'+connection.socket.localAddress);
        this.clients.add(connection);//connection.color = colors.popColor();
        
    },
    removeClient(connection)
    {
        console.log((new Date()) + " Peer "+ connection.remoteAddress + " Disconnected.");
        for(let client of this.clients)
        {
          if(client.off)
            {
                this.clients.delete(client);
                client.close();
                colors.pushColor(client.color);//colors.push(userColor);// push back user's color to be reused by another user
                client.color = null;
            }
        }
        if(this.clients.size == 0)
            game.init();
    },
    timer : function()
    {
        
    },
    timerExecutor : setInterval(timerFunction, 4000),
    sendSynchronizationByte : function()
    {
        var buff = Buffer.from([1]);
        this.send(buff);// synchronization byte
    },
    sendPartialHash : function()
    {
        var hash = game.partialHash();//var buff = Buffer.from(hash);
        var buff = Buffer.alloc(4);
        buff.writeUInt32LE(hash);
        this.send(buff);
    },
    sendFullHash : function()
    {
        var fullHash = game.fullHash();
        var buff = Buffer.alloc(2);
        buff.writeUInt16BE(Math.pow(2, 15) | fullHash.count);
        var buff2 = Buffer.alloc(4);
        var hash = fullHash.hash;
        buff2.writeUInt32LE(hash);
        this.send( Buffer.concat([buff, buff2]));
    }


};
module.exports = controller;
function timerFunction()
{
    //lock
    //game_canvas.step();

    //console.log('timer ticked start');
    
    if(typeof timerFunction.counter == 'undefined')
        timerFunction.counter = 0;
    if(timerFunction.counter++ % 10 ==0)
    {
        if(timerFunction.counter % 15 == 0)
            controller.sendFullHash();
        else
            controller.sendPartialHash();
    }
    timeron = true;//for.each game
    game.step2();
    game.step2();
    console.log('sending 1 byte to : ' + controller.clients.size +' clients.')
    controller.sendSynchronizationByte();
    timeron = false;
 
}


    //for(let client of controller.clients)
    //{// synchronization byte 0001.// update set  // partial hash code // full hash code // 



    //}
    // if(controller.clients.size == 0) 
    // {
    //     for(var i = 0; i< 20; i++)
    //     {
    //         for( var j= 0 ; j< 20 ; j++)
    //         {
    //             if(game.board[ i * 200 + j ].presentColor != null) 
    //                 console.log(i+", "+j+" _________________________");
    //         }
    //     }
    // }
    // else
    //     {controller.sendFullHash();controller.sendPartialHash();}




    //console.log('timer tick end');
        //queue.add(step);

/*
There can be following messages to be send to all the structure.
// synchronization byte 00000001.
// changeSet  
// partial hash code 
// full hash code 
// send full matrix.
 */