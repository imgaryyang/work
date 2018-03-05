<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<link rel="stylesheet" type="text/css" href="${ctx}/jQuery/plugin/pikaday.css">
<script type="text/javascript" src="${ctx}/jQuery/plugin/pikaday.jquery.js"></script>
<title>修改功能管理</title>

<!-- easyui 主题CSS -->
<link rel="stylesheet" type="text/css" href="${ctx }/jQuery/easyui-1.3.6/themes/default/easyui.css">
<!-- easyui 图标 CSS -->
<link rel="stylesheet" type="text/css" href="${ctx }/jQuery/easyui-1.3.6/themes/icon.css">
<!-- easyui核心类库 -->
<script type="text/javascript" src="${ctx }/jQuery/easyui-1.3.6/scripts/jquery.easyui.min.js"></script>

<script type="text/javascript">
	$(document).ready(function(){
		$.initSpecInput();
		
		
		// 返回功能主页面 
		$("#back").click(function(){
			$('.one-center-panel').load('${ctx}/puborgauthz/functionMain.ihp');
		}); 
		
		// 对名称添加焦点事件---判断是否输入，和编码是否改变
		$("#name").blur(function(){
			// 对功能名称判断
			var name = $("#name").val();
			
			// 判断功能名是否改变
			var funName = $("#funName").val();
			if(funName == name){
				$("#repeat").hide();
				return ; // 名称没有改变
			}else{
				// Ajax异步提交，校验该名称是否已经存在
				$.ajax({
					type : "POST",
					url : "${ctx}/puborgauthz/existNameFunction.do",
					data : "name="+name,
					success : function(msg){
						if(msg == "success"){
							$("#repeat").hide();
							
						}else if(msg == "exist"){
							$("#repeat").show();
							$("#msg").hide();
							return ;
						}
					}
				});
			}
		});
		
		
		// 保存功能信息----表单提交会跳转页面，所以使用Ajax异步提交，局部刷新
		$("#save").click(function(){
			// 对父节点判断
			// 获取树形下拉框中的 ID 值
			var comTree = $("#parentId").combotree('tree');
			// 如果选择了树形下拉框，那么treeData为Object，没选则为：null
			var treeData = comTree.tree('getSelected');
			var parentId = "";
			// 判断是否选择节点
			if(treeData == null){
				parentId = $("#funParent").val();
			}else if(treeData.id.trim() == ""){
				parentId = "";
			}else{
				parentId = treeData.id;
			}
			$("#functionParent").val(parentId);
			
			
							
			// **********
			$("#functionForm").form({
				url : "${ctx}/puborgauthz/saveFunction.do",
				onSubmit : doCheck,
				success : function(msg){
					if(msg == "success"){
						$.messager.alert("提示","数据保存成功！","info");
						$('.one-center-panel').load('${ctx}/puborgauthz/functionMain.ihp');
					}
				}
			});
			$("#functionForm").submit();
			// **********
						
			
		});
		
		// **************URI 浮动窗   start******************
		// URI 浮动窗口
		$("#uriWindow").window({
			title : "选择URI",
			width : 350,
			height : 450,
			collapsible : false,
			minimizable : false,
			maximizable : false,
			closed : true,
			modal : true,
			resizable : false
			
		}); 
		
		
		// URI 浮动框，获取URI的值
		$("#uri").click(function(){
			// 每次打开浮动框都重新加载树数据
			$("#treeAction").tree("reload");
			
			$("#uriWindow").window('open');
			
		});
		
		
		// 获取URI的树形数据
		$("#treeAction").tree({
			url : "${ctx}/puborgauthz/chooseUri.do",
			animate : true,
			lines : true
		});
		
		
		// 选择指定的URI---只有选取叶子节点，才能设值，并且关闭浮动框
		$("#treeAction").click(function(){
			var node = $("#treeAction").tree("getSelected");
			
			if(node){
				var s = "";
				if(!node.children){
					s = node.id;
					$("#uri").val(s);
					$("#uriWindow").window('close');
				}
			}
		});
		// **************URI 浮动窗   end******************
		
		// **************资源 浮动窗   start******************
		// 添加资源 浮动窗口
		$("#resourceWindow").window({
			title : "添加",
			width : 350,
			height : 360,
			collapsible : false,
			minimizable : false,
			maximizable : false,
			closed : true,
			modal : true,
			resizable : false,
			zIndex : 10
			
		});
		
		// 打开添加资源浮动框----设置功能名称和功能ID
		$("#addResource").click(function(){
			var functionId = $("#funId").val();
			var functionName = $("#name").val();
			$("#functionId").val(functionId);
			$("#functionName").val(functionName);
			
			// 将其余的输入框置空
			$("#resCode").val("");
			$("#resName").val("");
			$("#resDesc").val("");
			// 提示信息不显示
			$("#resCode1").hide();
			$("#resCode2").hide();
			$("#resName1").hide();
			$("#resName2").hide();
			
			
			$("#resourceWindow").window('open');
		});
		
		// **************资源 浮动窗   end******************
		
		// **************资源数据翻页 start***************
		// 得到资源页面---第一页
		var functionId = $("#funId").val();
		forLinkedAuthResource("0", "5", functionId);
		
		// **************资源数据翻页 end***************
		
	}); 
	
	
	// 对资源编码添加焦点事件
	$("#resCode").blur(function(){
		var functionId = $("#funId").val();		// 获取当前功能ID
		
		// 对资源 "编码" 添加焦点事件---判断是否输入，和名称是否重复
		var resCode = $("#resCode").val();
		
		
		// Ajax异步提交，校验资源 "编码"是否已经存在
		$.ajax({
			type : "POST",
			url : "${ctx}/puborgauthz/existCodeResource.do",
			data : "code="+resCode+"&functionId="+functionId,
			success : function(msg){
				if(msg == "success"){
					$("#resCode2").hide();
				}else if(msg == "exist"){
					$("#resCode2").show();
					$("#resCode1").hide();
					return ;
				}
			}
		});
	});
	
	// 对资源名称添加焦点事件
	$("#resName").blur(function(){
		var functionId = $("#funId").val();		// 获取当前功能ID
		
		var resName = $("#resName").val();
		
		// Ajax异步提交，校验资源 "名称"是否已经存在
		$.ajax({
			type : "POST",
			url : "${ctx}/puborgauthz/existNameResource.do",
			data : "name="+resName+"&functionId="+functionId,
			success : function(msg){
				if(msg == "success"){
					$("#resName2").hide();
					
				}else if(msg == "exist"){
					$("#resName2").show();
					$("#resName1").hide();
					return ;
				}
			}
		});
	});
	
	// 保存功能信息----表单提交会跳转页面，所以使用Ajax异步提交，局部刷新
	function toSave(){
		
		// ==========================
		$("#resourceForm").form({
			url : "${ctx}/puborgauthz/saveAuthzResource.do",
			onSubmit : doResCheck,
			success : function(msg){
				if(msg == "success"){
					// 关闭浮动窗口
					$("#resourceWindow").window('close');
					var funId = $("#funId").val();
					$('.one-center-panel').load('${ctx}/puborgauthz/editFunction.ihp?id=' + funId);
				}
			}
		});
		$("#resourceForm").submit();
		// ==========================
							
	};
	
	// 资源分页数据
	function forLinkedAuthResource(start, limit, functionId){
		// 得到当前的功能名称
		var funName = $("#funName").val();
		$("#tp1item").empty();
		$.ajax({
			type : "POST",
			url : "${ctx}/puborgauthz/linkedAuthResource.do?start="+start+"&limit="+limit+"&functionId="+functionId,
			dataType : 'json',
			success : function(data){
				var rows = "<table class='l1-tab'><thead><tr><th class=l1-col-info style='width:15%;'>名称</th>"+
							"<th class=l1-col-info style='width:20%;'>编码</th><th class=l1-col-info style='width:22%;'>模块</th>"+
							"<th class=l1-col-info style='width:25%;'>备注</th><th class=l1-col-info style='width:8%;'>操作</th>"+
							"</tr></thead><tbody id=catTr>";
				$.each(data.result, function(index,resource){
					rows = rows + "<tr><td class=l1-col-info>"+resource.name+" </td>";
					rows = rows + "<td class=l1-col-info>"+resource.code+" </td>";
					rows = rows + "<td class=l1-col-info>"+funName+" </td>";
					rows = rows + "<td class=l1-col-info>"+resource.memo+" </td>";
					var resourceId = "\""+resource.id+"\"";		// 在浏览器下 为  onclick="deleteRes("8a81e4974714c66d014714cfdc600010");"
					rows = rows + "<td class=l1-col-info><a href='#' class='deleteRes' onclick='deleteRes("+resourceId+");'>删除 </a></td></tr>";
				});
				rows = rows + "</tbody></table>";
				
				rows = rows + "<div class=turn-page>";
				if(data.start < data.limit){
				//	rows = rows + "<a href='#' onclick=forLinkedAuthResource('"+data.start+"','"+data.limit+"','"+functionId+"');>上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
				}
				if(data.start >= data.limit){
					rows = rows + "<a href='#' onclick=forLinkedAuthResource('"+(data.start-data.limit)+"','"+data.limit+"','"+functionId+"');>上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
				}
				
				if((data.totalCount-data.start)>data.limit){
					rows = rows +"<a href='#' onclick=forLinkedAuthResource('"+(data.start+data.limit)+"','"+data.limit+"','"+functionId+"');>下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
				}
				if((data.totalCount-data.start)<=data.limit){
				//	rows = rows +"<a href='#' onclick=forLinkedServicesPub('"+data.start+"','"+data.limit+"','"+id+"');>下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
					rows = rows + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
				}
				
				rows = rows + "&nbsp;&nbsp;&nbsp;&nbsp;"+(1+data.start/data.limit)+"&nbsp;页&nbsp;&nbsp;&nbsp;&nbsp;共&nbsp;<font>"+data.totalCount+"</font>&nbsp;条记录</div>";
				
				$("#tp1item").append(rows);
			}
		});
	}
	
	// 删除资源
	function deleteRes(id){
		// 获取当前的Function  Id
		var funId = $("#funId").val();
		
		$.messager.confirm("确认删除", "你确定要删除选中项吗？", function(flag){
			if(flag == true){
				// Ajax异步提交
				$.ajax({
					type : "POST",
					url : "${ctx}/puborgauthz/deleteAuthzResource.do",
					data : "id=" + id,
					success : function(msg){
						if(msg == "success"){
							$.messager.alert("提示","删除成功","info");
							// 这样右边会全部刷新，要求下面列表局部刷新
						//	$('.right-panel').load('${ctx}/puborgauthz/editFunction.ihp?id=' + funId);
							var functionId = $("#funId").val();
							forLinkedAuthResource("0", "5", functionId);
						}
					}
				});
			}
		});
	}
	
	function doCheck(){
		if($('#functionForm').check()==true){
			// Ajax异步提交，校验该名称是否已经存在
			var flag = true;
			
			var name = $("#name").val();
			// 判断功能名是否改变
			var funName = $("#funName").val();
			if(funName == name){
				flag = true;
				
			}else{
				// Ajax异步提交，校验该名称是否已经存在
				$.ajax({
					type : "POST",
					url : "${ctx}/puborgauthz/existNameFunction.do",
					async : false,
					data : "name="+name,
					success : function(msg){
						if(msg == "success"){
							$("#repeat").hide();
							flag = true;
							
						}else if(msg == "exist"){
							$("#repeat").show();
							$("#msg").hide();
							flag = false;
						}
					}
				});
			}
			
			return flag;
		}else{
			return false;
		}
	}
	
	function doResCheck(){
		if($('#resourceForm').check()==true){
			// Ajax异步提交，校验该名称是否已经存在
			var flag = true;
			
			var functionId = $("#funId").val();		// 获取当前功能ID
			
			// 对资源 "编码" 添加焦点事件---判断是否输入，和名称是否重复
			var resCode = $("#resCode").val();
			
			
			// Ajax异步提交，校验资源 "编码"是否已经存在
			$.ajax({
				type : "POST",
				url : "${ctx}/puborgauthz/existCodeResource.do",
				data : "code="+resCode+"&functionId="+functionId,
				async : false,
				success : function(msg){
					if(msg == "success"){
						$("#resCode2").hide();
						flag = true;
						
						// *****************
						// 对资源 "名称" 添加焦点事件---判断是否输入，和名称是否重复
						var resName = $("#resName").val();
						
						
						// Ajax异步提交，校验资源 "名称"是否已经存在
						$.ajax({
							type : "POST",
							url : "${ctx}/puborgauthz/existNameResource.do",
							data : "name="+resName+"&functionId="+functionId,
							async : false,
							success : function(msg){
								if(msg == "success"){
									$("#resName2").hide();
									// ==========================
									flag = true;
									// ==========================
								}else if(msg == "exist"){
									$("#resName2").show();
									$("#resName1").hide();
									flag = false;
								}
							}
						});
					}else if(msg == "exist"){
						$("#resCode2").show();
						$("#resCode1").hide();
						flag = false;
					}
				}
			});
			
			return flag;
		}else{
			
			return false;
		}
	}
	
