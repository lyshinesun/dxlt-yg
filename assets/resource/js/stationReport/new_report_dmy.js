new Vue({
    el: '#report_dmy',
    data: {
        stationId: 'gs', //电站id
        fd_dev_id: '', // 设备id
        reportType: 'day',  //报表日期类型  day  month year
        stationAll: 'station',  //全站 'station'   单电站时为空
    },
    methods: {
        //初始化页面尺寸
        initPageSize: function () {
            var _this = this;
            $('.map_wap').height($(window).height());
            $('.tendency_ri').height($('.map_wap').height() - 80).width($(window).width() - 50);
            $('.report_tab_wrap').height($('.tendency_ri').height() - 80);
            $(window).resize(function () {
                $('.map_wap').height($(window).height());
                $('.tendency_ri').height($('.map_wap').height() - 80).width($(window).width() - 50);
                $('.report_tab_wrap').height($('.tendency_ri').height() - 80);

                // 表格重绘
                var type = $("#reporttype").val();
                if (!type) {
                    type = "";
                }
                if (type == "" || type.trim() == LANG.station_report_dailyreport) {
                    _this.reDisplayTable("#dailyreport", "#dailyreportbody");
                } else if (type.trim() == LANG.station_report_monthreport) {
                    _this.reDisplayTable("#monthreport", "#monthreportbody");
                } else if (type.trim() == LANG.station_report_yearreport) {
                    _this.reDisplayTable("#yearreport", "#yearreportbody");
                } else if (type.trim() == LANG.station_report_statisticalreport) {
                    _this.reDisplayTable("#yfdtj", "#yfdtjbody");
                }
            });

        },

        //绑定datepicker
        bindPicker: function () {
            var _this = this;
            if (this.reportType == 'day') {
                $("#dateInput").unbind().click(function () {
                    WdatePicker({
                        dateFmt: 'yyyy/MM/dd',
                        maxDate: '%y/%M/%d',
                        isShowClear: false,
                        readOnly: true,
                        onpicking: function (dp) {
                            $("#dateInput").val(dp.cal.getNewDateStr());
                        }
                    });
                });
            } else if (this.reportType == 'month') {
                $("#dateInput").unbind().click(function () {
                    WdatePicker({
                        dateFmt: 'yyyy/MM',
                        maxDate: '%y/%M',
                        isShowClear: false,
                        readOnly: true,
                        onpicking: function (dp) {
                            $("#dateInput").val(dp.cal.getNewDateStr());
                        }
                    });
                });
            } else if (this.reportType == 'year') {
                $("#dateInput").unbind().click(function () {
                    WdatePicker({
                        dateFmt: 'yyyy',
                        maxDate: '%y',
                        isShowClear: false,
                        readOnly: true,
                        onpicking: function (dp) {
                            $("#dateInput").val(dp.cal.getNewDateStr());
                        }
                    });
                });
            }
        },

        initTime: function () {
            this.reportType = window.location.search.substring(1).split('=')[1];
            $('#dateInput').val(vlm.Utils.getTrueDate(this.reportType)); //初始化时间
            this.bindPicker();  //bind picker
            this.getReport();
        },

        /**
         * 通过更改CSS,让表格表头产生悬停效果
         *
         * tableid  表格table id 带有#号前缀
         * tbodyid  表格tbody id 带有#号前缀
         */

        reDisplayTable: function (tableId, tbodyid) {
            var tableThSizeArray = [];
            // 保存初始表头单元格宽度
            $(tableId).find("thead").find("th").each(function (i) {
                var thWidth = $(this).width();
                tableThSizeArray.push(thWidth);
            });

            var tableWidth = $(tableId).width();
            var tableHeadWidth = $(tableId).find("thead").width();
            var thLength = $(tableId).find("th").length;
            var addLength = Math.floor((tableWidth - tableHeadWidth) / thLength);
            if (thLength == 0) {
                return;
            }
            var lastThlength = tableWidth - tableHeadWidth - addLength * (thLength - 1);
            // IE10下表格宽度不自适应调整
            if ($.browser.msie || $.browser.mozilla) {
                if ($.browser.version == 10 || $.browser.version == 11) {

                    $("#tableHead").find("th").each(function (i) {
                        if (i == thLength - 1) {
                            $(this).width(tableThSizeArray[i] + lastThlength);
                        } else if (i == 0) {
                            $(this).width(tableThSizeArray[i] + addLength + 1);
                        } else {
                            $(this).width(tableThSizeArray[i] + addLength);
                        }
                    });
                    $(tableId).find("thead").find("th").each(function (i) {
                        if (i == thLength - 1) {
                            $(this).width(tableThSizeArray[i] + lastThlength);
                        } else {
                            $(this).width(tableThSizeArray[i] + addLength);
                        }
                    });

                } else {
                    $("#tableHead").find("th").each(function (i) {
                        $(this).width(tableThSizeArray[i]);
                    });
                }
            } else {
                $("#tableHead").find("th").each(function (i) {
                    if (i == thLength - 1) {
                        $(this).width(tableThSizeArray[i] + lastThlength - 2);
                    } else if (i == 0) {
                        $(this).width(tableThSizeArray[i] + addLength + 1);
                    } else {
                        $(this).width(tableThSizeArray[i] + addLength);
                    }
                });
                $(tableId).find("thead").find("th").each(function (i) {
                    if (i == thLength - 1) {
                        $(this).width(tableThSizeArray[i] + lastThlength - 2);
                    } else {
                        $(this).width(tableThSizeArray[i] + addLength);
                    }
                });
            }

        },

        getInputDate: function () {
            var date = $("#dateInput").val();
            date = date.replace(/\//g, "");
            return date;
        },

        //获取报表数据
        getReport: function () {
            var headstr = '', _this = this, workingType = '';
            if (this.reportType == 'day') {
                workingType = '运行日报';
                headstr = '<tr>' +
                    '<th style="width: 72px;">序号</th>' +
                    '    <th style="width: 109px;">项目<span style="font-size:12px;">(MW)</span></th>' +
                    '<th style="width: 121px;">运维容量<span style="font-size:12px;">(MW)</span></th>' +
                    '<th style="width: 87px;">当日发电量<span style="font-size:12px;">(万kWh)</span></th>' +
                    '<th style="width: 113px;">当日发电小时数<span style="font-size:12px;">(h)</span></th>' +
                    '<th style="width: 63px;">当年累计发电量<span style="font-size:12px;">(万kWh)</span></th>' +
                    '<th style="width: 82px;">总累计发电量<span style="font-size:12px;">(万kWh)</span></th>' +
                    '<th style="width: 81px;">天气和限电情况</th>' +
                    '</tr>';
            } else if (this.reportType == 'month') {
                workingType = '运行月报';
                headstr = '<tr>' +
                    '<th style = "width: 50px;">序号</th>' +
                    '<th style="width: 150px;">电站</th>' +
                    '<th style = "width: 100px;">装机容量(MW)</th>' +
                    '<th style="width: 100px;">已并网容量(kWh)</th>' +
                    '<th style="width: 100px;">上网等效利用小时数(h)</th> ' +
                    '<th style = "width: 100px;">站端上网电量(万kWh)</th>' +
                    '<th style="width: 110px;">月站端上网电量(万kWh)</th> ' +
                    '<th style="width: 110px;">年站端上网电量(万kWh)</th> ' +
                    '<th style="width: 110px;">累计上网电量(万kWh)</th> ' +
                    '<th style="width: 80px;">限电电量(万kWh)</th> ' +
                    '<th style="width: 80px;">故障损失电量(万kWh)</th> ' +
                    '<th style="width: 110px;">检修损失电量(万kWh)</th> ' +
                    '<th style="width: 110px;">辐射日累计(MJ/㎡)</th> ' +
                    '<th style="width: 110px;">去年累计上网电量(万kWh)</th> ' +
                    '<th style="width: 110px;">备注</th> ' +
                    '</tr>';
            } else if (this.reportType == 'year') {
                workingType = '运行年报';
                headstr = '<tr>' +
                    '<th style="width: 140px;">东旭蓝天</th>' +
                    '<th style="width: 163px;">计划发电量(万kWh)</th>' +
                    '<th style="width: 182px;">理论发电量(万kWh)</th>' +
                    '<th style="width: 213px;">实际发电量(万kWh)</th>' +
                    '<th style="width: 202px;">与计划差值(万kWh)</th>' +
                    '<th style="width: 202px;">年负荷率(%)</th>' +
                    '<th style="width: 202px;">年计划完成率(%)</th>' +
                    '<th style="width: 202px;">环比增减(%)</th>' +
                    '</tr>';
            }

            $('#report_name').html('东旭蓝天光伏电站' + $('#dateInput').val() + workingType);

            $('#tableHead,#tableHead_copy').html(headstr);
            $("#dailyreportbody").html('');
            layer.load(0, 2);
            var startDateStr = '', endDateStr = '', timetype = 0;
            switch (this.reportType) {
                case 'day': //日
                    startDateStr = this.getInputDate() + '000000';
                    endDateStr = this.getInputDate() + '235959';
                    timetype = 4;
                    break;
                case 'month': //月
                    startDateStr = this.getInputDate() + '01000000';
                    var sel_year = this.getInputDate().substring(0, 4);
                    var sel_month = this.getInputDate().substring(4);
                    var c_sel_month = sel_month < 10 ? sel_month.substring(1) : sel_month;
                    var lastDay = vlm.Utils.getlastday(sel_year, c_sel_month);
                    endDateStr = sel_year + '' + sel_month + '' + lastDay + '235959';
                    timetype = 6;
                    break;
                case 'year':  //年
                    startDateStr = this.getInputDate() + '0101000000';
                    endDateStr = this.getInputDate() + '1231235959';
                    timetype = 7;
                    break;
                default :
                    ;
            }

            var Parameters = {
                "parameters": {
                    "stationtype": "allstation",
                    "timetype": timetype,
                    "sorttype": "1",
                    "sort": "1",
                    "starttime": startDateStr,
                    "endtime": endDateStr,
                    "topn": "10000",
                    "stationid": "all"
                },
                "foreEndType": 2,
                "code": "60000001"
            }
            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                console.log(res.data.fd_datas[0]);
                layer.closeAll();
                if (res.success) {

                    $('#report_rl').text('(装机功率:' + ' -- ' + ')');
                    var reportArr = res.data.fd_datas;
                    if (reportArr.length) {
                        if (_this.reportType == 'day') {
                            for (var i = 0; i < reportArr.length; i++) {
                                for (var name in reportArr[i]) {
                                    if (reportArr[i][name] !== null) {
                                        if (!isNaN(reportArr[i][name])) {
                                            reportArr[i][name] = reportArr[i][name].toFixed(2);
                                        }
                                    } else {
                                        reportArr[i][name] = '--';
                                    }
                                }
                            }
                        } else if (_this.reportType == 'month') {
                            for (var i = 0; i < reportArr.length; i++) {
                                for (var name in reportArr[i]) {
                                    if (reportArr[i][name] !== null) {
                                        if (!isNaN(reportArr[i][name])) {
                                            reportArr[i][name] = reportArr[i][name].toFixed(2);
                                        }
                                    } else {
                                        reportArr[i][name] = '--';
                                    }
                                }
                            }
                        } else if (_this.reportType == 'year') {
                            for (var i = 0; i < reportArr.length; i++) {
                                for (var name in reportArr[i]) {
                                    if (reportArr[i][name] !== null) {
                                        if (!isNaN(reportArr[i][name])) {
                                            reportArr[i][name] = reportArr[i][name].toFixed(2);
                                        }
                                    } else {
                                        reportArr[i][name] = '--';
                                    }
                                }
                            }
                        }
                        var reportStr = '';
                        if (_this.reportType == 'day') {
                            reportStr = $('#powerReport_tpl_day').html();
                        } else if (_this.reportType == 'month') {
                            reportStr = $('#powerReport_tpl_month').html();
                        } else if (_this.reportType == 'year') {
                            reportStr = $('#powerReport_tpl_year').html();
                        }
                        var trHtml = ejs.render(reportStr, {reportArr: reportArr});
                        $("#dailyreportbody").html(trHtml);

                        _this.reDisplayTable("#dailyreport", "#dailyreportbody")
                    }
                } else {
                    $('#report_rl').text('(装机功率: -- )');
                    parent.layer.open({
                        title: LANG["all_station_prompt"],
                        content: '数据有误'
                    });
                }
            })
        },

        //导出报表
        exportReportList: function () {
            switch (this.reportType) {
                case 'day': //日
                    startDateStr = this.getInputDate() + '000000';
                    endDateStr = this.getInputDate() + '235959';
                    timetype = 4;
                    break;
                case 'month': //月
                    startDateStr = this.getInputDate() + '01000000';
                    var sel_year = this.getInputDate().substring(0, 4);
                    var sel_month = this.getInputDate().substring(4);
                    var c_sel_month = sel_month < 10 ? sel_month.substring(1) : sel_month;
                    var lastDay = vlm.Utils.getlastday(sel_year, c_sel_month);
                    endDateStr = sel_year + '' + sel_month + '' + lastDay + '235959';
                    timetype = 3;
                    break;
                case 'year':  //年
                    startDateStr = this.getInputDate() + '0101000000';
                    endDateStr = this.getInputDate() + '1231235959';
                    timetype = 7;
                    break;
                default :
                    ;
            }
            var Parameters = {
                "parameters": {
                    "stationtype": "allstation",
                    "timetype": timetype,
                    "sorttype": "1",
                    "sort": "1",
                    "starttime": startDateStr,
                    "endtime": endDateStr,
                    "topn": "10000",
                    "stationid": "all"
                },
                "foreEndType": 2,
                "code": "60000101"
            }
            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                console.log(res);
                if(res.success){
                    window.location.href=res.data;
                }
            })

        },

        //加载页面
        loadPage: function () {
            this.initPageSize();   //初始化尺寸
            this.initTime();   //初始化input 时间
        }

    },
    mounted: function () {
        this.loadPage();   //加载页面
    }
});

