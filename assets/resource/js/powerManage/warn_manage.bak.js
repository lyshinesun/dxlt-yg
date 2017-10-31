var psId;
var psName;
var batchFaultId;
var batchFaultName;
var batchFaultLevel;
var batchFaultTypes;
var batchpsNames;
var batchFaultPsKey;
var batchFaultCreateTime;
var batchProStatus;
var batchFaultCode;
var batchFaultTypeCode;
var batchDeviceName;
var zTree, rMenu;
var treeFlag = false;
var deviceType = "";
var psKey = "";
var fromBy;
var uu_id;
// 全局变量点击的行索引
var refreshTBClickedRowIndex = 1;
var bFirstInFlag = true;


var systemFlag = false;//2016 08 24 wangli 判断是否是已关闭
var showflag = false;//2016 08 30 判断工单是否是系统处理

var current_paged = '';

$(function () {
    $(".problem_con").css("height", $('.maxbox_show').height() - 100);
});
$(window).resize(function () {
    $(".problem_con").css("height", $('.maxbox_show').height() - 100);
});
//	start 20161009 故障告警 全屏样式调整

$(document).ready(function () {
    $("#change_size").toggle(function () {
        $(".problem_con").height($(".maxbox_show").height() - 110);
        $(window).resize(function () {
            $(".problem_con").height($(".maxbox_show").height() - 110);
        })
    }, function () {
        $(".problem_con").height($(".maxbox_show").height() - 110);
        $(window).resize(function () {
            $(".problem_con").height($(".maxbox_show").height() - 110);
        })
    })
});
$(window).resize(function () {
    $(".problem_con").height($(".maxbox_show").height() - 110);
});


$(document).ready(function () {
    var boxrightWidth = $(".boxlists-right").width();
    var box1Width = $(".boxt1:eq(0)").width();
    var box2Width = $(".boxt2:eq(0)").width();
    var newbox2Witdth = boxrightWidth - box1Width - 60;
    if (newbox2Witdth > 70) {
        $(".boxt2").width(newbox2Witdth + "px");
    }
    if ($("#isOperate").length == 0) {
        $(".deal").css("background-color", "#C0C0C0");
    }

    var pid = paramsPid;
    var CurPageVal = paramsCurPageVal;
    var ps_key = paramsPskey;
    var fromP = fromPage;
    var uu = uuid;
    if (CurPageVal != '') {
        AllPS.CurPage = CurPageVal;
        currentPage = CurPageVal - 1;
        ps_id = pid;
        fromBy = fromP;
        uu_id = uu;
    }
    if (ps_key != '') {
        psKey = ps_key;
    }
    if (document.getElementById('psDetail') != null) {
        initPage();
    }

    jQuery(".dateWrap").slide({trigger: "click"});

});

$(function () {
    $('#fault_name').focus(function () {
        associatInputFtN();
    });
});

function checkFaultType() {


    search(1);
}

//首页、上一页、下一页、尾页操作
function gotoPage(currentPage) {
    search(currentPage);
}

function exportToExcel() {
    /*
     var exportStr="";
     // var excel_title = "";
     var title = "";
     var bNodata = false;
     var psname =$('#lp'+ psId +' a:first-child').text();
     var devName="";
     var datetime = window.frames["ifm"].$(".quick_date").text().trim();
     if(zTree.getSelectedNodes()!=''){
     var nodes = zTree.getSelectedNodes();
     devName=(nodes[0].id+"").split(".")[0];
     }
     var type=$(objTag)[0].getAttribute("id");
     if(type=='onLine'){
     //datetime = datetime.split("-")[0] +LANG.common_year+ datetime.split("-")[1]+LANG.common_month+ datetime.split("-")[2]+LANG.common_day;
     window.frames["ifm"].$("#onLineThead").find("td").each(function(i){
     exportStr+=$(this).text();
     exportStr += ',';
     });
     if(window.frames["ifm"].$("#onLineTbody td").length==1){
     bNodata = true;
     }
     //excel_title = psname+devName+datetime + LANG.asset_management_online;
     title=LANG.asset_management_online;
     }else if(type=='psDeviceFault'){
     //datetime = datetime.split("-")[0] +LANG.common_year+ datetime.split("-")[1]+LANG.common_month+ datetime.split("-")[2]+LANG.common_day;
     window.frames["ifm"].$("#psDeviceFaultThead").find("td").each(function(i){
     exportStr+=$(this).text();
     exportStr += ',';
     });
     if(window.frames["ifm"].$("#psDeviceFaultTbody td").length==1){
     bNodata = true;
     }
     //excel_title = psname+devName+datetime+ LANG.asset_management_fault;
     title=LANG.asset_management_fault;
     }else if(type=='psDeviceOrder'){
     //datetime = datetime.split("-")[0] +LANG.common_year+ datetime.split("-")[1]+LANG.common_month+ datetime.split("-")[2]+LANG.common_day;
     window.frames["ifm"].$("#psDeviceOrderThead").find("td").each(function(i){
     exportStr+=$(this).text();
     exportStr += ',';
     });
     if(window.frames["ifm"].$("#psDeviceOrderTbody td").length==1){
     bNodata = true;
     }
     //excel_title = psname+devName+datetime + LANG.asse_management_order;
     title=LANG.asse_management_order;
     }
     alert(222);
     if(bNodata){
     Sungrow.showMsg({
     container : {
     header : LANG.station_report_prompt,
     content : LANG.station_report_noexport,
     noFn : true,  noText:LANG["pro_management_determine"]
     },
     fixed : false
     });
     return;
     }*/
    var count = $("#ListCount").val();
    if (count == 0) {
        Sungrow.showMsg({
            container: {
                header: LANG.station_report_prompt,
                content: LANG.station_report_noexport,
                noFn: true, noText: LANG["pro_management_determine"]
            },
            fixed: false
        });
        return;
    } else if (count > 5000) {
        Sungrow.showMsg({
            container: {
                header: LANG.station_report_prompt,
                content: LANG["asset_management_data_volume_too_large_new"],
                noFn: true, noText: LANG["pro_management_determine"]
            },
            fixed: false
        });
        return;

    }

    /*var str = $(".range-slider").val();
     var str1 = str.split(",")[0];
     var str2 = str.split(",")[1];
     var faultType1 = 4;
     var faultType2 = 1;
     if(str1>25 && str1<=50){
     faultType1 = 3;
     }else if(str1>50 && str1<=75){
     faultType1 = 2;
     }else if(str1>75 && str1<=100){
     faultType1 = 1;
     }

     if(str2>50 && str2<=75){
     faultType2 = 2;
     }else if(str2>25 && str2<=50){
     faultType2 = 3;
     }else if(str2>=0 && str2<=25){
     faultType2 = 4;
     }*/

    var fault_code = $("#fault_code").val();
    if (fault_code == LANG["pro_management_input_fault_number"]) {
        fault_code = "";
    }
    layer.load(0, 2);
    var url = ctx + "/psFaultAction_exportPsStationData?psId=" + $("#psId").val() + "&device_type=" + deviceType + "&startTime=" + $("#startTime").val()
        + "&endTime=" + $("#endTime").val() + "&faultType=" + $("#faultType").val() +
        "&fault_code=" + fault_code + "&faultStatus=" + $("#faultStatus").val() + "&ps_key=" + psKey + "&exportStr=" + exportStr + "&psName=" +
        $('#lp' + psId + ' a:first-child').text() + "&title=" + LANG.asset_management_fault;
    location.href = encodeURI(encodeURI(url));
    layer.closeAll();

    /*$.ajax({
     url: "psFaultAction_checkPsStationData",
     type:"post",
     success: function(data){//响应成功后执行的方法体
     var jsonObj = eval("(" + data + ")");
     if(jsonObj==1){
     Sungrow.showMsg({
     container : {
     header : LANG.station_report_prompt,
     content : "数据量太大",
     noFn : true,  noText:LANG["pro_management_determine"]
     },
     fixed : false
     });
     return;
     }else if(jsonObj==0){
     layer.load(0, 2);
     //不能用ajax请求，否则不能出现提示框
     var url = ctx + "/psFaultAction_exportPsStationData?type=" + type +"&datetime="+datetime+ "&title="+title+"&exportStr=" + exportStr+"&psname="+psname+"&devName="+devName;
     location.href= encodeURI(encodeURI(url));
     layer.closeAll();
     }else{
     Sungrow.showMsg({
     container : {
     header: LANG["all_station_prompt"],
     content:LANG["all_station_requesttimeout"],
     noFn : true,  noText:LANG["pro_management_determine"]
     },
     fixed : false
     });
     }
     },
     error : function() {//响应错误后执行的方法体
     Sungrow.showMsg({
     container : {
     header: LANG["all_station_prompt"],
     content:LANG["all_station_requesttimeout"],
     noFn : true,  noText:LANG["pro_management_determine"]
     },
     fixed : false
     });
     var url = getRootPath() + "/login.jsp";
     var top = getTopWinow();
     top.location.href = url;
     }
     });	*/
}

function searchByCond(obj, value) {  //根据故障级别查询
    curOtherPage = 1;
    var tableInputName = $(obj).parent("ul").siblings("input").attr("name");
    /*$("input[name='faultType']").each(function(){
     if(value!=""){
     if(value==this.value){
     $(this).attr("checked","checked");
     } else {
     $(this).removeAttr("checked");
     }
     } else {
     $(this).attr("checked","checked");
     }
     });*/

    //$("input[name='faultType']").attr("checked","checked");

    if (tableInputName == "params.faultType") {
        $("#faultType").val(value);
    } else if (tableInputName == "params.faultLevel") {
        $("#faultLevel").val(value);
    } else if (tableInputName == "params.processStatus") {
        $("#faultStatus").val(value);
    }
    //else {//若故障编号或者故障名称不为空  则根据故障编号或故障名称来查询 清空之前搜索的默认条件 2016 05 11 SJE-1542
    //    if ($("#fault_code").val() != '' ||
    //        $("#fault_name").val() != '') {
    //        $("#faultStatus").val('');
    //        $("#faultLevel").val('');
    //    } else {
    //        //$("#faultStatus").val(" ");
    //        $("#faultStatus").val(value);// SJE-1542   电站列表-故障告警：去除”故障编号“后，表格数据采用的筛选条件不一致； 默认查询未关闭状态  201 605 11
    //        $("#faultLevel").val(" ");
    //    }
    //}
    $(obj).parent("ul").siblings("input").val(value);
    search(1);
}

