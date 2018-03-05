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
	
	$('#optUserGrid').datagrid({
		idField : 'id',
		method : 'get',
		//treeField: 'name',
		title : '操作人员管理',
		width:'100%',
		
		singleSelect : true,
		method : 'get',
		fitColumns : true,
		queryParams : {
			start : '0',
			pageSize : '20'
		},
		loadFilter : pagerFilter,
		
		rownumbers : true, //显示行号列
		striped : true,
		pageList : [5,10,15,20],
		pageSize : 20,
		pagination : true, //分页低栏
		//url : '${ctx}/bdrp/org/optuser/list/0/20',
		
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
			text :'选择机构:',
			id : 'orgChooseBtn',
			iconCls : 'icon-search',
			handler : showChooseOrgWin
		}, /* '-', {
			text : "<select id='selectMethod' class='easyui-combobox' name='selectMethod'><option value='name'>姓名</option><option value='username'>用户名</option><option value='mobile'>手机号</option></select>"+
			" <input type='text' name='context' id='context'/>"
		}, */ '-', {
			text : '姓名：'+" <input type='text' name='context' id='context'/>"
		},{
			text : '检索',
			iconCls : 'icon-search',
			handler : doSearch
		}],
		// 列表栏
		columns:[[
		    {title : '选择',field : 'id',width : 10,checkbox : true},
		    {title : '姓名',field : 'name',width : 20},
			{title : '用户名',field : 'username',width : 20},
			//{title : '密码',field : 'password',width : 20},
			{title : '手机号',field : 'mobile',width : 20},
			{title : '电子邮箱',field : 'email',width : 20},
			{title : '其他联系方式',field : 'otherContactWay',width : 20},
			{title : '状态',field : 'state',width : 15},
			{title : '创建时间',field : 'createAt',width : 30}
		]],
		
		onDblClickRow : doDblClickRow	// 双击修改功能数据
	});
	
	
	// 新增功能----跳转到新增页面
	function doAdd(){
		var orgId = $('#orgId').val();
		var orgName = $('#orgName').val();
		$('.one-center-panel').load('${ctx}/bdrp/org/optuser/optUserForm.jsp?orgId=' + orgId + '&orgName=' + orgName );
		
		// ****防止页面DIV过多，造成缓慢**********
		$(".combo-p").remove();
		$(".window").remove();
		$(".window-shadow").remove();
		$(".window-mask").remove();
		
		$(".c-ff-input-warning").remove();
		$(".pika-single").remove();
		// ****防止页面DIV过多，造成缓慢**********
	};
	// 删除功能----使用Ajax异步提交，页面局部刷新
	function doDelete(){
		// 得到被选择的行
		var orgId = $('#orgId').val();
		var orgName = $('#orgName').val();
		var arr = $("#optUserGrid").datagrid("getSelections");
		if(arr.length == 0 || arr.length > 1){
			$.messager.alert("警告","请选择一行进行操作！！","warning");
			return ;
		}
		
		$.messager.confirm("确认删除", "你确定要删除选中项吗？", function(flag){
			if(flag == true){
				// 得到所有选中的ID值
				var id = arr[0].id;
				var url = "${ctx}/bdrp/org/optuser/remove/" + id;				
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
						//	$("optUserGrid").treegrid("reload");	// 如果删除子节点，那么页面刷新后为空白
							$('.one-center-panel').load('${ctx}/bdrp/org/optuser/main?orgId='+orgId+'&orgName='+orgName);
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
		//alert(context);
		$('#optUserGrid').datagrid('reload', {
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
		
		$('#optUserGrid').datagrid('getPager').pagination({
			onSelectPage : function(pageNum, pageSize) {
				var startNum = (pageNum - 1) * pageSize;
				
				$('#optUserGrid').datagrid('options').pageNumber = pageNum;
				$('#optUserGrid').datagrid('options').pageSize = pageSize;
				
				$('#optUserGrid').datagrid('options').url = '${ctx}/bdrp/org/optuser/list/'+startNum+'/'+'pageSize';
				$('#optUserGrid').datagrid('getPager').pagination('refresh', {
					pageNumber : pageNum,
					pageSize : pageSize
				});
				

				$('#optUserGrid').datagrid('reload', {
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
				//alert(data.rows[i].state);
				if(data.rows[i].state == 1){
				data.rows[i].state= "启用";
				}
				if(data.rows[i].state == 0){
					data.rows[i].state= "禁用";
					}
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
	function doDblClickRow(row, data){
		var id = data.id;
		//alert(data.id);
		//var orgId = $('#orgId').val();
		var orgName = $('#orgName').val();	
		$('.one-center-panel').load('${ctx}/bdrp/org/optuser/edit/' + id);
		
		// ****防止页面DIV过多，造成缓慢**********
		$(".combo-p").remove();
		$(".window").remove();
		$(".window-shadow").remove();;
		$(".window-mask").remove();
		
		$(".c-ff-input-warning").remove();
		$(".pika-single").remove();
		// ****防止页面DIV过多，造成缓慢**********
	}
	
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
		$('#orgChooseBtn').linkbutton({text: "当前机构:&nbsp;&nbsp;"+row.name + "&nbsp;&nbsp;"});
		$("#orgWin").window('close');
		if(!$('#optUserGrid').datagrid.defaults.url){
			$('#optUserGrid').datagrid({url :'${ctx}/bdrp/org/optuser/list/0/20?orgId='+row.id});
		}else{
			$('#optUserGrid').datagrid('load', {
				orgId : row.id
			});
		}
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
	
	if(!$('#orgId').val()){
		showChooseOrgWin();	
	}else{
		if(!$('#optUserGrid').datagrid.defaults.url){
			$('#optUserGrid').datagrid({url :'${ctx}/bdrp/org/optuser/list/0/20?orgId='+$('#orgId').val()});
		}
		var orgId = $('#orgId').val();
		var orgName = $('#orgName').val();
		$('#orgChooseBtn').linkbutton({text: "当前机构:&nbsp;&nbsp;"+orgName + "&nbsp;&nbsp;"});
	}
	
});


</script>
</head>
<body>
	<input type='hidden' id="orgId" value='${param.orgId}' />
	<input type='hidden' id="orgName" value='${param.orgName}' />
	<div class="box">
		<div class="box-container">
			<table id="optUserGrid"  border=0 cellspacing=0 cellpadding=0></table>
		</div>
	</div>
	<div id="orgWin">
		<div id="toolbar" align="right">
			<table cellspacing=0 cellpadding=0>
				<tbody>
					<tr>
						<td>名称：<input type="text" id="orgName"
							class="c-ff-input-nowidth normal-height"></td>
						<td>&nbsp;</td>
						<td><a href="javascript:search()"
							class="l-btn l-btn-small l-btn-plain"> <span
								class="l-btn-left l-btn-icon-left"><span
									class="l-btn-text">检索</span><span
									class="l-btn-icon icon-search">&nbsp;</span></span>
						</a>&nbsp;&nbsp;</td>
					</tr>
				</tbody>
			</table>
		</div>
		<table id="gridOrg">
		</table>
	</div>
</body>
</html>