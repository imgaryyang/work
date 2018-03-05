<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>

<head>
<title>职位管理</title>

<script type="text/javascript">
	$(document).ready(function(){
		$.initSpecInput();
		// ****防止页面DIV过多，造成缓慢**********
		$(".combo-p").remove();
		$(".c-ff-input-warning").remove();
		$(".pika-single").remove();
		// ****防止页面DIV过多，造成缓慢**********
		$('#tree').treegrid({
			idField : 'id',		// 标识字段
			treeField: 'name',	// 树节点字段
			title : "职位管理",
			width:'100%',
		//	iconCls : "icon-forward",	// 左上边出现一个空白图片，这样是标题文字有一一格，为了样式好看些
			
			singleSelect : true,	// 可以选择多行
			method : 'get',		// 远程访问请求
			fitColumns : true,		// 适应网格宽度
			queryParams : {			// 传递翻页的参数
				start : '0',
				pageSize : '10'
			},
			loadFilter : pagerFilter,		// 翻页功能
			
			rownumbers : true,	// 显示行号   列
			striped : true,		// 奇偶行具有斑马效果
			pageList : [5,10,15,20],
			pageSize : 10,		// 页面初始化显示行数
			pagination : true,	// 显示分页工具栏
			url : '${ctx}/bdrp/org/post/page',
			
			// 工具栏
			toolbar : [{
				text : "新增",
				iconCls : 'icon-add',
				handler : doAdd
			},'-',{
				text : "删除",
				iconCls : 'icon-remove',
				handler : doDelete
			},'-',{
				text : "所属机构: <input type='text' id='orgGrid' value='${param.orgName}'/>"+
				"<input type='hidden' id='oid' value='${param.orgId}'/>"
			},'-',{
				text : "名称: <input type='text' name='context' id='name'/>"
			},{
				text : "检索",
				iconCls : 'icon-search',
				handler : doSearch
			}],
			// 列表栏
			columns : [[
				{field : 'id', title : '编号', width : 50, checkbox : true},
				{field : 'name', title : '名称', width : 150},
				{field : 'code', title : '编号', width : 200},
				{field : 'description', title : '描述', width : 300},
				{field : 'operate', title : '操作', width : 30}
			]],
			
			onDblClickRow : doDblClickRow,	// 双击修改功能数据
			onClickCell : doClickCell,		// 直接添加子节点
			onBeforeLoad : loadChildren
		});
		
		
		
	});
	
	
	// 翻页功能
	function pagerFilter(data) {
		var name = $("#name").val();	// 查询的条件
		$('#tree').treegrid('options').url = '${ctx}/bdrp/org/post/page';
		$('#tree').treegrid('getPager').pagination({
			onSelectPage : function(pageNum, pageSize) {
				$('#tree').treegrid('options').pageNumber = pageNum;
				$('#tree').treegrid('options').pageSize = pageSize;
				$('#tree').treegrid('getPager').pagination('refresh', {
					pageNumber : pageNum,
					pageSize : pageSize
				});
				var startNum = (pageNum - 1) * pageSize;

				$('#tree').treegrid('reload', {
					start : startNum,
					oid : '${orgId}',
					name : name,
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
	
	// 加载Function 的子节点
	function loadChildren(row) {
		if (row) {
			$('#tree').treegrid('options').url = '${ctx}/bdrp/org/post/page?parentId=' + row.id;
		}
	}
	
	// 查询功能
	function doSearch(){
		var name = $("#name").val();	// 查询的条件
		//var context = $("#context").val();	// 条件的具体值
		var oid = $('#oid').val();
		$('#tree').treegrid('reload', {
			name : name,
			oid : oid,
			start : '0',
			pageSize : '10'
		});
	}
	
	// 新增功能----跳转到新增页面
	function doAdd(){
		var oid=$("#oid").val();
		var oname=$("#orgGrid").val();
		$('.one-center-panel').load('${ctx}/bdrp/org/post/addPost.jsp?oid='+oid+'&oname='+oname);
		// ****防止页面DIV过多，造成缓慢**********
		$(".combo-p").remove();
		$(".window").remove();
		$(".window-shadow").remove();;
		$(".window-mask").remove();
		$(".c-ff-input-warning").remove();
		$(".pika-single").remove();
		// ****防止页面DIV过多，造成缓慢**********
	};
	
	// 添加子节点----跳转到新增页面
 	function doClickCell(field, row){
		if(field == "operate"){	// 如果点击的是操作那列
			var id = row.id;	// 得到该行数据ID
			var oid=$("#oid").val();
			var oname=$("#orgGrid").val();
			
			$('.one-center-panel').load('${ctx}/bdrp/org/post/addPost.jsp?parentId=' + id+'&oid='+oid+'&oname='+oname);
		}
	}
	 
	
	// 修改功能----跳转到修改页面
	 function doDblClickRow(row){
		var id = row.id;
		var oid=$("#oid").val();
		var oname=$("#orgGrid").val();
		//$('.right-panel').load('${ctx}/bdrp/org/post/editPost.ihp?id=' + id+'&oid='+oid);
		$('.one-center-panel').load('${ctx}/bdrp/org/post/edit/' + id+'?oid='+oid+'&oname='+oname);
		// ****防止页面DIV过多，造成缓慢**********
		$(".combo-p").remove();
		$(".window").remove();
		$(".window-shadow").remove();;
		$(".window-mask").remove();
		$(".c-ff-input-warning").remove();
		$(".pika-single").remove();
		// ****防止页面DIV过多，造成缓慢**********
	} 
	
	
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
				// 得到所有选中的ID值，并拼装字符串
				var id = arr[0].id;
				var url = "${ctx}/bdrp/org/post/remove/" + id;
				
				var orgId=$('#oid').val();
				var orgName=$('#orgGrid').val();

				// Ajax异步提交
				$.ajax({
					type : "DELETE",
					url : url,
					data : "",
					dataType : 'json',
					contentType : "application/json;charset=UTF-8",
					success : function(msg){
						if(msg.success){
							$.messager.alert("提示","删除成功","info");
						//	$("#tree").treegrid("reload");	// 如果删除子节点，那么页面刷新后为空白
							$('.one-center-panel').load('${ctx}/bdrp/org/post/main?orgId='+orgId+'&orgname='+orgName);
						}else{
							$.messager.alert("错误",msg.msg);
						}
					}
				});
			}
		});
		
	}
	
	/*************** 机构浮动框  ******************/
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
	$('#orgGrid').click(function(){
		
		$('#gridOrg').treegrid({
			url : '${ctx}/bdrp/org/org/page',
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
					pageSize : '10'
				},
				method : 'GET',
				loadFilter : pagerOrgFilter,
		//		fitColumns : true,
				pagination : true, //分页低栏
				rownumbers : true, //显示行号列
				pageSize : 10,
				pageList : [5,10,15,20],
				onBeforeLoad : loadorgChildren,
				onDblClickRow : orgClick
			});
		$("#orgWin").window('open');
	});
	
	
	function loadorgChildren(row) {
		if (row) {
			$('#gridOrg').treegrid('options').url = '${ctx}/bdrp/org/post/page?parentId=' + row.id;
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
					name:name
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
			}
			delete data.result; 
		}
		return data;
	}
	function orgClick(row){
		$('#oid').val(row.id);
		$('#orgGrid').val(row.name);
		//var orgid=	$('#oid').val();
		//var name = $('#orgName').val();
		
		$("#orgWin").window('close');
		$('.one-center-panel').load('${ctx}/bdrp/org/posts?orgId='+row.id+'&orgName='+row.name);
		// ****防止页面DIV过多，造成缓慢**********
		$(".window").remove();
		$(".window-shadow").remove();;
		$(".window-mask").remove();

	}
	function search(){
		var name = $('#orgName').val();
		$('#gridOrg').treegrid('options').url = '${ctx}/bdrp/org/post/page';
		$('#gridOrg').treegrid('reload',{start:'0',pageSize:'10',name:name});
	}
</script>
</head>
<body>
<div class="box">
	<div class="box-container">
		<div region="center" border="false">
			<table id="tree" class="easyui-treegrid" border=0 cellspacing=0 cellpadding=0></table>
		</div>
	</div>
	
</div>
<div id="orgWin">
		<div id="toolbar" align="right">
			<table cellspacing=0 cellpadding=0 >
			<tbody>
			<tr>
			<td>名称：<input type="text" id="orgName" class="c-ff-input-nowidth normal-height" ></td>
			<td>&nbsp;</td>
			<td><a href="javascript:search()" class="l-btn l-btn-small l-btn-plain">
				<span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">检索</span><span class="l-btn-icon icon-search">&nbsp;</span></span>
				</a>&nbsp;&nbsp;</td>
			</tr>
			</tbody>
			</table>
		</div>
		<table id="gridOrg">
		</table>
	</div>
</body>
