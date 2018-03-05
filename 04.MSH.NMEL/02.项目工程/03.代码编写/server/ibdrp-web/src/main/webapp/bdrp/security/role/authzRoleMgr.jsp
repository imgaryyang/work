<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<link rel="stylesheet" type="text/css" href="${ctx}/jQuery/plugin/pikaday.css">
<script type="text/javascript" src="${ctx}/jQuery/plugin/pikaday.jquery.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx }/jQuery/easyui-1.3.6/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="${ctx }/jQuery/easyui-1.3.6/themes/icon.css">
<script type="text/javascript" src="${ctx }/jQuery/easyui-1.3.6/scripts/jquery.easyui.min.js"></script> 

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
	  	var orgname=$("#orgGrid").val();
		var orgid=$("#oid").val();
		var name=$("#name").val();
		var des=$("#des").val();
		$.post('${ctx}/puborgauthz/authzRole.ihp?orgname='+orgname+'&orgId='+orgid+"&name="+name+"&descp="+des+"&Start="+start,function(data){
			$('.one-center-panel').html(data);
		});  
	 	
	});
});


function searchRole(){
	var orgname=$("#orgGrid").val();
	var orgid=$("#oid").val();
	var name=$("#name").val();
	var des=$("#des").val();
	$('.one-center-panel').load('${ctx}/puborgauthz/authzRole.ihp?orgname='+orgname+'&orgId='+orgid+"&name="+name+"&descp="+des);
	
}
function resetRole(){
	$("#orgGrid").val("");
	$("#oid").val("");
	$("#name").val("");
	$("#des").val("");
	
}
	function ondelete(id){
		var orgname=$("#orgGrid").val();
		var orgid=$("#oid").val();
		var name=$("#name").val();
		var des=$("#des").val();
		$.messager.confirm("确认删除", "你确定要删除角色吗？", function(flag){
			if(flag == true){
				$.post('${ctx}/puborgauthz/removeAuthzRole.ihp',{"id":id},function(res){
					if(res == "success"){
						$.messager.alert("提示","角色删除成功！","info");
						$('.one-center-panel').load('${ctx}/puborgauthz/authzRole.ihp?orgname='+orgname+'&orgId='+orgid+"&name="+name+"&descp="+des);
					}
				});
			}
		});
		
	}
	function onUpdate(id){
		var oid=$("#oid").val();
		var orgname=$("#orgGrid").val();
		$('.one-center-panel').load('${ctx}/puborgauthz/modRole.ihp?id='+id+'&oid='+oid+"&orgname="+orgname);
	}
	function onSave() {
		var oid=$("#oid").val();
		var orgname=$("#orgGrid").val();
		$('.one-center-panel').load('${ctx}/puborgauthz/addRole.ihp?oid='+oid+"&orgname="+orgname);
	}
	// **************浮动窗   start****************
	/************授权*************/
 		$("#accWindow").window({
			title : "选择菜单",
			width : 350,
			height : 600,
			collapsible : false,
			minimizable : false,
			maximizable : false,
			closed : true,
			modal : true,
			resizable : false
			
		}); 	
		
 		function onAccess(id){
 			var oid=$("#oid").val();
 			$("#rid").val(id);	
 			$("#accTree").tree({url : "${ctx}/puborgauthz/accMenus.do?rid="+id+"&oid="+oid,
			animate : true,
			checkbox :true,
			lines : true,
			onCheck:function(node,checked){
				 $.post('${ctx}/puborgauthz/doAccess.ihp',{"rid":id,"sid":node.sid,"checked":checked},function(res){
					if(res == "success"){
						
						}
					});  

				} 	
			});
 			
			$("#accWindow").window('open');
		}; 
			
	
	
	$("#orgWin").window({
		title : "选择机构",
		width : 500,
		height : 450,
		collapsible : false,
		minimizable : false,
		maximizable : false,
		closed : true,
		modal : true,
		resizable : false
		
	});  
	$('#orgGrid').click(function(){
		
		$('#gridOrg').treegrid({
			url : '${ctx}/puborgauthz/rootOrgList.do',
			idField : 'id',
			treeField: 'name',
			columns:[[
				{title : '名称',field : 'name',width : '150'},
				{title : '简称',field : 'shortName',width:'150'},
				{title : '机构号',field : 'brcCode',width:'130'}
			]],
			
				striped : true,
				singleSelect : false,
				queryParams : {
					start : '0',
					limit : '10'
				},
				method : 'post',
				loadFilter : pagerOrgFilter,
		//		fitColumns : true,
				pagination : true, //分页低栏
				rownumbers : true, //显示行号列
				pageSize : 10,
				pageList : [5,10,15,20],
				onBeforeLoad : loadorgChildren,
				onDblClickRow : orgClick
			});
		$("#orgWin").window('open');
	});
	
	
	function loadorgChildren(row) {
		if (row) {
			$('#gridOrg').treegrid('options').url = '${ctx}/puborgauthz/childrenOrgList.do?parentid=' + row.id;
		}
	}
	
	function pagerOrgFilter(data) {
		$('#gridOrg').treegrid('options').url = '${ctx}/puborgauthz/rootOrgList.do';
		$('#gridOrg').treegrid('getPager').pagination({
			onSelectPage : function(pageNum, pageSize) {
				$('#gridOrg').treegrid('options').pageNumber = pageNum;
				$('#gridOrg').treegrid('options').pageSize = pageSize;
				$('#gridOrg').treegrid('getPager').pagination('refresh', {
					pageNumber : pageNum,
					pageSize : pageSize
				});
				var startNum = (pageNum - 1) * pageSize;
				var name = $('#orgName').val();
				$('#gridOrg').treegrid('reload', {
					start : startNum,
					limit : pageSize,
					name:name
				});
			}
		});
		return data;
	}
	function orgClick(row){
		$('#oid').val(row.id);
		$('#orgGrid').val(row.name);
		$('.one-center-panel').load('${ctx}/puborgauthz/authzRole.ihp?orgId='+row.id+"&orgname="+row.name);
		$("#orgWin").window('close');
	}
	function search(){
		var name = $('#orgName').val();
		$('#gridOrg').treegrid('options').url = '${ctx}/puborgauthz/rootOrgList.do';
		$('#gridOrg').treegrid('reload',{start:'0',limit:'10',name:name});
	}
	
	
	
	
	
	