var rowCount1 = 0;
// 翻页参数
var curOtherPage = 1;
var sizePage = 10;
//查询
function search(currentPage) {
    var startd = $("#startTime").val();
    var endd = $("#endTime").val();

    if (startd > endd) {
        Sungrow.showMsg({
            container: {
                header: LANG["pro_management_prompt"],
                content: LANG["pro_management_starttimenotgreatercutofftime"],
                noFn: true,
                noText: LANG["pro_management_determine"]
            },
            fixed: false
        });
        return;
    }

    sizePage = getPageNum($("#pageId").val());
    var faultType = "";
    $("input[name='faultType']:checked").each(function () {
        faultType = faultType + this.value + ",";
    });
    if (faultType != "") {
        faultType = faultType.substring(0, faultType.length - 1);
    }
    $("#faultType").val(faultType);


    /*var str = $(".range-slider").val();
     var str1 = str.split(",")[0];
     var str2 = str.split(",")[1];
     var faultType1 = 4;
     var faultType2 = 1;
     if(str1>25 && str1<=50){
     faultType1 = 3;
     }else if(str1>50 && str1<=75){
     faultType1 = 2;
     }else if(str1>75 && str1<=100){
     faultType1 = 1;
     }

     if(str2>50 && str2<=75){
     faultType2 = 2;
     }else if(str2>25 && str2<=50){
     faultType2 = 3;
     }else if(str2>=0 && str2<=25){
     faultType2 = 4;
     }*/


    var fault_code = $("#fault_code").val();
    if (fault_code == LANG["pro_management_input_fault_number"]) {
        fault_code = "";
    }
    var fault_name = $("#fault_name").val();
    if (fault_code != "" || fault_name != "") {  // 故障编号/故障名称不为空查询所有状态的故障
        var obj = document.getElementById("");
        var value = "";
        var tableInputName = $(obj).parent("ul").siblings("input").attr("name");
        /*$("input[name='faultType']").each(function(){
         if(value!=""){
         if(value==this.value){
         $(this).attr("checked","checked");
         } else {
         $(this).removeAttr("checked");
         }
         } else {
         $(this).attr("checked","checked");
         }
         });*/
        if (tableInputName == "params.faultType") {
            $("#faultType").val(value);
        } else if (tableInputName == "params.faultLevel") {
            $("#faultLevel").val(value);
        }
        $(obj).parent("ul").siblings("input").val(value);
    }
    layer.load(0, 2);
    if (currentPage >= 0) {
        $("#currentPage").val(currentPage);
    }

    curOtherPage = currentPage;


    $("#processStatus").val($("#faultStatus").val());
    $.ajax({
        url: "psFaultAction_getPsFaultList",
        type: "post",
        //提交方式：post、get
        dataType: "html",
        //后台返回的响应数据形式json、xml、html、text、script、_default
        data: {
            "params.psId": $("#psId").val(),
            "params.device_type": deviceType,
            "params.curPage": curOtherPage,
            "params.size": sizePage,
            "params.startTime": $("#startTime").val(),
            "params.endTime": $("#endTime").val(),
            "params.faultType": $("#faultType").val(),
            //"params.faultType1": faultType1,
            "params.faultLevel": $("#faultLevel").val(),
            //"params.faultType2": faultType2,
            "params.fault_code": fault_code,
            "params.fault_name": fault_name,
            //"params.faultStatus": $("#" +
            //    "" +
            //    "").val(),
            "params.faultStatus": $("#faultStatus").val(),//added 2016 0426
            "params.ps_key": psKey
        },

        //提交form表单的形式传送参数， #searchForm为表单的ID
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        //指定浏览器传输form表单参数时采用的字符集
        cache: false,
        timeout: 1000 * 30,
        beforeSend: function () {
            $(".problem_dialogC h1").hide();
        },
        success: function (data) { //响应成功后执行的方法体
            $("#tabDiv").html(data);
            $("#advice").html($("#advice_1").val());

            $("#prompt").html($("#prompt_1").val());

            $("#warn").html($("#warn_1").val());

            $("#fault").html($("#fault_1").val());
            // batchCheck();
            //$("#faultLevel").val("");
            //$("#faultStatus").val("");
            if (document.getElementById('ListCount')) {
                rowCount1 = document.getElementById('ListCount').value;
            }
            if (rowCount1 > 0) {
                document.getElementById('Paginationother').style.display = '';
                document.getElementById('Searchresultother').style.display = '';
                startPageFlag = false;
                if (curOtherPage > 1 && rowCount1 <= (curOtherPage - 1) * sizePage) {//总数小于页数*当前页码，页码自动减一
                    curOtherPage = curOtherPage - 1;
                }
                pageList(); //必须放在success里，要等待success执行结果后才能执行
            } else {
                clearDetailMessage();//没有记录，清空数据。
                document.getElementById('Paginationother').style.display = 'none';
                document.getElementById('Searchresultother').style.display = 'none';
            }
            // 更改表头显示
            changeHeadDisplay();
            //初始化确认关闭按钮的状态
            $("#batchConfirmBtn").css("background-color", "#C0C0C0");
            $("#batchCloseBtn").css("background-color", "#C0C0C0");
            flag1 = 0;
            flag2 = 0;
            flag3 = 0;
            flag4 = 0;
            flag5 = 0;
            //选中记录行
            //$("#refreshTB table tr:eq(" + refreshTBClickedRowIndex + ")").trigger("click");
            clearDetailMessage();
            layer.closeAll();
        },
        error: function () { //响应错误后执行的方法体
            layer.closeAll();
            //top.asyncbox.alert("查询失败","信息提示");
            Sungrow.showMsg({
                container: {
                    header: LANG["all_station_prompt"],
                    content: LANG["all_station_requesttimeout"],
                    noFn: true,
                    noText: LANG["pro_management_determine"]
                },
                fixed: false
            });

        }

    });
}


var exportStr = "";
function changeHeadDisplay() {
    var typeInHtml = "";
    var levelInHtml = "";
    var statusInHtml = "";
    var faultTypeValue = $("#faultType").val();
    var faultLevelValue = $("#faultLevel").val();
    var faultStatusVaue = $("#faultStatus").val();
    // 故障类型
    if (faultTypeValue == 1) {
        typeInHtml = LANG["all_station_fault"];
    } else if (faultTypeValue == 2) {
        typeInHtml = LANG["all_station_warn"];
    } else if (faultTypeValue == 3) {
        typeInHtml = LANG["all_station_prompt"];
    } else if (faultTypeValue == 4) {
        typeInHtml = LANG["all_station_advice"];
    } else {
        typeInHtml = LANG["all_station_faulttype"];
    }

    exportStr = typeInHtml;
    typeInHtml = typeInHtml + '<em class="proTriangle"></em>';
    //2016 09 14 wangli 告警管理 table头部 下拉框无法同步bug修改
    $("#faultTableHead").find("th:eq(1)>a").html(typeInHtml);
    //$("#refreshTB").find("th:eq(1)>a").html(typeInHtml);

    //故障级别
    if (faultLevelValue == 1) {
        levelInHtml = LANG["all_station_levelone"];
    } else if (faultLevelValue == 2) {
        levelInHtml = LANG["all_station_leveltwo"];
    } else if (faultLevelValue == 3) {
        levelInHtml = LANG["all_station_levelthree"];
    } else if (faultLevelValue == 4) {
        levelInHtml = LANG["all_station_levelfour"];
    } else if (faultLevelValue == 5) {
        levelInHtml = LANG["all_station_levelfive"];
    } else {
        levelInHtml = LANG["all_station_faultlevel"];
    }
    exportStr = exportStr + "," + levelInHtml;

    levelInHtml = levelInHtml + '<em class="proTriangle"></em>';
    //2016 09 14 wangli 告警管理 table头部 下拉框无法同步bug修改
    $("#faultTableHead").find("th:eq(2)>div>a").html(levelInHtml);
    //$("#refreshTB").find("th:eq(1)>a").html(typeInHtml);

    //状态
    if (faultStatusVaue == 1) {
        statusInHtml = LANG["all_station_notrecognize"];
    } else if (faultStatusVaue == 2) {
        statusInHtml = LANG["all_station_waithand"];
    } else if (faultStatusVaue == 3) {
        statusInHtml = LANG["all_station_processing"];
    } else if (faultStatusVaue == 4) {
        statusInHtml = LANG["all_station_settled"];
    } else if (faultStatusVaue == 9) {
        statusInHtml = LANG["all_station_closed"];
    } else if (faultStatusVaue == 8) {
        statusInHtml = LANG["pro_management_not_closed"];
    } else {
        statusInHtml = LANG["all_station_processstatus"];
    }

    exportStr = exportStr + "," + LANG["knowledge_fault_name"] + "," + LANG["pro_management_device_interval"] + "," + LANG["pro_management_equipment"] + "," + statusInHtml + "," + LANG["pro_management_time"];
    statusInHtml = statusInHtml + '<em class="proTriangle"></em>';
    //2016 09 14 wangli 告警管理 table头部 下拉框无法同步bug修改
    $("#faultTableHead").find("th:eq(6)>div>a").html(statusInHtml);
    //$("#refreshTB").find("th:eq(1)>a").html(typeInHtml);
}

function pageList() {
    sizePage = getPageNum($("#pageId").val());
    var initPagination = function () {
        var num_entries = rowCount1;
        var paramArray = [];
        paramArray.push(num_entries);
        paramArray.push(sizePage);
        // 创建分页
        $("#Paginationother").pagination(num_entries, {
            num_edge_entries: 1,
            //边缘页数
            current_page: curOtherPage - 1,
            num_display_entries: 4,
            //主体页数
            callback: pageselectCallback,
            items_per_page: sizePage,
            //每页显示1项
            prev_text: LANG["all_station_previouspage"],
            next_text: LANG["all_station_nextpage"],
            /**start 2016 07 06 wangli 添加跳页操作**/
            page_jump: formatString(LANG["common_pagejump"]),
            page_confirm: formatString(LANG["common_confirm"]),
            /**end 2016 07 06**/
            page_message: formatString(LANG["common_pagemessage"], paramArray, sizePage)
        });
    };

    function pageselectCallback(page_index, jq) {
        var new_content = $("#hiddenresultother div.result:eq(" + page_index + ")").clone();
        $("#Searchresultother").empty().append(new_content); //装载对应分页的内容
        curOtherPage = page_index + 1;
        if (startPageFlag) { //不是点击分页按钮的时候不调用changePage方法
            doChangePage();
        }
        startPageFlag = true;
        return false;
    }

    //ajax加载
    initPagination();
}

//点击分页按钮后重新显示列表
function doChangePage(isLoad) {
    if (isLoad) {//选择页数，调整为首页

        //start 2016 07 06 wangli
        current_paged = '';
        //end
        curOtherPage = 1;
        $("#curPage").val(curOtherPage);
    }
    sizePage = $("#pageNum option:selected").val();
    /*var str = $(".range-slider").val();
     var str1 = str.split(",")[0];
     var str2 = str.split(",")[1];
     var faultType1 = 4;
     var faultType2 = 1;
     if(str1>25 && str1<=50){
     faultType1 = 3;
     }else if(str1>50 && str1<=75){
     faultType1 = 2;
     }else if(str1>75 && str1<=100){
     faultType1 = 1;
     }

     if(str2>50 && str2<=75){
     faultType2 = 2;
     }else if(str2>25 && str2<=50){
     faultType2 = 3;
     }else if(str2>=0 && str2<=25){
     faultType2 = 4;
     }
     */
    var fault_code = $("#fault_code").val();
    if (fault_code == LANG["pro_management_input_fault_number"]) {
        fault_code = "";
    }

    refreshTBClickedRowIndex = 1;
    layer.load(0, 2);
    $.ajax({
        url: "psFaultAction_getPsFaultList",
        async: true,
        cache: false,
        type: "post",
        //提交方式：post、get
        dataType: "html",
        //后台返回的响应数据形式json、xml、html、text、script、_default
        data: {
            "params.psId": $("#psId").val(),
            "params.device_type": deviceType,//2016 05 14 添加了该参数的限制
            "params.curPage": curOtherPage,
            "params.size": sizePage,
            "params.startTime": $("#startTime").val(),
            "params.endTime": $("#endTime").val(),
            "params.faultType": $("#faultType").val(),
            //"params.faultType1": faultType1,
            //"params.faultType2": faultType2,
            "params.fault_name": $("#fault_name").val(),
            "params.fault_code": fault_code,
            "params.faultLevel": $("#faultLevel").val(),
            "params.faultStatus": $("#faultStatus").val(),
            "params.ps_key": psKey
        },
        //提交form表单的形式传送参数， #searchForm为表单的ID
        timeout: 1000 * 15,
        beforeSend: function () {
            $(".problem_dialogC h1").hide();
        },
        success: function (data) { //响应成功后执行的方法体
            $("#tabDiv").html(data);
            changeHeadDisplay();
            //showFaultType(str1,str2);
            //初始化确认关闭按钮的状态
            $("#batchConfirmBtn").css("background-color", "#C0C0C0");
            $("#batchCloseBtn").css("background-color", "#C0C0C0");
            flag1 = 0;
            flag2 = 0;
            flag3 = 0;
            flag4 = 0;
            flag5 = 0;
            //选中记录行
            //$("#refreshTB table tr:eq(" + refreshTBClickedRowIndex + ")").trigger("click");
            layer.closeAll();
        },
        error: function () { //响应错误后执行的方法体
            //top.asyncbox.alert("查询失败","信息提示");
            layer.closeAll();
            Sungrow.showMsg({
                container: {
                    header: LANG["all_station_prompt"],
                    content: LANG["all_station_requesttimeout"],
                    noFn: true,
                    noText: LANG["pro_management_determine"]
                },
                fixed: false
            });
        }
    });
    if (isLoad) {
        var user_account = $("#a").val();
        var pageId = $("#pageId").val();//设置公用的页面数量
        setCookie(user_account + "_" + pageId + "_pNum", sizePage, 30);
        startPageFlag = false;
        pageList();
    }

    //start 2016 07 06 wangli
    //alert("111122222::" + curOtherPage);
    $("#pageChange").val(curOtherPage);
//	end
}

