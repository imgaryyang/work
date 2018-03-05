<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<link rel="stylesheet" type="text/css" href="${ctx}/jQuery/plugin/pikaday.css">
<script type="text/javascript" src="${ctx}/jQuery/plugin/pikaday.jquery.js"></script>
<title>新增功能管理</title>

<!-- easyui 主题CSS -->
<link rel="stylesheet" type="text/css" href="${ctx }/jQuery/easyui-1.3.6/themes/default/easyui.css">
<!-- easyui 图标 CSS -->
<link rel="stylesheet" type="text/css" href="${ctx }/jQuery/easyui-1.3.6/themes/icon.css">
<!-- easyui核心类库 -->
<script type="text/javascript" src="${ctx }/jQuery/easyui-1.3.6/scripts/jquery.easyui.min.js"></script>

<script type="text/javascript">
	$(document).ready(function(){
		$.initSpecInput();
		
		
	});
	
	
</script>
</head>
<body>
<div class="box">
	<div class="box-container" >
		<div >
			名称:<input type="text" id="authzServiceName" name="authzServiceName" value="${authzServiceName }">
			功能:<input type="text" id="authzServiceFunction" name="authzServiceFunction" value="${authzServiceFunction }">
			备注:<input type="text" id="authzServiceDescp" name="authzServiceDescp" value="${authzServiceDescp }">
			<a id="authzServiceSearch" icon="icon-search" href="#" onclick="conditionSearch()" class="easyui-linkbutton" plain="true"></a>
		</div>
		<div>
			<table class="l1-tab">
				<thead>
					<tr>
						<!-- 
						<th class=l1-col-info style='width:5%;'><input type="checkbox" id="checkAll" name="checkAll" onclick="checkAll();"></th>
						 -->
						<th class=l1-col-info style='width:10%;'>编号</th>
						<th class=l1-col-info style='width:15%;'>名称</th>
						<th class=l1-col-info style='width:20%;'>所属</th>
						<th class=l1-col-info style='width:20%;'>对应功能</th>
						<th class=l1-col-info style='width:35%;'>备注</th>
					</tr>
				</thead>
				<tbody>
					<c:forEach items="${pageBean.result}" var="service" varStatus="status">
						<tr class=l1-row>
							<td class=l1-col-info><input type=checkbox  name=checkService value='${service.id }' class="beCheck"></td>
							<td class=l1-col-info id="${service.id }">${service.name } </td>
							<td class=l1-col-info>${service.property.name } </td>
							<td class=l1-col-info>${service.function.name } </td>
							<td class=l1-col-info>${service.descp } </td>
						</tr>
					</c:forEach>
					
				</tbody>
			</table>
		</div>
		<div class=turn-page>
			<c:if test="${pageBean.start >= pageBean.limit}"><a _start=${pageBean.start - pageBean.limit} href='javascript:void(0)' onClick="reloadService('${pageBean.start- pageBean.limit}','${pageBean.limit }');">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;</c:if>
			<%-- <c:if test="${pageBean.start < pageBean.limit}"><a _start=${pageBean.start } href='javascript:void(0)' onClick="reloadService('${pageBean.start}','${pageBean.limit }');">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;</c:if> --%>
			<c:if test="${pageBean.start + pageBean.limit < pageBean.totalCount}"><a _start=${pageBean.start + pageBean.limit  } href='javascript:void(0)' onClick="reloadService('${pageBean.start + pageBean.limit  }','${pageBean.limit }');">下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;</c:if>
			<%-- <c:if test="${pageBean.start + pageBean.limit >= pageBean.totalCount}"><a _start=${pageBean.start } href='javascript:void(0)' onClick="reloadService('${pageBean.start }','${pageBean.limit }');">下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;</c:if> --%>
			<c:if test="${pageBean.start + pageBean.limit >= pageBean.totalCount}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</c:if>
			&nbsp;&nbsp;&nbsp;&nbsp;${curPage}&nbsp;页&nbsp;&nbsp;&nbsp;&nbsp;共&nbsp;<font>${pageBean.totalCount }</font>&nbsp;条记录
		</div>
	
	
		<div align="center">
			<input id="resSave" type=button class=normal-btn onclick='saveLinkAuthzService();' value=确认>&nbsp;&nbsp;
			<input type=reset class=normal-btn onclick="closeWin();" value=取消>
		</div>
	</div>
</div>
</body>
</html>