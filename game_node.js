class Node 
{
    constructor(x,y){
    this.link = null;
    this.colorCode = null;
    this.near1 = null; this.near2 = null; this.near3 = null; this.near4 =  null; this.near5 = null; this.near6 = null; this.near6 = null; 
    this.near7 = null; this.near8 = null;
    this.previousState = null;
    this.state = false;
    this.nextState = null;
    this.nearCount = 0;
    this.presentColor = null;
    this.nextColor = null;
    this.x = x; this.y = y;
    }
    incrementNearcount () {this.nearCount++;}
    resetCount () {this.nearCount = 0;}
    stateSwap () {this.previousState = nextState; this.nextState = null; this.presentColor = this. nextColor; this.nextColor = null;}
    incrementAllNeighbours ()
    {
        if(this.near1)
            this.near1.incrementNearcount();
        if(this.near2)
            this.near2.incrementNearcount();
        if(this.near3)
            this.near3.incrementNearcount();
        if(this.near4)
            this.near4.incrementNearcount();
        if(this.near5)
            this.near5.incrementNearcount();
        if(this.near6)
            this.near6.incrementNearcount();
        if(this.near7)
            this.near7.incrementNearcount();
        if(this.near8)
            this.near8.incrementNearcount();
    }
    decrementNearCount () {this.nearCount--;}
    decrementAllNeighbours()
    {
        if(this.near1)
            this.near1.decrementNearCount();
        if(this.near2)
            this.near2.decrementNearCount();
        if(this.near3)
            this.near3.decrementNearCount();
        if(this.near4)
            this.near4.decrementNearCount();
        if(this.near5)
            this.near5.decrementNearCount();
        if(this.near6)
            this.near6.decrementNearCount();
        if(this.near7)
            this.near7.decrementNearCount();
        if(this.near8)
            this.near8.decrementNearCount();
    }
    addAllNeighboursToSet(set)
    {
        if(this.near1)
            set.add(this.near1);
        if(this.near2)
            set.add(this.near2);
        if(this.near3)
            set.add(this.near3);
        if(this.near4)
            set.add(this.near4);
        if(this.near5)
            set.add(this.near5);
        if(this.near6)
            set.add(this.near6);
        if(this.near7)
            set.add(this.near7);
        if(this.near8)
            set.add(this.near8);
    }
    getAverageNeighbourColor()
    {
        var set = new Set();
        this.addAllNeighboursToSet(set);
        var color = [0, 0, 0];
        for(let el of set)
            if(el.presentColor != null)
                color[0] += el.presentColor[0],color[1] += el.presentColor[1], color[2] += el.presentColor[2];
        
            color[0] /= 3, color[1]/=3, color[2]/=3;
        return color; //return "#000000";

    }
    getNetworkDataString() { var s = " "; return s;}
    static checkAndReturnNode(temp)
    {
        if(typeof temp == "undefined" )
            return null;
        return temp;
    }
};

module.exports = {Node};