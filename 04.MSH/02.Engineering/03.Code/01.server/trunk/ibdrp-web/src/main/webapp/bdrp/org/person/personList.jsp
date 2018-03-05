<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>

<head>
<title>人员管理</title>
<script type="text/javascript">
$(document).ready(function(){
	$.initSpecInput();
	
	// ****防止页面DIV过多，造成缓慢**********
	
	$(".c-ff-input-warning").remove();
	$(".pika-single").remove();
	// ****防止页面DIV过多，造成缓慢**********
	
	$('#tree').treegrid({
		idField : 'id',
		treeField: 'name',
		title : '人员管理',
		width:'100%',
		
		singleSelect : true,
		method : 'get',
		fitColumns : true,
		queryParams : {
			start : '0',
			pageSize : '10'
		},
		loadFilter : pagerFilter,
		
		rownumbers : true, //显示行号列
		striped : true,
		pageList : [5,10,15,20],
		pageSize : 10,
		pagination : true, //分页低栏
		url : '${ctx}/bdrp/org/person/list/0/20',
		
		// 工具栏
		toolbar : [{
			text : '新增',
			iconCls : 'icon-add',
			handler : doAdd
		}, '-', {
			text : '删除',
			iconCls : 'icon-remove',
			handler : doDelete
		}, '-', {
			text : "<select id='method' class='easyui-combobox' name='method'><option value='name'>名称</option></select>"+
			" <input type='text' name='context' id='context'/>"
		}, {
			text : '检索',
			iconCls : 'icon-search',
			handler : doSearch
		}],
		// 列表栏
		columns:[[
		    {title : '选择',field : 'id',width : 10,checkbox : true},
		    {title : '名称',field : 'name',width : 20},
			{title : '英文名',field : 'enName',width : 20},
			{title : '用户名',field : 'username',width : 25},
			{title : '性别',field : 'sex',width : 10},
			{title : '部门',field : 'dep.name',width : 15},
			{title : '职位',field : 'psot.name',width : 15},
			{title : '操作',field : 'operate',width : 30}
		]],
		
		onDblClickRow : doDblClickRow	// 双击修改功能数据
	});
	
	
	// 新增功能----跳转到新增页面
	function doAdd(){
		$('.one-center-panel').load('${ctx}/bdrp/org/person/personForm.jsp');
		
		// ****防止页面DIV过多，造成缓慢**********
		$(".combo-p").remove();
		$(".window").remove();
		$(".window-shadow").remove();;
		$(".window-mask").remove();
		
		$(".c-ff-input-warning").remove();
		$(".pika-single").remove();
		// ****防止页面DIV过多，造成缓慢**********
	};
	// 删除功能----使用Ajax异步提交，页面局部刷新
	function doDelete(){
		// 得到被选择的行
		var arr = $("#tree").treegrid("getSelections");
		if(arr.length == 0 || arr.length > 1){
			$.messager.alert("警告","请选择一行进行操作！！","warning");
			return ;
		}
		
		$.messager.confirm("确认删除", "你确定要删除选中项吗？", function(flag){
			if(flag == true){
				// 得到所有选中的ID值
				var id = arr[0].id;
				var url = "${ctx}/bdrp/org/person/remove/" + id;				
				// Ajax异步提交
				$.ajax({
					type : "DELETE",
					url : url,
					dataType : 'json',
					contentType : "application/json;charset=UTF-8",
					success : function(msg){
						if(null != msg.msg){
							$.messager.alert("错误",msg.msg);
						}else if(msg.success){
							$.messager.alert("提示","删除成功","info");
						//	$("#tree").treegrid("reload");	// 如果删除子节点，那么页面刷新后为空白
							$('.one-center-panel').load('${ctx}/bdrp/org/person/main');
						}
					},
					error : function(){
						$.messager.alert("错误","删除失败！");
					}
					
				});
			}
		});
	}
	// 查询功能
	function doSearch(){
		var method = $("#method").val();	// 查询的条件
		var context = $("#context").val();	// 条件的具体值
		
		$('#tree').treegrid('reload', {
			method : method,
			context : context,
			start : '0',
			pageSize : '10'
		});
	}
    
	// 传递翻页参数
	function pagerFilter(data) {
		var method = $("#method").val();	// 查询的条件
		var context = $("#context").val();	// 条件的具体值
		
		$('#tree').treegrid('getPager').pagination({
			onSelectPage : function(pageNum, pageSize) {
				var startNum = (pageNum - 1) * pageSize;
				
				$('#tree').treegrid('options').pageNumber = pageNum;
				$('#tree').treegrid('options').pageSize = pageSize;
				
				$('#tree').treegrid('options').url = '${ctx}/bdrp/org/person/list/'+startNum+'/'+'pageSize';
				$('#tree').treegrid('getPager').pagination('refresh', {
					pageNumber : pageNum,
					pageSize : pageSize
				});
				

				$('#tree').treegrid('reload', {
					start : startNum,
					method : method,
					context : context,
					pageSize : pageSize
				});
			}
		});
		data.rows = [];
		if(null != data.result){
			for(var i=0;i<data.result.length;i++){
				data.rows[i] = data.result[i];
				data.rows[i].state= "closed";
				if(data.result[i].parent){
					data.rows[i]._parentId = data.result[i].parent.id;
				}
				data.rows[i].operate = "<a href='javascript:void(0)' style='text-decoration:none'><img src='${cdnserver}/resources/images/icons/10_10/103.png' title='新建子功能' method='doCreate' /></a>";
			}
			delete data.result; 
		}
		return data;
	}
	
	// 修改功能----跳转到修改页面
	function doDblClickRow(row){
		var id = row.id;
		$('.one-center-panel').load('${ctx}/bdrp/org/person/edit/' + id);
		
		// ****防止页面DIV过多，造成缓慢**********
		$(".combo-p").remove();
		$(".window").remove();
		$(".window-shadow").remove();;
		$(".window-mask").remove();
		
		$(".c-ff-input-warning").remove();
		$(".pika-single").remove();
		// ****防止页面DIV过多，造成缓慢**********
	}
	
	
	<!--
	//选择机构窗口
	$("#orgWin").window({
		title : "选择机构",
		width : 500,
		height : 350,
		collapsible : false,
		minimizable : false,
		maximizable : false,
		closed : true,
		modal : true,
		resizable : false
		
	}); 
	//加载选择机构窗口数据
	$('#orgname').click(function(){
		
		$('#gridOrg').treegrid({
			url : '${ctx}/bdrp/org/person/main',
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
				pagination : true, //分页低栏
				rownumbers : true, //显示行号列
				pageSize : 10,
				pageList : [5,10,15,20],
				onBeforeExpand:loadorgChildren,
				onDblClickRow : orgClick
			});
		$("#orgWin").window('open');
	});
	
	$('#addBtn').click(function(){
		var orgname=$("#orgname").val();
		var orgid=$("#orgid").val();
		 $('.one-center-panel').load("${ctx}/bdrp/org/person/personForm.jsp");
		 $(".combo-p").remove();
			$(".window").remove();
			$(".window-shadow").remove();;
			$(".window-mask").remove();
			
			$(".pika-single").remove();
	});
	
	$('.turn-page>a').on('click', function(){
		$('#Start').val($(this).attr('_start'));
	  	var start = $('#Start').val();
	  	var orgname=$("#orgname").val();
		var orgid=$("#orgid").val();
		var name=$("#name").val();
		var enName=$("#enName").val();
		$.post('${ctx}/puborgauthz/personMain.ihp?orgname='+orgname+'&orgid='+orgid+"&name="+name+"&enName="+enName+"&Start="+start,function(data){
			$('.one-center-panel').html(data);
			// ****防止页面DIV过多，造成缓慢**********
			$(".combo-p").remove();
			$(".window").remove();
			$(".window-shadow").remove();;
			$(".window-mask").remove();
			
			$(".pika-single").remove();
			// ****防止页面DIV过多，造成缓慢**********

		});  
	 	
	});
});