</script>
</head>
<body>

<div class="box">
<div class="box-head">
	<div class="box-title">
		<h3>功能修改</h3>
		<a id="back" href="#" class='box-icon-a icon-back' style='float:right ;vertical-align: middle;margin-right:20px;height: 20px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;返回</a>
	</div>
</div>
<div class="box-container" style="display:inline-block;">
	<form method='post' id='functionForm' name='functionForm' action='${ctx}/puborgauthz/saveFunction.do' >
		
		<!-- 隐藏功能的ID -->
		<input type="hidden" id="funId" name="model.id" value="${list.id }">
		<!-- 用户判断功能名是否改变 -->
		<input type="hidden" id="funName" name="funName" value="${list.name }">
		<!-- 隐藏标签，功能的父节点ID -->
		<input type="hidden" id="funParent" name="parent.id" value="${list.parent.id }">
		<!-- 用于传递功能的父节点ID -->
		<input type="hidden" id="functionParent" name="model.parent.id">
		
		
		<div class="f-div-row">
			<div class="f-div-label-c4"><label>上级:</label></div>
			<div class="f-div-input-c4">
				<select id="parentId" name="parent.id" class="easyui-combotree" 
					data-options="width:226, height:32, url:'${ctx}/puborgauthz/combotreeFunction.do'">
					<!-- 当出现三层时，显示${list.parent.id }  不会显示${list.parent.name }
					<option value="${list.parent.id }">${list.parent.name } </option>
					 -->
					<option value="${list.parent.name }"> </option>
				</select>
			</div>
			<div class="f-div-label-c4"><label>名称<font color="red">&nbsp;*&nbsp;</font>:</label></div>
			<div class="f-div-input-c4">
				<input id="name" type="text" class=c-ff-input name="model.name" value="${list.name }" _nullable=false _nullablemsg=请填写名称  _maxlength=50 _maxlengthmsg='最大长度为50'>	<br/>
				<p id="msg" style="display : none;"><font color="red">* 功能名称必须填写</font></p>
				<p id="repeat" style="display : none;"><font color="red">* 该名称已存在,请重新填写!</font></p>
			</div>
		</div>
		<div  class="f-div-row">
			<div class="f-div-label-c4"><label>URI:</label></div>
			<div class="f-div-input-c4"><input id="uri" type="text" class=c-ff-input readonly="readonly" name="model.uri" value="${list.uri }"></div>
			<div class="f-div-label-c4"><label>描述:</label></div>
			<div class="f-div-input-c4"><textarea id="desc" name="model.desc" rows="3" cols="20">${list.desc } </textarea></div>
		</div>
		
		<!-- 资源数据列表 -->
		<div id=cbBanks class=float-tp-holder>
			<div class=float-tp-title-holder>
				<a id=tp1 href='javascript:void(0)' class=float-tp-title-active>包含资源</a>
				<div class=float-right>
					<a id="addResource" href="#" class='box-icon-a'>新增</a>
				</div>
			</div>
			<div id=cbItems class=float-tp-item-holder>
			<div id="tp1item" >
				<!-- 通过JS填充内容 -->
				
			</div>
			</div>
		</div>
		
		<div class="f-div-btn">
			<input id="save" type="button" class="normal-btn" value=保存>&nbsp;&nbsp;
			<input type=reset class=normal-btn value=重置>&nbsp;&nbsp;
		</div>
		
	</form>
	
	
	<!-- 浮动窗体 选择URI -->
	<div  id="uriWindow">
		<div id="tt" class="easyui-tabs" data-options="fit:true, border:false">
			<div title="Action" >
				<ul id="treeAction"></ul>
			</div>
			<div title="页面" >
				
			</div>
		</div>
	</div>
	
	<!-- 浮动窗体  添加资源 -->
	<div  id="resourceWindow">
		<div region="center" style="overflow:auto; padding:5px" border="false">
			<form id="resourceForm" action="" method="post">
				<table  width=100% border=0 cellspacing=0 cellpadding=0>
			
					<tr class=f-tab-row>
						<td class=f-tab-col-label-nowidth width="15%"><label>功能:</label></td>
						<td class=f-tab-col-input-nowidth width="20%">
							<input id="functionName" type="text" readonly="readonly" class=c-ff-input name="functionName">
							<input id="functionId" type="hidden" name="model.function.id">
						</td>
					</tr>
					<tr class=f-tab-row>
						<td class=f-tab-col-label-nowidth width="15%"><label>编码<font color="red">&nbsp;*&nbsp;</font>:</label></td>
						<td class=f-tab-col-input-nowidth width="20%">
							<input id="resCode" type="text" class=c-ff-input name="model.code"  _nullable=false _nullablemsg=请填写编码  _maxlength=50 _maxlengthmsg='最大长度为50'>
							<p id="resCode1" style="display : none;"><font color="red">* 资源编码必须填写</font></p>
							<p id="resCode2" style="display:none;"><font color="red">* 该编码已存在,请重新填写!</font></p>
						</td>
					</tr>
					<tr class=f-tab-row>
						<td class=f-tab-col-label-nowidth width="15%"><label>名称<font color="red">&nbsp;*&nbsp;</font>:</label></td>
						<td class=f-tab-col-input-nowidth width="20%">
							<input id="resName" type="text" class=c-ff-input name="model.name"  _nullable=false _nullablemsg=请填写名称  _maxlength=50 _maxlengthmsg='最大长度为50'>
							<p id="resName1" style="display : none;"><font color="red">* 资源名称必须填写</font></p>
							<p id="resName2" style="display:none;"><font color="red">* 该名称已存在,请重新填写!</font></p>
						</td>
					</tr>
					<tr class=f-tab-row>
						<td class=f-tab-col-label-nowidth width="15%"><label>描述:</label></td>
						<td class=f-tab-col-input-nowidth width="20%">
							<textarea id="resDesc" name="model.memo" rows="3" cols="20"></textarea>
						</td>
					</tr>
					
					<tr class=f-tab-row/f-tab-row-sep>
						<td colspan=2 align=center>
							<input id="resSave" type=button class=normal-btn onclick='toSave();' value=保存>&nbsp;&nbsp;<input type=reset class=normal-btn value=重置>
						</td>
					</tr>
				</table>
				
			</form>
		</div>
	</div>
	
</div>
</div>
</body>
</html>


