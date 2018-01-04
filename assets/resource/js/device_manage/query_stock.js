var vm = new Vue({
    el: '#query_stock',
    data: {
        stationId: 'gs', //电站id

        //分页
        startPageFlag: true,
        curOtherPage: 1,
        sizePage: 10,
        chooseTotNum: 0, //总条数

        //查询条件
        fdequipmentname: "", //设备名称
        fdequipmentcode: "", //设备类型编号

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

        //获取出库列表
        query_stock_list: function () {
            var _this = this;
            var Parameters = {
                "parameters": {
                    "timetype": "4",
                    "sorttype": "1",
                    "sort": "1",
                    "fd_page_index": this.curOtherPage,
                    "fd_page_size": "10",
                    "fdequipmentclass": "",
                    "fdequipmentname": this.fdequipmentname,//设备名称
                    "fdequipmentcode": this.fdequipmentcode, //设备类型编号
                    "stationid": "gs"
                },
                "foreEndType": 2,
                "code": "70000006"
            }

            layer.load(0, 2);

            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                layer.closeAll();
                if (res.success) {
                    var stocklist = res.data.fdequipmentinfos;
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
                    _this.query_stock_list();
                }
                _this.startPageFlag = true;
            }

            $("#pageChange").val(_this.curOtherPage);
            $('#goPage').click(function () {
                _this.curOtherPage = $("#pageChange").val();
                _this.query_stock_list();
            });

        },

        //初始化查询条件
        init_query: function () {
            var Parameters = {
                "parameters": {
                    "timetype": "4",
                    "sorttype": "1",
                    "sort": "1",
                    "fd_page_index": "1",
                    "fd_page_size": "10",
                    "stationid": "gs"
                },
                "foreEndType": 2,
                "code": "70000002"
            }

            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                if (res.success) {
                    var nameStr = '<option value="">请选择设备名称</option>';
                    var nameData = res.data.fdequipmentname;

                    $.each(nameData, function (key, val) {
                        nameStr += '<option value="' + val.fd_name + '">' + val.fd_name + '</option>';
                    });

                    $('#device_name').html(nameStr);

                }
            });

        },


        //查询
        queryClick: function () {
            this.fdequipmentname = $('#device_name option:selected').val(); //设备名称
            this.fdequipmentcode = $('#eq_mac').val(); //设备类型编号
            this.query_stock_list();
        }


    },
    mounted: function () {

        this.initPageSize();

        //获取库存列表
        this.query_stock_list();

        //初始化查询条件
        this.init_query();

    }
});

function doChangePage() {
    $('#pageId').val($("#pageNum option:selected").val())
    vm.sizePage = $("#pageNum option:selected").val();
    vm.getTaskList();
}