var psName = '', ctx = '', staticUrl = '';

new Vue({
    el: '#dataCurve',
    data: {
        stationId: 'gs', //电站id
        myChart: null, //chart
        isdata: 0,  //时间范围
        bColor: [],
        option: {},
        legendSelected: {},
        initc: ["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#00ffff", "#ffff00", "#000000", "#70db93", "#cd7f32", "#c0c0c0", "#9f9f9f",
            "#8e236b", "#ff7f00", "#db70db", "#bc8f8f", "#8a2be2", "#a52a2a", "#ff7f50", "#dc143c", "#00008b", "#008b8b", "#b8860b",
            "#a9a9a9", "#e9967a", "#8fbc8f", "#483d8b", "#2f4f4f", "#00ced1", "#1e90ff", "#b22222"],
        // 主题，默认标志图形类型列表
        symbolList: [
            'circle', 'rectangle', 'triangle', 'diamond',
            'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond',
            'circle', 'rectangle', 'triangle', 'diamond',
            'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond',
            'circle', 'rectangle', 'triangle', 'diamond'
        ],
        chartnum: 0,
        nodeunit: "",
        nodeArray: [],
        sName: [],
        lName: [],
        clearSetInterval: null,  //定时刷新
        firstTreeFlag: true,  //是否是一级树
        dataZoom: {},

        investType: 'single',  //单条查询single 切换日期为多条查询all

        section_dateType: 'dayType',  //日周月年类型  default  日dayType weekType  monthType yearType

        newStationList:[], //电站列表

        //频率
        timetype:"0",
        //虚曲线线下部的电站table
        node: {}
    },
    methods: {

        //初始化页面尺寸
        initSize: function () {
            $('.map_con_fl').height($(window).height() - 80);
            $('.tendency_ri').height($(window).height() - 80);
            $('.sjqx_bottom_tab').height($(window).height() * .2);
            $('.tendencyChart_con2').height($(window).height() * .5);

            $(window).resize(function () {
                $('.map_con_fl').height($(window).height() - 80);
                $('.tendency_ri').height($(window).height() - 80);
                $('.sjqx_bottom_tab').height($(window).height() * .2);
                $('.tendencyChart_con2').height($(window).height() * .5);
            });
        },

        //初始化表格
        initchart: function () {
            var _this = this;
            this.myChart = echarts.init(document.getElementById('main'));
            // 指定图表的配置项和数据
            this.option = {
                title: {
                    text: ''
                },
                tooltip: {
                    show: false,
                    trigger: 'axis',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    formatter: function (params) {
                        var res = "";
                        $.each(params, function (n) {
                            if (params[n].name) {
                                res = params[n].name + "<br/>";
                            }
                        });
                        if (params[0].name == undefined || params[0].name == "") {
                            res = params[0][1];
                        }
                        var nodearray = _this.nodeunit.split(",");
                        $.each(params, function (n) {
                            var obj = params[n];
                            var ydata = obj.data;
                            if (!ydata) {
                                ydata = "-";
                            }
                            if (res == undefined || "undefined" == res || "" == res) {
                                return res;
                            }
                            res += obj.seriesName + ":" + ydata;
                            //添加非空判断
                            if (nodearray[n] != undefined && "undefined" != nodearray[n] && null != nodearray[n] && "" != nodearray[n]) {
                                res += "(" + nodearray[n] + ")" + "<br/>";
                            } else {//如果没有单位的话 则不显示单位 直接换行
                                res += "<br/>";
                            }
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
                    }
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
                        data: this.getXAxisData(),
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
                        }
                    }
                ],
                color: this.bColor,
                series: [{
                    name: '',
                    type: 'line',
                    data: ['-', '-', '-', '-', '-', '-', '-', '-']
                }]
            };

            // 使用刚指定的配置项和数据显示图表。
            this.myChart.setOption(this.option);
            window.onresize = function () {
                _this.myChart.resize();
            };

            this.option.series.splice(0, this.option.series.length);
        },

        //获取X轴数据
        getXAxisData: function () {
            var q1 = $("#dateHid").val().replace(/-+/g, '');
            q1 = q1.split("&");
            var startd = new Date(q1[0].substring(0, 4), q1[0].substring(4, 6) - 1, q1[0].substring(6, 8), '00', '00', '00');
            var endd = new Date(q1[1].substring(0, 4), q1[1].substring(4, 6) - 1, q1[1].substring(6, 8), '23', '59', '59');
            var data = [];
            var now = new Date();
            var hour1 = 0;
            var end2 = 0;
            if (this.isdata >= 0 && this.isdata <= 3) {
                var cycle = $("#cycle").val();
                var end = 60 / cycle;
                for (var z = 0; z <= this.isdata; z++) {
                    if (z == 0) {
                        startd.setDate(startd.getDate() + 0);
                    } else {
                        startd.setDate(startd.getDate() + 1);
                    }

                    if (z == this.isdata && endd > now) {
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

            if (this.isdata > 3 && this.isdata <= 10) {
                var cycle = $("#cycle").val();
                if (cycle == "1day") {
                    for (var i = 0; i <= this.isdata; i++) {
                        if (i == 0) {
                            startd.setDate(startd.getDate() + 0);
                        } else {
                            startd.setDate(startd.getDate() + 1);
                        }

                        data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], ""));
                    }
                } else {
                    /*---------------问题出现在这里------------*/
                    var startd1 = $("#quick_date1").html(),
                    endd1 = $("#quick_date2").html(),
                    startStr = startd1.replace(/[-:\s]*/ig, ''),
                    endStr = endd1.replace(/[-:\s]*/ig, '');
                    /*var q2 = $("#dateHid").val().replace(/-+/g, '');
                    q2 = q2.split("&");
                    console.log('q2' + q2)*/
                    var startd = new Date(startStr.substring(0, 4), startStr.substring(4, 6) - 1, startStr.substring(6, 8), '00', '00', '00');
                    var endd = new Date(endStr.substring(0, 4), endStr.substring(4, 6) - 1, endStr.substring(6, 8), '23', '59', '59');

                    var end = 60 / cycle;
                    for (var z = 0; z <= this.isdata; z++) {
                        if (z == 0) {
                            startd.setDate(startd.getDate() + 0);
                        } else {
                            startd.setDate(startd.getDate() + 1);
                        }
                        if (z == this.isdata && endd > now) {
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
                            /*这里为了解决选择周的时候x轴渲染日期太短不完整的问题，把数据写死了，将end直接改为了2倍*/
                            for (var i = 0; i < (end * 2); i++) {
                                for (var j = 0; j < 6; j++) {
                                    var dTime = i < 10 ? ("0" + i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j))) : i + ":" + ((cycle * j) < 10 ? ("0" + cycle * j) : (cycle * j));
                                    data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "") + " " + dTime);
                                }
                            }
                        }
                    }
                }

            }
            if (this.isdata > 10 && this.isdata <= 31) {
                var cycle = $("#cycle").val();
                if (cycle == "1day") {
                    for (var i = 0; i <= this.isdata; i++) {
                        if (i == 0) {
                            startd.setDate(startd.getDate() + 0);
                        } else {
                            startd.setDate(startd.getDate() + 1);
                        }

                        data.push(startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], ""));
                    }
                } else {
                    var end = 60 / cycle;
                    for (var z = 0; z <= this.isdata; z++) {
                        if (z == 0) {
                            startd.setDate(startd.getDate() + 0);
                        } else {
                            startd.setDate(startd.getDate() + 1);
                        }

                        if (z == this.isdata && endd > now) {
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

            if (this.isdata > 31 && this.isdata <= 730) {

                var cycle = $("#cycle").val();
                if (cycle == "1mon") {
                    for (var i = 0; i < parseInt(this.isdata / 30); i++) {
                        if (i == 0) {
                            startd.setMonth(startd.getMonth() + 0);
                        } else {
                            startd.setMonth(startd.getMonth() + 1);
                        }
                        var array = startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "").split("/");
                        data.push(array[0] + "/" + array[1]);
                    }

                } else {
                    for (var i = 0; i <= this.isdata; i++) {
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

            if (this.isdata > 730) {

                var cycle = $("#cycle").val();
                if (cycle == "1mon") {
                    for (var i = 0; i <= this.isdata / 30; i++) {
                        if (i == 0) {
                            startd.setMonth(startd.getMonth() + 0);
                        } else {
                            startd.setMonth(startd.getMonth() + 1);
                        }
                        var array = startd.toLocaleDateString().replace(LANG["all_station_yearmonth_reg"], "/").replace(LANG["all_station_day_reg"], "").split("/");
                        data.push(array[0] + "/" + array[1]);
                    }

                } else {
                    for (var i = 0; i <= this.isdata / 365; i++) {
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
                return this.getXAxisData();
            }
            return data;
        },

        //获取Y轴数据
        getYAxis: function (unit) {
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

            if (this.option.yAxis.length == 0) {
                yAxisObj.type = "value";
                //var show=true;
                yAxisObj.splitLine = {show: false};
                yAxisObj.axisLabel = {formatter: format, textStyle: {color: 'black'}};
                yAxisObj.unit = unit;
                yAxisObj.scale = true;
                this.option.yAxis.push(yAxisObj);
            } else if (this.option.yAxis.length == 1) {
                var unit1 = this.option.yAxis[0].unit;
                if (!unit1) {
                    yAxisObj.type = "value";
                    yAxisObj.splitLine = {show: false};
                    yAxisObj.axisLabel = {formatter: format, textStyle: {color: 'black'}};
                    yAxisObj.unit = unit;
                    yAxisObj.scale = true;
                    this.option.yAxis.splice(0, 1, yAxisObj);
                    index = 0;
                } else if (unit != unit1) {
                    yAxisObj.type = "value";
                    yAxisObj.splitLine = {show: false};
                    yAxisObj.axisLabel = {formatter: format, textStyle: {color: 'black'}};
                    yAxisObj.unit = unit;
                    yAxisObj.scale = true;
                    this.option.yAxis.push(yAxisObj);
                    index = 1;
                }
            } else if (this.option.yAxis.length == 2) {
                var unit1 = this.option.yAxis[0].unit;
                var unit2 = this.option.yAxis[1].unit;
                if (unit == unit1) {
                    index = 0;
                    this.option.yAxis[0].name = LANG["all_station_unit"] + unit;
                } else if (unit == unit2) {
                    index = 1;
                    this.option.yAxis[1].name = LANG["all_station_unit"] + unit;
                } else {
                    index = 0;
                    this.option.yAxis[0].name = LANG["all_station_unit"] + unit;
                }
            }
            return index;
        }
        ,

        //时间选择
        changeDate: function () {
            var _this = this;
            var dates = new Date();
            var endDate = dates.getFullYear() + '-' + (dates.getMonth() + 1) + '-' + dates.getDate() + 'T' + dates.getHours() + ':' + dates.getMinutes() + ':' + dates.getSeconds();
            var tom_day = vlm.Utils.format_date(endDate, 'YmdHispace');
            var startDate = dates.getFullYear() + '-' + (dates.getMonth() + 1) + '-' + dates.getDate() + 'T' + dates.getHours() + ':' + dates.getMinutes() + ':' + dates.getSeconds();
            var yest_day = vlm.Utils.format_date(startDate, 'YmdHizero');
            $("#start").val(yest_day.substring(0, 10));
            $("#quick_date1").html(yest_day);
            $("#quick_date2").html(tom_day);
            if (tom_day) {
                tom_day = (tom_day.replace("-", "")).replace("-", "").replace(" ", "").replace(":", "");
            }
            if (yest_day) {
                yest_day = (yest_day.replace("-", "")).replace("-", "").replace(" ", "").replace(":", "");
            }
            $("#dateHid").val(yest_day + "&" + tom_day);

            //时间选择显示隐藏事件
            $(".date_btn").unbind().bind("click", function (event) {
                var dateWrap_height = $(".dateWrap").is(":hidden");
                if (dateWrap_height) {
                    $(".dateWrap").show();
                } else {
                    $(".dateWrap").hide();
                }
                event.stopPropagation();
            });

            //i记录日期控件选择的时间类型：日，周，年……
            var i = 0;
            //年月日事件切换
            $(".dateWrap_tit ul li").click(function () {
                var index = $(this).index();
                $(".dateWrap_tit ul li").removeClass("on");
                $(this).addClass("on");
                $('.ate_togg >ul').eq(index).addClass("active").siblings().removeClass('active');
                if (index == 0) { //天
                    _this.section_dateType = 'dayType';
                    $("#start").val(vlm.Utils.GetDay().substring(0, 10));

                } else if (index == 1) { //周
                    /*-------------------------周选择问题-----------------------------------*/
                    _this.section_dateType = 'weekType';
                    var now_day = vlm.Utils.GetDay();
                    var week_year = vlm.Utils.getWeekNumber()[0];
                    var week_num = vlm.Utils.getWeekNumber()[1];
                    $("#week").val(week_year + LANG["all_station_yearof"] + week_num + LANG["all_station_week"]);
                } else if (index == 2) { //月
                    _this.section_dateType = 'monthType';
                    var now_day = vlm.Utils.GetDay();
                    var yest_day = vlm.Utils.GetDay(0, 0, -1);
                    var year = now_day.substring(0, now_day.indexOf("-"));
                    var month = now_day.substring(now_day.indexOf("-"), now_day.indexOf("-") + 3);
                    $("#month").val(year + month);
                } else if (i == 3) {//年
                    _this.section_dateType = 'yearType';
                    var now_day = vlm.Utils.GetDay();
                    var month = now_day.substring(now_day.indexOf("-") + 1, now_day.indexOf("-") + 3);
                    var year = now_day.substring(0, now_day.indexOf("-"));
                    $("#year").val(year + LANG["all_station_yeartail"]);
                }
            });

            $('.wrap_su').click(function () {
                var dateType = $(this).attr('data-dateType');
                if (dateType == 'day') { //日
                    var yest_day = $("#start").val() + ' 00:00';
                    var new_tom_day = $("#start").val() + ' 23:59';
                    $("#quick_date1").html(yest_day);
                    $("#quick_date2").html(new_tom_day);
                    $("#dateHid").val(yest_day + "&" + new_tom_day);
                } else if (dateType == 'week') {  //周
                    var time_curr = vlm.Utils.GetDay();
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
                    $("#quick_date1").html(vlm.Utils.dateToString(start) + " 00:00");
                    $("#quick_date2").html(vlm.Utils.dateToString(end) + " 23:59");

                    quick_date1 = $("#quick_date1").html();
                    quick_date2 = $("#quick_date2").html();
                    var s = quick_date1.substring(0, quick_date1.indexOf(" ")).split("-");
                    var e = quick_date2.substring(0, quick_date1.indexOf(" ")).split("-");
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

                    //isdata赋值
                    _this.isdata = parseInt(Math.abs(endd - startd) / 1000 / 60 / 60 / 24);


                    //if (value == "5min") {
                    //    $("#cycle").val(5);
                    //} else if (value == "15min") {
                    //    $("#cycle").val(15);
                    //} else if (value == "60min") {
                    //    $("#cycle").val(60);
                    //} else if (value == "1day") {
                    //    $("#cycle").val("1day");
                    //} else if (value == "1mon") {
                    //    $("#cycle").val("1mon");
                    //} else if (value == "1year") {
                    //    $("#cycle").val("1year");
                    //}

                }

                $(".dateWrap").slideUp();

                _this.investType = 'all';  //切换为多条查询
                _this.changedateSel();

            });
        },

        //更新时间
        refreshClick: function () {

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
                    if ($(this).attr("class") == "allsite_dateUpBtn1") {
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
                _this.refreshTime_point();
            });
        },

        //更换左侧列表电站
        changeStation: function (e) {
            var target = null;
            if (e == 1) {

            } else {
                if ($(e.target)[0].tagName == 'A') {
                    target = $(e.target).parent();
                } else if ($(e.target)[0].tagName == 'LI') {
                    target = $(e.target);
                } else {
                    return;
                }
                if (!target.hasClass('on')) {
                    target.addClass('on').siblings().removeClass('on');
                    this.stationId = target.attr('id')
                    this.firstTreeFlag = true; //重置首次树boolean
                    $('.ztree').remove(); //清空ztree
                    this.showTree(this.stationId, '0');
                }
            }
        },

        //获取tree数据
        showTree: function (id, isdata) {
            var _this = this;
            var Parameters = {
                "parameters": {
                    "stationid": this.stationId
                },
                "foreEndType": 2,
                "code": "30000006"
            };
            if (!this.firstTreeFlag) {
                Parameters.parameters.fd_dev_id = id;
                Parameters.parameters.fd_isdata = isdata;
            }

            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                //console.log(res);
                if (res.success) {
                    var zNodes = res.data;
                    if (zNodes) {
                        var newNodes = [];
                        for (var i = 0; i < zNodes.length; i++) {
                            showTreeNodeImageByDeviceType(zNodes[i]); //code图标转换
                            if (zNodes[i].fd_dev_class_id == 10) {  //非特殊图标eg：svg文件夹
                                zNodes[i].icon = "";
                            }
                            var obj = {
                                id: zNodes[i].fd_dev_id,  //设备id
                                fd_name: zNodes[i].fd_name,  //设备名字
                                icon: zNodes[i].icon,     //设备图标
                                isdata: zNodes[i].fd_isdata, //是否数据
                                fd_tablename: zNodes[i].fd_tablename, //表名
                                fd_code: zNodes[i].fd_code, //点名
                                load_once: true, //点名
                            };

                            if (_this.firstTreeFlag) {  //首次树
                                if (i == 0) {
                                    obj.treeIcon = 'roots_close';
                                } else {
                                    obj.treeIcon = 'bottom_close';
                                }
                            } else {  //非首次
                                if (zNodes[i].fd_isdata == 2 || zNodes[i].fd_isdata == 1) {
                                    obj.treeIcon = 'center_docu';  //是数据
                                    obj.addOnly = 'onlyLi';
                                } else if (zNodes[i].fd_isdata == 0 || zNodes[i].fd_isdata == -1) {
                                    obj.treeIcon = 'bottom_close';
                                }
                            }

                            newNodes.push(obj);
                        }

                        var powerhtml = $('#powerTpl0').html();
                        var powerLi = ejs.render(powerhtml, {newNodes: newNodes});
                        var oUl = null;
                        if (_this.firstTreeFlag) {
                            oUl = $('<ul class="ztree"></ul>');
                        } else {
                            oUl = $('<ul class="line"></ul>');
                        }
                        oUl.html(powerLi);
                        oUl.appendTo($('#' + id));

                        oUl.find('>li').click(function (e) {
                            e.stopPropagation();
                            if ($(this).find('ul').length < 1) {
                                _this.firstTreeFlag = false;
                                if ($(this).attr('data-isdata') == 1 || $(this).attr('data-isdata') == 2) {
                                    if ($(this).attr('data-load_once') == 'true') {
                                        //绘制chart
                                        var obj = {
                                            id: $(this).attr('id'),
                                            name: $(this).parents('#MAIN').find('#tit').html(),
                                            name: $(this).parents('#MAIN').find('#tit').html(),
                                            fd_code: $(this).attr('datafd_code'),
                                            fd_name: $(this).attr('data-fd_name'),
                                            fd_tablename: $(this).attr('data-fd_tablename'),
                                            fd_isdata: $(this).attr('data-isdata')
                                        };
                                        _this.investType = 'single';  //单条查询
                                        _this.showChart(obj);
                                    }
                                    $(this).attr('data-load_once', 'false');
                                } else if ($(this).attr('data-isdata') == 0 || $(this).attr('data-isdata') == -1) {
                                    _this.showTree($(this).attr('id'), $(this).attr('data-isdata')); //发送tree请求
                                    if ($(this).find('>span').hasClass('roots_close')) {
                                        $(this).find('>span').removeClass('roots_close').addClass('roots_open');
                                    } else if ($(this).find('>span').hasClass('bottom_close')) {
                                        $(this).find('>span').removeClass('bottom_close').addClass('center_open');
                                    }
                                }
                            } else {
                                if ($(this).find('>span').hasClass('center_open')) {
                                    $(this).find('>span').removeClass('center_open').addClass('roots_close');
                                } else if ($(this).find('>span').hasClass('roots_open')) {
                                    $(this).find('>span').removeClass('roots_open').addClass('roots_close');
                                } else if ($(this).find('>span').hasClass('roots_close')) {
                                    $(this).find('>span').removeClass('roots_close').addClass('roots_open');
                                } else {
                                    $(this).find('>span').removeClass('roots_close').addClass('center_open');
                                }
                                $(this).find('ul').stop().slideToggle();
                            }
                        });
                    }
                }
            });
        },

        //绘制chart
        showChart: function (node) {
            var _this = this;

            // 动画效果去除
            this.myChart.hideLoading();
            var legendData = this.option.legend.data;  //测点名称
            var color = "";
            var symbol = "";  //legend图例小标志

            //console.log(legendData);

            //限制曲线的数量
            // if (legendData.length > 14) {
            //     easyDialog.open({
            //         container: {
            //             header: LANG["all_station_prompt"],
            //             content: LANG["all_station_numlimit"],
            //             noFn: true,
            //             noText: LANG["pro_management_determine"]
            //         },
            //         fixed: false
            //     });
            //     return;
            // }


            if (legendData.length > 14) {
                parent.layer.open({
                    title: LANG["login_prompt"],
                    content: LANG["all_station_numlimit"]
                });
                return;
            }

            color = this.initc[this.chartnum];
            symbol = this.symbolList[this.chartnum];
            node.color = color;

            this.chartnum = this.chartnum + 1;


            if (legendData.length == 0) {
                this.myChart.clear();
            }
            this.bColor.push(color);
            layer.load(0, 2);
            if ($('#' + node.id).parents('.level0').length > 1) {
                var fd_parent_id = $('#' + node.id).parents('.level0').eq(1).attr('id');
            } else {
                var fd_parent_id = $('#' + node.id).parents('.level0').attr('id');
            }

            var startd1 = $("#quick_date1").html(),
                endd1 = $("#quick_date2").html(),
                startStr = startd1.replace(/[-:\s]*/ig, '') + '00',
                endStr = endd1.replace(/[-:\s]*/ig, '') + '00';

            var Parameters = {
                "parameters": {
                    "fd_dev_id": node.id,
                    "fd_parent_id": fd_parent_id,
                    "fd_code": node.fd_code,
                    "fd_tablename": node.fd_tablename,
                    "fd_isdata": node.fd_isdata,
                    "timetype": this.timetype,
                    "sorttype": "1",
                    "sort": "2",
                    "starttime": startStr, //开始时间
                    "endtime": endStr,   //结束时间
                    "topn": "1000",
                    "stationid": this.stationId
                },
                "foreEndType": 2,
                "code": "30000007"
            };

            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                //关闭滚动
                layer.closeAll();
                if (res.success) {
                    var result = res.data.data;
                    window.parent.curveData.push(result)
                    if (result.length <= 0) {
                        parent.layer.open({
                            title: LANG["all_station_prompt"],
                            content: '没有数据'
                        });

                        //将左侧树可点打开
                        $('.treeDemoId >li.on').find('li[datafd_code=' + node.fd_code + ']').attr('data-load_once', 'true');

                        return;
                    }
                    if (!res.data.fdunit) {
                        res.data.fdunit = '--';
                    }

                    node.unit = res.data.fdunit;

                    var ydata = [],  //曲线Y数据(week)
                        nameArr = [],   //曲线名字
                        splitArr = [],  //切分的小数组
                        startIndex = 0;
                    for (var i = 0; i < result.length; i++) {
                        nameArr.push(result[i].fd_name);
                        ydata.push(result[i].fd_value.replace(/,*/g, '').toFixed(2));
                        if (i + 1 < result.length) {
                            var start = result[i].fd_datetime.substring(0, 10);
                            var startUp = result[i + 1].fd_datetime.substring(0, 10);
                            if (start !== startUp) {  //切分小数组
                                splitArr.push(result.slice(startIndex, i + 1));
                                startIndex = i + 1;
                            }
                        }
                    }

                    var data = [];

                    if (_this.section_dateType == 'dayType') {
                        //补充数据
                        $.each(ydata, function (i) {
                            var d = ydata[i];
                            if (i == 0) {//第一个“--”必须转换，否则echarts绘不出来线
                                d = ydata[i] == "--" ? "" : ydata[i];
                            }
                            data.push(d);
                        });

                        var startHour = result[0].fd_datetime.substring(11).split(':')[0],
                            startMin = result[0].fd_datetime.substring(11).split(':')[1],
                            totNum = 0;
                        totNum = startHour * 12 + startMin / 5;
                        for (var i = 0; i < totNum; i++) {
                            data.unshift('--');
                        }

                    } else if (_this.section_dateType == 'weekType') {
                        //补充数据
                        //补充'--'
                        for (var i = 0; i < splitArr.length; i++) {
                            var totNum = splitArr[i][0].fd_datetime.substring(11).split(':')[0] * 4 + 1;
                            for (var j = 0; j < totNum; j++) {
                                splitArr[i].splice(0, 0, '--');
                            }
                        }

                        //链接拼接后的小数组
                        var chartArr = [],
                            totchartArr = [];  //最终整理后的Y数组
                        for (var i = 0; i < splitArr.length; i++) {
                            chartArr = chartArr.concat(splitArr[i]);
                        }

                        //大数组数据整合
                        for (var i = 0; i < chartArr.length; i++) {
                            if (chartArr[i] === '--') {
                                totchartArr.push(chartArr[i]);
                            } else {
                                totchartArr.push(chartArr[i].fd_value.toFixed(2))
                            }
                        }

                        data = totchartArr;
                    }

                    //addTr
                    node.fd_station_name = res.data.fd_station_name; //电站名称
                    node.fd_name = res.data.fd_name; //对象名称
                    node.fd_code_name = res.data.fd_code_name; //测点名称
                    
                    _this.addTr(node);
                    var seriesObj1 = {},
                        yAxisIndex = _this.getYAxis(node.unit);  //y轴需要单位;
                    seriesObj1.data = data;
                    seriesObj1.symbol = symbol;
                    seriesObj1.type = 'line';
                    seriesObj1.name = node.fd_code_name; //测点名称
                    seriesObj1.unit = "(" + node.unit + ")";
                    seriesObj1.itemStyle = {
                        normal: {
                            color: color, //折点颜色
                            lineStyle: {
                                color: color //曲线颜色
                            }
                        }
                    };
                    seriesObj1.yAxisIndex = yAxisIndex;
                    _this.option.xAxis.data = _this.getXAxisData();  //x轴时间
                    legendData.push(node.fd_name)
                    _this.option.series.push(seriesObj1);
                    // 显示 tooltip
                    _this.option.tooltip.show = true;
                    _this.myChart.setOption(_this.option);
                } else {
                    layer.closeAll();  //关闭请求动画
                    parent.layer.open({
                        title: LANG["all_station_prompt"],
                        content: res.message
                    });

                }
            });
        },

        //分割数组
        sliceArr: function (array, size) {
            var result = [];
            for (var x = 0; x < Math.ceil(array.length / size); x++) {
                var start = x * size;
                var end = start + size;
                result.push(array.slice(start, end));
            }
            return result;
        },

        //添加table
        addTr: function (node) {
            console.log(node)
            var _this = this;
            var sta_table = [
                {
                    fd_station_name: node.fd_station_name, //电站名称
                    fd_name: node.fd_name, //电站名称
                    fd_code_name: node.fd_code_name, //电站名称
                    color: node.color, //曲线颜色
                    vcolor: node.fd_code, //点名 GS_C1_YC57
                    dynamicType: 'line', //线型
                    fd_code_name: node.fd_code_name,  //测点名称

                }
            ];
            var tableStr = $('#station_table_tpl').html();
            var tpl_str = ejs.render(tableStr, {sta_table: sta_table});
            if (this.investType == 'all') {
                return;
            }

            $("#tbody").append(tpl_str);

            //table表头固定js调用
            $(".sjqx_tab").tabheader({
                table_header: 'nbq_tab_top',
                table_parent: 'sjqx_tab',
                table_height: 'sjqx_bottom_tab',
                table_parent_height: 'sjqx_tab',
            });

            //绑定删除事件
            $('#' + sta_table[0].vcolor).click(function () {
                var myAttr = $(this).attr('id');
                $('.treeDemoId >li.on').find('li[datafd_code=' + myAttr + ']').attr('data-load_once', 'true');
                _this.delChart($(this));
            });


            if (this.nodeunit == null || this.nodeunit == "") {
                if (node.unit == "" || node.unit == null) {
                    this.nodeunit = node.unit + ",";
                } else {
                    this.nodeunit = node.unit;
                }
            }
            else {
                if (this.nodeunit != ",") {
                    this.nodeunit = this.nodeunit + "," + node.unit;
                } else {
                    this.nodeunit = this.nodeunit + node.unit;
                }
            }

            $('.cy_ul li').click(function (e) {
                e.stopPropagation();
                $(this).parents('.data_type_span').find('.map_select_2_sea').html($(this).html());
                $(this).parent().slideUp(200);
            });

            $(".sjqx_bottom_tab").height($(".tendency_table").height() - 42);
            var id = 'node' + sta_table[0].vcolor;
            this.initColor(id);
            this.nodeArray.push(node);
            this.sName.push(name);
            this.lName.push(psName);
        },

        initColor: function (id) {
            var thisId = id;
            var _this = this;
            $("#" + id).minicolors({
                control: $(this).attr('data-control') || 'hue',
                defaultValue: $(this).attr('data-defaultValue') || '',
                inline: $(this).attr('data-inline') === 'true',
                letterCase: $(this).attr('data-letterCase') || 'lowercase',
                opacity: $(this).attr('data-opacity'),
                position: $(this).attr('data-position') || 'bottom left',
                hide: function (opacity) {
                    _this.changeColor(thisId, $("#" + thisId).val());
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
        },

        changeColor: function (id, color) {
            var index = $(".demo").index($("#" + id));
            this.option.color[index] = color;
            this.option.legend.selected = this.legendSelected;
            this.option.dataZoom = this.dataZoom;
            this.myChart.setOption(this.option);
        },

        //切换5min 10min 15min
        changeDateSpace: function (e) {
            var obj = $(e.target);
            $(e.target).parents('.dateSel').slideUp(200);
            $('#dateDef').html(obj.text());

            if(obj.text() == '5min'){
                this.timetype="0";
                $('#cycle').val(5);
            }else if(obj.text() == '15min'){
                this.timetype="8";
                $('#cycle').val(15);
            }

            this.changedateSel();
        },

        //改变日期时重绘chart
        changedateSel: function () {
            var _this = this;
            window.parent.curveData = [] //每个查询操作开始前都清空
            setTimeout(function () {
                _this.initchart();
                _this.chartnum = 0;  //重置线条数
                for (var i = 0; i < _this.nodeArray.length; i++) {
                    _this.showChart(_this.nodeArray[i]);
                }
            }, 500);

        },

        //批量删除
        psPoint_delAllChart: function () {
            $('#tbody').html('');
            $('.treeDemoId >li.on').find('.onlyOne').attr('data-load_once', 'true');
            window.parent.curveData = []
            this.nodeArray = [];  //重置节点数组
            this.chartnum = 0;  //重置曲线条数
            this.initchart();  //重置chart
            this.nodeunit = '';  //重置单位数组
        },

        //单条删除
        delChart: function (obj) {
            var index = $(".delA").index(obj) - 1;
            // console.log(index)
            window.parent.curveData.splice(index, 1);
            var temp = "";
            //删除记录的单位信息
            var unitarray = this.nodeunit.toString().split(",");
            unitarray.splice(index, 1);
            for (var i = 0; i < unitarray.length; i++) {
                if (i == 0) {
                    temp = unitarray[0];
                } else {
                    temp = temp + "," + unitarray[i];
                }
            }
            this.nodeunit = temp;
            this.option.series.splice(index, 1);

            this.lName.splice(index, 1);
            this.bColor.splice(index, 1);

            var moveLenged = this.option.legend.data[index];

            this.option.legend.data.splice(index, 1);
            delete this.legendSelected[moveLenged];
            this.option.legend.data.selected = this.legendSelected;
            this.option.legend.selected = this.legendSelected;

            var newDataZoom = {
                show: true,
                realtime: true,
                height: 20,
                start: this.dataZoom.start,
                end: this.dataZoom.end
            };
            this.option.dataZoom = newDataZoom;
            this.nodeArray.splice(index, 1);
            this.checkYAxis();
            this.myChart.clear();
            var legendData = this.option.legend.data;
            if (legendData.length == 0) {
                this.initchart();
            } else {
                this.myChart.setOption(this.option);
            }
            $($("#tbody").find("tr")[index]).remove();
        },

        checkYAxis: function () {
            this.option.yAxis = [];
            var unitArray = [];
            var idAdd;
            for (var i = 0; i < this.nodeArray.length; i++) {
                if (unitArray.length == 2) {
                    this.getYAxis(this.nodeArray[i].unit);
                    break;
                }
                idAdd = true;
                for (var j = 0; j < unitArray.length; j++) {
                    if (this.nodeArray[i].unit == unitArray[j]) {
                        idAdd = false;
                    }
                }
                if (idAdd) {
                    unitArray.push(this.nodeArray[i].unit);
                    this.getYAxis(this.nodeArray[i].unit);
                }
            }
            for (var i = 0; i < this.nodeArray.length; i++) {
                for (var j = 0; j < unitArray.length; j++) {
                    if (this.nodeArray[i].unit == unitArray[j]) {
                        this.option.series[i].yAxisIndex = j;
                    }
                }
            }
        },

        getStart_point: function () {
            var refresh_time = $("#dateDef").text();
            this.changedateSel(refresh_time);
        },

        //定时刷新
        refreshTime_point: function () {
            var text = $("#point_time").html(), _this = this;
            if (document.getElementById("setTime_point").checked) {
                // initTime();
                clearInterval(this.clearSetInterval);
                this.clearSetInterval = setInterval(_this.getStart_point, text * 60 * 1000);
            } else {
                clearInterval(this.clearSetInterval);
            }
        },

        loadPage: function () {
            this.initSize();  //初始化尺寸

            //刷新时间未点击时灰色
            $(".abcd").css({"opacity": "0.7"});
            $(".abcd em").css({"opacity": "0.7"});

            //刷新时间设置
            this.refreshClick();

            //时间选择
            this.changeDate();
            //初始化chart
            this.initchart();
            //展示tree
            this.showTree(this.stationId, '0');   //tree  根节点id  '0'首次默认不是数据
            /*this.showTree('gs', '0');*/   //tree  根节点id  '0'首次默认不是数据
        },

        //获取电站列表
        /*getAllStation: function () {
            var _this = this;
            var Parameters = {
                "parameters": {"stationid": "", "statusstr": ""},
                "foreEndType": 2,
                "code": "20000006"
            };
            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                if (res.success) {
                    var stationRes = res.data,
                        resArr = [];

                    $.each(stationRes, function (key, value) {
                        if (value.fd_station_status == 2) {
                            resArr.push(value);
                        }
                    });

                    //获取用户权限电站
                    $.ajax({
                        type: "get",
                        url: vlm.serverAddr + "sys/user/info/" + $.cookie('userId'),
                        data: "",
                        dataType: "json",
                        success: function (res) {
                            if (res.code == 0) {

                                if (res.user.psList === null || res.user.psList.length < 1) {

                                } else if (res.user.psList.length >= 1) {
                                    if (res.user.psList[0] == "all") {
                                        _this.newStationList = resArr;
                                    } else {
                                        var info_station_arr = res.user.psList;
                                        for (var i = 0; i < resArr.length; i++) {
                                            for (var j = 0; j < info_station_arr.length; j++) {
                                                if (resArr[i].fd_station_code.toLowerCase() == info_station_arr[j]) {
                                                    _this.newStationList.push(resArr[i]);
                                                }
                                            }
                                        }
                                    }
                                }

                                var stationList_tpl = $('#station_filter_tpl').html();
                                var stationStr = ejs.render(stationList_tpl, {newStationList: _this.newStationList});
                                $('#station_per_ul').html(stationStr);

                                _this.stationId = _this.newStationList[0].fd_station_code.toLowerCase();
                                _this.loadPage();  //初始化页面

                            }
                        }

                    });
                }

            });
        },*/
        getAllStation: function () {
            var _this = this
            $.ajax({
            url: vlm.serverAddr + "stationbaseinfo/getPsList",    //请求地址
            dataType: "json",
            type : "GET",
            success:function(res){
                    _this.newStationList = res.list
                    _this.stationId = _this.newStationList[0].fdStationCode
                    _this.firstStationName = _this.newStationList[0].fdStationName
                    var stationList_tpl = $('#station_filter_tpl').html();
                    var stationStr = ejs.render(stationList_tpl, {newStationList: _this.newStationList});
                    $('#station_per_ul').html(stationStr);
                     _this.loadPage();  //初始化页面
                }
            });
        },
        showMsg: function () {
            $('.tog_table_txt1').css({"display": 'block'})
        },
        hideMsg: function () {
            $('.tog_table_txt1').css({"display": 'none'})
        },
        showDataTable: function () {
            // console.log(window.parent.curveData)
            if (window.parent.curveData.length) {
                parent.layer.open({
                    type: 2,
                    title: '数据曲线列表',
                    shadeClose: true,
                    shade: 0.5,
                    maxmin: true, //开启最大化最小化按钮
                    area: ['1380px', '800px'],
                    content: ['popUp/pop_curve_table.html'],
                    resize: true,
                    success:function (layero, index) {
                        $("#devid", layero.find("iframe")[0].contentWindow.document).val('devid');
                    }
                });
            } else {
                /*parent.layer.open({
                    type: 1,
                    title: '提示',
                    content: '暂无数据',
                    area:['260px','160px'],
                    btn:['确定'],
                    yes: function (index) {
                        parent.layer.close(index)
                    }
                });*/
                parent.layer.msg('暂无数据')
            }
            
        }
    }
    ,
    created:function () {
        window.parent.curveData = []
    },
    mounted: function () {
        this.getAllStation(); //获取电站列表
    }
})
;

function selectValue(obj) {
    if ($(obj).find("ul").is(":hidden")) {
        $(obj).find("ul").slideDown(200);
    } else {
        $(obj).find("ul").slideUp(200);
    }
};


//周选择回调
function weekCallback(dp) {
    $dp.$('week').value = $dp.cal.getP('y') + '年-第' + $dp.cal.getP('W', 'WW') + '周';
    $('#currenttime').val(dp.cal.getNewDateStr());

}




