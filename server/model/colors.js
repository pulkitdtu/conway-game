
var colors = {
list : [],
init :function()
{
    this.createList();
},
createList: function()
{
    for(var i = 0; i< 100; i++)
    {
        temp = [];
        for( var j =0; j< 10; j++)
            temp[j] = this.getRGB(i* 10 + j + 2);// +2 is added since 0 and 1 returns black color which is not needed here.
        shuffle(temp);
        this.list = this.list.concat(temp);
    }
    this.list.reverse();
},
popColor: function(rgb)
{
    if(this.list.length == 0 || typeof this.list === 'undefined')
        this.createList();
    if(rgb)
        {
            var filterList =  this.list.filter(  function(element){ 
                return !(rgb[0] == element[0] && rgb[1] == element[1] && rgb[2] == element[2]);}   );
            if(filterList.length == this.list.length - 1)
            {
                this.list = filterList;
                return rgb;
            }
        }
    return this.list.pop();
},
pushColor : function(color)
{
    this.list.push(color);
},

search : function(rgb)
{
    return this.list.find(  function(element){ 
        return rgb[0] == element[0] && rgb[1] == element[1] && rgb[2] == element[2];}   );
},
remove : function(rgb)
{
    var filterList =  this.list.filter(  function(element){ 
        return !(rgb[0] == element[0] && rgb[1] == element[1] && rgb[2] == element[2]);}   );
    
},
getRGB : function ( index) {
    p = this.getPattern(index);
    return [this.getElement(p[0]), this.getElement(p[1]), this.getElement(p[2])];
},

getElement : function ( index) {
     value = index - 1;
     v = 0;
    for ( i = 0; i < 8; i++) {
        v = v | (value & 1);
        v <<= 1;
        value >>= 1;
    }
    v >>= 1;
    return v & 0xFF;
},

getPattern : function ( index) {
     n = Math.floor(Math.cbrt(index));
    index -= (n*n*n);
    p = [n,n,n];//Arrays.fill(p,n);
    if (index == 0) {
        return p;
    }
    index--;
    r = index % 3;
    if( r < 0) 
        r = index - r;
    index = Math.floor(index / 3);
    if (index < n) {
        p[r] = index % n;
        if(p[r] < 0)
            p[r] = index - p[r];
        return p;
    }
    index -= n;
    p[r      ] = Math.floor(index / n);
    p[++r % 3] = index % n;
    if(p[r % 3] <0) 
        p[r %3]  = index - p[r%3];
    return p;
}

};
module.exports = colors;
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }