var Sungrow = {
    post: function(URL, PARAMS){//打开新页面，防止浏览器阻止 URL ：页面地址，params：参数
        var temp_form = document.createElement("form");
        temp_form.action = URL;
        temp_form.target = "_blank";
        temp_form.method = "post";
        temp_form.style.display = "none";
        for (var x in PARAMS) {
            var opt = document.createElement("textarea");
            opt.name = x;
            opt.value = PARAMS[x];
            temp_form.appendChild(opt);
        }
        document.body.appendChild(temp_form);
        temp_form.submit();
    },
    showLayerDialog : function(){//弹出页面，弹框等
        var url = arguments[0];
        var width = arguments[1]?arguments[1]:760;
        var height = arguments[2]?arguments[2]:$(window).height() - 40;
        var type = arguments[3]?arguments[3]:2;
        var title = arguments[4]?arguments[4]:false;
        var shade = arguments[5]?arguments[5]:0.4;
        var closeBtn = arguments[6]?arguments[6]:1;
        var shadeClose = arguments[7]?arguments[7]:true;

        layer.open({
            type: type,
            title: title,
            area: [width+'px', height+'px'],
            shade: shade,
            closeBtn: closeBtn,
            shadeClose: shadeClose,
            content: url
        });
    },
    showMsg : function (o) {//此方法替代Sungrow.showMsg
        layer.open({
            title: o.container.head,
            content: o.container.content,
            btn: o.container.noText,
            yes: function(index, layero){
                if(o.container.yesFn){
                    o.container.yesFn();
                }
                if(o.callback){
                    o.callback();
                }
                layer.close(index); //如果设定了yes回调，需进行手工关闭
            }
        });
    },
    showDeleteMsg : function (o) { //删除增加取消按钮 2017/3/10
        layer.open({
            title: o.container.header,
            content: o.container.content,
            btn: [o.container.noText,o.container.cancel],
            yes: function(index, layero){
                if(o.container.yesFn){
                    o.container.yesFn();
                }
                if(o.callback){
                    o.callback();
                }
                layer.close(index); //如果设定了yes回调，需进行手工关闭
            }
        });
    },
    showIframe : function (o) {//此方法替代asynbox.open
        var url = o.url;
        if(o.args&&o.args!=""){
            url = url+"?"+o.args;
        }
        layer.open({
            type: 2,
            title: o.title,
            shadeClose: true,
            shade: 0.5,
            maxmin: true, //开启最大化最小化按钮
            area: [o.width+'px', o.height+'px'],
            content: url
        });
        var index = layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        layer.iframeAuto(index);
    },
    close: function (index) {
        if(index){
            layer.close(index)
        } else {
            layer.closeAll();
        }
    },
    msg: function (obj) {
        layer.msg(LANG.common_savesucess, {
            skin: 'demo-class',
            shade: 0.5,
            icon : -1,
            area : ['100px' , '70px'],
            time: 2000
        }, function(){
            if (obj.callback) {
                obj.callback();
            }
        });
    }
};
/********** 此段代码暂时屏蔽了电站树的右键及F5刷新功能    裴习柱  add  2016-11-08  **********/
//屏蔽F5
/*document.onkeydown = function(e){
 e = window.event || e;
 var keycode = e.keyCode || e.which;
 if(e.ctrlKey || e.altKey || e.shiftKey
 || keycode == 116){
 if(window.event){// ie
 try{e.keyCode = 0;}catch(e){}
 e.returnValue = false;
 }else{// ff
 e.preventDefault();
 }
 }
 }
 //屏蔽右键
 document.oncontextmenu = function(e){
 return false;
 }*/
/****** end *****/

String.prototype.toFixed = function (n){
    return toFix_sun(this,n);
}

String.prototype.isEmpty = function (){
    return isEmptyStr(this);
}

