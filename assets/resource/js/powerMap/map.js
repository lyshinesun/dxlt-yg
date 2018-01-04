new Vue({
    el: '#powerMap',
    data: {
        stationId: '',  //电站Id
        station_degree: [],
        map: null,
        firstStationName: '',
        newStationList:[] // 最终的电站列表
    },
    methods: {
        initSize: function () {
            $('.tendency_ri').height($(window).height() - 80);
            $('.map_con_fl').height($(window).height() - 80);
            $(window).resize(function () {
                $('.tendency_ri').height($(window).height() - 80);
                $('.map_con_fl').height($(window).height() - 80);
            });
        },

        //获取电站列表
        /*getAllStation: function () {
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
                    })


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


                                for (var i = 0; i < _this.newStationList.length; i++) {
                                    var obj = {
                                        code: _this.newStationList[i].fd_station_code,
                                        name: _this.newStationList[i].fd_station_name,
                                        lot: _this.newStationList[i].fd_longitude,
                                        lat: _this.newStationList[i].fd_latitude,
                                    }
                                    _this.station_degree.push(obj);
                                }

                                var stationList_tpl = $('#stationList').html();
                                var stationStr = ejs.render(stationList_tpl, {newStationList: _this.newStationList});
                                $('#powerList').html(stationStr);

                                _this.stationId = _this.newStationList[0].fd_station_code;

                                _this.getMapByUser();

                                $('#powerList li').click(function () {
                                    $(this).addClass('on').siblings().removeClass('on');
                                    _this.stationId = $(this).attr('id');
                                    _this.getMapByUser($(this));

                                });

                            }
                        }

                    });
                }

            });
        },*/
        getAllStation: function () {
            var _this = this
            $.ajax({
            url: vlm.serverAddr + "stationbaseinfo/getPsList",    //请求地址
            dataType: "json",
            type : "GET",
            success:function(res){
                    _this.newStationList = res.list
                    _this.stationId = _this.newStationList[0].fdStationCode
                    _this.firstStationName = _this.newStationList[0].fdStationName
                    /* var stationList_tpl = $('#station_filter_tpl').html();
                    var stationStr = ejs.render(stationList_tpl, {newStationList: _this.newStationList});
                    $('#station_per_ul').html(stationStr);
                     _this.loadPage(); */ //初始化页面

                    for (var i = 0; i < _this.newStationList.length; i++) {
                        var obj = {
                            code: _this.newStationList[i].fdStationCode,
                            name: _this.newStationList[i].fdStationName,
                            lot: _this.newStationList[i].fdLongitude,
                            lat: _this.newStationList[i].fdDimens,
                        }
                        _this.station_degree.push(obj);
                    }

                    var stationList_tpl = $('#stationList').html();
                    var stationStr = ejs.render(stationList_tpl, {newStationList: _this.newStationList});
                    $('#powerList').html(stationStr);

                    _this.stationId = _this.newStationList[0].fdStationCode;

                    _this.getMapByUser();

                    $('#powerList li').click(function () {
                        $(this).addClass('on').siblings().removeClass('on');
                        _this.stationId = $(this).attr('id');
                        _this.getMapByUser($(this));

                    });
                }
            });
        },

        //获取地图坐标
        getMapByUser: function (obj) {
            if (obj) {
                obj.addClass('on').siblings().removeClass('on');
                this.stationId = obj.attr('id').toLowerCase();
            }

            this.drawMap(this.stationId);
        },

        drawMap: function (powerid) {
            var _this = this;
            $('#power_map').css('height', $('#content_tot').height())
            // 百度地图API功能
            this.map = new BMap.Map("power_map", {enableMapClick: true});//构造底图时，关闭底图可点功能
            this.map.addControl(new BMap.NavigationControl());
            this.map.addControl(new BMap.ScaleControl());
            this.map.enableScrollWheelZoom(true);
            this.map.disableDoubleClickZoom();
            this.map.disableDoubleClickZoom();
            this.map.setMapStyle({style: 'light'})

            var mapArr = this.station_degree;
            // 向地图添加标注
            var icons = '';
            for (var i = 0; i < mapArr.length; i++) {

                icons = 'resource/images/green.png';
                var myIcon = new BMap.Icon(icons, new BMap.Size(20, 30), {
                    offset: new BMap.Size(10, 25), // 指定定位位置
                    imageOffset: new BMap.Size(0, 0), // 设置图片偏移
                });

                var lon = mapArr[i].lot, lat = mapArr[i].lat;
                var pt = new BMap.Point(lon, lat);
                var marker = new BMap.Marker(pt, {
                    icon: myIcon,
                    title: mapArr[i].name
                });

                var label = new BMap.Label(String(mapArr[i].code), {offset: new BMap.Size(5, 3)});
                marker.setLabel(label);
                label.setStyle({display: "none"});

                this.map.addOverlay(marker);//添加覆盖物

                marker.addEventListener("click", function (e) {
                    _this.stationId = e.target.getLabel().content;
                    _this.changePos(e.target);
                });

            }
            ;
            var markers = this.map.getOverlays();
            for (var i = 0; i < markers.length; i++) {
                if (markers[i].toString() == "[object Marker]") {
                    if (markers[i].getLabel().content.toLowerCase() == this.stationId.toLowerCase()) {
                        _this.stationId = markers[i].getLabel().content;
                        _this.changePos(markers[i]);

                    }
                }
            }
        },

        //图标点击
        changePos: function (obj) {
            var tips = obj.getLabel().content, lot, lat;
            for (var i = 0; i < this.station_degree.length; i++) {
                if (tips == this.station_degree[i].code) {
                    lot = this.station_degree[i].lot;
                    lat = this.station_degree[i].lat;
                }
            }
            var $li = $('#' + this.stationId)
            $li.addClass('on').siblings().removeClass('on')
            var point = new BMap.Point(lot, lat);
            this.map.centerAndZoom(point, 13);

            var _this = this, that = obj,
                Parameters = {
                    "parameters": {
                        "stationid": this.stationId
                    },
                    "foreEndType": 2,
                    "code": "20000010"
                };
            vlm.loadJson("", JSON.stringify(Parameters), function (result) {
                if (result.success) {
                    var result = result.data;

                    for (var name in result) {
                        if (result[name] == null) {
                            result[name] = '--';
                        }
                    }
                    var sContent = '<div class="site">' +
                        '<div class="site_1 clearfix">' +
                        '<span class="fl site_pic">' +
                        '<img id="weatherIcon" src="resource/images/weather/34.png" alt="">' +
                        '</span>' +
                        '<span class="fl site_tit" id="ps_name_2" onclick="gotoSinglePsInfo()" style="cursor: pointer">' + result.fd_station_name.substring() + '</span>' +
                        '<span class="fl font14" id="design_capacity">装机功率:' + result.fd_all_intercon_cap + 'kW</span>' +
                        '</div>' +
                        '<div class="site_2">' +
                        '<table>' +
                        '<tbody><tr>' +
                        '<td>' +
                        '<h2>电站功率</h2>' +
                        '<p id="nowCapacity">' + result.fd_all_pw + result.fd_all_pw_unit + '</p>' +
                        '<br></td>' +
                        '<td>' +
                        '<h2>日发电量</h2>' +
                        '<p id="dayPower">' + result.fd_all_power_day + result.fd_all_power_day_unit + '</p>' +
                        '<br></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td>' +
                        '<h2>电站PR</h2>' +
                        '<p id="PRValue">' + result.pr + '%</p>' +
                        '<br></td>' +
                        '<td>' +
                        '<h2>等效小时</h2>' +
                        '<p id="eqValue">' + result.hour + '</p>' +
                        '<br></td>' +
                        '</tr>' +
                        '</tbody></table>' +
                        '</div>' +
                        '<div class="site_3">' +
                        '<ul class="clearfix">' +
                        '<li class="clearfix">' +
                        '<br></li>' +
                        '<li class="clearfix">' +
                        '<span class="fl">未确认</span><span class="number fl"><a href="javascript:void(0);" class="alinkNumber" onclick="goToFaultPage(109192,1);">--</a></span>' +
                        '<br></li>' +
                        '<li class="clearfix">' +
                        '<span class="fl">待处理</span><span class="new_active fl"><a href="javascript:void(0);" class="alinkNumber" onclick="goToFaultPage(109192,2);">--</a></span>' +
                        '<br></li>' +
                        '<li class="clearfix"><span class="fl">处理中</span><span class="finishing fl"><a href="javascript:void(0);" class="alinkNumber" onclick="goToFaultPage(109192,3);">--</a></span>' +
                        '<br></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>';
                    var infoWindow = new BMap.InfoWindow(sContent);//创建信息窗口对象
                    infoWindow.disableAutoPan();//关闭打开信息窗口时地图自动平移。
                    that.openInfoWindow(infoWindow);

                }
            });
        }
    },

    mounted: function () {

        this.initSize();
        this.getAllStation();
    }
});

