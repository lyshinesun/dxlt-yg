if (addEventListener) {
    window.addEventListener("load",A , false)
} else if (attachEvent) {
    attachEvent("onload", A);
}

function A(){
    if(easyDialog){
        easyDialog.defaults.confirm = "\u786e\u5b9a";
        easyDialog.defaults.cancel = "\u53d6\u6d88";
        easyDialog.defaults.close = "\u5173\u95ed\u7a97\u53e3";
    }
}
