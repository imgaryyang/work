<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>

<title>角色管理</title>

<style type="text/css">
.box-icon-a {
	display: inline;
	padding-left: 13px;
	background-repeat: no-repeat;
	background-position: 1px 50%;
}
</style>
<script type="text/javascript">
var $CTX = '${ctx}';
var sids='';
var sids2='';
$(document).ready(function(){
	$.initSpecInput();
	// ****防止页面DIV过多，造成缓慢**********
	$(".combo-p").remove();
	//$(".window").remove();
	//$(".window-shadow").remove();;
	//$(".window-mask").remove();
	$(".c-ff-input-warning").remove();
	$(".pika-single").remove();
	// ****防止页面DIV过多，造成缓慢******
	$('.turn-page>a').on('click', function(){
		$('#Start').val($(this).attr('_start'));
	  	var start = $('#Start').val();
		var name=$("#name").val();
		var des=$("#des").val();
		$.post("${ctx}/bdrp/org/pubrole/main?name="+name+"&descp="+des+"&Start="+start,function(data){
			$('.one-center-panel').html(data);
		});  
	 	
	});
});


function searchRole(){
	var name=$("#name").val();
	var des=$("#des").val();
	$('.one-center-panel').load("${ctx}/bdrp/org/pubrole/main?name="+name+"&descp="+des);
	
}
function resetRole(){
	$("#name").val("");
	$("#des").val("");
}
	function ondelete(id){
		var name=$("#name").val();
		var des=$("#des").val();
		$.messager.confirm("确认删除", "你确定要删除角色吗？", function(flag){
			if(flag == true){
				$.ajax({
					type : "DELETE",
					url : '${ctx}/bdrp/org/pubrole/remove/'+id,
					data : "",
					dataType : "json",
					success : function(msg){
						if(msg.success){
							$.messager.alert("提示","删除成功","info");
						//	$("#tree").treegrid("reload");	// 如果删除子节点，那么页面刷新后为空白
							$('.one-center-panel').load("${ctx}/bdrp/org/pubrole/main?name="+name+"&descp="+des);
						}else{
							$.messager.alert("错误","该功能已被使用，无法删除！");
						}
					},
					error : function(){
						$.messager.alert("错误","删除失败！");
					}
				});
			}
		});
		
	}
	function onUpdate(id){
		$('.one-center-panel').load('${ctx}/bdrp/org/pubrole/edit/'+id);
	}
	function onSave() {
		$('.one-center-panel').load('${ctx}/bdrp/org/pubrole/add.jsp');
	}
	// **************浮动窗   start****************
	/************授权*************/
 		$("#accWindow").window({
			title : "选择菜单",
			width : 400,
			height : 500,
			collapsible : false,
			minimizable : false,
			maximizable : false,
			closed : true,
			modal : true,
			resizable : false
			
		}); 	
		
 		function onAccess(id){
 			$("#accTree").tree({url : "${ctx}/bdrp/auth/menu/tree/"+id,
				animate : true,
				method : 'GET',	
				checkbox :true,
				lines : true,
				cascadeCheck : false,
				formatter : function(node) {
					node.text = node.name;
					if(node.rid )node.checked=true;
					return node.text;
				},
				onCheck:function(node,checked){
					 $.post('${ctx}/bdrp/auth/access/authorize',{"rid":id,"aid":node.aid,"checked":checked},function(res){
						if(res == "success"){
							
							}
						});  
	
					} 	
			});
 			
			$("#accWindow").window('open');
		}; 
	
</script>
</head>
<body>
<div class="box">
	<div class="box-head">
		<div class="box-title">
			<h3>公共角色</h3>
			<div style="float:right ;margin:0px 20px 10px 0">
				<input type="button" name="addBtn" id="addBtn" onclick="onSave();" value="新增角色" >
			</div>
		</div>
	</div>
<div class="box-container">
<form  method="post" id="serachForm" name="serachForm" >
	<input type=hidden id=Start name=Start value='${pageBean.start}'>
	<input type=hidden id=PageSize name=PageSize value='${pageBean.pageSize}'>
	<div class=search-panel>
		<div style=' float:left;  display:inline; width:32%;'>
			<label class=sp-label style="width:25%">名称：</label>
			<div class=sp-cdt style='width:73%'><input type=text  id="name"  size=20 value="${name}" ></div>
		</div>
		<div style=' float:left;display:inline; width:33%;'>
			<label class=sp-label style='width:25%'>描述 ：</label>
			<div class=sp-cdt style='width:73%'><input type=text  id="des"   size=20 value="${descp}" ></div>
		</div>
		
		<div class=sp-btns>
			<input type=button name=search id=search class=mini-btn value=搜索 onClick="searchRole();">&nbsp;&nbsp;&nbsp;&nbsp;
			<input type=button name=reset id=reset class=mini-btn value=重置 onClick="resetRole();">
		</div>
	</div>
	</form>
