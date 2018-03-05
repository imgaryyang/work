<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<title>添加用户</title>
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

<%-- 名称：<input type="text" width="120px;" id="pname" value="${pname }"> --%>

<%-- <a href=# onclick=reloadPersonList("${id}","${oid}"); class=easyui-linkbutton iconCls=icon-search>检索</a>&nbsp;&nbsp;&nbsp;&nbsp; --%>
</div>
	<div>
<table class="l1-tab">
	<thead>
		<tr>
			<th class=l1-col-info style='width:10%;'><input type="checkbox"  id="serviceCB" onClick="clickSCB();" ></th>
			<th class=l1-col-info style='width:20%;'>机构名称</th>
			<th class=l1-col-info style='width:10%;'>机构号</th>
			<!-- <th class=l1-col-info style='width:20%;'>部门</th>
			<th class=l1-col-info style='width:20%;'>职位</th>
			<th class=l1-col-info style='width:20%;'>岗位</th> -->
		</tr>
	</thead>
	<tbody>
		<c:forEach var="org" items="${pageBean.result}"  varStatus="status">
			 <tr class=l1-row>
			 <%-- <td class=l1-col-info><input type=checkbox  name=checkedOrg id ='${org.id}'></td> --%>
				 <td class=l1-col-info>
				 	<input type=checkbox  name='checkedOrg' value ='${org.id}' oid='${org.id}' orgName='${org.name}' >
				 </td>
			 	<td class=l1-col-info>${org.name}</td>
			 	<td class=11-col-info>${org.brcCode }
			</tr> 
		</c:forEach>
	</tbody>
</table>
</div>

<div class=turn-page>
	<c:if test="${pageBean.start >= pageBean.pageSize}"><a _start=${pageBean.start - pageBean.pageSize} href='javascript:void(0)' onClick="reloadPerson('${pageBean.start- pageBean.pageSize}','${pageBean.pageSize }','${id }','${oid }');">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;</c:if>
	<c:if test="${pageBean.start + pageBean.pageSize < pageBean.total}"><a _start=${pageBean.start + pageBean.pageSize  } href='javascript:void(0)' onClick="reloadOrg('${pageBean.start + pageBean.pageSize  }','${pageBean.pageSize }','${id }','${oid }');">下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;</c:if>
	&nbsp;&nbsp;&nbsp;&nbsp;${currPage}&nbsp;页&nbsp;&nbsp;&nbsp;&nbsp;共&nbsp;<font>${pageBean.total }</font>&nbsp;条记录
</div>
<!-- saveLinkService('${pageBean.result}')
 -->
 <div align="center">
<input type=button class=normal-btn value=确认 onClick="doSaveSelected()">&nbsp;&nbsp;
<input type=button class=normal-btn value=取消 onClick='closeWin()'>
</div>
</div>
</div>
</body>
</html>