var decToHex = function(str) {
    var res = [];
    for (var i = 0; i < str.length; i++)
        res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
    return "\\u" + res.join("\\u");
}
var hexToDec = function(str) {
    str = str.replace(/\\/g, "%");
    return unescape(str);
}

/**
 * GUID生成工具
 *
 * @type UUID
 * @class UUID
 */
var UUID = {
    S4 : function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    /**
     * 生成32位GUID,速度慢
     *
     * @return {}
     */
    randomUUID : function() {

        return (UUID.S4() + UUID.S4() + "-" + UUID.S4() + "-" + UUID.S4() + "-"
        + UUID.S4() + "-" + UUID.S4() + UUID.S4() + UUID.S4());
    },
    d : new Date().getTime() + "_" + Math.random().toString().replace('.', '_')
    + "_",
    c : 0,
    /**
     * 生成客户端唯一ID,速度快
     *
     * @return {}
     */
    cID : function() {
        ++UUID.c;
        return 'cid_' + UUID.d + UUID.c;
    }
};

/**
 * 字符处理对象
 *
 * @class StringBuffer
 */
function StringBuffer() {
    this._strings_ = [];
}
/**
 * 添加string
 *
 * @param {string}
 *            str
 */
StringBuffer.prototype.append = function(str) {
    this._strings_.push(str);
}
/**
 * 返回字符处理结果
 *
 * @return {string} 字符
 */
StringBuffer.prototype.toString = function(split) {
    if (split == null)
        split = '';
    return this._strings_.join(split);
}
/**
 * @return {}
 */
String.prototype.Trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
/**
 * @param {}
 *            rename
 * @param {}
 *            edname
 * @return {}
 */
String.prototype.replaceall = function(rename, edname) {
    var ret = this;
    if (edname == null)
        edname = '';
    ret = ret.replace(rename, edname);

    while (ret.indexOf(rename) >= 0) {
        ret = ret.replace(rename, edname);
    }
    return ret;
}

/**
 * hashtable 哈希表
 *
 * @class hashtable
 */
var hashtable = function() {
    this.keys = {};
}
/**
 * 检验是否包含指定key
 *
 * @param {object}
 *            key
 * @return {Boolean} 检验结果
 */
hashtable.prototype.contains = function(key) {
    if (this.count == 0)
        return false;
    return this.keys.hasOwnProperty(key);
}
/**
 * 包含的key value对数量
 *
 * @type Number
 */
hashtable.prototype.count = 0;
/**
 * 添加一个key value对
 *
 * @param {}
 *            key
 * @param {}
 *            value
 */
hashtable.prototype.add = function(key, value) {
    if (this.contains(key))
        return;
    this.keys[key] = value;
    this.count++;
}

/**
 * 根据key获取value
 *
 * @param {}
 *            key
 * @return {}
 */
hashtable.prototype.getvalue = function(key) {
    return this.keys[key];
}

/**
 * 根据key替换指定的value
 *
 * @param {}
 *            key
 * @param {}
 *            newvalue
 */
hashtable.prototype.replace = function(key, newvalue) {
    if (this.contains(key))
        this.keys[key] = newvalue;
}

/**
 * 根据key删除key value对
 *
 * @param {}
 *            key
 */
hashtable.prototype.remove = function(key) {
    this.keys[key] = null;
    delete this.keys[key];
    this.count--;
}

/**
 * 清除所有项
 */
hashtable.prototype.clear = function() {
    this.keys = null;
    this.keys = {};
    this.count = 0;
}
/**
 * 复制
 *
 * @return {} hashtable对象
 */
hashtable.prototype.clone = function() {
    var _keys = this.keys;
    var ret = new hashtable();
    for (var k in _keys) {
        ret.add(k, this.getvalue(k));
    }
    return ret;
}

