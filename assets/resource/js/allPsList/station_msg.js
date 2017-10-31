new Vue({
        el: '#power_msg',
        data: {
            stationId: 'gs',
            //基本信息
            station_name: '--',    //电站名称
            fd_city: '--', //地址
            station_administrative_area: '--', //行政区划
            fd_sys_solut: '--', //系统方案
            station_latlong: '--', //经度纬度
            station_capacity: '--', //装机功率

            newStationList:[] //电站列表
        },
        methods: {
            initSize: function () {
                $('.tendency_ri').height($(window).height() - 80);
                $('.map_con_fl').height($(window).height() - 80);
                $(window).resize(function () {
                    $('.tendency_ri').height($(window).height() - 80);
                    $('.map_con_fl').height($(window).height() - 80);
                });
            }
            ,

            //获取电站列表
            getAllStation: function () {
                var _this=this;
                var Parameters = {
                    "parameters": {"stationid": "", "statusstr": ""},
                    "foreEndType": 2,
                    "code": "20000006"
                };
                vlm.loadJson("", JSON.stringify(Parameters), function(res){
                    if(res.success){
                        var stationRes=res.data,
                            resArr = [];

                        $.each(stationRes,function(key,value){
                            if(value.fd_station_status == 2){
                                resArr.push(value)
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

                                    var stationList_tpl = $('#stationList').html();
                                    var stationStr = ejs.render(stationList_tpl, {newStationList: _this.newStationList});
                                    $('#powerList').html(stationStr);

                                    _this.stationId = _this.newStationList[0].fd_station_code;
                                    _this.fd_city = _this.newStationList[0].fd_city,    //电站地址

                                        $('#powerList li').click(function(){
                                            $(this).addClass('on').siblings().removeClass('on');
                                            _this.stationId = $(this).attr('id');
                                            _this.fd_city = $(this).attr('data-fd_city');    //电站地址
                                            _this.getDetail();

                                        });
                                    _this.getDetail();

                                }
                            }

                        });
                    }

                });
            },

            getDetail: function () {
                var _this = this,
                    Parameters = {
                        "parameters": {
                            "stationid": this.stationId
                        },
                        "foreEndType": 2,
                        "code": "20000010"
                    };
                layer.load(0, 2);
                $('#slideImg').html('');
                vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                    layer.closeAll();
                    if (res.success) {
                        var result = res.data;
                        //电站简介
                        $('#ps_des').html(result.fd_station_desc);

                        //图片展示
                        if (result.fd_station_pic && result.fd_station_pic.length) {
                            var imgLi = result.fd_station_pic;
                            for (var i = 0; i < imgLi.length; i++) {
                                imgLi[i] = imgLi[i].replace(/\\/g, '/').replace(/:\//g, '://'); //匹配反斜杠
                            }

                            var img_tpl = $('#station_img_tpl').html();
                            var imgStr = ejs.render(img_tpl, {imgLi: imgLi});
                            $('#slideImg').html(imgStr);

                            $(".siteMore_con_ri_tog").slide({
                                mainCell: ".bd ul",
                                titCell: ".hd li",
                                effect: "topLoop",
                                autoPlay: true
                            });
                            $(".siteMore_con_ri_tog .hd").slide({
                                mainCell: "ul",
                                prevCell: ".siteMore_con_ri_togprev",
                                nextCell: ".siteMore_con_ri_tognext",
                                vis: 3,
                                effect: "topLoop",
                                scroll: 1
                            });
                            $(".siteMore_con_ri").slide({
                                titCell: ".siteMore_con_ri_tit li",
                                mainCell: ".siteMore_con_ri_wrap",
                                effect: "fold",
                                trigger: "click"
                            })

                        };

                        //基本信息
                        _this.station_name = result.fd_station_name,    //电站名称
                            _this.fd_sys_solut = result.fd_sys_solut,    //系统方案

                            _this.station_capacity = result.fd_all_intercon_cap + 'kWp' //装机功率
                    }
                })
            }
        },
        mounted: function () {
            this.initSize();
            this.getAllStation(); //获取电站列表

        }
    }
)
;



