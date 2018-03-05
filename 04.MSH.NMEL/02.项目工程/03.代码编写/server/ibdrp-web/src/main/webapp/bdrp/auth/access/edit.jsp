<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<title>授权编辑</title>

<script type="text/javascript">
var AuthzService;
$(document).ready(function(){
	$.initSpecInput();
	
	var parentId = $('#parentId').val();
	$('#parent').combotree({
		url : '${ctx}/bdrp/auth/function/tree',
		method : "GET",
		required : false,
		formatter : function(node) {
			node.text = node.name;
			delete node.name;
			return node.text;
		}
	});
	$('#parent').combotree('setValue',parentId);
	
	forLinkedResources('0', '5', '${model.id }','${model.function.id }');
	//返回到主界面
	$("#back").click(function(){
		$('.one-center-panel').load('${ctx}/bdrp/auth/access/main');
		// ****防止页面DIV过多，造成缓慢**********
		$(".combo-p").remove();
		$(".window").remove();
		$(".window-shadow").remove();;
		$(".window-mask").remove();
		
		$(".c-ff-input-warning").remove();
		$(".pika-single").remove();
		// ****防止页面DIV过多，造成缓慢**********
	}); 
	
	$('#addBtn').click(function(){
		var authzId = $('#authzId').val();
		var resourceId = $('#resourceId').val();
		var functionId = $('#parentId').val();
		$('#resourceList').window({    
		    title: '资源信息',    
		    width: 500,    
		    height: 400,    
		    closed: true,    
		    cache: false,   
		    modal: true,
		    href: '${ctx}/bdrp/auth/resource/access/toLink',
		    queryParams : {authzId : authzId, functionId:functionId,start : '0',pageSize : '10'}
		      
		});  
		$('#resourceList').window('open');
	});
	
	
	$("#save").click(function(){	
		$("#authzForm").form({
			url : "${ctx}/bdrp/auth/access/update",
			onSubmit : doCheck, 
			success : function(msg){
				var result = $.parseJSON(msg);
				if(result.id){
					$('.one-center-panel').load('${ctx}/bdrp/auth/access/main');
				}else{
					alert(msg);
				}
			}
		});
		$("#authzForm").submit();
	});
});

//新增doCheck方法
	function doCheck(){
		if($('#authzForm').check()==true){
			// Ajax异步提交，校验该名称是否已经存在
			var flag = true;
			var name = $("#name").val();
			if($.trim(name)==""){
				$("#repeat").hide();
				$("#msg").hide();
				$("#empty").show();
				return false;
				//flag = false;
			}
				// Ajax异步提交，校验该名称是否已经存在
				$.ajax({
					type : "GET",
					url : "${ctx}/bdrp/auth/access/exist",
					async : false,
					data : {name:name,id:'${model.id }'},
					dataType : 'json',
					success : function(msg){
						if(msg.success){
							$("#repeat").hide();
							flag = true;
							
						}else {
							$("#repeat").show();
							$("#msg").hide();
							flag = false;
						}
					}
				});
			return flag;
		}else{
			return false;
		}
	}
	

function PageUp(start){
	var authzId = $('#authzId').val();
	var functionId = $('#functionId').val();
	$('#resourceList').window('refresh', '${ctx}/bdrp/auth/resource/access/toLink?authzId='+authzId+'&functionId='+functionId + '&start='+start); 

}

function PageDown(start){
	var authzId = $('#authzId').val();
	var functionId = $('#functionId').val();
	$('#resourceList').window('refresh', '${ctx}/bdrp/auth/resource/access/toLink?authzId='+authzId+'&functionId='+functionId + '&start='+start); 
}



