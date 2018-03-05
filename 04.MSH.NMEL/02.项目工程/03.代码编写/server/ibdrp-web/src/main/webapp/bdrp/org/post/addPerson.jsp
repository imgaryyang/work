<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<link rel="stylesheet" type="text/css" href="${ctx}/jQuery/plugin/pikaday.css">
<script type="text/javascript" src="${ctx}/jQuery/plugin/pikaday.jquery.js"></script>
<title>添加用户</title>
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
<div class="box">
<div class="box-container" >
<div >

名称：<input type="text" width="120px;" id="pname" value="${pname }">

<a href=# onclick=reloadPersonList("${id}","${oid}"); class=easyui-linkbutton iconCls=icon-search>检索</a>&nbsp;&nbsp;&nbsp;&nbsp;
</div>
	<div>
<table class="l1-tab">
	<thead>
		<tr>
			<th class=l1-col-info style='width:10%;'><input type="checkbox"  id="serviceCB" onClick="clickSCB();" ></th>
			<th class=l1-col-info style='width:20%;'>姓名</th>
			<th class=l1-col-info style='width:10%;'>性别</th>
			<th class=l1-col-info style='width:20%;'>部门</th>
			<th class=l1-col-info style='width:20%;'>职位</th>
			<th class=l1-col-info style='width:20%;'>岗位</th>
		</tr>
	</thead>
	<tbody>
		<c:forEach var="person" items="${pageBean.result}"  varStatus="status">
			 <tr class=l1-row>
			 <td class=l1-col-info><input type=checkbox  name=checkService value='${person.id }'></td>
			 	<td class=l1-col-info>${person.name}</td>
				<c:if test="${person.sex ==1}">
					<td class=l1-col-info>男</td>
				</c:if>
				<c:if test="${person.sex ==0}">
					<td class=l1-col-info>女</td>
				</c:if>
		<%-- 	<td class=l1-col-info>
				<c:forEach var="deps" items="${person.deps}" varStatus="stdep1">
					<c:if test="${stdep1.last}">
					 ${deps.name}
					</c:if>
			    	<c:if test="${! stdep1.last}">
					 ${deps.name},
					</c:if>
			    </c:forEach>
				</td>
				<td class=l1-col-info>
				  <c:forEach var="posts" items="${person.posts}" varStatus="stdep2">
				  	<c:if test="${stdep2.last}">
					 ${posts.name}
					</c:if>
			    	<c:if test="${! stdep2.last}">
					 ${posts.name},
					</c:if>
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
	<c:if test="${personBean.start + personBean.pageSize < personBean.total}"><a _start=${personBean.start + personBean.pageSize} href='javascript:void(0)' onClick='reloadPerson(${personBean.start + personBean.pageSize},${personBean.pageSize});'>下一页</a></c:if>
	&nbsp;&nbsp;&nbsp;&nbsp;共<font>${personBean.total}</font>条记录
	<input type="hidden" id="alll" value="${personBean.total}"/>
</div>

<div align="center">
<input type=button class=normal-btn value=确认 onClick='saveLinkService()'>&nbsp;&nbsp;
<input type=button class=normal-btn value=取消 onClick='closeWin()'>
</div>
</div>
</div>
</body>
</html>