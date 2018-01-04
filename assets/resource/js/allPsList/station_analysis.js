var vm = new Vue({
    el: '#troubleList',
    data: {
        /*用到的数据*/
        stationId: '', //电站id
        analysisList: [],
        /*以下是暂时没有用到的数据*/
        startDateStr: '',  //查询开始时间
        startPageFlag: true,
        curOtherPage: 1,
        sizePage: 10,
        chooseTotNum: 0, //总条数
        stationLis: [],
        stationName: '', //电站名称
        stationCode: '', //电站gs
        alarmLevel: 0, //故障级别
        faultCode: '', //故障代码
        fdDesc: '', //故障信息、故障、类型
        faultId: '', //故障Id
        matrix: '', //方阵
        inverterNum: '' //逆变器编号
    },
    methods: {
        sedAnalysisForm: function () {
            console.log(window.parent.analysisForm)
             $.ajax({
                url: vlm.serverAddr + "tbfaultconfig/update",    //请求地址
                dataType: "json",
                type : "GET",
                data: {
                    "tbFaultConfig" : window.parent.analysisForm
                },
                success:function(res){
                    console.log(res)
                },
                error: function () {
                    console.log(error)
                }
            });
        },
        //获取电站列表
        getStations: function () {
            var _this = this
            $.ajax({
                url: vlm.serverAddr + "stationbaseinfo/getPsList",    //请求地址
                dataType: "json",
                type : "GET",
                success:function(res){
                    _this.stationList = res.list
                    var stationList_tpl = $('#stationList').html();
                    var stationStr = ejs.render(stationList_tpl, {stationList: _this.stationList});
                    $('#powerList').html(stationStr);

                    _this.stationId = _this.stationList[0].fdStationCode.toLowerCase();

                    $('#powerList li').click(function () {
                        $(this).addClass('on').siblings().removeClass('on');
                        _this.stationId = $(this).attr('id');
                        _this.getFaultList();
                    });
                    _this.getFaultList();
                },
                error: function () {
                    console.log(error)
                }

            });
        },
        /*
        @param fdType: 告警类型
        @param id: 告警类型id
        */
        showDetail: function (fdType, id) {
            window.parent.fdId = id
            window.parent.fdType = fdType
            var _this = this

            parent.layer.open({
                skin: 'analysis-class',
                type: 2,
                title: '告警建议',
                shadeClose: false,
                shade: 0.5,
                maxmin: true, //开启最大化最小化按钮
                area: ['1000px', '600px'],
                btn: ['确定并复制到其它电站', '确定'],
                yes:function (index, layero) {
                    _this.showStations()
                },
                btn2: function (index, layero) {
                    // _this.sedAnalysisForm()
                    parent.layer.close(index)
                },
                btnAlign: 'c',
                content: ['popUp/analysis_pop.html'],
                success:function (layero, index) {
                }
            });
        },
        showStations: function () {
            var _this = this
            // 点击复制到其它电站按钮触发
            parent.layer.open({
                type: 2,
                title: '请选择电站',
                shadeClose: false,
                shade: 0.5,
                maxmin: true, //开启最大化最小化按钮
                area: ['800px', '500px'],
                btn: ['确定', '取消'],
                yes:function (index, layero) {
                    parent.layer.close(index)
                },
                btn2: function (index, layero) {
                    parent.layer.close(index)
                },
                btnAlign: 'c',
                content: ['popUp/station_list_pop.html', 'yes'], 
                success:function (layero, index) {
                }
            });
        },
        //获取报表数据
        getFaultList: function () {
            var _this = this;
            // this.startDateStr = this.startDateStr.replace(/\//g, "-");  //请求开始时间
            // this.urlType = 'tbfaultdata/list'; //配置suburl
            $('#report_name').text($('#powerList .on >a').text() + '告警报表');  //列表名称
            // $("#dailyreportbody").html('');
            var layerIndex = layer.load(0, 2);
            $.ajax({
                url: vlm.serverAddr + 'tbfaultconfig/list/',
                type: "get",
                dataType: "json",
                data: {
                    "fdStationCode": 'hl',
                },
                success: function (res) {
                    if (res.code == 0) {
                        _this.analysisList = res.list
                    }
                    layer.close(layerIndex);
                },
                error: function () {
                }
            })
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
        //加载页面
        loadPage: function () {
            this.initPageSize();   //初始化尺寸
            this.getStations();   //获取电站列表
        }
    },
    mounted: function () {
        this.loadPage();   //加载页面
    }
});

function doChangePage() {
    $('#pageId').val($("#pageNum option:selected").val())
    vm.sizePage = $("#pageNum option:selected").val();
    vm.curOtherPage = 1;
    vm.getFaultList();
}
