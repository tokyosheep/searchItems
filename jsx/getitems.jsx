(function(){
    var items = activeDocument.pageItems;
    $.writeln(items[0]);
    var colors = [];
    for(var p in items[0]){
        $.writeln(p);
    }
    for(var i=0;i<items.length;i++){
        try{
            $.writeln(items[i].fillColor.typename);
            //if(items[i].fillColor.typename == "CMYKColor"){
                colors.push(getColor(items[i].fillColor));
                colors[colors.length-1].number = i;
                colors[colors.length-1].type = items[i].typename;
            //}
        }catch(e){
            colors.push({type:items[i].typename});
        }
    }
    return JSON.stringify(colors);
    function getColor(color){
        var obj = {};
        for( key in color){
            obj[key] = color[key];
        }
        return obj;
    }
})();