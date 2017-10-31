new Vue({
    el: '#power_list',
    data: {
        stationId:'gs'
    },
    methods: {
        initSize: function () {
            $('#contentDiv').height($(window).height() - 100);
            $(window).resize(function () {
                $('#contentDiv').height($(window).height() - 100);
            });
        },

        getStationList: function () {

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
        }
    },
    mounted: function () {
        this.initSize();
        this.getStationList();

    }
});



