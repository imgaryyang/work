<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>

<head>
<title>功能管理</title>


<!-- easyui 主题CSS -->
<link rel="stylesheet" type="text/css" href="${ctx }/jQuery/easyui-1.3.6/themes/default/easyui.css">
<!-- easyui 图标 CSS -->
<link rel="stylesheet" type="text/css" href="${ctx }/jQuery/easyui-1.3.6/themes/icon.css">
<!-- easyui核心类库 -->
<script type="text/javascript" src="${ctx }/jQuery/easyui-1.3.6/scripts/jquery.easyui.min.js"></script>

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
			title : "功能管理",
			width:'100%',
		//	iconCls : "icon-forward",	// 左上边出现一个空白图片，这样是标题文字有一一格，为了样式好看些
			
			singleSelect : false,	// 可以选择多行
			method : 'get',		// 远程访问请求
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
			url : '${ctx}/bdrp/authority/resource/list',
			
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
				//{field : 'code', title : '编码', width : 150},
				{field : 'name', title : '名称', width : 150},
				{field : 'uri', title : 'URI', width : 150},
				//{field : 'funcid', title : '功能', width : 200},
				{field : 'memo', title : '描述', width : 280},
				{field : 'opType', title : '操作类型', width : 30},
				{field : 'path', title : '路径', width : 27}
			]],
			
			onDblClickRow : doDblClickRow,	// 双击修改功能数据
			onClickCell : doClickCell,		// 直接添加子节点
			onBeforeLoad : loadChildren
		});
		
		// **********************转换浮动框 start********************
		// 转换 浮动窗口
		$("#changeWindow").window({
			title : "发布菜单",
			width : 400,
			height : 340,
			collapsible : false,
			minimizable : false,
			maximizable : false,
			closed : true,
			modal : true,
			resizable : false
		}); 
		
		// 对服务名添加焦点事件---判断是否输入，和名称是否重复
		$("#serviceName").blur(function(){
			var fid = $("#fid").val();
			var serviceName = $("#serviceName").val();
			if(serviceName == null || serviceName.trim() == ""){
				$("#serviceName1").show();
				$("#serviceName2").hide();
				$("#serviceName").val("");	// 将输入框中的空格去掉
				return ;
			}else{
				$("#serviceName1").hide();
			}
			
			// Ajax异步提交，校验该名称是否已经存在
			$.ajax({
				type : "POST",
				url : "${ctx}/puborgauthz/existNameAuthzFunction.do",
				data : "name="+serviceName+"&fid="+fid,
				success : function(msg){
					if(msg == "success"){
						$("#serviceName2").hide();
					}else if(msg == "exist"){
						$("#serviceName2").show();
						$("#serviceName1").hide();
						return ;
					}
				}
			});
		});
		
		// 对菜单编码添加焦点事件---判断是否输入，和编码是否重复
		$("#menuCode").blur(function(){
			// 判断是否输入编码
			var menuCode = $("#menuCode").val();
			if(menuCode == null || menuCode.trim() == ""){
				$("#menuCode1").show();
				$("#menuCode2").hide();
				$("#menuCode").val("");	// 将输入框中的空格去掉
				return ;
			}else{
				$("#menuCode1").hide();
			}
			
			// Ajax异步提交，校验该编码是否已经存在
			$.ajax({
				type : "POST",
				url : "${ctx}/puborgauthz/existNameMenu.do",
				data : "code="+menuCode,
				success : function(msg){
					if(msg == "success"){
						$("#menuCode2").hide();
					}else if(msg == "exist"){
						$("#menuCode2").show();
						$("#menuCode1").hide();
						return ;
					}
				}
			});
		});
		
		// 对菜单名称添加焦点事件---判断是否输入
		$("#menuName").blur(function(){
			// 判断是否输入编码
			var menuName = $("#menuName").val();
			if(menuName == null || menuName.trim() == ""){
				$("#menuName1").show();
				$("#menuCode").val("");	// 将输入框中的空格去掉
				return ;
			}else{
				$("#menuName1").hide();
			}
		});
		
		// **********************转换浮动框  end********************
	});
	
	
	// 翻页功能
	function pagerFilter(data) {
		var method = $("#method").val();	// 查询的条件
		var context = $("#context").val();	// 条件的具体值
		$('#tree').treegrid('options').url = '${ctx}/bdrp/authority/resource/list?method='+method+'&context='+context;
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
					method : method,
					context : context,
					start : startNum,
					limit : pageSize
				});
			}
		});
		return data;
	}
	
	// 加载Function 的子节点
	function loadChildren(row) {
		if (row) {
			$('#tree').treegrid('options').url = '${ctx}/puborgauthz/childrenFunctionList.do?parentid=' + row.id;
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
		$('.one-center-panel').load('${ctx}/puborgauthz/addResource');
		
	//	$(".panel combo-p").html("");
	//	$(".combo-p").html("");
	//	$(".window").html("");
	//	$(".window-shadow").html("");
	//	$(".window-mask").html("");
		
		// ****防止页面DIV过多，造成缓慢**********
		$(".combo-p").remove();
		$(".window").remove();
		$(".window-shadow").remove();;
		$(".window-mask").remove();
		
		$(".c-ff-input-warning").remove();
		$(".pika-single").remove();
		// ****防止页面DIV过多，造成缓慢**********
	};
	
	// 添加子节点 / 转换-========================================
	function doClickCell(field, row){
		// 添加子节点
		if(field == "operate"){	// 如果点击的是添加那列
			var id = row.id;	// 得到该行数据ID
			$('.one-center-panel').load('${ctx}/puborgauthz/addResource?id=' + id);
			
			// ****防止页面DIV过多，造成缓慢**********
			$(".combo-p").remove();
			$(".window").remove();
			$(".window-shadow").remove();;
			$(".window-mask").remove();
			
			$(".c-ff-input-warning").remove();
			$(".pika-single").remove();
			// ****防止页面DIV过多，造成缓慢**********
		}
		// 转换
		if(field == "change"){	// 如果点击的是转换那列
			var id = row.id;		// 得到该行数据ID
			var name = row.name;	// 得到该行名称
			var desc = row.desc;	// 得到该行描述
			
			$("#fid").val(id);
			$("#serviceName").val(name);
			$("#menuName").val(name);
			$("#fdesc").val(desc);
			
			$("#menuParentId").combo("clear");	// 清空控件值
			$("#menuCode").val("");		// 将内容清空
			
			// 所有提示信息隐藏
			$("#serviceName1").hide();
			$("#serviceName2").hide();
			$("#menuCode1").hide();
			$("#menuCode2").hide();
			$("#menuName1").hide();
			
			$("#changeWindow").window('open');
		}
	}
	
	
	// 修改功能----跳转到修改页面
	function doDblClickRow(row){
		var id = row.id;
		$('.one-center-panel').load('${ctx}/puborgauthz/editFunction.ihp?id=' + id);
		
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
					url : "${ctx}/puborgauthz/deleteFunction.do",
					data : "ids=" + ids,
					success : function(msg){
						if(msg == "success"){
							$.messager.alert("提示","删除成功","info");
						//	$("#tree").treegrid("reload");	// 如果删除子节点，那么页面刷新后为空白
							$('.one-center-panel').load('${ctx}/puborgauthz/functionMain.ihp');
						}else{
							$.messager.alert("错误","该功能已被使用，无法删除！");
						}
					},
					error : function(){
						$.messager.alert("错误","删除失败！");
					}
				});
			}
		});
		
	}
	
	// =================提交转换表单====================
	function toSave(){
		// 对菜单名称添加焦点事件---判断是否输入
		// 判断是否输入
		var menuName = $("#menuName").val();
		if(menuName == null || menuName.trim() == ""){
			$("#menuName1").show();
			$("#menuCode").val("");	// 将输入框中的空格去掉
			return ;
		}else{
			$("#menuName1").hide();
		}
		
		
		// 对服务名---判断是否输入，和名称是否重复
		var fid = $("#fid").val();
		var serviceName = $("#serviceName").val();
		if(serviceName == null || serviceName.trim() == ""){
			$("#serviceName1").show();
			$("#serviceName2").hide();
			$("#serviceName").val("");	// 将输入框中的空格去掉
			return ;
		}else{
			$("#serviceName1").hide();
		}
		
		// Ajax异步提交，校验该名称是否已经存在
		$.ajax({
			type : "POST",
			url : "${ctx}/puborgauthz/existNameAuthzFunction.do",
			data : "name="+serviceName+"&fid="+fid,
			success : function(msg){
				if(msg == "success"){
					$("#serviceName2").hide();
					// -----------------
					// ***********************
					// 对菜单编码---判断是否输入，和编码是否重复
					// 判断是否输入编码
					var menuCode = $("#menuCode").val();
					if(menuCode == null || menuCode.trim() == ""){
						$("#menuCode1").show();
						$("#menuCode2").hide();
						$("#menuCode").val("");	// 将输入框中的空格去掉
						return ;
					}else{
						$("#menuCode1").hide();
					}
					
					// Ajax异步提交，校验该编码是否已经存在
					$.ajax({
						type : "POST",
						url : "${ctx}/puborgauthz/existNameMenu.do",
						data : "code="+menuCode,
						success : function(msg){
							if(msg == "success"){
								$("#menuCode2").hide();
								// +++++++++++++++++++
									// 表单提交
									$("#converToMenu").form({
										url : "${ctx}/simorgauthz/pubConvert2Menu.do",
										success : function(msg){
											if(msg == "success"){
												// 关闭浮动窗口
												$("#changeWindow").window('close');
												
												// ****防止页面DIV过多，造成缓慢**********
												$(".combo-p").remove();
												$(".window").remove();
												$(".window-shadow").remove();;
												$(".window-mask").remove();
												
												$(".c-ff-input-warning").remove();
												$(".pika-single").remove();
												$("iframe").remove();	// 防止页面标签过多
												// ****防止页面DIV过多，造成缓慢**********
												
												$.messager.alert("提示","转换菜单成功！","info");
												$('.one-center-panel').load('${ctx}/puborgauthz/functionMain.ihp');
											}
											if(msg == "exits1"){
												$("#serviceName2").show();
											}
											if(mag == "exits2"){
												$("#serviceName2").show();
											}
										}
									});
									$("#converToMenu").submit();
								// +++++++++++++++++++
							}else if(msg == "exist"){
								$("#menuCode2").show();
								$("#menuCode1").hide();
								return ;
							}
						}
					});
					// ***********************
					// -----------------
				}else if(msg == "exist"){
					$("#serviceName2").show();
					$("#serviceName1").hide();
					return ;
				}
			}
		});
		
		
				
		
	}
