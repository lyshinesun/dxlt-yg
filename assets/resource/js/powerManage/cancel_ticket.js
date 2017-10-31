new Vue({
    el: '#cancelTicket',
    data: {
        stationId: 'gs', //电站id
        serverAddr: "http://192.168.2.214:8011/dxsky/",
    },
    methods: {
        //确认转消缺票
        ticket_sure: function () {
            var types = [],_this=this;
            var wran_route = $('#warn_styles input[name="warn_routes"]');
            if (wran_route.eq(1).is(':checked')) {
                types.push(0);
            } else if (wran_route.eq(2).is(':checked')) {
                types.push(1);
            }
            $.ajax({
                type: "get",
                url: this.serverAddr + 'tbalarmdata/addWOrder',
                dataType: "json",
                traditional: true,//这里设置为true
                data: {
                    "typeAlarm": types,//勾选告警方式，pc不用传，0短信，1邮件，int数组
                    "opinion": $('#opinion').val(),//处理意见
                    "aNum": $('#confirmfaultCode').val(),//故障编号
                    "fauId": $('#fault_codeId').val(),//故障id
                    "fdPsid": this.stationId, //电站id
                    "userId": Number($('#manage_man option:selected').val())//绑定工单的处理人
                },
                success: function (res) {
                    if (res.code === 0) {
                        //调用更新告警列表的接口
                        var Parameters = {
                            "parameters": {
                                "stationid": _this.stationId,
                                "fd_alarm_code": $('#confirmfaultCode').val(),
                                "fd_order_state": 1
                            },
                            "foreEndType": 2,
                            "code": "30000023"
                        }
                        vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                            console.log(res);
                            if (res.success) {
                                alert('操作成功');
                                parent.layer.closeAll();
                                parent.location.reload();
                            }
                        })

                    } else {
                        alert(res.msg);
                    }
                }
            });
        },
        //获取处理人列表
        getUserList: function () {
            $.ajax({
                url: this.serverAddr + 'sys/user/list',
                dataType: 'json',
                data: {
                    "limit": '10000',
                    "page": '1'
                },
                type: 'get',
                success: function (res) {
                    if (res.code === 0) {
                        var userList = res.page.list, listStr = '<option>请选择</option>';
                        userList.forEach(function (val, index, list) {
                            listStr += '<option value="' + res.page.list[index].userId + '">' + res.page.list[index].username + '</option>';
                        });
                        $('#manage_man').append(listStr);
                    } else {
                        alert(res.msg);
                    }
                }
            });
        }
    },
    mounted: function () {
        //获取处理人列表
        this.getUserList();
    }
});