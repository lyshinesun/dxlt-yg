var vm = new Vue({
    el: '#out_stock',
    data: {
        stationId: 'gs', //电站id

        //分页
        startPageFlag: true,
        curOtherPage: 1,
        sizePage: 10,
        chooseTotNum: 0, //总条数

        //电站列表
        station_list: [],

        //查询条件
        fdequipmentclass: "", //设备类型
        fdequipmentname: "", //设备名称
        fdequipmentcode: "", //设备mac唯一码

        //出库单类型
        out_stock_type:"工单出库"

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

        //获取出库列表
        get_out_stock_list: function () {
            var _this = this;
            var Parameters = {
                "parameters": {
                    "sorttype": "1",
                    "sort": "1",
                    "fd_page_index": "1",
                    "fd_page_size": "10",
                    "fd_order_class": this.out_stock_type,//1：工单出库、2：维修出库、3：借调出库、4：报废出库、5：资产处置出库（非必填）6代表入库
                    "fd_code": "",//入库编号（非必填）
                    "stationid": this.stationId
                },
                "foreEndType": 2,
                "code": "70000011"
            }

            parent.layer.load(0, 2);

            vlm.loadJson("", JSON.stringify(Parameters), function (res) {

                parent.layer.closeAll();

                if (res.success) {
                    var stocklist = res.data.fddata;
                    var stockStr = $('#stock_tpl').html();
                    var stockHtml = ejs.render(stockStr, {stocklist: stocklist});
                    $("#dailyreportbody").html(stockHtml);

                    _this.chooseTotNum = res.data.fddatacount;  //总条数
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
                        table_parent_height: 'task_sub_wrap'
                    });
                }
            });

        },

        addChangeClick: function (iframeO, msg) {
            var _this = this;

            $("#stock_add", iframeO).click(function () {
                if ($("#stock_form", iframeO).valid()) {
                    parent.layer.load(0, 2);

                    var Parameters = {
                        "parameters": {

                            "stationid": _this.stationId,
                            "fd_name": $('.dev_name', iframeO).val(),
                            "fd_code": $('.dev_code', iframeO).val(),
                            "fd_work_code": $('#workorder_code', iframeO).val(),
                            "fd_order_class": _this.out_stock_type,
                            "fd_user": $('#fd_user', iframeO).val(),
                            "fd_operator": $('#fd_operator', iframeO).val(),
                            "fd_desc": $('#fd_desc', iframeO).val()
                        },
                        "foreEndType": 2,
                        "code": "70000013"
                    };
                    vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                        if (res.success) {
                            parent.layer.open({
                                title: '提示',
                                content: msg,
                                yes: function () {
                                    parent.layer.closeAll();
                                    _this.get_out_stock_list();
                                }
                            });
                        }
                    })

                    return false; //阻止form 提交

                }
            });
        },

        formInit: function (iframeO) {
            var _this = this;
            var str = '<option value="">请选择电站</option>';
            _this.station_list.forEach(function (val, index) {
                str += '<option value="' + val.fd_station_code + '">' + val.fd_station_name + '</option>';
            });
            $("#station_choose", iframeO).html(str);

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
                    '<td><input class="task_inp stock_name" type="text" value=""></td>' +
                    '<td><input class="task_inp stock_mark" type="text" value="" ></td>' +
                    '<td><input class="task_inp stock_number" type="text" value="" ></td>');

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
        },


        //弹窗
        popDevice: function (e) {

            var _this = this,
                obj = $(e.target),
                title = obj.text();
            var task_tar = $('#dailyreportbody input[name="fdId"]:checked');
            if (obj.attr('id') == 'create_device') { //新增库存
                _this.getAllStation();
                parent.layer.open({
                    type: 2,
                    title: title,
                    shadeClose: false,
                    shade: 0.5,
                    maxmin: true, //开启最大化最小化按钮
                    area: ['800px', '620px'],
                    content: ['popUp/pop_out_stock.html'],
                    success: function (layero, index) {
                        var iframeO = layero.find("iframe")[0].contentWindow.document;

                        _this.formInit(iframeO);  //初始化

                        $("#stock_form", iframeO).validate();

                        _this.addChangeClick(iframeO, '新建出库单成功');

                    }
                });
            } else {
                if (task_tar.length <= 0) {
                    parent.layer.open({
                        title: '提示',
                        content: '您未选中设备'
                    });
                    return;
                }

                var fdId = task_tar.parent().find('input[type="hidden"]').val();
                if (obj.attr('id') == 'device_delete') { //删除库存
                    var Parameters = {
                        "parameters": {
                            "fd_ids": fdId,
                            "stationid": this.stationId
                        },
                        "foreEndType": 2,
                        "code": "70000014"
                    }

                    vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                        if (res.success) {
                            parent.layer.open({
                                title: '提示',
                                content: "删除成功",
                                yes: function () {
                                    parent.layer.closeAll();
                                    _this.get_out_stock_list();
                                }
                            });
                        }
                    });
                } else if (obj.attr('id') == 'device_modify') { //修改出库单
                    _this.getAllStation();
                    var Parameters = {
                        "parameters": {
                            "fd_id": fdId,
                            "stationid": this.stationId
                        },
                        "foreEndType": 2,
                        "code": "70000015"
                    }

                    vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                        if (res.success) {
                            parent.layer.open({
                                type: 2,
                                title: title,
                                shadeClose: false,
                                shade: 0.5,
                                maxmin: true, //开启最大化最小化按钮
                                area: ['800px', '620px'],
                                content: ['popUp/pop_out_stock.html'],
                                success: function (layero, index) {
                                    var iframeO = layero.find("iframe")[0].contentWindow.document;

                                    _this.formInit(iframeO);  //初始化
                                    $('#work_code', iframeO).val(res.data.fd_code);
                                    $('#fd_user', iframeO).val(res.data.fd_user); //领用人
                                    $('#fd_operator', iframeO).val(res.data.fd_operator); //经办人
                                    $('#fdWstartDatetime', iframeO).val(res.data.fd_log_date); //经办人
                                    $('#workorder_code', iframeO).val(res.data.fd_work_code); //工单号
                                    $('#task_msg', iframeO).val('工单出库'); //出库单类型
                                    $('#fd_desc', iframeO).val(res.data.fd_desc); //出库单描述


                                    $("#stock_form", iframeO).validate();

                                    _this.addChangeClick(iframeO, '修改出库单成功');

                                }
                            });
                        }
                    });
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

        //初始化查询条件
        init_query: function () {
            var Parameters = {
                "parameters": {
                    "timetype": "4",
                    "sorttype": "1",
                    "sort": "1",
                    "fd_page_index": this.curOtherPage,
                    "fd_page_size": this.sizePage,
                    "stationid": this.stationId
                },
                "foreEndType": 2,
                "code": "70000002"
            }

            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                if (res.success) {
                    var typeStr = '<option value="">请选择设备类型</option>';
                    var nameStr = '<option value="">请选择设备名称</option>';
                    var typeData = res.data.fdequipmentclass,
                        nameData = res.data.fdequipmentname;
                    $.each(typeData, function (key, val) {
                        typeStr += '<option value="' + val + '">' + val + '</option>';
                    });

                    $('#device_type').html(typeStr);

                    $.each(nameData, function (key, val) {
                        nameStr += '<option value="' + val.fd_name + '">' + val.fd_name + '</option>';
                    });

                    $('#device_name').html(nameStr);

                }
            });

        },


        //查询
        queryClick: function () {
            this.fdequipmentclass = $('#device_type option:selected').val(), //设备类型
                this.fdequipmentname = $('#device_name option:selected').val(), //设备名称
                this.fdequipmentcode = $('#eq_mac').val(), //设备mac唯一码
                this.get_out_stock_list();
        },

        //出库表导出
        exportStockList: function () {

            var Parameters = {
                "parameters": {
                    "timetype": "4",
                    "sorttype": "1",
                    "sort": "1",
                    "fd_page_index": this.curOtherPage,
                    "fd_page_size": this.sizePage,
                    "fdequipmentclass": this.fdequipmentclass,
                    "fdequipmentname": this.fdequipmentname,
                    "fdequipmentcode": this.fdequipmentcode,
                    "stationid": this.stationId
                },
                "foreEndType": 2,
                "code": "700000016"
            }
            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                console.log(res);
                if(res.success){
                    window.location.href=res.data;
                }
            })

        },


    },
    mounted: function () {

        this.initPageSize();

        //获取库存列表
        this.get_out_stock_list();


        //初始化查询条件
        this.init_query();

    }
});

function doChangePage() {
    $('#pageId').val($("#pageNum option:selected").val())
    vm.sizePage = $("#pageNum option:selected").val();
    vm.getTaskList();
}