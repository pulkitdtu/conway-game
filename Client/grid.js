window.grid = 
{
    board : new Array(200 * 200),
    changeSet : new Set(),
    init : function()
    {
        for(i = 0; i< 200; i++)
        {
            for(j=0 ;j< 200; j++)
                this.board[ i * 200 + j ] = (new Node(i,j));
        }
        for(i = 0; i< 200; i++)
        {
            for(j=0 ;j< 200; j++)
            {
                temp = this.board[i * 200 + j];
                temp.near1 = Node.checkAndReturnNode( this.board[ (i - 1) * 200 + j - 1]);
                temp.near2 = Node.checkAndReturnNode( this.board[ (i - 1) * 200 + j - 0]);
                temp.near3 = Node.checkAndReturnNode( this.board[ (i - 1) * 200 + j + 1]);
                
                temp.near4 = Node.checkAndReturnNode( this.board[ (i - 0) * 200 + j - 1]);
                temp.near5 = Node.checkAndReturnNode( this.board[ (i - 0) * 200 + j + 1]);
                
                temp.near6 = Node.checkAndReturnNode( this.board[ (i + 1) * 200 + j - 1]);
                temp.near7 = Node.checkAndReturnNode( this.board[ (i + 1) * 200 + j - 0]);
                temp.near8 = Node.checkAndReturnNode( this.board[ (i + 1) * 200 + j + 1]);
            }
        }
    },
    update : function(x,y, color)
    {
        cell = this.board[x * 200 + y];
        
        if( color != null && cell.presentColor == null)
        {
            cell.presentColor = color;
            cell.nextColor = color;
            this.changeSet.add(cell);
            cell.getNetworkDataString();
            cell.incrementAllNeighbours();
            cell.addAllNeighboursToSet(this.changeSet);
        }
        
        else if(color == null && cell.presentColor != null)// true
        {
            //opposite
            cell.presentColor = color;
            cell.nextColor = color;
            this.changeSet.add(cell);
            cell.getNetworkDataString();
            cell.decrementAllNeighbours();
            cell.addAllNeighboursToSet(this.changeSet);
        }
    },
    signalChangeEvent : function(size){},
    step : function()
    {// timestamp by server can be used for further sync.//
        changeSetTemp = this.changeSet;
        this.changeSet = new Set();
        for (let cell of changeSetTemp) {// fastest method for iteration // c
            if(cell.presentColor != null){
                if(cell.nearCount != 2 && cell.nearCount != 3 )
                    {
                        cell.presentColor= null;
                        this.changeSet.add(cell);
                        cell.getNetworkDataString();
                        cell.decrementAllNeighbours();
                        cell.addAllNeighboursToSet(this.changeSet);
                    }
            }
            else// false
            {
                if(cell.nearCount ==3) 
                    {
                        cell.presentColor = cell.getAverageNeighbourColor();
                        this.changeSet.add(cell);
                        cell.getNetworkDataString();
                        cell.incrementAllNeighbours();
                        cell.addAllNeighboursToSet(this.changeSet);
                    }
            }
        }
        if(this.changeSet.size > 0)
            this.signalChangeEvent(this.changeSet.size);//sendNetworkDataEvent();

    },

    step2: function()
    {
        changeSetTemp = this.changeSet;
        this.changeSet = new Set();
        for (let cell of changeSetTemp) {// fastest method for iteration // c
            if(cell.presentColor != null){
                if(cell.nextColor == null)
                    {
                        cell.presentColor = null;
                        
                        cell.getNetworkDataString();
                        //console.time("1");
                        cell.decrementAllNeighbours();
                        cell.addAllNeighboursToSet(this.changeSet);
                        //console.timeEnd("2");
                    }
                if(cell.nearCount != 2 && cell.nearCount != 3 )
                    {
                        cell.nextColor= null;
                        this.changeSet.add(cell);
                    }
            }
            else// false
            {
                if(cell.nextColor != null) 
                {
                        cell.presentColor = cell.nextColor;
                        cell.getNetworkDataString();
                        cell.incrementAllNeighbours();
                        cell.addAllNeighboursToSet(this.changeSet);
                }
                if(cell.nearCount ==3) 
                    {
                        cell.nextColor = cell.getAverageNeighbourColor();
                        this.changeSet.add(cell);
                    }
            }
        }
        if(this.changeSet.size > 0)
            this.signalChangeEvent(this.changeSet.size);//sendNetworkDataEvent();
    },
    clear : function()
    {
        for(i = 0; i< 200; i++)
        {
            for(j=0 ;j< 200; j++)
                this.update(i, j, null);
        }
    },
    
    partialHash: function()
    {
        var s ="";
        for(i = 0; i< 200; i++)
        {
            for(j=0 ;j< 200; j++)
                s +=  this.board[ j * 200 + i ].presentColor != null ?  "1" : "0";
        }
        return s.hashCode();
        var arr = new ArrayBuffer(4);
        var view = new DataView(arr);
        view.setUint32(0, s.hashCode(), false);
        return new Uint8Array(arr);
    },
    fullHash: function()
    {
        var s ="";
        var count = 0;
        for(i = 0; i< 200; i++)
        {
            for(j=0 ;j< 200; j++)
            {
                color = this.board[ j * 200 + i ].presentColor;
                if(color != null)
                {
                    s += color;
                    count++;
                }
            }
        }//var buff = new Buffer(2);//var buff = new Uint8Array([Math.pow(2, 7)| count]);
        return {count : count, hash :s.hashCode()};
    },
    isFilled : function(x, y)
    {
        return this.board[x * 200 + y].presentColor != null;
    },
    testConsole : function()
    {
        console.log("testConsole \n");
        for(i = 0; i< 10; i++)
        {
            var s = "";
            for(j=0 ;j< 10; j++)
                s +=  this.board[ i * 200 + j ].presentColor != null ?  " 1" : " 0";
            console.log(s);
        }
        console.log("testConsole end");
    }
};