</script>
</head>
<body>
<div class="box">
	<div class="box-head">
		<div class="box-title">
			<h3>角色信息</h3>
			<div style="float:right ;margin:0px 20px 10px 0">
				<input type="button" name="addBtn" id="addBtn" onclick="onSave();" value="新增角色" >
			</div>
		</div>
	</div>
<div class="box-container">
<form  method="post" id="serachForm" name="serachForm" >
	<input type=hidden id=Start name=Start value='${pageBean.start}'>
	<input type=hidden id=PageSize name=PageSize value='${pageBean.limit}'>
	<div class=search-panel>
		<div style=' float:left;  display:inline; width:33%;'>
			<label class=sp-label style='width:25%'>所属机构：</label>
			<div class=sp-cdt style='width:73%'>
			<input type=hidden name="orgid"  id="oid" value="${orgId }">
			<input type=text   id="orgGrid" value="${orgName }" name=orgname size=20>
			</div>
		</div>
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
			<th class=l1-col-info style='width:40%;'>描述</th>
			<th class=l1-col-info style='width:20%;'>操作</th>
		</tr></thead><tbody>
	<c:forEach var="list" items="${pageBean.result}"  varStatus="status">
		<c:if test="${(status.count%2)==0}">
			<tr class=l1-row-sep ondblclick="onUpdate('${list.id}');">
				<td class=l1-col-info>${list.name}</td>
				<td class=l1-col-info >${list.descp}</td>		    
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
				<td class=l1-col-info >${list.descp}</td>		    
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
	<c:if test="${pageBean.start > 0}"><a _start=${pageBean.start - pageBean.limit} href='javascript:void(0)'>上一页</a></c:if>
	<c:if test="${pageBean.start + pageBean.limit < pageBean.totalCount}"><a _start=${pageBean.start + pageBean.limit} href='javascript:void(0)'>下一页</a></c:if>
	&nbsp;&nbsp;&nbsp;&nbsp;共<font>${pageBean.totalCount}</font>条记录
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
	
	<div id="orgWin">
		<div id="toolbar" align="right">
			<table cellspacing=0 cellpadding=0 >
			<tbody>
			<tr>
			<td>名称：<input type="text" id="orgName" class="c-ff-input-nowidth normal-height" ></td>
			<td>&nbsp;</td>
			<td><a href="javascript:search()" class="l-btn l-btn-small l-btn-plain">
				<span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">检索</span><span class="l-btn-icon icon-search">&nbsp;</span></span>
				</a>&nbsp;&nbsp;</td>
			</tr>
			</tbody>
			</table>
		</div>
		<table id="gridOrg">
		</table>
	</div>
	
		<!-- 浮动窗体 class="easyui-window" -->
	<div  id="accWindow">
		<div id="accTree" >
			<!-- <div id="accTree" >
				
			</div> -->
			
		</div>
		<!-- <input type="hidden" id="rid" name="rid">
		<div id="warrant" align="center">
			<input type=button class=normal-btn value=确认 onClick='doAcc()'>&nbsp;&nbsp;
			<input type=button class=normal-btn value=取消 onClick='closeWin()'>
		</div> -->
	</div>
</body>
