var myChart = null;
var option;
var zTree, rMenu;
var psId, psName, psId1;
var nodeArray = [];
var timeTicket;
var bColor = [];
var chartnum = 0;
var sName = [];
var lName = [];
var legendSelected = {};
var dataZoom = {};
var nodeunit = "";
var isdata = 0;
var initc = ["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#00ffff", "#ffff00", "#000000", "#70db93", "#cd7f32", "#c0c0c0", "#9f9f9f",
    "#8e236b", "#ff7f00", "#db70db", "#bc8f8f", "#8a2be2", "#a52a2a", "#ff7f50", "#dc143c", "#00008b", "#008b8b", "#b8860b",
    "#a9a9a9", "#e9967a", "#8fbc8f", "#483d8b", "#2f4f4f", "#00ced1", "#1e90ff", "#b22222"];
// 主题，默认标志图形类型列表
var symbolList = [
    'circle', 'rectangle', 'triangle', 'diamond',
    'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond',
    'circle', 'rectangle', 'triangle', 'diamond',
    'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond',
    'circle', 'rectangle', 'triangle', 'diamond'
];
//需要处理的测点（出现断点拉平）
/*电站测点：逆变器交流功率	83002 逆变器直流功率	83039 逆变器累计发电	83004 逆变器日发电量	83009 电表交流功率83032 电表累计发电83020
 电表日发电量	83006 电表累计用电	83021 电站日发电量 83022 电站累计发电	83024 电站功率	83033 电站瞬时辐照	83012
 站日辐射量	83013 电站总辐射量	83036 功率/负载83019*/

/*并网点测点：逆变器交流功率	82002 逆变器交流功率归一化	82001 逆变器直流功率	82004 逆变器直流功率归一化	82003 逆变器累计发电	82007
 逆变器日发电量	82012 电表总发电量	82021 电表日发电量	82009 电表有功功率	82023 并网点瞬时辐照	82015 并网点日辐射量	82016
 并网点总辐射量	82017 并网点功率	82032 并网点日发电	82033 并网点总发电量	82039 上网电量	82040*/

/*单元测点：逆变器交流功率	81002 逆变器交流功率归一化	81001 逆变器直流功率	81004 逆变器直流功率归一化	81003 逆变器累计发电	81007
 逆变器日发电量	81012 电表总发电量	81028 电表日发电量	81009 电表有功功率	81021 */

/*逆变器测点：交流功率	24 无功功率	25 视在功率	43 逆变器效率	28 电网频率	27 总直流功率	14 总发电量	2 日发电量1 交流功率归一化	86*/

/*电表测点：有功功率	8018 无功功率	8022 视在功率	8026 */

/*环境检测仪测点：平面瞬时辐照	2003平面日辐射量	2001平面总辐射量	2002斜面瞬时辐照	2007斜面日辐射量	2005斜面总辐射量	2006
 瞬时辐照	2019日辐射量	2020总辐射量	2021*/


var pointArray = [83022, 83009, 83004, 83009, 83032, 83020, 83006,
    83021, 83022, 83024, 83033, 83012, 83013, 83036, 83019,
    82002, 82001, 82004, 82003, 82007, 82012, 82021, 82009,
    82023, 82015, 82016, 82017, 82032, 82033, 82039, 82040,
    81002, 81001, 81004, 81003, 81007, 81012, 81028, 81009, 81021,
    24, 25, 43, 28, 27, 14, 2, 1, 86,
    8018, 8022, 8026,
    2003, 2001, 2002, 2007, 2005, 2006, 2019, 2020, 2021];
var setting = {
    async: {
        enable: true,
        url: "psChartAction_getPsTreeChild",
        autoParam: ["deviceType=params.deviceType", "psLevel=params.psLevel", "psId=params.psId", "uuid=params.id"],
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
        onClick: onClick
    }
};


$(function () {
    psId = '';
    jQuery(".dateWrap").slide({trigger: "click"});
    $(".date_sureBtn").click(function () {
        $(".dateWrap").hide();
    });
    $(".wrap_su").click(function () {
        $(".dateWrap").hide();
    });
    if (document.getElementById('psDetail') != null) {
        initPage();
    }
    loadPage();
    //initChart();
});

$(window).resize(function () {
    $(".sjqx_bottom_tab").height($(".tendency_table").height() - 42);
})

