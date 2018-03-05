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
	var sids = '';
	var sids2 = '';
	$(document).ready(
			function() {
				$.initSpecInput();
				// ****防止页面DIV过多，造成缓慢**********
				$(".combo-p").remove();
				//$(".window").remove();
				//$(".window-shadow").remove();;
				//$(".window-mask").remove();
				$(".c-ff-input-warning").remove();
				$(".pika-single").remove();
				// ****防止页面DIV过多，造成缓慢******
				$('.turn-page>a').on(
						'click',
						function() {
							$('#Start').val($(this).attr('_start'));
							var start = $('#Start').val();
							var orgName = $("#orgName").val();
							var orgid = $("#orgId").val();
							var name = $("#name").val();
							var des = $("#des").val();
							$.post('${ctx}/bdrp/org/role/main?orgName='
									+ orgName + '&orgId=' + orgid + "&name="
									+ name + "&descp=" + des + "&Start="
									+ start, function(data) {
								$('.one-center-panel').html(data);
							});

						});
			});

	function searchRole() {
		var orgName = $("#orgName").val();
		var orgid = $("#orgId").val();
		var name = $("#name").val();
		var des = $("#des").val();
		$('.one-center-panel').load(
				'${ctx}/bdrp/org/role/main?orgName=' + orgName + '&orgId='
						+ orgid + "&name=" + name + "&descp=" + des);

	}
	function resetRole() {
		$("#name").val("");
		$("#des").val("");

	}
	function doDelete(id) {
		var orgName = $("#orgName").val();
		var orgid = $("#orgId").val();
		var name = $("#name").val();
		var des = $("#des").val();
		$.messager.confirm("确认删除", "你确定要删除角色吗？", function(flag) {
			if (flag == true) {
				$.ajax({
					type : "DELETE",
					url : '${ctx}/bdrp/org/role/remove/' + id,
					data : "",
					dataType : "json",
					success : function(msg) {
						if (msg.success) {
							$.messager.alert("提示", "删除成功", "info");
							//	$("#tree").treegrid("reload");	// 如果删除子节点，那么页面刷新后为空白
							$('.one-center-panel').load(
								'${ctx}/bdrp/org/role/main?orgName='
										+ orgName + '&orgId='
										+ orgid + "&name=" + name
										+ "&descp=" + des);
						} else {
							$.messager.alert("错误", "该功能已被使用，无法删除！");
						}
					},
					error : function() {
						$.messager.alert("错误", "删除失败！");
					}
				});
			}
		});

	}
	function doUpdate(id) {
		var orgId = $("#orgId").val();
		var orgName = $("#orgName").val();
		$('.one-center-panel').load(
				'${ctx}/bdrp/org/role/edit/' + id + '?orgId=' + orgId + "&orgName="
						+ orgName);
	}
	function doAdd() {
		var orgId = $("#orgId").val();
		var orgName = $("#orgName").val();
		$('.one-center-panel').load(
				'${ctx}/bdrp/org/role/add.jsp?orgId=' + orgId + "&orgName="
						+ orgName);
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

	function onAccess(id) {
		var orgId = $("#orgId").val();
		$("#rid").val(id);
		$("#accTree").tree({
			url : "${ctx}/bdrp/auth/menu/tree/" + id,
			animate : true,
			method : 'GET',
			checkbox : true,
			lines : true,
			cascadeCheck : false,
			formatter : function(node) {
				node.text = node.name;
				if (node.rid)
					node.checked = true;
				return node.text;
			},
			onCheck : function(node, checked) {
				$.post('${ctx}/bdrp/auth/access/authorize', {
					"rid" : id,
					"aid" : node.aid,
					"checked" : checked
				}, function(res) {
					if (res == "success") {

					}
				});

			}
		});

		$("#accWindow").window('open');
	};

	
	function showChooseOrgWin(){
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
		$("#orgWin").window('open');
		$('#gridOrg').treegrid({
			url : '${ctx}/bdrp/org/org/page',
			method : 'get',
			idField : 'id',
			treeField : 'name',
			columns : [ [ {
				title : '名称',
				field : 'name',
				width : '150'
			}, {
				title : '简称',
				field : 'shortName',
				width : '150'
			}, {
				title : '机构号',
				field : 'brcCode',
				width : '130'
			} ] ],

			striped : true,
			singleSelect : false,
			queryParams : {
				start : '0',
				pageSize : '10'
			},
			loadFilter : pagerOrgFilter,
			//		fitColumns : true,
			pagination : true, //分页低栏
			rownumbers : true, //显示行号列
			pageSize : 10,
			pageList : [ 5, 10, 15, 20 ],
			onBeforeLoad : loadorgChildren,
			onDblClickRow : orgClick
		});
	}
	$('#orgName').click(showChooseOrgWin);

	function loadorgChildren(row) {
		if (row) {
			$('#gridOrg').treegrid('options').url = '${ctx}/bdrp/org/org/page?parentid=' + row.id;
		}
	}

	function pagerOrgFilter(data) {
		$('#gridOrg').treegrid('options').url = '${ctx}/bdrp/org/org/page';
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
					pageSize : pageSize,
					name : name
				});
			}
		});
		data.rows = [];
		if (null != data.result) {
			for (var i = 0; i < data.result.length; i++) {
				data.rows[i] = data.result[i];
				if (data.result[i].parent) {
					data.rows[i]._parentId = data.result[i].parent.id;
				}
			}
			delete data.result;
		}
		return data;
	}
	function orgClick(row) {
		$('#orgId').val(row.id);
		$('#orgName').val(row.name);
		$('.one-center-panel').load(
				'${ctx}/bdrp/org/role/main?orgId=' + row.id + "&orgName="
						+ row.name);
		$("#orgWin").window('close');
	}
	function search() {
		var name = $('#orgName').val();
		$('#gridOrg').treegrid('options').url = '${ctx}/bdrp/org/role/main';
		$('#gridOrg').treegrid('reload', {
			start : '0',
			pageSize : '10',
			name : name
		});
	}
	
	if(!$("#orgId").val()){
		showChooseOrgWin();
	}
