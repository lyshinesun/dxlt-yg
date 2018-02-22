var vm = new Vue({
    el: '#reportList',
    data: {
        stationId: '', //电站id
        startDateStr: '',  //查询开始时间

        startPageFlag: true,
        curOtherPage: 1,
        sizePage: 10,
        chooseTotNum: 0, //总条数

        newStationList: [], // 最终的电站列表

        stationName: '', //电站名称
        stationCode: '', //电站gs
        alarmLevel: 0, //故障级别
        faultCode: '', //故障代码
        fdDesc: '', //故障信息、故障、类型
        faultId: '', //故障Id
        matrix: '', //方阵
        inverterNum: '', //逆变器编号
    },
    methods: {
        //初始化页面尺寸
        initPageSize: function () {
            $('.tendency_ri ').css('height', $(window).height() - 80);
            $('.map_con_fl').height($(window).height() - 80);
            $('.task_bot_table_wrap').css('maxHeight', $(window).height() - 250);

            $(window).resize(function () {
                $('.tendency_ri ').css('height', $(window).height() - 80);
                $('.map_con_fl').height($(window).height() - 80);
                $('.task_bot_table_wrap').css('maxHeight', $(window).height() - 250);
            });

        },

        /*获取电站列表*/
        getAllStation: function (res) {
            var _this = this
            _this.newStationList = res.list
            _this.stationId = _this.newStationList[0].fdStationCode.toLowerCase()
            var stationList_tpl = $('#stationList').html();
            var stationStr = ejs.render(stationList_tpl, {newStationList: _this.newStationList});
            $('#powerList').html(stationStr);
            $('#powerList li').click(function () {
                $(this).addClass('on').siblings().removeClass('on');
                _this.stationId = $(this).attr('id');
                _this.getFaultList();
            });
            _this.initTime()
            _this.getFaultList();
            this.loadPage();//加载页面
        },

        //绑定datepicker
        bindPicker: function () {
            var _this = this;
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
        },

        initTime: function () {
            $('#dateInput').val(vlm.Utils.getTrueDate()); //初始化时间
            this.startDateStr = $('#dateInput').val();  //时间赋值给全局
            this.bindPicker();  //bind picker
        },

        //获取报表数据
        getFaultList: function () {
            var _this = this;
            this.startDateStr = this.startDateStr.replace(/\//g, "-");  //请求开始时间
            this.urlType = 'tbfaultdata/list'; //配置suburl

            $('#report_name').text($('#powerList .on >a').text() + ' 故障报表');  //列表名称
            $("#dailyreportbody").html('');

            layer.load(0, 2);
            $.ajax({
                url: vlm.serverAddr + this.urlType,
                type: "POST",
                dataType: "json",
                data: {
                    "limit": this.sizePage,					//页数量
                    "page": this.curOtherPage,
                    "fdStartDate": this.startDateStr, //日期
                    "psid": this.stationId			  //电站id
                    //"psid": 'gs'		  //电站id
                },
                success: function (res) {
                    layer.closeAll();
                    if (res.code == 0) {
                        var faultArr = res.page.list;
                        if (faultArr && faultArr.length) {
                            var reportStr = $('#stationDefault_tpl').html();

                            var trHtml = ejs.render(reportStr, {faultArr: faultArr});
                            $("#dailyreportbody").html(trHtml);

                            _this.chooseTotNum = res.page.totalCount;
                            _this.startPageFlag = false;

                            if (_this.curOtherPage > 1 && _this.chooseTotNum <= (_this.curOtherPage - 1) * _this.sizePage) {//总数小于页数*当前页码，页码自动减一
                                _this.curOtherPage = _this.curOtherPage - 1;
                            }
                            _this.pageList();

                            //table表头固定js调用
                            $(".task_sub_wrap").tabheader({
                                table_header: 'task_head_wrap',
                                table_parent: 'task_sub_wrap',
                                table_height: 'task_bot_table_wrap',
                                table_parent_height: 'task_sub_wrap',
                            });


                            $('.turnOrder').click(function () {
                                if ($(this).siblings('#fdOrderState').val() != 0) {
                                    parent.layer.open({
                                        title: '提示',
                                        content: '已产生告警，无法转工单'
                                    });
                                    return;
                                }
                                _this.stationCode = $(this).siblings('#psCode').val(), //电站gs
                                    _this.stationName = $(this).siblings('#psName').val(), //电站名称
                                    _this.alarmLevel = $(this).siblings('#alarmLevel').val(), //故障级别
                                    _this.faultCode = $(this).siblings('#faultCode').val(), //故障代码
                                    _this.fdDesc = $(this).siblings('#fdDesc').val(), //故障信息、故障类型
                                    _this.faultId = $(this).siblings('#faultId').val(), //故障Id
                                    _this.matrix = $(this).siblings('#matrix').val(), //故障Id
                                    _this.inverterNum = $(this).siblings('#inverterNum').val(), //逆变器编号

                                    parent.layer.open({
                                        type: 2,
                                        title: '新建工单',
                                        shadeClose: false,
                                        shade: 0.5,
                                        maxmin: true, //开启最大化最小化按钮
                                        area: ['800px', '620px'],
                                        content: ['popUp/new_workorder/pop_task.html'],
                                        success: function (layero, index) {
                                            var iframeO = layero.find("iframe")[0].contentWindow.document;
                                            $("#work_team_wrap input, #work_code,#work_editor, #supervisor_choose", iframeO).attr('disabled', 'disabled').addClass('work_dis');

                                            $("#supervisor_choose", iframeO).html('<option></option>');

                                            $("#station_choose", iframeO).html('<option value="' + _this.stationCode + '">' + _this.stationName + '</option>').attr('disabled');

                                            $("#fdFaultcode", iframeO).val(_this.faultCode); //故障代码
                                            $("#fdFaultinfo", iframeO).val(_this.stationCode + '_' + _this.matrix + '_' + _this.inverterNum); //故障信息


                                            $("#fdFaultlevel", iframeO).val(_this.alarmLevel); //故障级别

                                            $("#fdFaulttype", iframeO).val(_this.fdDesc); //故障类型
                                            $("#faultId", iframeO).val(_this.faultId); //故障id

                                            $("#task_form", iframeO).validate(); //表单验证

                                            $("#submit", iframeO).click(function () {
                                                if ($("#task_form", iframeO).valid()) {

                                                    parent.layer.load(0, 2);
                                                    $.ajax({
                                                        url: vlm.serverAddr + "tbnworkorder/saveOrUpdate",	//请求地址
                                                        dataType: "json",
                                                        type: "POST",
                                                        data: {
                                                            "fdFaultid": $('#faultId', iframeO).val(),//故障 id
                                                            "fdFaultcode": $('#fdFaultcode', iframeO).val(),//故障代码
                                                            "fdFaultinfo": $('#fdFaultinfo', iframeO).val(),//故障信息
                                                            "fdFaultlevel": $('#fdFaultlevel', iframeO).val(),//故障级别
                                                            "fdFaulttype": $('#fdFaulttype', iframeO).val(),//故障类型
                                                            "fdWstartDatetime": $('#fdWstartDatetime', iframeO).val(),//计划开始时间
                                                            "fdWendDatetime": $('#fdWendDatetime', iframeO).val(),//计划结束时间
                                                            "psid": $('#station_choose option:selected', iframeO).val(), //电站id
                                                            "fdWorkTask": $('#task_msg', iframeO).val(), //任务信息
                                                            "typeM": "0",//操作类型0新增1修改
                                                            "fdId": "",//修改需传工单id
                                                        },
                                                        traditional: true,//这里设置为true
                                                        success: function (res) {
                                                            parent.layer.closeAll('loading');
                                                            console.log(res);
                                                            if (res.code == 0) {
                                                                parent.layer.open({
                                                                    title: '提示',
                                                                    content: '新建工单成功',
                                                                    yes: function () {
                                                                        parent.layer.closeAll();
                                                                        location.reload();
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    });
                                                    return false; //阻止form 提交

                                                }
                                            });
                                        }
                                    });
                            });

                            $('.identify').click(function () {
                                var psCode = $(this).parent().find('#psCode').val();
                                var faultId = $(this).parent().find('#faultId').val();
                                parent.layer.open({
                                    type: 2,
                                    title: '故障验证',
                                    shadeClose: false,
                                    shade: 0.5,
                                    maxmin: true, //开启最大化最小化按钮
                                    area: ['1000px', '620px'],
                                    content: ['popUp/new_workorder/pop_identify.html'],
                                    success: function (layero, index) {
                                        var iframeO = layero.find("iframe")[0].contentWindow.document;
                                        $('#psCode', iframeO).val(psCode);
                                        $('#faultId', iframeO).val(faultId);
                                        $('#iden_start', iframeO).val(_this.startDateStr);
                                    }
                                });
                            });

                        }
                    } else {
                        parent.layer.open({
                            title: LANG["all_station_prompt"],
                            content: '数据有误',
                            yes: function () {
                                parent.layer.closeAll();
                                parent.layer.closeAll('loading');
                            }
                        });
                        
                    }
                },
                error: function () {
                    parent.layer.open({
                        title: LANG["all_station_prompt"],
                        content: '数据有误',
                        yes: function () {
                            parent.layer.closeAll();
                            layer.closeAll('loading');
                        }
                    });
                }
            });
        },

        //创建分页
        pageList: function () {
            var _this = this;
            this.sizePage = $('#pageId').val();
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
                page_message: formatString(LANG["common_pagemessage"], paramArray, _this.sizePage)

            });

            function pageselectCallback(page_index) {

                _this.curOtherPage = page_index + 1;
                if (_this.startPageFlag) { //不是点击分页按钮的时候不调用search方法
                    $("#pageChange").val(_this.curOtherPage);
                    _this.getFaultList();
                }
                _this.startPageFlag = true;
            }

            $("#pageChange").val(_this.curOtherPage);
            $('#goPage').click(function () {
                _this.curOtherPage = $("#pageChange").val();
                _this.getFaultList();
            });

        },

        //导出故障列表
        exportFaultList: function () {
            this.startDateStr = this.startDateStr.replace(/\//g, "-");
            this.endDateStr = this.startDateStr.replace(/\//g, "-");
            var addStr = 'psid=' + this.stationId + '&fdStartDate=' + this.startDateStr + '&fdEndDate=' + this.endDateStr;
            window.location.href = vlm.serverAddr + 'tbfaultdata/export?' + addStr;
        },

        //加载页面
        loadPage: function () {
            this.initPageSize();   //初始化尺寸
            /*this.initTime();*/   //初始化input 时间
        }

    },
    mounted: function () {
        vlm.getConnectedStations(this.getAllStation)
    }
});

/*function doChangePage() {
    $('#pageId').val($("#pageNum option:selected").val())
    vm.sizePage = $("#pageNum option:selected").val();
    vm.curOtherPage = 1;
    vm.getFaultList();
}*/
