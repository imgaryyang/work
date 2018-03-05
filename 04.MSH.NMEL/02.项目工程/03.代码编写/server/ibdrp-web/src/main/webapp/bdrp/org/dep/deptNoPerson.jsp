<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<link rel="stylesheet" type="text/css" href="${ctx}/jQuery/plugin/pikaday.css">
<script type="text/javascript" src="${ctx}/jQuery/plugin/pikaday.jquery.js"></script>
<title>添加部门人员</title>
<link rel="stylesheet" type="text/css" href="${ctx }/jQuery/easyui-1.3.6/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="${ctx }/jQuery/easyui-1.3.6/themes/icon.css">
<script type="text/javascript" src="${ctx }/jQuery/easyui-1.3.6/scripts/jquery.easyui.min.js"></script>

<script type="text/javascript">
$(document).ready(function(){
	$.initSpecInput();
	
});

</script>
</head>
<body>
<form>
<div class="box">
<div class="box-container" >
<div >

名称：<input type="text" width="120px;" id="pname" value="${pname }">

<a href=# onclick=reloadPersonList("${id}","${orgId}"); class=easyui-linkbutton iconCls=icon-search>检索</a>&nbsp;&nbsp;&nbsp;&nbsp;
</div>
	<div>
	<table class="l1-tab">
		<thead>
			<tr>
			<th class=l1-col-info style='width:10%;'><input type="checkbox" id="All" name="All" onClick="selectAll();"></th>
				<th class=l1-col-info style='width:25%;'>名称</th>
				<th class=l1-col-info style='width:15%;'>性别</th>
				<th class=l1-col-info style='width:25%;'>职位</th>
				<th class=l1-col-info style='width:25%;'>岗位</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="person" items="${pageBean.result}"  varStatus="status">
				 <tr class=f-tab-row>
				 <td class=l1-col-info><input type=checkbox id=checkperson name=checkperson value='${person.id }'></td>
				 	<td class=l1-col-info>${person.name}</td>
					<td class=l1-col-info ><c:if test="${person.sex == '0'}">男</c:if><c:if test="${person.sex == '1'}">女</c:if></td>
				  <%--   <td class=l1-col-info>
				   
				    <c:forEach var="posts" items="${list.posts }">
				    	${posts.name}
				    </c:forEach>
				    </td>
				    <td class=l1-col-info>
				    <c:forEach var="stations" items="${list.stations}">
				    	${stations.name} 
				    </c:forEach>
				    </td>
				     --%>
				</tr> 
			</c:forEach>
		</tbody>
	</table>
	</div>

<div class=turn-page>
	<c:if test="${personBean.start > 0}"><a _start=${personBean.start - personBean.pageSize} href='javascript:void(0)' onClick='PageTurn(${personBean.start - personBean.pageSize},${personBean.pageSize});'>上一页</a></c:if>
	<c:if test="${personBean.start + personBean.pageSize < personBean.total}"><a _start=${personBean.start + personBean.pageSize} href='javascript:void(0)' onClick='PageTurn(${personBean.start + personBean.pageSize},${personBean.pageSize});'>下一页</a></c:if>
	&nbsp;&nbsp;&nbsp;&nbsp;共<font>${personBean.total}</font>条记录
	<input type="hidden" id="alll" value="${personBean.total}"/>
</div>

<div align="center">
	<input type=button class=normal-btn value=确认 onClick='bint()'>&nbsp;&nbsp;
	<input type=button class=normal-btn value=关闭 onClick='closePanel()'>
</div>

</div>
</div>
</form>
</body>
</html>