var Dic = new Object();
Dic.getDater = function() {

    var now = new Date();

    var year = now.getFullYear(); // 年
    var month = now.getMonth() + 1; // 月
    var day = now.getDate(); // 日

    var hh = now.getHours(); // 时
    var mm = now.getMinutes(); // 分
    var ss = now.getSeconds();
    var clock = year + "-";

    if (month < 10)
        clock += "0";
    clock += month + "-";

    if (day < 10)
        clock += "0";
    clock += day +" ";

    if (hh < 10)
        clock += "0";
    clock += hh + ":";

    if (mm < 10)
        clock += '0';
    clock += mm +":";

    if (ss < 10)
        clock += "0";
    clock += ss;
    return clock;
}
/**
 * Dic注册事件
 *
 * @param {}
 *            element 事件对象
 * @param {}
 *            type 事件类型
 * @param {}
 *            fun 调用方法
 * @param {}
 *            args 参数集合
 * @param {}
 *            domain 作用域
 */
Dic.addEvent = function(element, type, fun, args, domain) {
    if (!domain)
        domain = null;
    element.bind(type, function(arg) {
        eval(fun.call(domain, arg, args));
    });
}

Dic.getData = function(pageObj) {
    var pageData = pageObj.serializeArray();
    var obj = new Object();
    for (var index = 0; index < pageData.length; index++) {
        var p = pageData[index];
        obj[p["name"]] = p["value"];
    }
    return obj;
}

/**
 * 异步提交表单时，获取表单数据（适合含有table数据） 多个相同的变量名不同值的区分
 *
 * @param {}
 *            element 事件对象
 * @param {}
 *            splitType 区分分隔符
 */
Dic.getTableData = function(pageObj, splitType) {
    var pageData = pageObj.serializeArray();
    var obj = new Object();
    for (var index = 0; index < pageData.length; index++) {
        var p = pageData[index];
        if (null == obj[p["name"]] || 'undefined' == obj[p["name"]]) {
            obj[p["name"]] = p["value"];
        } else {
            obj[p["name"]] = obj[p["name"]] + splitType + p["value"];
        }
    }
    return obj;
}

Dic.Url = {};
Dic.Url.getpar = function() {
    var url = location.href;
    return url.substring(url.indexOf("?") + 1, url.length);
}
Dic.Url.getParams = function(paras) {
    var paraString = Dic.Url.getpar().split("&");
    var paraObj = {}
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j
                .indexOf("=")
            + 1, j.length);
    }
    if (paras == null)
        return paraObj;
    var returnValue = paraObj[paras.toLowerCase()];
    if (typeof(returnValue) == "undefined") {
        return "";
    } else {
        return returnValue.replace(/#/g, "");
    }
}

/**
 * 处理form所有text文本框中字符串的前后空格 num:指定的那个form位置，从0开始计算
 */
Dic.trim = function(num) {
    if (num == null) {
        num = 0;
    }
    var frm = document.forms[num];
    var els = frm.elements;
    for (var i = 0; i < els.length; i++) {
        if (els[i].type == 'text') {
            els[i].value = els[i].value.replace(/(^\s*)|(\s*$)/g, '');
        }
    }
}

Dic.Ajax = {};
Dic.Ajax.request = function(ops) {
    var dataObj = null;
    $.ajax({
        url : ops["url"],
        type : 'POST',
        async : false,
        cache : false,
        data : ops["data"],
        dataType : 'html',
        timeout : 10000,
        error : function() {
            if(typeof (console)!="undefined" && console!=undefined){
                console.log('获取数据失败!');
            }
        },
        success : function(result) {
            dataObj = $.parseJSON(result);
        }
    });

    return dataObj;
}
/**
 * @date 2015-09-18
 * @author 陶中玉
 * @param ops JSON数组格式
 * @deprecated 此方法做RPC远程调研后台的接口服务
 */
Dic.Ajax.JSONP = function(ops) {
    var dataObj = null;
    $.ajax({
        type : "GET",
        async :false,
        url : ops["url"],
        dataType : "JSONP",
        jsonp:"callback",
        data : ops["data"],
        success: function(msg) {
            dataObj = $.parseJSON(msg);
        },
        timeout:3000,
        error : function(e){
            alert("请求失败", "信息提示");
        }
    });
    return dataObj;
}

