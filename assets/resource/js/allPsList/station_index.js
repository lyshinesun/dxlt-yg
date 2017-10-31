var index = {
    isFristLoad: true,
    todayPower: '',//今日发电
    powerArrayLen: '',//发电趋势数组长度
    powerType: '',//发电趋势类型  //日 月 年
    fault_totalNum: '',//故障总数
    fault_waitNum: '',//故障处理数量
    work_totalNum: '',//工单总数
    work_waitNum: '',//工单处理数量
    powerunit: '',
    powerunit2: '',
    powerunit3: '', //辐照
    powername: '',
    trendLegend: [],
    trendDatas: [],
    ptChart: null,
    workChart: null,
    warnChart: null,
    outputChart: null,
    myChart: null,
    powerNumChart: null,
    planChart: null,
    prGuage: null,
    genPlanDateType: '1',//1:当年 2:当月   发电计划
    curPsID: '', //
    curPsName: '', //
    inverterDtTp: "2",//1:日; 2:月; 3: 年
    powerDtTp: "1",//1:日; 2:月; 3: 年
    faultOrderCount: 0,
    faultAlertCount: 0,
    daysArr: [LANG["common_date_day7"], LANG["common_date_day1"], LANG["common_date_day2"], LANG["common_date_day3"], LANG["common_date_day4"], LANG["common_date_day5"], LANG["common_date_day6"]],
    resize: function () {
        if (index.workChart && index.workChart != null) {
            index.workChart.resize();
        }
        if (index.warnChart && index.warnChart != null) {
            index.warnChart.resize();
        }
        if (index.ptChart && index.ptChart != null) {
            index.ptChart.resize();
        }
        if (index.outputChart && index.outputChart != null) {
            index.outputChart.resize();
        }
        if (index.myChart && index.myChart != null) {
            index.myChart.resize();
        }
    }
};

