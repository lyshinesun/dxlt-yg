new Vue({
    el: '#power_list',
    data: {
        // stationId:'',
        currentDate: '',
        stationList:[],
        totalCount:0
    },
    methods: {
        gotoStationUnit: function(stationCode) {
            window.parent.stationId = stationCode
            top.location.hash = '#station_unit';
            $('#index_frame', parent.document).attr('src', 'dialog/station_unit.html');
        },
        datePicker: function () {
            var _this = this
            //绑定picker
            $('#new_datetimepicker_mask').click(function () {
                WdatePicker({
                    isShowToday: false,
                    dateFmt: 'yyyy-MM-dd',
                    isShowClear: false,
                    isShowOK: true,
                    isShowToday: false,
                    readOnly: true,
                    maxDate: '%y-%M-%d',
                    onpicked: function (dp) {
                        //alert(dp.cal.getNewDateStr());
                        $("#new_datetimepicker_mask").val(dp.cal.getNewDateStr());
                        _this.currentDate = dp.cal.getNewDateStr()
                        _this.getStationList()
                    }
                })

            });
        },
        initTime: function () {
            var _this = this;
            var now = new Date();
            // var min = now.getMinutes() >= 10 ? now.getMinutes() : ("0" + now.getMinutes());
            var mon = (now.getMonth() + 1) >= 10 ? (now.getMonth()  + 1) : ("0" + (now.getMonth() + 1));
            var date = now.getDate() >= 10 ? now.getDate() : ("0" + now.getDate());
            // var hour = now.getHours() >= 10 ? now.getHours() : ("0" + now.getHours());
            /*min = getFiveMinutes(min);*/ //取整五分钟
            _this.currentDate = now.getFullYear() + "-" + mon + "-" + date;
            $("#new_datetimepicker_mask").val(_this.currentDate);
        },

        initSize: function () {
            $('#contentDiv').height($(window).height() - 100);
            $(window).resize(function () {
                $('#contentDiv').height($(window).height() - 100);
            });
        },

        /*getStationList: function () {

            var dates = new Date(),
                _this = this,
                endDate = dates.getFullYear() + '-' + (dates.getMonth() + 1) + '-' + dates.getDate() + 'T' + dates.getHours() + ':' + dates.getMinutes() + ':' + dates.getSeconds(),
                endDateStr = vlm.Utils.format_date(endDate, 'YmdHis'),
                startDateStr = vlm.Utils.currentDay();

            var Parameters = {
                "parameters": {
                    "stationtype": "",
                    "timetype": '2',
                    "sorttype": "1",
                    "sort": '1',
                    "starttime": startDateStr,
                    "endtime": endDateStr,
                    "topn": "1000",
                    "stationid": ""
                },
                "foreEndType": 2,
                "code": "20000005"
            }

            var stationidArr=[];

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
                                Parameters.parameters.stationtype='allstation';
                            } else {
                                Parameters.parameters.stationid=res.user.psList.join(',');
                            }
                        }

                        layer.load(0,2);

                        vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                            layer.closeAll();
                            if (res.success) {
                                var powerList = res.data.fd_datas;
                                var listhtml = $('#station_list_tpl').html();
                                var resList = ejs.render(listhtml, {powerList: powerList});
                                $('#detailList').html(resList);

                                $('.link_unit >img').off().click(function(){
                                    $('.sub_nav a',parent.document).removeClass('on');
                                    $('#station_unit',parent.document).addClass('on');
                                    top.location.hash = '#station_inverter';
                                    $('#index_frame',parent.document).attr('src','dialog/station_unit.html');
                                });

                            }
                        })

                    }
                }

            });
        },*/
        getStationList: function () {
            var _this = this
            //获取用户权限电站
            $.ajax({
                type: "get",
                url: vlm.serverAddr + "stationbaseinfo/getPsListData",
                data: {
                    "logDate": _this.currentDate
                },
                dataType: "json",
                success: function (res) {
                    if (res.code == 0) {
                        _this.totalCount = res.list.length
                        _this.stationList = res.list
                    }
                }

            });
        }
    },
    mounted: function () {
        this.initSize()
        this.initTime()
        this.getStationList()
        this.datePicker()
    },
    created: function () {
        
    }
});