function loadPage() {
    //刷新时间未点击时灰色
    $(".abcd").css({"opacity": "0.7"});
    $(".abcd em").css({"opacity": "0.7"});
    $(".allsite_dateriCheckbox").click(function () {
        if ($(".allsite_dateriCheckbox").attr("checked") == 'checked') {
            $(".abcd").css({"opacity": "1"});
            $(".abcd em").css({"opacity": "1"})
        } else {
            $(".abcd").css({"opacity": "0.7"});
            $(".abcd em").css({"opacity": "0.7"})
        }

    });


    $("#allsite_dateYear1 a").click(function () {
        var ch = $(this).parent().attr("ch");
        var date_em1 = $(this).parent().find("i").text();
        if (ch) {
            if ($(this).attr("class") == "allsite_dateUpBtn1")//+
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
                if ($(this).attr("class") == "allsite_dateUpBtn1")//+
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

    $(".tog_table1").hover(function () {
        $(".tog_table_txt1").show();
    }, function () {
        $(".tog_table_txt1").hide();
    });
    $(".tog_table2").hover(function () {
        $(".tog_table_txt2").show();
    }, function () {
        $(".tog_table_txt2").hide();
    });

    //弹出层
    $(".mskeLayBg").height($(document).height());
    $(".mskeClaose").live('click', function () {
        $(".mskeLayBg,.mskelayBox").hide()
    });
    $(".tog_table1")
        .click(
        function () {
            if (option.legend.data.length <= 0) {
                Sungrow.showMsg({
                    container: {
                        header: LANG["all_station_prompt"],
                        content: LANG["analysis_report_withoutdata"],
                        noFn: true,
                        noText: LANG["pro_management_determine"]
                    },
                    fixed: false
                });
                return;
            }

            var h = '<div class="statement_tit2" style="position:fixed;width:86%" ><span  id="tabName"></span> <span style="float:right"> <a href="javascript:void(0)" onclick="exportExcel();"><img src="' + ctx + '/resources/portal/images/out_pic.png" alt="' + LANG["all_station_savetable"] + '" style="margin-top:6px;" title="' + LANG["all_station_savetable"] + '"></a>&nbsp;&nbsp;&nbsp;&nbsp;</span><img class="mskeClaose" src="' + ctx + '/resources/portal/images/mke_close.png" width="27" height="27"  /></div>';
            h += '<div style="height:40px"></div>';
            h += '<div id="adjustPosition" style="width:40px"></div>';
            h += '<table class="statementMoreTable" id="reportTab"></table>';
            $(".mske_html").html(h);
            $(".mske_html").css({
                "width": "100%",
                "height": "488px"
            });
            $(".mskeLayBg").show();
            reportTab();
            $(".mskelayBox").fadeIn(300);
            reDisplayReportTabTable("#reportTab", "#reportTabTobody");
        });

    $(".mskeTogBtn").click(function () {
        $(".msKeimgBox").toggleClass("msKeimgBox2");
        $(this).toggleClass("mskeTogBtn2")
    });

    initselect();


    var i = 0;
    //第一次默认选中日
    $("ul.dateWrap_tit2 li:first-child").addClass("on");


    //年月日事件切换
    $(".dateWrap_tit ul li").click(function () {
        //
        i = $(this).index();
        $(".dateWrap_tit ul li").removeClass("on");
        $(this).addClass("on");
        //var span_1 = $(".quick_date").find('span:first');
        //var span_2 = $(".quick_date").find('span:last');
        if (i == 0) //天
        {
            /**  var yest_day = GetDay(0);
             var tom_day = GetDay(0);
             yest_day = yest_day.substring(0, yest_day.indexOf(" ") + 1)
             + "00:00";
             tom_day = tom_day.substring(0, tom_day.indexOf(" ") + 1)
             + "23:59";
             $("#start").val(yest_day);
             $("#end").val(tom_day);
             //isdata=0;
             tom_day = (tom_day.replace("-", "")).replace("-", "").replace(
             " ", "").replace(":", "");
             yest_day = (yest_day.replace("-", "")).replace("-", "")
             .replace(" ", "").replace(":", "");
             $("#dateHid").val(yest_day + "-" + tom_day);
             //console.log((tom_day.replace("-","")).replace("-","").replace(" ","").replace(":",""));
             */

            initTime_psPoint(true);
        } else if (i == 1)//周
        {
            var now_day = GetDay();
            var week_year = getWeekNumber()[0];
            var week_num = getWeekNumber()[1];
            $("#week").val(week_year + LANG["pro_management_yearof"] + week_num + LANG["pro_management_week"]);

        } else if (i == 2)//月
        {
            var now_day = GetDay();
            var yest_day = GetDay(0, 0, -1);
            var year = now_day.substring(0, now_day.indexOf("-"));
            var month = now_day.substring(now_day.indexOf("-"), now_day.indexOf("-") + 3);
            $("#month").val(year + month);

        } /*else if (i == 3)//季度  注释季度 http://192.168.0.236:8081/browse/SJE-1383
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


         }*/ else if (i == 3)//年
        {
            var now_day = GetDay();
            var month = now_day.substring(now_day.indexOf("-") + 1, now_day.indexOf("-") + 3);
            var year = now_day.substring(0, now_day.indexOf("-"));
            $("#year").val(year + LANG["pro_management_yeartial"]);
        }
        //var now_day = GetDay();
        //span_1.text(yest_day);
        //span_2.text(now_day);
    });


    //获得本周的开始日期
    function getWeekStartDate() {
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
        return formatDate(weekStartDate);
    }

//获得本周的结束日期
    function getWeekEndDate() {
        var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
        return formatDate(weekEndDate);
    }

    //时间确定事件
    $(".wrap_su").click(function () {
            if (i == 0) {
                /**var quick_date1 = $("#start").val();
                 var quick_date2 = $("#end").val();*/
                var quick_date1 = $("#dayTimeInput").val() + " 00:00";
                var quick_date3 = $("#dayTimeInput").val() + " 23:59";
                $("#quick_date1").html(quick_date1);
                $("#quick_date2").html(quick_date3);
                $("#quick_date3").html(quick_date3); // 改 quick_date2 为 quick_date3  裴习柱  2016-08-26
            } else if (i == 1) {
                /** var week = $("#week").val();
                 var week_year = week.substring(0, week.indexOf(LANG["pro_management_year"]));
                 var week_num = week.substring(week.indexOf(LANG["pro_management_no"]) + 1, week.indexOf(LANG["pro_management_week"]));
                 */
                var time_curr = GetDay();
                if ($("#currenttime").val() != null && $("#currenttime").val() != "") {
                    time_curr = $("#currenttime").val();
                } else {
                    time_curr = time_curr.substring(0, 10);
                }
                var timeArray = time_curr.split("-", 3);
                var year = timeArray[0];
                var month = timeArray[1];
                var day = timeArray[2];
                var timeDate = new Date(year, month - 1, day);
                var weeknum = timeDate.getDay();//一周的第几天
                //把周日当做一周的最后一天
                var start, end;
                if (weeknum == 0) {
                    start = new Date(year, month - 1, timeDate.getDate() - 6);
                    end = new Date(year, month - 1, day);
                } else {
                    start = new Date(year, month - 1, timeDate.getDate() - weeknum + 1);
                    end = new Date(year, month - 1, timeDate.getDate() + 7 - weeknum);
                }
                $("#quick_date1").html(dateToString(start) + " 00:00");
                $("#quick_date2").html(dateToString(end) + " 23:59");
                $("#quick_date3").html(dateToString(end) + " 23:59"); // 改 quick_date2 为 quick_date3  裴习柱  2016-08-26

                /**var weeknum = getWeekDay(time_curr.split("-")[1], time_curr.split("-")[2], time_curr.split("-")[0]);
                 if (weeknum == LANG["pro_management_day"]) {
                    $("#quick_date1").html(time_curr + " 00:00");
                    $("#quick_date2").html(getDateStrAfter(time_curr, 6));
                } else if (weeknum == LANG["pro_management_one"]) {
                    $("#quick_date1").html(getDateStrBefore(time_curr, 1));
                    $("#quick_date2").html(getDateStrAfter(time_curr, 5));
                } else if (weeknum == LANG["pro_management_two"]) {
                    $("#quick_date1").html(getDateStrBefore(time_curr, 2));
                    $("#quick_date2").html(getDateStrAfter(time_curr, 4));
                } else if (weeknum == LANG["pro_management_three"]) {
                    $("#quick_date1").html(getDateStrBefore(time_curr, 3));
                    $("#quick_date2").html(getDateStrAfter(time_curr, 3));
                } else if (weeknum == LANG["pro_management_four"]) {
                    $("#quick_date1").html(getDateStrBefore(time_curr, 4));
                    $("#quick_date2").html(getDateStrAfter(time_curr, 2));
                } else if (weeknum == LANG["pro_management_five"]) {
                    $("#quick_date1").html(getDateStrBefore(time_curr, 5));
                    $("#quick_date2").html(getDateStrAfter(time_curr, 1));
                } else if (weeknum == LANG["pro_management_six"]) {
                    $("#quick_date1").html(getDateStrBefore(time_curr, 6));
                    $("#quick_date2").html(time_curr + " 23:59");
                }*/


            } else if (i == 2) {
                var month = $("#month").val();
                $("#quick_date1").html(month + "-01 00:00");
                $("#quick_date3").html(month + "-" + (getlastday(month.split("-")[0], month.split("-")[1]) - 1) + " 23:59"); // 给时间 quick_date3 赋值  裴习柱  2016-08-26
                $("#quick_date2").html(month + "-" + getlastday(month.split("-")[0], month.split("-")[1]) + " 23:59"); // 隐藏域赋值

            } /*else if (i == 3) {
             var jidu = $("#jidu").val();
             var jidu_year = jidu.substring(0, jidu.indexOf(LANG["pro_management_year"]));
             var jidu_num = jidu.substring(jidu.indexOf(LANG["pro_management_year"]) + 1, jidu.indexOf(LANG["pro_management_year"]) + 2);
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

             }*/ else if (i == 3) {
                var year = $("#year").val();
                year = year.substring(0, 4);
                $("#quick_date1").html(year + "-01-01 00:00");
                $("#quick_date2").html(year + "-12-31 23:59");
                $("#quick_date3").html(year + "-12-31 23:59"); // 改 quick_date2 为 quick_date3  裴习柱  2016-08-26
            }

            quick_date1 = $("#quick_date1").html();
            quick_date2 = $("#quick_date2").html();
            var s = quick_date1.substring(0,
                quick_date1.indexOf(" ")).split("-");
            var e = quick_date2.substring(0,
                quick_date1.indexOf(" ")).split("-");
            var startd = new Date(s[0], s[1] - 1, s[2]);
            var endd = new Date(e[0], e[1] - 1, e[2]);
            if (startd > endd) {
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
            }

            isdata = parseInt(Math.abs(endd - startd) / 1000 / 60
                / 60 / 24);

            var dt = endd.getTime() - startd.getTime();
            var mon = dt % (12 * 30 * 24 * 3600 * 1000);
            var mons = Math.floor(mon / (30 * 24 * 3600 * 1000));

            changeSel();
            initselect();
            quick_date2 = (quick_date2.replace("-", "")).replace(
                "-", "").replace(" ", "").replace(":", "");
            quick_date1 = (quick_date1.replace("-", "")).replace(
                "-", "").replace(" ", "").replace(":", "");
            $("#dateHid").val(quick_date1 + "-" + quick_date2);
            $(".dateWrap").hide();

            // 更改表格中统计方式的默认显示
            if (!/min/g.test($("#dateDef").text())) {
                $.each($("span.data_type_span>a"), function (n, obj) {
                    if ($(obj).text() == LANG.all_station_aggenttype_5) {
                        $(obj).text(LANG.all_station_aggenttype_2);
                    }
                });
            } else {
                $.each($("span.data_type_span>a"), function (n, obj) {
                    if ($(obj).text() == LANG.all_station_aggenttype_2 ||
                        $(obj).text() == LANG.all_station_aggenttype_3 || $(obj).text() == LANG.all_station_aggenttype_1) {
                        $(obj).text(LANG.all_station_aggenttype_5);
                    }
                });
            }

            if (isdata >= 0 && isdata <= 3) {
                changedateSel("15min");
            } else if (isdata > 3 && isdata <= 10) {
                changedateSel("60min");
            } else if (isdata > 10 && isdata <= 31) {
                changedateSel("1day");
            } else if (isdata > 31 && isdata <= 730) {
                changedateSel("1mon");
            } else {
                changedateSel("1year");
            }
        });

    $(".allsite_min a").click(function () {
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

    //时间选择显示隐藏事件
    $(".date_btn").unbind().click(function () {
        var dateWrap_height = $(".dateWrap").is(":hidden");

        if (dateWrap_height) {

            $("#dateWrap_id").css("display", "block");

        } else {
            $("#dateWrap_id").css("display", "none");
        }
    });
    //$(".treeDemoId li .ztree").toggle(false);
    initTime_psPoint();
    initChart();
    var spid;
    if ($("#selectPsId").val() != "") {
        spid = $("#selectPsId").val();
    } else {
        spid = $($(".psId")[0]).val();
    }
    showTree(spid, 0);
}

function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i = 0, l = childNodes.length; i < l; i++) {
        var name = childNodes[i].name;
        childNodes[i].name = isEmptyStr(name)?"":name.replace(/\.n/g, '.');
        if (childNodes[i].psLevel == 3) {
            //var type = childNodes[i].deviceType;
            showTreeNodeImageByDeviceType(childNodes[i]);
        }
        if (childNodes[i].psLevel == 4) {
            //console.log(childNodes[i].ctype);
            if (childNodes[i].ctype == "1") {
                childNodes[i].icon = staticUrl + "/resources/portal/images/line.png";
            } else if (childNodes[i].ctype == "2") {
                childNodes[i].icon = staticUrl + "/resources/portal/images/bar.png";
            } else if (childNodes[i].ctype == "3") {
                childNodes[i].icon = staticUrl + "/resources/portal/images/fangbo.png";
            } else {
                childNodes[i].icon = staticUrl + "/resources/portal/images/line.png";
            }
        }
    }
    //console.log(childNodes);
    return childNodes;
}

function onClick(e, treeId, treeNode) {
    e.stopPropagation();
    if (treeNode.level == 2) {
        showChart(treeNode);
        //console.log(nodeArray);
        //console.log(option);
    }
    zTree.expandNode(treeNode);
}


function showTree(id, count) {
    if (!id) {
        return;
    }
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
            $.each(zNodes, function (i) {
                if (zNodes[i].psLevel == 2) {
                    //var type = zNodes[i].deviceType;
                    showTreeNodeImageByDeviceType(zNodes[i]);
                } else if (zNodes[i].psLevel == 4) {
                    //zNodes[i].icon = "../../upsm/resource/images/common/treeIcon/jcd.png";
                }
            });
            //	console.log(zNodes);
            layer.closeAll();
            $.fn.zTree.init($(thisId), setting, zNodes);
            zTree = $.fn.zTree.getZTreeObj("tps" + id);
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

function getRandomColor() {
    return "#" + ("00000" + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6);
}
var tempunit = {};
function addTr(node) {
    var node3 = node.getParentNode();
    var node2 = node3.getParentNode();
    var unit = node.unit;
    var color = node.color;
    var value = psId + "_" + node.id;
    var n3id = node3.id;
    n3id = n3id.toString();
    var name = node3.name + "(" + n3id.substring(2, 7) + ")" + "/" + node.name;
    var vcolor = n3id.substring(2, 7) + "_" + node.id;
    var bar = "bar", line = "line", fbo = "fbo";

    tempunit[name] = unit;

    //console.log(vcolor);
//    alert("电站名称："+$(".treeDemoId .on .psName").val());
    /**start 2016 07 05 电站列表别的页面跳转到数据曲线  电站名称错误bug修改 wangli**/
    if (psName != $(".treeDemoId .on .psName").val()) {
        psName = $(".treeDemoId .on .psName").val();
    }
    /**end  2016 07 05 **/
    if (nodeunit == null || nodeunit == "") {
        //start 2016 12 12 wangli 单位bug修改
        if (unit == "" || unit == null) {
            nodeunit = unit + ",";
        } else {
            nodeunit = unit;
        }
        //end
    }
    else {
        //2016 11 12 wangli 数据曲线 单位错误bug修改
        if (nodeunit != ",") {
            nodeunit = nodeunit + "," + unit;
        } else {
            nodeunit = nodeunit + unit;
        }
    }

    var xianshi = '<td style="width: 15%"><div class="form-group"><input type="text"  style="display:none" value="' + vcolor + '"><input type="hidden" id="node' + vcolor + '" class="demo" value="' + color + '"/></div></td>';
    var ahtml = "";
    var dynamicType = "";
    if (node.ctype == "1") {
        ahtml = "<a href='javascript:void(0);' class='map_select_2_sea tendencyChart_selecta' map='2'>" + LANG.all_station_line + "</a><ul>";
        dynamicType = line;
    } else if (node.ctype == "2") {
        ahtml = "<a href='javascript:void(0);' class='map_select_2_sea tendencyChart_selecta' map='2'>" + LANG.all_station_bar + "</a><ul>";
        dynamicType = bar;
    } else {
        ahtml = "<a href='javascript:void(0);' class='map_select_2_sea tendencyChart_selecta' map='2'>" + LANG.all_station_line + "</a><ul>";
        dynamicType = line;
    }
    var tubiao = "<td style='width:12%'><input class='changeClass' id=ch" + value + " type='hidden' value='" + dynamicType + "'/><span class='map_select_2_se  select_down1 fl tendencyChart_select pulldown_text' onclick='selectValue(this)' style='border:1px solid #dfdfdf;border-radius:5px;width:96px !important;height:28px;text-align:center;position: relative;left: 50%;margin-left: -50px;'>" +
        ahtml +
        "<li style='cursor:pointer' onclick=changeChartType('" + bar + "','" + value + "',this)><a>" + LANG.all_station_bar + "</a></li>" +
        "<li style='cursor:pointer' onclick=changeChartType('" + line + "','" + value + "',this)><a>" + LANG.all_station_line + "</a></li>" +
        "</ul></span></td>";
    // 默认统计方式      
    var defaultDataType = LANG.all_station_aggenttype_5;
    if (!/min/g.test($("#dateDef").text())) {
        defaultDataType = LANG.all_station_aggenttype_2;
    }
    var caiyang = '<td style="width:13%"><input class="chCss" id=at' + value + ' type="hidden"/>' +
        '<span class="map_select_2_se select_down1 fl tendencyChart_select pulldown_text data_type_span" onclick="selectValue(this)" style="width:96px !important;height:28px;text-align:center;position: relative;left: 50%;margin-left: -50px;border:1px solid #dfdfdf;border-radius:5px;">' +
        '<a href="javascript:void(0);" class="map_select_2_sea tendencyChart_selecta" map="2">' + defaultDataType + '</a>' + '<ul>' +
            //2016 1009 添加javascript wangli  2016 10 15 去掉a标签 修改数据曲线--点击"差值" 页面出错bug修改
        '<li style="cursor:pointer" class="agent_type_5" onclick=changeAggentType(5,"' + value + '")>' + LANG.all_station_aggenttype_5 + '</a></li>' +
        '<li style="cursor:pointer" class="agent_type_2" onclick=changeAggentType(2,"' + value + '")>' + LANG.all_station_aggenttype_2 + '</a></li>' +
        '<li style="cursor:pointer" class="agent_type_3" onclick=changeAggentType(3,"' + value + '")>' + LANG.all_station_aggenttype_3 + '</a></li>' +
        '<li style="cursor:pointer" class="agent_type_1" onclick=changeAggentType(1,"' + value + '")>' + LANG.all_station_aggenttype_1 + '</a></li>' +
        '<li style="cursor:pointer" class="agent_type_4" onclick=changeAggentType(4,"' + value + '")>' + LANG.all_station_aggenttype_4 + '</a></li></ul></span></td>';
    var caozuo = "<td style='width:5%'><a href='javascript:void(0);' class='delA' onclick='delChart(this)'><img src='" + staticUrl + "/resources/portal/images/delete_icon.png' alt=''></a></td>";
    var trHtml = '<tr>';
    trHtml += '';
    trHtml += '<td style="width:12%">' + psName + '</td>';
    trHtml += '<td style="width:13%">' + node3.name + '</td>';
    trHtml += '<td style="width:30%">' + name + '</td>';
    trHtml += xianshi + tubiao + caiyang + caozuo + '</tr>';
    //console.log(trHtml);
    $("#tbody").append(trHtml);
    //2016 09 19 高度控制 wangli
    $(".sjqx_bottom_tab").height($(".tendency_table").height() - 42);
    chartsHeadFixed();
    var id = "node" + vcolor;
    initColor(id);
    initselect();
    //console.log(node);
    nodeArray.push(node);
    sName.push(name);
    lName.push(psName)
}


$(window).resize(function () {
    chartsHeadFixed();
});
function changeColor(id, color) {
    var index = $(".demo").index($("#" + id));
    //console.log(index);
    option.color[index] = color;
    option.legend.selected = legendSelected;
    option.dataZoom = dataZoom;
    //console.log(option.color);
    myChart.setOption(option);
    //myChart.restore();
}

function changeChartType(objs, id, obj) {

    var tr = $(obj).parent().parent().parent().parent();
    var index = $("#tbody tr").index(tr);
    $("#ch" + id).val(objs);
    $("#shape").val(objs);
    option.series[index].type = objs;
    myChart.setOption(option);
    //myChart.refresh();
}

function changeAggentType(atype, value) {
    myChart.hideLoading();
    var id = $(".chCss").index($("#at" + value));
    var cycle = $("#cycle").val();
    var node = nodeArray[id];
    var node3 = node.getParentNode();
    var node2 = node3.getParentNode();
    var psKey = node.psId + "_" + node2.nodeKey + "_" + node3.nodeKey;
    var pointId = node.id;
    nodeArray[id].atype = atype;
//	if(cycle!="1day"){
    var URL = "psChartAction_getChartData";
    var obj = {};
    obj["params.unit"] = node.unit;
    obj["params.dataType"] = atype;
    obj["params.pointId"] = pointId;
    obj["params.psKey"] = psKey;
    obj["params.date"] = $("#dateHid").val();
    obj["params.cycle"] = cycle;

    /*var jsondata = Dic.Ajax.request({
     url: URL,
     data: obj
     });*/
    $.SUN_post(URL, obj, function (jsondata) {
        var data = [];
        $.each(jsondata, function (i) {
            var d = jsondata[i];
            if (i == 0) {//第一个“--”必须转换，否则echarts绘不出来线
                d = jsondata[i] == "--" ? "" : jsondata[i];
            }
            data.push(d);
        });
        if (pointArray.indexOf(pointId) != -1 && cycle != "1day" && cycle != "1mon") {
            data = dealArray(data);
        }
        option.series[id].data = data;
        myChart.clear();
        myChart.setOption(option);
    })
}

var flag = false;
function checkCss(id, count) {
    var yesId = "#tps" + psId;
    var thisId = "#tps" + id;
    if (id != "" && id != undefined) {
        if ($("#selectPsId").length > 0) {
            $("#selectPsId").val(id);
        }
    }
    if (psId != id || $("#selectordelete").val() == "true") {
        $(yesId).hide();
        $("#lp" + id).parent().children().removeClass("on");
        $("#lp" + id).addClass("on");
        $(thisId).show();
        showTree(id, count);
        $("#selectordelete").val("");
    }
    $(".tendency_ri").css("width",$(window).width()-380);

    psId = id;

}

function initChart() {
    if (myChart == null) {
        myChart = echarts.init(document.getElementById('main'));
    }
    // 指定图表的配置项和数据
    option = {
        title: {
            text: ''
        },
        tooltip: {
            show: false,
            trigger: 'axis',
            backgroundColor: 'rgba(0,0,0,0.8)',
            formatter: function (params, ticket, callback) {
                //debugger;
                //console.log(params);
                var res = "";
                //2016 11 12 wangli 数据曲线 时间不显示bug
                $.each(params, function (n) {
                    if (params[n].name) {
                        res = params[n].name + "<br/>";
                    }
                });
                if (params[0].name == undefined || params[0].name == "") {
                    res = params[0][1];
                }
                var length = params.length;
                var nodearray = nodeunit.split(",");
                $.each(params, function (n) {
                    var obj = params[n];
                    var ydata = obj.data;
                    if (!ydata) {
                        ydata = "-";
                    }
                    //start 2017  02 08 wangli
                    if (res == undefined || "undefined" == res || "" == res) {
                        return res;
                    }
                    //end
                    res += obj.seriesName + ":" + ydata;
                    //2016 11 11 wangli 添加非空判断

                    if (legendSelected[obj.seriesName]) {
                        if (tempunit[obj.seriesName] != undefined && "undefined" != tempunit[obj.seriesName] && null != tempunit[obj.seriesName] && "" != tempunit[obj.seriesName]) {
                            res += "(" + tempunit[obj.seriesName] + ")" + "<br/>";
                        } else {//2016 11 12 如果没有单位的话 则不显示单位 直接换行
                            res += "<br/>";
                        }
                    }

                    /*if (nodearray[n] != undefined && "undefined" != nodearray[n] && null != nodearray[n] && "" != nodearray[n]) {
                     res += "(" + nodearray[n] + ")" + "<br/>";
                     } else {//2016 11 12 如果没有单位的话 则不显示单位 直接换行
                     res += "<br/>";
                     }*/
                });
                return res;
            }
        },
        legend: {
            itemHeight: 10,
            selected: {},
            data: []
        },
        dataZoom: {
            showDetail: false,
            show: true,
            realtime: true,
            height: 20,
            start: 0,
            end: 100
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {
                    show: true,
                    title: LANG["common_saveasimage"],
                    lang: [LANG["common_save"]],
                    name: 'isolarcloud'
                }
            },
            right:'20'

        },
        grid: {
            show: false,
            borderWidth: 0,
            left: '5%',
            right: '5%'
        },
        legend: {
            itemHeight: 10,
            data: []
        },
        xAxis: [
            {
                type: 'category',
                data: getXAxisData(),
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#4488bb'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: 'black'
                    }
                }/*,
             nameTextStyle:{
             color: 'black'
             }*/
            }
        ],
        yAxis: [
            {
                position: 'left',
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: 'black'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#4488bb'
                    }
                }/*,
             nameTextStyle:{
             color: 'black'
             }*/
            }
        ]
        ,
        color: bColor,
        series: [{
            name: '',
            type: 'line',
            data: ['-', '-', '-', '-', '-', '-', '-', '-']
        }]
    };

    // legend点击事件
    myChart.on('legendselectchanged', function (params) {
        var selected = params.selected;
        legendSelected = selected;
    });
    // 数据区域缩放后的事件
    myChart.on('datazoom', function (params) {
        dataZoom = {
            show: true,
            realtime: true,
            height: 20,
            start: params.start,
            end: params.end
        };
    });

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    myChart.resize();
    window.onresize = function () {
        myChart.resize();
    };

    option.series.splice(0, option.series.length);
}

