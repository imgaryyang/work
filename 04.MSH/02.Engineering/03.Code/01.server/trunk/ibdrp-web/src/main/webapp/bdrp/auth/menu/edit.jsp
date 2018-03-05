<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<title>新增功能管理</title>

<script type="text/javascript">
	$(document).ready(function(){
		$.initSpecInput();
		var parentId = $('#parentId').val();
		$('#parent').combotree({
			url : '${ctx}/bdrp/auth/menu/tree',
			required : false,
			method : "GET",
			formatter : function(node) {
				node.text = node.name;
				delete node.name;
				return node.text;
			},
			onSelect:function(n){
				$('#parentId').val(n.id);
			}
		});
		
		$('#parent').combotree('setValue',parentId);
		
		// 返回功能主页面 
		$("#back").click(function(){
			$('.one-center-panel').load('${ctx}/bdrp/auth/menu/main');
			
			// ****防止页面DIV过多，造成缓慢**********
			$(".combo-p").remove();
			$(".window").remove();
			$(".window-shadow").remove();;
			$(".window-mask").remove();
			
			$(".c-ff-input-warning").remove();
			$(".pika-single").remove();
			// ****防止页面DIV过多，造成缓慢**********
		}); 
		
		// ************  必输项判断   Start  ***********
		// 对编码添加焦点事件---判断是否输入，和编码是否改变
		$("#code").blur(function(){
			// 判断是否输入编码
			var code = $("#code").val();
			
			// 判断编码是否改变
			var meCode = $("#meCode").val();
			if(meCode == code){
				$("#code2").hide();
				return ;	// 编码没有改变
			}else{
			// Ajax异步提交，校验该编码是否已经存在
				$.ajax({
					type : "POST",
					url : "${ctx}/bdrp/auth/menu/existNameMenu.do",
					data : "code="+code,
					success : function(msg){
						if(msg == "success"){
							$("#code2").hide();
						}else if(msg == "exist"){
							$("#code2").show();
							$("#code1").hide();
							return ;
						}
					}
				});
			}
		}); 
		
		
		
		// ************  必输项判断  End  ***********
		
		// 保存功能信息----表单提交会跳转页面，所以使用Ajax异步提交，局部刷新
		$("#save").click(function(){
			
			// **********表单提交
			$("#menuForm").form({
				url : "${ctx}/bdrp/auth/menu/update",
				onSubmit : doCheck,
				success : function(msg){
					msg = $.parseJSON(msg);
					if(msg.id){
						$.messager.alert("提示","数据保存成功！","info");
						$('.one-center-panel').load('${ctx}/bdrp/auth/menu/main');
						
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
			});
			$("#menuForm").submit();
			// **********
			
			
		});
		
		
		// ************  浮动框  Start  ***********
		// 打开浮动框
		$("#accessName").click(function(){
			// URI 浮动窗口
			$("#accessWindow").window({
				title : "选择授权",
				width : 560,
				height : 500,
				collapsible : false,
				minimizable : false,
				maximizable : false,
				closed : true,
				modal : true,
				resizable : false,
				href : "${ctx}/bdrp/auth/menu/toLink",
				queryParams : {start : '0',limit : '10'}
			}); 
			
			search();	// 保证每次点击刷新
			$("#accessWindow").window('open');
		});
		
		
		/* // 图标浮动框
		$("#imagesWindow").window({
			title : "选择图片",
			width : 350,
			height : 450,
			collapsible : false,
			minimizable : false,
			maximizable : false,
			closed : true,
			modal : true,
			resizable : false
		});
		
		// 打开图标浮动框
		$("#iconPath").click(function(){
			// 每次打开浮动框都重新加载树数据
			$("#images").tree("reload");
			
			$("#imagesWindow").window('open');
		});
		
		// 获取  图标  的树形数据
		$("#images").tree({
		//	url : "${ctx}/pbdrp/simorgauthz/menu/pages/imagestree.json",	// 测试数据
			url : "${ctx}/config/pubImages.do?rootPath=resources/images/icons",
			animate : true,
			lines : true
		});
		
		// 选择指定的图标---只有选取叶子节点，才能设值，并且关闭浮动框
		$("#images").click(function(){
			var node = $("#images").tree("getSelected");
			
			if((node.id).endsWith(".png")){
				var s = node.path;
			//	s = node.id;
				$("#iconPath").val(s);
				$("#imagesWindow").window('close');
			}
		}); */
		
		// ************  浮动框  End  ***********
	}); 
	
	// ************  授权选择  浮动框  Start  ***********
	// 浮动框---取消返回
	/* function closeWin(){
		$("#accessWindow").window('close');
	} */
	
	// 浮动框全选 / 全不选------只选择一个
	function checkAll(){
		var flag = $("#checkAll").is(':checked');
		if(flag){
			$("table tbody tr input[class='beCheck']").attr("checked", "checked");
		}else {
			$("table tbody tr input[class='beCheck']").removeAttr("checked", "checked");
		}
	}
	
	//获取浮动框的数据并保存授权----得到第一个选择的数据
	function doLinkAuthAccess(){
		var info = "";
		var checked = $("table tbody  input[type='radio']:checked");
		if(checked.length>0){
			$("#accessId").val(checked[0].value);
			$("#accessName").val(checked[0].getAttribute('accName'));
			// 关闭浮动框
			$("#accessWindow").window('close');
		}else {
			$.messager.alert("警告","权限未选择，请选择权限！","warning");
		}
	}
	
	// 无任何条件查询
	function search(){
		var url = "${ctx}/bdrp/auth/access/menu/toLink?start="+0+"&limit="+10;
		// 通过Ajax读取
		$("#accessWindow").window('refresh', url);
	}
	
	// 浮动框条件查询
	function conditionSearch(){
		// 名称
		var name = $("#authzServiceName").val();
		// 功能
		var functionName = $("#authzServiceFunction").val();
		// 备注
		var descp = $("#authzServiceDescp").val();
		
		var url = "${ctx}/bdrp/auth/access/menu/toLink?name="+name
					+"&functionName="+functionName+"&descp="+descp+"&start="+0+"&limit="+10;
		// 通过Ajax读取
		$("#accessWindow").window('refresh', url);
	}
	
	// 浮动框----翻页
	function reloadService(start, limit){
		var name = $("#authzServiceName").val();
		var functionName = $("#authzServiceFunction").val();
		var descp = $("#authzServiceDescp").val();
		
		var url = "${ctx}/bdrp/auth/access/menu/toLink?name="+name
					+"&functionName="+functionName+"&descp="+descp+"&start="+start+"&limit="+limit;
		// 通过Ajax读取
		$("#accessWindow").window('refresh', url);
	}
	// ************  授权选择  浮动框  End  ***********
function doCheck(){
	if($('#menuForm').check()==true){
		// Ajax异步提交，校验该名称是否已经存在
		var flag = true;
		
		// 判断是否输入编码
		var code = $("#code").val();
		var name = $("#name").val();
		if($.trim(name)==""&&$.trim(code)!=""){
			$("#code2").hide();
			$("#emptycode").hide();
			$("#emptyname").show();
			return false;
			//flag = false;
		}
		if($.trim(code)==""&&$.trim(name)!=""){
			$("#emptyname").hide();
			$("#code2").hide();
			$("#emptycode").show();
			return false;
			//flag = false;
		}
		if($.trim(code)==""&&$.trim(name)==""){
			$("#emptyname").show();
			$("#code2").hide();
			$("#emptycode").show();
			return false;
			//flag = false;
		}
		
		// 判断编码是否改变
		var meCode = $("#meCode").val();
		if(meCode == code){
			flag = true;
		}else{
		// Ajax异步提交，校验该编码是否已经存在
			$.ajax({
				type : "POST",
				url : "${ctx}/bdrp/auth/menu/existNameMenu.do",
				async : false,
				data : "code="+code,
				success : function(msg){
					if(msg == "success"){
						$("#code2").hide();
						
						flag = true;
					}else if(msg == "exist"){
						$("#code2").show();
						$("#code1").hide();
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
</script>
</head>
<body>

<div class="box">
<div class="box-head">
	<div class="box-title">
		<h3>菜单修改</h3>
		<a id="back" href="#" class='box-icon-a icon-back' style='float:right ;vertical-align: middle;margin-right:20px;height: 20px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;返回</a>
	</div>
</div>
<div class="box-container" style="display:inline-block;">
	<form method='post' id='menuForm' name='menuForm' action='' >
		<!-- 隐藏功能的ID -->
		<input type="hidden" id="meId" name="id" value="${model.id }">
		<!-- 用户判断编码是否改变 -->
		<input type="hidden" id="meCode" name="meCode" value="${model.code }">
		<!-- 隐藏标签，功能的父节点ID -->
		<!-- 用于传递功能的父节点ID -->
		<!-- <input type="hidden" id="menuParent" name="parent.id"> -->
		<input type="hidden" id="parentId" value="${model.parentId }">
		
		<div class="f-div-row">
			<div class="f-div-label-c4"><label>上级:</label></div>
			<div class="f-div-input-c4">
				<select id="parent" name="parent.id" style="width:210px"></select>
			</div>
			<div class="f-div-label-c4"><label>编码<font color="red">&nbsp;*&nbsp;</font>:</label></div>
			<div class="f-div-input-c4">
				<input id="code" type="text" class=c-ff-input name="code" value="${model.code }" _nullable=false _nullablemsg=请填写编码  _maxlength=50 _maxlengthmsg='最大长度为50'>	<br/>
				<p id="code1" style="display : none;"><font color="red">* 编码必须填写</font></p>
				<p id="code2" style="display : none;"><font color="red">* 该编码已存在,请重新填写!</font></p>
				<p id="emptycode" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
			</div>
		</div>
		<div  class="f-div-row">
			<div class="f-div-label-c4"><label>名称<font color="red">&nbsp;*&nbsp;</font>:</label></div>
			<div class="f-div-input-c4">
				<input id="name" type="text" class=c-ff-input name="name" value="${model.name }" _nullable=false _nullablemsg=请填写名称  _maxlength=50 _maxlengthmsg='最大长度为50'>
				<p id="name1" style="display : none;"><font color="red">* 名称必须填写</font></p>
				<p id="emptyname" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
			</div>
			<div class="f-div-label-c4"><label>对应授权<font color="red">&nbsp;*&nbsp;</font>:</label></div>
			<div class="f-div-input-c4">
				 <input id="accessId" type="hidden" class=c-ff-input name="access.id" value="${model.access.id }">
				 <input id="accessName" type="text" class=c-ff-input readonly="readonly" name="access.name" value="${model.access.name }" _nullable=false _nullablemsg=请选择授权>
				<p id="accessId1" style="display : none;"><font color="red">* 对应授权必须选择</font></p>
			</div>
		</div>
		<div  class="f-div-row">
			<div class="f-div-label-c4"><label>图标:</label></div>
			<div class="f-div-input-c4">
				<input id="iconPath" type="text" class=c-ff-input  name="iconPath" value="${model.iconPath }">
			</div>
			<div class="f-div-label-c4"><label>显示位置:</label></div>
			<div class="f-div-input-c4">
				<c:if test="${model.accType == '1' }">
					<input id="accType" type="radio" name="accType" value="1" checked="checked">&nbsp;&nbsp;导航菜单
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<input id="accType" type="radio" name="accType" value="2">&nbsp;&nbsp;管理中心
				</c:if>
				<c:if test="${model.accType == '2' }">
					<input id="accType" type="radio" name="accType" value="1">&nbsp;&nbsp;导航菜单
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<input id="accType" type="radio" name="accType" value="2" checked="checked">&nbsp;&nbsp;管理中心
				</c:if>
			</div>
		</div>
		<div  class="f-div-row">
			<div class="f-div-label-c4"></div>
			<div class="f-div-input-c4"></div>
			
			<div class="f-div-label-c4"><label>描述:</label></div>
			<div class="f-div-input-c4">
				<textarea id="descp" name="descp" rows="3" cols="20">${model.descp }</textarea>
			</div>
		</div>
		
		<div class="f-div-btn">
			<input id="save" type="button" class="normal-btn" value=保存>&nbsp;&nbsp;
			<input type=reset class=normal-btn value=重置>&nbsp;&nbsp;
		</div>
		
	</form>
	
	
	<!-- 浮动窗体  授权授权  -->
	<div id="accessWindow" >
		
	</div>
	
	<!-- 浮动窗体  图标  -->
	<!-- <div id="imagesWindow" >
		<ul id="images"></ul>
	</div> -->
	
</div>
</div>
</body>
</html>