//选择机构窗口翻页
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

			$('#gridOrg').treegrid('reload', {
				start : startNum,
				limit : pageSize
			});
		}
	});
	return data;
}
//加载选择机构窗口的子节点
function loadorgChildren(row) {
	if (row) {
		$('#gridOrg').treegrid('options').url = '${ctx}/puborgauthz/childrenOrgList.do?parentid=' + row.id;
	}
}

//选择机构窗口行双击动作
function orgClick(row){
	$('#orgid').val(row.id);
	$('#orgname').val(row.name);
	$("#orgWin").window('close');
	$('.one-center-panel').load('${ctx}/puborgauthz/personMain.ihp?orgname='+row.name+'&orgid='+row.id);

		$(".window").remove();
		$(".window-shadow").remove();;
		$(".window-mask").remove();
}

function searchPerson(){
	var orgname=$("#orgname").val();
	var orgid=$("#orgid").val();
	var name=$("#name").val();
	var enName=$("#enName").val();
	$('.one-center-panel').load('${ctx}/puborgauthz/personMain.ihp?orgname='+orgname+'&orgid='+orgid+"&name="+name+"&enName="+enName);
	
}
function resetPerson(){
	$("#orgname").val("");
	$("#orgid").val("");
	$("#name").val("");
	$("#enName").val("");
	
}
function ondelete(id){
	var orgname=$("#orgname").val();
	var orgid=$("#orgid").val();
	var name=$("#name").val();
	var enName=$("#enName").val();
	$.messager.confirm("确认删除", "确认删除人员？", function(flag){
		if(flag == true){
			$.post('${ctx}/bdrp/org/remove/' + id,function(res){
				if(res == "success"){
					$.messager.alert("提示","人员删除成功！","info");
					$('.one-center-panel').load('${ctx}/bdrp/org/person/main');
				}
			});
		}
	})					
}
function resetPsd(id){
	var orgname=$("#orgname").val();
	var orgid=$("#orgid").val();
	var name=$("#name").val();
	var enName=$("#enName").val();
	 $.messager.confirm("确认重置", "确认重置密码？", function(flag){
		if(flag == true){
			$.post('${ctx}/puborgauthz/resetPsd.ihp',{"id":id},function(res){
				if(res == "success"){
					$.messager.alert("提示","重置密码成功！","info");
					$('.one-center-panel').load('${ctx}/puborgauthz/personMain.ihp?orgname='+orgname+'&orgid='+orgid+"&name="+name+"&enName="+enName);
				}
			});
		}
	}); 
}
function onUpdate(id){
	var orgname=$("#orgname").val();
	var orgid=$("#orgid").val();
	$('.one-center-panel').load("${ctx}/puborgauthz/editPerson.ihp?id="+id+"&orgname="+orgname+"&orgid="+orgid);
	$(".combo-p").remove();
	$(".window").remove();
	$(".window-shadow").remove();;
	$(".window-mask").remove();
	
	$(".pika-single").remove();
}
-->
</script>
</head>
<body>
<!--
<div class="box">
	<div class="box-head">
		<div class="box-title">
			<h3>人员信息</h3>
			<div style="float:right ;margin:0px 20px 10px 0">
				<input type="button" name="addBtn" id="addBtn" value="新增人员" >
			</div>
		</div>
	</div>