function getXAxisData() {
    var q1 = $("#dateHid").val();
    q1 = q1.split("-");
    var startd = new Date(q1[0].substring(0, 4), q1[0].substring(4, 6) - 1, q1[0].substring(6, 8), '00', '00', '00');
    var endd = new Date(q1[1].substring(0, 4), q1[1].substring(4, 6) - 1, q1[1].substring(6, 8), '23', '59', '59');
    var data = [];
    var now = new Date();
    var hour1 = 0;
    var end2 = 0;
    if (isdata >= 0 && isdata <= 3) {
        var cycle = $("#cycle").val();
        var end = 60 / cycle;
        for (var z = 0; z <= isdata; z++) {
            if (z == 0) {
                startd.setDate(startd.getDate() + 0);
            } else {
                startd.setDate(startd.getDate() + 1);
            }

            if (z == isdata && endd > now) {
                hour1 = now.getHours() + 1;
                var minutes = now.getMinutes() + 1;
                end2 = minutes / cycle;
                for (var i = 0; i < hour1; i++) {
                    if (i == hour1 - 1) {
                        for (var j = 0; j < end2; j++) {
                            var dTime = i < 10 ? ("0" + i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j))) : i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j));
                            data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "") + " " + dTime);
                        }
                    } else {
                        for (var j = 0; j < end; j++) {
                            var dTime = i < 10 ? ("0" + i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j))) : i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j));
                            data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "") + " " + dTime);
                        }
                    }

                }
            } else {
                for (var i = 0; i < 24; i++) {
                    for (var j = 0; j < end; j++) {
                        var dTime = i < 10 ? ("0" + i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j))) : i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j));
                        data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "") + " " + dTime);
                    }
                }
            }

        }
    }
    if (isdata > 3 && isdata <= 10) {
        var cycle = $("#cycle").val();
        if (cycle == "1day") {
            for (var i = 0; i <= isdata; i++) {
                if (i == 0) {
                    startd.setDate(startd.getDate() + 0);
                } else {
                    startd.setDate(startd.getDate() + 1);
                }

                data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], ""));
            }
        } else {
            var end = 60 / cycle;
            for (var z = 0; z <= isdata; z++) {
                if (z == 0) {
                    startd.setDate(startd.getDate() + 0);
                } else {
                    startd.setDate(startd.getDate() + 1);
                }

                if (z == isdata && endd > now) {
                    hour1 = now.getHours() + 1;
                    var minutes = now.getMinutes() + 1;
                    end2 = minutes / cycle;
                    for (var i = 0; i < hour1; i++) {
                        if (i == hour1 - 1) {
                            for (var j = 0; j < end2; j++) {
                                var dTime = i < 10 ? ("0" + i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j))) : i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j));
                                data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "") + " " + dTime);
                            }
                        } else {
                            for (var j = 0; j < end; j++) {
                                var dTime = i < 10 ? ("0" + i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j))) : i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j));
                                data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "") + " " + dTime);
                            }
                        }
                    }
                } else {
                    for (var i = 0; i < 24; i++) {
                        for (var j = 0; j < end; j++) {
                            var dTime = i < 10 ? ("0" + i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j))) : i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j));
                            data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "") + " " + dTime);
                        }
                    }
                }
            }
        }
    }
    if (isdata > 10 && isdata <= 31) {
        var cycle = $("#cycle").val();
        if (cycle == "1day") {
            for (var i = 0; i <= isdata; i++) {
                if (i == 0) {
                    startd.setDate(startd.getDate() + 0);
                } else {
                    startd.setDate(startd.getDate() + 1);
                }

                data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], ""));
            }
        } else {
            var end = 60 / cycle;
            for (var z = 0; z <= isdata; z++) {
                if (z == 0) {
                    startd.setDate(startd.getDate() + 0);
                } else {
                    startd.setDate(startd.getDate() + 1);
                }

                if (z == isdata && endd > now) {
                    hour1 = now.getHours() + 1;
                    var minutes = now.getMinutes() + 1;
                    end2 = minutes / cycle;
                    for (var i = 0; i < hour1; i++) {
                        if (i == hour1 - 1) {
                            for (var j = 0; j < end2; j++) {
                                var dTime = i < 10 ? ("0" + i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j))) : i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j));
                                data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "") + " " + dTime);
                            }
                        } else {
                            for (var j = 0; j < end; j++) {
                                var dTime = i < 10 ? ("0" + i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j))) : i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j));
                                data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "") + " " + dTime);
                            }
                        }
                    }
                } else {
                    for (var i = 0; i < 24; i++) {
                        for (var j = 0; j < end; j++) {
                            var dTime = i < 10 ? ("0" + i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j))) : i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j));
                            data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "") + " " + dTime);
                        }
                    }
                }
            }
        }
    }

    if (isdata > 31 && isdata <= 730) {

        var cycle = $("#cycle").val();
        if (cycle == "1mon") {
            for (var i = 0; i < parseInt(isdata / 30); i++) {
                if (i == 0) {
                    startd.setMonth(startd.getMonth() + 0);
                } else {
                    startd.setMonth(startd.getMonth() + 1);
                }
                var array = startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "").split("/");
                data.push(array[0] + "/" + array[1]);
            }

        } else {
            for (var i = 0; i <= isdata; i++) {
                if (i == 0) {
                    startd.setDate(startd.getDate() + 0);
                } else {
                    startd.setDate(startd.getDate() + 1);
                }
                // console.log(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], ""));
                data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], ""));
            }
        }
    }

    if (isdata > 730) {

        var cycle = $("#cycle").val();
        if (cycle == "1mon") {
            for (var i = 0; i <= isdata / 30; i++) {
                if (i == 0) {
                    startd.setMonth(startd.getMonth() + 0);
                } else {
                    startd.setMonth(startd.getMonth() + 1);
                }
                var array = startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "").split("/");
                data.push(array[0] + "/" + array[1]);
            }

        } else {
            for (var i = 0; i <= isdata / 365; i++) {
                if (i == 0) {
                    startd.setYear(startd.getFullYear() + 0);
                } else {
                    startd.setYear(startd.getFullYear() + 1);
                }
                var array = startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "").split("/");
                //console.log(array);
                data.push(array[0]);
            }
        }
    }


    if (data.length <= 0) {
        $("#cycle").val("15");
        return getXAxisData();
    }
    return data;
}

