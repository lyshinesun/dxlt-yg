new Vue({
    el: '#stationUnit',
    data: {
        stationList:[],
        stationId: 'GS', //电站id
        fd_dev_id: '', // 设备id
        firstTreeFlag: true,  //是否是一级树

        curOtherPage: 1, // 哪一页
        sizePage: 10,
        chooseTotNum: 0,  //总条数

        pointId_cap: "ac_pw", //交流功率
        pointId_pow: "ac_power", //日发电量
        yAxisName_capacity: "",//交流功率单位
        yAxisName_power: "",//"日发电量单位";

        psId: '',
        psName: '',
        nodeArray: [],
        legendSelected: {},
        echartColors: ['#87CEFA', '#FF7F50', '#DA72D7', '#32CD32', '#8EB2F2', '#FF69B4', '#BA55D3', '#D26B6B', '#FFA500', '#40E0D0', '#1E90FF', '#E1624B', '#948BCE', '#00FA9A', '#C8B44C', '#99BCFF', '#FF6666', '#3CB371', '#B8860B', '#30E0E0'],
        symbolList: [
            'circle', 'rectangle', 'triangle', 'diamond',
            'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond',
            'circle', 'rectangle', 'triangle', 'diamond',
            'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond',
            'circle', 'rectangle', 'triangle', 'diamond'
        ],

        myCapacityChart: null,  //功率chart
        optionCapacity: null,  //功率chart参数
        myPowerChart: null,    //发电量cahrt
        optionPower: null,    //发电量chart参数


        capacityArr: [],   //功率数据数组
        PowerArr: [],   //发电量数据数组

        i: 0,
        j: 0,
        unitInterval: null,
        timeDay: '',
        clearSetInterval: null,
    },
    methods: {
        //初始化页面尺寸
        initPageSize: function () {
            $('.map_wap').height($(window).height());
            $('.map_con_fl').height($('.map_wap').height() - 60);
            $('.tendency_ri').height($('.map_wap').height() - 60);
            $(window).resize(function () {
                $('.map_wap').height($(window).height());
                $('.map_con_fl').height($('#map_wap_div').height() - 60);
                $('.tendency_ri').height($('#map_wap_div').height() - 60);
            });
        },
        /*获取电站列表*/
        getStations: function (res) {
            var _this = this
            _this.stationList = res.list
            _this.stationId = _this.stationList[0].fdStationCode
            this.loadPage();//加载页面
        },

        //更换左侧列表电站
        changeStation: function (e) {
            var target = null;
            if (e == 1) {

            } else {
                if ($(e.target)[0].tagName == 'A') {
                    target = $(e.target).parent();
                    if ($(e.target).hasClass('sta_tit')) {

                        target.addClass('on').siblings().removeClass('on');
                        this.stationId = target.attr('id')
                        this.firstTreeFlag = true; //重置首次树boolean
                        $('.ztree').remove(); //清空ztree
                        this.fd_dev_id = "";
                        this.showTree(this.stationId, '0');
                        this.showTable();
                    }
                }
            }

        },

        //获取tree数据
        showTree: function (id, isdata) {
            var _this = this;
            var Parameters = {
                "parameters": {
                    "stationid": this.stationId,
                    "fd_dev_class_id": '2'
                },
                "foreEndType": 2,
                "code": "30000041"
            }

            if (!this.firstTreeFlag) {
                Parameters.parameters.fd_dev_id = id;
                Parameters.parameters.fd_isdata = isdata;
            }

            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                //console.log(res);
                var zNodes = res.data;
                var newNodes = [];
                for (var i = 0; i < zNodes.length; i++) {
                    showTreeNodeImageByDeviceType(zNodes[i]); //code图标转换
                    if (zNodes[i].fd_dev_class_id == 10) {  //非特殊图标eg：svg文件夹
                        zNodes[i].icon = "";
                    }
                    var obj = {
                        id: zNodes[i].fd_dev_id,  //设备id
                        name: zNodes[i].fd_name,  //设备名字
                        icon: zNodes[i].icon,     //设备图标
                        isdata: zNodes[i].fd_isdata, //是否数据
                        fd_tablename: zNodes[i].fd_tablename, //表名
                        fd_code: zNodes[i].fd_code, //点名
                    };
                    if (_this.firstTreeFlag) {  //首次树
                        if (i == 0) {
                            obj.treeIcon = 'roots_close';
                        } else {
                            obj.treeIcon = 'bottom_close';
                        }
                    } else {  //非首次
                        if (zNodes[i].fd_isdata == 2) {
                            obj.treeIcon = 'bottom_close';  //是数据
                        } else if ((zNodes[i].fd_isdata == 1)) {
                            obj.treeIcon = 'center_docu';
                        }
                    }
                    newNodes.push(obj);
                }
                var powerhtml = $('#powerTpl0').html();
                var powerLi = ejs.render(powerhtml, {newNodes: newNodes});
                var oUl = null;
                if (_this.firstTreeFlag) {
                    oUl = $('<ul id="power_sec_Ul" class="ztree"></ul>');
                } else {
                    oUl = $('<ul class="line"></ul>');
                }
                oUl.html(powerLi);
                oUl.appendTo($('#' + id));

                oUl.find('>li').click(function (e) {
                    e.stopPropagation();
                    //判断点击的是+-号 还是文字
                    //console.log($(e.target).attr('class'));
                    if ($(e.target).attr('class').indexOf('button') != -1) {
                        //+-
                        if ($(this).find('ul').length < 1) {
                            _this.firstTreeFlag = false;
                            _this.showTree($(this).attr('id'), $(this).attr('data-isdata')); //发送tree请求
                            if ($(this).find('>span').hasClass('roots_close')) {
                                $(this).find('>span').removeClass('roots_close').addClass('roots_open');
                            } else if ($(this).find('>span').hasClass('bottom_close')) {
                                $(this).find('>span').removeClass('bottom_close').addClass('center_open');
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

                    } else {
                        //点击文字
                        if ($(this).find('ul').length < 1) {
                            _this.firstTreeFlag = false
                            if ($(this).attr('data-isdata') == 2) {
                                //showTree
                                _this.showTree($(this).attr('id'), $(this).attr('data-isdata')); //发送tree请求

                                if ($(this).find('>span').hasClass('roots_close')) {
                                    $(this).find('>span').removeClass('roots_close').addClass('roots_open');
                                } else if ($(this).find('>span').hasClass('bottom_close')) {
                                    $(this).find('>span').removeClass('bottom_close').addClass('center_open');
                                }
                            }

                            //加载table  无论isdata=0 或者2 都需要展示chart
                            _this.curOtherPage = 1; //重置页数为1
                            _this.fd_dev_id = $(this).attr('id');
                            _this.showTable();

                        } else {

                            _this.firstTreeFlag = false
                            if ($(this).attr('data-isdata') == 2) {

                                if ($(this).find('>span').hasClass('roots_close')) {
                                    $(this).find('>span').removeClass('roots_close').addClass('roots_open');
                                } else if ($(this).find('>span').hasClass('bottom_close')) {
                                    $(this).find('>span').removeClass('bottom_close').addClass('center_open');
                                }
                            }

                            //加载table  无论isdata=0 或者2 都需要展示chart
                            _this.curOtherPage = 1; //重置页数为1
                            _this.fd_dev_id = $(this).attr('id');
                            _this.showTable();


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

                    }

                });

            });

        },

        //右侧table
        showTable: function () {
            var _this = this;
            var startStr = $('#new_datetimepicker_mask').val().replace(/[/*]/g, '').substring(0, 8) + '000000';
            var endStr = $('#new_datetimepicker_mask').val().replace(/[/\s:*]/g, '') + '00';
            var Parameters = {
                "parameters": {
                    "ctype": "2",
                    "sorttype": "1",
                    "timetype": "4",
                    "sort": "1",
                    "starttime": startStr,
                    "endtime": endStr,
                    "topn": "700",
                    fd_page_index: this.curOtherPage,   //页数
                    fd_page_size: this.sizePage,   //数据条数
                    "stationid": this.stationId,
                    "fd_dev_class_id": "2",
                    "fd_dev_id": this.fd_dev_id,
                    "ischild": ""
                },
                "foreEndType": 2,
                "code": "30000042"
            }

            _this.chooseTotNum = 0;  //清空统计条数

            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                if (res.data) {
                    var unitArr = res.data.data1;
                    if(unitArr.length){
                    var unithtml = $('#station_unit_tpl').html();
                    var unitTr = ejs.render(unithtml, {unitArr: unitArr});
                    $('#psBlock >tbody').html('').html(unitTr);

                    $('.expand_display_flag >img').off().click(function () {
                        $('.sub_nav a', parent.document).removeClass('on');
                        $('#station_inverter', parent.document).addClass('on');
                        top.location.hash = '#station_inverter';
                        $('#index_frame', parent.document).attr('src', 'dialog/station_inverter.html');
                    });

                        //分页
                        _this.chooseTotNum = res.data.fddatacount;
                        if (_this.chooseTotNum > 0) {
                            _this.startPageFlag = false;
                            if (_this.curOtherPage > 1 && _this.fddatacount <= (_this.curOtherPage - 1) * _this.sizePage) {//总数小于页数*当前页码，页码自动减一
                                _this.curOtherPage = _this.curOtherPage - 1;
                            }
                            _this.pageList();
                        }
                        $('#Paginationother').show();
                    }else{
                        $('#psBlock >tbody').html('');
                        $('#Paginationother').hide();
                    }
                }
                _this.clearEchart();  //清空数据
                _this.testVal();     //绘制chart
            });
        },

        //初始化图标
        initchart: function () {
            var _this = this;

            if (this.myCapacityChart == null) {
                this.myCapacityChart = echarts.init(document.getElementById('designCapacity'));
            } else {
                this.myCapacityChart.clear();
            }

            if (this.myPowerChart == null) {
                this.myPowerChart = echarts.init(document.getElementById('power'));
            } else {
                this.myPowerChart.clear();
            }


            this.optionCapacity = {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'black'
                },
                symbolList: [
                    'circle', 'rectangle', 'triangle', 'diamond',
                    'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond'],
                legend: {
                    //selectedMode:false,
                    itemHeight: 10,
                    left: 130,
                    top: 10,
                    data: []
                }, grid: {
                    width: '80%',
                    x: 85,
                    borderWidth: 0
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        magicType: {
                            show: true,
                            type: ['line', 'bar', 'stack', 'tiled']
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                calculable: false,
                xAxis: [{
                    boundaryGap: false,
                    splitLine: {
                        show: false
                    }, data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
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
                ]
                ,
                yAxis: [{
                    name: LANG.all_station_daily_energy + '(kWh)',
                    position: 'left',
                    type: 'value',
                    axisTick: {
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
                }],
                color: [],
                //scale: true,
                series: []
            };

            this.myCapacityChart.setOption(this.optionCapacity);

            //基于准备好的dom，初始化echarts图表
            this.optionPower = {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'black'
                },
                legend: {
                    //selectedMode:false,
                    itemHeight: 10,
                    left: 130,
                    top: 10,
                    data: []
                }, grid: {
                    width: '80%',
                    x: 92,//2017 01 24 wangli
                    borderWidth: 0
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        magicType: {
                            show: true,
                            type: ['line', 'bar', 'stack', 'tiled']
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },

                calculable: false,
                xAxis: [
                    {
                        boundaryGap: false,
                        splitLine: {
                            show: false
                        }, data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
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
                        axisTick: {
                            show: false
                        },
                        name: LANG.all_station_ac_power + '(kW)',
                        position: 'left',
                        type: 'value',
                        axisTick: {
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
                color: [],
                series: []
            };

            this.myPowerChart.setOption(this.optionPower);
            window.onresize = function () {
                _this.myCapacityChart.resize();
                _this.myPowerChart.resize();
            }

        },

        //归一化切换
        changeGYH: function () {
            var isChecked = $("#checkbox_c1").attr("checked");
            this.clearEchart();
            this.testVal();
        },

        testVal: function () {
            var _this = this;
            this.i = 0;
            this.j = 0;
            var dataname = "", devid = '';
            $("[name='batchIds'][checked]").each(function (index) {
                dataname = $(this).val();
                devid = $(this).attr('data-devid');
                _this.pointId_cap = "ac_pw"; //交流功率
                _this.pointId_pow = "ac_power"; //日发电量
                _this.yAxisName_capacity = LANG["all_station_ac_power"] + "(kW)";//交流功率单位
                _this.yAxisName_power = LANG["all_station_daily_energy"] + "(kWh)";//"日发电量单位";
                var isChecked = $("#checkbox_c1").attr("checked");
                if (isChecked == "checked") {
                    _this.pointId_cap = "ac_pw_one"; //功率归一化
                    _this.pointId_pow = "ac_power_one"; //日发电量归一化
                    _this.yAxisName_capacity = LANG["common.glgyh"] + "(kW/kWp)";//交流功率单位
                    _this.yAxisName_power = LANG["common.dxxs"] + "(kWh/kWp)";//"日发电量单位";
                }
                _this.setOptionData_capacity(devid, dataname, _this.echartColors[index]);
            })

        },

        getBlockTime: function () {
            var temp = $("#new_datetimepicker_mask").val();
            var timeDay = temp.substring(0, 4) + temp.substring(5, 7) + temp.substring(8, 11) + temp.slice(11, 13) + temp.slice(14, 16) + "00";
            while (timeDay.indexOf(" ") != -1) {
                timeDay = timeDay.replace(" ", "");
            }
            return timeDay;
        },

        getClock: function () { //$("#allsite_dateDay").val();
            clearInterval(this.clearSetInterval);
            $(".allsite_dateriCheckbox").attr("checked", false);
            var temp = $("#new_datetimepicker_mask").val();
            var nowDate = new Date();
            var daybegin = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), nowDate.getHours(), nowDate.getMinutes());
            var year1 = daybegin.getFullYear();
            var month1 = daybegin.getMonth() + 1;
            var date1 = daybegin.getDate();
            var hours = daybegin.getHours();
            var minutes = daybegin.getMinutes();
            month1 = month1 >= 10 ? month1 : ("0" + month1);
            date1 = date1 >= 10 ? date1 : ("0" + date1);
            hours = hours >= 10 ? hours : ("0" + hours);
            minutes = minutes >= 10 ? minutes : ("0" + minutes);
            var m = getFiveMinutes(minutes);
            var beginDate = year1 + "" + month1 + date1 + hours + m + "00"; // year1 与 month1 拼接错误    裴习柱  2016-11-08
            if (temp.length > 0) {
                this.timeDay = this.getBlockTime();
                if (this.timeDay == beginDate) {
                    this.clearTable();
                    this.clearEchart();
                    //this.showChart(timeNode, null);
                    return;
                }
                if (this.timeDay > beginDate) {
                    Sungrow.showMsg({
                        container: {
                            header: LANG["all_station_prompt"],
                            content: LANG["all_station_writeerror"],
                            noFn: true,
                            noText: LANG["pro_management_determine"]
                        },
                        fixed: false
                    });
                    return;
                }
            } else {
                Sungrow.showMsg({
                    container: {
                        header: LANG["all_station_prompt"],
                        content: LANG["all_station_writeerror"],
                        noFn: true,
                        noText: LANG["pro_management_determine"]
                    },
                    fixed: false
                });
                return;
            }
            this.clearEchart();
            //showChart(timeNode, timeDay);
        },

        clearTable: function () {
            var optiontable = document.getElementById("psBlock");
            var len = optiontable.rows.length;
            for (var i = len - 1; i > 0; i--) {
                optiontable.deleteRow(i);
            }
        },

        //功率chart和发电量chart
        setOptionData_capacity: function (devid, dataname, color) {
            var _this = this;
            this.optionCapacity.color.push(color);
            var startStr = $('#new_datetimepicker_mask').val().replace(/[/*]/g, '').substring(0, 8) + '000000';
            var endStr = $('#new_datetimepicker_mask').val().replace(/[/\s:*]/g, '') + '00';

            var Parameters = {
                "parameters": {
                    "ctype": "2",
                    "sorttype": "1",
                    "timetype": "0",
                    "sort": "2",
                    "starttime": startStr,
                    "endtime": endStr,
                    "topn": "10000",
                    "fd_dev_class_id": "2",
                    "stationid": this.stationId,
                    "fd_dev_id": devid,
                    "ischild": "",
                    fd_page_size: "1000"
                },
                "foreEndType": 2,
                "code": "30000042"
            }

            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                var data = res.data.data1;

                //交流功率chart
                var unitCapacityarr = [], capacityDates = [];
                if (_this.pointId_cap == "ac_pw") {  //普通交流功率
                    for (var i = 0; i < data.length; i++) {
                        unitCapacityarr.push(data[i].fd_pdc_curr);  //y
                        capacityDates.push(data[i].fd_datetime.substring(11, 16));   //x
                    }
                } else if (_this.pointId_cap == "ac_pw_one") {
                    //归一化
                    for (var i = 0; i < data.length; i++) {
                        unitCapacityarr.push(data[i].fd_pdc_curr_one);  //y
                        capacityDates.push(data[i].fd_datetime.substring(11, 16));   //x
                    }
                }
                _this.optionCapacity.xAxis = [{
                    type: 'category', // 坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
                    data: capacityDates,
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        margin: 8,
                        rotate: 25,//逆时针显示标签，不让文字叠加
                        interval: 7,
                        textStyle: {
                            color: '#1e90aa',
                            fontFamily: 'verdana',
                            fontSize: 10,
                            fontStyle: 'normal'
                        }
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
                }];
                _this.optionCapacity.yAxis = [{
                    name: _this.yAxisName_capacity,
                    position: 'left',
                    type: 'value',
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
                }];
                _this.capacityArr.push({
                    name: dataname,
                    type: 'line',
                    data: unitCapacityarr
                });
                _this.j++;
                if ($("[name='batchIds'][checked]").length == _this.j) {
                    $("[name='batchIds']").each(function (index) {
                        var name = $(this).val().substring($(this).val().indexOf("&") + 1);
                        var symbol = _this.symbolList[index];
                        for (var i = 0; i < _this.capacityArr.length; i++) {
                            if (_this.capacityArr[i].name == name) {
                                _this.capacityArr[i].symbol = symbol;
                                _this.optionCapacity.legend.data.push(name);
                                _this.optionCapacity.series.push(_this.capacityArr[i]);
                                break;
                            }
                        }
                    });
                    //console.log(_this.optionCapacity);
                    _this.myCapacityChart.setOption(_this.optionCapacity);
                    layer.closeAll();
                }


                //日发电量
                var unitpowerArr = [], powerDates = [];

                if (_this.pointId_cap == "ac_pw") {  //普通交流功率
                    for (var i = 0; i < data.length; i++) {
                        unitpowerArr.push(data[i].fd_power);
                        powerDates.push(data[i].fd_datetime.substring(11, 16));
                    }
                } else if (_this.pointId_cap == "ac_pw_one") {
                    //归一化
                    for (var i = 0; i < data.length; i++) {
                        unitpowerArr.push(data[i].equivalenthour);
                        powerDates.push(data[i].fd_datetime.substring(11, 16));
                    }
                }

                _this.optionPower.xAxis = [{
                    type: 'category', // 坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
                    data: powerDates,
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        margin: 8,
                        rotate: 0,//逆时针显示标签，不让文字叠加
                        interval: 11,
                        textStyle: {
                            color: '#1e90aa',
                            fontFamily: 'verdana',
                            fontSize: 8,
                            fontStyle: 'normal'
                        }
                    }
                }];
                _this.optionPower.yAxis = [{
                    name: _this.yAxisName_power,
                    position: 'left',
                    type: 'value'
                }];
                _this.PowerArr.push({
                    name: dataname,
                    type: 'line',
                    data: unitpowerArr
                });
                _this.i++;
                if ($("[name='batchIds'][checked]").length == _this.i) {
                    $("[name='batchIds']").each(function (index) {
                        var name = $(this).val().substring($(this).val().indexOf("&") + 1);
                        var symbol = _this.symbolList[index];
                        for (var i = 0; i < _this.PowerArr.length; i++) {
                            if (_this.PowerArr[i].name == name) {
                                _this.PowerArr[i].symbol = symbol;
                                _this.optionPower.legend.data.push(name);
                                _this.optionPower.series.push(_this.PowerArr[i]);
                                break;
                            }
                        }
                    });
                    _this.myPowerChart.setOption(_this.optionPower);
                    layer.closeAll();
                }

            });

        },

        //清空chart表
        clearEchart: function () {
            //  每次点击时间刷新echarts时，清空capacityArr、PowerArr
            this.capacityArr = [];
            this.PowerArr = [];
            this.initchart();
        },

        refreshTime_psUnit: function () {
            var text = $("#timeValue").html();
            if (document.getElementById("setTime").checked) {
                this.unitInterval = setInterval(this.refreshunitPage(), text * 60 * 1000);
            } else {
                clearInterval(this.unitInterval);
            }
        },


        refreshunitPage: function () {
            var now = new Date();
            var min = now.getMinutes() >= 10 ? now.getMinutes() : ("0" + now.getMinutes());
            var mon = (now.getMonth() + 1) >= 10 ? now.getMonth() : ("0" + (now.getMonth() + 1));
            var date = now.getDate() >= 10 ? now.getDate() : ("0" + now.getDate());
            var hour = now.getHours() >= 10 ? now.getHours() : ("0" + now.getHours());
            min = getFiveMinutes(min); //取整五分钟
            var refrshtime = now.getFullYear() + "/" + mon + "/" + date + " " + hour + ":" + min;
            $("#new_datetimepicker_mask").val(refrshtime);
            this.getClock();
            $(".allsite_dateriCheckbox").attr("checked", true);

        },

        initTime: function () {
            var _this = this;
            var now = new Date();
            var min = now.getMinutes() >= 10 ? now.getMinutes() : ("0" + now.getMinutes());
            var mon = (now.getMonth() + 1) >= 10 ? (now.getMonth()  + 1) : ("0" + (now.getMonth() + 1));
            var date = now.getDate() >= 10 ? now.getDate() : ("0" + now.getDate());
            var hour = now.getHours() >= 10 ? now.getHours() : ("0" + now.getHours());
            min = getFiveMinutes(min); //取整五分钟
            var refrshtime = now.getFullYear() + "/" + mon + "/" + date + " " + hour + ":" + min;
            $("#new_datetimepicker_mask").val(refrshtime);

            //绑定picker
            $('#new_datetimepicker_mask').click(function () {
                WdatePicker({
                    isShowToday: false,
                    dateFmt: 'yyyy/MM/dd HH:mm',
                    isShowClear: false,
                    isShowOK: true,
                    isShowToday: false,
                    readOnly: true,
                    maxDate: '%y/%M/%d %H:%m',
                    onpicked: function (dp) {
                        //alert(dp.cal.getNewDateStr());
                        _this.showTable();
                    }
                })

            });
        },

        //创建分页
        pageList: function () {
            var _this = this;
            this.sizePage = getPageNum($("#pageId").val());
            var num_entries = this.chooseTotNum;
            var paramArray = [];
            paramArray.push(num_entries);
            paramArray.push(this.sizePage);
            // 创建分页
            $("#Paginationother").pagination(num_entries, {
                num_edge_entries: 1,
                //边缘页数
                current_page: _this.curOtherPage - 1,
                num_display_entries: 4,
                //主体页数
                callback: pageselectCallback,
                items_per_page: _this.sizePage,
                //每页显示1项
                prev_text: LANG["all_station_previouspage"],
                next_text: LANG["all_station_nextpage"],
                /**start 2016 07 06 wangli 添加跳页操作**/
                page_jump: formatString(LANG["common_pagejump"]),
                page_confirm: formatString(LANG["common_confirm"]),
                /**end 2016 07 06**/
                page_message: formatString(LANG["common_pagemessage"], paramArray, _this.sizePage)
            });

            function pageselectCallback(page_index) {
                _this.curOtherPage = page_index + 1;
                if (_this.startPageFlag) { //不是点击分页按钮的时候不调用search方法
                    $("#pageChange").val(_this.curOtherPage);
                    _this.showTable();
                }
                _this.startPageFlag = true;
            }

            $("#pageChange").val(_this.curOtherPage);
            $('#goPage').click(function () {
                _this.curOtherPage = $("#pageChange").val();
                _this.showTable();
            });

        },

        loadPage: function () {
            this.initPageSize();   //初始化尺寸
            this.initTime();   //初始化input 时间
            this.initchart();   //初始化chart
            this.showTree(this.stationId, '0');   //左侧tree
            this.showTable();   //右侧table
        }

    },
    mounted: function () {
        // this.getStations()   
        vlm.getConnectedStations(this.getStations)

    }
});

