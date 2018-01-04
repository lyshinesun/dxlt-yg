var index = {
    isFristLoad: true,
    todayPower: '',//今日发电
    powerArrayLen: '',//发电趋势数组长度
    powerType: '',//发电趋势类型
    fault_totalNum: '',//故障总数
    fault_waitNum: '',//故障处理数量
    work_totalNum: '',//工单总数
    work_waitNum: '',//工单处理数量
    powerunit: '',
    powerunit2: '',
    powername: '',
    trendLegend: [],
    trendDatas: [],
    ptChart: null,
    workChart: null,
    warnChart: null,
    outputChart: null,
    myChart: null,
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
    el: '#power_yg',
    data: {
        user_Id: 8643,
        faultChart: null,
        refreshInterval: null,


        fd_all_power_day: '--',    //今日发电
        fd_all_intercon_cap: '--',    //装机功率
        fd_make_money: '--',    //今日收入
        fd_all_make_money: '--',    //累计收入
        fd_make_money_unit: '--',    //收入单位
        fd_all_pw: '--',           //当前功率
        fd_all_power: '--',        //累计总发电

        fd_all_power_day_unit: '',
        fd_all_pw_unit: '',
        fd_all_power_unit: '',

        //节能减排
        fd_co2_reduce: '--',    //co2
        fd_tree_reduce: '--',  //树
        fd_co2_reduce_unit: '万吨',    //co2单位

        dutyPserson: '', //值班人员

    },
    methods: {

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
                    "stationtype": "all",
                    "timetype": dateStr,
                    "sorttype": "1",
                    "sort": "2",
                    "starttime": startDateStr,
                    "endtime": endDateStr,
                    "topn": "300",
                    "stationid": "ALL"
                },
                "foreEndType": 2,
                "code": "20000005"
            };
            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                index.powerunit = '(' + res.data.fd_unit + ')';  //发电量单位
                index.powerunit2 = '(kW)'; //功率单位
                _this.installChart(res, 1, type);
                //隐藏loading
                if (index.ptChart != undefined) {
                    index.ptChart.hideLoading();
                }
            });

        },

        //获取装机功率、今日发电、收入、CO2减排
        getAllPower: function () {
            var _this = this;
            var Parameters = {
                "parameters": {
                    "CultureName": "",
                    "VerifiationCCodeType": "1",
                    "datas": ["ALL_POWER_DAY", "all_power", "ALL_PW", "all_power_year"]
                },
                "foreEndType": 2,
                "code": "20000003"
            };
            //console.log(Parameters);
            vlm.loadJson("", JSON.stringify(Parameters), function (result) {
                //console.log(result);
                if (result.success) {
                    var data = result.data;
                    //左上角数值
                    _this.fd_all_power_day = data.fd_all_power_day.toFixed(1);
                    _this.fd_all_pw = data.fd_all_pw;
                    _this.fd_all_power_year = data.fd_all_power_year;
                    _this.fd_all_power = data.fd_all_power;
                    _this.fd_all_intercon_cap = data.fd_all_intercon_cap; //装机容量
                    _this.fd_make_money = data.fd_all_make_money; //收入
                    _this.fd_make_money_unit = data.fd_make_money_unit; //收入单位
                    _this.fd_all_make_money = data.fd_make_money + data.fd_make_money_unit; //收入

                    //单位
                    _this.fd_all_power_day_unit = data.fd_all_power_day_unit;
                    _this.fd_all_pw_unit = data.fd_all_pw_unit;
                    _this.fd_all_power_year_unit = data.fd_all_power_year_unit;
                    _this.fd_all_power_unit = data.fd_all_power_unit;

                    //节能减排
                    _this.fd_co2_reduce = data.fd_co2_reduce;
                    _this.fd_co2_reduce_unit = data.fd_co2_reduce_unit;
                    _this.fd_tree_reduce = data.fd_tree_reduce + data.fd_tree_reduce_unit;

                    var culture = data.tbstationinfos;
                    var liHtml = "";
                    for (var i = 0; i < culture.length; i++) {
                        liHtml = liHtml +
                            '<li><a href="javascript:;">' +
                            '<img  src= ' + culture[i].fd_station_pic + '  /></a>' +
                            '<div class="slideimg_title">' +
                            '<a href="javascript:;" >' + culture[i].fd_station_desc + '</a>' +
                            '</div></li>';
                    }
                    $("#news").html(liHtml);
                    $('.flexslider').flexslider({
                        animation: "slide",
                    });

                } else {
                    alert(result.message);
                }

            });
        },

        //获取值班人员信息
        getOndutyPersonInf: function () {
            var _this = this;
            var Parameters = {
                "parameters": {},
                "foreEndType": 2,
                "code": "20000011"
            };

            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                if (res.success) {
                    var result = res.data;
                    if (result) {
                        _this.dutyPserson = result.fd_user_name;//值班人员
                    } else {
                        _this.dutyPserson = '--';//值班人员
                    }

                }


            });

        },

        //告警&&工单
        loadWarn: function () {
            var _this = this;
            if (index.warnChart == null) {
                this.drawfaultChart('', 0);
            }

            var Parameters = {
                "parameters": {
                    "stationid": "ALL"
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

                $("#worktotal, #waitWork").off().click(function () {
                    $('.sub_nav a', parent.document).removeClass('on');
                    $('#new_power_task', parent.document).addClass('on');
                    top.location.hash = '#new_power_task';
                    $('#index_frame', parent.document).attr('src', 'dialog/new_workorder/new_power_task.html');
                });

            });

        },

        drawfaultChart: function (outputStation, flag) {

            if (index.warnChart == null) {
                index.warnChart = echarts.init(document.getElementById('echarts'));
            }

            index.warnChart.showLoading({
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
                index.warnChart.hideLoading();
            }
            var warnOption = this.getWorkEcharts(outputStation);
            index.warnChart.setOption(warnOption);
            $(window).resize(function () {
                index.warnChart.resize();
            });
        },

        //工单的echarts图
        getworkChart: function (jsondata, flag) {

            if (index.workChart == null) {
                index.workChart = echarts.init(document.getElementById('echarts2'));
            }

            index.workChart.showLoading({
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
                index.workChart.hideLoading();
            }
            var workOption = this.getWorkEcharts(jsondata);
            index.workChart.setOption(workOption);
            $(window).resize(function () {
                index.workChart.resize();
            });
        },

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
        },

        writeData: function (jsondata) {

            //加载发电量排名数据
            var selopot = $("#selopot").val();
            var selopdt = $("#selopdt").val();
            this.loadOutputData(selopdt, selopot);

            //加载性能排名
            var selcapdt = $("#selcapdt").val();
            var selcapot = $("#selcapot").val();
            var capLenged = $("#capLenged").val();
            this.loadCapabilityTrendData(selcapdt, selcapot, capLenged);
        },

        //获取json数据，封装数据并加载
        installChart: function (res, flag, type) {
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
                index.powerArrayLen = len;
                index.powerType = type;

                var glData = [], actualData = [], dateDate = []; //功率、发电量、辐照、日期区间
                for (var i = 0; i < len; i++) {
                    if (result.fd_datas[i].fd_pw_curr < 0) {
                        glData.push('0');
                    } else {
                        glData.push(result.fd_datas[i].fd_pw_curr.toFixed(2));
                    }
                    actualData.push(result.fd_datas[i].fd_power_day);
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
                            color: '#24c6c6', /*柱状图bar*/
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
                                color: '#2c5075', /*功率曲线颜色*/
                                lineStyle: {
                                    width: 2
                                }
                            }
                        }
                    });
                    index.trendLegend.push(legendName);

                }
                this.powerTrendChart(dateDate, index.trendLegend, index.trendDatas, flag, type);
            }
        },

        //电站总览，绘制发电趋势echart图表
        powerTrendChart: function (xdata, trendLegend, trendDatas, flag, type) {
            var yAxisData = [];
            var _this = this;
            var option = null;
            if (type == 1) {
                yAxisData.push({
                    name: index.powername + index.powerunit,
                    nameTextStyle: {
                        color: '#333'
                    },
                    position: 'left',
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#1ae54f',
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
                        show: true,
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
                            color: '#1ae54f',
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
                        show: true,
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
                            color: '#1ae54f',
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
                        show: true,
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
                        //console.log(params);

                        var dateNum = _this.getInputDate($('#dateInput').val());
                        startDateStr = _this.getInputDate(dateNum) + '000000';
                        var year = dateNum.substring(0, 4);
                        var month = dateNum.substring(4, 6);
                        var day = dateNum.substring(6);


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
                        return res;
                    }
                },
                grid: {
                    x: 85,
                    y: 90,
                    y2: 30,
                    x2: 100,
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
                                color: '#1ae54f',
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


        //加载发电量排名数据
        loadOutputData: function (selopdt, selopot) {
            var _this = this,
                dateType = selopdt,
                dateStr = '',
                startDateStr = '',
                dates = new Date(),
                endDate = dates.getFullYear() + '-' + (dates.getMonth() + 1) + '-' + dates.getDate() + 'T' + dates.getHours() + ':' + dates.getMinutes() + ':' + dates.getSeconds(),
                endDateStr = vlm.Utils.format_date(endDate, 'YmdHis');

            switch (dateType) {
                case '1':   //所有电站按天
                    dateStr = '2';
                    startDateStr = vlm.Utils.currentDay();
                    break;
                case '2': //所有电站按月
                    dateStr = '6';
                    startDateStr = vlm.Utils.currentMonth();
                    break;
                case '3': //所有电站按年
                    dateStr = '7';
                    startDateStr = vlm.Utils.currentYear();
                    break;
                default :
                    ;
            }
            var Parameters = {
                "parameters": {
                    "stationtype": "allstation",
                    "timetype": dateStr,
                    "sorttype": "1",
                    "sort": "1",
                    "starttime": startDateStr,
                    "endtime": endDateStr,
                    "topn": "300",
                    "stationid": ""
                },
                "foreEndType": 2,
                "code": "20000005"
            };
            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                //console.log(res);
                var result = res.data.fd_datas;
                result = vlm.Utils.sortArr(result, selopot, 'fd_power_day');
                result.length = result.length > 5 ? 5 : result.length;
                _this.outputRankChart(result, res.data.fd_unit, 1);
                //隐藏loading
                if (index.outputChart != undefined && index.outputChart != null) {
                    index.outputChart.hideLoading();
                }
            });

        },

        //发电量排名echart图表生成
        outputRankChart: function (opls, unit, flag) {
            //配置圆圈样式
            var outputStation = [];
            var outputDatas = [];
            var opArr = [];
            for (var i = opls.length - 1; i >= 0; i--) {
                //加载Y轴上的各个电站
                var ps_short_name = opls[i].fd_station_name;
                if (ps_short_name.length > 7) {
                    ps_short_name = ps_short_name.substring(0, 7) + '...';
                }
                outputStation.push(ps_short_name);
                var opObj = new Object({
                    name: '',
                    value: ''
                });
                opObj.name = ps_short_name;
                opObj.value = opls[i].fd_power_day;
                opArr.push(opObj);
            }
            //console.log(opArr);
            if (opls == '') {
                outputStation.push('');
                var opObj = new Object({
                    name: '',
                    value: '0'
                });
                opArr.push(opObj);
            }

            //按照数据显示的格式封装数据
            outputDatas.push({
                name: LANG["sta_overview_generatingcapacity"],
                type: 'bar',
                stack: 'all',
                data: opArr,
                itemStyle: {
                    normal: {
                        color: $(".basecolor").css("color"),//39ADD1
                        //barBorderRadius: [5, 5, 5, 5],
                        lineStyle: {
                            width: 2
                        }
                    }
                },
                barWidth: 15,
                barMaxWidth: 15
            });
            if (index.outputChart == null) {
                index.outputChart = echarts.init(document.getElementById('echarts3'));
            }

            index.outputChart.showLoading({
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
                index.outputChart.hideLoading();
            }
            var outputOption = this.getDrawBarChartOption(outputStation, outputDatas, unit, 1, $("#echarts3"));
            // 为echarts对象加载数据
            index.outputChart.setOption(outputOption);
            $(window).resize(function () {
                index.outputChart.resize();
            });

        },


        //加载性能排名数据
        loadCapabilityTrendData: function (selcapdt, selcapot, lengendType) {
            var _this = this,
                dateStr = '',
                startDateStr = '',
                dates = new Date(),
                endDate = dates.getFullYear() + '-' + (dates.getMonth() + 1) + '-' + dates.getDate() + 'T' + dates.getHours() + ':' + dates.getMinutes() + ':' + dates.getSeconds(),
                endDateStr = vlm.Utils.format_date(endDate, 'YmdHis');
            switch (selcapdt) {
                case '2':
                    dateStr = 'day';
                    startDateStr = vlm.Utils.currentDay();
                    break;
                case '3':
                    dateStr = 'year';
                    startDateStr = vlm.Utils.currentMonth();
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
                    "stationid": ""
                },
                "foreEndType": 2,
                "code": "20000002"
            };

            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                //console.log(res);
                if (res.success) {
                    var resultArray = res.data;
                    if (resultArray.length) {
                        resultArray.length = resultArray.length > 5 ? 5 : resultArray.length;
                        if (lengendType == 1) {  //等效小时
                            resultArray = vlm.Utils.sortArr(resultArray, selcapot, 'equivalenthour');
                        } else if (lengendType == 2) { //pr
                            resultArray = vlm.Utils.sortArr(resultArray, selcapot, 'pr');
                        }

                        _this.capabilityTrendChart(resultArray, lengendType);
                    }
                } else {
                    alert(res.message);
                }
            });

        },

        //性能排名
        capabilityTrendChart: function (els, lengendType) {
            //性能排名
            var capLegend = [];
            var capPDatas = [];
            var capKDatas = [];
            var capDatas = [];

            var lengeds;
            var capseries = [];
            var unit = "";
            var tname = "";
            for (var i = els.length - 1; i >= 0; i--) {
                var ps_short_name = els[i].fd_station_name;
                var ps_id = els[i].ps_id;
                if (ps_short_name.length > 7) {
                    ps_short_name = ps_short_name.substring(0, 7) + '...';
                }
                capLegend.push(ps_short_name);
                if (lengendType == 1) {
                    capDatas.push(els[i].equivalenthour);
                    unit = '(h)';  //设置显示的图例
                    tname = 'kWh/kWp';
                } else if (lengendType == 2) {
                    capDatas.push(els[i].pr);
                    unit = '(%)';
                    //lengeds = {data:['kWh/kWp', 'PR'],selectedMode : 'single',selected: {'kWh/kWp' : false},y:20};
                    tname = 'PR';
                }

            }
            if (els == '') {
                capLegend.push('');
                capDatas.push('0');
            }

            capseries.push({
                name: tname,
                type: 'bar',
                position: 'bottom',
                xAxisIndex: 0,
                data: capDatas,
                itemStyle: {
                    normal: {
                        color: $(".basecolor").css("color"),
                        //barBorderRadius: [5, 5, 5, 5],
                        lineStyle: {
                            width: 4
                        }
                    }
                },
                barWidth: 15,
                barMaxWidth: 15
            });
            if (index.myChart == null) {
                index.myChart = echarts.init(document.getElementById('echarts4'));
            }

            var option = this.getDrawBarChartOption(capLegend, capseries, unit, 2, $("#echarts4"));
            index.myChart.setOption(option);
            $(window).resize(function () {
                index.myChart.resize();
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
                            color: '#333'
                        }
                    },
                    splitNumber: 4,
                    splitLine: {
                        show: false
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
                            color: '#333'
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
                        show: false
                    },
                    data: outputStation
                }],
                color: ['#24c6c6', '#8ae4d2'],
                series: outputDatas
            };
            return option;
        },

        //发电趋势页面点击事件
        powerTrendDateType: function (e) {
            index.powerType = $(e.target).attr('data-dateType');
            $("#selqushi").val(index.powerType);
            this.loadPowerTrendData(index.powerType);
        },

        //发电量排名页面当日，当月，当年点击事件
        outputDateType: function (e) {
            var type = $(e.target).attr('dateTabType');
            $("#selopdt").val(type);
            this.loadOutputData($("#selopdt").val(), $("#selopot").val());
        },
        //发电量排名页面type 1:前5名 2:后5名点击事件
        outputOrderType: function (e) {
            var sorttype = $(e.target).attr('data-sortType');
            var selopot = $("#selopot");
            var selopdt = $("#selopdt");
            selopot.val(sorttype);
            this.loadOutputData(selopdt.val(), selopot.val());
        },

        //性能排名页面点击事件,type 1:kWh/kWp 2:PR
        capabilityTrendSwithType: function (e) {
            var eptype = $(e.target).attr('data-equalorPr');
            var selcapdt = $("#selcapdt");
            var selcapot = $("#selcapot");
            var capLenged = $("#capLenged");
            capLenged.val(eptype);
            this.loadCapabilityTrendData(selcapdt.val(), selcapot.val(), capLenged.val());
        },

        //性能排名的日期类型加粗,type 1:当日 2:当月 3:累计
        capabilityTrendDateType: function (e) {
            var type = $(e.target).attr('data-prType');
            var selcapdt = $("#selcapdt");
            selcapdt.val(type);
            var selcapot = $("#selcapot");
            var capLenged = $("#capLenged");
            this.loadCapabilityTrendData(selcapdt.val(), selcapot.val(), capLenged.val());
        },

        //性能排名页面点击事件,type 1:前5名 2:后5名
        capabilityTrendOrderType: function (e) {
            var type = $(e.target).attr('data-prRankType');
            var selcapdt = $("#selcapdt");
            var selcapot = $("#selcapot");
            selcapot.val(type);
            var capLenged = $("#capLenged");
            this.loadCapabilityTrendData(selcapdt.val(), selcapot.val(), capLenged.val());
        },


        //所有电站发电排名弹窗
        showAll_power: function () {
            parent.layer.open({
                type: 2,
                title: '电站发电量排名',
                shadeClose: true,
                shade: 0.5,
                maxmin: true, //开启最大化最小化按钮
                area: ['1000px', '600px'],
                content: ['popUp/inverter_pop.html'],
                success: function (layero, index) {
                    $("#devid", layero.find("iframe")[0].contentWindow.document).val(devid);
                }
            });
        },

    },
    mounted: function () {
        var _this = this;
        $('#dateInput').val(vlm.Utils.getTrueDate(this.reportType)); //初始化时间
        this.loadPowerTrendData($("#selqushi").val()); //动态加载发电趋势当日1，当月2，当年3
        this.getAllPower(); //获取装机功率、发电、今日收入、co2减排、等效植树、公司文化等
        this.writeData(); //发电排名、性能排名
        this.getOndutyPersonInf(); //值班
        this.loadWarn();       //告警

        //定时刷新
        //clearInterval(this.refreshInterval);
        //this.refreshInterval = setInterval(function () {
        //    this.loadPowerTrendData($("#selqushi").val()); //动态加载发电趋势当日1，当月2，当年3
        //    this.getAllPower(); //获取当前功率、装机功率、今日发电、今日收入、co2减排、等效植树等
        //    this.writeData(); //发电排名、性能排名
        //    this.loadWarn();       //告警
        //    this.loadWork();       //工单
        //}, 5 * 60 * 1000);


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



