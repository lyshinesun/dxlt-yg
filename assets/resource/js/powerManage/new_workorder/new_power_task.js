var vm = new Vue({
    el: '#new_task',
    data: {
        stationId: 'gs', //电站id
        serverAddr: "http://192.168.2.214:8011/dxsky/",

        psList: [],
        userName: '',  //用户名

        //分页
        startPageFlag: true,
        curOtherPage: 1,
        sizePage: 10,
        chooseTotNum: 0, //总条数

        //电站列表
        station_list: [],
        //用户列表
        user_list: []

    },
    methods: {

        initPageSize: function () {
            $('.tendency_ri').height($(window).height() - 40).width($(window).width() - 50);
            $('.task_bot_table_wrap').css('maxHeight', $(window).height() - 210);
            $(window).resize(function () {
                $('.tendency_ri').height($(window).height() - 40).width($(window).width() - 50);
                $('.task_bot_table_wrap').css('maxHeight', $(window).height() - 210);
            });

        },

        //获取工单权限
        get_authority: function () {
            var _this = this;
            $.ajax({
                url: this.serverAddr + "tbnworkorder/pri",	//请求地址
                dataType: "json",
                type: "POST",
                success: function (res) {
                    if (res.pri == 'N') {
                        alert('你是无权用户');
                        return;
                    } else if (res.pri == 'Y') {
                        _this.getStationArr();

                        if (res.button == 'O') {
                            $('.order_hq').show();
                        }
                        if (res.button == 'T') {
                            $('.order_station').show();
                        }
                    }
                }
            });

        },


        //缓存电站列表
        getStationArr: function () {
            var _this = this;
            $.ajax({
                type: "get",
                url: vlm.serverAddr + "sys/user/info/" + $.cookie('userId'),
                data: "",
                traditional: true,
                dataType: "json",
                success: function (res) {
                    if (res.code == 0) {

                        if (res.user.psList.length > 0) {
                            _this.psList = res.user.psList;
                            _this.getTaskList();
                        }

                    }
                }

            });
        },


        //获取工单列表
        getTaskList: function () {
            var _this = this;
            var listData = {
                limit: this.sizePage, //页数量
                page: this.curOtherPage,
            }

            if(this.psList.length>0 && this.psList[0] == 'all'){

            }else{
                listData.psid = this.psList; //任务列表id,根据权限返回的有就传，没有不传
            }


            $.ajax({
                url: this.serverAddr + "tbnworkorder/query",	//请求地址
                dataType: "json",
                type: "POST",
                data: listData,
                traditional: true,//这里设置为true
                success: function (res) {
                    if (res.code == 0) {
                        var tasklist = res.page.list;
                        var taskStr = $('#task_tpl').html();
                        var taskHtml = ejs.render(taskStr, {tasklist: tasklist});
                        $("#dailyreportbody").html(taskHtml);

                        _this.chooseTotNum = res.page.totalCount;
                        _this.startPageFlag = false;

                        if (_this.curOtherPage > 1 && _this.chooseTotNum <= (_this.curOtherPage - 1) * _this.sizePage) {//总数小于页数*当前页码，页码自动减一
                            _this.curOtherPage = _this.curOtherPage - 1;
                        }
                        _this.pageList();

                        $('#dailyreportbody tr').click(function () {

                            $(this).find('input[name="fdId"]').prop('checked', true);
                        });

                        //table表头固定js调用
                        $(".task_sub_wrap").tabheader({
                            table_header: 'task_head_wrap',
                            table_parent: 'task_sub_wrap',
                            table_height: 'task_bot_table_wrap',
                            table_parent_height: 'task_sub_wrap',
                        });
                    }
                }
            });

        },

        //获取电站列表
        getAllStation: function () {
            var _this = this;
            var Parameters = {
                "parameters": {"stationid": "", "statusstr": ""},
                "foreEndType": 2,
                "code": "20000006"
            };
            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                if (res.success) {
                    var stationRes = res.data,
                        newStationList = [];

                    $.each(stationRes, function (key, value) {
                        if (value.fd_station_status == 2) {
                            newStationList.push(value)
                        }
                    });

                    _this.station_list = newStationList;
                }

            });
        },

        //获取工作负责人列表
        getResUser: function () {
            var _this = this;
            $.ajax({
                url: this.serverAddr + "sys/user/wuserList",	//请求地址
                dataType: "json",
                type: "GET",
                success: function (res) {
                    console.log(res);
                    if (res.code == 0) {
                        _this.user_list = res.list;
                    }
                }
            });
        },


        //弹窗
        popTask: function (e) {

            var _this = this,
                obj = $(e.target),
                title = obj.text();
            var task_tar = $('#dailyreportbody input[name="fdId"]:checked');
            if (obj.attr('id') == 'create_order') { //新建工单
                _this.getAllStation();
                parent.layer.open({
                    type: 2,
                    title: title,
                    shadeClose: false,
                    shade: 0.5,
                    maxmin: true, //开启最大化最小化按钮
                    area: ['800px', '620px'],
                    content: ['popUp/new_workorder/pop_task.html'],
                    success: function (layero, index) {
                        var iframeO = layero.find("iframe")[0].contentWindow.document;
                        $("#work_team_wrap input, #work_code, #supervisor_choose", iframeO).attr('disabled', 'disabled').addClass('work_dis');
                        $("#work_editor", iframeO).val(_this.userName).addClass('work_dis');


                        var str = '<option value="">请选择电站</option>';
                        _this.station_list.forEach(function (val, index) {
                            str += '<option value="' + val.fd_station_code + '">' + val.fd_station_name + '</option>';
                        });

                        $("#station_choose", iframeO).html(str);


                        $("#task_form").validate(); //表单验证

                        $("#submit", iframeO).click(function () {
                            if ($("#task_form", iframeO).valid()) {

                                parent.layer.load(0, 2);
                                $.ajax({
                                    url: _this.serverAddr + "tbnworkorder/saveOrUpdate",	//请求地址
                                    dataType: "json",
                                    type: "POST",
                                    data: {
                                        "fdFaultid": "",//故障 id
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
            } else {
                if (task_tar.length <= 0) {
                    parent.layer.open({
                        title: '提示',
                        content: '您未选中工单'
                    });
                    return;
                }

                var fdId = task_tar.parent().find('input[type="hidden"]').val(),
                    fdstatus = task_tar.parents('tr').find('.task_status').attr('data-status');
                if (obj.attr('id') == 'order_down') { //工单下发
                    if (fdstatus < 1) {
                        $.ajax({
                            url: this.serverAddr + "tbnworkorder/workDown",	//请求地址
                            dataType: "json",
                            type: "POST",
                            data: {
                                fdId: fdId//工单id
                            },
                            success: function (res) {
                                if (res.code == 0) {
                                    parent.layer.open({
                                        title: '提示',
                                        content: '工单下发成功',
                                        yes: function () {
                                            location.reload();
                                            parent.layer.closeAll();
                                        }
                                    });

                                } else {
                                    parent.layer.open({
                                        title: '提示',
                                        content: '工单下发失败'
                                    });
                                }
                            }
                        });
                    } else {
                        parent.layer.open({
                            title: '提示',
                            content: '该工单不能重复下发'
                        });
                    }

                } else if (obj.attr('id') == 'order_end') {

                    if (fdstatus == 4) { //已结束
                        $.ajax({
                            url: this.serverAddr + "tbnworkorder/workFina",	//请求地址
                            dataType: "json",
                            type: "POST",
                            data: {
                                fdId: fdId,//工单id
                                statu: "5"//终结状态吗
                            },
                            success: function (res) {
                                if (res.code == 0) {
                                    parent.layer.open({
                                        title: '提示',
                                        content: '工单终结成功',
                                        yes: function () {
                                            location.reload();
                                            parent.layer.closeAll();
                                        }
                                    });

                                } else {
                                    parent.layer.open({
                                        title: '提示',
                                        content: '工单终结失败'
                                    });
                                }
                            }
                        });
                    } else if (fdstatus >= 5) {
                        parent.layer.open({
                            title: '提示',
                            content: '该工单已终结，不能重复操作'
                        });
                    } else {
                        parent.layer.open({
                            title: '提示',
                            content: '该工单未结束'
                        });
                    }
                } else if (obj.attr('id') == 'order_detail') {  //工单详情
                    $.ajax({
                        url: this.serverAddr + "tbnworkorder/info/" + fdId,	//fdId是请求参数，工单id
                        dataType: "json",
                        type: "POST",
                        success: function (res) {
                            if (res.code == 0) {
                                parent.layer.open({
                                    type: 2,
                                    title: title,
                                    shadeClose: false,
                                    shade: 0.5,
                                    maxmin: true, //开启最大化最小化按钮
                                    area: ['800px', '620px'],
                                    content: ['popUp/new_workorder/pop_task.html'],
                                    success: function (layero, index) {
                                        var iframeO = layero.find("iframe")[0].contentWindow.document
                                        $("#submit_reset_btn", iframeO).hide(); //隐藏提交和reset按钮
                                        $('#station_choose', iframeO).html('<option value="">' + res.tbNworkorder.fdPsid + '</option>').attr('disabled', 'disabled');//电站id
                                        $('#work_code', iframeO).val(res.tbNworkorder.fdOrdernum).attr('disabled', 'disabled'); //工单编号
                                        $('#supervisor_choose', iframeO).html('<option value="">' + res.tbNworkorder.fdUser + '</option>').attr('disabled', 'disabled'); //工作负责人
                                        $('#work_team_per', iframeO).attr('disabled', 'disabled'); //工作班组人员
                                        $('#fdWstartDatetime', iframeO).val(res.tbNworkorder.fdWstartDatetime).attr('disabled', 'disabled'); //计划开始时间
                                        $('#fdWendDatetime', iframeO).val(res.tbNworkorder.fdWendDatetime).attr('disabled', 'disabled'); //计划结束时间
                                        $("#work_editor", iframeO).val(_this.userName).attr('disabled', 'disabled'); //工单编制人

                                        $("#fdFaultcode", iframeO).val(res.tbNworkorder.fdFaultcode).attr('disabled', 'disabled');  //故障代码
                                        $("#fdFaultinfo", iframeO).val(res.tbNworkorder.fdFaultinfo).attr('disabled', 'disabled');  //故障信息
                                        $("#fdFaultlevel", iframeO).val(res.tbNworkorder.fdFaultlevel).attr('disabled', 'disabled');   //故障级别
                                        $("#fdFaulttype", iframeO).val(res.tbNworkorder.fdFaulttype).attr('disabled', 'disabled');   //故障类型
                                        $("#task_msg", iframeO).val(res.tbNworkorder.fdWorkTask).attr('disabled', 'disabled');   //任务信息

                                        //工作完成情况
                                        if (res.tbNworkorder.taskList) {
                                            var fd_obj = res.tbNworkorder.taskList;
                                            for (var i = 0; i < fd_obj.length; i++) {
                                                var trObj = $('<tr></tr>')
                                                trObj.html('<td class="task_num">' + fd_obj[i].fdTaksNum + '</td>' +
                                                    '<td><input class="task_inp task_name" type="text" value="' + fd_obj[i].fdTaskName + '"></td>' +
                                                    '<td><input class="task_inp task_mark" type="text" value="' + fd_obj[i].fdTaskInfo + '" ></td>');
                                                trObj.appendTo($('#fill_tbody', iframeO));
                                            }

                                            $('#fill_tbody input').attr('disabled', 'true');

                                        }

                                    }
                                });
                            }
                        }
                    });

                } else if (obj.attr('id') == 'order_modify') { //工单修改
                    if (fdstatus == 0) {
                        _this.getAllStation();
                        $.ajax({
                            url: this.serverAddr + "tbnworkorder/info/" + fdId,	//fdId是请求参数，工单id
                            dataType: "json",
                            type: "POST",
                            success: function (res) {
                                if (res.code == 0) {
                                    parent.layer.open({
                                        type: 2,
                                        title: title,
                                        shadeClose: false,
                                        shade: 0.5,
                                        maxmin: true, //开启最大化最小化按钮
                                        area: ['800px', '620px'],
                                        content: ['popUp/new_workorder/pop_task.html'],
                                        success: function (layero, index) {
                                            var iframeO = layero.find("iframe")[0].contentWindow.document
                                            $('#work_code', iframeO).val(res.tbNworkorder.fdOrdernum).attr('disabled', 'disabled').addClass('work_dis'); //工单编号
                                            $('#supervisor_choose', iframeO).html('<option value="">' + res.tbNworkorder.fdUser + '</option>').attr('disabled', 'disabled').addClass('work_dis'); //工作负责人
                                            $('#work_team_per', iframeO).attr('disabled', 'disabled').addClass('work_dis'); //工作班组人员
                                            $('#fdWstartDatetime', iframeO).val(res.tbNworkorder.fdWstartDatetime); //计划开始时间
                                            $('#fdWendDatetime', iframeO).val(res.tbNworkorder.fdWendDatetime); //计划结束时间
                                            $("#work_editor", iframeO).val(_this.userName).attr('disabled', 'disabled').addClass('work_dis'); //工单编制人

                                            $("#fdFaultcode", iframeO).val(res.tbNworkorder.fdFaultcode);  //故障代码
                                            $("#fdFaultinfo", iframeO).val(res.tbNworkorder.fdFaultinfo);  //故障信息
                                            $("#fdFaultlevel", iframeO).val(res.tbNworkorder.fdFaultlevel);   //故障级别
                                            $("#fdFaulttype", iframeO).val(res.tbNworkorder.fdFaulttype);   //故障类型
                                            $("#task_msg", iframeO).val(res.tbNworkorder.fdWorkTask);   //任务信息

                                            //工作完成情况
                                            if (res.tbNworkorder.taskList) {
                                                var fd_obj = res.tbNworkorder.taskList;
                                                for (var i = 0; i < fd_obj.length; i++) {
                                                    var trObj = $('<tr></tr>')
                                                    trObj.html('<td class="task_num">' + fd_obj[i].fdTaksNum + '</td>' +
                                                        '<td><input class="task_inp task_name" type="text" value="' + fd_obj[i].fdTaskName + '"></td>' +
                                                        '<td><input class="task_inp task_mark" type="text" value="' + fd_obj[i].fdTaskInfo + '" ></td>');
                                                    trObj.appendTo($('#fill_tbody', iframeO));
                                                }

                                                $('#fill_tbody input').attr('disabled', 'true');

                                            }


                                            var str = '<option value="">请选择电站</option>';
                                            _this.station_list.forEach(function (val, index) {
                                                str += '<option value="' + val.fd_station_code + '">' + val.fd_station_name + '</option>';
                                            });
                                            $("#station_choose", iframeO).html(str);
                                            $("#submit", iframeO).click(function () {
                                                parent.layer.load(0, 2);
                                                $.ajax({
                                                    url: _this.serverAddr + "tbnworkorder/saveOrUpdate",	//请求地址
                                                    dataType: "json",
                                                    type: "POST",
                                                    data: {
                                                        "fdFaultid": "",//故障 id
                                                        "fdFaultcode": $('#fdFaultcode', iframeO).val(),//故障代码
                                                        "fdFaultinfo": $('#fdFaultinfo', iframeO).val(),//故障信息
                                                        "fdFaultlevel": $('#fdFaultlevel', iframeO).val(),//故障级别
                                                        "fdFaulttype": $('#fdFaulttype', iframeO).val(),//故障类型
                                                        "fdWstartDatetime": $('#fdWstartDatetime', iframeO).val(),//计划开始时间
                                                        "fdWendDatetime": $('#fdWendDatetime', iframeO).val(),//计划结束时间
                                                        "psid": $('#station_choose option:selected', iframeO).val(), //电站id
                                                        "fdWorkTask": $('#task_msg', iframeO).val(), //任务信息
                                                        "typeM": "1",//操作类型0新增1修改
                                                        "fdId": "",//修改需传工单id
                                                    },
                                                    traditional: true,//这里设置为true
                                                    success: function (res) {
                                                        parent.layer.closeAll('loading');
                                                        console.log(res);
                                                        if (res.code == 0) {
                                                            parent.layer.open({
                                                                title: '提示',
                                                                content: '工单修改成功',
                                                                yes: function () {
                                                                    parent.layer.closeAll();
                                                                    location.reload();
                                                                }
                                                            });
                                                        }
                                                    }
                                                });
                                                return false; //阻止form 提交
                                            });
                                        }
                                    });

                                }
                            }
                        });
                    }


                } else if (obj.attr('id') == 'order_export') { //导出工单
                    if (fdstatus == 5) {
                        location.href = this.serverAddr + 'tbnworkorder/exportn?id=' + fdId;
                    }

                } else if (obj.attr('id') == 'order_distribute') {  //工单分配（站端）
                    this.getResUser();
                    if (fdstatus == 1) {
                        $.ajax({
                            url: this.serverAddr + "tbnworkorder/info/" + fdId,	//fdId是请求参数，工单id
                            dataType: "json",
                            type: "POST",
                            success: function (res) {
                                if (res.code == 0) {
                                    parent.layer.open({
                                        type: 2,
                                        title: title,
                                        shadeClose: false,
                                        shade: 0.5,
                                        maxmin: true, //开启最大化最小化按钮
                                        area: ['800px', '620px'],
                                        content: ['popUp/new_workorder/pop_task.html'],
                                        success: function (layero, index) {
                                            var iframeO = layero.find("iframe")[0].contentWindow.document

                                            var str = '<option value="">请选择工作负责人</option>';
                                            _this.user_list.forEach(function (val, index) {
                                                str += '<option value="' + val.username + '">' + val.username + '</option>';
                                            });

                                            $("#supervisor_choose", iframeO).html(str);

                                            $('#station_choose', iframeO).html('<option value="">' + res.tbNworkorder.fdPsid + '</option>').attr('disabled', 'disabled');//电站id
                                            $('#work_code', iframeO).val(res.tbNworkorder.fdOrdernum).attr('disabled', 'disabled'); //工单编号
                                            $('#fdWstartDatetime', iframeO).val(res.tbNworkorder.fdWstartDatetime).attr('disabled', 'disabled'); //计划开始时间
                                            $('#fdWendDatetime', iframeO).val(res.tbNworkorder.fdWendDatetime).attr('disabled', 'disabled'); //计划结束时间
                                            $("#work_editor", iframeO).val(_this.userName).attr('disabled', 'disabled'); //工单编制人

                                            $("#fdFaultcode", iframeO).val(res.tbNworkorder.fdFaultcode).attr('disabled', 'disabled');  //故障代码
                                            $("#fdFaultinfo", iframeO).val(res.tbNworkorder.fdFaultinfo).attr('disabled', 'disabled');  //故障信息
                                            $("#fdFaultlevel", iframeO).val(res.tbNworkorder.fdFaultlevel).attr('disabled', 'disabled');   //故障级别
                                            $("#fdFaulttype", iframeO).val(res.tbNworkorder.fdFaulttype).attr('disabled', 'disabled');   //故障类型
                                            $("#task_msg", iframeO).val(res.tbNworkorder.fdWorkTask).attr('disabled', 'disabled');   //任务信息

                                            $("#submit", iframeO).off().click(function () {
                                                parent.layer.load(0, 2);
                                                $.ajax({
                                                    url: _this.serverAddr + "tbnworkorder/workDist",
                                                    dataType: "json",
                                                    type: "POST",
                                                    data: {
                                                        "fdId": fdId,//工单id
                                                        "user": $("#supervisor_choose option:selected", iframeO).val(),//工作负责人
                                                        "userg": $("#work_team_per", iframeO).val(),//工作组人员
                                                    },
                                                    success: function (res) {
                                                        if (res.code == 0) {
                                                            parent.layer.open({
                                                                title: '提示',
                                                                content: '工单分配成功',
                                                                yes: function () {
                                                                    parent.layer.closeAll();
                                                                    location.reload();
                                                                }
                                                            });
                                                        }
                                                    }
                                                });
                                                return false; //阻止form 提交
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }


                } else if (obj.attr('id') == 'order_pf') {  //工单派发（站端）
                    if (fdstatus == 2) {
                        $.ajax({
                            url: this.serverAddr + "tbnworkorder/workP",	//请求地址
                            dataType: "json",
                            type: "POST",
                            data: {
                                fdId: fdId//工单id
                            },
                            traditional: true,//这里设置为true
                            success: function (res) {
                                if (res.code == 0) {
                                    parent.layer.open({
                                        title: '提示',
                                        content: '工单派发成功',
                                        yes: function () {
                                            location.reload();
                                            parent.layer.closeAll();
                                        }
                                    });

                                } else {
                                    parent.layer.open({
                                        title: '提示',
                                        content: '工单派发失败'
                                    });
                                }
                            }
                        });
                    }
                }
            }
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
                    _this.getTaskList();
                }
                _this.startPageFlag = true;
            }

            $("#pageChange").val(_this.curOtherPage);
            $('#goPage').click(function () {
                _this.curOtherPage = $("#pageChange").val();
                _this.getTaskList();
            });

        },


    },
    mounted: function () {
        if ($.cookie("userName")) {
            this.userName = $.cookie("userName");
        }
        this.initPageSize();
        //获取工单权限
        this.get_authority();

    }
});

function doChangePage() {
    $('#pageId').val($("#pageNum option:selected").val())
    vm.sizePage = $("#pageNum option:selected").val();
    vm.getTaskList();
}