Dic.Ajax.Async = function(ops) {
    $.ajax({
        url : ops["url"] + '?test=' + UUID.cID(),
        async : true,
        cache : false,
        type : "post",
        dataType : "json", // 后台返回的响应数据形式json、xml、html、text、script、_default
        data : ops["data"],
        success : function(data) {// 响应成功后执行的方法体

            return $.parseJSON(data);

        },
        error : function() {// 响应错误后执行的方法体
            alert("请求失败", "信息提示");
        }
    })
}

/**
 * ajax封装 url 发送请求的地址 data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(),
 * "state": 1} dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text successfn
 * 成功回调函数 errorfn 失败回调函数 完成回调函数 completefn obj 提交的按钮对象 (传this)
 */
jQuery.SUN_post = function(url, data, successfn,errorfn, completefn,obj,
                           async) {
    var asyncdefault = true;
    if (async == false) {
        asyncdefault = false;
    }
    if (obj != undefined && obj != null && $(obj).length > 0) {
        if ($(obj).hasClass("noActionButton")
            || $(obj).hasClass("processing")) {// 防止重复提交
            return false;
        }
    }
    data = (data == null || data == "" || typeof (data) == "undefined") ? {
        "date" : new Date().getTime()
    } : data;
    $.ajax({
        type : "post",
        data : data,
        url : url,
        async : asyncdefault,
        dataType : "json",
        beforeSend : function() {
            loading(obj);
        },
        success : function(d, s) {
            /*if (d.exception != undefined && d.exception != '') {// 优先处理异常
             alert("出现异常");
             return;
             }*/
            successfn(d, s);
        },
        error : function(xhr, e) {
            xhr = null;
            if (errorfn != undefined && errorfn != "" && errorfn != null) {
                errorfn(e);
            } else {
                try {
                    if(typeof(console)!="undefined"){console.log('request url:'+url+' is failed:'+e)}
                    /*if(typeof(layer)!="undefined"){
                     layer.alert('request error,please try again or contact admin', {
                     time:3000
                     });
                     } else if(typeof(parent.layer)!="undefined"){
                     parent.layer.alert('request error,please try again or contact admin', {
                     time:3000
                     });
                     } else {
                     alert('request error,please try again or contact admin');
                     }*/
                } catch (e){}
                /*var ul = getRootPath() + "/login.jsp";
                 location.href = ul;*/
            }
        }
        ,
        complete : function(xhr) {
            var sessionstatus=xhr.getResponseHeader("sessionstatus");
            xhr = null;
            if(sessionstatus=="timeout"){
                if(typeof(console)!="undefined"){console.log('session time out,please login!')}
                if(typeof(layer)!="undefined"){
                    layer.msg(LANG["sessionTimeOut"] , {
                        time:3000,
                    }, function(){
                        backToLogin();
                    });
                } else if(typeof(parent.layer)!="undefined"){
                    parent.layer.msg(LANG["sessionTimeOut"] , {
                        time:3000,
                    }, function(){
                        backToLogin();
                    });
                }
            }
            complete(obj);
            if (completefn != undefined && completefn != ""
                && completefn != null) {
                completefn();
            }
        }
    });
};

function loading(obj) {
    //$(".button").addClass('noActionButton');
    //$(".loadding").show();
    if ($(obj).length > 0) {
        $(obj).addClass("processing");
    }
}

function getRootPath() {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var pos = strFullPath.indexOf(strPath);
    var prePath = strFullPath.substring(0, pos);
    return prePath;
}

function getTopWinow(){
    var p = window;
    while(p != p.parent){
        p = p.parent;
    }
    return p;
}

function backToLogin() {
    var url = getRootPath() + "/login.jsp";
    var top = getTopWinow();
    top.location.href = url;
}

