new Vue({
    el: '#reportList',
    data: {
        stationList:[],
        stationId: '', //电站id
        fd_dev_id: '', // 设备id
        reportType: 'day',  //报表日期类型  day  month year
        startDateStr: '',  //查询开始时间
        stationAll: 'station',  //全站 'station'   单电站时为空
        urlType: '', //day month year 请求分地址
        devCounter: 0 //每个电站中设备的数量
    },
    methods: {
        //初始化页面尺寸
        initPageSize: function () {
            var _this = this;
            $('.map_wap').height($(window).height());
            $('.map_con_fl').height($('.map_wap').height() - 80);
            $('.tendency_ri').height($('.map_wap').height() - 80).width($(window).width() - 240);
            $('.report_tab_wrap').height($('.tendency_ri').height() - 80);
            $(window).resize(function () {
                $('.map_wap').height($(window).height());
                $('.map_con_fl').height($('#map_wap_div').height() - 80);
                $('.tendency_ri').height($('.map_wap').height() - 80).width($(window).width() - 240);
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

        getStations: function (res) {
            var _this = this
            _this.stationList = res.list
            _this.stationId = _this.stationList[0].fdStationCode
            _this.loadPage();   //加载页面 
        },

        //更换左侧列表电站
        changeStation: function (e) {
            var target = null;
            if ($(e.target)[0].tagName == 'A') {
                target = $(e.target).parent();
            } else if ($(e.target)[0].tagName == 'LI') {
                target = $(e.target);
            } else {
                return;
            }
            $(target).find('a').removeClass('curSelectedNode');
            if (!target.hasClass('on')) {
                target.addClass('on').siblings().removeClass('on');
                this.stationId = target.attr('id');
                $('.ztree').remove(); //清空ztree
                this.showTree();
            }
            this.stationAll = 'station';
            this.getReport();
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
                            _this.startDateStr = $('#dateInput').val();  //时间赋值给全局
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
                            _this.startDateStr = $('#dateInput').val();  //时间赋值给全局
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
                            _this.startDateStr = $('#dateInput').val();  //时间赋值给全局
                        }
                    });
                });
            }
        },

        //获取tree数据
        showTree: function () {
            var _this = this;
            $.ajax({
                url: vlm.serverAddr + "tbdevrelation/reportTree",
                type: "POST",
                dataType: "json",
                data: {
                    "psid": this.stationId,			//电站id
                    "parentId": "GRID"		//父id，电站下集电线可以写死
                },
                success: function (res) {
                    if (res.code == 0) {
                        var newNodes = res.list;
                        _this.devCounter = newNodes.length
                        var powerhtml = $('#powerTpl0').html();
                        var powerLi = ejs.render(powerhtml, {newNodes: newNodes});
                        var oUl = $('<ul class="ztree"></ul>');
                        oUl.html(powerLi);
                        oUl.appendTo($('#' + _this.stationId));

                        $('.ztree li').click(function (e) {
                            e.stopPropagation();
                            $(this).siblings().find('a').removeClass('curSelectedNode');
                            $(this).find('a').addClass('curSelectedNode');
                            _this.stationAll = '';  //查询的是dev
                            _this.fd_dev_id = $(this).attr('id');
                            _this.getReport();
                        });
                    }

                }
            });

        },

        initTime: function () {
            this.reportType = window.location.search.substring(1).split('=')[1];
            $('#dateInput').val(vlm.Utils.getTrueDate(this.reportType)); //初始化时间
            this.startDateStr = $('#dateInput').val();  //时间赋值给全局
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
            //  设置表格单元格宽度
            //	$("#tableHead").find("th").each(function(i){
            //	$(this).width(tableThSizeArray[i]);
            //	});
        },

        //获取报表数据
        getReport: function () {
            var headstr = '', _this = this, workingType='';
            this.startDateStr = this.startDateStr.replace(/\//g, "-");  //请求开始时间
            if (this.reportType == 'day') {
                this.urlType = 'tbdevpowerstat/queryDayReport'; //配置suburl
                workingType = '运行日报';
                headstr = '<tr>' +
                    '<th style="width: 72px;">时间</th>' +
                    '    <th style="width: 109px;">直流功率<span style="font-size:12px;">(kW)</span></th>' +
                    '<th style="width: 121px;">当日累计发电量<span style="font-size:12px;">(kWh)</span></th>' +
                    '<th style="width: 87px;">当前累计发电量<span style="font-size:12px;">kWh</span></th>' +
                    '<th style="width: 113px;">瞬时辐照<span style="font-size:12px;">(w/㎡)</span></th>' +
                    '<th style="width: 63px;">交流功率<span style="font-size:12px;">kW</span></th>' +
                    '<th style="width: 82px;">Uab<span style="font-size:12px;">(V)</span></th>' +
                    '<th style="width: 81px;">Ubc<span style="font-size:12px;">(V)</span></th>' +
                    '<th style="width: 80px;">Uca<span style="font-size:12px;">(V)</span></th>' +
                    '<th style="width: 69px;">Ia<span style="font-size:12px;">(A)</span></th>' +
                    '<th style="width: 70px;">Ib<span style="font-size:12px;">(A)</span></th>' +
                    '<th style="width: 68px;">Ic<span style="font-size:12px;">(A)</span></th>' +
                    '<th style="width: 117px;">当前累计辐照<span style="font-size:12px;">(w/㎡)</span></th>' +
                    '<th style="width: 125px;">小时发电<span style="font-size:12px;">(kWh)</span></th>' +
                    '<th style="width: 125px;">有功功率<span style="font-size:12px;">(kW)</span></th>' +
                    '<th style="width: 87px;">功率因数</th>' +
                    '    <th style="width: 96px;">频率<span style="font-size:12px;">(HZ)</span></th>' +
                    '</tr>';
            } else if (this.reportType == 'month') {
                this.urlType = 'tbdevpowerstatday/queryMonthReport';  //配置suburl
                workingType='运行月报';
                headstr = '<tr>' +
                    '<th style = "width: 147px;"> 日期 </th>' +
                    '<th style="width: 173px;">直流功率(kW)</th>' +
                    '<th style = "width: 192px;">当日累积发电量(kWh)</th>' +
                    '<th style="width: 223px;">当前累积发电量(kWh)</th>' +
                    '<th style="width: 188px;">PR1(%)</th> ' +
                    '<th style = "width: 208px;">PR2(%)</th>' +
                    '<th style="width: 212px;">交流功率(kW)</th> ' +
                    '<th style = "width: 231px;">当前累积辐照(w/㎡)</th>' +
                    '</tr>';
            } else if (this.reportType == 'year') {
                this.urlType = 'tbdevpowerstatday/queryYearReport';  //配置suburl
                workingType='运行年报';
                headstr = '<tr>' +
                    '<th style="width: 140px;">日期</th>' +
                    '<th style="width: 163px;">直流功率(kW)</th>' +
                    '<th style="width: 182px;">当月累计发电量(kWh)</th>' +
                    '<th style="width: 213px;">累计发电量</th>' +
                    '<th style="width: 202px;">PR1(%)</th>' +
                    '<th style="width: 225px;">PR2(%)</th>' +
                    '<th style="width: 222px;">交流功率(kW)</th>' +
                    '<th style="width: 227px;">当前累积辐照(w/㎡)</th>' +
                    '</tr>';
            }

            if(this.stationAll){
                $('#report_name').text($('.treeDemoId .on >a').text()+' '+workingType);
            }else{
                $('#report_name').text($('.treeDemoId .on >a').text()+' '+$('.curSelectedNode >span').text()+' '+workingType);
            }

            $('#tableHead,#tableHead_copy').html(headstr);
            $("#dailyreportbody").html('');
            layer.load(0, 2);

            $.ajax({
                url: vlm.serverAddr + this.urlType,
                type: "POST",
                dataType: "json",
                data: {
                    "fdLogDate": this.startDateStr, //日期
                    "devid": this.fd_dev_id,		  //devid
                    "psid": this.stationId,			  //电站id
                    "type": this.stationAll		  //station为电站查的是总的，否则就是查devid的，可以为空
                },
                success: function (res) {

                    layer.closeAll();
                    if (res.code == 0) {
                        $('#report_rl').text('(装机功率:'+res.capa+')');
                        var reportArr = res.list;
                        if (reportArr.length) {
                            if (_this.reportType == 'day') {
                                for (var i = 0; i < reportArr.length; i++) {
                                    reportArr[i].newTime = reportArr[i].dataTime.split(' ')[1] + ':00';
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
                                    reportArr[i].newTime = reportArr[i].fdLogDate.substring(5,10);
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
                                    reportArr[i].newTime = reportArr[i].dataTime;
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
                            var trHtml = ejs.render(reportStr, {reportArr: reportArr, type: _this.stationAll, counter: _this.devCounter});
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
                }
            });
        },

        //导出报表
        exportReportList: function () {

            this.startDateStr=this.startDateStr.replace(/\//g, "-");
            var addStr='fdLogDate='+this.startDateStr+'&devid='+this.fd_dev_id+'&psid='+this.stationId+'&type='+this.stationAll+'&titleStr='+$('#report_name').html();
            if (this.reportType == 'day') {
                window.location.href = vlm.serverAddr + 'tbdevpowerstat/export?'+addStr;
            } else if (this.reportType == 'month') {
                window.location.href = vlm.serverAddr + 'tbdevpowerstatday/exportMonth?'+addStr;
            } else if (this.reportType == 'year') {
                window.location.href = vlm.serverAddr + 'tbdevpowerstatday/exportYear?'+addStr;
            }
        },

        //加载页面
        loadPage: function () {
            this.initPageSize();   //初始化尺寸
            this.initTime();   //初始化input 时间
            this.showTree();   //左侧tree
        }

    },
    mounted: function () {
        
        vlm.getConnectedStations(this.getStations)
    }
});