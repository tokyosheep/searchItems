window.onload = () =>{
    "use strict";
    const csInterface = new CSInterface();
    themeManager.init();

    const filePath = csInterface.getSystemPath(SystemPath.EXTENSION) +`/js/`;
    const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) +`/jsx/`;
    csInterface.evalScript(`$.evalFile("${extensionRoot}json2.js")`);//json2読み込み
    const json_path = extensionRoot + "data.json";

    const fillColors = document.getElementById("fillColors");
    const Selects = document.getElementById("Selects");
    const findKeyColor = document.getElementById("findKeyColor");
    const selectBlacks = document.getElementById("selectBlacks");
    const itemList = document.getElementById("itemList");
    const everyThing = document.getElementById("everyThing");
    const getItemColor = "getitems.jsx";
    const getSelection = "getSelection.jsx";
    const searchAll = "searchEverything.jsx";
    
    const fs = require("fs");
    
    const toString = Object.prototype.toString;
    function typeOf(obj) {//オブジェクトの型を判定
        return toString.call(obj).slice(8, -1).toLowerCase();
    }
    
    class SeachColorData{//CMYKカラー作成クラス
        constructor(cyan,magenta,yellow,black){
            this._color = {
                cyan:cyan,
                magenta:magenta,
                yellow:yellow,
                black:black
            }
        }
        
        getColor(){
            return this._color;
        }
    }
    
    const keyBlack = new  SeachColorData(0,0,0,100);
    const mixed = new SeachColorData(10,10,10,100);
    
    const another = new SeachColorData(100,50,0,0);
    
    class ButtonEvent{//ボタンイベントクラス。
        constructor(btn,jsx){
            this.btn = btn;
            this.jsx = jsx;
            this.btn = this.btn.addEventListener("click",this);
        }
        
        handleEvent(){}
        
        toJsx(){//extends scriptにアクセスして取得した値をPromiseで返す
            return new Promise(resolve=>{
                csInterface.evalScript(`$.evalFile("${extensionRoot}${this.jsx}")`,(res)=>{
                    resolve(res);
                });
            });
        }
        
        removeChild(parent){//リストの内容をリセットするメソッド
            while(parent.firstChild){
                parent.removeChild(parent.firstChild);
            }
        }
    }
    
    class ColorData extends ButtonEvent{//各種アイテムが持っている描画色を取得するクラス
        constructor(btn,jsx){
            super(btn,jsx);
            this.list = itemList;
        }
        
        async handleEvent(){
            const ColorObj = JSON.parse(await this.toJsx());
            console.log(ColorObj);
            this.removeChild(this.list);
            ColorObj.forEach(v=>{
                this.writeList(this.list,v);
            });
        }
        
        writeList(parent,obj){
            const li = document.createElement("li");
            parent.appendChild(li);
            const ul = document.createElement("ul");
            li.appendChild(ul);
            Object.entries(obj).forEach(([key,value])=>{
                const liSecond = document.createElement("li");
                liSecond.textContent = `${key}::${value}`;
                ul.appendChild(liSecond);
            });
        }
    }
    
    class GetEverything extends ColorData{//全てのレイヤーアイテムを取得するクラス
        constructor(btn,jsx){
            super(btn,jsx);
            this.list = itemList;
        }
        
        async handleEvent(){
            const objects = JSON.parse(await this.toJsx());
            console.log(objects);
            this.removeChild(this.list);
            this.writeList(objects,this.list);
        }
        
       createElement(parent){//リスト要素を作成して作成した要素をオブジェクトとして返す
            const li = document.createElement("li");
            parent.appendChild(li);
            const ul = document.createElement("ul");
            li.appendChild(ul);
            return {li:li,ul:ul};
        }
        
        writeList(objects,parent){//リスト作成関数ここから再帰的にレイヤー、アイテムの情報を処理してゆく
            objects.forEach(obj=>{
                const elm = this.createElement(parent);
                Object.entries(obj).forEach(([key,value])=>{
                    const li = document.createElement("li");
                    elm.ul.appendChild(li);
                    this.analyzeObjArray(key,value,li);
                });
            });
        }
        
        analyzeObjArray(key,value,parent){//配列の中身を分析する関数。配列の中に配列、オブジェクトがある限り再帰的に処理してゆく
            if(Array.isArray(value)){
                this.writeList(value,parent);
            }else if(typeOf(value)  === "object"){
                Object.entries(value).forEach(([k,prop])=>{
                    this.analyzeObjArray(k,prop,parent);
                });
            }else{//値が配列でもオブジェクトでもなければテキストとして書き出し。
                const p = document.createElement("p");
                p.textContent = `${key}::${value}`;
                parent.appendChild(p);
            }
        }
    }
    
    
    
    const everyData = new GetEverything(everyThing,searchAll);
    
    const getItmes = new ColorData(fillColors,getItemColor);
    const getSelect = new ColorData(Selects,getSelection);
    
    class SeachBlacks{//k100の色のアイテムを選択するクラス
        constructor(btn,funcType){
            this.btn = btn;
            this.funcType = funcType;
            this.btn.addEventListener("click",this);
        }
        
        async handleEvent(){
            const obj = {type:"select"};
            const res = await this.accessJsx(obj).catch(err => console.log(err));
            console.log(res);
        }
        
        accessJsx(obj){
            return new Promise((resolve,reject)=>{
                csInterface.evalScript(`${this.funcType}(${JSON.stringify(obj)})`,(o)=>{
                    if(o === "false"){
                        reject(o);
                    }
                    resolve(o);
                });
            });
        }
    }
    
    const selectingBlack = new SeachBlacks(selectBlacks,"selectingBlack");
    
    class ReplaceColor extends SeachBlacks{
        constructor(btn,replace){
            super(btn,"rePlaceColor");
            this.replaceColor = replace;
        }
        
        setColors(...objects){
            this.findColors = objects.reduce((acc,current)=>{
                acc.push(current);
                return acc;
            },[]);
        }
        
        async handleEvent(){
            const obj = {
                type:"replace",
                replace:this.replaceColor,
                searchs:this.findColors
            }
            console.log(obj);
            const res = await this.accessJsx(obj).catch(err => console.log(err));
            
        }
    }
    
    const replacing = new ReplaceColor(findKeyColor,another.getColor());
    replacing.setColors(keyBlack.getColor(),mixed.getColor());
    console.log(replacing);
    
    /*デバッグ用json書き出し関数
    function writeJSON(obj){
        const json_path = extensionRoot + "data.json";
        fs.writeFile(json_path,JSON.stringify(obj,null,4),(err)=>{//デバッグ用にjson書き出し
            if(err){
                alert(err);
            }
        });
    }
    */
}
    