function bint(){
	var authzId = $('#authzId').val();
	var resourceId = $('#resourceId').val();
	var i = 0;
	var resIds = new Array();
	var alll = $("#alll").val();
	$('[name=checkresource]:checkbox:checked').each(function(){
		resIds[i] = $(this).val();
		i++;
	});
	if(alll==0){
		$.messager.alert("提示","没有资源可供选择！","info");
	}else if(resIds==""){
		$.messager.alert("提示","请选择至少一项！","info");
	}
	$.ajax({
		url : '${ctx}/bdrp/auth/resource/access/doLink',
		traditional:true,
		type : 'POST',
		data : {resIds : "'"+resIds.join("','")+"'",accId : authzId},
		dataType : 'json',
		success : function(data){
			if(data.success){
				closePanel();
				$('.one-center-panel').load('${ctx}/bdrp/auth/access/edit/'+authzId);
			}
		},
		error : function(){
			
		}
	});
}
//包含资源的分页
function forLinkedResources(start, pageSize, authzId,functionId) {
	$("#content").empty();
	$.ajax({
		url : '${ctx}/bdrp/auth/resource/access/linked',
		type : 'get',
		data : {
			start : start,
			pageSize : pageSize,
			authzId : authzId,
			functionId : functionId
		},
		dataType : 'json',
		success : function(data) {
			var rows = "<table class='l1-tab' ><thead><tr><th class='l1-col-info' width='200px;'>名称</th><th class='l1-col-info' width='300px;'>编码</th><th class='l1-col-info' width='300px;'>模块</th><th class='l1-col-info' width='300px;'>备注</th><th class='l1-col-info' width='100px;'>操作</th></tr></thead>";
			$.each(data.result,function(index, resource) {	
				rows = rows + "<tr><td class='l1-col-info' width='200px;'>"+ resource.name + "</td>";
				rows = rows + "<td class='l1-col-info' width='300px;'>" + resource.code + " </td>";
				rows = rows + "<td class='l1-col-info' width='300px;'>" + resource.fname + " </td>";
				rows = rows + "<td class='l1-col-info' width='300px;'>" + resource.memo + " </td>";
				rows = rows + "<td class='l1-col-info' width='100px;'> <a href='#'  onclick=divestResource('" + resource.id + "','" + authzId+ "'); >删除 </a> </td></tr>";
			});
			rows = rows + "</table>";
			rows = rows + "<div class=turn-page align='center'>";
			if (data.start >= data.pageSize) {
				rows = rows+ "<a href='#'  onclick=forLinkedResources('"+ (data.start - data.pageSize) + "','"+ data.pageSize + "','" + authzId+ "','" + functionId+ "');>上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
			}
			if ((data.total - data.start) > data.pageSize) {
				rows = rows+ "<a href='#'  onclick=forLinkedResources('"+ (data.start + data.pageSize) + "','"+ data.pageSize + "','" + authzId+ "','" + functionId+ "');>下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
			}
			rows = rows+ "&nbsp;&nbsp;&nbsp;&nbsp;"+ (1 + data.start / data.pageSize)+ "&nbsp;页&nbsp;&nbsp;&nbsp;&nbsp;共&nbsp;<font>"+ data.total+ "</font>&nbsp;条记录</div>";

			
			$("#content").append(rows);
		}
	});

}
//删除资源
function divestResource(resourceId, authzId) {
	$.post('${ctx}/bdrp/auth/resource/access/divest', {
		resIds : "'"+resourceId+"'",
		svrId : authzId
	}, function(res) {
		if (res.success) {
			$.messager.alert("提示","删除成功！","info");
			forLinkedResources('0', '5', '${model.id }','${model.function.id }');
		}else{
			$.messager.alert("提示","删除失败！","info");
		}
	});

}
function closePanel(){
	$('#resourceList').window('close');
}
</script>
</head>
<body>
<div class="box">
<div class="box-head">
	<div class="box-title">
		<h3>授权编辑</h3>
	<%-- <input type="hidden" id="functionName" name="model.function.name" value="${model.function.name }">  --%>
		
		<input type=hidden id=Start name=Start value='${pageBean.start}'>
		<input type=hidden id=PageSize name=PageSize value='${pageBean.pageSize}'>
		<a id="back" href="#" class='box-icon-a icon-back' style='float:right ;vertical-align: middle;margin-right:20px;height: 20px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;返回</a>
	</div>
</div>
<div class="box-container" style="display: inline-block;width: 100%;" >

<form method='post' id='authzForm' name='authzForm' action='${ctx}/bdrp/auth/access/saveAuthz.do' >
<div class=box>
		<table class=f-tab width=100% border=0 cellspacing=0 cellpadding=0>
				<tr class=f-tab-row-sep>
				<td class=f-tab-col-label-nowidth><label>名称<font color="red">&nbsp;*&nbsp;</font>：</label></td>
				<td class=f-tab-col-input-nowidth>
				<input type="hidden" id="authzId" name="id" value="${model.id }" >
				<input type="hidden" id="parentId" value="${model.function.id }">
				<input type=text id=name name="name" value="${model.name }" class='c-ff-input' _nullable=false _nullablemsg=请填写名称  _maxlength=50 _maxlengthmsg='最大长度为50'>
				<p id="msg" style="display : none;"><font color="red">* 名称必须填写</font></p>
				<p id="repeat" style="display : none;"><font color="red">* 该名称已存在,请重新填写!</font></p>
				<p id="empty" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
				</td>
			</tr>
			
			<tr class=f-tab-row>
				<td class=f-tab-col-label-nowidth style="width:10%"><label>对应功能<font color="red">&nbsp;*&nbsp;</font>：</label></td>
				<td class=f-tab-col-input-nowidth style="width:30%">
				<select id="parent" name="function.id" style="width:210px"></select>
				
				<p id="msg2" style="display : none;"><font color="red">* 功能必须选择</font></p>
				</td>
			</tr>
				<tr class=f-tab-row-sep>
				<td class=f-tab-col-label-nowidth><label>描述：</label></td>
				<td class=f-tab-col-input-nowidth>
				<textarea class='c-ff-textarea' id=descp name=descp >${model.descp}</textarea>
				</td>
			</tr>
			
		</table>
	
	</div><br><br><br>
	<div id=cbBanks class=float-tp-holder>
			<div class=float-tp-title-holder>
				<a id=tp1 href='javascript:void(0)' class=float-tp-title-active>资源信息</a>
				<div class=float-right>
					<a id="addBtn" href="#" class='box-icon-a'>添加资源</a>
				</div>
			</div>
			<div id=cbItems class=float-tp-item-holder>
			<div id="content" >
				<!-- 通过JS填充内容 -->
				
			</div>
			</div>
		</div>
			<div class="f-div-btn">
				<input id="save" type="button" class="normal-btn" value=保存>&nbsp;&nbsp;
				<input type=reset  class=normal-btn value=重置>&nbsp;&nbsp;
			</div> 
			</form>
</div>
</div>

<div id="resourceList" class="easyui-window" closed="true"/>
</body>
</html>