</script>
</head>
<body>
<div class="box">
	<div class="box-container">
		<div id="div1" region="center" border="false">
			<table id="tree" class="easyui-treegrid" border=0 cellspacing=0 cellpadding=0></table>
		</div>
		
		<!-- 浮动窗体 转换 -->
		<div  id="changeWindow">
			<div region="center" style="overflow:auto; padding:5px" border="false">
				<form id="converToMenu" action="" method="post">
					<table  width=100% border=0 cellspacing=0 cellpadding=0>
				
						<tr class=f-tab-row>
							<td class=f-tab-col-label-nowidth width="15%"><label>服务名<font color="red">&nbsp;*&nbsp;</font>:</label></td>
							<td class=f-tab-col-input-nowidth width="20%">
								<input id="fid" type="hidden" name="fid">
								<textarea id="fdesc" name="fdesc" style="display: none;" rows="5" cols="20"></textarea>
								<input id="serviceName" type="text" class=c-ff-input name="serviceName">
								<p id="serviceName1" style="display : none;"><font color="red">* 服务名必须填写</font></p>
								<p id="serviceName2" style="display:none;"><font color="red">* 该服务名已存在,请重新填写!</font></p>
							</td>
						</tr>
						<tr class=f-tab-row>
							<td class=f-tab-col-label-nowidth width="15%"><label>上级菜单:</label></td>
							<td class=f-tab-col-input-nowidth width="20%">
								<select id="menuParentId" name="menuParentId" class="easyui-combotree"
										data-options="width:226, height:32, url:'${ctx}/puborgauthz/combotreeMenu.do'">
									
								</select>
								<!-- 
								<input id="resCode" type="text" class=c-ff-input name="model.code">
								 -->
							</td>
						</tr>
						<tr class=f-tab-row>
							<td class=f-tab-col-label-nowidth width="15%"><label>菜单编码<font color="red">&nbsp;*&nbsp;</font>:</label></td>
							<td class=f-tab-col-input-nowidth width="20%">
								<input id="menuCode" type="text" class=c-ff-input name="menuCode"">
								<p id="menuCode1" style="display : none;"><font color="red">* 菜单编码必须填写</font></p>
								<p id="menuCode2" style="display:none;"><font color="red">* 该菜单编码已存在,请重新填写!</font></p>
							</td>
						</tr>
						<tr class=f-tab-row>
							<td class=f-tab-col-label-nowidth width="15%"><label>菜单名称:</label></td>
							<td class=f-tab-col-input-nowidth width="20%">
								<input id="menuName" type="text" class=c-ff-input name="menuName"">
								<p id="menuName1" style="display : none;"><font color="red">* 菜单名称必须填写</font></p>
							</td>
						</tr>
						
						<tr class=f-tab-row/f-tab-row-sep>
							<td colspan=2 align=center>
								<input id="resSave" type=button class=normal-btn onclick='toSave();' value=保存>&nbsp;&nbsp;<input type=reset class=normal-btn value=重置>
							</td>
						</tr>
						<!-- 
						// 功能转换关系
						添加服务和菜单
						服务中包含功能ID和描述
						菜单中包含服务ID  类型【显示位置】1
						 -->
					</table>
					
				</form>
			</div>
		</div>
	</div>
</div>

</body>
