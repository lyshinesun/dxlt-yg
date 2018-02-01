/**
 * 创建工厂类
 * Toolkit 
 */

function Toolkit() {

}

Toolkit.createDiv = function () {
    return document.createElement("div")
}
Toolkit.createForm = function () {
    return document.createElement("form")
}
Toolkit.createTable = function () {
   return document.createElement("table")
}
Toolkit.createTR = function () {
    return document.createElement("tr")
}
Toolkit.createTD = function () {
    return document.createElement("td");
}
Toolkit.createUL = function () {
    return document.createElement("ul");
}
Toolkit.createLI = function () {
    return document.createElement("li");
}
Toolkit.createSelect = function () {
    return document.createElement("select");
}
Toolkit.createLable = function(){
	return document.createElement("label");
}
Toolkit.createA = function(text){
	var _a = document.createElement("a");
	_a.innerHTML = text;
	return _a;
}
Toolkit.createTextBox = function () {
    var _text = document.createElement("input");
    _text.type = "text";
    return _text;
}
Toolkit.createButton = function (id, text) {
    var _button = document.createElement("input");
    _button.type = "button";
    if (id != undefined)
        _button.id = id;
    if (text != undefined)
        _button.value = text;
    return _button;
}

