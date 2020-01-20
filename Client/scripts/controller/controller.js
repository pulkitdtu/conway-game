
game_canvas = window.game_canvas;
window.controller = 
{
    socket : null,
    color : null,
    init : function()
    {
        window.game_canvas.init();
        window.patterns.init();
    },
    startConnection : function(socket)
    {
        this.socket = socket;
        this.socket.send(new Uint8Array([1]));// request for encoded grid.
        if(window.name)
        {
            var array = JSON.parse("[" + window.name + "]");
            this.socket.send(new Uint8Array(array));
        }
        else
            this.socket.send(new Uint8Array([255,255,255]));// white color means any color from the top of the list.
    },
    receive : function(e)
    {
        var data1 = null;
        var reader = new FileReader();
        var socket = this.socket;
        reader.onload = function (e1) {
            data1 = new Uint8Array(e1.srcElement.result);
            if(data1)
            {
                if( data1.length == 1)
                    game_canvas.step();
                else if(data1.length == 3)
                    {
                        window.name = [data1[0], data1[1], data1[2]];
                        document.body.style.background = game_canvas.rgb([255 - data1[0] , 255 - data1[1] , 255 - data1[2]]);
                        
                        document.getElementById("box").style.background = game_canvas.rgb([data1[0], data1[1], data1[2]]);
                    }
                else if(data1.length == 5)
                {   
                    var color2 = [data1[2], data1[3], data1[4]];//var color2 = "#000001";
                    if(data1[2] == 0 && data1[3] == 0 && data1[4] == 0)
                        color2 = null;
                    game_canvas.updateIndicesPlusGrid(data1[0], data1[1], color2);
                }
                else if(data1.length > 5  && data1[0] == 2 && (data1.length - 1) % 5 == 0)
                {
                    game_canvas.clear();
                    for(var i = 1; i < data1.length; i+=5)
                    {
                        game_canvas.updateIndicesPlusGrid(data1[i], data1[i+1],[data1[i+2], data1[i+3],data1[i+4]]);
                    };
                }
                else if(data1.length == 6 && (data1[0] & 128) == 128)
                {
                    var arr = new ArrayBuffer(6); //var firstPart = Math.pow(2, 7) | count;
                    var view = new DataView(arr);//buff.reverse();//var buff2 = new Uint8Array([buff, s.hashCode()]);
                    var hash = window.grid.fullHash();
                    view.setUint16(0, Math.pow(2,15) | hash.count, false);
                    view.setUint32(2, hash.hash, true); // byteOffset = 2; litteEndian = true
                    var arr8 = new Uint8Array (arr);//arr8.reverse();//var u8arr = window.grid.fullHash();
                    if(JSON.stringify(arr8)==JSON.stringify(data1))
                        console.log('full hash test correct. hash = ' + hash.hash);
                    else
                        socket.send(Uint8Array([1]));// request for encoded grid. // socket = this.socket
                }
                else if (data1.length == 4)
                {
                    var hash = window.grid.partialHash();
                    var arr = new ArrayBuffer(4);
                    var view = new DataView(arr);
                    view.setUint32(0, hash, true);// littleEndian = true
                    var arr8 = new Uint8Array(arr);//arr8.reverse();
                    if(JSON.stringify(arr8)==JSON.stringify(data1))
                        console.log('partial hash test correct. hash = ' + hash);
                    else
                        socket.send(new Uint8Array([1]));// request for encoded grid. // socket = this.socket
                }
            }
        }
        reader.readAsArrayBuffer(e.data);
        
    },
    send: function(data, client)
    {
        
    },
    send : function(data)
    {
        
    },
    sendUpdate : function( x,y)// request to server
    {
        var array = new Uint8Array(2);
        array[0] = x / game_canvas.height;
        array[1] = y / game_canvas.width;
        if(this.socket)
            this.socket.send(array);
    },
    submitPattern : function()
    {
        if(document.querySelector('input[name="pattern"]:checked')!= null) 
        {
            var pattern = document.querySelector('input[name="pattern"]:checked').value;
            console.log('drawing : ' + pattern);
            for(let p of window.patterns.dictionary[pattern])
                window.controller.socket.send(new Uint8Array([p[0], p[1]]));//game_canvas.updateIndicesPlusGrid(p[0],p[1],window.controller.color);
        }
        else
            alert('Please choose a pattern from the radio buttons before clicking on the submit button');
    },
    gridCheck : function()
    {
        var s = document.getElementById("grid");
        if (s.checked)
        {
            game_canvas.enableGrid(true);
            s.textContent = "UnCheck To Disable Grid.";
        }
        else
        {
            game_canvas.enableGrid(false);
            s.textContent = "Check to Enable Grid";
        }
    },
    clear : function()
    {
        if(window.controller.socket)
            window.controller.socket.send(new Uint8Array([2]));// request for to clear top left of the drawing.
    },
    timer : function()
    {
        
    }
};