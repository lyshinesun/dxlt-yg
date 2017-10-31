var vm = new Vue({
    el: '#new_order',
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
                        _this.psList = res.psList; //缓存电站列表
                        _this.getTaskList();
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

        //获取工单列表
        getTaskList: function () {
            var _this = this;
            var listData = {
                limit: this.sizePage, //页数量
                page: this.curOtherPage,
                psid: []
            }
            if (Array.isArray(this.psList)) { //检测是否为数组
                listData.psid = this.psList; //任务列表id,根据权限返回的有就传，没有不传
            }
            parent.layer.load(0,2);
            $.ajax({
                url: this.serverAddr + "tbnworkorder/queryT",	//请求地址
                dataType: "json",
                type: "POST",
                data: listData,
                traditional: true,//这里设置为true
                success: function (res) {
                    parent.layer.closeAll();
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
                },
                error:function(){
                    parent.layer.closeAll();
                }
            });

        },


        //弹窗
        popTask: function (e) {

            var _this = this,
                obj = $(e.target),
                title = obj.text();
            var task_tar = $('#dailyreportbody input[name="fdId"]:checked');

            if (task_tar.length <= 0) {
                parent.layer.open({
                    title: '提示',
                    content: '您未选中工单'
                });
                return;
            }

            var fdId = task_tar.parent().find('input[type="hidden"]').val(),
                fdstatus = task_tar.parents('tr').find('.task_status').attr('data-status');
            if (obj.attr('id') == 'order_fill') { //工单填报
                if (fdstatus == 3) {
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
                                    area: ['800px', '500px'],
                                    content: ['popUp/new_workorder/pop_order.html'],
                                    success: function (layero, index) {
                                        var iframeO = layero.find("iframe")[0].contentWindow.document
                                        $("#work_task_cont", iframeO).val(res.tbNworkorder.fdWorkTask).attr('disabled', 'true').addClass('work_dis');
                                        var n = 1;
                                        $("#fill_plus", iframeO).click(function () {
                                            n++;
                                            if (n > 20) {
                                                parent.layer.open({
                                                    title: '提示',
                                                    content: '每次最多填报20条任务'
                                                });
                                                return;
                                            }
                                            var trObj = $('<tr></tr>')
                                            trObj.html('<td class="task_num">' + n + '</td>' +
                                                '<td><input class="task_inp task_name" type="text" value=""></td>' +
                                                '<td><input class="task_inp task_mark" type="text" value="" ></td>');

                                            trObj.appendTo($('#fill_tbody', iframeO));

                                        });

                                        $("#fill_minus", iframeO).click(function () {
                                            n--;
                                            if (n < 1) {
                                                n = 1;
                                                return;
                                            }
                                            $('#fill_tbody tr:last', iframeO).remove();

                                        });

                                        $("#submit", iframeO).click(function () {
                                            parent.layer.load(0, 2);

                                            var task_arr = [];
                                            for (var i = 0; i < $('#fill_tbody tr', iframeO).length; i++) {
                                                var task_item = $('#fill_tbody tr', iframeO);
                                                var obj = {
                                                    name: task_item.eq(i).find('.task_name').val(),//名称
                                                    comment: task_item.eq(i).find('.task_mark').val(),//备注
                                                    num: task_item.eq(i).find('.task_num').html() //序号
                                                };//序号
                                                task_arr.push(obj);
                                            }

                                            $.ajax({
                                                url: _this.serverAddr + "tbnworkorder/addTask",	//请求地址
                                                dataType: "json",
                                                type: "POST",
                                                data: {
                                                    taskList: JSON.stringify(task_arr),
                                                    id: fdId,//工单id
                                                    outNum: $('#out_store_number option:selected', iframeO).val(),//出库单编号，从刘巍那边选的
                                                    czpNum: ""//暂时不传，预留
                                                },
                                                traditional: true,//这里设置为true
                                                success: function (res) {
                                                    if (res.code == 0) {
                                                        parent.layer.closeAll();
                                                        location.reload();
                                                    } else {
                                                        parent.layer.open({
                                                            title: '提示',
                                                            content: '工单填报失败'
                                                        });
                                                    }
                                                }, error: function (res) {
                                                    alert(res);
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

            } else if (obj.attr('id') == 'order_finish') { //工单结束
                if (fdstatus == 3) {
                    $.ajax({
                        url: this.serverAddr + "tbnworkorder/workEnd",	//请求地址
                        dataType: "json",
                        type: "POST",
                        data: {
                            fdId: fdId//工单id
                        },
                        success: function (res) {
                            if (res.code == 0) {
                                parent.layer.open({
                                    title: '提示',
                                    content: '工单结束成功',
                                    yes: function () {
                                        parent.layer.closeAll();
                                        location.reload();
                                    }
                                });
                            }
                        }
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
                                    $('#station_choose', iframeO).html('<option value="">' + res.tbNworkorder.fdPsid + '</option>').attr('disabled', 'true');//电站id
                                    $('#work_code', iframeO).val(res.tbNworkorder.fdOrdernum).attr('disabled', 'true'); //工单编号
                                    $('#supervisor_choose', iframeO).html('<option value="">' + res.tbNworkorder.fdUser + '</option>').attr('disabled', 'true'); //工作负责人
                                    $('#work_team_per', iframeO).attr('disabled', 'true'); //工作班组人员
                                    $('#fdWstartDatetime', iframeO).val(res.tbNworkorder.fdWstartDatetime).attr('disabled', 'true'); //计划开始时间
                                    $('#fdWendDatetime', iframeO).val(res.tbNworkorder.fdWendDatetime).attr('disabled', 'true'); //计划结束时间
                                    $("#work_editor", iframeO).val(_this.userName).attr('disabled', 'true'); //工单编制人

                                    $("#fdFaultcode", iframeO).val(res.tbNworkorder.fdFaultcode).attr('disabled', 'true');  //故障代码
                                    $("#fdFaultinfo", iframeO).val(res.tbNworkorder.fdFaultinfo).attr('disabled', 'true');  //故障信息
                                    $("#fdFaultlevel", iframeO).val(res.tbNworkorder.fdFaultlevel).attr('disabled', 'true');   //故障级别
                                    $("#fdFaulttype", iframeO).val(res.tbNworkorder.fdFaulttype).attr('disabled', 'true');   //故障类型
                                    $("#task_msg", iframeO).val(res.tbNworkorder.fdWorkTask).attr('disabled', 'true');   //任务信息
                                }
                            });
                        }
                    }
                });

            } else if (obj.attr('id') == 'order_export') { //导出工单
                if (fdstatus == 5) {
                    location.href = this.serverAddr + 'tbnworkorder/exportn?id=' + fdId;
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