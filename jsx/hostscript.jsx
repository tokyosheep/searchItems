/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/
//rePlaceColor();
/*
var obj = {
    "replace": {
        "cyan": 100,
        "magenta": 50,
        "yellow": 0,
        "black": 0
    },
    "searchs": [
        {
            "cyan": 0,
            "magenta": 0,
            "yellow": 0,
            "black": 100
        },
        {
            "cyan": 10,
            "magenta": 10,
            "yellow": 10,
            "black": 100
        }
    ]
}
rePlaceColor(obj);
*/

var SearchItems = function(obj){
        this.objects = obj;
        this.items = app.activeDocument.pageItems;
    }

    SearchItems.prototype.findColor = function(){
        for(var i=0;i<this.items.length;i++){
            $.writeln(this.items[i].typename);
            if(this.items[i].typename == "PathItem"){
                if(this.objects.type=="replace"){this.isFind(this.items[i])}
                if(this.objects.type="select"){this.findSelect(this.items[i])}
            }
        }
    }

    SearchItems.prototype.isFind = function(item){
        for(var n=0;n<this.objects.searchs.length;n++){
            try{
                if(this.isSameColor(item.fillColor,this.objects.searchs[n])){
                    this.replace(item.fillColor,this.objects.replace)
                }
            }catch(e){
                return false;
            }
        }
    }

    SearchItems.prototype.isSameColor = function(item,color){
        $.writeln("item"+item.black+"::black"+color.black);
        if(item.black != color.black){return false }
        if(item.cyan != color.cyan){return false}
        if(item.magenta != color.magenta){return false}
        if(item.yellow != color.yellow){return false}
        $.writeln("true");
        return true;
    }

    SearchItems.prototype.replace = function(item,color){
        for(var p in color){
            item[p] = color[p];
        }
    }

    SearchItems.prototype.findSelect = function(item){
        if(this.isBlack(item.fillColor)){
            item.selected = true;
        }
    }

    SearchItems.prototype.isBlack = function(item){
        if(item.black == "100"){
            $.writeln("true");
            return true;
        }
        return false;
    }

function rePlaceColor(obj){
    $.writeln(app.activeDocument.pageItems[0]);
    

    var seach = new SearchItems(obj);
    seach.findColor();
    return true;
}

var obj = {type:"select"};
selectingBlack(obj)

function selectingBlack(obj){
    var seachBk = new SearchItems(obj);
    seachBk.findColor();
    return true;
}