var dialog;

function showFaultDialog() {
    var url = ctx + '/psFaultAction_toPsFaultAdd?params.planId=' + 0 + "&params.psid=" + $("#psId").val();
    layer.open({
        type: 2,
        title: LANG["all_station_reportfault"],
        shadeClose: true,
        shade: 0.5,
        maxmin: true, //开启最大化最小化按钮
        area: ['720px', '590px'],
        content: url
    });
}

function showConfirmDialog(ps_id) {
    /*top.asyncbox.open({
     url: ctx + '/jsp/portal/psFault/psFaultConfirm.jsp?ps_id=' + ps_id,
     args: 'params.planId=' + 0,
     title: '',
     modal: true,
     width: 660,
     height: 578,
     title: LANG["all_station_confirmfault"]
     },
     window);*/

    var url = ctx + '/jsp/portal/psFault/psFaultConfirm.jsp?ps_id=' + ps_id;
    layer.open({
        type: 2,
        title: LANG["all_station_confirmfault"],
        shadeClose: true,
        shade: 0.5,
        maxmin: true, //开启最大化最小化按钮
        area: ['660px', '578px'],
        content: url
    });

}

//故障详细页面
function showFaultDetailPage(faultCode, psKey) {
    /* top.asyncbox.open({
     url: ctx + '/jsp/portal/psFault/psFaultDetail.jsp',
     args: 'faultCode=' + faultCode,
     title: '',
     modal: true,
     width: 660,
     height: 540,
     title: LANG["all_station_faultdetial"]
     },
     window);*/
    var url = ctx + '/jsp/portal/psFault/psFaultDetail.jsp?faultCode=' + faultCode;
    layer.open({
        type: 2,
        title: LANG["all_station_faultdetial"],
        shadeClose: true,
        shade: 0.5,
        maxmin: true, //开启最大化最小化按钮
        area: ['700px', '600px'],
        content: url
    });

}

/****************   知识库详细页面   裴习柱  add  2016-10-24   start  *******************/

function forwardKnowledgePage(kId, kName) {
    /*top.asyncbox.open({
     url: ctx + '/psFaultAction_getFaultKnowledgeInfo',
     args: 'operation_id='+ kId,
     title: '',
     modal: true,
     width: 1100,
     height: 600,
     title: LANG["knowledge_faultWarn"]
     },
     window);*/

    var url = ctx + '/psFaultAction_getFaultKnowledgeInfo?operation_id=' + kId;
    layer.open({
        type: 2,
        title: LANG["knowledge_faultWarn"],
        shadeClose: true,
        shade: 0.5,
        maxmin: true, //开启最大化最小化按钮
        area: ['1100px', '600px'],
        content: url
    });

    getNumber(kId, kName);
}

function getNumber(kId, kName) {
    layer.load(0, 2);
    $.ajax({
        url: ctx + "/knowledgeBaseAction_likeTemplateOrNot",
        type: "post",
        //提交方式：post、get
        dataType: "json",
        //后台返回的响应数据形式json、xml、html、text、script、_default
        data: {
            "opt_id": kId,
            "kName": kName
        },
        //提交form表单的形式传送参数， #searchForm为表单的ID
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        //指定浏览器传输form表单参数时采用的字符集
        cache: false,
        timeout: 1000 * 15,
        success: function (data) { //响应成功后执行的方法体
            layer.closeAll();
            // 引用次数
            var number = data.temptInfo.likesTimes;
            $("#number").text(number);
            $("#number").html("456");
            $("#number").val("789");
            var userLike = data.temptInfo.userLike;
            if (userLike == "1") {
                //document.getElementById("checkbox").checked = true;
                $("#checkbox").checked = true;
            }
        },
        error: function () { //响应错误后执行的方法体
            layer.closeAll();
            top.Sungrow.showMsg({
                container: {
                    header: LANG["all_station_prompt"],
                    content: LANG["all_station_requesttimeout"],
                    noFn: true,
                    noText: LANG["pro_management_determine"]
                },
                fixed: false,
                callback: closeCurrentDialog
            });
        }
    });
}

function closeCurrentDialog() {
    var dialog = frameElement.api;
    dialog.close();
}

//关闭详情页面
function close() {
    closeCurrentDialog();
}

/*function forwardKnowledgePage(kId, kName) {
 top.asyncbox.open({
 url: ctx + '/jsp/portal/psFault/faultKnowledgeInfo.jsp',
 args: 'kId='+ kId+'&kName='+kName,
 title: '',
 modal: true,
 width: 660,
 height: 570,
 title: LANG["knowledge_faultWarn"]
 },
 window);
 }*/
/****************   知识库详细页面   裴习柱  add  2016-10-24   end  *******************/

function showCloseDialog() {
    /*top.asyncbox.open({
     url: ctx + '/jsp/portal/psFault/psFaultClose.jsp',
     args: 'params.planId=' + 0,
     title: '',
     modal: true,
     width: 660,
     height: 578,
     title: LANG["all_station_closefault"]
     },
     window);*/

    var url = ctx + '/jsp/portal/psFault/psFaultClose.jsp?params.planId=' + 0;
    layer.open({
        type: 2,
        title: LANG["all_station_closefault"],
        shadeClose: true,
        shade: 0.5,
        maxmin: true, //开启最大化最小化按钮
        area: ['660px', '578px'],
        content: url
    });

}

function batchPro(flag) {
    if ($("#isOperate").length == 0) {
        return;
    }
    if (flag == 1 && ($("#batchConfirmBtn").css("background-color") == "rgb(192, 192, 192)")) {
        return;
    } else if (flag == 9 && ($("#batchCloseBtn").css("background-color") == "rgb(192, 192, 192)")) {
        return;
    }

    var ids = getCheckedItems("batchIds");
    var array = ids.split(",");
    var isStr = "";
    var nameStr = "";
    var devNameStr = "";
    var faultTypeStr = "";
    var faultPsKey = "";
    var faultCreateTime = "";
    var faultType = "";       //ChuD 2016-06-11 批量确认
    var psName = "";       //ChuD 2016-06-22 批量确认 - 电站名丢失
    for (var i = 0; i < array.length; i++) {
        var idArray = array[i].split("_-");
        isStr += idArray[0] + ",";
        nameStr += idArray[1] + ",";
        devNameStr += idArray[3] + ",";
        faultTypeStr += idArray[4] + ",";
        faultPsKey += idArray[5] + ",";
        faultCreateTime += idArray[6] + ",";
        faultType += idArray[7] + ",";
        psName += idArray[8] + ",";
    }
    batchFaultId = isStr.substring(0, isStr.length - 1);
    batchFaultCode = isStr.substring(0, isStr.length - 1);
    batchFaultName = nameStr.substring(0, nameStr.length - 1);
    batchDeviceName = devNameStr.substring(0, devNameStr.length - 1);
    batchFaultLevel = faultTypeStr.substring(0, faultTypeStr.length - 1);
    batchFaultPsKey = faultPsKey.substring(0, faultPsKey.length - 1);
    batchFaultCreateTime = faultCreateTime.substring(0, faultCreateTime.length - 1);
    batchFaultTypes = faultType.substring(0, faultType.length - 1);
    batchpsNames = psName.substring(0, psName.length - 1);
    if (flag == 1) {
        showConfirmDialog($("#psId").val());
    } else {
        showCloseDialog();
    }
}

var flag1 = 0;
var flag2 = 0;
var flag3 = 0;
var flag4 = 0;
var flag5 = 0;

function changeColor(obj, num) {
    if ($("#isOperate").length == 0) {
        return;
    }
    if (obj.checked) {
        if ($("#process_status" + num).find("span").text() == LANG["all_station_waithand"]) {
            flag1++;
        } else if ($("#process_status" + num).find("span").text() == LANG["all_station_closed"]) {
            flag2++;
        } else if ($("#process_status" + num).find("span").text() == LANG["all_station_notrecognize"]) {
            flag3++;
        } else if ($("#process_status" + num).find("span").text() == LANG["all_station_processing"]) {
            flag4++;
        } else if ($("#process_status" + num).find("span").text() == LANG["all_station_settled"]) {
            flag5++;
        }
    } else {
        if ($("#process_status" + num).find("span").text() == LANG["all_station_waithand"]) {
            flag1--;
        } else if ($("#process_status" + num).find("span").text() == LANG["all_station_closed"]) {
            flag2--;
        } else if ($("#process_status" + num).find("span").text() == LANG["all_station_notrecognize"]) {
            flag3--;
        } else if ($("#process_status" + num).find("span").text() == LANG["all_station_processing"]) {
            flag4--;
        } else if ($("#process_status" + num).find("span").text() == LANG["all_station_settled"]) {
            flag5--;
        }
    }

    //只有这种情况才能点击批量确认
    if (flag3 > 0 && flag1 <= 0 && flag2 <= 0 && flag4 <= 0 && flag5 <= 0) {
        $("#batchConfirmBtn").css("background-color", "#ff9966");
        $("#batchCloseBtn").css("background-color", "#ff9966");
    } else {
        $("#batchConfirmBtn").css("background-color", "#C0C0C0");
        if (flag2 > 0) {
            $("#batchCloseBtn").css("background-color", "#C0C0C0");
        } else if (flag1 <= 0 && flag2 <= 0 && flag3 <= 0 && flag4 <= 0 && flag5 <= 0) {
            $("#batchCloseBtn").css("background-color", "#C0C0C0");
        } else {
            $("#batchCloseBtn").css("background-color", "#ff9966");
        }
    }
}