function complete(obj) {
    //$(".button").removeClass('noActionButton');
    //$(".loadding").hide();
    if ($(obj).length > 0) {
        $(obj).removeClass("processing");
    }
}

/*function setCookie(c_name,value,expiredays) {
 $.cookie(c_name, value, { expires: expiredays, path:'/'});
 }*/

function setCookie (cookieName, cookieValue, expiredays, path, domain, secure) {
    if(!path){
        path = "/";
    }

    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);

    document.cookie =

        escape(cookieName) + '=' + escape(cookieValue)

        + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())

        + (path ? '; path=' + path : '')

        + (domain ? '; domain=' + domain : '')

        + (secure ? '; secure' : '');

}

function getCookie(c_name) {
    if (document.cookie.length>0)
    {
        c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1
            c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
            return unescape(document.cookie.substring(c_start,c_end))
        }
    }
    return "";
}


function loadScriptAndCallback(content, fn, errFn, isInner,doc){
    var container = doc || document.getElementsByTagName('head')[0],script, done = false;
    doc = doc || document;
    script = doc.createElement('script');
    script.language = "javascript";
    script.charset = "UTF-8";
    script.type = 'text/javascript';
    script.onload = script.onreadystatechange = function(){
        if (!done && (!script.readyState || 'loaded' === script.readyState || 'complete' === script.readyState)) {
            done = true;
            fn && fn();
            script.onload = script.onreadystatechange = null;
            script.parentNode.removeChild(script);
            script = null;
            return ;
        }
    };
    script.onerror = function(){
        if (!done) {
            done = true;
            errFn && errFn();
        }
    };
    if(isInner)
    {
        script.text = content;
    }else{
        script.src = content;
    }
    container.appendChild(script);
    if(!done && isInner) {
        done = true;
        fn && fn();
    }
    container = null;
}
/**
 * Add Style to the page asynchronously
 * @param {String} content  Style code or url of Style file
 * @param {Function} fn	callback function
 * @param {Boolean} isInner specify the content is code or url , set true the content is code. (default is false)
 * @param {DomElement} doc doc (Optional) the location of you need append to.
 */
function loadStyle(content, fn, isInner,doc){

    doc = doc || document;
    if (isInner) {
        var style =  doc.createElement('style');
        style.setAttribute('type', 'text/css');
        document.getElementsByTagName('head')[0].appendChild(style);
        style.styleSheet && (style.styleSheet.cssText += content) || style.appendChild(doc.createTextNode(content));
    }
    else {
        //不重复引用样式文件
        var  links= document.getElementsByTagName("link");
        var index = -1;
        for (var i = 0; i < links.length; i++) {
            index = links[i].href.indexOf(content);
            if(index>=0){
                return;
            }
        }

        var link = document.createElement('link');
        link.charset = $.charset||"UTF-8";
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = content;
        doc.getElementsByTagName('head')[0].appendChild(link);

        var styles = doc.styleSheets, load = function(){
            for (var i = 0; i < styles.length; i++) {
                if (link === (styles[i].ownerNode || styles[i].owningElement)){
                    return fn();
                }
            }
            setTimeout(arguments.callee, 5);
        };
    }

    if(fn){
        fn();
    }
}

//字符串格式化，替换参数：共{0}页 格式化成 共10页
function formatString(orgin,params,size){
    if(params instanceof Array){
        while(orgin.match(/{\d}/)&& params.length>0){
            var match = orgin.match(/{\d}/);
            orgin = orgin.replace(match, params.shift());
        }
    } else { //不是数组只传一个参数
        var match = orgin.match(/{\d}/);
        orgin = orgin.replace(match, params);
    }
    if(size){
        orgin = orgin.replace(new RegExp("selected","gm"),"");
        var index = orgin.indexOf("'"+size+"'");
        if(index>-1){
            orgin = orgin.substring(0,index)+"'"+size+"' selected"+orgin.substring(index+(size+"").length+2,orgin.length);
        }
    }


    return orgin;
}

