$(function(){
    resizePage();
});

$(window).resize(function(){
    resizePage();
});

function resizePage(){

    //ifm高度
    $(".index_ifm_siz").height($(window).height()-56);
    //右边总体宽高
    $(".admin_right").height($(window).height()-$(".admin_header").height());

    //首页宽高
    $(".index_main").width($(window).innerWidth()-30);
    $(".index_main").height($(window).height()-15);
    $(".index_left").height($(".index_main").height());
    $(".index_right").height($(".index_main").height());
    $(".index_right_list_con").height($(".index_right_list_main").height()-50);
    $(".index_right_list_con ul li div").css("line-height",$(".index_right_list_con ul li div").height()+'px');
    $(".index_right_echarts_mian").height($(".index_right_echarts_left").height()-40);
    $(".index_right_echarts_mian").width($(".index_right_list_main").width()/2);
    $(".index_left_top_top_echarts").width($(".index_left").width());
    $(".index_left_top_top_echarts").height($(".index_left_top_top").height()-10);
    $(".index_right_slide").height($(".index_right_list_main").height()-50);
    $(".index_left_bottom_list_bottom").height($(".index_left_bottom_list_main").height());
    $(".column_echarts").height($(".index_left_bottom_list_bottom").height());
    $(".column_echarts").width($(".index_left_bottom_list_bottom").width());
    $(".distab").height($(".index_num_con_mian img").height());


    //电站信息
    $(".siteMore").css("height",$(".map_con_fl").height());

    $(".siteMore_con_lf").width($(window).width()-860);


}