function getYAxis(unit) {
    var format = '{value}';
    var index = 0;
    var yAxisObj = {};
    var ysplit = [true];
    yAxisObj.type = "value";
    yAxisObj.name = LANG["all_station_unit"] + unit;
    yAxisObj.axisLine = {lineStyle: {color: '#4488bb'}};
    //yAxisObj.axisLabel = { textStyle : {color : 'black'}};
    //yAxisObj.nameTextStyle = {color : 'black'};
    yAxisObj.axisTick = {show: false};

    if (option.yAxis.length == 0) {
        yAxisObj.type = "value";
        //var show=true;
        yAxisObj.splitLine = {show: false};
        yAxisObj.axisLabel = {formatter: format, textStyle: {color: 'black'}};
        yAxisObj.unit = unit;
        yAxisObj.scale = true;
        option.yAxis.push(yAxisObj);
    } else if (option.yAxis.length == 1) {
        var unit1 = option.yAxis[0].unit;
        if (!unit1) {
            yAxisObj.type = "value";
            yAxisObj.splitLine = {show: false};
            yAxisObj.axisLabel = {formatter: format, textStyle: {color: 'black'}};
            yAxisObj.unit = unit;
            yAxisObj.scale = true;
            option.yAxis.splice(0, 1, yAxisObj);
            index = 0;
        } else if (unit != unit1) {
            yAxisObj.type = "value";
            yAxisObj.splitLine = {show: false};
            yAxisObj.axisLabel = {formatter: format, textStyle: {color: 'black'}};
            yAxisObj.unit = unit;
            yAxisObj.scale = true;
            option.yAxis.push(yAxisObj);
            index = 1;
        }
    } else if (option.yAxis.length == 2) {
        var unit1 = option.yAxis[0].unit;
        var unit2 = option.yAxis[1].unit;
        //console.log(unit+":"+unit1+"::"+unit2);
        if (unit == unit1) {
            index = 0;
            option.yAxis[0].name = LANG["all_station_unit"] + unit;
            //option.yAxis[0].axisLabel.formatter = format;
        } else if (unit == unit2) {
            index = 1;
            option.yAxis[1].name = LANG["all_station_unit"] + unit;
            //option.yAxis[1].axisLabel.formatter = format;
        } else {
            index = 0;
            option.yAxis[0].name = LANG["all_station_unit"] + unit;
            //option.yAxis[0].axisLabel.formatter = format;
            //yAxisObj.unit = unit;
        }
    }
    //console.log(option.yAxis);

    return index;
}

