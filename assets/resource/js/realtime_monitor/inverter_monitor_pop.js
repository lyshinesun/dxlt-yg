new Vue({
    el: '#inverter_monitor_pop',
    data: {
        currentDate: '',
        stationId: '',
        inverterId: '',
        myCapacityChart: null,  //功率chart
        optionCapacity: null,  //功率chart参数
        capacityArr: [],   //功率数据数组
        legendSelected: {},
        echartColors: ['#87CEFA', '#FF7F50', '#DA72D7', '#32CD32', '#8EB2F2', '#FF69B4', '#BA55D3', '#D26B6B', '#FFA500', '#40E0D0', '#1E90FF', '#E1624B', '#948BCE', '#00FA9A', '#C8B44C', '#99BCFF', '#FF6666', '#3CB371', '#B8860B', '#30E0E0'],
        symbolList: [
            'circle', 'rectangle', 'triangle', 'diamond',
            'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond',
            'circle', 'rectangle', 'triangle', 'diamond',
            'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond',
            'circle', 'rectangle', 'triangle', 'diamond'
        ]
    },
    methods: {
        initTime () {
            var _this = this;
            var now = new Date();
            // var min = now.getMinutes() >= 10 ? now.getMinutes() : ("0" + now.getMinutes());
            var mon = (now.getMonth() + 1) >= 10 ? (now.getMonth()  + 1) : ("0" + (now.getMonth() + 1));
            var date = now.getDate() >= 10 ? now.getDate() : ("0" + now.getDate());
            // var hour = now.getHours() >= 10 ? now.getHours() : ("0" + now.getHours());
            /*min = getFiveMinutes(min);*/ //取整五分钟
            _this.currentDate = now.getFullYear() + "-" + mon + "-" + date;
            $("#new_datetimepicker_mask").val(_this.currentDate);
        },
        datePicker () {
            var _this = this
            //绑定picker
            $('#new_datetimepicker_mask').click(function () {
                WdatePicker({
                    isShowToday: true,
                    dateFmt: 'yyyy-MM-dd',
                    isShowClear: false,
                    isShowOK: true,
                    isShowToday: true,
                    readOnly: true,
                    maxDate: '%y-%M-%d',
                    onpicked: function (dp) {
                        //alert(dp.cal.getNewDateStr());
                        $("#new_datetimepicker_mask").val(dp.cal.getNewDateStr());
                        _this.currentDate = dp.cal.getNewDateStr()
                        console.log(_this.currentDate)
                        // _this.getStationList()
                        _this.getInverterData()
                    }
                })

            });
        },
        //设置交流功率的option
        setCapacityOption (optionLegendData, option_Series_Data, option_xAxis) {
            // console.log(option_Series_Data)
            var _this = this
            // console.log(optionLegendData)
             this.optionCapacity = {
               /*title: {
                    text: '交流功率(kwh)'
                },*/
                tooltip: {
                    trigger: 'axis'
                },
                symbolList: ['circle', 'rectangle', 'triangle', 'diamond',
                 'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond'],
                legend: {
                    itemHeight: 10,
                    left: 130,
                    top: 10,
                    // data: ['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
                    data: optionLegendData
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    show: false,
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: '#4488bb'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: 'black'
                        }
                    },
                    // data: ['周一','周二','周三','周四','周五','周六','周日']
                    data: option_xAxis
                },
                yAxis: {
                    name: LANG["all_station_unit"] + 'A',
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
                    }
                },
                series: option_Series_Data
            };
            this.myCapacityChart.setOption(this.optionCapacity);
            window.onresize = function () {
                _this.myCapacityChart.resize();
            }
        },
        //获取逆变器的数据
        getInverterData (inverterId, color) {
            var _this = this
            $.ajax({
                url: vlm.serverAddr + 'stationbaseinfo/getPvInfoList',  //请求地址
                dataType: "json",
                data:{
                    "psid": _this.stationId,
                    "pid":_this.inverterId,//逆变器id
                    "fdLogDate": _this.currentDate//这个参数可按日期查询，要么不传（默认当天），要么格式必须为 YYYY-mm-dd格式
                },
                type : "GET",
                success: function(res){
                    var optionLegendData = [] //表头的折线名称
                    var option_Series_Data = [] //曲线的信息
                    var option_xAxis = [] //x轴的日期值

                    if (res.code == 0) {
                        var data = res.list
                        // console.log((data[0].list)[1])
                        for (var i = 0; i < data.length; i++) {
                            var tempSeries_Data = []
                            optionLegendData.push(data[i].pvid) //设置option中的legend值
                            for (var j=0; j<data[i].list.length; j++) {
                                tempSeries_Data.push((data[i].list)[j].fdAvgvalue) //获取逆变器下每个组串的功率
                                
                            }
                            option_Series_Data.push({
                                name: data[i].pvid,
                                type: 'line',
                                symbol: 'circle',
                                smooth: true,
                                data: tempSeries_Data
                            })
                        }
                        // console.log(option_Series_Data)
                        //拿到x轴的时间值
                        /*for (var k=0; k<data[0].list.length; k++) {
                            option_xAxis.push((data[0].list)[k].fdLogDate.substring(11, 16))
                        }*/

                        for (var k=0; k<data.length; k++) {
                            if (data[k].list.length && !option_xAxis.length) {
                                for (var l=0; l<data[k].list.length; l++) {
                                    option_xAxis.push((data[k].list)[l].fdLogDate.substring(11, 16))
                                }
                            }
                        }

                        // console.log(option_xAxis)
                    }
                     
                    // console.log(optionLegendData)
                    _this.initChart(optionLegendData, option_Series_Data, option_xAxis)
                },
                error: function () {
                    console.log(err)
                }
            });
        },
        //初始化图表
        initChart (optionLegendData, option_Series_Data, option_xAxis) {
            if (this.myCapacityChart == null) {
                this.myCapacityChart = echarts.init(document.getElementById('inverterCurveChart'));
            } else {
                this.myCapacityChart.clear();
            }
            this.setCapacityOption(optionLegendData, option_Series_Data, option_xAxis);
        },
        /*获取url中的查询字符串的值*/
        getSearchString (key) {
          var str = location.search
          str = str.substring(1,str.length)
          var arr = str.split("&")
          var obj = new Object()
          for(var i = 0; i < arr.length; i++) {
            var tmp_arr = arr[i].split("=")
            obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1])
          }
            return obj[key]
        },
        getParames () {
            this.stationId = this.getSearchString('stationId') //电站id
            this.inverterId = this.getSearchString('inverterId') //逆变器id
        }
    },
    watch: {
    },
    created:function () {
        this.initTime()
        this.getParames()
        this.getInverterData()
    },
    mounted: function () {
        this.datePicker()
    }
})