/**
 * url中获取请求参数值
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/******针对ie10以下不支持html5 属性placeholder的改进  start******/
function toggleShowPlaceholder(obj){
    if($.browser && $.browser.msie && $.browser.version < 10 ){
        $(obj).find("label").css("display","none");
        $(obj).find("input").focus();
    }
}
function blurInput(inputObj){
    if($.browser && $.browser.msie && $.browser.version < 10 ){
        singlePlaceHolderLabelDisplay($(inputObj).siblings("label")[0]);
    }
}
function focusInput(inputObj){
    if($.browser && $.browser.msie && $.browser.version < 10 ){
        $(inputObj).siblings("label").css("display","none");
    }
}
function groupPlaceHolderLabelDisplay(){
    $(".form_input_placeholder").each(function(n,placeHolder){
        singlePlaceHolderLabelDisplay(placeHolder);
    });
}
function singlePlaceHolderLabelDisplay(labelObject){
    var inputValue = $(labelObject).siblings("input").val();
    if(inputValue=="" || inputValue == undefined){
        $(labelObject).css("display","block");
    } else {
        $(labelObject).css("display","none");
    }
}
/******针对ie10以下不支持html5 属性placeholder的改进  end******/

//input框中只输入数字
function inputNumberOnly(obj){
    if(obj.value.indexOf("0")==0){
        obj.value=0;
    } else {
        obj.value=obj.value.replace(/^0+|\D/g,'');
    }
}
//获取用户当前页显示的条数
function getPageNum(pageId){
    if(pageId==undefined||pageId==null){
        pageId = "";
    }
    var account = $("#a").val();

    var size = 10;
    var cookPageNum = getCookie(account+"_"+pageId+"_pNum");//cookie中的显示条数
    var selectPageNum = $("#pageNum option:selected").val();//当前选中的条数

    if(cookPageNum!=null && $.isNumeric(cookPageNum)){
        size = cookPageNum;
    } else if(selectPageNum!=null && $.isNumeric(selectPageNum)){
        size = selectPageNum;
    } else {
        setCookie(account+"_"+pageId+"_pNum",10,30);
    }


    return size;
}

//德文特殊处理，.替换成逗号
function i18nFormatNum(num){
    var strNum = num +"";
    var lang = getCookie("lang");
    if(lang=="de"){
        strNum = strNum.replace(".",",");
    }
}


function toFix_sun(num,n){
    if(isEmptyStr(num)){
        return "--";
    }
    if(isEmptyStr(n)){
        n=1;
    }
    if($.isNumeric(num)&&num>=0){
        return parseFloat(num).toFixed(n);
    } else {
        return "--";
    }
}

//判断是否为字符
function isString(s){
    return (s != "--" && s != "-" && s != "");
}

/**
 * 数组处理，对数组中的值进行补值 add by ghouman(数据曲线拟合处理)
 * @param array
 * @returns {*}
 */
function dealArray(array){
    if(array==undefined){
        return null;
    }
    for(var i = 1;i<array.length;i++){//中间值处理
        var x = array[i];
        if(!isString(x)){
            var isUpdate = false;
            for(var j=i;j<array.length;j++){
                if(isString(array[j])){
                    isUpdate = true;
                    break;
                }
            }
            if(isUpdate) {
                for (var j = i; j > 0; j--) {
                    if (isString(array[j])) {
                        array[i] = array[j];
                        break;
                    }
                }
            }
        }

    }


    var index = 0;
    //从后往前遍历处理
    for(var i = array.length-1;i>-1;i--){
        if(isString(array[i])) {
            index = i;
            break;
        }
    }
    //array = array.slice(0,index+1);
    //从前往后遍历处理
    for(var i = 0;i<array.length;i++){
        if(isString(array[i])) {
            break;
        } else {
            array[i] = "";
        }
    }
    return array;
}
//operModule 操作模块 operType 操作类型 operInfo 操作信息 msg 消息
function addSysLog(operModule,operType,operInfo,msg){
    var param = {};
    param["operModule"] = operModule;
    param["operType"] = operType;
    param["operInfo"] = operInfo;
    param["msg"] = msg;
    $.post("commonIAction_addSysLog",param,function(){
    });
}

