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
		<div class="box-container">
			<div>
				<table class="l1-tab">
					<thead>
						<tr>
							<th class=l1-col-info style='width: 15%;'>选择</th>
							<th class=l1-col-info style='width: 25%;'>名称</th>
							<th class=l1-col-info style='width: 25%;'>编码</th>
							<th class=l1-col-info style='width: 35%;'>备注</th>
						</tr>
					</thead>
					<tbody>
						<c:forEach var="list" items="${pageBean.result}"
							varStatus="status">
							<tr class=l1-col-info>
								<td class=l1-col-info><input type=checkbox id=checkresource
									name=checkresource value='${list.id }'></td>
								<td class=l1-col-info>${list.name}</td>
								<td class=l1-col-info>${list.code}</td>
								<td class=l1-col-info>${list.memo}</td>
							</tr>
						</c:forEach>
					</tbody>
				</table>
			</div>

			<div class=turn-page>
				<c:if test="${pageBean.start > 0}">
					<a _start=${pageBean.start - pageBean.pageSize}
						href='javascript:void(0)'
						onClick='PageUp(${pageBean.start - pageBean.pageSize});'>上一页</a>
				</c:if>
				<c:if
					test="${pageBean.start + pageBean.pageSize < pageBean.total}">
					<a _start=${pageBean.start + pageBean.pageSize}
						href='javascript:void(0)'
						onClick='PageDown(${pageBean.start + pageBean.pageSize});'>下一页</a>
				</c:if>
				&nbsp;&nbsp;&nbsp;&nbsp;共<font>${pageBean.total}</font>条记录
				<input type="hidden" id="alll" value="${pageBean.total}" />
			</div>

			<div align="center">
				<input type=button class=normal-btn value=确认 onClick='bint()'>&nbsp;&nbsp;
				<input type=button class=normal-btn value=取消 onClick='closePanel()'>&nbsp;&nbsp;
			</div>

		</div>
	</div>
</body>
</html>