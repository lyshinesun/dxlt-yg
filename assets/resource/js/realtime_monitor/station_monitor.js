new Vue({
    el: '#station_monitor',
    data: {
        stationList:[],
        stationId: '',
        inverterList: [],
        inverterFilterList: [],
        currDate: '',
        cityName: '',
        timerH: null //定时刷新页面的句柄
    },
    methods: {
        initPageSize () {
            var _this = this;
            $('#map_wap_div').height($(window).height() - 80);
            $('.map_con_fl').height($(window).height() -80);
            $('#inverter_page').height($(window).height());
            $('.station_list').height($('#inverter_page').height() - 100);
            
            $(window).resize(function () {
                $('#map_wap_div').height($(window).height() - 80);
                $('.map_con_fl').height($(window).height() - 80);
                $('#inverter_page').height($(window).height());
                 $('.station_list').height($('#inverter_page').height() - 100);
            });
        },
        /*获取电站列表*/
        getStations (res) {
            var _this = this
            _this.getDate()
            $.ajax({
                url: vlm.serverAddr + 'stationbaseinfo/getPsListData',  //请求地址
                dataType: "json",
                data:{
                    "logDate": this.currDate
                },
                type : "GET",
                success: function(res){
                    if (res.code == 0) {
                        _this.stationList = res.list
                    }
                },
                error: function () {
                   
                }
            })
        },
        getDate () {
            var oDate = new Date();
            var y = oDate.getFullYear();
            var m = oDate.getMonth() + 1;
            var d = oDate.getDate();
            this.currDate = y + '-' + vlm.Utils.format_add_zero(m) + '-' + vlm.Utils.format_add_zero(d);
        },
        gotoInverterMonitor (stationId, stationCity) {
            $('#index_frame', parent.document).attr('src', 'dialog/inverter_monitor.html?stationId=' + stationId + '&city=' + stationCity);
        },
        //定时刷新页面
        refreshPage (timer) {
            var _this = this
            _this.timerH = setInterval(function(){
                _this.getStations()
               /* _this.getCurrDate()
                _this.getStationInfo()
                _this.getInverterList()*/
                // _this.filteInverterList(_this.selectFilter)
            }, timer)
        },
    },
    watch: {
        
    },
    created:function () {
        this.getStations()
        this.initPageSize()

    },
    mounted: function () {
        this.refreshPage(5*60*1000)
    }
})
