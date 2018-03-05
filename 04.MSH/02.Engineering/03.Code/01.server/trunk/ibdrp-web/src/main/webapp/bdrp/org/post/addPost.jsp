<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<title>新增职位管理</title>
<script type="text/javascript">
	$(document).ready(function(){
		$.initSpecInput();
		var parentId = $('#parentId').val();
		$('#parentId').combotree({
			url : '${ctx}/bdrp/org/post/tree',
			method : "GET",
			required : false,
			formatter : function(node) {
				node.text = node.name;
				delete node.name;
				return node.text;
			}
		});
		$('#parentId').combotree('setValue',parentId);
		// 返回功能主页面 
		$("#back").click(function(){
			var oid=$("#oid").val();
			var orgName=$("#oName").val();
			$('.one-center-panel').load('${ctx}/bdrp/org/post/main');

			// ****防止页面DIV过多，造成缓慢**********
			$(".combo-p").remove();
			$(".window").remove();
			$(".window-shadow").remove();;
			$(".window-mask").remove();
			$(".c-ff-input-warning").remove();
			$(".pika-single").remove();
			// ****防止页面DIV过多，造成缓慢**********
		}); 
		
		
	});
	 // 对名称添加焦点事件---判断是否输入
	function checkName2(){
		var oid=$("#oid").val();
		var name = $("#name").val();
		$.ajax({
			type : "GET",
//			async: false,
			url : "${ctx}/bdrp/org/post/exist",
			data : {name:name,oid:oid},
			dataType : 'json',
			success : function(data,response){
				if(data == "false"){
					$("#name2").show();
				}else {
					$("#name2").hide();
				}
			}
		});	
	} 
	// 对名称添加焦点事件---判断是否输入
	function checkName(){
		
		var oid=$("#oid").val();
		var name = $("#name").val();
		var code = $("#code").val();
		if($('#postForm').check() == true){
			$("#name2").hide();
			$("#emptyname").hide();
			$("#emptycode").hide();
			if($.trim(name)==""&&$.trim(code)!=""){
				$("#name2").hide();
				$("#emptyname").show();
				$("#emptycode").hide();
				return false;
				//flag = false;
			}
			if($.trim(code)==""&&$.trim(name)!=""){
				$("#emptycode").show();
				$("#emptyname").hide();
				return false;
				//flag = false;
			}
			if($.trim(code)==""&&$.trim(name)==""){
				$("#emptycode").show();
				$("#emptyname").show();
				return false;
				//flag = false;
			}
			var flag = true;
			$.ajax({
				type : "GET",
				async: false,
				url : "${ctx}/bdrp/org/post/exist",
				data : {name:name,oid:oid},
				dataType : 'json',
				success : function(data,response){
					if(data == "false"){
						$("#name2").show();
						$("#emptyname").hide();
						flag = false;
					}else {
						$("#name2").hide();
						flag = true;
					}
				},
				error : function(){
					flag = false;
				}
			});
			return flag;
		}else{
			return false;
		}
	}
	// ************  提交成功之前的校验以及提交  ***********
	function onSubmit(){
		/* 
		 // 对父节点判断
		// 获取树形下拉框中的 ID 值
		var comTree = $("#parentId").combotree('tree');
		// 如果选择了树形下拉框，那么treeData为Object，没选则为：null
		var treeData = comTree.tree('getSelected');
		var parentId = "";
		// 判断是否选择节点
		if(treeData == null){
			parentId = $("#meParent").val();
		}else if(treeData.id.trim() == ""){
			parentId = "";
		}else{
			parentId = treeData.id;
		}
		$("#menuParent").val(parentId);  */
		var oid=$("#oid").val();
		var oName=$("#oName").val();
		$('#postForm').form('submit',{
			url : '${ctx}/bdrp/org/post/create',
			onSubmit : checkName,
			dataType : 'json',
			success : function(data){
				if(data){
					$.messager.alert("提示","数据保存成功！","info");
					$('.one-center-panel').load(
					'${ctx}/bdrp/org/post/main?orgId='+oid+'&orgName='+oName);
					// ****防止页面DIV过多，造成缓慢**********
					$(".combo-p").remove();
					$(".window").remove();
					$(".window-shadow").remove();;
					$(".window-mask").remove();
					$(".c-ff-input-warning").remove();
					$(".pika-single").remove();
					// ****防止页面DIV过多，造成缓慢**********
				}
			},
			error : function(){
				$.messager.alert("提示","修改失败！","info");
			}
		});

	}
	
	
</script>
</head>
<body>
<div class="box">
<div class="box-head">
	<div class="box-title">
		<h3>职位新增</h3>
		<a id="back" href="#" class='box-icon-a icon-back' style='float:right ;vertical-align: middle;margin-right:20px;height: 20px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;返回</a>
	</div>
</div>
<div class="box-container" style="display:inline-block;">
	<form method='post' id='postForm' name='postForm' action='${ctx}/bdrp/org/post/postMgr.ihp?orgId=${oid }' >
		
		
		<div class="f-div-row">
			<div class="f-div-label-c4"><label>上级:</label></div>
			<div class="f-div-input-c4">
				<select id="parentId" name="parent.id" style="width: 210px;"></select>
			</div>
	
			<div class="f-div-label-c4"><label>名称<font color="red">&nbsp;*&nbsp;</font>：</label></div>
			<div class="f-div-input-c4">
				<input  type="text" class=c-ff-input name="name" 
				onblur="checkName2();" id="name" _nullable=false  _nullablemsg=请填写职位名称 _maxlength=50 _maxlengthmsg=该项长度为50>	<br/>
		
				<p id="name2" style="display : none;"><font color="red">* 该名称已存在,请重新填写!</font></p>
				<p id="emptyname" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
			</div>
		</div>
		<div  class="f-div-row">
			<div class="f-div-label-c4"><label>编号<font color="red">&nbsp;*&nbsp;</font>：</label></div>
			<div class="f-div-input-c4">
				<input id="code" type="text" class=c-ff-input name="code"  _nullable=false  _nullablemsg=请填写编号 _maxlength=50 _maxlengthmsg=该项长度为50>
			<br>
			<p id="emptycode" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
			</div>
		
			<div class="f-div-label-c4"><label>描述：</label></div>
			<div class="f-div-input-c4">
				<textarea id="descp" name="description" rows="3" cols="20" _maxlength=255 _maxlengthmsg=该项长度为255></textarea>
			</div>
		</div>
		<input type="hidden" name="org.id" value="${model.id }" id="oid" >
		<input type="hidden" name=orgId value="${model.id }" id="orgId" >
		<input type="hidden"  value="${oName }" id="oName" >
		<input type="hidden" id="parentId" value="${param.parentId}">
		<div class="f-div-btn">
			<input id="save" type="button" class="normal-btn" value=保存 onclick="onSubmit(); ">&nbsp;&nbsp;
			<input type=reset class=normal-btn value=重置>&nbsp;&nbsp;
		</div>
		
	</form>
	
	
	<!-- 浮动窗体  授权服务  -->
	<div id="serviceWindow" >
		
	</div>
	
	
</div>
</div>
</body>
</html>


