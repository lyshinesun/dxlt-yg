new Vue({
    el: '#closeTicket',
    data: {
        stationId: 'gs', //电站id
    },
    methods: {
        //确认转消缺票
        closeFault: function () {
            var _this=this;
            //调用更新告警列表的接口
            var Parameters = {
                "parameters": {
                    "stationid": _this.stationId,
                    "fd_alarm_code": $('#confirmfaultCode').val(),
                    "fd_alarm_state": 3  //手动关闭
                },
                "foreEndType": 2,
                "code": "30000023"
            }
            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                console.log(res);
                if (res.success) {
                    alert('手动关闭成功');
                    parent.layer.closeAll();
                    parent.location.reload();
                }
            })
        }
    },
    mounted: function () {

    }
});