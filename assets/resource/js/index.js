new Vue({
    el: '#power_index',
    data: {
        stationId:'gs',
        audioTimer:null, //报警定时器
        indexTimer:null, //实时监测定时器
        fault_num:0, //故障个数

        sizePage:10,
        curOtherPage:1,


    },
    methods: {
        initSize: function () {
            //初始化弹窗iframe
            $(".ygshow_con").css("height", $(window).height() - 100);
            $(".ygshow_con").css("width", $(window).width() - 240);
            $(".Popup-iframe iframe").css("width", $(window).width() - 240);
            $(".Popup-iframe iframe").css("height", $(window).height() - 160);

            //页面resize 弹窗自适应
            $(window).resize(function () {
                $(".ygshow_con").css("height", $(window).height() - 100);
                $(".ygshow_con").css("width", $(window).width() - 240);
                $(".Popup-iframe iframe").css("width", $(window).width() - 240);
                $(".Popup-iframe iframe").css("height", $(window).height() - 160);
            });
        },

        //检测hash跳转页面
        checkHash: function () {
            //进入页面判断hash跳转页面
            var hash = (!window.location.hash) ? "#powerOverview" : window.location.hash;
            window.location.hash = hash;
            $('.side_nav li').removeClass('open');
            $(hash).addClass('on').parent().show().parents('li').addClass('open').find('.cameo_line').hide();
            $(hash).parents('li').find('.nav_right').css({
                transform: 'rotate(90deg)',
                WebkitTransform: 'rotate(90deg)'
            });

            var url = '';
            if (hash.indexOf('_') != -1) {
                if (hash.indexOf('new') != -1) {
                    url = window.location.pathname.replace('index.html', '') + 'dialog/new_workorder/' + hash.replace('#', '') + '.html';
                } else {
                    url = window.location.pathname.replace('index.html', '') + 'dialog/' + hash.replace('#', '') + '.html';
                }
            } else {
                url = window.location.pathname.replace('index.html', '') + hash.replace('#', '') + '.html';
            }
            $('#index_frame').attr('src', url);
        },

        //左侧主导航nav
        leftTab: function () {
            var _this = this;
            //配置模板
            $.ajax({
                url: vlm.serverAddr + "sys/menu/user",
                dataType: "json",
                data: {},
                success: function (res) {
                    if (res.code == 0) {
                        var menuList = res.menuList;
                        var navhtml = $('#nav_content_tpl').html();
                        var menuItem = ejs.render(navhtml, {menuList: menuList});
                        $('.side_nav').html(menuItem);

                        _this.checkHash();  //检测hash跳转页面

                        $('.side_nav li').click(function () {
                            if ($(this).hasClass('open')) {
                                $(this).removeClass('open');
                                $(this).find('.sub_nav').stop().slideUp(200);
                                $(this).find('.cameo_line').show(200);
                                $(this).find('.nav_right').css({
                                    transform: 'rotate(0deg)',
                                    WebkitTransform: 'rotate(0deg)'
                                });
                            } else {
                                $(this).addClass('open');
                                $(this).find('.sub_nav').stop().slideDown(200);
                                $(this).find('.cameo_line').hide(200);
                                $(this).find('.nav_right').css({
                                    transform: 'rotate(90deg)',
                                    WebkitTransform: 'rotate(90deg)'
                                });
                            }

                            var target = $(this);
                            target.find('a').off().on('click', function (e) {  //二级nav点击
                                var obj = $(this);
                                _this.subClick(obj, e);
                            });

                        });

                        $('.open a').off().on('click', function (e) {  //二级nav点击
                            var obj = $(this);
                            _this.subClick(obj, e);
                        });


                    } else {
                        alert("请求失败！");
                    }
                }
            });
        },

        //点击二级菜单跳转
        subClick: function (obj, e) {
            this.isLogin();
            e.stopPropagation();
            $('.sub_nav a').removeClass('on');
            obj.addClass('on');
            window.location.hash = obj.attr('id');

            var subUrl = '';

            if (obj.attr('id').indexOf('_') != -1) {

                if (obj.attr('id').indexOf('new') != -1) {
                    subUrl = 'dialog/new_workorder/' + obj.attr('id') + '.html';
                } else {
                    subUrl = 'dialog/' + obj.attr('id') + '.html';
                }
            } else {
                subUrl = obj.attr('id') + '.html';
            }

            $('#index_frame').attr('src', subUrl);
        },


        //关闭弹窗
        closeHisInfo: function () {
            $("#showHisPageFrame").hide();
        },

        //获取故障信息
        getFaultList: function () {
            var _this = this;
            var startDateStr = vlm.Utils.dateToString(new Date());  //请求开始时间

            $.ajax({
                url: vlm.serverAddr + 'tbfaultdata/list',
                type: "POST",
                dataType: "json",
                data: {
                    "limit": this.sizePage,	//页数量
                    "page": this.curOtherPage,
                    "fdStartDate": startDateStr, //日期
                    "psid": this.stationId			  //电站id
                },
                success: function (res) {
                    layer.closeAll();
                    if (res.code == 0) {
                        var totalCount = res.page.totalCount;
                        if (totalCount) {
                            _this.fault_num=totalCount;
                            $('.yg-tophide').show();
                            clearInterval(_this.audioTimer);
                            _this.audioTimer=setInterval(function(){
                                $('#alarm_audio')[0].play();
                            },1000);

                            $('#alarm_wrap').off().click(function(){
                                // clearInterval(_this.audioTimer);
                                $('.yg-tophide').hide();
                                $('.sub_nav a',parent.document).removeClass('on');
                                $('#power_diagnose',parent.document).addClass('on').parents('li').addClass('open').find('.cameo_line').hide(200);
                                $('#power_diagnose',parent.document).parent().stop().slideDown(200);
                                top.location.hash = '#power_diagnose';
                                $('#index_frame',parent.document).attr('src','dialog/power_diagnose.html');

                            });
                        }
                    } else {
                        parent.layer.open({
                            title: LANG["all_station_prompt"],
                            content: '数据有误'
                        });
                    }
                }
            });
        },

        //检测登录状态
        isLogin: function () {
            var _this=this;
            // var ctx = window.location.pathname;
            // ctx = ctx.replace('index.html', '');
            // //检测是否登录
            // if (vlm.checkLogin(ctx + 'login.html') == false) {
            //     return;
            // }

            //检测info
            $.ajax({
                type: "get",
                url: vlm.serverAddr + "sys/user/info",
                data: "",
                dataType: "json",
                success: function (res) {
                    if (res.code == 0) {//用户没过期，更新用户信息
                        window.sessionStorage.userid = res.user.userId;
                        window.sessionStorage.username = res.user.username;
                        window.sessionStorage.login = 1;
                        _this.initSize(); //初始化尺寸
                        _this.leftTab(); //tab事件
                        _this.getFaultList(); //
                        clearInterval(_this.indexTimer);
                        _this.indexTimer=setInterval(function(){
                            _this.getFaultList(); //

                        },5*60000);

                    }
                },
                error:function(res){
                    //返回的是登录页面
                    window.location.href = "login.html";
                }
            });

        },

        //修改密码
        modifyPass: function () {
            window.location.href = "modify_pass.html";
        },

        //注销
        logOut: function () {
            $.ajax({
                url: vlm.serverAddr + "sys/logoutYg",
                dataType: "json",
                type: 'get',
                data: {},
                success: function () {
                    window.location.href = "login.html";
                },
                error: function () {
                    window.location.href = "login.html";
                }
            });
        }

    },
    mounted: function () {
        this.isLogin(); //检测登录状态
    }
});


function GetParentWindowHight() {
    return {
        width: $(window).width(),
        height: $(window).height()
    };
}