function showChart(node) {
    // 动画效果去除
    myChart.hideLoading();
    var node3 = node.getParentNode();
    var node2 = node3.getParentNode();
    var nid = node3.id;
    nid = nid.toString();
    var name = node3.name + "(" + nid.substring(2, 7) + ")/" + node.name;
    var legendData = option.legend.data;
    // 默认使用legend显示
    legendSelected[name] = true;
    option.legend.selected = legendSelected;

    for (var i = 0; i < legendData.length; i++) {
        if (legendData[i] == name) {
            myChart.setOption(option);
            return;
        }
    }
    var color = "";
    var symbol = "";

    //限制曲线的数量
    if (legendData.length > 14) {
        Sungrow.showMsg({
            container: {
                header: LANG["all_station_prompt"],
                content: LANG["all_station_numlimit"],
                noFn: true,
                noText: LANG["pro_management_determine"]
            },
            fixed: false
        });

        return;
    }


    if (chartnum < 30) {
        //color=initc[legendData.length];
        //此处修改为了避免出现重复颜色的曲线
        color = initc[chartnum];
        symbol = symbolList[chartnum];
    } else {
        //color = getRandomColor();
        //	color = initc[chartnum%30];
        for (var j = chartnum % 30; j < initc.length; j++) {

            var result = false;
            color = initc[j];
            symbol = symbolList[j];
            for (var k = 0; k < bColor.length; k++) {
                if (bColor[k] == color) {
                    result = true;
                }
            }
            if (result == true) {

            } else {
                break;
            }
        }
    }

    chartnum = chartnum + 1;
    node.color = color;
    addTr(node);
    var psKey = node.psId + "_" + node2.nodeKey + "_" + node3.nodeKey;
    var pointId = node.id;
    if (legendData.length == 0) {
        bColor.push(color);
        myChart.clear();
    } else {
        bColor.push(color);
    }
    var URL = "psChartAction_getChartData";
    var obj = {};
    obj["params.unit"] = node.unit;
    obj["params.pointId"] = pointId;
    obj["params.psKey"] = psKey;
    obj["params.date"] = $("#dateHid").val();
    var cycle = $("#cycle").val()
    obj["params.cycle"] = cycle;
    // 统计方式
    if (!/min/g.test($("#dateDef").text())) {
        // 一天以上的统计方式默认使用 峰值
        node.atype = 2;
    } else {
        // 采样
        node.atype = 5;
    }
    obj["params.dataType"] = node.atype;

    /*var jsondata = Dic.Ajax.request({
     url: URL,
     data: obj
     });*/
    $.SUN_post(URL, obj, function (jsondata) {
        //判断是否超时
        if (jsondata == null || jsondata == "null") {
            return;
        }
        var yAxisIndex = getYAxis(node.unit);
        var data = [];
        $.each(jsondata, function (i) {
            var d = jsondata[i];
            if (i == 0) {//第一个“--”必须转换，否则echarts绘不出来线
                d = jsondata[i] == "--" ? "" : jsondata[i];
            }
            data.push(d);
        });
        if (pointArray.indexOf(pointId) != -1 && cycle != "1day" && cycle != "1mon") {
            data = dealArray(data);
        }
        var seriesObj1 = {};
        seriesObj1.data = data;
        if (node.ctype == "1") {
            seriesObj1.symbol = symbol;
            seriesObj1.type = 'line';
        } else if (node.ctype == "2") {
            seriesObj1.type = 'bar';
        } else if (node.ctype == "3") {
            seriesObj1.symbol = symbol;
            seriesObj1.type = 'line';
            seriesObj1.step = 'start';
        } else {
            seriesObj1.symbol = symbol;
            seriesObj1.type = 'line';
        }
        seriesObj1.name = name;
        seriesObj1.unit = "(" + node.unit + ")";
        seriesObj1.yAxisIndex = yAxisIndex;
        option.legend.data.push(name);
        option.series.push(seriesObj1);
        //alert(seriesObj1.data);
        // 显示 tooltip
        option.tooltip.show = true;
        myChart.setOption(option);
    })

}