new Vue({
    el: '#singleDet',
    data: {

        stationId: 'gs',
        firstStationName:'',

        faultChart: null,
        refreshInterval: null,


        fd_all_power_day: '--',    //今日发电
        fd_all_pw: '--',           //当前功率
        fd_all_power: '--',        //累计总发电
        fd_all_intercon_cap: '--',    //装机功率

        fd_all_power_day_unit: '',
        fd_all_pw_unit: '',
        fd_all_power_unit: '',

        //节能减排
        fd_all_co2_reduce: '--',    //co2
        fd_tree_reduce: '--',  //树
        fd_coal_reduce: '--',  //煤
        fd_all_coal_reduce: '--',  //煤
        fd_coal_reduce_unit: '吨',    //煤单位
        fd_all_co2_reduce_unit: '万吨',    //co2单位

        psunit: {
            deviceType: '1',//psScheme==2(组串式),deviceType=17(单元); 其他,deviceType=1(逆变器);
            dateType: '1', //等效小时、PR  1:月  2:年
        },

        fdboardtemperature: '--',  //环境温度
        fdtemperature: '--', //电池板温度

        newStationList: [] //电站列表

    },
    methods: {
        searchStation: function () {
            var _this = this;

            var selTip = $('.selected_span').attr('data-selCode');
            $('.station_per_ul li').removeClass('selected');
            $('.station_per_ul li').each(function () {

                if ($(this).attr('data-stationId') == selTip) {
                    $(this).addClass('selected');
                }
            });
            $('.choose_wrap').slideDown();
            $('.station_per_ul >li').off().click(function (e) {
                e.stopPropagation();
                $('.selected_span').attr('data-selCode', $(this).attr('data-stationId'));
                $('.selected_span').html($(this).html());
                $(this).parents('.choose_wrap').slideUp();
                _this.stationId = $('.selected_span').attr('data-selCode');
                _this.loadAllMsg();
            });
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
                    })

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
                }
            });
        },

        loadAllMsg: function () {
            this.loadPowerTrendData($("#selqushi").val()); //动态加载发电趋势当日1，当月2，当年3
            this.writeData(); //逆变器发电分析、当年发电计划
            this.getPsDetailInfo1(); //电池板温度、PR
            this.loadWeather(); //天气预报
            this.loadWarn();       //告警
        },

        getInputDate: function () {
            var date = $("#dateInput").val();
            date = date.replace(/\//g, "");
            return date;
        },

        //加载发电趋势数据
        loadPowerTrendData: function (type) {
            var _this = this;
            if (index.ptChart == null || type != index.powerType) {
                //初始化加载，将图形的框架加载出来
                this.installChart('', 0);
            }
            ;

            var dates = new Date();
            var endDate = dates.getFullYear() + '-' + (dates.getMonth() + 1) + '-' + dates.getDate() + 'T' + dates.getHours() + ':' + dates.getMinutes() + ':' + dates.getSeconds();
            var endDateStr = vlm.Utils.format_date(endDate, 'YmdHis');

            var dateStr = '', startDateStr = '';

            switch (type) {
                case '1': //日
                    dateStr = '0';
                    var dateNum = this.getInputDate($('#dateInput').val());
                    startDateStr = this.getInputDate(dateNum) + '000000';
                    var year = dateNum.substring(0, 4);
                    var month = dateNum.substring(4, 6);
                    var day = dateNum.substring(6);
                    if (month < 10) {
                        month = month.substring(1);
                    }
                    var date = new Date();
                    date.setFullYear(year, month - 1, day);
                    day = date.getDate();
                    var Month = date.getMonth() + 1;
                    endDateStr = date.getFullYear() + '' + vlm.Utils.format_add_zero(Month) + '' + vlm.Utils.format_add_zero(day) + '235959';
                    break;
                case '2': //月
                    dateStr = '2';
                    startDateStr = vlm.Utils.currentMonth();
                    break;
                case '3':  //年
                    dateStr = '3';
                    startDateStr = vlm.Utils.currentYear();
                    break;
                default :
                    ;
            }

            var Parameters = {
                "parameters": {
                    "stationtype": "",
                    "timetype": dateStr,
                    "sorttype": "1",
                    "sort": "2",
                    "starttime": startDateStr,
                    "endtime": endDateStr,
                    "topn": "300",
                    "stationid": $('.selected_span').attr('data-selCode')
                },
                "foreEndType": 2,
                "code": "20000005"
            };
            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                // console.log(res);
                index.powerunit = '(' + res.data.fd_unit + ')';  //发电量单位
                index.powerunit2 = '(kW)'; //功率单位
                index.powerunit3 = 'W/㎡'; //功率单位
                _this.installChart(res, 1, type);
                //隐藏loading
                if (index.ptChart != undefined) {
                    index.ptChart.hideLoading();
                }
            });

        },

        //当年发电计划发送请求
        loadPlanChart: function () {
            var dateType = index.genPlanDateType;
            var _this = this,
                dateStr = '',
                startDateStr = '',
                dates = new Date(),
                endDate = dates.getFullYear() + '-' + (dates.getMonth() + 1) + '-' + dates.getDate() + 'T' + dates.getHours() + ':' + dates.getMinutes() + ':' + dates.getSeconds(),
                endDateStr = vlm.Utils.format_date(endDate, 'YmdHis');
            switch (dateType) {
                case '2':  //按月
                    dateStr = 'day';
                    startDateStr = vlm.Utils.currentMonth();
                    break;
                case '1':  //年
                    dateStr = 'year';
                    startDateStr = vlm.Utils.currentYear();
                    endDateStr = vlm.Utils.nextYear();
                    break;
                default :
                    ;
            }

            var Parameters = {
                "parameters": {
                    "datatype": dateStr,
                    "sorttype": "1",
                    "sort": '1',
                    "starttime": startDateStr,
                    "endtime": endDateStr,
                    "topn": "1000",
                    "stationid": this.stationId
                },
                "foreEndType": 2,
                "code": "20000004"
            };
            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                if (res.success) {
                    $(".showm_bottom .loadingDiv").hide();
                    var result = res.data;
                    if (result.datas.length) {
                        $("#index_left_bottom_list_bottom2").show();
                        var actualData = planArray = result.datas,
                            planData = [],
                            newActualData = [],   //实际
                            xData = [],  //x轴数据
                            completionRt = [],  //完成率
                            scheduledata_avg = [], //当月计划完成率
                            unit = result.fd_unit;
                        if (index.genPlanDateType == 2) { //月，每一天
                            for (var i = 0; i < planArray.length; i++) {
                                xData.push(planArray[i].fd_log_date_max.substring(0,10));
                                planData.push(planArray[i].fd_sched_power_mon.toFixed(2)); //每个月发电计划
                                newActualData.push(planArray[i].datapower.toFixed(2));    //当月实际发电
                                completionRt.push(planArray[i].fd_scheduledata.toFixed(2));
                            }
                        } else if (index.genPlanDateType == 1) {

                            var max_month = Number(new Date().getMonth());

                            for (var i = 1; i <= 12; i++) {
                                planData.push(planArray[i-1].fd_sched_power_mon.toFixed(2)); //每个月发电计划
                                xData.push(planArray[i-1].fd_year+'/'+planArray[i-1].fd_month);
                                if (i-1 <= max_month) {
                                    newActualData.push(planArray[i-1].datapower.toFixed(2));    //当月实际发电
                                    completionRt.push(planArray[i-1].fd_scheduledata.toFixed(2));    //累计计划完成率
                                    scheduledata_avg.push(planArray[i-1].fd_scheduledata_avg.toFixed(2));    //当月计划完成率
                                } else {
                                    newActualData.push('--');    //每个月实际发电
                                    completionRt.push('--');    //累计计划完成率
                                    scheduledata_avg.push('--');    //当月计划完成率
                                }
                            }
                        }

                        _this.drawPowerPlanChart(dealEchartBarArr(newActualData), dealEchartBarArr(planData), unit, xData, dealEchartLineArr(completionRt), scheduledata_avg);

                    } else {

                        $("#index_left_bottom_list_bottom2").hide();
                    }
                } else {
                    alert(res.message);
                }
            });
        },

        //绘制发电计划chart
        drawPowerPlanChart: function (actualData, planData, unit, xData, completionRt, scheduledata_avg) {
            var lengendName1 = LANG["1_1_planned_genarate"];
            var lengendName2 = LANG["1_1_actual_genarate"];
            if (index.genPlanDateType == 2) {
                lengendName1 = LANG["1_1_total_planned_genarate"];
                lengendName2 = LANG["1_1_total_actual_genarate"];
            }
            var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: function (data) {
                        var str = "<p align='left'>" + LANG["sta_overview_time"] + "：" + data[0].name + "</p>";
                        for (var i = 0; i < data.length; i++) {
                            if (lengendName1 == data[i].seriesName || lengendName2 == data[i].seriesName) {
                                str += "<p align='left'>" + data[i].seriesName + "：" + dealEchartToolTip(data[i].value) + unit;
                            } else {
                                str += "<p align='left'>" + data[i].seriesName + "：" + dealEchartToolTip(data[i].value) + "%";
                            }
                        }
                        return str;
                    }
                },
                legend: {
                    orient: 'horizontal',      // 布局方式，默认为水平布局，可选为：
                    // 'horizontal' ¦ 'vertical'
                    x: 'right',               // 水平安放位置，默认为全图居中，可选为：
                    // 'center' ¦ 'left' ¦ 'right'
                    // ¦ {number}（x坐标，单位px）
                    y: '10',                  // 垂直安放位置，默认为全图顶端，可选为：
                    // 'top' ¦ 'bottom' ¦ 'center'
                    // ¦ {number}（y坐标，单位px）
                    textStyle: {
                        color: '#000000',
                        fontFamily: 'Microsoft YaHei'
                    },
                    data: [lengendName1, lengendName2, LANG["1_1_planned_completion_rate"]]
                },
                // 网格
                grid: {
                    y: '65',
                    x2: 50,
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderWidth: 0,
                    borderColor: '#ccc'
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        axisLine: {
                            show: true,
                            lineStyle: { // 属性lineStyle控制线条样式
                                color: '#9CCCEA'
                            }
                        },
                        axisLabel: {
                            show: true,
                            rotate: 0,//逆时针显示标签，不让文字叠加
                            textStyle: {
                                color: '#000000'
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        boundaryGap: [0, 0.01],
                        data: xData
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: unit,
                        axisLine: {
                            show: true,
                            lineStyle: { // 属性lineStyle控制线条样式
                                color: '#9CCCEA'
                            }
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#000000'
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        nameTextStyle: {
                            color: '#000000',
                            fontFamily: 'Microsoft YaHei'
                        },
                        min: 0,
                        axisTick: axisTickObj
                    },
                    {
                        type: 'value',
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#000000'
                            },
                            formatter: '{value} %'
                        },
                        axisLine: {
                            show: true,
                            lineStyle: { // 属性lineStyle控制线条样式
                                color: '#9CCCEA'
                            }
                        },
                        nameTextStyle: {
                            fontFamily: 'Microsoft YaHei'
                        },
                        min: 0,
                        splitNumber: 6,
                        axisTick: axisTickObj
                    }
                ],
                series: [
                    {
                        name: lengendName1,
                        type: 'bar',
                        yAxisIndex: 0,
                        barMaxWidth: 20,
                        itemStyle: {
                            normal: {
                                color: '#24c1a1',
                            }
                        },
                        data: planData
                    },
                    {
                        name: lengendName2,
                        type: 'bar',
                        yAxisIndex: 0,
                        barMaxWidth: 20,
                        itemStyle: {
                            normal: {
                                color: '#00f4fe',
                            }
                        },
                        data: actualData
                    },
                    {
                        name: LANG["1_1_planned_completion_rate"],
                        type: 'line',
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                color: '#fdd600'
                            }
                        },
                        data: completionRt
                    }

                ]
            };

            if (index.genPlanDateType == 1) {
                option.legend.data.push(LANG["1_2_month_completion_rate"]);
                option.series.push({
                    name: LANG["1_2_month_completion_rate"],
                    type: 'line',
                    yAxisIndex: 1,
                    itemStyle: {
                        normal: {
                            color: '#2c5075'
                        }
                    },
                    data: scheduledata_avg
                });
            }
            index.planChart = echarts.init(document.getElementById('echarts4'));
            index.planChart.setOption(option);
            $(window).resize(function () {
                index.planChart.resize();
            });
        },

        //逆变器发电分析
        loadOutputData: function () {
            $(".index_left_bottom_list_bottom .loadingDiv").show();
            var _this = this,
                dateType = this.psunit.dateType,
                dates = new Date(),
                endDate = dates.getFullYear() + '-' + (dates.getMonth() + 1) + '-' + dates.getDate() + 'T' + dates.getHours() + ':' + dates.getMinutes() + ':' + dates.getSeconds(),
                startDateStr = '',
                endDateStr = vlm.Utils.format_date(endDate, 'YmdHis');
            switch (dateType) {
                case '1':
                    startDateStr = vlm.Utils.currentMonth();
                    break;
                case '2':
                    startDateStr = vlm.Utils.currentYear();
                    endDateStr = vlm.Utils.nextYear();
                    break;
                default :
                    ;
            }
            var Parameters = {
                "parameters": {
                    "ctype": "1",
                    "sorttype": "1",
                    "sort": "1",
                    "starttime": startDateStr,
                    "endtime": endDateStr,
                    "topn": "1000",
                    "stationid": $('.selected_span').attr('data-selCode'),
                    "devid": "",
                    "ischild": "1"
                },
                "foreEndType": 2,
                "code": "30000002"
            };
            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                //console.log(res);
                $(".index_left_bottom_list_bottom .loadingDiv").hide();
                if (res.success) {
                    var data = res.data;
                    var len = data.length;
                    var obj = {
                        level_1: 0,//优秀
                        level_2: 0,//良好
                        level_3: 0,//一般
                        level_4: 0,//稍差
                        level_5: 0//建议整改
                    };
                    for (var i = 0; i < len; i++) {
                        var nbqDXXS = data[i].equivalenthour;//电站逆变器等效小时
                        var pcBL = data[i].pr;
                        _this.powerCssAndCount(pcBL, obj);
                    }

                    $(".index_left_bottom_list_bottom .loadingDiv").hide();
                    _this.inverseGenAnaly(obj);
                }
            });

        },

        // 逆变器发电分析样式
        powerCssAndCount: function (val, obj) {
            if (val >= 80) {
                return obj.level_1 += 1;
            } else if (val >= 75) {
                return obj.level_2 += 1;
            } else if (val >= 70) {
                return obj.level_3 += 1;
            } else if (val >= 65) {
                return obj.level_4 += 1;
            } else {
                return obj.level_5 += 1;
                ;
            }
        },

        //逆变器发电分析
        inverseGenAnaly: function (obj) {
            var _this = this
            var sum = obj.level_1 + obj.level_2 + obj.level_3 + obj.level_4 + obj.level_5;
            var b1 = "--", b2 = "--", b3 = "--", b4 = "--", b5 = "--";
            if (!(isNaN(sum) || sum == 0)) {
                b1 = (obj.level_1 / sum * 100).toFixed(0);
                b2 = (obj.level_2 / sum * 100).toFixed(0);
                b3 = (obj.level_3 / sum * 100).toFixed(0);
                b4 = (obj.level_4 / sum * 100).toFixed(0);
                b5 = (obj.level_5 / sum * 100).toFixed(0);
            }
            var t1 = LANG["psBoxDiscreteAnalysis.excellent"] + "：" + LANG["psBoxDiscreteAnalysis.proportion"] + b1 + "% " + LANG["psBoxDiscreteAnalysis.together"] + obj.level_1 + LANG["psBoxDiscreteAnalysis.platform"];
            var t2 = LANG["psBoxDiscreteAnalysis.runGood"] + "：" + LANG["psBoxDiscreteAnalysis.proportion"] + b2 + "% " + LANG["psBoxDiscreteAnalysis.together"] + obj.level_2 + LANG["psBoxDiscreteAnalysis.platform"];
            var t3 = LANG["psBoxDiscreteAnalysis.runYiban"] + "：" + LANG["psBoxDiscreteAnalysis.proportion"] + b3 + "% " + LANG["psBoxDiscreteAnalysis.together"] + obj.level_3 + LANG["psBoxDiscreteAnalysis.platform"];
            var t4 = LANG["psBoxDiscreteAnalysis.difference"] + "：" + LANG["psBoxDiscreteAnalysis.proportion"] + b4 + "% " + LANG["psBoxDiscreteAnalysis.together"] + obj.level_4 + LANG["psBoxDiscreteAnalysis.platform"];
            var t5 = LANG["psBoxDiscreteAnalysis.advice"] + "：" + LANG["psBoxDiscreteAnalysis.proportion"] + b5 + "% " + LANG["psBoxDiscreteAnalysis.together"] + obj.level_5 + LANG["psBoxDiscreteAnalysis.platform"];

            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                title: {
                    show: false
                },
                legend: {
                    show: true,
                    orient: 'vertical',
                    x: 30,
                    y: 30,
                    //y : document.getElementById('echarts3').offsetHeight / 5,
                    itemGap: document.getElementById('echarts3').offsetHeight / 5 - 28,
                    data: [t1, t2, t3, t4, t5],
                    textStyle: {
                        color: "#000000",
                        fontFamily: 'Microsoft YaHei'
                    }
                },
                color: ['#0CCA25', '#14CACD', '#2F7FFA', '#FDD600', '#FB6832'],
                series: [
                    {
                        hoverAnimation: false,
                        type: 'pie',
                        center: ['70%', '45%'],
                        radius: ['0', '70%'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                }
                            }
                        },
                        data: [{
                            // 数据项的名称
                            name: t1,
                            // 数据项值8
                            value: obj.level_1
                        }, {
                            // 数据项的名称
                            name: t2,
                            // 数据项值8
                            value: obj.level_2
                        }, {
                            // 数据项的名称
                            name: t3,
                            // 数据项值8
                            value: obj.level_3
                        }, {
                            // 数据项的名称
                            name: t4,
                            // 数据项值8
                            value: obj.level_4
                        }, {
                            // 数据项的名称
                            name: t5,
                            // 数据项值8
                            value: obj.level_5
                        }]
                    }
                ]
            };
            if (index.powerNumChart == null) {
                index.powerNumChart = echarts.init(document.getElementById('echarts3'));
            }
            index.powerNumChart.setOption(option);

            index.powerNumChart.on('click', function (a) {
                window.parent.stationId = _this.stationId
                top.location.hash = '#station_inverter';
                $('#index_frame', parent.document).attr('src', 'dialog/station_inverter.html');
            });

            $(window).resize(function () {
                index.powerNumChart.resize();
            });
        },

        //发电量排名页面当日，当月，当年点击事件
        outputDateType: function (e) {
            var type = $(e.target).attr('data-inverter');
            this.psunit.dateType=type;
            this.loadOutputData();
        },

        writeData: function () {

            // 逆变器发电分析
            this.loadOutputData();

            //当年发电计划
            this.loadPlanChart();

        },

        //电站温度、PR
        getPsDetailInfo1: function () {
            var _this = this,
                Parameters = {
                    "parameters": {
                        "stationid": $('.selected_span').attr('data-selCode')
                    },
                    "foreEndType": 2,
                    "code": "20000010"
                };
            vlm.loadJson("", JSON.stringify(Parameters), function (result) {
                if (result.success) {
                    var result = result.data;
                    //左上角数值
                    _this.fd_all_power_day = result.fd_all_power_day;
                    _this.fd_all_pw = result.fd_all_pw;
                    _this.fd_all_power = result.fd_all_power;
                    _this.fd_all_intercon_cap = result.fd_all_intercon_cap; //装机容量

                    //单位
                    _this.fd_all_power_day_unit = result.fd_all_power_day_unit;
                    _this.fd_all_pw_unit = result.fd_all_pw_unit;
                    _this.fd_all_power_unit = result.fd_all_power_unit;

                    //节能减排
                    _this.fd_all_co2_reduce = result.fd_all_co2_reduce;
                    _this.fd_all_co2_reduce_unit = result.fd_all_co2_reduce_unit;
                    _this.fd_all_coal_reduce = result.fd_all_coal_reduce + result.fd_coal_reduce_unit; //累计煤
                    _this.fd_coal_reduce = result.fd_coal_reduce;
                    _this.fd_tree_reduce = result.fd_tree_reduce + result.fd_tree_reduce_unit;

                    _this.fdtemperature = result.fdtemperature.toFixed(1);
                    _this.loadWeather(result.fd_city); //天气调用


                    // _this.showYesterDayPrfu(result.pr);//累计PR
                    _this.showYesterDayPrfu(82.5);//累计PR  写死

                } else {
                    //alert(result.message+1);
                }
            });
        },

        showYesterDayPrfu: function (val) {
            if ($.isNumeric(val)) {
                val = parseInt(val);
            }
            var option = {
                grid: {
                    x: 2,
                    y: 12,
                    x2: 0,
                    y2: 0
                },
                series: [
                    {
                        name: 'PR',
                        type: 'gauge',
                        radius: '70%',
                        itemStyle: {
                            normal: {
                                color: "#888888"
                            },
                            emphasis: {
                                color: "#888888"
                            }
                        },
                        detail: {
                            formatter: function (data) {
                                if ($.isNumeric(data)) {
                                    return data + "%";
                                } else {
                                    return "--"
                                }
                            },
                            textStyle: {
                                color: "#00B8EE",
                                fontFamily: 'Microsoft YaHei',
                                fontSize: 12
                            },
                            offsetCenter: [0, '50%']
                        },
                        data: [{value: val, name: 'PR'}],
                        axisLine: {
                            lineStyle: {
                                color: [
                                    [1, "#3fa7dc"]
                                ],
                                width: 10
                            }
                        },
                        title: {
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                fontSize: 14,
                                fontStyle: 'italic',
                                color: '#666666'
                            },
                            offsetCenter: ['-3', '110%']
                        },
                        axisLabel: {
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                fontSize: 6,
                                fontStyle: 'italic'
                            },
                            distance: -33,
                            show: true
                        },
                        splitLine: {
                            show: true,
                            length: 15,
                            lineStyle: {
                                color: '#3fa7dc',
                                width: 2
                            }
                        },
                        splitNumber: 5,
                        pointer: {
                            width: 3
                        }
                    }
                ]
            };
            index.prGuage = echarts.init(document.getElementById('gaugeChart'));
            index.prGuage.setOption(option);
            $(window).resize(function () {
                index.prGuage.resize();
            });
        },

        //加载电站天气
        loadWeather: function (cityName) {
            var date = new Date();
            $("#month").text(date.getMonth() + 1);
            $("#date").text(date.getDate());
            $("#days").text(index.daysArr[date.getDay()]);

            var _this = this,
                url = 'http://api.map.baidu.com/telematics/v3/weather?location=' + cityName + '&output=json&ak=0h08YBBvVkr746zjlN9k0ftG94oMjEgM';
            $.ajax({
                url: url,
                type: 'GET',
                asyn: false,
                data: '',
                dataType: 'jsonp',
                success: function (res) {
                    if (res.status == 'success') {
                        var weatherArr = res.results[0].weather_data,
                            todayWthObj = weatherArr[0];//今天
                        _this.wertherName = todayWthObj.weather;
                        var tempArr = todayWthObj.temperature.split('~');
                        tempArr[0] = vlm.Utils.trim(tempArr[0]);
                        tempArr[1] = vlm.Utils.trim(tempArr[1]);
                        _this.temprature_high = tempArr[0];
                        _this.temprature_low = tempArr[1].replace('℃', '');
                        _this.windToday = todayWthObj.wind;

                        _this.fdboardtemperature = weatherArr[0].date.match(/\d*℃/ig)[0].replace('℃', '');

                        //未来三天天气
                        var newWeatherArr = [], imgType = '', weather = '', wind = '', monthNum = '', dayNum = '';

                        for (var i = 1; i < weatherArr.length; i++) {
                            var wthObj = weatherArr[i];
                            date.addDays(1);
                            monthNum = date.getMonth() + 1;
                            dayNum = date.getDate();
                            var tempArr = wthObj.temperature.split('~');
                            tempArr[0] = vlm.Utils.trim(tempArr[0]);
                            tempArr[1] = vlm.Utils.trim(tempArr[1]);
                            if (wthObj.weather.indexOf('晴') != -1) {
                                imgType = 'sunny';
                            } else if (wthObj.weather.indexOf('阴') != -1) {
                                imgType = 'overcast';
                            } else {
                                imgType = 'cloudy';
                            }
                            weather = wthObj.weather;
                            wind = wthObj.wind;
                            //$("#todayAdd" + (i + 1) + "WinDir").text(windDirectionTrans(wthObj.direction) + LANG["wind"]);

                            newWeatherArr.push({
                                monthNum: monthNum,
                                dayNum: dayNum,
                                high_future: tempArr[0], //最高温度
                                low_future: tempArr[1].replace('℃', ''), //最低温度
                                imgType: imgType, //晴、阴、多云
                                weather: weather,
                                wind: wind
                            });
                        }

                        var weatherStr = $('#weatherTpl').html();
                        var weatherLi = ejs.render(weatherStr, {newWeatherArr: newWeatherArr});
                        $('#weatherUl').html(weatherLi);
                    }
                },
                error: function (res) {
                    alert(res.message);
                }

            });

        },


        //告警 工单
        loadWarn: function () {
            var _this = this;
            if (index.warnChart == null) {
                this.drawfaultChart('', 0);
            }

            if (index.workChart == null) {
                this.getworkChart('', 0);
            }

            var Parameters = {
                "parameters": {
                    "stationid": $('.selected_span').attr('data-selCode')
                },
                "foreEndType": 2,
                "code": "20000012"
            };
            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                //告警请求
                var result_warn = res.data.tbalarmdata;
                var jsondata = {
                    "totalNum": result_warn[0].fd_count,
                    "waitNum": result_warn[1].fd_count
                }
                var fault_totalNum = jsondata.totalNum;
                var fault_waitNum = jsondata.waitNum;
                index.fault_totalNum = fault_totalNum;
                index.fault_totalNum = fault_waitNum;
                $("#warntotal").html(fault_totalNum);
                $("#waitWarn").html(fault_waitNum);
                _this.drawfaultChart(jsondata, 1);

                $("#warntotal, #waitWarn").off().click(function () {
                    $('.sub_nav a', parent.document).removeClass('on');
                    $('#power_manage', parent.document).addClass('on');
                    top.location.hash = '#power_manage';
                    $('#index_frame', parent.document).attr('src', 'dialog/power_manage.html');
                });

                index.resize();


                //工单请求
                var result_work = res.data.tborderdata;
                var jsondata_work = {
                    "totalNum": result_work[0].fd_count,
                    "waitNum": result_work[1].fd_count
                }
                var totalNum = jsondata_work.totalNum;
                var waitNum = jsondata_work.waitNum;
                index.work_totalNum = totalNum;
                index.work_waitNum = waitNum;
                $("#worktotal").html(totalNum);
                $("#waitWork").html(waitNum);
                _this.getworkChart(jsondata_work, 1);
                //隐藏loading
                //if (index.workChart != undefined && index.workChart != null) {
                //    index.workChart.hideLoading();
                //}

                $("#worktotal, #waitWork").off().click(function () {
                    $('.sub_nav a', parent.document).removeClass('on');
                    $('#new_power_task', parent.document).addClass('on');
                    top.location.hash = '#new_power_task';
                    $('#index_frame', parent.document).attr('src', 'dialog/new_workorder/new_power_task.html');
                });

            });

        },

        //工单的echarts图
        getworkChart: function (jsondata, flag) {

            if (index.workChart == null) {
                index.workChart = echarts.init(document.getElementById('echarts2'));
            }

            index.workChart.showLoading({
                text: 'Loading...',
                //loading
                textStyle: {
                    fontSize: 12
                },
                effect: 'whirling',
                effectOption: {
                    backgroundColor: 'rgba(0,0,0,0)'
                }
            });
            if (flag == 1) {
                index.workChart.hideLoading();
            }
            var workOption = this.getWorkEcharts(jsondata);
            // 为echarts对象加载数据
            //console.log(outputOption);
            index.workChart.setOption(workOption);
            $(window).resize(function () {
                index.workChart.resize();
            });

        },

        //回收本页内存
        collectGC: function () {
            if (index.ptChart && index.ptChart != null) {
                index.ptChart.clear();
                index.ptChart.dispose();
            }
            if (index.workChart && index.workChart != null) {
                index.workChart.clear();
                index.workChart.dispose();
            }
            if (index.warnChart && index.warnChart != null) {
                index.warnChart.clear();
                index.warnChart.dispose();
            }
            if (index.outputChart && index.outputChart != null) {
                index.outputChart.clear();
                index.outputChart.dispose();
            }
            if (index.myChart && index.myChart != null) {
                index.myChart.clear();
                index.myChart.dispose();
            }
        },

        //获取json数据，封装数据并加载
        installChart: function (res, flag, type) {
            //console.log(res);
            var result = res.data;
            var xdata = []; //横坐标显示的label
            var energyArr = []; //电量的值
            var powerArr = []; //功率的值
            index.trendLegend = [];
            index.trendDatas = [];
            if (res == '') {
                xdata.push('');
                powerArr.push('');
                energyArr.push('');
            } else if (result.fd_datas.length) {
                var powerArr = result.fd_datas; //电量
                var len = powerArr.length;
                //if (index.powerArrayLen == len && type == index.powerType) {//未获取新数据，不加载图表
                //    return;
                //}
                index.powerArrayLen = len;
                index.powerType = type;

                var glData = [], actualData = [], radiaData = [], dateDate = []; //功率、发电量、辐照、日期区间
                for (var i = 0; i < len; i++) {
                    if (result.fd_datas[i].fd_pw_curr < 0) {
                        glData.push('0');
                    } else {
                        glData.push(result.fd_datas[i].fd_pw_curr.toFixed(2));
                    }
                    actualData.push(result.fd_datas[i].fd_power_day);
                    radiaData.push((result.fd_datas[i].fd_radia_real).toFixed(2));
                    dateDate.push(result.fd_datas[i].fd_datetime);
                }

                //隐藏loading
                if (index.ptChart != undefined) {
                    index.ptChart.hideLoading();
                }

                var legendName = '', radiaName = '';

                if ($("#selqushi").val() == "3") {
                    legendName = LANG["sta_overview_yaccumgeneration"];
                    index.powername = LANG["sta_overview_yaccumgeneration"];
                } else if ($("#selqushi").val() == "2") {
                    legendName = LANG["sta_overview_maccumgeneration"];
                    index.powername = LANG["sta_overview_maccumgeneration"];
                } else {
                    legendName = LANG["sta_overview_daccumgeneration"];
                    index.powername = LANG["sta_overview_daccumgeneration"];
                }

                index.trendDatas.push({
                    name: legendName,
                    type: 'bar',
                    smooth: false,
                    yAxisIndex: 0,
                    data: actualData,
                    barWidth: 10,
                    barMaxWidth: 30,
                    itemStyle: {
                        normal: {
                            color: '#24c6c6',//柱状图bar,
                            //barBorderRadius: [5, 5, 5, 5],
                            lineStyle: {
                                width: 6
                            }
                        }
                    }
                });
                //图例
                index.trendLegend.push(legendName);

                //组装功率
                if (type == 1) {
                    legendName = LANG["sta_overview_power"];
                    index.trendDatas.push({
                        name: legendName,
                        type: 'line',
                        smooth: false,
                        yAxisIndex: 1,
                        data: glData,
                        itemStyle: {
                            normal: {
                                color: '#2c5075',  //功率曲线颜色
                                lineStyle: {
                                    width: 2
                                }
                            }
                        }
                    });
                    index.trendLegend.push(legendName);

                    //添加辐照曲线
                    radiaName = LANG["powerRadiationRealTimeAnls.Radiation"];
                    index.trendDatas.push({
                        name: radiaName,
                        type: 'line',
                        smooth: false,
                        yAxisIndex: 1,
                        data: radiaData,
                        itemStyle: {
                            normal: {
                                color: '#DDF418', /*功率曲线颜色*/
                                lineStyle: {
                                    width: 2
                                }
                            }
                        }
                    });
                    index.trendLegend.push(radiaName);

                }
                this.powerTrendChart(dateDate, index.trendLegend, index.trendDatas, flag, type);
            }
        },

        //电站总览，绘制发电趋势echart图表
        powerTrendChart: function (xdata, trendLegend, trendDatas, flag, type) {
            var yAxisData = [];
            var option = null;
            if (type == 1) {
                yAxisData.push({
                    name: index.powername + index.powerunit,
                    nameTextStyle: {
                        color: '#333'
                    },
                    position: 'left',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#50f07d',
                            type: 'dashed'
                        }

                    },
                    type: 'value',
                    // 坐标轴类型，纵轴默认为数值轴，类目轴则参考xAxis说明
                    min: 0,
                    boundaryGap: [0.1, 0.1],
                    // 坐标轴两端空白策略，数组内数值代表百分比
                    splitNumber: 5,
                    axisTick: {},
                    axisLabel: {
                        formatter: function (value, index) {//坐标保留小数
                            if (value != 0 && value < 10) {
                                return value.toFixed(1);
                            }
                            return value.toFixed(0);
                        },
                        show: true,
                        margin: 10,
                        padding: 0,
                        rotate: 0,
                        textStyle: {
                            color: '#333',
                            fontFamily: 'verdana',
                            fontSize: 12,
                            fontStyle: 'normal'
                        }
                    },
                    axisLine: {
                        show: false,
                        lineStyle: { // 属性lineStyle控制线条样式
                            color: '#333',
                            width: 1
                        }
                    } // 数值轴用，分割段数，默认为5
                });
                yAxisData.push({
                    type: 'value',
                    min: 0,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#50f07d',
                            type: 'dashed',
                        }
                    },
                    name: LANG["sta_overview_power"] + index.powerunit2,
                    nameTextStyle: {
                        color: '#333'
                    },
                    boundaryGap: [0.1, 0.1],
                    // 坐标轴两端空白策略，数组内数值代表百分比
                    splitNumber: 5,
                    axisLabel: {
                        formatter: function (value, index) {//坐标保留小数
                            if (value != 0 && value < 10) {
                                return value.toFixed(1);
                            }
                            return value.toFixed(0);
                        },
                        show: true,
                        margin: 10,
                        padding: 0,
                        rotate: 0,
                        textStyle: {
                            color: '#333',
                            fontFamily: 'verdana',
                            fontSize: 12,
                            fontStyle: 'normal'
                        }
                    },
                    axisLine: {
                        show: false,
                        lineStyle: { // 属性lineStyle控制线条样式
                            color: '#333',
                            width: 1
                        }
                    }
                });
            } else {
                yAxisData.push({
                    name: index.powername + index.powerunit,
                    nameTextStyle: {
                        color: '#333'
                    },
                    position: 'left',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#50f07d',
                            type: 'dashed',
                        }
                    },
                    axisLabel: {
                        formatter: function (value, index) {//坐标保留小数
                            if (value != 0 && value < 10) {
                                return value.toFixed(1);
                            }
                            return value.toFixed(0);
                        },
                        show: true,
                        margin: 10,
                        padding: 0,
                        rotate: 0,
                        textStyle: {
                            color: '#333',
                            fontFamily: 'verdana',
                            fontSize: 12,
                            fontStyle: 'normal'
                        }
                    },
                    type: 'value',
                    // 坐标轴类型，纵轴默认为数值轴，类目轴则参考xAxis说明
                    min: 0,
                    boundaryGap: [0.1, 0.1],
                    // 坐标轴两端空白策略，数组内数值代表百分比
                    //splitNumber: 5,
                    axisLine: {
                        show: false,
                        lineStyle: { // 属性lineStyle控制线条样式
                            color: '#333',
                            width: 1
                        }
                    } // 数值轴用，分割段数，默认为5
                });
            }
            if (index.ptChart == null || index.powerType != type) {
                index.ptChart = echarts.init(document.getElementById('index_top_echarts'));
            } else {
                index.ptChart.clear();
            }
            index.ptChart.showLoading({
                text: 'Loading...',
                textStyle: {
                    fontSize: 12
                },
                effect: 'whirling',
                effectOption: {
                    backgroundColor: 'rgba(0,0,0,0)'
                }
            });
            if (flag == 1) {
                index.ptChart.hideLoading();
            }
            option = {
                backgroundColor: 'none',//背景色
                /*toolbox: {
                 feature: {
                 dataView: {show: true, readOnly: false},
                 magicType: {show: true, type: ['line', 'bar']},
                 restore: {show: true},
                 saveAsImage: {show: true}
                 }
                 },*/
                legend: { // 图例配置
                    // 图例内边距，单位px，默认上下左右内边距为5
                    itemWidth: 30,
                    itemHeight: 10,
                    itemGap: 5,
                    // Legend各个item之间的间隔，横向布局时为水平间隔，纵向布局时为纵向间隔
                    data: index.trendLegend,
                    x: "right",
                    y: 20,
                    padding: [8, 80, 10, 10],
                    textStyle: {
                        fontSize: 12,
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        color: '#333'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    position: function (p) {
                        return [p[0] + 10, p[1] - 70];
                    },
                    formatter: function (params, ticket, callback) {
                        var oDate = new Date();
                        var year = oDate.getFullYear();
                        var month = oDate.getMonth() + 1;
                        month = vlm.Utils.format_add_zero(month);
                        var res = LANG["sta_overview_time"] + "：";
                        if (params[0].name.length == 2) {//月
                            res += year + "/" + month + "/" + params[0].name;
                        } else {
                            res = LANG["sta_overview_time"] + "：" + params[0].name;
                        }

                        if (params[0].value == "" || params[0].value == "null" || params[0].value == undefined) {
                            res += '<br/>' + params[0].seriesName + ' : --' + index.powerunit;
                        } else {
                            res += '<br/>' + params[0].seriesName + ' : ' + params[0].value + index.powerunit;
                        }
                        if (params.length > 1) {
                            if (params[1].value == "" || params[1].value == "null" || params[1].value == undefined) {
                                res += '<br/>' + params[1].seriesName + ' : --' + index.powerunit2;
                            } else {
                                res += '<br/>' + params[1].seriesName + ' : ' + params[1].value + index.powerunit2;
                            }
                        }

                        //添加辐照tooltip
                        if(index.powerType == 1){
                            if (params[2].value == "" || params[2].value == "null" || params[2].value == undefined) {
                                res += '<br/>' + params[2].seriesName + ' : --' + index.powerunit3;
                            } else {
                                res += '<br/>' + params[2].seriesName + ' : ' + params[2].value + index.powerunit3;
                            }
                        }
                        return res;
                    }
                },
                grid: {
                    x: 85,
                    y: 90,
                    y2: 30,
                    x2: 90,
                    borderWidth: 0
                },
                calculable: false,
                //加上该属性是为了横坐标label中不显示的点，在内容中也可以显示
                xAxis: [ // 直角坐标系中横轴数组
                    {
                        type: 'category',
                        // 坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
                        boundaryGap: false,

                        data: xdata,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#50f07d',
                                type: 'dashed',
                            }
                        },
                        axisLine: {
                            lineStyle: { // 属性lineStyle控制线条样式
                                color: '#333',
                                width: 1,
                                type: 'solid'
                            }
                        },
                        axisLabel: {
                            show: true,
                            margin: 10,
                            padding: 10,
                            rotate: 0,
                            textStyle: {
                                color: '#333',
                                fontFamily: 'verdana',
                                fontSize: 12,
                                fontStyle: 'normal'
                            }
                        }
                    }],
                yAxis: yAxisData, // 直角坐标系中纵轴数组
                //color:['#4baafb','#de4662'],
                series: index.trendDatas
            };


            index.ptChart.setOption(option);
            $(window).resize(function () {
                index.ptChart.resize();
            });
        },

        getDrawBarChartOption: function (outputStation, outputDatas, unit, type, obj) {
            var tit_h = $(obj).height();
            var tit_w = $(obj).width();
            if (type == 1) {//发电量排名
                tit_w = tit_w > 400 ? (tit_w - 85) : tit_w - 28;
            } else {
                tit_w = tit_w > 400 ? (tit_w - 105) : tit_w - 46;
            }


            var gridW = tit_w > 400 ? '70%' : '56%';
            var option = {
                grid: {
                    x: 100,
                    y: 25,
                    width: '60%',
                    borderWidth: 0
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    trigger: 'item',
                    formatter: function (params, ticket, callback) { //数据格式发生变化，需要用二维数组取值
                        var res;
                        if (type == 1) { //发电量排名
                            res = $("#selDate_fd").text() + params.seriesName + "<br/>" + params.name + "：" + params.value + "(" + unit + ")";
                        } else {
                            res = params.seriesName + "<br/>" + params.name + "：" + params.value + (params.seriesName == "PR" ? "(%)" : "");
                        }
                        return res;
                    }
                },

                xAxis: [{
                    name: '',
                    type: 'value',
                    axisLine: {
                        show: false,
                        lineStyle: { // 属性lineStyle控制线条样式
                            color: '#f9f9f7',
                            width: 1
                        }
                    },
                    axisLabel: {
                        formatter: function (value, index) {//坐标保留小数
                            if (value != 0 && value < 10) {
                                return value.toFixed(1) + unit;
                            }
                            return value.toFixed(0) + unit;
                        },
                        //2016 10 31 字体颜色添加 wangli
                        show: true,
                        textStyle: {
                            color: 'black'
                        }
                    },
                    splitNumber: 4,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#50f07d',
                            type: 'dashed',
                        }
                    },
                    boundaryGap: [0, 0.01]
                }],
                yAxis: [{
                    type: 'category',
                    axisLine: {
                        show: false,
                        lineStyle: { // 属性lineStyle控制线条样式
                            color: '#f9f9f7',
                            width: 1
                        }
                    },
                    //2016 10 31 wangli 字体颜色添加
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: 'balck'
                        }
                    },
                    axisTick: { // 坐标轴小标记
                        show: false,
                        // 属性show控制显示与否，默认不显示
                        inside: false,
                        // 控制小标记是否在grid里
                        length: 5,
                        // 属性length控制线长
                        lineStyle: { // 属性lineStyle控制线条样式
                            color: '#333',
                            width: 1
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#50f07d',
                            type: 'dashed',
                        }
                    },
                    data: outputStation
                }],
                color: ['#4baafb', '#05ee8d'],
                series: outputDatas
            };
            return option;
        }
        ,


        drawfaultChart: function (outputStation, flag) {

            if (index.warnChart == null) {
                index.warnChart = echarts.init(document.getElementById('echarts'));
            }

            index.warnChart.showLoading({
                text: 'Loading...',
                //loading话术
                textStyle: {
                    fontSize: 12
                },
                effect: 'whirling',
                effectOption: {
                    backgroundColor: 'rgba(0,0,0,0)'
                }
            });
            if (flag == 1) {
                index.warnChart.hideLoading();
            }
            var warnOption = this.getWorkEcharts(outputStation);
            // 为echarts对象加载数据
            //console.log(outputOption);
            index.warnChart.setOption(warnOption);
            $(window).resize(function () {
                index.warnChart.resize();
            });
        }
        ,

        getWorkEcharts: function (jsondata) {
            var dealNum = (jsondata.totalNum - jsondata.waitNum);
            var bl = jsondata.totalNum == 0 ? 0 :
                parseFloat(dealNum / jsondata.totalNum * 100).toFixed(1);

            var a = {
                value: dealNum,
                name: LANG.index_treated,
                itemStyle: {
                    normal: {
                        color: '#8ae4d2'
                    }
                }
            };
            var b = {
                value: jsondata.waitNum,
                name: LANG.index_untreated,
                itemStyle: {
                    normal: {
                        color: '#62C5FC'//'#74DE26',
                    }
                }
            };
            var woption = {
                title: {
                    text: bl + "%",
                    x: 'center',
                    y: 'center',
                    itemGap: 10,
                    textStyle: {
                        color: '#317500',//'rgba(30,144,255,0.8)',
                        fontFamily: 'Microsoft YaHei',
                        fontSize: 16,
                        fontWeight: 'bolder'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '16',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [a, b]
                    }
                ]
            };
            return woption;
        }
        ,


        //发电趋势页面点击事件
        powerTrendDateType: function (e) {
            index.powerType = $(e.target).attr('data-dateType');
            $("#selqushi").val(index.powerType);
            this.loadPowerTrendData(index.powerType);
        },

        //发电计划日期,type 1:当日 2:当月
        capabilityTrendDateType: function (e) {
            index.genPlanDateType = $(e.target).attr('data-schedule');
            this.loadPlanChart();
        }


    },
    mounted: function () {
        var _this = this;
        $('#dateInput').val(vlm.Utils.getTrueDate(this.reportType)); //初始化时间
        this.getAllStation(); //获取电站列表
        this.loadAllMsg();

        //定时刷新
        //clearInterval(this.refreshInterval);
        //this.refreshInterval = setInterval(function () {
        //    this.loadPowerTrendData($("#selqushi").val()); //动态加载发电趋势当日1，当月2，当年3
        //    this.getAllPower(); //获取当前功率、装机功率、今日发电、今日收入、co2减排、等效植树等
        //    this.writeData(); //发电排名、性能排名
        //    this.loadWarn();       //告警
        //    this.loadWork();       //工单
        //}, 5 * 60 * 1000);

        $('.index_scr_sel').click(function (e) {
            e.stopPropagation();
        });

        $(document.body).click(function () {
            $('.choose_wrap').slideUp();
        });

        $("#dateInput").unbind().click(function () {
            WdatePicker({
                dateFmt: 'yyyy/MM/dd',
                maxDate: '%y/%M/%d',
                isShowClear: false,
                readOnly: true,
                onpicking: function (dp) {
                    $("#dateInput").val(dp.cal.getNewDateStr());
                    _this.loadPowerTrendData($("#selqushi").val());
                }
            });
        });


    }
});



