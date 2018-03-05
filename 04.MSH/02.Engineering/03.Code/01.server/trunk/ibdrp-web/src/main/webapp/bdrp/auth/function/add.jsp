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
		url : '${ctx}/bdrp/auth/function/tree',
		method : "GET",
		required : false,
		formatter : function(node) {
			node.text = node.name;
			delete node.name;
			return node.text;
		}
	});
	$('#parent').combotree('setValue',parentId);
		
	// 返回功能主页面 
	$("#back").click(function(){
		$('.one-center-panel').load('${ctx}/bdrp/auth/function/main');
		$(".combo-p").remove();
		$(".window").remove();
		$(".window-shadow").remove();;
		$(".window-mask").remove();
		$(".c-ff-input-warning").remove();
		$(".pika-single").remove();
	}); 
	// 对名称添加焦点事件---判断是否输入，和名称是否重复
	$("#name").blur(function(){
		var name = $("#name").val();// 判断是否输入名称
		$.ajax({// Ajax异步提交，校验该名称是否已经存在
			type : "GET",
			url : "${ctx}/bdrp/auth/function/exist",
			data : {name:name},
			dataType : 'json',
			success : function(msg){
				if(msg.success){
					$("#repeat").hide();
				}else if(msg == "exist"){
					$("#repeat").show();
					$("#msg").hide();
					return ;
				}
			}
		});
	});
		
	// 保存功能信息----表单提交会跳转页面，所以使用Ajax异步提交，局部刷新
	$("#save").click(function(){
		$("#functionForm").form({
			url : "${ctx}/bdrp/auth/function/create",
			onSubmit : doCheck,
			success : function(msg){
				if(msg){
					$.messager.alert("提示","数据保存成功！","info");
					$('.one-center-panel').load('${ctx}/bdrp/auth/function/main');
					$(".combo-p").remove();
					$(".window").remove();
					$(".window-shadow").remove();;
					$(".window-mask").remove();
					$(".c-ff-input-warning").remove();
					$(".pika-single").remove();
				}
			}
		});
		$("#functionForm").submit();
	});
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
		url : "${ctx}/bdrp/auth/resource/system/uri",
		animate : true,
		method : "GET",
		lines : true,
		formatter : function(node) {
			node.text = node.text;
			node.id=node.uri;
			return node.text;
		}
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
		
}); 

function doCheck(){
	if($('#functionForm').check()==true){
		// Ajax异步提交，校验该名称是否已经存在
		var flag = true;
		var name = $("#name").val();
		if($.trim(name)==""){
			$("#repeat").hide();
			$("#msg").hide();
			$("#empty").show();
			return false;
		}
		$.ajax({
			type : "GET",
			url : "${ctx}/bdrp/auth/function/exist",
			async : false,
			data : "name="+name,
			dataType : 'json',
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
		<h3>功能新增</h3>
		<a id="back" href="#" class='box-icon-a icon-back' style='float:right ;vertical-align: middle;margin-right:20px;height: 20px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;返回</a>
	</div>
</div>
<div class="box-container" style="display:inline-block;">
	<form method='post' id='functionForm' name='functionForm' action='' >
		<%-- <!-- 隐藏标签，要添加子节点的ID -->
		<input type="hidden" id="funParent" name="parent.id" value="${parentFun.id }">
		<!-- 用于传递功能的父节点ID -->
		<input type="hidden" id="functionParent" name="parent.id"> --%>
		<input type="hidden" id="parentId" value="${parentId}">
		<div class="f-div-row">
			<div class="f-div-label-c4"><label>上级:</label></div>
			<div class="f-div-input-c4">
				<select id="parent" name="parent.id" style="width : 210px"></select>
			</div>
			<div class="f-div-label-c4"><label>名称<font color="red">&nbsp;*&nbsp;</font>:</label></div>
			<div class="f-div-input-c4">
				<input id="name" type="text" class=c-ff-input name="name" _nullable=false _nullablemsg=请填写名称  _maxlength=50 _maxlengthmsg='最大长度为50'>	<br/>
				<p id="msg" style="display : none;"><font color="red">* 功能名称必须填写</font></p>
				<p id="repeat" style="display : none;"><font color="red">* 该名称已存在,请重新填写!</font></p>
				<p id="empty" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
			</div>
		</div>
		<div  class="f-div-row">
			<div class="f-div-label-c4"><label>URI:</label></div>
			<div class="f-div-input-c4"><input id="uri" type="text" class=c-ff-input name="uri"></div>
			<div class="f-div-label-c4"><label>描述:</label></div>
			<div class="f-div-input-c4"><textarea id="desc" name="desc" rows="5" cols="20"></textarea></div>
		</div>
		
		<div class="f-div-btn">
			<input id="save" type="button" class="normal-btn" value=保存>&nbsp;&nbsp;
			<input type=reset class=normal-btn value=重置>&nbsp;&nbsp;
		</div>
		
	</form>
	
	<!-- 浮动窗体 class="easyui-window" -->
	<div  id="uriWindow">
		<div id="tt" class="easyui-tabs" data-options="fit:true, border:false">
			<div title="Action" >
				<ul id="treeAction"></ul>
			</div>
			<div title="页面" >
				
			</div>
		</div>
	</div>
</div>
</div>
</body>
</html>


