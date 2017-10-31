new Vue({
    el: '#companyReport',
    data: {},
    methods: {

        initTime: function () {
            var _this = this;
            $('.showm_table_rep').css({
                maxHeight: $(window).height() - 180,
                overflowY: 'scroll'
            });
            $(window).resize(function () {
                $('.showm_table_rep').css({
                    maxHeight: $(window).height() - 180,
                    overflowY: 'scroll'
                });
            });

            $('#dateInput').val(vlm.Utils.getTrueDate());

            $("#dateInput").click(function () {
                WdatePicker({
                    dateFmt: 'yyyy/MM/dd',
                    maxDate: '%y/%M/%d',
                    isShowClear: false,
                    readOnly: true,
                    onpicking: function (dp) {
                        _this.getReport(dp.cal.getNewDateStr());
                    }
                });
            });

            this.getReport($('#dateInput').val());
        },

        //获取报表数据
        getReport: function (key) {
            var dateNum = key.replace(/\//g, "");
            var startDateStr = dateNum.substring(0, 6) + '01000000';
            var year = dateNum.substring(0, 4);
            var month = dateNum.substring(4, 6);
            var day = dateNum.substring(6);
            if (month < 10) {
                month = month.substring(1);
            }
            if (day < 10) {
                day = day.substring(1);
            }
            var date = new Date();
            date.setFullYear(year, month - 1, day);
            var Month = date.getMonth() + 1;
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            var endDateStr = date.getFullYear() + '' + dealDate(Month) + '' + dealDate(day) + dealDate(hour) + dealDate(minute) + dealDate(second);
            $(".showm_bottom .loadingDiv").show();
            var Parameters = {
                "parameters": {
                    "stationtype": "allstation",
                    "timetype": "3",
                    "sorttype": "1",
                    "sort": "1",
                    "starttime": startDateStr,
                    "endtime": endDateStr,
                    "topn": "1000",
                    "stationid": ""
                },
                "foreEndType": 2,
                "code": "20000005"
            };
            layer.load(0, 2);
            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                console.log(res);
                layer.closeAll();  //关闭请求动画
                if (res.success) {
                    var reportArr = res.data.fd_datas;
                    if (reportArr.length) {
                        var reportStr = $('#powerReport_tpl').html();
                        trHtml = ejs.render(reportStr, {reportArr: reportArr});
                        $("#tbody_report").html(trHtml);
                    } else {
                        $("#tbody_report").html('<h3 class="none_Date">查询无数据</h3>');
                    }
                } else {
                    $("#tbody_report").html('<h3 class="none_Date">查询无数据</h3>');

                }
            });
        },
    },
    mounted: function () {
        this.initTime();
    }
});