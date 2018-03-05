<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>

<head>
<title>菜单管理</title>

<script type="text/javascript">
	$(document).ready(function(){
		$.initSpecInput();
		
		// ****防止页面DIV过多，造成缓慢**********
		
		$(".c-ff-input-warning").remove();
		$(".pika-single").remove();
		// ****防止页面DIV过多，造成缓慢**********
		
		$('#tree').treegrid({
			idField : 'id',		// 标识字段
			treeField: 'name',	// 树节点字段
			title : "菜单管理",
			width:'100%',
		//	iconCls : "icon-forward",	// 左上边出现一个空白图片，这样是标题文字有一一格，为了样式好看些
			
			singleSelect : false,	// 可以选择多行
			method : 'post',		// 远程访问请求
			fitColumns : true,		// 适应网格宽度
			queryParams : {			// 传递翻页的参数
				start : '0',
				limit : '10'
			},
			loadFilter : pagerFilter,		// 翻页功能
			
			rownumbers : true,	// 显示行号   列
			striped : true,		// 奇偶行具有斑马效果
			pageList : [5,10,15,20],
			pageSize : 10,		// 页面初始化显示行数
			pagination : true,	// 显示分页工具栏
			url : '${ctx}/puborgauthz/rootMenuList.do',
			
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
				text : "<select id='method' class='easyui-combobox' name='method'><option value='name'>名称</option></select>"+
					" <input type='text' name='context' id='context'/>"
			},{
				text : "检索",
				iconCls : 'icon-search',
				handler : doSearch
			}],
			// 列表栏
			columns : [[
				{field : 'id', title : '编号', width : 50, checkbox : true},
				{field : 'name', title : '名称', width : 150},
				{field : 'code', title : '编码', width : 100},
				{field : 'service', title : '服务', width : 100},
				{field : 'descp', title : '描述', width : 250},
				{field : 'operate', title : '操作', width : 30}
			]],
			
			onDblClickRow : doDblClickRow,	// 双击修改功能数据
			onClickCell : doClickCell,		// 直接添加子节点
			onBeforeLoad : loadChildren
		});
		
		
		
	});
	
	
	// 翻页功能
	function pagerFilter(data) {
		var method = $("#method").val();	// 查询的条件
		var context = $("#context").val();	// 条件的具体值
		$('#tree').treegrid('options').url = '${ctx}/puborgauthz/rootMenuList.do?method='+method+'&context='+context;
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
					method : method,
					context : context,
					limit : pageSize
				});
			}
		});
		return data;
	}
	
	// 加载Function 的子节点
	function loadChildren(row) {
		if (row) {
			$('#tree').treegrid('options').url = '${ctx}/puborgauthz/childrenMenuList.do?parentid=' + row.id;
		}
	}
	
	// 查询功能
	function doSearch(){
		var method = $("#method").val();	// 查询的条件
		var context = $("#context").val();	// 条件的具体值
		
		$('#tree').treegrid('reload', {
			method : method,
			context : context,
			start : '0',
			limit : '10'
		});
	}
	
	// 新增功能----跳转到新增页面
	function doAdd(){
		$('.one-center-panel').load('${ctx}/puborgauthz/addMenu.ihp');
		
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
			$('.one-center-panel').load('${ctx}/puborgauthz/addMenu.ihp?id=' + id);
			
			// ****防止页面DIV过多，造成缓慢**********
			$(".combo-p").remove();
			$(".window").remove();
			$(".window-shadow").remove();;
			$(".window-mask").remove();
			
			$(".c-ff-input-warning").remove();
			$(".pika-single").remove();
			// ****防止页面DIV过多，造成缓慢**********
		}
	}
	
	// 修改功能----跳转到修改页面
	function doDblClickRow(row){
		var id = row.id;
		$('.one-center-panel').load('${ctx}/puborgauthz/editMenu.ihp?id=' + id);
		
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
		if(arr.length == 0){
			$.messager.alert("警告","至少选择一行进行操作！！","warning");
			return ;
		}
		
		$.messager.confirm("确认删除", "你确定要删除选中项吗？", function(flag){
			if(flag == true){
				// 得到所有选中的ID值，并拼装字符串
				var ids = "";
				for(var i=0; i<arr.length; i++){
					if(i != arr.length -1){
						ids = ids + arr[i].id + ",";
					}else{
						ids  = ids + arr[i].id;
					}
				}
				
				// Ajax异步提交
				$.ajax({
					type : "POST",
					url : "${ctx}/puborgauthz/deleteMenu.do",
					data : "ids=" + ids,
					success : function(msg){
						if(msg == "success"){
							$.messager.alert("提示","删除成功","info");
						//	$("#tree").treegrid("reload");	// 如果删除子节点，那么页面刷新后为空白
							$('.one-center-panel').load('${ctx}/puborgauthz/menuMain.ihp');
						}
					}
				});
			}
		});
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

</body>
