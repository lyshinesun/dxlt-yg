
    var vm = new Vue({
        el: '#pop_identify',
        data: {
            startPageFlag: true,
            curOtherPage: 1,
            sizePage: 10,
            chooseTotNum: 0, //总条数
            currentDate: "",
            myCurveChart: null,  //功率chart
            option: null,  //功率chart参数
        },
        methods: {
            getIdentify: function () {
                var _this = this;
                if ($('#iden_start').val() == "") {
                    parent.layer.open({
                        title: '提示',
                        content: '请选择开始日期'


                    });
                    return;
                }

                $('.no_result').hide();
                layer.load(0, 2);
                $.ajax({
                    url: vlm.serverAddr + "tbdatastatyc201707/list",	//请求地址
                    dataType: "json",
                    type: "GET",
                    data: {
                        // page: "",
                        // limit: "",
                        startTime: $('#iden_start').val(),
                        endTime: $('#iden_end').val(),
                        faultId: $('#faultId').val(),
                        vType: 0,
                        psid: $('#psCode').val()
                    },
                    success: function (result) {
                        layer.closeAll();
                        if (result.code == 0) {
                            if (result.page.length < 1) {
                                $('.no_result').show();
                            } else {
                                //故障曲线

                                var option_Series_Data = [] //曲线的信息
                                var option_xAxis = [] //x轴的日期值
                                var data = result.page
                                var option_title =  data[0].fdTagName
                                // console.log((data[0].list)[1])
                                for (var i = 0; i < data.length; i++) {
                                    option_xAxis.push(data[i].fdLogDate)
                                    option_Series_Data.push(data[i].fdAvgvalue)
                                }
                                _this.initChart(option_title,option_Series_Data, option_xAxis)
                            }

                        }
                    }
                });
            },
            setCurveOption (option_title,option_Series_Data, option_xAxis) {
                var _this = this
                 this.option = {
                   title: {
                        text: option_title + "号逆变器发电量",
                        left: 'center',
                        textStyle: {
                            color: "#666",
                            fontSize: 16
                        }


                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    /*symbolList: ['circle', 'rectangle', 'triangle', 'diamond',
                     'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond'],*/
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
                    series: [{
                        name: "电流",
                        data: option_Series_Data,
                        type:"line"
                    }]
                };
                this.myCurveChart.setOption(this.option);
                window.onresize = function () {
                    _this.myCurveChart.resize();
                }
            },
             //初始化图表
            initChart (option_title,option_Series_Data, option_xAxis) {
                // console.log(option_Series_Data, option_xAxis)
                if (this.myCurveChart == null) {
                    this.myCurveChart = echarts.init(document.getElementById('myCurveChart'));

                } else {
                    this.myCurveChart.clear();
                }
                this.setCurveOption(option_title,option_Series_Data, option_xAxis);
            },
            initTime: function () {
                var _this = this;
                var now = new Date();
                var min = now.getMinutes() >= 10 ? now.getMinutes() : ("0" + now.getMinutes());
                var mon = (now.getMonth() + 1) >= 10 ? (now.getMonth()  + 1) : ("0" + (now.getMonth() + 1));
                var date = now.getDate() >= 10 ? now.getDate() : ("0" + now.getDate());
                var hour = now.getHours() >= 10 ? now.getHours() : ("0" + now.getHours());
                _this.currentDate = now.getFullYear() + "-" + mon + "-" + date + " " + "00" + ":" + "00" + ":"+ "00" ;
                console.log(_this.currentDate)
                $("#iden_start").val(_this.currentDate);
            },
            setDatePicker: function () {
                $("#iden_start, #iden_end").click(function () {
                    WdatePicker({
                        dateFmt: 'yyyy-MM-dd HH:mm:ss',
                        maxDate: '%y/%M/%d',
                        isShowClear: false,
                        readOnly: true,
                        onpicking: function (dp) {
                            console.log(dp.cal.getDateStr(), dp.cal.getNewDateStr())
                            //_this.dateChanged(dp.cal.getDateStr(), dp.cal.getNewDateStr());
                        }
                    });
                });
            }
        },
        mounted: function () {
            var _this = this
            this.initTime()
            setTimeout(function () {
                _this.getIdentify()
            },1000)
            // this.getIdentify()
            this.setDatePicker ()
        }
    });


    function doChangePage() {
        $('#pageId').val($("#pageNum option:selected").val())
        vm.sizePage = $("#pageNum option:selected").val();
        vm.curOtherPage = 1;
        vm.getIdentify();
    }