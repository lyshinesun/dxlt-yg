new Vue({
    el: '#inverter_monitor',
    data: {
        stationList:[],
        stationId: '',
        inverterList: [],
        inverterFilterList: [],
        totalCount0: 0, //故障运行数量
        totalCount1: 0, //异常运行数量
        totalCount2: 0, //正常运行数量
        totalPower: '无', //总发电量
        dayPower:'无', // 日发电量
        temperature: '无', // 环境温度
        currP: '无', //当前功率
        BBT: '无', //电池板温度
        selectFilter: '0',
        currDate: '',
        cityName: '',
        diagIsOpen: true,
        timerH: null //定时刷新页面的句柄
    },
    methods: {
        //获取当前时间
        getCurrDate () {
            this.currDate = vlm.Utils.GetDay() + ':00'
        },
        //更换左侧列表电站
        changeStation (e) {
            var target = null;
            if (e == 1) {
            } else {
                if ($(e.target)[0].tagName == 'A') {
                    target = $(e.target).parent();
                    this.cityName = target.attr('data-city')
                    this.loadWeather(this.cityName)
                    if ($(e.target).hasClass('sta_tit')) {
                        target.addClass('on').siblings().removeClass('on');
                        this.stationId = target.attr('id')
                        this.selectFilter = '0'
                        this.currDate = vlm.Utils.GetDay() + ':00'
                    }
                }
            }
        },
        /*获取电站列表*/
        getStations (res) {
            var _this = this
            _this.stationList = res.list
            /*_this.stationId = 'DZZCL'
            _this.cityName = '德州'*/
            this.loadWeather(_this.cityName)
            // _this.stationName = _this.stationList[0].fdStationName
        },
        // 获取电站基本信息
        getStationInfo () {
            var _this = this 
            $.ajax({
            url: vlm.serverAddr + 'stationbaseinfo/getPowerByPsid',   //获取电站详细信息
            dataType: "json",
            type : "GET",
            data:{
                "psid": _this.stationId
            },
            success:function(res){
                    if (res.code == 0) {
                        var data = res.obj[0]
                        if (data) {
                           // 累计总发电量 返回数据匹配单位：万千瓦时
                            _this.totalPower = (data.fdPowerCurr || data.fdPowerCurr==0) ? _this.computeNumberLength(data.fdPowerCurr).full : '无'
                            // 日发电量 返回数据匹配单位：千瓦时
                            _this.dayPower = (data.fdPowerDay ||data.fdPowerDay==0) ? (Number(data.fdPowerDay) * 10000).toFixed(2)  + 'kwh' : '无'
                            // 当前功率 返回数据匹配单位：kw
                            _this.currP = (data.fdPwCurr || data.fdPwCurr==0) ? Number(data.fdPwCurr).toFixed(2) + 'kw' : '无' 
                        } else {
                            _this.totalPower = '无' //总发电量
                            _this.dayPower ='无' // 日发电量
                            _this.temperature = '无' // 环境温度
                            _this.currP = '无' //当前功率
                        }
                        
                    }
                }
            });
        },
        initPageSize () {
            var _this = this;
            $('#map_wap_div').height($(window).height() - 80);
            $('.map_con_fl').height($(window).height() -80);
            $('#inverter_page').height($(window).height());
            $('.inverter_list').height($('#inverter_page').height() - 240);
            
            $(window).resize(function () {
                $('#map_wap_div').height($(window).height() - 80);
                $('.map_con_fl').height($(window).height() - 80);
                $('#inverter_page').height($(window).height());
                 $('.inverter_list').height($('#inverter_page').height() - 240);
            });
        },
        getInverterList () {
            var _this = this
            var index = null
            index = parent.layer.load(1, {shade: [0.5, '#D2D3D5']})
            $.ajax({
                url: vlm.serverAddr + 'stationbaseinfo/getDevNlist',  //请求地址
                dataType: "json",
                data:{
                    "psid": _this.stationId
                },
                type : "GET",
                success: function(res){
                    if (res.code == 0 && res.list.length) {
                        _this.inverterList = res.list
                        _this.inverterFilterList = _this.inverterList;
                        _this.inverterList.forEach(function (item) {
                            var pvSize = item.pvSize
                            var resWarningList = item.list
                            var state = item.stuta
                            if (item.fdPr1 > 100) {
                                item.fdPr1 = Number(item.fdPr1.toString().substring(0,2))
                            }
                            item.fdPower = _this.computeNumberLength(item.fdPower).number + 'kwh'
                            item.fdPowerCurr = _this.computeNumberLength(item.fdPowerCurr).number.toFixed(1) + '万kwh'
                            item.warningList = _this.handleInverterData(state,pvSize,resWarningList)
                            switch (item.stuta)
                            {
                                case '0':
                                item.src = '../resource/images/realtime_monitor/inverter_wrong.gif';
                                break;
                                case '1':
                                item.src = '../resource/images/realtime_monitor/inverter_warn.gif';
                                break;
                                case '2':
                                item.src = '../resource/images/realtime_monitor/inverter_normal.gif';
                                break;
                            }
                        })
                         _this.inverterList.sort(_this.inverterListSort('stuta'))
                          _this.filteInverterList(_this.selectFilter)
                        // _this.inverterFilterList = _this.inverterList;
                        // console.log(_this.inverterList)
                        if (res.psInfo.count2 || res.psInfo.count2==0) {
                            _this.totalCount2 = res.psInfo.count2 //正常运行数量
                        }
                        if (res.psInfo.count1 || res.psInfo.count1==0) {
                            _this.totalCount1 = res.psInfo.count1 //部分异常运行数量
                        }
                        if (res.psInfo.count0 == 0 || res.psInfo.count0) {
                            _this.totalCount0 = res.psInfo.count0 //故障运行数量
                        }
                        
                        
                        parent.layer.close(index)
                    } else {
                        _this.inverterList = []
                        _this.inverterFilterList = []
                        _this.totalCount0 = 0, //故障运行数量
                        _this.totalCount1 = 0, //异常运行数量
                        _this.totalCount2 = 0,
                        // _this.totalPower = '无', //总发电量
                        // _this.dayPower = '无', // 日发电量
                        // _this.currP = '无', //当前功率
                        parent.layer.close(index)
                        parent.layer.open({
                          title: '提示',
                          content: '电站数据异常,请联系管理员'
                        });
                    }
                    // console.log(_this.inverterList)
                },
                error: function () {
                    parent.layer.open({
                      title: '提示',
                      content: '数据异常'
                    });
                    parent.layer.close(index)
                }
            });
        },
        showCurve (e) {
            var _this = this
            _this.diagIsOpen = true
            var stationId = _this.stationId
            var inverterId = e.target.id
            var titleStr = inverterId + '号逆变器组串曲线图'
            // console.log(this.stationId, e.target.id)
            parent.layer.open({
                type: 2,
                title: titleStr,
                shadeClose: false,
                shade: 0.5,
                maxmin: true,
                time: 0,
                area: ['1120px', '680px'],
                content: ['popUp/realtime_monitor/inverter_monitor_pop.html?stationId='+ stationId + '&inverterId=' + inverterId],
                success: function (layero, index) {
                    var iframeO = layero.find("iframe")[0].contentWindow.document;
                },
                cancel: function (layero, index) {
                    _this.diagIsOpen = false
                }
            });
        },
        // 根据接口返回的故障组串索引，补全所有组串的状态信息
        handleInverterData (state, pvSize, resWarningList) {
            var warningList = []
            for (var i = 0; i<pvSize; i++) {
                warningList.push(0) //0：组串所有正常
            }
            if (state ==0 || state ==1 ) {
                for (var j=0; j<resWarningList.length; j++) {
                    warningList[resWarningList[j]] = 1 //1：组串电流为零或偏低
                }
            }
            return warningList
        },
        //筛选排序工具
        inverterListSort (property) {
            return function(a,b){
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        },
        //加载电站天气
        loadWeather (cityName) {
            var _this = this,
                url = 'http://api.map.baidu.com/telematics/v3/weather?location=' + cityName + '&output=json&ak=0h08YBBvVkr746zjlN9k0ftG94oMjEgM';
            $.ajax({
                url: url,
                type: 'GET',
                asyn: false,
                data: '',
                dataType: 'jsonp',
                success: function (res) {
                    if (res.status == 'success') {
                        var weatherArr = res.results[0].weather_data,
                            todayWthObj = weatherArr[0];//今天
                        _this.wertherName = todayWthObj.weather;
                        var tempArr = todayWthObj.temperature.split('~');
                        tempArr[0] = vlm.Utils.trim(tempArr[0]);
                        tempArr[1] = vlm.Utils.trim(tempArr[1]);
                        _this.temperature = weatherArr[0].date.match(/(\-?)\d*℃/ig)[0]
                        _this.BBT = _this.temperature
                    }
                },
                error: function (res) {
                    alert(res.message);
                }

            });
        },
        //数据的处理
        computeNumberLength (n) {
            try {
                var avgLth = parseInt(Math.abs(n)).toString().length;
                if (avgLth < 4) return {number: n.toFixed(2), unit: '万kwh', full: n.toFixed(2) + '万kwh'};
                if (avgLth < 8) return {number: (n / 10000).toFixed(2), unit: '亿kwh', full: (n / 10000).toFixed(2) + '亿kwh'};
                // if (avgLth < 12) return {number: (n / 100000000).toFixed(2), unit: '亿kwh', full: (n / 100000000).toFixed(2) + '亿kwh'};
                // if (avgLth < 16) return {number: (n / 1000000000000).toFixed(2), unit: '万亿kwh', full: (n / 1000000000000).toFixed(2) + '万亿元'}
            } catch (err) {
                console.log('计算单位出错,错误信息:', err)
            }
        },
        //定时刷新页面
        refreshPage (timer) {
            var _this = this
            _this.timerH = setInterval(function(){
                _this.getCurrDate()
                _this.getStationInfo()
                _this.getInverterList()
                // _this.filteInverterList(_this.selectFilter)
            }, timer)
        },
        //筛选过滤inverterList
        filteInverterList (selectMode) {
            switch (selectMode)
            {
                case '0':
                this.inverterFilterList = this.inverterList;
                break;
                case '1':
                this.inverterFilterList = this.inverterList.filter(function (item) {
                    return item.stuta == '2'
                });
                break;
                case '2':
                this.inverterFilterList = this.inverterList.filter(function (item) {
                    return item.stuta == '0' //支路全部为零的
                });
                break;
                case '3':
                this.inverterFilterList = this.inverterList.filter(function (item) {
                    return item.stuta == '1' //存在直流为零的
                });
                break;
            }
        },
        /*获取url中的查询字符串的值*/
        getSearchString: function (key) {
          var str = location.search
          str = str.substring(1,str.length)
          var arr = str.split("&")
          var obj = new Object()
          for(var i = 0; i < arr.length; i++) {
            var tmp_arr = arr[i].split("=")
            obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1])
          }
            return obj[key]
        },
        getParames: function () {
            if (location.search) {
                this.stationId = this.getSearchString('stationId') //电站id
                this.cityName = this.getSearchString('city')
            } else {
                this.stationId = 'DZZCL'
                this.cityName = '德州'
            }
            // console.log(location.search)
            // console.log( this.stationId,this.cityName)
        },
    },
    watch: {
        stationId () {
            this.getStationInfo()
            this.getInverterList()
        },
        selectFilter (newV,oldV) {
            // console.log(newV,oldV)
            this.filteInverterList(newV)
        },
        diagIsOpen (newV) {
            this.getCurrDate()
            if (!newV) {
                this.refreshPage(5*60*1000)
            } else {
                clearInterval(this.timerH)
            }
        }
    },
    created:function () {
        this.getParames()
        // this.getInverterList()
    },
    mounted: function () {
        this.diagIsOpen = false
        this.initPageSize()
        vlm.getConnectedStations(this.getStations)
    }
})
