<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<link rel="stylesheet" type="text/css" href="${ctx}/jQuery/plugin/pikaday.css">
<script type="text/javascript" src="${ctx}/jQuery/plugin/pikaday.jquery.js"></script>
<title>添加资源</title>
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


	<div>
<table class="l1-tab">
	<thead>
		<tr>
		<th class=l1-col-info style='width:15%;'>选择</th>
			<th class=l1-col-info style='width:25%;'>名称</th>
			<th class=l1-col-info style='width:25%;'>编码</th>
			<th class=l1-col-info style='width:35%;'>备注</th>
		</tr>
	</thead>
	<tbody>
		<c:forEach var="list" items="${resourceBean.result}"  varStatus="status">
			 <tr class=l1-col-info>
			 <td class=l1-col-info><input type=checkbox id=checkresource name=checkresource value='${list.id }'></td>
			 	<td class=l1-col-info>${list.name}</td>
				<td class=l1-col-info >${list.code}</td>
				<td class=l1-col-info >${list.memo}</td>
			</tr> 
		</c:forEach>
	</tbody>
</table>
</div>

<div class=turn-page>
	<c:if test="${resourceBean.start > 0}"><a _start=${resourceBean.start - resourceBean.limit} href='javascript:void(0)' onClick='PageUp(${resourceBean.start - resourceBean.limit});'>上一页</a></c:if>
	<c:if test="${resourceBean.start + resourceBean.limit < resourceBean.totalCount}"><a _start=${resourceBean.start + resourceBean.limit} href='javascript:void(0)' onClick='PageDown(${resourceBean.start + resourceBean.limit});'>下一页</a></c:if>
	&nbsp;&nbsp;&nbsp;&nbsp;共<font>${resourceBean.totalCount}</font>条记录
	<input type="hidden" id="alll" value="${resourceBean.totalCount}"/>
</div>

<div align="center">
<input type=button class=normal-btn value=确认 onClick='bint()'>&nbsp;&nbsp;
<input type=button class=normal-btn value=取消 onClick='closePanel()'>&nbsp;&nbsp;
</div>

</div>
</div>
</body>
</html>