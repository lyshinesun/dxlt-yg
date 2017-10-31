
var workTask = {

	varables : {
		taskId:null,
		orderId:null
	},

	//初始化页面尺寸
	initSize: function () {
		$('.task_bot_table_wrap').css('maxHeight',$(window).height() - 150);

		$(window).resize(function () {
			$('.task_bot_table_wrap').css('maxHeight',$(window).height() - 150);
		});
	},

	/**
     * 任务列表
     */
    list:function(){
        $.ajax({
            url: vlm.serverAddr + "workflow/listTask",	//请求地址
			dataType: "json",
            data: {
                "limit": 10,					//页数量
                "page": 1						//页码
            }, success: function (result) {
                if(result.code == 0){
					workTask.makeTaskList(result.list);
				}else{
					alert("请求失败！");
				}
            }
        });
    },

	makeTaskList : function(data){
		$("#task_list").empty();
		var html = '';
		for(var i in data){
			if(i != "max"){
				var tr = '<tr>'+
							'<td class="task_tr01">'+data[i].id+'</td>'+
							'<td class="task_tr02">'+data[i].bpmName+'</td>'+
							'<td class="task_tr03">'+data[i].datetime+'</td>'+
							'<td class="task_tr04">'+data[i].name+'</td>'+
							'<td class="task_tr05">'+
								'<a class="task_link" id="task_manage" onclick="workTask.showTaskExe(this);" href="javascript:;">办理任务</a>'+
								'<a class="task_link" id="task_watch" onclick="workTask.viewCurrentImage(this);" href="javascript:;">查看当前流程图</a>'+
							'</td>'+
						'</tr>';
				html +=  tr;
			}
		}
		$("#task_list").html(html);

		//table表头固定js调用
		$(".task_sub_wrap").tabheader({
			table_header: 'task_head_wrap',
			table_parent: 'task_sub_wrap',
			table_height: 'task_bot_table_wrap',
			table_parent_height: 'task_sub_wrap',
		});

	},

	showTaskExe : function(obj){
		$('.mask_wrap').slideDown();
		workTask.varables.taskId = $(obj).parent().parent().find("td:first")[0].innerHTML;

		$.ajax({
            url: vlm.serverAddr + "workflow/audit",	//请求地址
			dataType: "json",
            data: {
                "taskId":workTask.varables.taskId
            }, success: function (result) {
                if(result.code == 0){
					workTask.makeTaskTable(result.workOrder);
					workTask.makeTaskButton(result.outcomeList);
					workTask.makeOpinitionList(result.commentList);
				}else{
					alert("请求失败！");
				}
            }
        });
	},

	makeTaskTable : function(data){
		$("#tordernum").val(data.fdOrdernum);
		$("#tdatetime").val(data.fdDatetime);
		$("#topinition").val(data.fdOpinion);
		$("#t_opinition").val('');
		workTask.varables.orderId = data.fdId;
	},

	makeTaskButton : function(data){
		$("#form_task").find("button").remove();
		var html = '';
		for(var i in data){
			if(i != "max"){
				var button = '<button type="submit" onclick="workTask.submitTask(this);" value="'+data[i]+'" class="btn btn-default" >'+data[i]+'</button>';
				html +=  button;
			}
		}
		//$("#task_list").html(html);
		$("#form_task").append(html);
	},

	makeOpinitionList : function(data){
		$("#opinitionList").empty();
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
		$("#opinitionList").html(html);
	},

	viewCurrentImage : function(obj){
		workTask.varables.taskId = $(obj).parent().parent().find("td:first")[0].innerHTML;
		window.open("./currentImg.html?taskId="+workTask.varables.taskId);
	},

	submitTask : function(obj){
		var outcome = obj.value;
		var comment = $("#t_opinition").val();
		$.ajax({
            url: vlm.serverAddr + "workflow/submitTask",	//请求地址
			dataType: "json", 
			type: 'POST',
            data: {
                "taskId": workTask.varables.taskId,
                "comment": comment,
				"outcome":outcome,
				"orderId":workTask.varables.orderId
            }, success: function (result) {
                if(result.code == 0){
					//workTask.makeTaskList(result.list);
				}else{
					alert("请求失败！");
				}
            }
        });
	}
	
}

$(function(){
	workTask.initSize();

    $('.close_btn').click(function(){
        $('.mask_wrap').slideUp();
    });

    $('#task_manage').click(function(){
        $('.mask_wrap').slideDown();
    });
	workTask.list();
})