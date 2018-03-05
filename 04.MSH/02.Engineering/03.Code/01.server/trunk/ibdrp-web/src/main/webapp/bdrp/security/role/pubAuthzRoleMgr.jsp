<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<link rel="stylesheet" type="text/css" href="${ctx}/jQuery/plugin/pikaday.css">
<script type="text/javascript" src="${ctx}/jQuery/plugin/pikaday.jquery.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx }/jQuery/easyui-1.3.6/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="${ctx }/jQuery/easyui-1.3.6/themes/icon.css">
<script type="text/javascript" src="${ctx }/jQuery/easyui-1.3.6/scripts/jquery.easyui.min.js"></script> 

<title>公共角色</title>

<style type="text/css">
.box-icon-a {
	display: inline;
	padding-left: 13px;
	background-repeat: no-repeat;
	background-position: 1px 50%;
}
.l-btn-icon-left .l-btn-text {
margin: 0 4px 0 24px;
}
.l-btn-text {
display: inline-block;
vertical-align: top;
width: auto;
line-height: 24px;
font-size: 12px;
padding: 0;
margin: 0 4px;
}
Inherited from a.easyui-linkbutton.l-btn.l-btn-small
.l-btn:hover {
color: black;
}
.l-btn {
color: #444;
}
.l-btn {
cursor: pointer;
text-align: center;
}
a {
color: #08C;
font: 12px 微软雅黑,宋体;
}
user agent stylesheeta:-webkit-any-link {
color: -webkit-link;
cursor: auto;
}

.l1-tab th {
PADDING-BOTTOM: 4px;
PADDING-LEFT: 6px;
PADDING-RIGHT: 6px;
PADDING-TOP: 4px;
}
.l1-tab th {
BORDER-BOTTOM: #d9d9d9 1px solid;
PADDING-BOTTOM: 4px;
BACKGROUND-COLOR: #fafafa;
PADDING-LEFT: 6px;
PADDING-RIGHT: 6px;
PADDING-TOP: 4px;
}
.l1-tab td {
BORDER-BOTTOM: #d9d9d9 1px solid;
PADDING-BOTTOM: 4px;
PADDING-LEFT: 6px;
PADDING-RIGHT: 6px;
PADDING-TOP: 5px;
vertical-align: top;
}
.mouse_color{
background-color:#DFEEED;
}
</style>
<script type="text/javascript">
var $CTX = '${ctx}';
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
		$.post('${ctx}/puborgauthz/roleMain.ihp?name='+name+'&descp='+des+"&Start="+start,function(data){
			$('.one-center-panel').html(data);
		});  
	 	
	});
});
function searchRole(){

	var name=$("#name").val();
	var des=$("#des").val();
	$('.one-center-panel').load('${ctx}/puborgauthz/roleMain.ihp?name='+name+'&descp='+des);
	
}
function resetRole(){
	
	$("#name").val("");
	$("#des").val("");
	
}
	
	
	function ondelete(id){
		var name=$("#name").val();
		var des=$("#des").val();
		
		$.messager.confirm("确认删除", "你确定要删除公共角色吗？", function(flag){
			if(flag == true){
				$.post('${ctx}/puborgauthz/removeAuthzRole.ihp',{"id":id},function(res){
					if(res == "success"){
						$.messager.alert("提示","公共角色删除成功！","info");
						$('.one-center-panel').load('${ctx}/puborgauthz/roleMain.ihp?name='+name+'&descp='+des);
					}
				});
			}
		});
		
	}
	function onUpdate(id){
		$('.one-center-panel').load('${ctx}/puborgauthz/updRoleMain.ihp?id='+id+'&limit=10&start=0');
	}
	function onSave() {
		$('.one-center-panel').load('${ctx}/puborgauthz/addRoleMain.ihp');
	}
	
	
</script>
</head>
<body>
<div class="box">
	<div class="box-head">
		<div class="box-title">
			<h3>公共角色信息</h3>
			<div style="float:right ;margin:0px 20px 10px 0">
				<input type="button" name="addBtn" id="addBtn" onclick="onSave();" value="新增公共角色" >
			</div>
		</div>
	</div>
	<div class="box-container">
		<form  method="post" id="serachForm" name="serachForm" >
		<input type=hidden id=Start name=Start value='${pageBean.start}'>
		<input type=hidden id=PageSize name=PageSize value='${pageBean.limit}'>
		<div class=search-panel>
			<div style=' float:left;  display:inline; width:50%;'>
				<label class=sp-label style="width:25%">名称：</label>
				<div class=sp-cdt style='width:73%'><input type=text  id="name"  size=20 value="${name}"></div>
			</div>
			<div style=' float:left;display:inline; width:50%;'>
				<label class=sp-label style='width:25%'>描述 ：</label>
				<div class=sp-cdt style='width:73%'><input type=text  id="des"   size=20 value="${descp}"></div>
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
			<th class=l1-col-info style='width:40%;'>描述</th>
			<th class=l1-col-info style='width:20%;'>操作</th>
		</tr></thead><tbody>
	<c:forEach var="list" items="${pageBean.result}"  varStatus="status">
		<c:if test="${(status.count%2)==0}">
			<tr class=l1-row-sep ondblclick="onUpdate('${list.id}');">
				<td class=l1-col-info>${list.name}</td>
				<td class=l1-col-info >${list.descp}</td>		    
				<td class=l1-col-info>
					<input type=button class=mini-btn value="修改"  onclick="onUpdate('${list.id}');">&nbsp;&nbsp;&nbsp;&nbsp;
					<input type=button class=mini-btn  value="删除" onclick="ondelete('${list.id}');">
				</td>
			</tr> 
		</c:if>
		<c:if test="${ (status.count%2)!=0}">
			<tr class=l1-row ondblclick="onUpdate('${list.id}');">
				<td class=l1-col-info>${list.name}</td>
				<td class=l1-col-info >${list.descp}</td>		    
				<td class=l1-col-info>
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
	<c:if test="${pageBean.start > 0}"><a _start=${pageBean.start - pageBean.limit} href='javascript:void(0)'>上一页</a></c:if>
	<c:if test="${pageBean.start + pageBean.limit < pageBean.totalCount}"><a _start=${pageBean.start + pageBean.limit} href='javascript:void(0)'>下一页</a></c:if>
	&nbsp;&nbsp;&nbsp;&nbsp;共<font>${pageBean.totalCount}</font>条记录
</div>
<!-- <div class="box-container" >
<div class="panel-header panel-header-noborder" style="width: 778px; ">
<div class="panel-title">公共角色</div><div class="panel-tool"></div></div>

<div class="datagrid-toolbar">
<table cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td><a href="javascript:void(0)" onclick="onSave();"  class="l-btn l-btn-small l-btn-plain" group="" id="">
<span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">新增</span>
<span class="l-btn-icon icon-add">&nbsp;</span></span></a></td>
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

	填充的数据					
	<div id="content" style="margin: 0px;margin-top: 1px;"></div>
</div> -->
</div>
</body>