</div>
<div>
<table class="l1-tab">
	<thead><tr><thead>
			<th class=l1-col-info style='width:20%;'>名称</th>
			<th class=l1-col-info style='width:30%;'>描述</th>
			<th class=l1-col-info style='width:20%;'>操作</th>
		</tr></thead><tbody>
	<c:forEach var="list" items="${pageBean.result}"  varStatus="status">
		<c:if test="${(status.count%2)==0}">
			<tr class=l1-row-sep ondblclick="onUpdate('${list.id}');">
				<td class=l1-col-info>${list.name}</td>
				<td class=l1-col-info>${list.memo}</td>		    
				<td class=l1-col-info>
					<input type=button class=mini-btn value="授权"  onclick="onAccess('${list.id}');">&nbsp;&nbsp;&nbsp;&nbsp;
					<input type=button class=mini-btn value="修改"  onclick="onUpdate('${list.id}');">&nbsp;&nbsp;&nbsp;&nbsp;
					<input type=button class=mini-btn  value="删除" onclick="ondelete('${list.id}');">
				</td>
			</tr> 
		</c:if>
		<c:if test="${ (status.count%2)!=0}">
			<tr class=l1-row ondblclick="onUpdate('${list.id}');">
				<td class=l1-col-info>${list.name}</td>
				<td class=l1-col-info >${list.memo}</td>		    
				<td class=l1-col-info>
					<input type=button class=mini-btn value="授权"  onclick="onAccess('${list.id}');">&nbsp;&nbsp;&nbsp;&nbsp;
					<input type=button class=mini-btn value="修改"  onclick="onUpdate('${list.id}');">&nbsp;&nbsp;&nbsp;&nbsp;
					<input type=button class=mini-btn  value="删除" onclick="ondelete('${list.id}');">
				</td>
			</tr> 
		</c:if>
	</c:forEach>
	</tbody>
</table>
</div>


<div class=turn-page>
	<c:if test="${pageBean.start > 0}"><a _start=${pageBean.start - pageBean.pageSize} href='javascript:void(0)'>上一页</a></c:if>
	<c:if test="${pageBean.start + pageBean.pageSize < pageBean.total}"><a _start=${pageBean.start + pageBean.pageSize} href='javascript:void(0)'>下一页</a></c:if>
	&nbsp;&nbsp;&nbsp;&nbsp;共<font>${pageBean.total}</font>条记录
</div>
	<%-- <div class="box">
	
		<div class="box-container" >
			<div class="panel-header panel-header-noborder" style="width: 778px; ">
				<div class="panel-title">角色信息</div><div class="panel-tool"></div>
			</div>
			<div id="serviceList" class="easyui-window" closed="true"/>
			<div class="datagrid-toolbar">
				<table cellspacing="0" cellpadding="0">
				<tbody>
					<tr>
						<td><a href="javascript:void(0)" onclick="onSave();"  class="l-btn l-btn-small l-btn-plain" group="" id="">
						<span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">新增</span>
						<span class="l-btn-icon icon-add">&nbsp;</span></span></a></td>
						<td><div class="datagrid-btn-separator"></div></td>
						<td><a href="javascript:void(0)" class="l-btn l-btn-small l-btn-plain" group="" id="">
						<span class="l-btn-left"><span class="l-btn-text" ><span style="color: red;">所属机构*</span>：
							<input type="text" width="120px;" id="orgGrid" value="${orgName }">
							<input type="hidden" id="oid"  value="${orgId }"></span></span></a></td>
						
						
						<td><div class="datagrid-btn-separator"></div></td>
						<td><a href="javascript:void(0)" class="l-btn l-btn-small l-btn-plain" group="" id="">
						<span class="l-btn-left"><span class="l-btn-text">名称：
							<input type="text" width="120px;" id="name" ></span></span></a></td>
						<td><a href="javascript:void(0)" class="l-btn l-btn-small l-btn-plain" group="" id="">
						<span class="l-btn-left"><span class="l-btn-text">备注：
							<input type="text" width="120px;" id="des" ></span></span></a></td>
						<td><a href="javascript:void(0)" onclick="forRoleList('0','10');" class="l-btn l-btn-small l-btn-plain" group="" id="">
						<span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">检索</span>
						<span class="l-btn-icon icon-search">&nbsp;</span></span></a></td>
					</tr>
				</tbody>
				</table>
			</div>
		
			<!-- 填充的数据	 -->				
			<div id="content" style="margin: 0px;margin-top: 1px;"></div>
		</div> --%>
	</div>
	
	
	<!-- 浮动窗体 class="easyui-window" -->
	<div  id="accWindow">
		<div id="accTree" ></div>
	</div>
</body>