<div class="box-container">
<form  method="post" id="serachForm" name="serachForm" >
	<input type=hidden id=Start name=Start value='${personBean.start}'>
	<input type=hidden id=PageSize name=PageSize value='${personBean.limit}'>
	<div class=search-panel>
		<div style=' float:left;  display:inline; width:33%;'>
			<label class=sp-label style='width:25%'>所属机构：</label>
			<div class=sp-cdt style='width:73%'>
			<input type=hidden id="orgid" name="orgid" value="${orgid}">
			<input type=text  id="orgname" name=orgname value="${orgname}"  size=20>
			</div>
		</div>
		<div style=' float:left;  display:inline; width:32%;'>
			<label class=sp-label style="width:25%">名称：</label>
			<div class=sp-cdt style='width:73%'><input type=text  id="name" name=name  size=20 value="${name}"></div>
		</div>
		<div style=' float:left;display:inline; width:33%;'>
			<label class=sp-label style='width:25%'>英文名 ：</label>
			<div class=sp-cdt style='width:73%'><input type=text  id="enName" name=enName size=20 value="${enName}"></div>
		</div>
		
		<div class=sp-btns>
			<input type=button name=search id=search class=mini-btn value=搜索 onClick="searchPerson();">&nbsp;&nbsp;&nbsp;&nbsp;
			<input type=button name=reset id=reset class=mini-btn value=重置 onClick="resetPerson();">
		</div>
	</div>
	</form>
</div>

