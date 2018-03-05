<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<head>
<title>组织机构</title>

<script type="text/javascript">
var $CTX = '${ctx}';
	$(document).ready(function(){
		$.initSpecInput();
		
		// ****防止页面DIV过多，造成缓慢**********
		
		$(".c-ff-input-warning").remove();
		$(".pika-single").remove();
		// ****防止页面DIV过多，造成缓慢**********
		
		$('#tree').treegrid({
			idField : 'id',
			treeField: 'name',
			title : '组织机构',
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
			url : '${ctx}/bdrp/org/org/page',
			
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
			    {title : '选择',field : 'id',width : 50,checkbox : true},
				{title : '名称',field : 'name',width : 150},
				{title : '简称',field : 'shortName',width: 150},
				{title : '机构号',field : 'brcCode',width: 100},
				{title : '备注',field : 'memo',width: 290},
				{title : '操作',field : 'operate',width : 30}
			]],
			
			onDblClickRow : doDblClickRow,	// 双击修改功能数据
			onClickCell : doClickCell,		// 直接添加子节点
			onBeforeLoad : loadChildren
		});

	});
	
	// 传递翻页参数
	function pagerFilter(data) {
		var method = $("#method").val();	// 查询的条件
		var context = $("#context").val();	// 条件的具体值
		$('#tree').treegrid('options').url = '${ctx}/bdrp/org/org/page';
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
	
	// 加载Org 的子节点
	function loadChildren(row) {
		if (row) {
			$('#tree').treegrid('options').url = '${ctx}/bdrp/org/org/page?parentId=' + row.id;
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
			pageSize : '10'
		});
	}
	
	// 新增功能----跳转到新增页面
	function doAdd(){
		$('.one-center-panel').load('${ctx}/bdrp/org/org/addOrg.jsp');
		
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
			$('.one-center-panel').load('${ctx}/bdrp/org/org/addOrg.jsp?parentId=' + id);
			
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
		$('.one-center-panel').load('${ctx}/bdrp/org/org/edit/' + id);
		
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
				// 得到所有选中的ID值
				var id = arr[0].id;
				var url = "${ctx}/bdrp/org/remove/" + id;				
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
							$('.one-center-panel').load('${ctx}/bdrp/org/org/main');
						}
					},
					error : function(){
						$.messager.alert("错误","删除失败！");
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
<table id="tree" class="easyui-treegrid" border=0 cellspacing=0 cellpadding=0></table>
</div>
</div>
</body>