//全选，全取消
function checkSelectItemsAndColor(obj, checkItemName) {

    var len = $("[name=" + checkItemName + "]:checkbox").length;
    if (obj.checked == true) {
        flag1 = flag2 = flag3 = flag4 = flag5 = 0;
        for (var i = 0; i < len; i++) { //设置选中
            $("[name=" + checkItemName + "]:checkbox").eq(i).attr("checked", 'true');
            if ($("#process_status" + i).find("span").text() == LANG["all_station_waithand"]) {
                flag1++;
            } else if ($("#process_status" + i).find("span").text() == LANG["all_station_closed"]) {
                flag2++;
            } else if ($("#process_status" + i).find("span").text() == LANG["all_station_notrecognize"]) {
                flag3++;
            } else if ($("#process_status" + i).find("span").text() == LANG["all_station_processing"]) {
                flag4++;
            } else if ($("#process_status" + i).find("span").text() == LANG["all_station_settled"]) {
                flag5++;
            }
        }
    } else {
        for (var i = 0; i < len; i++) { //取消选中
            $("[name=" + checkItemName + "]:checkbox").eq(i).removeAttr("checked");
            flag1 = flag2 = flag3 = flag4 = flag5 = 0;
        }
    }
    if ($("#isOperate").length == 0) {
        return;
    }
    //只有这种情况才能点击批量确认
    if (flag3 > 0 && flag1 <= 0 && flag2 <= 0 && flag4 <= 0 && flag5 <= 0) {
        $("#batchConfirmBtn").css("background-color", "#ff9966");
        $("#batchCloseBtn").css("background-color", "#ff9966");
    } else {
        $("#batchConfirmBtn").css("background-color", "#C0C0C0");
        if (flag2 > 0) {
            $("#batchCloseBtn").css("background-color", "#C0C0C0");
        } else if (flag1 <= 0 && flag2 <= 0 && flag3 <= 0 && flag4 <= 0 && flag5 <= 0) {
            $("#batchCloseBtn").css("background-color", "#C0C0C0");
        } else {
            $("#batchCloseBtn").css("background-color", "#ff9966");
        }
    }
}

function singlePro(flag, faultType, faultCode, faultName, deviceName, fault_level, ps_key, ps_name, ps_id, create_time, fault_type_code) {
    batchFaultName = faultName;
    batchFaultTypes = faultType;
    batchFaultCode = faultCode;
    batchDeviceName = deviceName;
    batchFaultLevel = fault_level;
    batchFaultPsKey = ps_key;
    batchFaultCreateTime = create_time;
    batchFaultTypeCode = fault_type_code;
    batchpsNames = ps_name;
    if (flag == 1) {
        showConfirmDialog(ps_id);
    } else {
        showCloseDialog();
    }
}

function batchCheck() {
    var ids = getCheckedItems("batchIds");
    if (ids == null || ids == "") {
        $("#batchConfirmBtn").hide();
        $("#batchCloseBtn").hide();
        return;
    }
    var isConfirm = true;
    var isClose = true;
    var array = ids.split(",");
    for (var i = 0; i < array.length; i++) {
        var idArray = array[i].split("_-");
        if (idArray[2] != 1) {
            isConfirm = false;
        }
        if (idArray[2] == 0) {
            isClose = false;
        }
    }
    if (isConfirm) {
        $("#batchConfirmBtn").show();
    } else {
        $("#batchConfirmBtn").hide();
    }
    if (isClose) {
        $("#batchCloseBtn").show();
    } else {
        $("#batchCloseBtn").hide();
    }
}

//故障详细
var dealName = " ";//故障处理执行人名称
function showDetail(faultId, faultName, faultCode, updateTime, content, processstatus, faultSrc, creater, processTime, operationId, deviceName, processInfo, orderId, deviceType, ps_id, ps_key, ps_name, fault_level, fault_type_code, fault_type) {
    var srcName = "";
    if (faultSrc == 1) {
        srcName = LANG["all_station_manualinspection"];
    } else if (faultSrc == 2) {
        srcName = LANG["all_station_routinemaintenance"];
    } else if (faultSrc == 3) {
        srcName = LANG["all_station_regularexperiment"];
    } else if (faultSrc == 4) {
        srcName = LANG["all_station_equipmentmaintenance"];
    } else if (faultSrc == 5) {
        srcName = LANG["all_station_equipmentoverhaul"];
    } else if (faultSrc == 6) {
        srcName = LANG["all_station_systemhints"];
    } else if (faultSrc == 7) {
        srcName = LANG["all_station_othersources"];
    }
    if (processstatus == 1) {
        $("#confirmBtn").show();
    } else {
        $("#confirmBtn").hide();
    }
    if (processstatus != 9) {
        $("#closeBtn").show();
    } else {
        $("#closeBtn").hide();
    }
    var id = "#status" + processstatus;
    $(id).addClass("on").siblings().removeClass("on");
    $("#faultId").val(faultId);
    $("#faultName").html(faultName);
    $("#faultName").attr("title", faultName);
    $("#deviceName").val(deviceName);
    //$("#faultCode").html(faultCode);
    $("#faultCode").val(faultCode);
    $("#faultCode").css("text-overflow", "ellipsis");
    $("#faultCode").attr("title", faultCode);

    $("#updateTime").html(updateTime);
    //$("#content").html(content);
    $("#faultSrc").html(srcName);
    $("#creater").html(creater);
    $("#processInfo").html(processInfo);
    $("#processTime").html(processTime);

    //工单号处理
    if (orderId) {
        //由工单号获取工单编号
        $.ajax({
            url: "psFaultAction_getOrderMessage",
            type: "post",
            //提交方式：post、get
            dataType: "html",
            //后台返回的响应数据形式json、xml、html、text、script、_default
            data: {
                "params.orderId": orderId
            },
            timeout: 1000 * 15,
            success: function (data) { //响应成功后执行的方法体
                var jsondata = eval("(" + data + ")");
                if (jsondata.length > 0) {
                    $("#orderNo").css("display", "block");
                    $("#orderNoEm").css("text-overflow", "ellipsis");
                    $("#orderNoEm").val(jsondata[0].order_code);
                    $("#orderNoEm").attr("title", jsondata[0].order_code);
                }
            },
            error: function () {
                Sungrow.showMsg({
                    container: {
                        header: LANG["all_station_prompt"],
                        content: LANG["all_station_requesttimeout"],
                        noFn: true,
                        noText: LANG["pro_management_determine"]
                    },
                    fixed: false
                });
            }
        });
    } else {
        $("#orderNoEm").html("");
        $("#orderNo").css("display", "none");
    }
    // 更改表格右边状态样式
    $(".boxlists-left ul li").removeClass("on");
    $(".boxlists-right ul li").find("input").val("");
    $(".boxlists-right ul li").find("span.boxt2").text("");

    //更改知识库提示内容
    $("#knowledge_list").empty();
    //查询知识库内容 deviceType faultName
    if (faultName != "") {
        $.ajax({
            url: "psFaultAction_getKnowLedgeListJsonData",
            type: "post",
            dataType: "json",
            data: {
                "params.faultName": faultName,
                "params.deviceType": deviceType
            },
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            //指定浏览器传输form表单参数时采用的字符集
            cache: false,
            async: false,
            timeout: 1000 * 15,
            beforeSend: function () {
                $(".problem_dialogC h1").hide();
            },
            success: function (jsonObj) { //响应成功后执行的方法体
                var fault_code = faultCode;
                //  var fault_type_code =
                var device_name = deviceName;
                var fault_src = faultSrc;
                var create_time = processTime;
                var type_name = faultName;
                $.each(jsonObj,
                    function (i, obj) {
                        if (i < 6) {
                            var kId = obj.operation_id;
                            var kName = obj.operation_name;
                            var liHtml = '<li style="text-overflow:ellipsis;width：50%">' +  // 裴习柱   修改   2016-12-02
                                '<a href="javascript:;" style="color:#1c87ba" ' +
                                'onclick="showDetailInfoForKnowled(\'' + fault_code + '\',\'' + fault_type_code + '\',\'' + ps_name + '\',\'' + fault_level + '\',\'' + create_time + '\',\'' + device_name + '\',\'' + type_name + '\',\'' + fault_type + '\',\'' + creater + '\',\'' + fault_src + '\',\'' + ps_id + '\',\'' + ps_key + '\')">' +
                                '' + kName + '</a>' + ' ' + '<b>' + obj.number + LANG["pro_management.timesLike"] + '</b>' +
                                '</li>';
                            $("#knowledge_list").append(liHtml);

                            if (i == 0) {
                                $(".problem_dialogC h1").show();
                            }
                        } else {
                            return false;
                        }
                    });
            },
            error: function () { //响应错误后执行的方法体
                layer.closeAll();
                Sungrow.showMsg({
                    container: {
                        header: LANG["all_station_prompt"],
                        content: LANG["all_station_requesttimeout"],
                        noFn: true,
                        noText: LANG["pro_management_determine"]
                    },
                    fixed: false
                });
            }
        });
    }


    //未处理
    if (operationId == 0) {
        var flag = true;
        showflag = flag;//2016 08 30 wangli 如果为系统上报工单显示为true
        $(".boxlists-right ul li:eq(0)").find("span.boxt2").text(LANG["all_station_system"]);//2016 08 23 系统处理 改为"系统"
        $(".boxlists-right ul li:eq(0)").find("span.boxt2").attr("title", LANG["all_station_system"]);
    } else {
        var flag = false;
        showflag = flag;//2016 08 30 wangli 非系统上报工单 为false
        $(".boxlists-right ul li:eq(0)").find("span.boxt2").text(LANG["all_station_manualprocessing"]);
        $(".boxlists-right ul li:eq(0)").find("span.boxt2").attr("title", LANG["all_station_manualprocessing"]);
    }
    if (processstatus == 1) {
        $(".boxlists-left ul li:eq(0)").addClass("on");
        showProcessTimeMessage(processTime, 0);
        return;
    } else {
        showFormatProcessTimeMessage(updateTime, 0);
        if (processstatus == 2) {
            $(".boxlists-left ul li:eq(1)").addClass("on");
            showProceessMessage(processTime, processInfo, 1, false);
        } else if (processstatus == 3) {
            $(".boxlists-left ul li:eq(2)").addClass("on");
            showProceessMessage(processTime, processInfo, 2, false);
        } else if (processstatus == 4) {
            $(".boxlists-left ul li:eq(3)").addClass("on");
            showProceessMessage(processTime, processInfo, 3, false);
        } else if (processstatus == 9) {
            var sys = true;//2016 08 30
            $(".boxlists-left ul li:eq(4)").addClass("on");
            showProceessMessage(processTime, processInfo, 4, false, sys);//添加入参 标识工单是否为已关闭状态
        } else if (processstatus == 10) {//已评价
            $(".boxlists-left ul li:eq(4)").addClass("on");
            showProceessMessage(processTime, processInfo, 4, false);
        } else {
            $(".boxlists-left ul li:eq(1)").addClass("on");
        }
    }
    // 待处理者
    var waitHandleName = "";
    var waitHandleTime = "";
    var waitHandleNextUser = "";
    // 处理中
    var handlingName = "";
    var handlingTime = "";
    var handlingNextUser = "";
    // 已解决
    var solvedName = "";
    var solvedTime = "";
    var solvedNextUser = "";
    // 工单流程信息取得并显示
    if (orderId) {
        $.ajax({
            url: "psFaultAction_getOrderStepList",
            type: "post",
            dataType: "html",
            data: {
                "params.orderId": orderId
            },
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            //指定浏览器传输form表单参数时采用的字符集
            cache: false,
            async: false,
            timeout: 1000 * 15,
            success: function (data) { //响应成功后执行的方法体
                var jsonObj = eval("(" + data + ")");
                $.each(jsonObj,
                    function (i, obj) {
                        if (obj.stepstatus == "2" || obj.stepstatus == "1") { // 待处理者
                            waitHandleName = obj.stepusername;
                            waitHandleTime = obj.steptime;
                            waitHandleNextUser = obj.nextstepusername;
                        } else if (obj.stepstatus == "3") {//处理中
                            handlingName = obj.stepusername;
                            handlingTime = obj.steptime;
                            handlingNextUser = obj.nextstepusername;
                        } else if (obj.stepstatus == "4") { //维修完成
                            solvedName = obj.stepusername;
                            solvedTime = obj.steptime;
                            solvedNextUser = obj.nextstepusername;
                        }
                    });
            },
            error: function () { //响应错误后执行的方法体
                layer.closeAll();
                Sungrow.showMsg({
                    container: {
                        header: LANG["all_station_prompt"],
                        content: LANG["all_station_requesttimeout"],
                        noFn: true,
                        noText: LANG["pro_management_determine"]
                    },
                    fixed: false
                });
            }
        });
    }
    if (waitHandleName) {
        dealName = waitHandleName;
        showProceessMessage(waitHandleTime, waitHandleName + LANG["all_station_approvedfaultworkorders"] + "," + LANG["all_station_nextexecutive"] + ":" + waitHandleNextUser, 1, true);
    }

    if (handlingName) {
        dealName = waitHandleName;
        showProceessMessage(handlingTime, handlingName + LANG["all_station_confirmedmaintenancefault"] + "," + LANG["all_station_nextexecutive"] + ":" + handlingNextUser, 2, true);
    }

    if (solvedName) {
        dealName = waitHandleName;
        showProceessMessage(solvedTime, solvedName + LANG["all_station_resolvedequipmentfailure"] + "," + LANG["all_station_nextexecutive"] + ":" + solvedNextUser, 3, true);
    }
}

