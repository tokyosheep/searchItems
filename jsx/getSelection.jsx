(function(){
    var selects = app.activeDocument.selection;
    var ItemsObj = function(){
        this.objects = [];
    }

    ItemsObj.prototype.getSelection = function(selects){
        for(var i=0;i<selects.length;i++){
            $.writeln(selects[i]);
            if(selects[i].typename === "GroupItem"){
                this.getSelection(selects[i].pageItems);
            }
            try{
                $.writeln(selects[i].fillColor);
                this.objects.push(this.getProperty(selects[i].fillColor));
            }catch(e){
                this.objects.push({type:selects[i].typename})
            }
        }
    }

    ItemsObj.prototype.getProperty = function(color){
        var obj = {};
        for(var key in color){
            obj[key] = color[key];
        }
        return obj;
    }
    var search = new ItemsObj();
    search.getSelection(selects);
    return JSON.stringify(search.objects);
})();