function delChart(obj) {
    //var index = $(".delA").index(obj);
    var index = $(".delA").index(obj) - 1;  //2016-06-30 ChuD; 批量删除
    var unitpart1;
    var unitpart2;
    var temp = "";
    //删除记录的单位信息
    var unitarray = nodeunit.toString().split(",");
    unitarray.splice(index, 1);
    for (var i = 0; i < unitarray.length; i++) {
        if (i == 0) {
            temp = unitarray[0];
        } else {
            temp = temp + "," + unitarray[i];
        }
    }
    nodeunit = temp;
    option.series.splice(index, 1);

    lName.splice(index, 1);

    //option.color.splice(index,1);
    bColor.splice(index, 1);

    var moveLenged = option.legend.data[index];

    option.legend.data.splice(index, 1);
    delete legendSelected[moveLenged];
    option.legend.data.selected = legendSelected;
    option.legend.selected = legendSelected;

    var newDataZoom = {
        show: true,
        realtime: true,
        height: 20,
        start: dataZoom.start,
        end: dataZoom.end
    };
    option.dataZoom = newDataZoom;
    nodeArray.splice(index, 1);
    checkYAxis();
    myChart.clear();
    var legendData = option.legend.data;
    if (legendData.length == 0) {
        initChart();
    } else {
        myChart.setOption(option);
        //myChart.refresh();
    }

    $($("#tbody").find("tr")[index]).remove();
    //2016 11 04 wangli 数据曲线 table 表格不对齐bug修改 wangli
    chartsHeadFixed();

    /*	if(navigator.appName == navigatorName || navigator.appName == navigatorName_11){
     $("#tbody").find("tr")[index].removeNode(true);
     }else{
     $("#tbody").find("tr")[index].remove();
     }
     */
}

//定时刷新

function refreshTime_point() {
    var text = $("#point_time").html();
    if (document.getElementById("setTime_point").checked) {
        // initTime();
        clearInterval(clearSetInterval);
        clearSetInterval = setInterval("getStart_point()", text * 60 * 1000);
    } else {
        clearInterval(clearSetInterval);
    }
}

function getStart_point() {
    var refresh_time = $("#dateDef").text();
    changedateSel(refresh_time);
}


function checkYAxis() {
    option.yAxis = [];
    var unitArray = [];
    var idAdd;
    for (var i = 0; i < nodeArray.length; i++) {
        if (unitArray.length == 2) {
            getYAxis(nodeArray[i].unit);
            break;
        }
        idAdd = true;
        for (var j = 0; j < unitArray.length; j++) {
            if (nodeArray[i].unit == unitArray[j]) {
                idAdd = false;
            }
        }
        if (idAdd) {
            unitArray.push(nodeArray[i].unit);
            getYAxis(nodeArray[i].unit);
        }
    }
    for (var i = 0; i < nodeArray.length; i++) {
        for (var j = 0; j < unitArray.length; j++) {
            if (nodeArray[i].unit == unitArray[j]) {
                option.series[i].yAxisIndex = j;
            }
        }
    }
}

function showChartByTime(node) {
    // 动画效果去除
    myChart.hideLoading();
    var node3 = node.getParentNode();
    var node2 = node3.getParentNode();
    var psKey = node.psId + "_" + node2.nodeKey + "_" + node3.nodeKey;
    var color = node.color;
    var pointId = node.id;
    var nid = node3.id;
    var dataType = node.atype;
    nid = nid.toString();

    var name = node3.name + "(" + nid.substring(2, 7) + ")" + "/" + node.name;
    var legendData = option.legend.data;
    if (legendData.length == 0) {
        myChart.clear();
    }

    //option.color.push(color);
    var URL = "psChartAction_getChartData";
    var obj = {};
    obj["params.unit"] = node.unit;
    obj["params.pointId"] = pointId;
    obj["params.psKey"] = psKey;

    // 统计方式处理
    if ($("#cycle").val() == 5 || $("#cycle").val() == 15 || $("#cycle").val() == 60) {
        if (dataType != 5 && dataType != 4) {
            // 一天以下的统计方式默认使用 采样
            node.atype = 5;
            dataType = 5;
        }
    } else {
        if (dataType != 1 && dataType != 2 && dataType != 3 && dataType != 4) {
            node.atype = 2;
            dataType = 2;
        }
    }
    obj["params.dataType"] = dataType;
    obj["params.date"] = $("#dateHid").val();
    obj["params.cycle"] = $("#cycle").val();
    $.SUN_post(URL, obj, function (jsondata) {
        var data = [];
        //断网或者异常等情况，统一跳转至登陆页面
        if (jsondata == null) {
            backToLogin();
        }

        if (jsondata) {
            $.each(jsondata, function (i) {
                var d = jsondata[i];
                if (i == 0) {//第一个“--”必须转换，否则echarts绘不出来线
                    d = jsondata[i] == "--" ? "" : jsondata[i];
                }
                data.push(d);
            });
        }
        if (pointArray.indexOf(pointId) != -1 && $("#cycle").val() != "1day" && $("#cycle").val() != "1mon") {
            data = dealArray(data);
        }
        var seriesObj1 = {};
        seriesObj1.data = data;

        seriesObj1.type = $("#ch" + node.psId + "_" + node.id).val();
        seriesObj1.name = name;

        var yAxisIndex = getYAxis(node.unit);
        seriesObj1.yAxisIndex = yAxisIndex;
        seriesObj1.unit = "(" + node.unit + ")";
        option.legend.data.push(name);
        option.series.push(seriesObj1);
        // 显示 tooltip
        option.tooltip.show = true;
        myChart.setOption(option);
        window.onresize = function () {
            myChart.resize();
        }
    },"","","",false);//改成同步的，fix http://192.168.0.236:8081/browse/ISLOAR-801
}


//控制容器高度

var getWindowSize = function () {
    return ["Height", "Width"].map(function (name) {
        return window["inner" + name] ||
            document.compatMode === "CSS1Compat" && document.documentElement["client" + name] || document.body["client" + name]
    });
};
$(function () {
    if (!+"\v1" && !document.querySelector) { // for IE6 IE7
        document.body.onresize = resize;
    } else {
        //window.onresize = resize;
    }
    function resize() {
        wSize();
        ptChart.resize();
        outputChart.resize();
        myChart.resize();
        return false;
    }
});


/**
 * 通过更改CSS,让表格表头产生悬停效果
 *
 * tableid  表格table id 带有#号前缀
 * tbodyid  表格tbody id 带有#号前缀
 */