String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    console.log('hash : '+ hash);
    hash = Math.abs(hash) | 0;
    return hash;
    return new Uint8Array([hash]);
    //buff.
    //var buff = new Buffer(4);
    //buff.writeUInt32LE(hash);
    //var hash2 = parseInt(buff.toString("hex"),16);
    //return buff;
    //return hash;
  };

// window.grid = {
//     array : new Array(200 * 200),
//     changeSet : new Set(),
//     init : function()
//     {
//         for(i = 0; i< 200; i++)
//         {
//             for(j=0 ;j< 200; j++)
//                 this.array[ i * 200 + j ] = (new window.Node(i,j));
//         }
//         for(i = 0; i< 200; i++)
//         {
//             for(j=0 ;j< 200; j++)
//             {
//                 temp = this.array[i * 200 + j];
//                 temp.near1 = Node.checkAndReturnNode( this.array[ (i - 1) * 200 + j - 1]);
//                 temp.near2 = Node.checkAndReturnNode( this.array[ (i - 1) * 200 + j - 0]);
//                 temp.near3 = Node.checkAndReturnNode( this.array[ (i - 1) * 200 + j + 1]);
                
//                 temp.near4 = Node.checkAndReturnNode( this.array[ (i - 0) * 200 + j - 1]);
//                 temp.near5 = Node.checkAndReturnNode( this.array[ (i - 0) * 200 + j + 1]);
                
//                 temp.near6 = Node.checkAndReturnNode( this.array[ (i + 1) * 200 + j - 1]);
//                 temp.near7 = Node.checkAndReturnNode( this.array[ (i + 1) * 200 + j - 0]);
//                 temp.near8 = Node.checkAndReturnNode( this.array[ (i + 1) * 200 + j + 1]);
//             }
//         }
//     },
//     update : function(x,y, color)
//     {
//         cell = this.array[x * 200 + y];
//         if( cell.state == false)
//             {
//                 cell.state = true;
//                 this.changeSet.add(cell);
//                 cell.getNetworkDataString();
//                 cell.incrementAllNeighbours();
//                 cell.addAllNeighboursToSet(this.changeSet);
//             }
//     },
//     signalChangeEvent : function(size){console.log("signalChangeEvent called. size of next list = " + size);},


//     step2: function()
//     {
//         changeSetTemp = this.changeSet;
//         this.changeSet = new Set();
//         for (let cell of changeSetTemp) {// fastest method for iteration // c
//             if(cell.state == true){
//                 if(cell.nextState == false)
//                     {
//                         cell.state = false;
                        
//                         cell.getNetworkDataString();
//                         console.time("1");
//                         cell.decrementAllNeighbours();
//                         console.timeEnd("1");

//                         console.time("2");
//                         cell.addAllNeighboursToSet(this.changeSet);
//                         console.timeEnd("2");
//                         var a = 1;
//                     }
//                 if(cell.nearCount != 2 && cell.nearCount != 3 )
//                     {
//                         cell.nextState= false;
//                         this.changeSet.add(cell);
//                     }
//             }
//             else// false
//             {
//                 if(cell.nextState == true) 
//                 {
//                         cell.state = true;
//                         cell.getNetworkDataString();
//                         cell.incrementAllNeighbours();
//                         cell.addAllNeighboursToSet(this.changeSet);
//                 }
//                 if(cell.nearCount ==3) 
//                     {
//                         cell.nextState = true;
//                         this.changeSet.add(cell);
//                     }
//             }
//         }
//         if(this.changeSet.size > 0)
//             this.signalChangeEvent(this.changeSet.size);//sendNetworkDataEvent();
//     },

// }