/**
 * 是否为空字符
 * @param str
 */
function isEmptyStr(str) {
    if(str==undefined || str== null || str == "null" || str=="" || str=="--"){
        return true;
    }
    return false;
}


/**取整5分钟**/
function getFiveMinutes(minutes) {
    if (m % 5 != 0) {
        var m = parseInt(minutes);
        m = m - (m % 5);
        if (m < 10) {
            m = "0" + m;
        }
    }
    return m;
}

function initCurrentTime(docId){
    var nowDate = new Date();
    var year1 = nowDate.getFullYear();
    var month1 = nowDate.getMonth() + 1;
    var date1 = nowDate.getDate();
    var hours = nowDate.getHours();
    var minutes = nowDate.getMinutes();
    month1 = month1 >= 10 ? month1: ("0" + month1);
    date1 = date1 >= 10 ? date1: ("0" + date1);
    hours = hours >= 10 ? hours: ("0" + hours);
    minutes = minutes >= 10 ? minutes: ("0" + minutes);
    var beginDate = year1 + "" +month1 + date1 + hours + minutes;
    var param = new Object();
    param["TimeZoneId"] = beginDate;
    $.ajax({
        url: "psOverviewAction_getTimeZone",
        type: "post",
        dataType: "json",
        //后台返回的响应数据形式json、xml、html、text、script、_default
        data: param,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        //指定浏览器传输form表单参数时采用的字符集
        success: function(data) { //响应成功后执行的方法体
            var jsondata = data;
            //$("#timeZone").val(jsondata.timeZone);
            var nowDate = new Date();
            var t = nowDate.getTime()+jsondata.timeZone;
            var time = new Date(t);
            var y = time.getFullYear();
            var m = time.getMonth()+1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = getFiveMinutes(time.getMinutes());
            var date = y+'/'+add0(m)+'/'+add0(d)+' '+add0(h)+':'+ mm;
            $("#"+docId).val(date);
            /*if (jsondata.timeZone > 15 || jsondata.timeZone < ( - 15)) {
             layer.alert(jsondata.timeZone);
             }*/
        },
        error: function() { //响应错误后执行的方法体
            // alert("时区获取失败", "信息提示");
            layer.alert(LANG["sta_overview_gettimezonefailure"]);
        }
    });
}

function add0(m){return m<10?'0'+m:m }

Date.prototype.Format = function(fmt)
{
    var o =
    {
        "M+" : this.getMonth() + 1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth() + 3) / 3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

Date.prototype.addDays = function(d)
{
    this.setDate(this.getDate() + d);
};

Date.prototype.addWeeks = function(w)
{
    this.addDays(w * 7);
};

Date.prototype.addMonths= function(m)
{
    var d = this.getDate();
    this.setMonth(this.getMonth() + m);
    if (this.getDate() < d)
        this.setDate(0);
};

Date.prototype.addYears = function(y)
{
    var m = this.getMonth();
    this.setFullYear(this.getFullYear() + y);
    if (m < this.getMonth())
    {
        this.setDate(0);
    }
};
/*
 test
 var beginDate = "2016-08-31"
 var d1 = new Date(beginDate.replace(/\-/g, "\/"));
 d1.addDays(1);//加减日期操作
 alert(d1.Format("yyyy-MM-dd"));

 */

//得到本地时区；reuturn -12 ~ +12
function getLcTimeZone(){
    var offset = -new Date().getTimezoneOffset()/60;
    return offset > 0? "+" + offset: offset;
}