//没有故障数据时清空详情信息
function clearDetailMessage() {
    $("#faultId").val("");
    $("#faultName").html("");
    $("#faultName").attr("title", "");
    $("#deviceName").val("");
    $("#faultCode").html("");
    $("#faultCode").css("text-overflow", "ellipsis");
    $("#faultCode").attr("title", "");
    $("#orderNoEm").html("");
    $("#orderNoEm").attr("title", "");

    $("#faultCode").val("");
    $("#orderNoEm").val("");

    $("#updateTime").html("");
    $("#faultSrc").html("");
    $("#creater").html("");
    $("#processInfo").html("");
    $("#processTime").html("");

    $(".boxlists-right ul li").find("input").val("");
    $(".boxlists-right ul li").find("span.boxt2").text("");

    $(".boxlists-left ul li").removeClass("on");
    $(".boxlists-right ul li").find("span.boxt2").text("");
    $(".boxlists-right ul li").find("span.boxt2").attr("title", "");

    $("#knowledge_list").empty();
}
// timeLengthFlag为true时，表示长时间格式
function showProceessMessage(processTime, processInfo, processStatusIndex, timeLengthFlag, flag) {//2016 08 30 wangli flag 添加工单是否为已关闭状态标识
    if (timeLengthFlag) {
        showFormatProcessTimeMessage(processTime, processStatusIndex);
    } else {
        showProcessTimeMessage(processTime, processStatusIndex);
    }
    //2016 08 24 如果是系统申报的故障  则"已关闭"显示"系统
    if (flag && showflag) {//如果是系统处理的工单 并且工单是已关闭状态 则已关闭的时候显示"系统" 2016 08 30 修改 wangli
        $(".boxlists-right ul li:eq(" + processStatusIndex + ")").find("span.boxt2").text(LANG["all_station_system"]);
        $(".boxlists-right ul li:eq(" + processStatusIndex + ")").find("span.boxt2").attr("title", LANG["all_station_system"]);
    } else {
        $(".boxlists-right ul li:eq(" + processStatusIndex + ")").find("span.boxt2").text(dealName);
        $(".boxlists-right ul li:eq(" + processStatusIndex + ")").find("span.boxt2").attr("title", processInfo);
        dealName = '';
    }

}

// 状态栏时间信息更新显示 没有格式化的时间：20150630123432
function showProcessTimeMessage(processTime, processStatusIndex) {

    if (processTime) {
        //2016 09 10故障详情 时间精确到秒显示 wangli
        if (processTime.length > 12) {
            var shortTime = processTime.substring(0, 4) + "-" + processTime.substring(4, 6);
            var longTime = shortTime + "-" + processTime.substring(6, 8) + " " + processTime.substring(8, 10) + ":" + processTime.substring(10, 12) + ":" + processTime.substring(12, 15);
        }
        else if (processTime.length <= 12) {
            var shortTime = processTime.substring(0, 4) + "-" + processTime.substring(4, 6);
            var longTime = shortTime + "-" + processTime.substring(6, 8) + " " + processTime.substring(8, 10) + ":" + processTime.substring(10, 12);
        }
        //2016 08 05 wangli  去掉图标 直接显示时间
        $(".boxlists-right ul li:eq(" + processStatusIndex + ")").find("input").val(longTime);
        //    2016 09 14 1366分辨率下 显示不全
        $(".boxlists-right ul li:eq(" + processStatusIndex + ")").find("input").attr("title", longTime);

    }

}

// 状态栏时间信息更新显示 有格式化的时间：2015-06-30 12:34:12
function showFormatProcessTimeMessage(processTime, processStatusIndex) {
    //2016 08 05 wangli 告警管理  去掉图标显示  直接显示时间
    if (processTime) {
        $(".boxlists-right ul li:eq(" + processStatusIndex + ")").find("input").val(processTime);
        $(".boxlists-right ul li:eq(" + processStatusIndex + ")").find("input").attr("title", processTime);

    }

}

//知识库页面跳转
/*function forwardKnowledgePage(kId, kName) {
 top.location.href = encodeURI(ctx + "/jsp/portal/psKnowledgeBase/psKnowledgeBase.jsp?kId=" + kId + "&kName=" + kName);
 }*/


/*function forwardKnowledgePage(kId, kName) {
 var data={};
 data.title=LANG["knowledge_editing_knowledge_base"];
 data.src=ctx+ "/psFaultAction_getOrderStepList?kId="+kId+"&kName="+kName;
 parent.showBox(data);
 }*/


function operUser() {
    searchUser(1);
    $("#userDialog").show();
}

function closeDialog() {
    layer.close(dialog);
}

$(function () {
    var cw = $(window).width();
    if (cw <= 1570 && cw > 1340) {
        $(".myStat").attr('data-dimension', '320');
    } else if (cw <= 1340) {
        $(".myStat").attr('data-dimension', '280');
    }
    $(".secondnav li").hover(function () {
            $(this).find(".secondnav_bg").fadeIn(200);
        },
        function () {
            $(this).find(".secondnav_bg").fadeOut(200);
        });

    //加减切换
    $(".siteMore_tit_btn").click(function () {
        $(".siteMore_tit_btn").text('+');
        $(".siteMore_div").hide();
        $(this).text('-');
        $(this).parent().parent().find(".siteMore_div").show();
    });
});

$(function () {
    $(document).bind("click",
        function (e) {
            var target = $(e.target); //获取当前对象
            //故障列表页面筛选下拉,点击空白隐藏
            if (target.closest(".problem_con th a").length == 0) {
                $(".problem_con th ul").hide();
            } else {
                var chooseIndex = target.closest(".problem_con th a").attr("chooseIndex");
                $.each($(".problem_con th a[chooseIndex]"),
                    function (i, v) {
                        if (chooseIndex != $(v).attr("chooseIndex")) {
                            $(v).parent().find("ul").hide();
                        }
                    });
            }

        });

    var hasSideBar = $(".secondnav").html();
    if (!hasSideBar) {
        $(".map_wap").css({
            "padding": "30px 0 0 2.833%"
        });
    }

    //故障列表页面筛选下拉
    $(".problem_con th").find("a").live("click",
        function () {
            var p_ul_h = $(".problem_con th").find("ul").is(":hidden");
            if (p_ul_h) {
                $(this).siblings("ul").show();
            } else {
                $(this).siblings("ul").hide();
            }
        });

    //判断故障列表页面展开表格的高度来调整增加滚动条后的表格宽度
    if ($(".problem_T2").children("table").height() > 180) {
        $(".problemaaa").parent().css({
            "width": "9.5%"
        });
    } else {
        $(".problemaaa").parent().css({
            "width": "11.11% !important"
        });
    }

    //故障列表页面点击图标，子div显示
    $(".problem_T2").parent().parent("tr").css({
        "display": "none"
    });
    $(".problem_con tr").find(".problem_pic1").live("click",
        function () {
            var problem_T2 = $(this).parent().parent().next("tr").find(".problem_pic1").is(":hidden");
            if (problem_T2) {
                $(this).children("input").attr({
                    src: ctx + "/resources/portal/images/problem_pic2.png"
                });
                $(this).parent().parent().addClass("problem_T2Hover");
                $(this).parent().parent().next("tr").show();
            } else {
                $(this).children("input").attr({
                    src: ctx + "/resources/portal/images/problem_pic1.png"
                });
                $(this).parent().parent().removeClass("problem_T2Hover");
                $(this).parent().parent().next("tr").hide();
            }

        });

    //故障列表页面点击X图标，删除行
    $(".problemaaa").live("click",
        function () {
            $(this).parent().parent().remove();
            if ($(this).parent().parent().parent().parent().height() >= 180) {
                $(this).parent("td").css({
                    "width": "9.5%"
                });
            } else {
                $(this).parent("td").css({
                    "width": "11.11%"
                });
            }
        });

});

/*---------------图片拖拽效果--------------------------*/
/*绑定事件*/
function addEvent(obj, sType, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(sType, fn, false);
    } else {
        obj.attachEvent('on' + sType, fn);
    }
}
function removeEvent(obj, sType, fn) {
    if (obj.removeEventListener) {
        obj.removeEventListener(sType, fn, false);
    } else {
        obj.detachEvent('on' + sType, fn);
    }
}
function prEvent(ev) {
    var oEvent = ev || window.event;
    if (oEvent.preventDefault) {
        oEvent.preventDefault();
    }
    return oEvent;
}
/*添加滑轮事件*/
function addWheelEvent(obj, callback) {
    if (window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
        addEvent(obj, 'DOMMouseScroll', wheel);
    } else {
        addEvent(obj, 'mousewheel', wheel);
    }
    function wheel(ev) {
        var oEvent = prEvent(ev),
            delta = oEvent.detail ? oEvent.detail > 0 : oEvent.wheelDelta < 0;
        callback && callback.call(oEvent, delta);
        return false;
    }
}
/*页面载入后*/
window.onload = function () {
    var oImg = document.getElementById('oImg');
    /*拖拽功能*/
    (function () {
        addEvent(oImg, 'mousedown',
            function (ev) {
                var oEvent = prEvent(ev),
                    oParent = oImg.parentNode,
                    disX = oEvent.clientX - oImg.offsetLeft,
                    disY = oEvent.clientY - oImg.offsetTop,
                    startMove = function (ev) {
                        if (oParent.setCapture) {
                            oParent.setCapture();
                        }
                        var oEvent = ev || window.event,
                            l = oEvent.clientX - disX,
                            t = oEvent.clientY - disY;
                        oImg.style.left = l + 'px';
                        oImg.style.top = t + 'px';
                        oParent.onselectstart = function () {
                            return false;
                        }
                    },
                    endMove = function (ev) {
                        if (oParent.releaseCapture) {
                            oParent.releaseCapture();
                        }
                        oParent.onselectstart = null;
                        removeEvent(oParent, 'mousemove', startMove);
                        removeEvent(oParent, 'mouseup', endMove);
                    };
                addEvent(oParent, 'mousemove', startMove);
                addEvent(oParent, 'mouseup', endMove);
                return false;
            });
    })();
    /*以鼠标位置为中心的滑轮放大功能*/
    (function () {
        addWheelEvent(oImg,
            function (delta) {
                var ratioL = (this.clientX - oImg.offsetLeft) / oImg.offsetWidth,
                    ratioT = (this.clientY - oImg.offsetTop) / oImg.offsetHeight,
                    ratioDelta = !delta ? 1 + 0.1 : 1 - 0.1,
                    w = parseInt(oImg.offsetWidth * ratioDelta),
                    h = parseInt(oImg.offsetHeight * ratioDelta),
                    l = Math.round(this.clientX - (w * ratioL)),
                    t = Math.round(this.clientY - (h * ratioT));
                with (oImg.style) {
                    width = w + 'px';
                    height = h + 'px';
                    left = l + 'px';
                    top = t + 'px';
                }
            });
    })();

};
$(function () {
    $(".map_con_fl li").toggle(function () {
            $(this).children(".item1").show();
        },
        function () {
            $(this).children(".item1").hide();
        });
    $(".item1 li").toggle(function () {
            $(this).children(".item2").show();
        },
        function () {
            $(this).children(".item2").hide();
        });
    $(".item2 li").toggle(function () {
            $(this).children(".item3").show();
        },
        function () {
            $(this).children(".item3").hide();
        });
});