function reDisplayReportTabTable(tableId, tbodyid) {
    if ($(tbodyid).find("tr:first")) { // 防止表格没有数据
        // 去除所有的样式
        $(tbodyid).removeAttr("style");
        $(tableId).find("thead").removeAttr("style");
        $(tbodyid).find("tr:first").find("td").each(function (i) {
            $(this).removeAttr("style");
        });
        $(tableId).find("thead").find("th").each(function (i) {
            $(this).removeAttr("style");
        });

        // 去除表格左边框
        $(tableId).css({"border-left": "0"});

        // 第一行数据
        var tableTbodyTd = $(tbodyid).find("tr:first").find("td");
        var tableThSizeArray = [];
        if ($.browser.msie || $.browser.mozilla) {
            if ($.browser.version <= 9) {
                $("#adjustPosition").css("height", "26px");
            }
        }
        // 保存初始表头单元格宽度
        $(tableId).find("thead").find("th:first-child").width(123);
        $(tbodyid).find("tr:first").find("td:first-child").width(123);
        $(tbodyid).find("tr:first").find("td").each(function (i) {
            var thWidth = $(this).width();
            tableThSizeArray.push(thWidth);
        });
        // 设置表头悬浮css
        $(tableId).find("thead").css({
            "display": "block",
            "position": "absolute",
            "top": "40px",
            "left": "0",
            "border-top": "1px solid #e2e2e2"
        });
        //  设置表格单元格宽度
        $(tableId).find("thead").find("th").each(function (i) {
            $(this).width(tableThSizeArray[i]);
            $(tableTbodyTd[i]).width(tableThSizeArray[i]);
        });
        // 设置tbody的相对位置
        var thHeight = $(tableId).find("thead").height() - 1;
        var marginTop = thHeight + "px";
        $(tbodyid).css({"display": "block", "margin-top": marginTop, "left": "0"});
    }
}

function initTime_psPoint(flag) {
    /**  var yest_day = GetDay(0);
     var tom_day = GetDay(0);
     yest_day = yest_day.substring(0, yest_day.indexOf(" ") + 1) + "00:00";
     tom_day = tom_day.substring(0, tom_day.indexOf(" ") + 1) + "23:59";
     $("#start").val(yest_day);
     $("#end").val(tom_day);
     $("#end").val(tom_day);
     $("#quick_date1").html(yest_day);
     $("#quick_date2").html(tom_day);
     tom_day = (tom_day.replace("-", "")).replace("-", "").replace(" ", "")
     .replace(":", "");
     yest_day = (yest_day.replace("-", "")).replace("-", "").replace(" ", "")
     .replace(":", "");

     $("#dateHid").val(yest_day + "-" + tom_day);*/
    var today = GetDay(0);
    var todayStr = today.substring(0, today.indexOf(" "));
    $("#dayTimeInput").val(todayStr);
    if (!flag) {
        $("#quick_date1").html(todayStr + " 00:00");
        $("#quick_date2").html(todayStr + " 23:59"); // 隐藏域
        $("#quick_date3").html(todayStr + " 23:59"); // 给quick_date3赋值
    }
    $("#dateHid").val(todayStr.replace(/\-/g, "") + "0000" + "-" + todayStr.replace(/\-/g, "") + "2359");

}

