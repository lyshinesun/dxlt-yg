
/**
 * 工单处理类
 * @type {{}}
 */
var totalCount = 0;
var pageSize = 10;
var totalPage = 0;
var currPage = 1;

//start 2016 07 11 添加鼠标按下事件 wangli
function checkValue() {
  pageSize = $('#pageNum option:selected').text();
  var pageNo = $("#pageChange").val();
  //按下任意键 监听 判断是否是字母
  var strExp = /^[A-Za-z]/;
  if (strExp.test(pageNo)) {//字母校验  如果为字母 则替换为空
    $("#pageChange").val(currPage);
    return;
  }

  currPage = pageNo;
    
}
//end
//2016 07 14 添加键盘回车事件 wangli
function jumptoPaged(event) {
  var e = event ? event : window.event;
  if (e.keyCode == 13) {
    doPageJump();
  }

}
//start 2016 07 06 wangli 页数跳转
function doPageJump() {
  workOrder.init();
}
function doChangePage(){
  checkValue();
  workOrder.init();
}
//end
//end
var workOrder = {
  /**
   * 局部变量
   */
  variables : {
    orderId : null,
    psid : 'gs',
    startTime:null,
    endTime:null,
    faultNum:null,
    orderNum : null,
    stateStr:null
  },

  //初始化页面，组装参数，reload调用此方法
  init : function(){
    var stateStr = $('#wo_state input[name="flag"]:checked ').val();
    workOrder.variables.psid = $(".treeDemoId").find("li[class='on']").find("input:first").val();
    workOrder.variables.faultNum = $("#fault_code").val();
    workOrder.variables.orderNum = $("#workorder_name").val();
    workOrder.variables.stateStr = stateStr;
    workOrder.list();
  },

  /**
   * 工单列表
   */
  list : function(){
      $.ajax({
          url: vlm.serverAddr + "tbworkorder/list", //请求地址
    dataType: "json",
      data: {
        "limit": pageSize,          //页数量
        "page": currPage,           //页码
        "psid":workOrder.variables.psid,            //电站id
        "startTime":workOrder.variables.startTime,        //开始时间
        "endTime":workOrder.variables.endTime,        //结束时间
        "faultNum":workOrder.variables.faultNum,        //故障号
        "orderNum":workOrder.variables.orderNum,          //工单号
        "state":workOrder.variables.stateStr
      }, 
      success: function (result) {
        if(result.code == 0){
          currPage = result.page.currPage;
          pageSize = result.page.pageSize;
          var paramArray = [];
          paramArray.push(result.page.totalCount);
          paramArray.push(result.page.pageSize);
          $("#Paginationother").pagination(result.page.totalCount, {
            num_edge_entries: 1,
            //边缘页数
            current_page: result.page.currPage - 1,
            num_display_entries: result.page.pageSize,
            //主体页数
            callback: pageselectCallback,
            items_per_page: result.page.pageSize,
            //每页显示1项
            prev_text: LANG["all_station_previouspage"],
            next_text: LANG["all_station_nextpage"],
            /**start 2016 07 06 wangli 添加跳页操作**/
            page_jump: formatString(LANG["common_pagejump"]),
            page_confirm: formatString(LANG["common_confirm"]),
            /**end 2016 07 06**/
            page_message: formatString(LANG["common_pagemessage"], paramArray, result.page.pageSize)
          });
        function pageselectCallback(page_index) {
          currPage = page_index + 1;
          if (true) { //不是点击分页按钮的时候不调用search方法
            $("#pageChange").val(currPage);
            //_this.search();
          }
          //_this.startPageFlag = true;
        }
        workOrder.makeList(result.page.list);
      }else{
        alert("请求失败！");
      }
          }
      });
  },

  pageselectCallback : function(){

  },

  //查看流程图
  viewImg : function(){

  },

  //树节点响应事件
  treeAction:function(obj){
    var id = $(obj).parent().find("input:first").val();
    workOrder.variables.psid = id;
    if(!$(obj).parent().hasClass("on")){
      $(".on").removeClass();
      $(obj).parent().addClass("on");
    }
    workOrder.init();
  },

  //申请审批参数组装
  startPro : function(obj){
    var orderId = $(obj).parent().parent().parent().find("td:first")[0].innerHTML;
    workOrder.orderId = orderId;
    workOrder.startProDo();
  },

  //申请审批后台处理
  startProDo : function(){
    $.ajax({
      type: "POST",
      dataType: "json",
      url: vlm.serverAddr + "workflow/startProcess",
      data:{
        "orderId": workOrder.orderId        //工单id
      },
      success: function(r){
        if(r.code === 0){
          parent.layer.open({
            title: LANG["all_station_prompt"],
            content: "操作成功"
          });
          workOrder.init();
        }else{
          alert(r.msg);
        }
      }
    });
  },

  //查看审批记录
  viewHis : function(obj){
    $('.mask_wrap').slideDown();
    var orderId = $(obj).parent().parent().parent().find("td:first")[0].innerHTML;
    $.ajax({
      type: "POST",
      dataType: "json",
      url: vlm.serverAddr + "workflow/viewHisComment",
      data:{
        "orderId": orderId        //工单id
      }, 
      success: function(r){
        if(r.code === 0){
          workOrder.makeOrder(r.workOrder);
          workOrder.makeOpinitionList(r.commentList);
        }else{
          alert(r.msg);
        }
      }
    });
  },
  
  makeOpinitionList : function(data){
    $("#workList").empty();
    var html = '';
    for(var i in data){
      if(i != "max"){
        var tr = '<tr>'+
          '<td>'+data[i].time+'</td>'+
          '<td>'+data[i].userId+'</td>'+
          '<td>'+data[i].message+'</td>'+
          '</tr>';
        html +=  tr;
      }
    }
    //$("#task_list").html(html);
    $("#workList").html(html); 
  },
  
  makeOrder : function(data){
    $("#pfaultnum").val(data.fdFaultNum);
    $("#pdatetime").val(data.fdDatetime);
    $("#popinition").val(data.fdOpinion);
  },
  
  /**
   * 生成列表
   */
  makeList : function(data){
    $("#wo_table").empty();
    var html = '';
    console.log(data);
    for(var i in data){
      if(i != "max"){
        var state = data[i].fdState;
        var t1 = "block";
        var t2 = "block";
        var stateStr = "待审批";
        if(state == 0){
          stateStr = "待审批";
          t1 = "block";
          t2 = "none";
        }else if(state == 1){
          stateStr = "审批中";
          t1 = "none";
          t2 = "block";
        }else if(state == 2){
          stateStr = "审批完成";
          t1 = "none";
          t2 = "block";
        }
        var tr ='<tr class="problem_color">'+
            '<td class="xqgl_td1" style="display:none">'+data[i].fdId+'</td>'+
            '<td class="xqgl_td2">'+data[i].fdOrdernum+'</td>'+
            '<td class="xqgl_td4">'+data[i].fdFaultNum+'</td>'+
            '<td class="xqgl_td5">'+data[i].fdOpinion+'</td>'+
            '<td class="xqgl_td6">'+data[i].fdDatetime+'</td>'+
            '<td class="xqgl_td7">'+stateStr+'</td>'+
            '<td class="xqgl_td8"><a style="margin-right: 15px;display:'+t2+'" title="查看审批记录">'+
                '<img src="../resource/images/statement1.png" onclick="workOrder.viewHis(this);" alt=""></a>'+
              
                '<a title="申请工单审批" style="display:'+t1+'">'+
                '<img src="../resource/images/shenpi.png"  onclick="workOrder.startPro(this);"  alt=""></a>'+
              
            '</td>'+
          '</tr>';
        html += tr;
      }
    }
    $("#wo_table").html(html);
  },
  //初始化时间
  initTime: function () {
    var _this = this;
    var dates = new Date();
    var endDate = dates.getFullYear() + '-' + (dates.getMonth() + 1) + '-' + dates.getDate() + 'T' + dates.getHours() + ':' + dates.getMinutes() + ':' + dates.getSeconds();
    var tom_day = vlm.Utils.format_date(endDate, 'YmdHispace');
    dates.setDate(1);
    var startDate = dates.getFullYear() + '-' + (dates.getMonth() + 1) + '-' + dates.getDate() + 'T' + dates.getHours() + ':' + dates.getMinutes() + ':' + dates.getSeconds();
    var yest_day = vlm.Utils.format_date(startDate, 'YmdHizero');
    $("#start").val(yest_day);
    $("#end").val(tom_day);
    $("#quick_date1").html(yest_day);
    $("#quick_date2").html(tom_day);
    workOrder.variables.startTime = yest_day;
    workOrder.variables.endTime = tom_day;
    if (tom_day) {
      tom_day = (tom_day.replace("-", "")).replace("-", "").replace(" ", "").replace(":", "");
    }
    if (yest_day) {
        yest_day = (yest_day.replace("-", "")).replace("-", "").replace(" ", "").replace(":", "");
    }
    $("#dateHid").val(yest_day + "-" + tom_day);

    //时间选择显示隐藏事件
    $(".date_btn").unbind().bind("click",
      function (event) {
      var dateWrap_height = $(".dateWrap").is(":hidden");
      if (dateWrap_height) {
          $(".dateWrap").show();
      } else {
          $(".dateWrap").hide();
      }
      event.stopPropagation();
    });

    //删除事件
    $(".map_choose_on").unbind("click").live('click', function () {

        $(this).remove();
        if ($(".map_choose span").length == 1) {
            $(".map_choose_tit").hide();
        }
    });

    //i记录日期控件选择的时间类型：日，周，年……
    var i = 0;
    //年月日事件切换
    $(".dateWrap_tit ul li").click(function () {
        i = $(this).index();
        $(".dateWrap_tit ul li").removeClass("on");
        $(this).addClass("on");
        $('.ate_togg >ul').eq(i).addClass("active").siblings().removeClass('active');
        if (i == 0) //天
        {
            $("#start").val($("#quick_date1").html());
            $("#end").val($("#quick_date2").html());
        } else if (i == 1) //周
        {
            var now_day = vlm.Utils.GetDay();
            var week_year = vlm.Utils.getWeekNumber()[0];
            var week_num = vlm.Utils.getWeekNumber()[1];
            $("#week").val(week_year + LANG["all_station_yearof"] + week_num + LANG["all_station_week"]);
        } else if (i == 2) //月
        {
            var now_day = vlm.Utils.GetDay();
            var yest_day = vlm.Utils.GetDay(0, 0, -1);
            var year = now_day.substring(0, now_day.indexOf("-"));
            var month = now_day.substring(now_day.indexOf("-"), now_day.indexOf("-") + 3);
            $("#month").val(year + month);
        } else if (i == 3) //季度
        {
            var now_day = vlm.Utils.GetDay();
            var month = now_day.substring(now_day.indexOf("-") + 1, now_day.indexOf("-") + 3);
            var year = now_day.substring(0, now_day.indexOf("-"));
            if (month >= 1 && month <= 3) {
                $("#jidu").val(year + LANG["pro_management_year"] + LANG["pro_management_onequarter"]);
            } else if (month >= 4 && month <= 6) {
                $("#jidu").val(year + LANG["pro_management_year"] + LANG["pro_management_twoquarter"]);
            } else if (month >= 7 && month <= 9) {
                $("#jidu").val(year + LANG["pro_management_year"] + LANG["pro_management_threequarter"]);
            } else {
                $("#jidu").val(year + LANG["pro_management_year"] + LANG["pro_management_fourquarter"]);
            }
        } else if (i == 4) //年
        {
            var now_day = vlm.Utils.GetDay();
            var month = now_day.substring(now_day.indexOf("-") + 1, now_day.indexOf("-") + 3);
            var year = now_day.substring(0, now_day.indexOf("-"));
            $("#year").val(year + LANG["all_station_yeartail"]);
        }
    });

    $('.wrap_su').click(function () {
      var dateType = $(this).attr('data-dateType');
        if (dateType == 'twoday') {
          var yest_day = $("#start").val();
          var tom_day = $("#end").val();
          workOrder.variables.startTime = yest_day;
          workOrder.variables.endTime = tom_day;
            $("#quick_date1").html(yest_day);
            $("#quick_date2").html(tom_day);
            $("#dateHid").val(yest_day + "-" + tom_day);
        }
          $(".dateWrap").slideUp();
          //重置页数为1
          _this.curOtherPage=1;
        });

       // this.showTree();  //加载树
      //  this.search(); //获取报警列表
    }
  }

