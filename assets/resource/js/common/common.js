$(function(){
    //去除边距
    $('.shownavbj_center a:last-child').css("margin-bottom","0px");
    //智能分析图片悬浮效果
    $(".analysis_list_img").hover(function(){
        $(this).children(".analysis_show_title").show(100,function(){$(".analysis_show_title").addClass("analysis_show_titlebox")});
    },function(){
        $(this).children(".analysis_show_title").hide();
        $(this).children(".analysis_show_title").removeClass("analysis_show_titlebox");
    });
    //智能分析内页选项卡
    jQuery(".analysis_con_c2").slide({trigger:"click"});
    //智能分析页
    $(".analysis_size").toggle(function(){
        $(this).addClass("size_min");
        //$(".analysis_con").css("background","#ffffff");
        $(".analysis_con").css("position","fixed");
        $(".analysis_con").css("left","0px");
        $(".analysis_con").css("top","0px");
        $(".analysis_con").css("width","100%");
        $(".analysis_con").css("height","100%");
        $(".analysis_con").css("z-index","9999");

        $("#map_pic",parent.document).addClass("map_pic_full");
        $("#map_pic",parent.document).removeClass("map_pic");
        $("#map_con",parent.document).removeClass("map_con");

    },function(){
        $(this).removeClass("size_min");
        $(".analysis_con").css("background","none");
        $(".analysis_con").css("position","relative");
        $(".analysis_con").css("left","0px");
        $(".analysis_con").css("top","0px");
        $(".analysis_con").css("width","100%");
        $(".analysis_con").css("height","100%");
        $(".analysis_con").css("z-index","10");

        $("#map_pic",parent.document).removeClass("map_pic_full");
        $("#map_pic",parent.document).addClass("map_pic");
        $("#map_con",parent.document).addClass("map_con");

    });
    //排名下拉
    $(".index_ranking_sel").hover(function(){
        $(this).children("ul").show();
    },function(){
        $(this).children("ul").hide();
    });
    $(".index_ranking_sel ul li").click(function(){
        $(this).parents("ul").siblings().children("span").text($(this).text())
    });
    //start 2016  11 07 wangli 蓝色版本样式调整
    var _num=0;
    $(".index_top_menu").click(function(){
        if(_num==0){
            $(this).children("ul").slideDown();
            _num=1;
        }else{
            $(this).children("ul").slideUp();
            _num=0;
        }
        //	end
    });
    $(".index_top_menu ul li").click(function(){
        $(this).parents("ul").siblings().children("span").text($(this).text())
    });
    $(".index_top_menu ul li").click(function(){
        $(this).parents("ul").siblings().children("span").text($(this).text())
    })
});

function full_iframe(){

}

function min_iframe(){

}