function funccc() {
    $dp.$('week').value = $dp.cal.getP('y') + $dp.cal.getP('W', LANG["all_station_yearof"] + 'WW' + LANG["all_station_week"]);
    var currenttime = $dp.cal.getP('y') + "-" + $dp.cal.getP('M') + "-" + $dp.cal.getP('d');
    $("#currenttime").val(currenttime);
}
$(function () {

    //刷新时间未点击时灰色
    $(".abcd").css({
        "opacity": "0.7"
    });
    $(".abcd em").css({
        "opacity": "0.7"
    });
    $(".allsite_dateriCheckbox").click(function () {
        if ($(".allsite_dateriCheckbox").attr("checked") == 'checked') {
            $(".abcd").css({
                "opacity": "1"
            });
            $(".abcd em").css({
                "opacity": "1"
            });
        } else {
            $(".abcd").css({
                "opacity": "0.7"
            });
            $(".abcd em").css({
                "opacity": "0.7"
            })
        }

    });

    $(".allsite_datej a").click(function () {
        var ch = $(this).parent().attr("ch");
        var date_em1 = $(this).parent().find("i").text();
        if (ch) {
            if ($(this).attr("class") == "allsite_dateUpBtn1") //+
            {
                date_em1++;
                $(this).parent().find("i").text(date_em1);
            } else {
                date_em1--;
                if (date_em1 <= 5) {
                    date_em1 = 5;
                }
                $(this).parent().find("i").text(date_em1);
            }
        } else {
            if ($(".allsite_dateriCheckbox").attr("checked") == 'checked') {

                if ($(this).attr("class") == "allsite_dateUpBtn1") //+
                {
                    date_em1++;
                    $(this).parent().find("i").text(date_em1);
                } else {
                    date_em1--;
                    if (date_em1 <= 5) {
                        date_em1 = 5;
                    }
                    $(this).parent().find("i").text(date_em1);
                }
            }
        }
        refreshTime_point();
    });
});

var faultListFullScreenflag = false;
$(function () {

    //点击全屏
    $("#change_size").unbind().bind('click',
        function () {
            if (faultListFullScreenflag) {
                closeExpandFaultList();
            } else {
                expandFaultList();
            }

        });

    //键盘“Esc”出发消失
    $(document).keyup(function (event) {
        if (faultListFullScreenflag == true) {
            switch (event.keyCode) {
                case 27:
                    closeExpandFaultList();
                    break;
                case 96:
                    break;
            }
        }
    });

    function expandFaultList() {
        //
        // 全屏显示 更改样式
        $(".secondnav").css("display", "none");
        $(".side_nav").css("display", "none");
        $(".index_top").css("display", "none");
        $(".map_select").css("display", "none");
        $(".map_con_fl").css("display", "none");
        $(".map_con_fl_page").css("display", "none");
        $("#faultPage_all").addClass("map_bg").css({
            "background-color": "#fff"
        });
        $("#faultPage_all").removeClass("clearfix lch_tendency_ri");
        $("#faultPage_all").removeClass("tendency_ri");
        $("#faultPage_all").removeClass("fr");
        $("#faultPage_all").css("width", "100%");

        $("#map_wap_div").removeClass("map_wap");
        $("#map_wap_div").css("height", "100%");
        $("#contentDiv").css("height", "100%");
        $("#contentDiv").removeClass("map_con");
        $(".index_right").removeClass("fr");
        $(".index_right").css("width", "100%");
        // 更改图标
        $("#change_size input").attr("src", ctx + "/resources/portal/images/change_size4.png");
        // 更改全屏状态
        faultListFullScreenflag = true;

        changeSize();
    }

    function closeExpandFaultList() {
        // 退出全屏状态，样式恢复
        $(".side_nav").css("display", "inline-block");
        $(".map_con_fl").css("display", "block");
        $(".secondnav").css("display", "block");
        $(".side_nav").css("display", "block");
        $(".index_top").css("display", "block");
        $(".map_select").css("display", "block");
        $(".map_con_fl").css("display", "block");
        $(".map_con_fl_page").css("display", "block");
        $("#map_wap_div").addClass("map_wap");
        $("#contentDiv").removeAttr("style");
        $("#contentDiv").addClass("map_con");

        $("#faultPage_all").removeClass("map_bg");
        $("#faultPage_all").addClass("fr");
        $("#faultPage_all").addClass("tendency_ri");
        $("#faultPage_all").addClass("clearfix lch_tendency_ri");
        $(".index_right").width($(window).width() - 85);
        $(".tendency_ri").height($(window).height() - 150);
        $(".tendency_ri").width($(window).width() - 400);
        $(".index_right").addClass("fr");
        //2017 02 21 wangli 放大缩小 功能 bug修复
        $(".just_single_show").css("display", "none ");
        // 更改图标
        $("#change_size input").attr("src", ctx + "/resources/portal/images/change_size2.png");
        //2016 10 17 wangli 告警管理  页面  最大化只能点击一次bug修改
        // 更改全屏状态
        faultListFullScreenflag = false;
        $(window).trigger("resize");


    }

    //i记录日期控件选择的时间类型：日，周，年……
    var i = 0;
    //年月日事件切换
    $(".dateWrap_tit ul li").click(function () {
        i = $(this).index();
        $(".dateWrap_tit ul li").removeClass("on");
        $(this).addClass("on");
        //var span_1 = $(".quick_date").find('span:first');
        //var span_2 = $(".quick_date").find('span:last');
        if (i == 0) //天
        {
            var yest_day = paramsStartTime;
            var tom_day = paramsEndTime;
            $("#start").val(yest_day);
            $("#end").val(tom_day);
            //isdata=0;
            tom_day = (tom_day.replace("-", "")).replace("-", "").replace(" ", "").replace(":", "");
            yest_day = (yest_day.replace("-", "")).replace("-", "").replace(" ", "").replace(":", "");
            $("#dateHid").val(yest_day + "-" + tom_day);
            //console.log((tom_day.replace("-","")).replace("-","").replace(" ","").replace(":",""));
        } else if (i == 1) //周
        {
            var now_day = GetDay();
            var week_year = getWeekNumber()[0];
            var week_num = getWeekNumber()[1];
            $("#week").val(week_year + LANG["all_station_yearof"] + week_num + LANG["all_station_week"]);
        } else if (i == 2) //月
        {
            var now_day = GetDay();
            var yest_day = GetDay(0, 0, -1);
            var year = now_day.substring(0, now_day.indexOf("-"));
            var month = now_day.substring(now_day.indexOf("-"), now_day.indexOf("-") + 3);
            $("#month").val(year + month);
        } else if (i == 3) //季度
        {
            var now_day = GetDay();
            var month = now_day.substring(now_day.indexOf("-") + 1, now_day.indexOf("-") + 3);
            var year = now_day.substring(0, now_day.indexOf("-"));
            if (month >= 1 && month <= 3) {
                $("#jidu").val(year + LANG["pro_management_year"] + LANG["pro_management_onequarter"]);
            } else if (month >= 4 && month <= 6) {
                $("#jidu").val(year + LANG["pro_management_year"] + LANG["pro_management_twoquarter"]);
            } else if (month >= 7 && month <= 9) {
                $("#jidu").val(year + LANG["pro_management_year"] + LANG["pro_management_threequarter"]);
            } else {
                $("#jidu").val(year + LANG["pro_management_year"] + LANG["pro_management_fourquarter"]);
            }
        } else if (i == 4) //年
        {
            var now_day = GetDay();
            var month = now_day.substring(now_day.indexOf("-") + 1, now_day.indexOf("-") + 3);
            var year = now_day.substring(0, now_day.indexOf("-"));
            $("#year").val(year + LANG["all_station_yeartail"]);
        }
    });

    //时间的自由选择
    $(".allsite_hour a").click(function () {
        var _class = $(this).attr("class");
        var em_obj = $(this).parent().find("em");
        var em_val = em_obj.text();
        em_val = parseInt(em_val);
        if (_class == "allsite_dateUpBtn1") //+
        {
            em_val++;
        } else {
            em_val--;
        }
        if (em_val < 10 && em_val >= 0) {
            em_val = "0" + em_val;
        } else if (em_val > 23) {
            em_val = "00";
        } else if (em_val < 0) {
            em_val = "23";
        }
        em_obj.text(em_val);
    });

    //时间确定事件
    $(".wrap_su").unbind("click").click(function () {
        if (i == 0) {
            var quick_date1 = $("#start").val();
            var quick_date2 = $("#end").val();
            $("#quick_date1").html(quick_date1);
            $("#quick_date2").html(quick_date2);
        } else if (i == 1) {
            var week = $("#week").val();
            var week_year = week.substring(0, week.indexOf(LANG["all_station_year"]));
            var week_num = week.substring(week.indexOf(LANG["all_station_no"]) + 1, week.indexOf(LANG["all_station_week"]));
            var time_curr = GetDay();

            if ($("#currenttime").val() != null && $("#currenttime").val() != "") {
                time_curr = $("#currenttime").val();
            } else {
                time_curr = time_curr.substring(0, 10);
            }
            var weeknum = getWeekDay(time_curr.split("-")[1], time_curr.split("-")[2], time_curr.split("-")[0]);
            // alert("weeknum:"+weeknum +" time_curr:"+time_curr);
            if (weeknum == LANG["all_station_sun"]) {
                $("#quick_date1").html(time_curr + " 00:00");
                $("#quick_date2").html(getDateStrAfter(time_curr, 6));
            } else if (weeknum == LANG["all_station_one"]) {
                $("#quick_date1").html(getDateStrBefore(time_curr, 1));
                $("#quick_date2").html(getDateStrAfter(time_curr, 5));
            } else if (weeknum == LANG["all_station_two"]) {
                $("#quick_date1").html(getDateStrBefore(time_curr, 2));
                $("#quick_date2").html(getDateStrAfter(time_curr, 4));
            } else if (weeknum == LANG["all_station_three"]) {
                $("#quick_date1").html(getDateStrBefore(time_curr, 3));
                $("#quick_date2").html(getDateStrAfter(time_curr, 3));
            } else if (weeknum == LANG["all_station_four"]) {
                $("#quick_date1").html(getDateStrBefore(time_curr, 4));
                $("#quick_date2").html(getDateStrAfter(time_curr, 2));
            } else if (weeknum == LANG["all_station_five"]) {
                $("#quick_date1").html(getDateStrBefore(time_curr, 5));
                $("#quick_date2").html(getDateStrAfter(time_curr, 1));
            } else if (weeknum == LANG["all_station_six"]) {
                $("#quick_date1").html(getDateStrBefore(time_curr, 6));
                $("#quick_date2").html(time_curr + " 23:59");
            }
        } else if (i == 2) {
            var month = $("#month").val();
            $("#quick_date1").html(month + "-01 00:00");
            $("#quick_date2").html(month + "-" + getlastday(month.split("-")[0], month.split("-")[1]) + " 23:59");

        } else if (i == 3) {
            var jidu = $("#jidu").val();
            var jidu_year = jidu.substring(0, jidu.indexOf(LANG["all_station_year"]));
            var jidu_num = jidu.substring(jidu.indexOf(LANG["all_station_year"]) + 1, jidu.indexOf(LANG["all_station_year"]) + 2);
            if (jidu_num == 1) {
                $("#quick_date1").html(jidu_year + "-01" + "-01 00:00");
                $("#quick_date2").html(jidu_year + "-03" + "-31 23:59");
            } else if (jidu_num == 2) {
                $("#quick_date1").html(jidu_year + "-04" + "-01 00:00");
                $("#quick_date2").html(jidu_year + "-06" + "-30 23:59");
            } else if (jidu_num == 3) {
                $("#quick_date1").html(jidu_year + "-07" + "-01 00:00");
                $("#quick_date2").html(jidu_year + "-09" + "-30 23:59");
            } else if (jidu_num == 4) {
                $("#quick_date1").html(jidu_year + "-10" + "-01 00:00");
                $("#quick_date2").html(jidu_year + "-12" + "-31 23:59");
            }

        } else if (i == 4) {
            var year = $("#year").val();
            year = year.substring(0, 4);
            $("#quick_date1").html(year + "-01-01 00:00");
            $("#quick_date2").html(year + "-12-31 23:59");
        }

        quick_date1 = $("#quick_date1").html();
        quick_date2 = $("#quick_date2").html();
        var s = quick_date1.substring(0, quick_date1.indexOf(" ")).split("-");
        var e = quick_date2.substring(0, quick_date1.indexOf(" ")).split("-");
        var startd = new Date(s[0], s[1] - 1, s[2]);
        var endd = new Date(e[0], e[1] - 1, e[2]);

        /*        if (startd > endd) {
         Sungrow.showMsg({
         container: {
         header: LANG["all_station_prompt"],
         content: LANG["all_station_starttimenotgreatercutofftime"],
         noFn: true,
         noText: LANG["pro_management_determine"]
         },
         fixed: false
         });
         return;
         }*/
        $(".dateWrap").hide();
        $("#startTime").val(quick_date1);
        $("#endTime").val(quick_date2);
        //search(1);
    });

    $(".allsite_min a").unbind("click").click(function () {
        var _class = $(this).attr("class");
        var em_obj = $(this).parent().find("em");
        var em_val = em_obj.text();
        em_val = parseInt(em_val);
        if (_class == "allsite_dateUpBtn1") //+
        {
            em_val++;
        } else {
            em_val--;
        }
        if (em_val < 10 && em_val >= 0) {
            em_val = "0" + em_val;
        } else if (em_val > 59) {
            em_val = "00";
        } else if (em_val < 0) {
            em_val = "59";
        }
        em_obj.text(em_val);
    });

    initTime();

    //时间选择显示隐藏事件
    $(".date_btn").unbind().bind("click",
        function (event) {
            var dateWrap_height = $(".dateWrap").is(":hidden");
            if (dateWrap_height) {
                $(".dateWrap").show();
            } else {
                $(".dateWrap").hide();
            }
            event.stopPropagation();
        });

    //删除事件
    $(".map_choose_on").unbind("click").live('click',function () {

            $(this).remove();
            if ($(".map_choose span").length == 1) {
                $(".map_choose_tit").hide();
            }
        });

});