//初始化页面尺寸

$(function(){
  $('.close_btn').click(function(){
        $('.mask_wrap').slideUp();
    });
  
    $('#task_manage').click(function(){
        $('.mask_wrap').slideDown();
    });
  
    $('#faultPage_all').height($(window).height() - 60);
    $('#gjgl_boxheight').height($('#faultPage_all').height() - 120);

    $('#tabDiv').height($('#gjgl_boxheight').height() - $('.page-div').height() - 10);
    $(window).resize(function () {
        $('#faultPage_all').height($(window).height() - 60);
        $('#gjgl_boxheight').height($('#faultPage_all').height() - 120);
        $('#tabDiv').height($('#gjgl_boxheight').height() - $('.page-div').height() - 10);
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
  workOrder.initTime();
  workOrder.init();
})



var vm = new Vue({
  el: '#workOrder',
  data: {
    stationList:[],
    stationId: '',
    totalCount: 0;
    var pageSize = 10;
    var totalPage = 0;
    var currPage = 1;
  },
  methods: {
    getStations: function (res) {
      var _this = this
      _this.stationList = res.list
      _this.stationId = _this.stationList[0].fdStationCode
    },
    //更换左侧列表电站
    changeStation: function (e) {
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
    },
  },
  mounted: function () {
    vlm.getConnectedStations(this.getStations)
  }
})