<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<title>授权编辑</title>

<script type="text/javascript">
var AuthzService;
$(document).ready(function(){
	$.initSpecInput();
	
	var parentId = $('#parentid').val();
	$('#parent').combotree({
		url : '${ctx}/puborgauthz/functionTree.do',
		required : false
	});
	
	$('#parent').combotree('setValue',parentId);
	
	forLinkedResourcesPub('0', '5', '${model.id }','${model.function.id }');
	
	//返回到主界面
	$("#back").click(function(){
		$('.one-center-panel').load('${ctx}/puborgauthz/authzMain.ihp');
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
		var authzid = $('#authzid').val();
		var Resourceid = $('#resourceId').val();
		var functionid = $('#functionId').val();
		$('#resourceList').window({    
		    title: '资源信息',    
		    width: 500,    
		    height: 400,    
		    closed: true,    
		    cache: false,   
		    modal: true,
		    href: '${ctx}/puborgauthz/authzResource.ihp',
		    queryParams : {authzid : authzid,Resourceid : Resourceid,functionid:functionid,start : '0',limit : '10'}
		      
		});  
		$('#resourceList').window('open');
	});
	
	
	/* //修改授权提交
	$("#save").click(function(){
		var name = $("#name").val();
		if (name.trim().length > 0) {
			$.post('${ctx}/puborgauthz/checkNameAuthz.ihp',{"name" : name,"id" : '${model.id }'},
					
				function(res) {
					if (res == "false") {
						$("#msg").hide();
						$("#repeat").show();
					}else{
						$('#authzForm').form({
							url : '${ctx}/puborgauthz/saveAuthz.do',
							onSubmit : doCheck,
							date:"name="+name,
							success : function(data){
								$.messager.alert("提示","数据保存成功！","info");
								$('.right-panel').load('${ctx}/puborgauthz/authzMain.ihp');
							}
						});
						$("#authzForm").submit();
					}
			});
		}else{
			$("#msg").show();
			$("#repeat").hide();
		}	
	}); */
/* 	$('.turn-page>a').on('click', function(){
		$('#Start').val($(this).attr('_start'));
		var authzid = $('#authzid').val();
		$('.right-panel').load('${ctx}/puborgauthz/editAuthz.ihp',{id:authzid});
	}); */
	$("#save").click(function(){	
		/* var comTree = $("#parent").combotree('tree');
		// 如果选择了树形下拉框，那么treeData为Object，没选则为：null
		var treeData = comTree.tree('getSelected');
		var parentId = "";
		// 判断是否选择节点
		if(treeData == null){
			parentId = $("#functionId").val();
		}else if(treeData.id.trim() == ""){
			//parentId = "";
			parentId = $("#functionId").val();
			return false;
		}else{
			parentId = treeData.id;
		}
		$("#functionId").val(parentId); */
		// **********
		$("#authzForm").form({
			url : "${ctx}/puborgauthz/saveAuthz.do",
			onSubmit : doCheck, 
			success : function(msg){
				if(msg == "success"){
					$('.one-center-panel').load('${ctx}/puborgauthz/authzMain.ihp');
				}else{
					alert(msg);
				}
			}
		});
		$("#authzForm").submit();
	});
	//$('#resourceList').window('close');
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
					type : "POST",
					url : "${ctx}/puborgauthz/checkNameAuthz.ihp",
					async : false,
					data : "name="+name+"&id="+'${model.id }',
						success : function(msg){
						if(msg == "success"){
							$("#repeat").hide();
							flag = true;
							
						}else if(msg == "exist"){
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
	
function removeResource(resourceid){
	var authzid = $('#authzid').val();
	var a=confirm("你确定要删除该资源吗 ？");
	if(a==true){
		$.ajax({
			url : '${ctx}/puborgauthz/removeResource.do',
			data : { resourceid: resourceid , authzid : authzid },
			dataType : 'text',
			success : function(data){
				if(data == "success"){
					$('.one-center-panel').load('${ctx}/puborgauthz/editAuthz.ihp',{id:authzid});
				}
			}
		});
	};
}

function PageUp(start){
	var authzid = $('#authzid').val();
	var Resourceid = $('#resourceId').val();
	$('#resourceList').window('refresh', '${ctx}/puborgauthz/authzResource.ihp?authzid='+authzid+'&Resourceid='+Resourceid + '&start='+start); 

}

function PageDown(start){
	var authzid = $('#authzid').val();
	var Resourceid = $('#resourceId').val();
	$('#resourceList').window('refresh', '${ctx}/puborgauthz/authzResource.ihp?authzid='+authzid+'&Resourceid='+Resourceid + '&start='+start); 
}



function bint(){
	var authzid = $('#authzid').val();
	var Resourceid = $('#resourceId').val();
	var i = 0;
	var resourceids = new Array();
	var alll = $("#alll").val();
	$('[name=checkresource]:checkbox:checked').each(function(){
		resourceids[i] = $(this).val();
		i++;
	});
	if(alll==0){
		$.messager.alert("提示","没有资源可供选择！","info");
	}else if(resourceids==""){
		$.messager.alert("提示","请选择至少一项！","info");
	}
	$.ajax({
		url : '${ctx}/puborgauthz/linkAuthz.do',
		traditional:true,
		data : {resourceids : resourceids,authzid : authzid,Resourceid : Resourceid},
		dataType : 'html',
		success : function(data){
			if(data == "success"){
			//	location.reload();
				$('.one-center-panel').load('${ctx}/puborgauthz/editAuthz.ihp',{id:authzid});
			}
		},
		error : function(){
			
		}
	});
}
//包含资源的分页
function forLinkedResourcesPub(start, limit, authzid,functionid) {
	$("#content").empty();
	$.ajax({url : '${ctx}/puborgauthz/linkedResources.ihp?limit='+ limit + '&start=' + start + '&authzid=' + authzid + '&functionid=' + functionid,
			type : 'post',
			data : '',
			dataType : 'json',
			success : function(data) {
				var rows = "<table class='l1-tab' ><thead><tr><th class='l1-col-info' width='200px;'>名称</th><th class='l1-col-info' width='300px;'>编码</th><th class='l1-col-info' width='300px;'>模块</th><th class='l1-col-info' width='300px;'>备注</th><th class='l1-col-info' width='100px;'>操作</th></tr></thead>";
				$.each(data.result,function(index, resource) {	
					rows = rows + "<tr><td class='l1-col-info' width='200px;'>"+ resource.name + "</td>";
					rows = rows + "<td class='l1-col-info' width='300px;'>" + resource.code + " </td>";
					rows = rows + "<td class='l1-col-info' width='300px;'>" + resource.fname + " </td>";
					rows = rows + "<td class='l1-col-info' width='300px;'>" + resource.memo + " </td>";
					rows = rows + "<td class='l1-col-info' width='100px;'> <a href='#'  onclick=delResource('" + resource.id + "','" + authzid+ "'); >删除 </a> </td></tr>";
				});
				rows = rows + "</table>";
				rows = rows + "<div class=turn-page align='center'>";
				if (data.start >= data.limit) {
					rows = rows+ "<a href='#'  onclick=forLinkedResourcesPub('"+ (data.start - data.limit) + "','"+ data.limit + "','" + authzid+ "','" + functionid+ "');>上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
				}
				if ((data.totalCount - data.start) > data.limit) {
					rows = rows+ "<a href='#'  onclick=forLinkedResourcesPub('"+ (data.start + data.limit) + "','"+ data.limit + "','" + authzid+ "','" + functionid+ "');>下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
				}
				rows = rows+ "&nbsp;&nbsp;&nbsp;&nbsp;"+ (1 + data.start / data.limit)+ "&nbsp;页&nbsp;&nbsp;&nbsp;&nbsp;共&nbsp;<font>"+ data.totalCount+ "</font>&nbsp;条记录</div>";

				
				$("#content").append(rows);
			}
		});

}
//删除资源
function delResource(resourceid, authzid) {
	$.post('${ctx}/puborgauthz/removeResource.do', {
		"resourceid" : resourceid,
		"authzid" : authzid
	}, function(res) {
		if (res == "success") {
			$.messager.alert("提示","删除成功！","info");
			forLinkedResourcesPub('0', '5', '${model.id }','${model.function.id }');
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
		<input type=hidden id=PageSize name=PageSize value='${pageBean.limit}'>
		<a id="back" href="#" class='box-icon-a icon-back' style='float:right ;vertical-align: middle;margin-right:20px;height: 20px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;返回</a>
	</div>
</div>
<div class="box-container" style="display: inline-block;width: 100%;" >

<form method='post' id='authzForm' name='authzForm' action='${ctx}/puborgauthz/saveAuthz.do' >
<div class=box>
		<table class=f-tab width=100% border=0 cellspacing=0 cellpadding=0>
				<tr class=f-tab-row-sep>
				<td class=f-tab-col-label-nowidth><label>名称<font color="red">&nbsp;*&nbsp;</font>：</label></td>
				<td class=f-tab-col-input-nowidth>
				<input type="hidden" id="authzid" name="model.id" value="${model.id }" >
				<input type="hidden" id="parentid" value="${model.function.id }">
				<input type=text id=name name=model.name value="${model.name }" class='c-ff-input' _nullable=false _nullablemsg=请填写名称  _maxlength=50 _maxlengthmsg='最大长度为50'>
				<p id="msg" style="display : none;"><font color="red">* 名称必须填写</font></p>
				<p id="repeat" style="display : none;"><font color="red">* 该名称已存在,请重新填写!</font></p>
				<p id="empty" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
				</td>
			</tr>
			
			<tr class=f-tab-row>
				<td class=f-tab-col-label-nowidth style="width:10%"><label>对应功能<font color="red">&nbsp;*&nbsp;</font>：</label></td>
				<td class=f-tab-col-input-nowidth style="width:30%">
				<select id="parent" name="model.function.id" style="width:210px"></select>
				
				<p id="msg2" style="display : none;"><font color="red">* 功能必须选择</font></p>
				</td>
			</tr>
				<tr class=f-tab-row-sep>
				<td class=f-tab-col-label-nowidth><label>描述：</label></td>
				<td class=f-tab-col-input-nowidth>
				<textarea class='c-ff-textarea' id=descp name=model.descp >${model.descp}</textarea>
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


