const {Node} = require('./game_node.js')

var game = 
{
    width : 200,
    height : 200,
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
            this.changeSet.add(cell);//cell.getNetworkDataString();
            cell.incrementAllNeighbours();
            cell.addAllNeighboursToSet(this.changeSet);
            
        }
        
        else if( (color == null && cell.presentColor != null) )// true
        {
            cell.presentColor = color;//opposite
            cell.nextColor = color;
            this.changeSet.add(cell);//cell.getNetworkDataString();
            cell.decrementAllNeighbours();
            cell.addAllNeighboursToSet(this.changeSet);
        }
    },
    signalChangeEvent : function(size){if(size>0)console.log("signalChangeEvent called. size of next list = " + size);},
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
                        //cell.getNetworkDataString();//console.time("1");
                        cell.decrementAllNeighbours();
                        cell.addAllNeighboursToSet(this.changeSet);//console.timeEnd("2");
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
                        cell.presentColor = cell.nextColor;//cell.getNetworkDataString();
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
    },

    partialHash: function()
    {
        var s ="";
        for(i = 0; i< 200; i++)
        {
            for(j=0 ;j< 200; j++)
                s +=  this.board[ i * 200 + j ].presentColor != null ?  "1" : "0";
        }
        return s.hashCode();
        //return buff;

        //return Buffer.from(s.hashCode());
    },
    fullHash: function()
    {
        var s ="";
        var count = 0;
        for(i = 0; i< 200; i++)
        {
            for(j=0 ;j< 200; j++)
            {
                color = this.board[ i * 200 + j ].presentColor;
                if(color != null)
                {
                    s+= color;
                    count++;
                }
            }
        }
        return {count: count, hash : s.hashCode()}
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
    },
    encode : function()
    {
        var buff = Buffer.from([2]);
        for(i = 0; i< 200; i++)
        {
            for(j=0 ;j< 200; j++)
            {

                if( this.isFilled(i,j))
                {    
                    var color = this.board[ i * 200 + j ].presentColor;
                    color = color== null ?  [1,1,1] : color;
                    var latestBuff =Buffer.from( [i,j,color[0], color[1], color[2]]);
                    buff = Buffer.concat([buff, latestBuff],buff.length + 5);
                }
            }
        }
        return buff;
    }
};

module.exports = game;

String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    //var buff = new Buffer(4);
    //buff.writeUInt32LE(hash);
    //var hash2 = parseInt(buff.toString("hex"),16);
    //return buff;
    hash = Math.abs(hash) | 0;
    return hash;
  };