</script>
</head>
<body>
	<div class="box">
		<div class="box-head">
			<div class="box-title">
				<h3>角色信息</h3>
				<div style="float: right; margin: 0px 20px 10px 0">
					<input type="button" name="addBtn" id="addBtn" onclick="doAdd();"
						value="新增角色">
				</div>
			</div>
		</div>
		<div class="box-container">
			<form method="post" id="serachForm" name="serachForm">
				<input type=hidden id=Start name=Start value='${pageBean.start}'>
				<input type=hidden id=PageSize name=PageSize
					value='${pageBean.pageSize}'>
				<div class=search-panel>
					<div style='float: left; display: inline; width: 33%;'>
						<label class=sp-label style='width: 25%'>所属机构：</label>
						<div class=sp-cdt style='width: 73%'>
							<input type=hidden name="orgId" id="orgId" value="${param.orgId }">
							<input type=text id="orgName" value="${param.orgName }"
								name=orgName size=20>
						</div>
					</div>
					<div style='float: left; display: inline; width: 32%;'>
						<label class=sp-label style="width: 25%">名称：</label>
						<div class=sp-cdt style='width: 73%'>
							<input type=text id="name" size=20 value="${name}">
						</div>
					</div>
					<div style='float: left; display: inline; width: 33%;'>
						<label class=sp-label style='width: 25%'>描述 ：</label>
						<div class=sp-cdt style='width: 73%'>
							<input type=text id="des" size=20 value="${descp}">
						</div>
					</div>

					<div class=sp-btns>
						<input type=button name=search id=search class=mini-btn value=搜索
							onClick="searchRole();">&nbsp;&nbsp;&nbsp;&nbsp; <input
							type=button name=reset id=reset class=mini-btn value=重置
							onClick="resetRole();">
					</div>
				</div>
			</form>
		</div>
		<div>
			<table class="l1-tab">
				<thead>
					<tr>
				<thead>
					<th class=l1-col-info style='width: 20%;'>名称</th>
					<th class=l1-col-info style='width: 30%;'>描述</th>
					<th class=l1-col-info style='width: 20%;'>操作</th>
					</tr>
				</thead>
				<tbody>
					<c:forEach var="list" items="${pageBean.result}" varStatus="status">
						<c:if test="${(status.count%2)==0}">
							<tr class=l1-row-sep ondblclick="doUpdate('${list.id}');">
								<td class=l1-col-info>${list.name}</td>
								<td class=l1-col-info>${list.memo}</td>
								<td class=l1-col-info><input type=button class=mini-btn
									value="授权" onclick="onAccess('${list.id}');">&nbsp;&nbsp;&nbsp;&nbsp;
									<input type=button class=mini-btn value="修改"
									onclick="doUpdate('${list.id}');">&nbsp;&nbsp;&nbsp;&nbsp;
									<input type=button class=mini-btn value="删除"
									onclick="doDelete('${list.id}');"></td>
							</tr>
						</c:if>
						<c:if test="${ (status.count%2)!=0}">
							<tr class=l1-row ondblclick="doUpdate('${list.id}');">
								<td class=l1-col-info>${list.name}</td>
								<td class=l1-col-info>${list.memo}</td>
								<td class=l1-col-info><input type=button class=mini-btn
									value="授权" onclick="onAccess('${list.id}');">&nbsp;&nbsp;&nbsp;&nbsp;
									<input type=button class=mini-btn value="修改"
									onclick="doUpdate('${list.id}');">&nbsp;&nbsp;&nbsp;&nbsp;
									<input type=button class=mini-btn value="删除"
									onclick="doDelete('${list.id}');"></td>
							</tr>
						</c:if>
					</c:forEach>
				</tbody>
			</table>
		</div>


		<div class=turn-page>
			<c:if test="${pageBean.start > 0}">
				<a _start=${pageBean.start - pageBean.pageSize}
					href='javascript:void(0)'>上一页</a>
			</c:if>
			<c:if test="${pageBean.start + pageBean.pageSize < pageBean.total}">
				<a _start=${pageBean.start + pageBean.pageSize}
					href='javascript:void(0)'>下一页</a>
			</c:if>
			&nbsp;&nbsp;&nbsp;&nbsp;共<font>${pageBean.total}</font>条记录
		</div>

		<div id="orgWin">
			<table id="gridOrg">
			</table>
		</div>

		<!-- 浮动窗体 class="easyui-window" -->
		<div id="accWindow">
			<div id="accTree">
			</div>
		</div>
</body>