<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<link rel="stylesheet" type="text/css" href="${ctx}/jQuery/plugin/pikaday.css">
<script type="text/javascript" src="${ctx}/jQuery/plugin/pikaday.jquery.js"></script>
<title>添加服务</title>
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

名称：<input type="text" width="120px;" id="sname" value="${sname }">
备注：<input type="text" width="120px;" id="sdescp"  value="${sdescp }">
<a href=# onclick=reloadServiceList("${id}"); class=easyui-linkbutton iconCls=icon-search>检索</a>&nbsp;&nbsp;&nbsp;&nbsp;
</div>
	<div>
<table class="l1-tab">
	<thead>
		<tr>
		<th class=l1-col-info style='width:10%;'><input type="checkbox"  id="serviceCB" onClick="clickSCB();" ></th>
			<th class=l1-col-info style='width:35%;'>名称</th>
			<th class=l1-col-info style='width:55%;'>描述</th>
		</tr>
	</thead>
	<tbody>
		<c:forEach var="service" items="${pageBean.result}"  varStatus="status">
			 <tr class=l1-row>
			 <td class=l1-col-info><input type=checkbox  name=checkService value='${service.id }'></td>
			 	<td class=l1-col-info>${service.name}</td>
				<td class=l1-col-info >${service.descp}</td>
			</tr> 
		</c:forEach>
	</tbody>
</table>
</div>

<div class=turn-page>
	<c:if test="${pageBean.start >= pageBean.limit}"><a _start=${pageBean.start - pageBean.limit} href='javascript:void(0)' onClick="reloadService('${pageBean.start- pageBean.limit}','${pageBean.limit }','${id }');">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;</c:if>
	
	<%-- <c:if test="${pageBean.start < pageBean.limit}"><a _start=${pageBean.start } href='javascript:void(0)' onClick="reloadService('${pageBean.start}','${pageBean.limit }','${id }');">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;</c:if>
	 --%>
	<c:if test="${pageBean.start + pageBean.limit < pageBean.totalCount}"><a _start=${pageBean.start + pageBean.limit  } href='javascript:void(0)' onClick="reloadService('${pageBean.start + pageBean.limit  }','${pageBean.limit }','${id }');">下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;</c:if>
	
<%-- 	<c:if test="${pageBean.start + pageBean.limit >= pageBean.totalCount}"><a _start=${pageBean.start + pageBean.limit} href='javascript:void(0)' onClick="reloadService('${pageBean.start }','${pageBean.limit }','${id }');">下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;</c:if>
	 --%>
	&nbsp;&nbsp;&nbsp;&nbsp;${currPage}&nbsp;页&nbsp;&nbsp;&nbsp;&nbsp;共&nbsp;<font>${pageBean.totalCount }</font>&nbsp;条记录
</div>

<div align="center">
<input type=button class=normal-btn value=确认 onClick='saveLinkService()'>&nbsp;&nbsp;
<input type=button class=normal-btn value=取消 onClick='closeWin()'>
</div>
</div>
</div>
</body>
</html>