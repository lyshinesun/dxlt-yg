var vm = new Vue({
    el: '#device_manage',
    data: {
        stationId: 'gs', //电站id

        //分页
        startPageFlag: true,
        curOtherPage: 1,
        sizePage: 10,
        chooseTotNum: 0, //总条数

        //查询条件
        fdequipmentclass: "", //设备类型
        fdequipmentname: "", //设备名称
        fdequipmentcode: "", //设备mac唯一码

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

        //获取设备列表
        get_device_list: function () {
            var _this = this;
            var Parameters = {
                "parameters": {
                    "timetype": "4",
                    "sorttype": "1",
                    "sort": "1",
                    "fd_page_index": this.curOtherPage,
                    "fd_page_size": this.sizePage,
                    "stationid": this.stationId,
                    "fdequipmentclass": this.fdequipmentclass, //设备类型
                    "fdequipmentname": this.fdequipmentname, //设备名称
                    "fdequipmentcode": this.fdequipmentcode, //设备mac唯一码
                },
                "foreEndType": 2,
                "code": "70000001"
            }

            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                if (res.success) {
                    var devicelist = res.data.fdequipmentinfos;
                    var deviceStr = $('#device_tpl').html();
                    var deviceHtml = ejs.render(deviceStr, {devicelist: devicelist});
                    $("#dailyreportbody").html(deviceHtml);

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
                        table_parent_height: 'task_sub_wrap',
                    });
                }
            });

        },

        addOrmodify:function(iframeO,msg){
            var _this=this;
            $("#device_add", iframeO).click(function () {
                if ($("#device_form", iframeO).valid()) {

                    parent.layer.load(0, 2);
                    var Parameters = {
                        "parameters": {
                            "stationid": _this.stationId,
                            "fd_name": $('#fd_name option:selected', iframeO).val(),
                            "fd_mac": $('#fd_mac', iframeO).val(),
                            "fd_equipment_code": $('#fd_equipment_code', iframeO).val(),
                            "fd_equipment_name": "gs",
                            "fd_unit": $('#fd_unit', iframeO).val(),
                            "fd_equipment_class": $('#device_type option:selected', iframeO).val(),
                            "fd_equipment_model_code": $('#fd_equipment_model_code', iframeO).val(),
                            "fd_desc": $('#fd_desc', iframeO).val(),
                            "fd_use_path": $('#fd_use_path', iframeO).val(),

                            "fd_path": "北京总部",
                            "fd_dev_id": "GS_S1_1N1",//可选 设备id
                            "fd_pic": $('#imgOne',iframeO).val(),//图片,//图片
                        },
                        "foreEndType": 2,
                        "code": "70000003"
                    }

                    vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                        if (res.success) {
                            parent.layer.open({
                                title: '提示',
                                content: msg,
                                yes: function () {
                                    parent.layer.closeAll();
                                    _this.get_device_list();
                                }
                            });
                        }
                    });

                    return false; //阻止form 提交

                }
            });
        },


        //弹窗
        popDevice: function (e) {

            var _this = this,
                obj = $(e.target),
                title = obj.text();
            var task_tar = $('#dailyreportbody input[name="fdId"]:checked');
            if (obj.attr('id') == 'create_device') { //新增设备
                parent.layer.open({
                    type: 2,
                    title: title,
                    shadeClose: false,
                    shade: 0.5,
                    maxmin: true, //开启最大化最小化按钮
                    area: ['800px', '620px'],
                    content: ['popUp/pop_device.html'],
                    success: function (layero, index) {
                        var iframeO = layero.find("iframe")[0].contentWindow.document;

                        //$("#device_form").validate(); //表单验证
                        $('#fd_name',iframeO).html($('#device_name').html());
                        _this.addOrmodify(iframeO,'新增成功');
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
                if (obj.attr('id') == 'device_delete') { //删除设备
                    var Parameters = {
                        "parameters": {
                            "fd_ids": fdId,
                            "stationid": this.stationId
                        },
                        "foreEndType": 2,
                        "code": "70000004"
                    }

                    vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                        if (res.success) {
                            parent.layer.open({
                                title: '提示',
                                content: res.message,
                                yes: function () {
                                    parent.layer.closeAll();
                                    _this.get_device_list();
                                }
                            });
                        }
                    });
                } else if (obj.attr('id') == 'device_modify') { //修改设备
                    var Parameters = {
                        "parameters": {
                            "fd_id": fdId,
                            "stationid": this.stationId
                        },
                        "foreEndType": 2,
                        "code": "70000005"
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
                                content: ['popUp/pop_device.html'],
                                success: function (layero, index) {
                                    var iframeO = layero.find("iframe")[0].contentWindow.document;
                                    $('#fd_name',iframeO).html($('#device_name').html());

                                    $('.device_tit', iframeO).html('修改备品备件');
                                    $('#fd_name', iframeO).val(res.data.fd_name);
                                    $('#fd_equipment_code', iframeO).val(res.data.fd_equipment_code);
                                    $('#fd_unit', iframeO).val(res.data.fd_unit);
                                    $('#fd_equipment_class', iframeO).val(res.data.fd_equipment_class);
                                    $('#fd_equipment_model_code', iframeO).val(res.data.fd_equipment_model_code);
                                    $('#fd_desc', iframeO).val(res.data.fd_desc);
                                    $('#fd_use_path', iframeO).val(res.data.fd_use_path);
                                    $('#fd_mac', iframeO).val(res.data.fd_mac).attr('disabled', 'disabled').addClass('work_dis');

                                    //$("#device_form").validate(); //表单验证
                                    _this.addOrmodify(iframeO,'修改成功');
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
                    _this.get_device_list();
                }
                _this.startPageFlag = true;
            }

            $("#pageChange").val(_this.curOtherPage);
            $('#goPage').click(function () {
                _this.curOtherPage = $("#pageChange").val();
                _this.get_device_list();
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
            this.fdequipmentclass=$('#device_type option:selected').val(), //设备类型
            this.fdequipmentname=$('#device_name option:selected').val(), //设备名称
            this.fdequipmentcode=$('#eq_mac').val(), //设备mac唯一码
            this.get_device_list();
        }


    },
    mounted: function () {

        this.initPageSize();

        //获取设备列表
        this.get_device_list();


        //初始化查询条件
        this.init_query();

    }
});

function doChangePage() {
    $('#pageId').val($("#pageNum option:selected").val())
    vm.sizePage = $("#pageNum option:selected").val();
    vm.curOtherPage=1;
    vm.get_device_list();
}