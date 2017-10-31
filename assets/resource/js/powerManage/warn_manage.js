var vm = new Vue({
    el: '#warnManage',
    data: {
        stationId: 'gs', //电站id
        firstTreeFlag: true,  //是否是一级树

        curOtherPage: 1, // 哪一页
        sizePage: 10,
        chooseTotNum: 0,  //被选中总数

        incidentNum: 0,  //事件
        warnNum: 0,      //告警
        positionNum: 0,  //位置信号
        signalNum: 0,    //普通遥信
        levelStr: '',     //告警分类checked

        fd_dev_id: '',
        startPageFlag: true,

        flag1: 0,
        flag2: 0,
        flag3: 0,
        flag4: 0,
        flag5: 0,


        //消缺管理弹窗
        codeName: '', //故障名称
        codeStr: '', //故障编号
        codeId: '', //故障码

        errorTypes: '', //故障类型
        errorDevice: '', //故障设备
        errorLevel: '', //故障级别
        errorStartTime: '', //发生时间

        newStationList: [],  //电站列表

    },
    methods: {

        //初始化页面尺寸
        initPageSize: function () {
            $('.map_wap').height($(window).height() - 45);
            $('.map_con_fl').height($('.map_wap').height() - 40);
            $('.tendency_ri').height($('.map_wap').height() - 55);
            $('#gjgl_boxheight').height($('.tendency_ri').height() - 138);
            $('#tabDiv').height($('#gjgl_boxheight').height() - $('.page-div').height() - 10);
            $(window).resize(function () {
                $('.map_wap').height($(window).height() - 45);
                $('.map_con_fl').height($('.map_wap').height() - 40);
                $('.tendency_ri').height($('.map_wap').height() - 55);
                $('#gjgl_boxheight').height($('.tendency_ri').height() - 138);
                $('#tabDiv').height($('#gjgl_boxheight').height() - $('.page-div').height() - 10);
            });

            var boxrightWidth = $(".boxlists-right").width();
            var box1Width = $(".boxt1:eq(0)").width();
            var newbox2Witdth = boxrightWidth - box1Width - 60;
            if (newbox2Witdth > 70) {
                $(".boxt2").width(newbox2Witdth + "px");
            }
            if ($("#isOperate").length == 0) {
                $(".deal").css("background-color", "#C0C0C0");
            }

        },

        //初始化时间
        initTime: function () {
            var _this = this;
            var dates = new Date();
            var endDate = dates.getFullYear() + '-' + (dates.getMonth() + 1) + '-' + dates.getDate() + 'T' + dates.getHours() + ':' + dates.getMinutes() + ':' + dates.getSeconds();
            var tom_day = vlm.Utils.format_date(endDate, 'YmdHispace');
            dates.setDate(1);
            var startDate = dates.getFullYear() + '-' + (dates.getMonth() + 1) + '-' + dates.getDate() + 'T' + dates.getHours() + ':' + dates.getMinutes() + ':' + dates.getSeconds();
            var yest_day = vlm.Utils.format_date(startDate, 'YmdHizero');
            $("#start").val(yest_day);
            $("#end").val(tom_day);
            $("#quick_date1").html(yest_day);
            $("#quick_date2").html(tom_day);
            if (tom_day) {
                tom_day = (tom_day.replace("-", "")).replace("-", "").replace(" ", "").replace(":", "");
            }
            if (yest_day) {
                yest_day = (yest_day.replace("-", "")).replace("-", "").replace(" ", "").replace(":", "");
            }
            $("#dateHid").val(yest_day + "-" + tom_day);

            //时间选择显示隐藏事件
            $(".date_btn").unbind().bind("click",
                function (event) {
                    var dateWrap_height = $(".dateWrap").is(":hidden");
                    if (dateWrap_height) {
                        $(".dateWrap").show();
                    } else {
                        $(".dateWrap").hide();
                    }
                    event.stopPropagation();
                });

            //删除事件
            $(".map_choose_on").unbind("click").live('click', function () {

                $(this).remove();
                if ($(".map_choose span").length == 1) {
                    $(".map_choose_tit").hide();
                }
            });

            //i记录日期控件选择的时间类型：日，周，年……
            var i = 0;
            //年月日事件切换
            $(".dateWrap_tit ul li").click(function () {
                i = $(this).index();
                $(".dateWrap_tit ul li").removeClass("on");
                $(this).addClass("on");
                $('.ate_togg >ul').eq(i).addClass("active").siblings().removeClass('active');
                if (i == 0) //天
                {
                    $("#start").val($("#quick_date1").html());
                    $("#end").val($("#quick_date2").html());
                } else if (i == 1) //周
                {
                    var now_day = vlm.Utils.GetDay();
                    var week_year = vlm.Utils.getWeekNumber()[0];
                    var week_num = vlm.Utils.getWeekNumber()[1];
                    $("#week").val(week_year + LANG["all_station_yearof"] + week_num + LANG["all_station_week"]);
                } else if (i == 2) //月
                {
                    var now_day = vlm.Utils.GetDay();
                    var yest_day = vlm.Utils.GetDay(0, 0, -1);
                    var year = now_day.substring(0, now_day.indexOf("-"));
                    var month = now_day.substring(now_day.indexOf("-"), now_day.indexOf("-") + 3);
                    $("#month").val(year + month);
                } else if (i == 3) //季度
                {
                    var now_day = vlm.Utils.GetDay();
                    var month = now_day.substring(now_day.indexOf("-") + 1, now_day.indexOf("-") + 3);
                    var year = now_day.substring(0, now_day.indexOf("-"));
                    if (month >= 1 && month <= 3) {
                        $("#jidu").val(year + LANG["pro_management_year"] + LANG["pro_management_onequarter"]);
                    } else if (month >= 4 && month <= 6) {
                        $("#jidu").val(year + LANG["pro_management_year"] + LANG["pro_management_twoquarter"]);
                    } else if (month >= 7 && month <= 9) {
                        $("#jidu").val(year + LANG["pro_management_year"] + LANG["pro_management_threequarter"]);
                    } else {
                        $("#jidu").val(year + LANG["pro_management_year"] + LANG["pro_management_fourquarter"]);
                    }
                } else if (i == 4) //年
                {
                    var now_day = vlm.Utils.GetDay();
                    var month = now_day.substring(now_day.indexOf("-") + 1, now_day.indexOf("-") + 3);
                    var year = now_day.substring(0, now_day.indexOf("-"));
                    $("#year").val(year + LANG["all_station_yeartail"]);
                }
            });

            $('.wrap_su').click(function () {
                var dateType = $(this).attr('data-dateType');
                if (dateType == 'twoday') {
                    var yest_day = $("#start").val();
                    var tom_day = $("#end").val();
                    $("#quick_date1").html(yest_day);
                    $("#quick_date2").html(tom_day);
                    $("#dateHid").val(yest_day + "-" + tom_day);
                }
                $(".dateWrap").slideUp();
                //重置页数为1
                _this.curOtherPage = 1;
                _this.search();
            });

            this.showTree();  //加载树
            this.search(); //获取报警列表

        },

        //获取tree数据
        showTree: function (id, isdata) {
            var _this = this;
            var Parameters = {
                "parameters": {
                    "stationid": this.stationId
                },
                "foreEndType": 2,
                "code": "30000021"
            }

            if (!this.firstTreeFlag) {
                Parameters.parameters.fd_dev_id = id;
                Parameters.parameters.fd_isdata = isdata;
            }

            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                var zNodes = res.data;
                var newNodes = [];
                for (var i = 0; i < zNodes.length; i++) {
                    showTreeNodeImageByDeviceType(zNodes[i]); //code图标转换
                    if (zNodes[i].fd_dev_class_id == 10) {  //非特殊图标eg：svg文件夹
                        zNodes[i].icon = "";
                    }
                    var obj = {
                        id: zNodes[i].fd_dev_id,  //设备id
                        name: zNodes[i].fd_name,  //设备名字
                        icon: zNodes[i].icon,     //设备图标
                        isdata: zNodes[i].fd_isdata, //是否数据
                        fd_tablename: zNodes[i].fd_tablename, //表名
                        fd_code: zNodes[i].fd_code, //点名
                    };
                    if (_this.firstTreeFlag) {  //首次树
                        if (i == 0) {
                            obj.treeIcon = 'roots_close';
                        } else {
                            obj.treeIcon = 'bottom_close';
                        }
                    } else {  //非首次
                        if (zNodes[i].fd_isdata != 0 && zNodes[i].fd_isdata != -1) {  //是数据
                            obj.treeIcon = 'center_docu';
                        } else {
                            obj.treeIcon = 'bottom_close';
                        }
                    }

                    newNodes.push(obj);
                }

                var powerhtml = $('#powerTpl0').html();
                var powerLi = ejs.render(powerhtml, {newNodes: newNodes});
                var oUl = null;
                if (_this.firstTreeFlag) {
                    oUl = $('<ul class="ztree"></ul>');
                } else {
                    oUl = $('<ul class="line"></ul>');
                }
                oUl.html(powerLi);
                oUl.appendTo($('#' + id));
                oUl.find('>li').click(function (e) {
                    e.stopPropagation();
                    // if ($(this).find('ul').length < 1) {
                    //     _this.firstTreeFlag = false;
                    //     if ($(this).attr('data-isdata') != 0 && $(this).attr('data-isdata') != -1) {
                    //         //加载table
                    //         _this.fd_dev_id = $(this).attr('id');
                    //         //重置页数为1
                    //         _this.curOtherPage = 1;
                    //         _this.search();
                    //
                    //     } else {
                    //         _this.showTree($(this).attr('id'), $(this).attr('data-isdata')); //发送tree请求
                    //         if ($(this).find('>span').hasClass('roots_close')) {
                    //             $(this).find('>span').removeClass('roots_close').addClass('roots_open');
                    //         } else if ($(this).find('>span').hasClass('bottom_close')) {
                    //             $(this).find('>span').removeClass('bottom_close').addClass('center_open');
                    //         }
                    //     }
                    // } else {
                    //     if ($(this).find('>span').hasClass('center_open')) {
                    //         $(this).find('>span').removeClass('center_open').addClass('roots_close');
                    //     } else if ($(this).find('>span').hasClass('roots_open')) {
                    //         $(this).find('>span').removeClass('roots_open').addClass('roots_close');
                    //     } else if ($(this).find('>span').hasClass('roots_close')) {
                    //         $(this).find('>span').removeClass('roots_close').addClass('roots_open');
                    //     } else {
                    //         $(this).find('>span').removeClass('roots_close').addClass('center_open');
                    //     }
                    //     $(this).find('ul').stop().slideToggle();
                    // }
                    if ($(e.target).attr('class').indexOf('button') != -1) {
                        //+-
                        if ($(this).find('ul').length < 1) {
                            _this.firstTreeFlag = false;
                            _this.showTree($(this).attr('id'), $(this).attr('data-isdata')); //发送tree请求
                            if ($(this).find('>span').hasClass('roots_close')) {
                                $(this).find('>span').removeClass('roots_close').addClass('roots_open');
                            } else if ($(this).find('>span').hasClass('bottom_close')) {
                                $(this).find('>span').removeClass('bottom_close').addClass('center_open');
                            }
                        } else {
                            if ($(this).find('>span').hasClass('center_open')) {
                                $(this).find('>span').removeClass('center_open').addClass('roots_close');
                            } else if ($(this).find('>span').hasClass('roots_open')) {
                                $(this).find('>span').removeClass('roots_open').addClass('roots_close');
                            } else if ($(this).find('>span').hasClass('roots_close')) {
                                $(this).find('>span').removeClass('roots_close').addClass('roots_open');
                            } else {
                                $(this).find('>span').removeClass('roots_close').addClass('center_open');
                            }
                            $(this).find('ul').stop().slideToggle();
                        }

                    } else {
                        //点击文字
                        if ($(this).find('ul').length < 1) {
                            _this.firstTreeFlag = false;
                            if ($(this).attr('data-isdata') == 2) {
                                //showTree
                                _this.showTree($(this).attr('id'), $(this).attr('data-isdata')); //发送tree请求

                                if ($(this).find('>span').hasClass('roots_close')) {
                                    $(this).find('>span').removeClass('roots_close').addClass('roots_open');
                                } else if ($(this).find('>span').hasClass('bottom_close')) {
                                    $(this).find('>span').removeClass('bottom_close').addClass('center_open');
                                }
                            }

                            //加载table  无论isdata=0 或者2 都需要展示chart
                            _this.fd_dev_id = $(this).attr('id');
                            _this.curOtherPage = 1; //重置页数为1
                            _this.search();

                        } else {

                            _this.firstTreeFlag = false;
                            if ($(this).attr('data-isdata') == 2) {

                                if ($(this).find('>span').hasClass('roots_close')) {
                                    $(this).find('>span').removeClass('roots_close').addClass('roots_open');
                                } else if ($(this).find('>span').hasClass('bottom_close')) {
                                    $(this).find('>span').removeClass('bottom_close').addClass('center_open');
                                }
                            }

                            //加载table  无论isdata=0 或者2 都需要展示chart
                            _this.fd_dev_id = $(this).attr('id');
                            _this.curOtherPage = 1; //重置页数为1
                            _this.search();


                            if ($(this).find('>span').hasClass('center_open')) {
                                $(this).find('>span').removeClass('center_open').addClass('roots_close');
                            } else if ($(this).find('>span').hasClass('roots_open')) {
                                $(this).find('>span').removeClass('roots_open').addClass('roots_close');
                            } else if ($(this).find('>span').hasClass('roots_close')) {
                                $(this).find('>span').removeClass('roots_close').addClass('roots_open');
                            } else {
                                $(this).find('>span').removeClass('roots_close').addClass('center_open');
                            }
                            $(this).find('ul').stop().slideToggle();
                        }

                    }

                });

            });

        },

        //状态
        checkFaultType: function () {
            //重置页数为1
            this.curOtherPage = 1;
            this.search();
        },

        //查询
        search: function () {
            var _this = this,
                startd = $("#quick_date1").html(),
                endd = $("#quick_date2").html();
            if (startd > endd) {  //结束日期必须大于开始日期
                Sungrow.showMsg({
                    container: {
                        header: LANG["pro_management_prompt"],
                        content: LANG["pro_management_starttimenotgreatercutofftime"],
                        noFn: true,
                        noText: LANG["pro_management_determine"]
                    },
                    fixed: false
                });
                return;
            }

            var startStr = startd.replace(/[-:\s]*/ig, '') + '00';
            var endStr = endd.replace(/[-:\s]*/ig, '') + '00';


            //告警分类
            var arr = [];
            $('.ygtop2-left input[name="faultType"]').each(function () {
                if ($(this).is(':checked')) {
                    arr.push($(this).val());
                }
            });

            _this.levelStr = arr.join(',');

            layer.load(0, 2);
            $('#warn_tbody').html('');
            var Parameters = {
                "parameters": {
                    "stationid": this.stationId,
                    "fd_dev_id": this.fd_dev_id, //设备id
                    fd_level: this.levelStr, //事件 告警  位置信号  普通遥信
                    fd_page_index: this.curOtherPage,   //页数
                    fd_page_size: this.sizePage,   //数据条数
                    fd_alarm_code: "",  //故障code 模糊fd_alarm_code
                    fd_alarm_name: "",  //故障名称 模糊
                    fd_alarm_level: "", //'级别：0：普通事件；1、普通；2、高报；3、高高报；'
                    fd_alarm_state: "",//1 产生告警,2 正常关闭,3 手动关闭(暂时不加)
                    fd_order_state: "", //'ORDER状态,0未确认,1待处理，2，已解决，3已关闭',
                    "starttime": startStr, //开始时间
                    "endtime": endStr,   //结束时间
                },
                "foreEndType": 2,
                "code": "30000022"
            };

            _this.chooseTotNum = 0;  //清空统计条数

            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                if (res.success) {
                    //请求完成后关闭滚动
                    layer.closeAll();
                    var result = res.data;
                    var resTr = result.fddatas;
                    if(resTr){
                        _this.incidentNum = result.fdleveldatas[0].data; //事件
                        _this.warnNum = result.fdleveldatas[1].data; //告警
                        _this.positionNum = result.fdleveldatas[2].data; //位置信号
                        _this.signalNum = result.fdleveldatas[3].data;  //普通遥信

                        //
                        if (_this.levelStr.indexOf(1) != -1) {

                            _this.chooseTotNum += Math.floor(_this.incidentNum);
                        }
                        if (_this.levelStr.indexOf(2) != -1) {
                            _this.chooseTotNum += Math.floor(_this.warnNum);
                        }

                        if (_this.levelStr.indexOf(3) != -1) {
                            _this.chooseTotNum += Math.floor(_this.positionNum);
                        }

                        if (_this.levelStr.indexOf(4) != -1) {
                            _this.chooseTotNum += Math.floor(_this.signalNum);
                        }

                        if (_this.chooseTotNum > 0) {
                            var warnhtml = $('#warn_tpl').html();
                            var warnTr = ejs.render(warnhtml, {resTr: resTr});
                            $('#warn_tbody').html(warnTr);

                            //详情点击
                            $('.gaojing_td9 >a').click(function () {
                                _this.codeName = $(this).parents('.problem_color').find('.gaojing_td4').html(); //故障名称
                                _this.codeStr = $(this).parents('.problem_color').find('.gaojing_code').val(); //故障编号

                                if ($(this).hasClass('manage_01')) {
                                    _this.errorTypes = $(this).parents('.problem_color').find('.gaojing_td2 span').html(); //故障类型
                                    _this.errorDevice = $(this).parents('.problem_color').find('.gaojing_td5').html(); //故障设备
                                    _this.errorLevel = $(this).parents('.problem_color').find('.gaojing_td3 span').html(); //故障级别
                                    _this.errorStartTime = $(this).parents('.problem_color').find('.gaojing_td8').val(); //发生时间
                                    _this.showFaultDetailPage();
                                } else if ($(this).hasClass('manage_02')) {
                                    //转消缺
                                    _this.codeId = $(this).parents('.problem_color').find('.fault_code').val();
                                    _this.cancelTicket();
                                } else if ($(this).hasClass('manage_03')) {
                                    //关闭故障
                                    _this.codeId = $(this).parents('.problem_color').find('.fault_code').val();
                                    _this.closeTicket();
                                }
                            });

                            $('#checkAllItems')[0].checked = false;

                            $('input[name="batchIds"]').click(function (e) {
                                var obj = e.target;
                                if ($("#isOperate").length == 0) {
                                    return;
                                }
                                if (obj.checked) {
                                    if ($("#process_status3").find("span").text() == LANG["all_station_waithand"]) {
                                        _this.flag1++;
                                    } else if ($("#process_status3").find("span").text() == LANG["all_station_closed"]) {
                                        _this.flag2++;
                                    } else if ($("#process_status3").find("span").text() == LANG["all_station_notrecognize"]) {
                                        _this.flag3++;
                                    } else if ($("#process_status3").find("span").text() == LANG["all_station_processing"]) {
                                        _this.flag4++;
                                    } else if ($("#process_status3").find("span").text() == LANG["all_station_settled"]) {
                                        _this.flag5++;
                                    }
                                } else {
                                    if ($("#process_status3").find("span").text() == LANG["all_station_waithand"]) {
                                        _this.flag1--;
                                    } else if ($("#process_status3").find("span").text() == LANG["all_station_closed"]) {
                                        _this.flag2--;
                                    } else if ($("#process_status3").find("span").text() == LANG["all_station_notrecognize"]) {
                                        _this.flag3--;
                                    } else if ($("#process_status3").find("span").text() == LANG["all_station_processing"]) {
                                        _this.flag4--;
                                    } else if ($("#process_status3").find("span").text() == LANG["all_station_settled"]) {
                                        _this.flag5--;
                                    }
                                }

                                //只有这种情况才能点击批量确认
                                if (_this.flag3 > 0 && _this.flag1 <= 0 && _this.flag2 <= 0 && _this.flag4 <= 0 && _this.flag5 <= 0) {
                                    $("#batchCloseBtn").css("background-color", "#ff9966").addClass('active');
                                } else {
                                    if (_this.flag2 > 0) {
                                        $("#batchCloseBtn").css("background-color", "#C0C0C0");
                                    } else if (_this.flag1 <= 0 && _this.flag2 <= 0 && _this.flag3 <= 0 && _this.flag4 <= 0 && _this.flag5 <= 0) {
                                        $("#batchCloseBtn").css("background-color", "#C0C0C0");
                                    } else {
                                        $("#batchCloseBtn").css("background-color", "#ff9966");
                                    }
                                }

                            });

                            //tr点击时右侧切换状态
                            $('#warn_tbody >tr').click(function () {
                                $(this).addClass('on').siblings().removeClass('on');
                                $('#faultName').html($(this).find('.gaojing_td4').html());
                                $('#faultCode').html($(this).find('.gaojing_code').val());
                                $('#updateTime').html($(this).find('.gaojing_td8').html());
                                $("#faultSrc").html("系统提示");
                                $("#creater").html("system");
                                var statusIndex = $(this).find('.gaojing_td7').attr('data-status');
                                $('#status_warn >li').eq(statusIndex).addClass('on');
                                $('.boxlists-right li').eq(0).find(".boxt2").html("系统");
                                $('.boxlists-right li').eq(0).find(".fault_box").val($('#updateTime').html());
                            });

                            $('#Paginationother').show();
                            $('#Searchresultother').show();
                            _this.startPageFlag = false;
                            if (_this.curOtherPage > 1 && _this.fddatacount <= (_this.curOtherPage - 1) * _this.sizePage) {//总数小于页数*当前页码，页码自动减一
                                _this.curOtherPage = _this.curOtherPage - 1;
                            }
                            _this.pageList(); //生成分页
                        } else {
                            _this.clearDetailMessage();//没有记录，清空数据。
                            $('#Paginationother').hide();
                            $('#Searchresultother').hide();
                            $('#warn_tbody').html('<h3 style="line-height:60px;text-align: center;">查询无数据</h3>');

                        }

                        // 更改表头显示
                        _this.changeHeadDisplay();
                        //初始化确认关闭按钮的状态
                        $("#batchCloseBtn").css("background-color", "#C0C0C0");
                        _this.flag1 = 0;
                        _this.flag2 = 0;
                        _this.flag3 = 0;
                        _this.flag4 = 0;
                        _this.flag5 = 0;
                        //选中记录行
                        _this.clearDetailMessage();
                        layer.closeAll();
                    }else{
                        _this.clearDetailMessage();//没有记录，清空数据。
                        $('#Paginationother').hide();
                        $('#Searchresultother').hide();
                        $('#warn_tbody').html('<h3 style="line-height:60px;text-align: center;">查询无数据</h3>');
                    }

                } else {
                    layer.closeAll();
                    parent.layer.open({
                        title:'提示',
                        content:res.message
                    });
                }
            });
        },

        //全选，全取消
        checkSelectItemsAndColor: function (e, checkItemName) {
            var obj = e.target;
            var len = $("[name=" + checkItemName + "]:checkbox").length;
            if (obj.checked == true) {
                this.flag1 = this.flag2 = this.flag3 = this.flag4 = this.flag5 = 0;
                for (var i = 0; i < len; i++) { //设置选中
                    $("[name=" + checkItemName + "]:checkbox").eq(i).attr("checked", 'true');
                    if ($("#process_status" + i).find("span").text() == LANG["all_station_waithand"]) {
                        this.flag1++;
                    } else if ($("#process_status" + i).find("span").text() == LANG["all_station_closed"]) {
                        this.flag2++;
                    } else if ($("#process_status" + i).find("span").text() == LANG["all_station_notrecognize"]) {
                        this.flag3++;
                    } else if ($("#process_status" + i).find("span").text() == LANG["all_station_processing"]) {
                        this.flag4++;
                    } else if ($("#process_status" + i).find("span").text() == LANG["all_station_settled"]) {
                        this.flag5++;
                    }
                }
            } else {
                for (var i = 0; i < len; i++) { //取消选中
                    $("[name=" + checkItemName + "]:checkbox").eq(i).removeAttr("checked");
                    this.flag1 = this.flag2 = this.flag3 = this.flag4 = this.flag5 = 0;
                }
            }
            if ($("#isOperate").length == 0) {
                return;
            }
            //只有这种情况才能点击批量确认
            if (this.flag3 > 0 && this.flag1 <= 0 && this.flag2 <= 0 && this.flag4 <= 0 && this.flag5 <= 0) {
                $("#batchCloseBtn").css("background-color", "#ff9966");
            } else {
                if (this.flag2 > 0) {
                    $("#batchCloseBtn").css("background-color", "#C0C0C0");
                } else if (this.flag1 <= 0 && this.flag2 <= 0 && this.flag3 <= 0 && this.flag4 <= 0 && this.flag5 <= 0) {
                    $("#batchCloseBtn").css("background-color", "#C0C0C0");
                } else {
                    $("#batchCloseBtn").css("background-color", "#ff9966");
                }
            }
        },

        // 更改表头显示
        changeHeadDisplay: function () {
            var typeInHtml = "";
            var levelInHtml = "";
            var statusInHtml = "";
            var faultTypeValue = $("#faultType").val();
            var faultLevelValue = $("#faultLevel").val();
            var faultStatusVaue = $("#faultStatus").val();
            // 故障类型
            if (faultTypeValue == 1) {
                typeInHtml = LANG["all_station_fault"];
            } else if (faultTypeValue == 2) {
                typeInHtml = LANG["all_station_warn"];
            } else if (faultTypeValue == 3) {
                typeInHtml = LANG["all_station_prompt"];
            } else if (faultTypeValue == 4) {
                typeInHtml = LANG["all_station_advice"];
            } else {
                typeInHtml = LANG["all_station_faulttype"];
            }

            exportStr = typeInHtml;
            typeInHtml = typeInHtml + '<em class="proTriangle"></em>';
            //2016 09 14 wangli 告警管理 table头部 下拉框无法同步bug修改
            $("#faultTableHead").find("th:eq(1)>a").html(typeInHtml);
            //$("#refreshTB").find("th:eq(1)>a").html(typeInHtml);

            //故障级别
            if (faultLevelValue == 1) {
                levelInHtml = LANG["all_station_levelone"];
            } else if (faultLevelValue == 2) {
                levelInHtml = LANG["all_station_leveltwo"];
            } else if (faultLevelValue == 3) {
                levelInHtml = LANG["all_station_levelthree"];
            } else if (faultLevelValue == 4) {
                levelInHtml = LANG["all_station_levelfour"];
            } else if (faultLevelValue == 5) {
                levelInHtml = LANG["all_station_levelfive"];
            } else {
                levelInHtml = LANG["all_station_faultlevel"];
            }
            exportStr = exportStr + "," + levelInHtml;

            levelInHtml = levelInHtml + '<em class="proTriangle"></em>';
            //2016 09 14 wangli 告警管理 table头部 下拉框无法同步bug修改
            $("#faultTableHead").find("th:eq(2)>div>a").html(levelInHtml);
            //$("#refreshTB").find("th:eq(1)>a").html(typeInHtml);

            //状态
            if (faultStatusVaue == 1) {
                statusInHtml = LANG["all_station_notrecognize"];
            } else if (faultStatusVaue == 2) {
                statusInHtml = LANG["all_station_waithand"];
            } else if (faultStatusVaue == 3) {
                statusInHtml = LANG["all_station_processing"];
            } else if (faultStatusVaue == 4) {
                statusInHtml = LANG["all_station_settled"];
            } else if (faultStatusVaue == 9) {
                statusInHtml = LANG["all_station_closed"];
            } else if (faultStatusVaue == 8) {
                statusInHtml = LANG["pro_management_not_closed"];
            } else {
                statusInHtml = LANG["all_station_processstatus"];
            }

            exportStr = exportStr + "," + LANG["knowledge_fault_name"] + "," + LANG["pro_management_device_interval"] + "," + LANG["pro_management_equipment"] + "," + statusInHtml + "," + LANG["pro_management_time"];
            statusInHtml = statusInHtml + '<em class="proTriangle"></em>';
            //2016 09 14 wangli 告警管理 table头部 下拉框无法同步bug修改
            $("#faultTableHead").find("th:eq(6)>div>a").html(statusInHtml);
            //$("#refreshTB").find("th:eq(1)>a").html(typeInHtml);
        },

        //没有故障数据时清空详情信息
        clearDetailMessage: function () {
            $("#faultId").val("");
            $("#faultName").html("");
            $("#faultName").attr("title", "");
            $("#deviceName").val("");
            $("#faultCode").html("");
            $("#faultCode").css("text-overflow", "ellipsis");
            $("#faultCode").attr("title", "");
            $("#orderNoEm").html("");
            $("#orderNoEm").attr("title", "");

            $("#faultCode").val("");
            $("#orderNoEm").val("");

            $("#updateTime").html("");
            $("#faultSrc").html("");
            $("#creater").html("");
            $("#processInfo").html("");
            $("#processTime").html("");

            $(".boxlists-right ul li").find("input").val("");
            $(".boxlists-right ul li").find("span.boxt2").text("");

            $(".boxlists-left ul li").removeClass("on");
            $(".boxlists-right ul li").find("span.boxt2").text("");
            $(".boxlists-right ul li").find("span.boxt2").attr("title", "");
        },

        //创建分页
        pageList: function () {
            var _this = this;
            this.sizePage = $("#pageNum option:selected").val();
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
                /**end 2016 07 06**/
                page_message: formatString(LANG["common_pagemessage"], paramArray, _this.sizePage)
            });

            function pageselectCallback(page_index) {
                _this.curOtherPage = page_index + 1;
                if (_this.startPageFlag) { //不是点击分页按钮的时候不调用search方法
                    $("#pageChange").val(_this.curOtherPage);
                    _this.search();
                }
                _this.startPageFlag = true;
            }

            $("#pageChange").val(_this.curOtherPage);
            $('#goPage').click(function () {
                _this.curOtherPage = $("#pageChange").val();
                _this.search();
            });

        },

        //故障详细页面弹窗
        showFaultDetailPage: function () {
            var _this = this;
            parent.layer.open({
                type: 2,
                title: LANG["all_station_faultdetial"],
                shadeClose: true,
                shade: 0.5,
                maxmin: true, //开启最大化最小化按钮
                area: ['700px', '600px'],
                content: ['popUp/warn_detail.html'],
                success: function (layero) {
                    $('#fault_name', layero.find("iframe")[0].contentWindow.document).html(_this.codeName);
                    $('#fault_equipment', layero.find("iframe")[0].contentWindow.document).html(_this.errorDevice);
                    $('#fault_code', layero.find("iframe")[0].contentWindow.document).html(_this.codeStr);
                    $('#fault_type', layero.find("iframe")[0].contentWindow.document).html(_this.errorTypes);
                    $('#fault_level', layero.find("iframe")[0].contentWindow.document).html(_this.errorLevel);
                    $('#processing_time', layero.find("iframe")[0].contentWindow.document).html(_this.errorStartTime);
                }
            });

        },

        //转消缺票弹窗
        cancelTicket: function () {
            var _this = this;
            parent.layer.open({
                type: 2,
                title: LANG["all_station_confirmfault"],
                shadeClose: true,
                shade: 0.5,
                maxmin: true, //开启最大化最小化按钮
                area: ['700px', '600px'],
                content: ['popUp/cancelTicket.html'],
                success: function (layero, index) {
                    $("#confirmfaultName", layero.find("iframe")[0].contentWindow.document).val(_this.codeName);
                    $("#confirmfaultCode", layero.find("iframe")[0].contentWindow.document).val(_this.codeStr);
                    $("#fault_codeId", layero.find("iframe")[0].contentWindow.document).val(_this.codeId);
                }
            });

        },

        //关闭故障弹窗
        closeTicket: function () {
            var _this = this;
            parent.layer.open({
                type: 2,
                title: LANG["all_station_closefault"],
                shadeClose: true,
                shade: 0.5,
                maxmin: true, //开启最大化最小化按钮
                area: ['700px', '600px'],
                content: ['popUp/closeTicket.html'],
                success: function (layero, index) {
                    $("#confirmfaultName", layero.find("iframe")[0].contentWindow.document).val(_this.codeName);
                    $("#confirmfaultCode", layero.find("iframe")[0].contentWindow.document).val(_this.codeStr);
                    $("#fault_codeId", layero.find("iframe")[0].contentWindow.document).val(_this.codeId);

                    $("#close_fault_btn", layero.find("iframe")[0].contentWindow.document).click(function () {
                        var Parameters = {
                            "parameters": {
                                "stationid": _this.stationId,
                                "fd_alarm_code": $("#confirmfaultCode", layero.find("iframe")[0].contentWindow.document).val(),
                                "fd_alarm_state": 3  //手动关闭
                            },
                            "foreEndType": 2,
                            "code": "30000023"
                        }
                        vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                            if (res.success) {
                                alert('手动关闭成功');
                                parent.layer.closeAll();
                                _this.search();
                                //parent.location.reload();

                            }
                        })
                    });
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
                        resArr = [];

                    $.each(stationRes, function (key, value) {
                        if (value.fd_station_status == 2) {
                            resArr.push(value);
                        }
                    });

                    //获取用户权限电站
                    $.ajax({
                        type: "get",
                        url: vlm.serverAddr + "sys/user/info/" + $.cookie('userId'),
                        data: "",
                        dataType: "json",
                        success: function (res) {
                            if (res.code == 0) {

                                if (res.user.psList === null || res.user.psList.length < 1) {

                                } else if (res.user.psList.length >= 1) {
                                    if (res.user.psList[0] == "all") {
                                        _this.newStationList = resArr;
                                    } else {
                                        var info_station_arr = res.user.psList;
                                        for (var i = 0; i < resArr.length; i++) {
                                            for (var j = 0; j < info_station_arr.length; j++) {
                                                if (resArr[i].fd_station_code.toLowerCase() == info_station_arr[j]) {
                                                    _this.newStationList.push(resArr[i]);
                                                }
                                            }
                                        }
                                    }
                                }
                                var stationList_tpl = $('#station_filter_tpl').html();
                                var stationStr = ejs.render(stationList_tpl, {newStationList: _this.newStationList});
                                $('#station_per_ul').html(stationStr);

                                $('#station_per_ul .sta_tit').click(function(e){

                                    //更换左侧列表电站

                                    $('#station_per_ul >li').removeClass('on');
                                    if (!$(this).parent().hasClass('on')) {
                                        $(this).parent().addClass('on');
                                        _this.stationId = $(this).parent().attr('id');
                                        _this.fd_dev_id = "";
                                        _this.firstTreeFlag = true; //重置首次树boolean
                                        $('.ztree').remove(); //清空ztree
                                        _this.showTree(_this.stationId, '0');
                                    }


                                    _this.curOtherPage = 1;
                                    _this.search();

                                });


                                //写死
                                _this.stationId = _this.newStationList[4].fd_station_code.toLowerCase();
                                _this.loadPage();  //初始化页面

                            }
                        }

                    });
                }

            });
        },

        loadPage:function(){
            this.initTime();  //初始化时间
            this.initPageSize(); //初始化页面尺寸

            this.showTree('gs', '0');   //tree  根节点id  '0'首次默认不是数据
        },

    }
    ,
    mounted: function () {

        this.getAllStation(); //获取电站列表
    }
});

function doChangePage() {
    vm.sizePage = $("#pageNum option:selected").val();
    vm.curOtherPage = 1;
    vm.search()
}