<div>
<table class="l1-tab">
	<thead><tr><thead>
			<th class=l1-col-info style='width:10%;'>名称</th>
			<th class=l1-col-info style='width:10%;'>英文名</th>
			<th class=l1-col-info style='width:10%;'>用户名</th>
			<th class=l1-col-info style='width:8%;'>性别</th>
			<th class=l1-col-info style='width:13%;'>部门</th>
			<th class=l1-col-info style='width:15%;'>职位</th>
			<th class=l1-col-info style='width:12%;'>岗位</th>
			<th class=l1-col-info style='width:22%;'>操作</th>
		</tr></thead><tbody>
	<c:forEach var="list" items="${page.result}"  varStatus="status">
		<c:if test="${(status.count%2)==0}">
			<tr class=l1-row-sep ondblclick="onUpdate('${list.id}');">
				<td class=l1-col-info>${list.name}</td>
				<td class=l1-col-info >${list.enName}</td>
			    <td class=l1-col-info>${list.username}</td>
			    <td class=l1-col-info>${list.sex}</td>
			 	<td class=l1-col-info>
				<c:forEach var="deps" items="${list.deps}" varStatus="stdep1">
					<c:if test="${stdep1.last}">
					 ${deps.name}
					</c:if>
			    	<c:if test="${! stdep1.last}">
					 ${deps.name},
					</c:if>
			    </c:forEach>
				</td>
				<td class=l1-col-info>
				  <c:forEach var="posts" items="${list.posts}" varStatus="stdep2">
				  	<c:if test="${stdep2.last}">
					 ${posts.name}
					</c:if>
			    	<c:if test="${! stdep2.last}">
					 ${posts.name},
					</c:if>
			    	
			    </c:forEach>
				</td>
				<td class=l1-col-info>
				<c:forEach var="stations" items="${list.stations}" varStatus="stdep3">
			    	<c:if test="${stdep3.last}">
					 ${stations.name}
					</c:if>
			    	<c:if test="${! stdep3.last}">
					 ${stations.name},
					</c:if>
			    </c:forEach>
				</td>
				<td class=l1-col-info>
					<input type=button class=mini-btn value="查看" onclick="onUpdate('${list.id}');">&nbsp;
					<input type=button class=mini-btn value="密码重置" onclick="resetPsd('${list.id}');">&nbsp;
					<input type=button class=mini-btn  value="删除" onclick="ondelete('${list.id}');">
				
				</td>
			</tr> 
		</c:if>	
		<c:if test="${ (status.count%2)!=0}">
			<tr class=l1-row ondblclick="onUpdate('${list.id}');">
				
				<td class=l1-col-info>${list.name}</td>
				<td class=l1-col-info >${list.enName}</td>
			    <td class=l1-col-info>${list.username}</td>
			    <td class=l1-col-info>${list.sex}</td>
			    <td class=l1-col-info>
				<c:forEach var="deps" items="${list.deps}" varStatus="stdep1">
					<c:if test="${stdep1.last}">
					 ${deps.name}
					</c:if>
			    	<c:if test="${! stdep1.last}">
					 ${deps.name},
					</c:if>
			    </c:forEach>
				</td>
				<td class=l1-col-info>
				  <c:forEach var="posts" items="${list.posts}" varStatus="stdep2">
				  	<c:if test="${stdep2.last}">
					 ${posts.name}
					</c:if>
			    	<c:if test="${! stdep2.last}">
					 ${posts.name},
					</c:if>
			    	
			    </c:forEach>
				</td>
				<td class=l1-col-info>
				<c:forEach var="stations" items="${list.stations}" varStatus="stdep3">
			    	<c:if test="${stdep3.last}">
					 ${stations.name}
					</c:if>
			    	<c:if test="${! stdep3.last}">
					 ${stations.name},
					</c:if>
			    </c:forEach>
				</td>
				<td class=l1-col-info>
					<input type=button class=mini-btn value="查看" onclick="onUpdate('${list.id}');">&nbsp;
					<input type=button class=mini-btn value="密码重置" onclick="resetPsd('${list.id}');">&nbsp;
					<input type=button class=mini-btn  value="删除" onclick="ondelete('${list.id}');">
				
				</td>
		  	</tr>
		</c:if>	 
	</c:forEach>
	</tbody>
</table>
</div>


<div class=turn-page>
	<c:if test="${personBean.start > 0}"><a _start=${personBean.start - personBean.limit} href='javascript:void(0)'>上一页</a></c:if>
	<c:if test="${personBean.start + personBean.limit < personBean.totalCount}"><a _start=${personBean.start + personBean.limit} href='javascript:void(0)'>下一页</a></c:if>
	&nbsp;&nbsp;&nbsp;&nbsp;共<font>${personBean.totalCount}</font>条记录
</div>


</div>
<div id="orgWin">
<table id="gridOrg"></table>
</div>
-->
<div class="box">
<div class="box-container">
<table id="tree" class="easyui-treegrid" border=0 cellspacing=0 cellpadding=0></table>
</div>
</div>
</body>
</html>