/*$(document).ready(function() {
 psId='';
 if(document.getElementById('psDetail')!=null){
 initPage();
 }
 //pageQuery();
 });*/
// 翻页参数
var curPage = 1;
var currentPage = 0;
var h = $(window).height() - 75;
//var size = parseInt(h / 50);
var size = 10;
var rowCount = 0;
var powerList = null; // 全局变量，缓存电站信息
var queryFlag = false;
/**
 * 电站列表查询业务方法开始（其他模块复用）**
 */
var queryPowerData = function () {
    var obj = {};
    obj["size"] = size;
    obj["curPage"] = curPage;
    obj["ps_id"] = $("#contentDiv").parent().find("#ps_id").val();
    obj["ps_name"] = $("#contentDiv").parent().find("#ps_name").val();
    obj["ps_type"] = $("#contentDiv").parent().find("#ps_type").val();
    obj["ps_capacity"] = $("#contentDiv").parent().find("#ps_capacity").val();
    obj["area_id"] = $("#contentDiv").parent().find("#country_all").val();
    obj["install_date_start"] = $("#contentDiv").parent().find("#install_date_start").val();
    var tableJson = Dic.Ajax.request({
        url: ctx + "/psMapAction_queryPowerList",
        data: obj
    });
    return tableJson;
};

/*function pslistPage() {
 this.size = size;
 // 此demo通过Ajax加载分页元素
 var initPagination = function() {
 var num_entries = rowCount;
 // 创建分页
 $("#Pagination").pagination(num_entries, {
 num_edge_entries: 1,
 // 边缘页数
 num_display_entries: size,
 // 主体页数
 current_page: currentPage,
 callback: pageselectCallback,
 ellipse_text: "...",
 Flag: 1,
 items_per_page: size,
 // 每页显示1项
 prev_text: '<',
 next_text: ">"
 });
 };
 function pageselectCallback(page_index, jq) {
 var new_content = $("#hiddenresult div.result:eq(" + page_index + ")").clone();
 $("#Searchresult").empty().append(new_content);
 curPage = page_index + 1;
 // 装载对应分页的内容
 powerSearch();
 // 初始化显示电站故障信息
 checkCss(psId);
 // 改变是否是第一次进入的状态
 bFirstInFlag = false;
 return false;
 }
 // ajax加载
 initPagination();
 }*/

function powerSearch() {
    //displaySearchDiv(6);
    var obj = {};
    obj["size"] = size;
    obj["curPage"] = curPage;
    obj["ps_id"] = $("#contentDiv").parent().find("#ps_id").val();
    obj["ps_name"] = $("#contentDiv").parent().find("#ps_name").val();
    obj["ps_type"] = $("#contentDiv").parent().find("#ps_type").val();
    obj["ps_capacity"] = $("#contentDiv").parent().find("#ps_capacity").val();
    obj["area_id"] = $("#contentDiv").parent().find("#country_all").val();
    obj["install_date_start"] = $("#contentDiv").parent().find("#install_date_start").val();

    $.post(ctx + "/psMapAction_queryPowerList", obj, function (data) {
        powerList = data.pageList;
        rowCount = data.rowCount;
        var accordian = new DicAccordian();
        accordian.init('powerList', powerList);
    }, 'json');
}

//$(document).ready(function(){
//  psId='';
//});
function checkCss(id, count) {
    if (window.event && !fromPsView) {
        var target = window.event.target || window.event.srcElement;
        var tarNodeName = target.nodeName.toLowerCase();
        var stationLiId = "";
        if (tarNodeName == "a") {
            stationLiId = $(target).parent().attr("id");
        } else if (tarNodeName == "li") {
            stationLiId = $(target).attr("id");
        }
        //如果id是lp开头方法继续，不是返回
        if ((typeof(stationLiId) == "undefined")) {
            treeFlag = false;
        } else if (!stationLiId) {
            treeFlag = true;
        } else if (stationLiId.indexOf("lp") != 0) {
            treeFlag = true;
        } else {
            treeFlag = false;
        }
    }
    if (treeFlag) {
        //psId="";
        treeFlag = false;
        return;
    }
    var yesId = "#tps" + psId;
    var thisId = "#tps" + id;
    if (id != "" && id != undefined) {
        if ($("#selectPsId").length > 0) {
            $("#selectPsId").val(id);
        }
    }
    if (psId != id) {
        $(yesId).hide();
        $("li[id^='lp']").removeClass("on");
        //$("#lp" + psId).removeClass("on");
        $("#lp" + id).addClass("on");
        $(thisId).show();
        psKey = "";
        showTree(id, count);
    }
    //去除所有node curSelectedNode class
    $("#lp" + id).find("a").removeClass("curSelectedNode");
    // 时间控件默认选中日
    $(".dateWrap_tit ul li:eq(0)").addClass("on");
    // 初始化筛选条件：故障类型、故障级别、状态
    $("#faultType").val("");
    $("#faultLevel").val("");
    // 从请求路径中获取状态值
    var status = getQueryString("status");
    if (status && bFirstInFlag) {
        $("#faultStatus").val(status);
    } else {
        $("#faultStatus").val("8");//默认未关闭状态
    }
    $("#psId").val(id);
    psId = id;
    psName = $("#" + id).find("a").html();
    curOtherPage = 1;


    deviceType = "";
    psKey = "";
    fromPsView = false;
    //切换电站时候清空故障编号和故障名称的值 2016 05 11  故障编号;SJE-1446  建议切换电站后，去除故障号的筛选条件，否则每次切换后的数据都为空
    $("#fault_code").val('');
    $("#fault_name").val('');
    //start 2017 02  25 wangli  新增查询条件
    if ("4" == checkedstatus) {
        $("#faultStatus").val(checkedstatus);
        $("th .gaojing_td7 div").children("ul").children("li:eq(4)").find("a").show();
        //end
    }
    search(1);
}

var setting = {
    async: {
        enable: true,
        url: "psDeviceAction_getPsTreeChild",
        autoParam: ["deviceType=params.deviceType", "psLevel=params.psLevel", "psId=params.psId"],
        dataFilter: filter			//用于对 Ajax 返回数据进行预处理的函数
    },
    view: {
        dblClickExpand: false
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        onClick: onClick,
        beforeAsync: beforeAsync,
        onAsyncSuccess: onAsyncSuccess,
        onAsyncError: onAsyncError,//2016 06 06 新增
        beforeExpand: zTreeBeforeExpand
    }
};

function zTreeBeforeExpand(treeId, treeNode) {
    if (treeNode.level == 1) {
        return false;
    }

}
function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i = 0, l = childNodes.length; i < l; i++) {
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
        if (childNodes[i].psLevel == 3) {
            //var type = childNodes[i].deviceType;
            showTreeNodeImageByDeviceType(childNodes[i]);
        }
//		 if(childNodes[i].psLevel==4){
//		 	//console.log(childNodes[i].ctype);
//		 	if(childNodes[i].ctype=="1"){
//		 		childNodes[i].icon=staticUrl+"/resources/portal/images/line.png";
//		 	}else if(childNodes[i].ctype=="2"){
//		 		childNodes[i].icon=staticUrl+"/resources/portal/images/bar.png";
//		 	}else if(childNodes[i].ctype=="3"){
//		 		childNodes[i].icon=staticUrl+"/resources/portal/images/fangbo.png";
//		 	}else{
//		 		childNodes[i].icon=staticUrl+"/resources/portal/images/line.png";
//		 	}
//		}
    }
    //console.log(childNodes);
    return childNodes;
}


function onClick(e, treeId, treeNode) {
    if (treeNode.level == 1) {
        deviceType = treeNode.deviceType;
        deviceCode = treeNode.deviceCode;
        chnnlId = treeNode.chnnlId;
        psKey = $("#psId").val() + "_" + deviceType + "_" + deviceCode + "_" + chnnlId;
        deviceType = "";
        search(1);
    } else {
        deviceType = treeNode.deviceType;
        psKey = "";
        search(1);
        //zTree.expandNode(treeNode);
    }
    treeFlag = true;
}


