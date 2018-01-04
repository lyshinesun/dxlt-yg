(function($){
    //
    $.fn.tabheader = function(options){
        var defaults = {
            table_header:'table_header',//表头
            table_header_otr:'table_header_otr',//表头其他
            table_parent : 'table_parent',//表的父级元素
            table_height : 'tab le_height',//表需要滚动的区域
            table_parent_height : 'table_parent_height',//去表父级的高度
        };
        //定义变量 设置传递
        var options = $.extend(defaults,options);
        //获取对象
        var obj = $(this);
        //设置滚动区域高度
        //obj.children("div"+"."+options.table_height).height(obj.height()-obj.children("div"+"."+options.table_header).height()-12);


        //让div滚动 测试有没有滚动条
        obj.children("div"+"."+options.table_height).scrollTop(1);
        if($("."+options.table_height).scrollTop()>0 ){
            //如果有滚动条的情况下
            var Sys = {};
            var ua = navigator.userAgent.toLowerCase();
            var s;
            (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
                (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
                    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                            (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                                (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
            if ((navigator.userAgent.indexOf('MSIE') >= 0)&& (navigator.userAgent.indexOf('Opera') < 0 )) {
                //IE或者其他浏览器
                $("."+options.table_header).width($("."+options.table_parent).width()-17);
                $("."+options.table_header_otr).width($("."+options.table_parent).width()-67);

            } else {
                //是谷歌的情况下
                $("."+options.table_header).width($("."+options.table_parent).width()-6);
                $("."+options.table_header_otr).width($("."+options.table_parent).width()-56);
            }
            //if (Sys.ie) {
            //	$("."+options.table_header).width($("."+options.table_parent).width()-18)
            //}

        }else{
            //没有滚动条的情况下
            $("."+options.table_header).width($("."+options.table_parent).width());
            $("."+options.table_header_otr).width($("."+options.table_parent).width()-50);
        }
        $(window).resize(function(){
            //设置滚动区域高度
            //obj.children("div"+"."+options.table_height).height(obj.height()-obj.children("div"+"."+options.table_header).height()-12);
            //让div滚动 测试有没有滚动条
            obj.children("div"+"."+options.table_height).scrollTop(1);
            if($("."+options.table_height).scrollTop()>0 ){
                //如果有滚动条的情况下
                var Sys = {};
                var ua = navigator.userAgent.toLowerCase();
                var s;
                (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
                    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
                        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                            (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                                (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                                    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
                if ((navigator.userAgent.indexOf('MSIE') >= 0)&& (navigator.userAgent.indexOf('Opera') < 0)) {
                    //IE或者其他浏览器
                    $("."+options.table_header).width($("."+options.table_parent).width()-17);
                    $("."+options.table_header_otr).width($("."+options.table_parent).width()-67);
                } else {
                    //是谷歌的情况下
                    $("."+options.table_header).width($("."+options.table_parent).width()-6);
                    $("."+options.table_header_otr).width($("."+options.table_parent).width()-56);
                }
            }else{
                //没有滚动条的情况下
                $("."+options.table_header).width($("."+options.table_parent).width());
                $("."+options.table_header_otr).width($("."+options.table_parent).width()-50);
            }
            //if (Sys.ie) {
            //	$("."+options.table_header).width($("."+options.table_parent).width()-18)
            //}
        })
    }
})(jQuery);