function getlastday(year, month) {
    var new_year = year;    //取当前地年份
    var new_month = month++;//取下一个月地第一天，方便计算（最后一天不固定）
    if (month > 12)            //如果当前大于12月，则年份转到下一年
    {
        new_month -= 12;        //月份减
        new_year++;            //年份增
    }
    var new_date = new Date(new_year, new_month, 1);                //取当年当月中地第一天
    var s = (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();
    //s = eval(s+1);
    return s;//获取当月最后一天日期
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
    var arr = ["日", "一", "二", "三", "四", "五", "六"], weekDay;
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
    if (strDay < 10)
        strDay = "0" + strDay;//获取当前分钟数(0-59)
    if (strMonth < 10)
        strMonth = "0" + strMonth;
    if (strHours < 10)
        strHours = "0" + strHours;
    if (strMin < 10)
        strMin = "0" + strMin;
    return strYesterday = strYear + "-" + strMonth + "-" + strDay + " "
        + strHours + ":" + strMin;
}

function changeSel() {
    var str = "";
    if (isdata >= 0 && isdata <= 3) {
        str = "<li onclick=changedateSel('5min');><a href='javascript:void(0);'>5min</a></li><li onclick=changedateSel('15min');><a href='javascript:void(0);'>15min</a></li><li onclick=changedateSel('60min');><a href='javascript:void(0);'>60min</a></li>";
        $("#dateSel").html(str);
        $("#dateDef").text("15min");
    } else if (isdata > 3 && isdata <= 10) {
        str = "<li onclick=changedateSel('15min');><a href='javascript:void(0);'>15min</a></li><li onclick=changedateSel('60min');><a href='javascript:void(0);'>60min</a></li><li onclick=changedateSel('1day');><a href='javascript:void(0);'>1day</a></li>";
        $("#dateSel").html(str);
        $("#dateDef").text("60min");
    } else if (isdata > 10 && isdata <= 31) {
        str = "<li onclick=changedateSel('60min');><a href='javascript:void(0);'>60min</a></li><li onclick=changedateSel('1day');><a href='javascript:void(0);'>1day</a></li>";
        $("#dateSel").html(str);
        $("#dateDef").text("1day");
    } else if (isdata > 31 && isdata <= 730) {
        str = "<li onclick=changedateSel('1day');><a href='javascript:void(0);'>1day</a></li><li onclick=changedateSel('1mon');><a href='javascript:void(0);'>1mon</a></li>";
        $("#dateSel").html(str);
        $("#dateDef").text("1mon");
    } else if (isdata > 730) {
        str = "<li onclick=changedateSel('1mon');><a href='javascript:void(0);'>1mon</a></li><li onclick=changedateSel('1year');><a href='javascript:void(0);'>1year</a></li>";
        $("#dateSel").html(str);
        $("#dateDef").text("1year");
    }
}

function initColor(id) {
    var thisId = id;
    $("#" + id).minicolors({
        control: $(this).attr('data-control') || 'hue',
        defaultValue: $(this).attr('data-defaultValue') || '',
        inline: $(this).attr('data-inline') === 'true',
        letterCase: $(this).attr('data-letterCase') || 'lowercase',
        opacity: $(this).attr('data-opacity'),
        position: $(this).attr('data-position') || 'bottom left',
        hide: function (opacity) {
            changeColor(thisId, $("#" + thisId).val());
        },
        change: function (hex, opacity) {
            if (!hex)
                return;
            if (opacity)
                hex += ', ' + opacity;
            try {

            } catch (e) {
            }
        },
        theme: 'bootstrap'
    });
}

function initselect() {

    $(".select_down ul li")
        .click(function () {

            //var ul_li = $(this)[0].text();
            //console.log($(this)[0].innerText);
            //$(this).parent().parent("span")[0].innerText=$(this)[0].innerText;
            //console.log($(this));
            //console.log($(this)[0].innerText);
            //console.log($(this).parent());
            //	console.log($(this).parent().parent("span"));
            //$(this).parent("span")[0].children[0].innerText=$(this)[0].innerText;
            $(this).parent().parent("span")[0].children[0].innerText = $(this)[0].innerText;
            //$(this).parent().parent("span").find(".now_a").contenxt.innerText=$(this)[0].innerText;
        });

    $(".select_down1 ul li")
        .click(function () {

            //var ul_li = $(this)[0].text();
            //console.log($(this)[0].innerText);
            //$(this).parent().parent("span")[0].innerText=$(this)[0].innerText;
            //console.log($(this));
            //console.log($(this)[0].innerText);
            //console.log($(this).parent());
            //	console.log($(this).parent().parent("span"));
            //$(this).parent("span")[0].children[0].innerText=$(this)[0].innerText;
            $(this).parent().parent("span")[0].children[0].innerText = $(this)[0].innerText;
            //$(this).parent().parent("span").find(".now_a").contenxt.innerText=$(this)[0].innerText;
        });

}

function selectValue(obj) {
    if ($(obj).find("ul").is(":hidden")) {
        $(".select_down1").find("ul").hide();
        $(obj).find("ul").slideDown(200);
        if ($(obj).hasClass("data_type_span")) {
            var dataDefVal = $("#dateDef").text();
            //动态显示统计方式
            if (dataDefVal == "5min" || dataDefVal == "15min" || dataDefVal == "60min") {
                $(obj).find("ul .agent_type_5").css("display", "block");
                $(obj).find("ul .agent_type_1").css("display", "none");
                $(obj).find("ul .agent_type_2").css("display", "none");
                $(obj).find("ul .agent_type_3").css("display", "none");
                $(obj).find("ul .agent_type_4").css("display", "block");
            } else {
                $(obj).find("ul .agent_type_5").css("display", "none");
                $(obj).find("ul .agent_type_1").css("display", "block");
                $(obj).find("ul .agent_type_2").css("display", "block");
                $(obj).find("ul .agent_type_3").css("display", "block");
                $(obj).find("ul .agent_type_4").css("display", "block");
            }
        }
    } else {
        $(obj).find("ul").slideUp(200);
    }

}

function changedateSel(value) {
    if (value == "5min") {
        $("#cycle").val(5);
    } else if (value == "15min") {
        $("#cycle").val(15);
    } else if (value == "60min") {
        $("#cycle").val(60);
    } else if (value == "1day") {
        $("#cycle").val("1day");
    } else if (value == "1mon") {
        $("#cycle").val("1mon");
    } else if (value == "1year") {
        $("#cycle").val("1year");
    }

    //处理卡顿现象SJE-1294
    layer.load(0, 2);
    // 更改统计方式的显示
    if (!/min/g.test(value)) {
        $.each($("span.data_type_span>a"), function (n, obj) {
            if ($(obj).text() == LANG.all_station_aggenttype_5) {
                $(obj).text(LANG.all_station_aggenttype_2);
            }
        });
    } else {
        $.each($("span.data_type_span>a"), function (n, obj) {
            if ($(obj).text() == LANG.all_station_aggenttype_2 ||
                $(obj).text() == LANG.all_station_aggenttype_3 || $(obj).text() == LANG.all_station_aggenttype_1) {
                $(obj).text(LANG.all_station_aggenttype_5);
            }
        });
    }

    myChart.clear();
    initChart();
    for (var i = 0; i < nodeArray.length; i++) {
        showChartByTime(nodeArray[i]);
    }
    layer.closeAll();

}

function reportTab() {
    var tabName = "";
    var lname1 = "", lname2 = "";
    var nstr = "";
    var data_title = "";
    var data_content = "";
    var count = 0;
    var nodeunitLocal = "";
    if (nodeunit.indexOf(",") >= 0) {
        nodeunitLocal = nodeunit.split(",");
    } else {
        nodeunitLocal = nodeunit;
    }

    if (option.legend.data.length > 0) {
        var nameArr = option.legend.data;
        nstr = "<thead><tr>";
        nstr += "<th>" + LANG["station_report_time"] + "</th>";
        data_title += LANG["station_report_time"];
        for (var i = 0; i < nameArr.length; i++) {

            if (lName[0] == lName[0 + i]) {
                lname1 = lName[0 + i];
            } else {
                if (lname2 != lName[0 + i]) {
                    lname2 = lName[0 + i];
                    count = count + 1;
                }
            }
            if (nameArr.length > 1) {
                nstr += "<th>" + nameArr[i] + "(" + nodeunitLocal[i] + ")" + "</th>";
                data_title += "," + nameArr[i] + "(" + nodeunitLocal[i] + ")";
            } else {
                nstr += "<th>" + nameArr[i] + "(" + nodeunitLocal + ")" + "</th>";
                data_title += "," + nameArr[i] + "(" + nodeunitLocal + ")";
            }
        }
        nstr += "</tr></thead>";
        nstr += "<tbody id ='reportTabTobody'>";
        var xtime = option.xAxis[0].data;
        for (var i = 0; i < xtime.length; i++) {
            //start 根据 报表类型 显示相应的时间格式 2016 11 08 wangli
            //var dateLen = xtime[i].length;
            //if (dateLen > 5) {
            //    xtime[i] = xtime[i].substring(5);
            //}
            //end
            nstr += "<tr>";
            nstr += "<td>" + xtime[i] + "</td>";
            data_content += xtime[i];
            for (var j = 0; j < nameArr.length; j++) {
                var ydata = option.series[j].data;
                //start 2017 03 09 wangli 对为空的数据显示为"--"
                if(isEmptyStr(ydata[i])){
                    nstr += "<td>" + '--' + "</td>";
                    data_content += ",--";
                }else {
                    nstr += "<td>" + ydata[i] + "</td>";
                    data_content += "," + ydata[i];
                }
            }
            nstr += "</tr>";
            data_content += ";";
        }

        if (count > 1) {
            tabName = lname1 + "..." + lname2;
        } else {
            tabName = lname1 + " " + lname2;
        }

        nstr += "</tbody>";
        $("#reportTab").html(nstr);
        var q1 = $("#dateHid").val();
        q1 = q1.split("-");
        /*************** 判断如果为英文版，则时间显示格式为yyyy-mm-dd 裴习柱 2016-08-26 *************/
        var lang = $("#language").val(); // 获取当前版本的语言
        if (lang == "en_US") {
            LANG["station_report_year"] = "-";
            LANG["station_report_month"] = "-";
            LANG["all_station_day"] = " ";
            if (isdata == 0) {
                tabName += " " + q1[0].substring(0, 4) + LANG["station_report_year"] + q1[0].substring(4, 6) + LANG["station_report_month"]
                    + q1[0].substring(6, 8) + LANG["all_station_day"] + LANG["station_report"];
            } else {
                tabName += " " + q1[0].substring(0, 4) + LANG["station_report_year"] + q1[0].substring(4, 6)
                    + LANG["station_report_month"] + q1[0].substring(6, 8) + LANG["all_station_day"];
                tabName += LANG["all_station_to"] + q1[1].substring(0, 4) + LANG["station_report_year"] + q1[1].substring(4, 6) + LANG["station_report_month"]
                    + q1[1].substring(6, 8) + LANG["all_station_day"] + LANG["station_report"];
            }
        } else {
            if (isdata == 0) {
                tabName += " " + q1[0].substring(0, 4) + LANG["station_report_year"] + q1[0].substring(4, 6) + LANG["station_report_month"]
                    + q1[0].substring(6, 8) + LANG["all_station_day"] + LANG["station_report"];
            } else {
                tabName += " " + q1[0].substring(0, 4) + LANG["station_report_year"] + q1[0].substring(4, 6)
                    + LANG["station_report_month"] + q1[0].substring(6, 8) + LANG["all_station_day"];
                tabName += LANG["all_station_to"] + q1[1].substring(0, 4) + LANG["station_report_year"] + q1[1].substring(4, 6) + LANG["station_report_month"]
                    + q1[1].substring(6, 8) + LANG["all_station_day"] + LANG["station_report"];
            }
        }
        /*************** 判断如果为英文版，则时间显示格式为yyyy-mm-dd 裴习柱 2016-08-26 *************/
        $("#tabName").html(tabName);
        //给隐藏域赋值
        $("#data_title").val(data_title);
        $("#data_content").val(data_content);
        $("#excel_title").val(tabName);
    }

}

function exportExcel() {
    if ($("#excel_title").val() == "") {
        return;
    }
    $("#data_form").submit();
}

//日期格式化成yyyy-mm-dd
function dateToString(date) {
    if (date instanceof Date) {
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10)
            month = "0" + month;//获取当前分钟数(0-59)
        if (day < 10)
            day = "0" + day;
        return date.getFullYear() + "-" + month + "-" + day;
    } else {
        return date;
    }
}

//批量删除 ChuD
// function psPoint_delAllChart() {
//     $(".delA").each(function (i, o) {
//         delChart(o);
//     });
// }
function psPoint_delAllChart() {
    nodeunit = "";
    option.series=[];
    lName=[];
    bColor=[];
    option.legend.data=[];
    legendSelected={};
    option.legend.data.selected = legendSelected;
    option.legend.selected = legendSelected;

    var newDataZoom = {
        show: true,
        realtime: true,
        height: 20,
        start: dataZoom.start,
        end: dataZoom.end
    };
    option.dataZoom = newDataZoom;
    nodeArray=[];
    checkYAxis();
    myChart.clear();
    initChart();

    $($("#tbody").find("tr")).remove();
    chartsHeadFixed();
}

function chartsHeadFixed() {
    //$(".sjqx_bottom_tab").scrollTop(1);
    //if($(".sjqx_bottom_tab").scrollTop()>0 ){
    //    if ((navigator.userAgent.indexOf('MSIE') >= 0)
    //        && (navigator.userAgent.indexOf('Opera') < 0)) {
    //        $(".nbq_tab_top").width($(".sjqx_tab").width()-18);
    //    } else {//非ie浏览器
    //        $(".nbq_tab_top").width($(".sjqx_tab").width()-6);
    //    }
    //}else{
    //    $(".nbq_tab_top").width($(".sjqx_tab").width());
    //}
    //table表头固定js调用
    $(".sjqx_tab").tabheader({
        table_header: 'nbq_tab_top',
        table_parent: 'sjqx_tab',
        table_height: 'sjqx_bottom_tab',
        table_parent_height: 'sjqx_tab',
    });
}

		
 