function showTree(id, count) {

    var thisId = "#tps" + id;
    var c;
    if (count == 0) {
        c = 0
    } else {
        c = count - 1;
    }
    var index = count - 1;
    //psId = id;
    psName = $($(".psName")[c]).val();
    //console.log("psId:"+psId);
    $.ajax({
        url: "psChartAction_getPsTree",
        type: "post",
        data: {"params.psid": id},
        dataType: "html",
        timeout: 1000 * 10,
        success: function (data) {
            var jsonObj = eval("(" + data + ")");
            var zNodes = jsonObj;
            if (zNodes != null && zNodes.length > 0) {
                var newZNodes = [];
                for (var i = 0; i < zNodes.length; i++) {
                    var deviceType = zNodes[i].deviceType;
                    if (deviceType != 17 && deviceType != 11 && deviceType != 3) {//电站,并网点,单元 不显示在故障树列表(虚拟设备无故障)
                        newZNodes.push(zNodes[i]);
                    }
                }
                zNodes = newZNodes;
            }
            $.each(zNodes, function (i) {
                if (zNodes[i].psLevel == 2) {
                    //var type = zNodes[i].deviceType;
                    showTreeNodeImageByDeviceType(zNodes[i]);
                }
            });

            //	layer.closeAll();
            $.fn.zTree.init($(thisId), setting, zNodes);
            zTree = $.fn.zTree.getZTreeObj("tps" + id);
            if (fromPage == 2) {//从实时告警 选中设备 名称跳转到故障告警页面 2016 06 06
                if ('' == uuid || uuid == null || uuid == "undefined" || uuid == undefined) {//选中设备才全部展开 2016 06 06

                } else {
                    expandAll();
                }
            }
        },
        error: function () {
            Sungrow.showMsg({
                container: {
                    header: LANG["all_station_prompt"],
                    content: LANG["all_station_requesttimeout"],
                    noFn: true,
                    noText: LANG["pro_management_determine"]
                },
                fixed: false
            });
        }
    });
}

function pageQuery() {
    powerSearch();
    pslistPage();
    if (!psId) {
        $("#psId").val(powerList[0].id);
        psId = powerList[0].id;
        psName = powerList[0].name;
    } else {
        $("#psId").val(psId);
        psName = $("#powerList ul").find("#" + psId).find("a").text().trim();
    }
    //search(1);
}

$(function () {
    //select 下拉
    $(".select_down").live("click",
        function (e) {
            var sel_block = $(this).find("ul").css("display");
            if (sel_block == 'none') {
                $(this).find("ul").slideDown();
            } else {
                $(this).find("ul").slideUp();
            }
        });
    $(".select_down ul li").click(function () {
        var ul_li = $(this).children("a").text();
        $(this).parent().parent("span").children("a").text(ul_li);
    });
});

function initTime() {
    var yest_day = paramsStartTime;
    var tom_day = paramsEndTime;
    $("#start").val(yest_day);
    $("#end").val(tom_day);
    $("#quick_date1").html(yest_day);
    $("#quick_date2").html(tom_day);
    $("#startTime").val(yest_day);
    $("#endTime").val(tom_day);
    if (tom_day) {
        tom_day = (tom_day.replace("-", "")).replace("-", "").replace(" ", "").replace(":", "");
    }
    if (yest_day) {
        yest_day = (yest_day.replace("-", "")).replace("-", "").replace(" ", "").replace(":", "");
    }
    $("#dateHid").val(yest_day + "-" + tom_day);
}

//获取日期时间
function GetDay(now_day, now_year, now_mon) {
    //console.log(now_day+":"+now_year+":"+now_mon);
    var today = new Date();
    if (now_day) {
        var _time = 1000 * 60 * 60 * 24 * now_day;
        var yesterday_milliseconds = today.getTime() - _time;
    } else {
        var yesterday_milliseconds = today.getTime();
    }
    var yesterday = new Date();
    yesterday.setTime(yesterday_milliseconds);
    var strYear = yesterday.getFullYear();
    if (now_year) {
        strYear = strYear - now_year;
    }
    var strDay = yesterday.getDate();
    //console.log(strDay);
    var strMonth = yesterday.getMonth() + 1;
    if (now_mon) {
        if (strMonth - now_mon <= 0) {
            strYear = strYear - 1;
            strMonth = strMonth + 12 - now_mon;
        } else {
            strMonth = strMonth - now_mon;
        }
    }
    var strHours = yesterday.getHours(); //获取当前小时数(0-23)
    var strMin = yesterday.getMinutes();
    if (strDay < 10) strDay = "0" + strDay; //获取当前分钟数(0-59)
    if (strMonth < 10) strMonth = "0" + strMonth;
    if (strHours < 10) strHours = "0" + strHours;
    if (strMin < 10) strMin = "0" + strMin;
    return strYesterday = strYear + "-" + strMonth + "-" + strDay + " " + strHours + ":" + strMin;
}

var clearSetInterval_point = null;
//定时刷新
function refreshTime_point() {
    var text = $("#point_time").html();
    if (document.getElementById("setTime_point").checked) {
        clearInterval(clearSetInterval_point);
        clearSetInterval_point = setInterval("getStart_point()", text * 60 * 1000);
    } else {
        clearInterval(clearSetInterval_point);
    }
}

function getStart_point() {
//刷新当前页
    var current = curOtherPage;// SJE-1527   电站列表-故障告警：定时刷新时，建议系统记住用户选择的当前刷新页
    search(current);

}

//得到日期是一年中的第几周
function getWeekNumber() {
    // Copy date so don't modify original
    var nowD = new Date();
    var d = new Date(nowD.getFullYear(), nowD.getMonth(), nowD.getDate());
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(), 0, 1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1) / 7);
    // Return array of year and week number
    var getFullYear = d.getFullYear();
    var getWeekNo = weekNo;
    return [getFullYear, getWeekNo];
}

//判断某年某月某日是星期几
function getWeekDay(month, day, year) {
    var arr = [LANG["all_station_sun"], LANG["all_station_one"], LANG["all_station_two"],
            LANG["all_station_three"], LANG["all_station_four"], LANG["all_station_five"], LANG["all_station_six"]],
        weekDay;
    today = new Date();
    year = year || today.getFullYear();
    today.setFullYear(year, month - 1, day);
    weekDay = today.getDay();
    return arr[weekDay];
}

function getDateStrBefore(time_curr, num) {
    var str = time_curr.replace(/-/g, "/");
    var date = new Date(str);
    var milliseconds1 = date.getTime() - 1000 * 60 * 60 * 24 * num;
    var newdata1 = new Date();
    newdata1.setTime(milliseconds1);
    var strYear1 = newdata1.getFullYear();
    var strDay1 = newdata1.getDate();
    var strMonth1 = newdata1.getMonth() + 1;
    if (strMonth1 < 10) {
        strMonth1 = "0" + strMonth1;
    }
    if (strDay1 < 10) {
        strDay1 = "0" + strDay1;
    }
    return strYear1 + "-" + strMonth1 + "-" + strDay1 + " 00:00";
}

function getDateStrAfter(time_curr, num) {
    var str = time_curr.replace(/-/g, "/");
    var date = new Date(str);
    var milliseconds = date.getTime() + 1000 * 60 * 60 * 24 * num;
    var newdata = new Date();
    newdata.setTime(milliseconds);
    var strYear = newdata.getFullYear();
    var strDay = newdata.getDate();
    var strMonth = newdata.getMonth() + 1;
    if (strMonth < 10) {
        strMonth = "0" + strMonth;
    }
    if (strDay < 10) {
        strDay = "0" + strDay;
    }
    return strYear + "-" + strMonth + "-" + strDay + " 23:59";
}

function getlastday(year, month) {
    var new_year = year; //取当前地年份
    var new_month = month++; //取下一个月地第一天，方便计算（最后一天不固定）
    if (month > 12) { //如果当前大于12月，则年份转到下一年
        new_month -= 12; //月份减
        new_year++; //年份增
    }
    var new_date = new Date(new_year, new_month, 1); //取当年当月中地第一天
    return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期
}

//2016 06 06 选中节点的触发事件
function updateNodes(highlight) {
    for (var i = 0,
             l = nodeList.length; i < l; i++) {
        nodeList[i].highlight = highlight;
        zTree.selectNode(nodeList[i]);
        onClick(null, null, nodeList[i]);
    }

}

//start 2016 07 06 wangli 页数跳转
function doPageJump() {
    //
    sizePage = getPageNum($("#pageId").val());
    var pageNo = $("#pageChange").val();
    var totalPageNumber = rowCount1;
    var totalNumber = Math.ceil(rowCount1 / sizePage);
    if (totalNumber != 0) {//格式校验
        curOtherPage = pageNo;
        current_paged = pageNo;
        if (null != current_paged && '' != current_paged) {
            pageList();
        }
        //   alert("wenbenzhiwei:" + current_paged);

    }
}
//end


//start 2016 07 11 添加鼠标按下事件 wangli
function checkValue() {
    sizePage = getPageNum($("#pageId").val());
    var pageNo = $("#pageChange").val();
    //按下任意键 监听 判断是否是字母
    var strExp = /^[A-Za-z]/;
    if (strExp.test(pageNo)) {//字母校验  如果为字母 则替换为空
        $("#pageChange").val('');
        return;
    }

    //如果输入框 输入值大于总的页数 则清空
    var totalNumber = Math.ceil(rowCount1 / sizePage);
    var numbercheck = /^[0-9]*$/;
    if (pageNo * 1 < 0) {//如果为负数的话 则清空
        $("#pageChange").val('');

    } else if ((numbercheck.test(pageNo))) {//如果为正数
        if (pageNo > totalNumber | pageNo.length == 0 | (pageNo < 1)) {//1.超过页数范围 清空 2.没输入清空
            $("#pageChange").val('');

        }
    }
}
//end

//2016 07 14 添加键盘回车事件 wangli
function jumptoPaged(event) {
    var e = event ? event : window.event;
    if (e.keyCode == 13) {
        doPageJump();
    }

}
//end

//2016-08-02 16:51:27 ChuD; 故障名联想 输入
function associatInputFtN() {
    $('#fault_name').autocomplete({
        serviceUrl: 'psFaultAction_getPsFaultNames',
        type: "post",
        dataType: "json",
        onSelect: function (suggestion) {//选中后值处理
            $('#fault_name').val(suggestion.data);
            //alert(suggestion.value);
        },
        paramName: 'searchFaultName',//参数名称
        width: 179,//自定义弹出框宽度
        enableCookie: false,
        deferRequestBy: 300,//输入0.3秒后执行
        formatResult: function (suggestion, currentValue) {//格式化结果
            return suggestion.data;
        },
        onSearchStart: function (query) {//查询前验证
            if (query.length < 2) {//输入小于2个字符不查询
                return false;
            }
        }
    });
}

//2016 09 14
$("#faultPage_all").resize(function () {
    changeSize();

});
//2016 09 14 告警管理页面 最大化 样式显示问题 修改wangli
function changeSize() {
    //
    $(".nbq_tab_bottom_gaojing").scrollTop(1);
    if ($(".nbq_tab_bottom_gaojing").scrollTop() > 0) {
        if ((navigator.userAgent.indexOf('MSIE') >= 0)
            && (navigator.userAgent.indexOf('Opera') < 0)) {
            $(".nbq_tab_top").width($(".nbq_tab").width() - 18);
        } else {//非ie浏览器
            $(".nbq_tab_top").width($(".nbq_tab").width() - 6);
        }
    } else {
        $(".nbq_tab_top").width($(".nbq_tab").width() - 1);
    }
}




