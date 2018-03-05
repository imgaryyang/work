<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
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
			名称:<input type="text" id="authAccessName" name="authAccessName" value="${authAccessName }">
			功能:<input type="text" id="authAccessFunction" name="authAccessFunction" value="${authAccessFunction }">
			备注:<input type="text" id="authAccessDescp" name="authAccessDescp" value="${authAccessDescp }">
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
						<th class=l1-col-info style='width:20%;'>对应功能</th>
						<th class=l1-col-info style='width:35%;'>备注</th>
					</tr>
				</thead>
				<tbody>
					<c:forEach items="${pageBean.result}" var="item" varStatus="status">
						<tr class=l1-row>
							<td class=l1-col-info><input type=radio  name=checkAccess value='${item.id }' accName='${item.name }' class="beCheck"></td>
							<td class=l1-col-info id="${item.id }">${item.name } </td>
							<td class=l1-col-info>${item.function.name } </td>
							<td class=l1-col-info>${item.descp } </td>
						</tr>
					</c:forEach>
					
				</tbody>
			</table>
		</div>
		<div class=turn-page>
			<c:if test="${pageBean.start >= pageBean.pageSize}"><a _start=${pageBean.start - pageBean.pageSize} href='javascript:void(0)' onClick="reloadService('${pageBean.start- pageBean.pageSize}','${pageBean.pageSize }');">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;</c:if>
			<%-- <c:if test="${pageBean.start < pageBean.pageSize}"><a _start=${pageBean.start } href='javascript:void(0)' onClick="reloadService('${pageBean.start}','${pageBean.pageSize }');">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;</c:if> --%>
			<c:if test="${pageBean.start + pageBean.pageSize < pageBean.total}"><a _start=${pageBean.start + pageBean.pageSize  } href='javascript:void(0)' onClick="reloadService('${pageBean.start + pageBean.pageSize  }','${pageBean.pageSize }');">下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;</c:if>
			<%-- <c:if test="${pageBean.start + pageBean.pageSize >= pageBean.total}"><a _start=${pageBean.start } href='javascript:void(0)' onClick="reloadService('${pageBean.start }','${pageBean.pageSize }');">下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;</c:if> --%>
			<c:if test="${pageBean.start + pageBean.pageSize >= pageBean.total}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</c:if>
			&nbsp;&nbsp;&nbsp;&nbsp;${curPage}&nbsp;页&nbsp;&nbsp;&nbsp;&nbsp;共&nbsp;<font>${pageBean.total }</font>&nbsp;条记录
		</div>
	
	
		<div align="center">
			<input id="resSave" type=button class=normal-btn onclick='doLinkAuthAccess();' value=确认>&nbsp;&nbsp;
			<input type=reset class=normal-btn onclick="closeWin();" value=取消>
		</div>
	</div>
</div>
</body>
</html>