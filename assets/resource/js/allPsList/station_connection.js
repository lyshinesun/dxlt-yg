var ctx = '', staticUrl = '';
new Vue({
    el: '#stationConnection',
    data: {
        stationList:[],
        stationId: 'GS',
        svgPath: "../dialog/svg/",  //svg路径
        fileExistFlag: true,  //svg文件是否存在
        fullScreenflag: false, // 全屏状态，初始为false
        stationName: '广水孚阳高平',
        a: '',
        A: '',
        b: '',
        c: '',
    },
    
    methods: {
        /*获取电站列表*/
        getStations: function (res) {
            var _this = this
            _this.stationList = res.list
            _this.stationId = _this.stationList[0].fdStationCode
            _this.stationName = _this.stationList[0].fdStationName
        },
        //初始化页面尺寸
        initPageSize: function () {
            var _this = this;
            $('#map_wap_div').height($(window).height() - 80);
            $('.map_con_fl').height($(window).height() - 80);
            $('#svg_change_color').height($('#map_wap_div').height() - 60);
            $(window).resize(function () {
                $('#map_wap_div').height($(window).height() - 80);
                $('.map_con_fl').height($(window).height() - 80);
                $('#svg_change_color').height($('#map_wap_div').height() - 60);
            });

            var boxrightWidth = $(".boxlists-right").width();
            var box1Width = $(".boxt1:eq(0)").width();
            var newbox2Witdth = boxrightWidth - box1Width - 60;
            if (newbox2Witdth > 70) {
                $(".boxt2").width(newbox2Witdth + "px");
            }
            if ($("#isOperate").length == 0) {
                $(".deal").css("background-color", "#C0C0C0");
            }

            this.initColor();

        },

        initColor: function () {
            var _this = this;
            $("#hidden-input").minicolors({
                control: $(this).attr('data-control') || 'hue',
                defaultValue: $(this).attr('data-defaultValue') || '',
                inline: $(this).attr('data-inline') === 'true',
                letterCase: $(this).attr('data-letterCase') || 'lowercase',
                opacity: $(this).attr('data-opacity'),
                position: $(this).attr('data-position') || 'bottom left',
                hide: function (opacity) {
                    _this.changeColor($("#hidden-input").val());
                },
                change: function (hex, opacity) {
                    if (!hex)
                        return;
                    if (opacity)
                        hex += ', ' + opacity;
                    try {

                    } catch (e) {
                    }
                },
                theme: 'bootstrap'
            });
        },

        //获取单电站svg
        getPerSvg: function (e) {
            var target = null;
            if (e == 1) {
            } else {
                if ($(e.target)[0].tagName == 'A') {
                    target = $(e.target).parent();
                } else if ($(e.target)[0].tagName == 'LI') {
                    target = $(e.target);
                } else {
                    return;
                }
                target.addClass('on').siblings().removeClass('on');
                this.stationId = target.attr('id');
            }

            this.stationName=target.find('a').html() + '-';
            $("#svgDiv").html('');

            this.getSvgMsg();
        },

        getSvgMsg: function () {
            var _this = this;
            var Parameters = {
                "parameters": {
                    "stationid": this.stationId.toLowerCase()
                },
                "foreEndType": 2,
                "code": "30000031"
            };

            vlm.loadJson("", JSON.stringify(Parameters), function (res) {
                if (res.success) {
                    if (res.data.length !== 0 ) {
                        _this.loadFuncDetail(res.data); //加载数据
                    } else if (res.data.length == 0) {
                        parent.layer.open({
                            type: 0,
                            title: '提示',
                            shadeClose: false,
                            shade: 0.5,
                            btn: ['确定'],
                            content: '暂未接入数据',
                            yes:function (index, layero) {
                                parent.layer.close(index)
                            },
                            btnAlign: 'c',
                            success:function (layero, index) {
                            }
                        })
                    }
                } else {
                    // alert(res.message);
                    parent.layer.open({
                        type: 0,
                        title: '提示',
                        shadeClose: false,
                        shade: 0.5,
                        btn: ['确定'],
                        content: '暂未接入数据',
                        yes:function (index, layero) {
                            parent.layer.close(index)
                        },
                        btnAlign: 'c',
                        success:function (layero, index) {
                        }
                    })
                }
            })
        },
        //循环查询gs.svg
        loopSelectDetail: function (result) {
            var _this = this;
            var obj = document.getElementById("mySVG");
            var svg = obj.getSVGDocument();
            var node = svg.documentElement;
            node.height = '200';

            for (var i = 0; i < result.length; i++) {
                if (result[i].fd_html_type == 1) { //boolean 显示隐藏
                    if (result[i].fd_value == 0) {
                        var showId = result[i].fd_html_id + '_0';
                        var hideId = result[i].fd_html_id + '_1';
                        if (node.getElementById(showId)) {
                            node.getElementById(showId).style.display = "block";
                            if (node.getElementById(hideId)) {
                                node.getElementById(hideId).style.display = "none";
                            }
                        }
                    } else if (result[i].fd_value == 1) {
                        var showId = result[i].fd_html_id + '_' + result[i].fd_value;
                        var hideId = result[i].fd_html_id + '_0';
                        if (node.getElementById(showId)) {
                            node.getElementById(showId).style.display = "block";
                            node.getElementById(hideId).style.display = "none";
                        }
                    }
                } else if (result[i].fd_html_type == 2) { //赋值
                    var showId = result[i].fd_html_id;
                    if (node.getElementById(showId)) {
                        node.getElementById(showId).textContent = result[i].fd_value;
                    }
                } else if (result[i].fd_html_type == 3) { //赋值和显示隐藏
                    var showId = result[i].fd_html_id + '_' + result[i].fd_value;
                    if (node.getElementById(showId)) {
                        node.getElementById(showId).style.display = "block";
                        var newArr = result[i].split(',');
                        for (var i = 0; i < newArr.length; i++) {
                            if (showId !== newArr[i]) {
                                node.getElementById(newArr[i]).style.display = "none";
                            }
                        }
                    }
                }
            }

            $(svg).unbind().bind('click', function () {
                $(".minicolors-panel").hide();
                _this.changeColor($("#hidden-input").val());
                $('.minicolors-input').each(function () {

                    var input = $(this),
                        settings = input.data('minicolors-settings'),
                        minicolors = input.parent();

                    // Don't hide inline controls
                    if (settings.inline) return;
                    minicolors.find('.minicolors-panel').fadeOut(settings.hideSpeed, function () {
                        if (minicolors.hasClass('minicolors-focus')) {
                            if (settings.hide) settings.hide.call(input.get(0));
                        }
                        minicolors.removeClass('minicolors-focus');
                    });

                });
            });
        },

        changeColor: function (type) {
            document.getElementById('svgDiv').style.backgroundColor = type;
            document.getElementById('svg_change_color').style.backgroundColor = type;
        },

        /**
         *加载Svg图像的回调函数gs.svg
         */
        loadFuncDetail: function (result) {
            var _this = this;
            var obj = document.createElement("embed");
            obj.id = "mySVG";
            obj.setAttribute("type", "image/svg+xml");
            if (this.stationId == 'GS' || this.stationId == 'gs') {
                obj.setAttribute("src", this.svgPath + this.stationId.toLowerCase() + '.svg');
                var wid = $("#svg_change_color").width();
                var hig = $("#svg_change_color").height();
                obj.setAttribute("style", "width:" + wid + "px;height:" + hig + "px");
                var container = document.getElementById("svgDiv");
                container.innerHTML = "";
                if (this.fileExistFlag) {
                    container.appendChild(obj);
                    clearSetInterval = setInterval(function () {
                        var svgdoc, root;
                        svgdoc = document.getElementById("mySVG");
                        root = svgdoc.getSVGDocument();
                        if (svgdoc != null && root != null) {
                            clearInterval(clearSetInterval);
                            obj.addEventListener("load", _this.loopSelectDetail(result), false);
                        }
                    }, 1000);
                }
                this.toggleNoSvgMessage();
                //点击全屏
                $("#change_size").unbind().bind('click', function () {
                    if (_this.fullScreenflag) {
                        _this.closeExpand();
                    } else {
                        _this.expand();
                    }

                });

                //键盘“Esc”出发消失
                $(document).keyup(function (event) {
                    if (this.fullScreenflag == true) {
                        switch (event.keyCode) {
                            case 27:
                                this.closeExpand();
                                break;
                            case 96:
                                break;
                        }
                    }
                });
            } else {
                parent.layer.open({
                    title: '提示',
                   content: '暂未接入数据'
                })
            }
            
        },


        //没有一次接线图的情况给出提示
        toggleNoSvgMessage: function () {
            $(".nodata_message").remove(".nodata_message");
            $("#svg_change_color").css("background-color", $(".minicolors-swatch-color").css("background-color"));
            if ($("#svgDiv").html() == "" || $("#svgDiv").html() == null) {
                $("#svg_change_color").css("background-color", "white");
                $("#svg_change_color").append("<div class='nodata_message' style='text-align: center;padding:20px;'><span style='font-size:14px'>" + LANG.all_station_nowiringmessage + "</span></div>");
            }
        },

        expand: function () {

            this.a = $('#right2', parent.document).width();
            this.A = $('#right2', parent.document).height();
            this.b = $('#map_wap_div, #tendencyDiv').height();
            this.c = $('#index_frame', parent.document).height();


            $('#right2', parent.document).width(parent.GetParentWindowHight().width).height(parent.GetParentWindowHight().height);

            $('#map_wap_div, .tendencyDiv').height(parent.GetParentWindowHight().height);
            $('#index_frame', parent.document).height(parent.GetParentWindowHight().height);
            $('.index_top', parent.document).hide();
            $('.side_nav', parent.document).hide();
            $('.secondnav', parent.document).hide();


            // 全屏显示 更改样式
            $(".map_select").css("display", "none");
            $(".map_con_fl").css("display", "none");
            $("#tendencyDiv").addClass("map_bg").css({
                "background-color": "#fff"
            });
            $("#tendencyDiv").removeClass("tendency_ri");
            $("#tendencyDiv").removeClass("fl");

            $(".tendencyChart").css("height", "100%");
            $("#map_wap_div").removeClass("map_wap");
            $(".index_right").removeClass("fl");
            $(".index_right", parent.document).css({
                paddingLeft: '0'

            });
            $("#svg_change_color").css("height", "100%");
            $("#svg_change_color").css("overflow", "auto");
            $("#svg_change_color").removeClass("tendencyChart_con");
            $("#svg_change_color").addClass("svgheight");
            // 更改图标
            $(".change_size img").attr("src", "../resource/images/change_size4.png").css('margin-top', '5px');
            // 更改全屏状态
            this.fullScreenflag = true;
            this.getSvgMsg();

        },

        closeExpand: function () {
            $('#right2', parent.document).width(this.a).height(this.A);
            $('#map_wap_div, #tendencyDiv').height(this.b);
            $('#index_frame', parent.document).height(this.c);
            $('.index_top', parent.document).show();
            $('.side_nav', parent.document).show();
            $('.secondnav', parent.document).show();


            // 退出全屏状态，样式恢复
            $(".map_con_fl").show();
            $(".map_select").show();
            $("#map_wap_div").addClass("map_wap");
            $("#tendencyDiv").removeClass("map_bg");
            $("#tendencyDiv").addClass("tendency_ri");
            $("#tendencyDiv").addClass("fl");
            $(".index_right").addClass("fl");
            $(".index_right", parent.document).css({
                paddingLeft: '170px'

            });
            $("#svg_change_color").addClass("tendencyChart_con").removeClass("svgheight");
            // 更改图标
            $(".change_size img").attr("src", "../resource/images/change_size2.png").css('margin-top', '0');
            $(window).trigger("resize");
            // 更改全屏状态
            this.fullScreenflag = false;
            //svg自适应问题
            this.getSvgMsg();
        },

    }
    ,
    mounted: function () {

        this.initPageSize(); //初始化页面尺寸
        vlm.getConnectedStations(this.getStations)
        this.getSvgMsg(); //getSvg
    }
})
;







