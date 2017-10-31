new Vue({
    el: '#popInverter',
    data: {
        stationId: 'gs', //电站id
    },
    methods: {
        getInverterList: function () {
            var Parameters = {
                "parameters": {
                    "stationid": "gs",
                    "fd_dev_id": $('#devid').val(),
                },
                "foreEndType": 2,
                "code": "30000043"
            }

            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                var data = res.data;
                var inverterHtml = '';
                for (var i = 0; i < data.length; i++) {
                    inverterHtml += '<tr>'+
                        '<td>'+
                        '<input type="hidden" class="cbox" value="108816_1096954">'+data[i].fd_name+
                        '</td>'+
                        '<td><h2>'+data[i].fd_value_i+'A</h2>'+
                        '<div class="demo">'+
                        '<div class="progress_container bar_bg1">'+
                        '<div class="progress_bar tip " '+
                        'style="width: 3.91%;"></div>'+
                        '</div>'+
                        '</div>'+
                        '</td>'+
                        '<td>'+
                        '<h2>'+data[i].fd_value_v+'v</h2>'+
                        '<div class="demo">'+
                        '<div class="progress_container bar_bg1">'+
                        '<div class="progress_bar tip " '+
                        'style="width: 81.4%;"></div>'+
                        '</div>'+
                        '</div>'+
                        '</td>'+
                        '</tr>';
                }
                $('#showInverttable tbody').html(inverterHtml);

            })
        }
    },
    mounted: function () {
        var _this=this;
        setTimeout(function(){
            _this.getInverterList();
        },100);

    }
});