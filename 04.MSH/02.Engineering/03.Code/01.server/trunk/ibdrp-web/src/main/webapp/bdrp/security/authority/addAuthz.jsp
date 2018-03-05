<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<title>新增授权</title>

<script type="text/javascript">
	$(document).ready(function(){
		$.initSpecInput();
		$('#parent').combotree({
			url : '${ctx}/puborgauthz/functionTree.do',
			required : false
		});
		
		
		// 返回功能主页面 
		$("#back").click(function(){
			$('.one-center-panel').load('${ctx}/puborgauthz/authzMain.ihp');
			// ****防止页面DIV过多，造成缓慢**********
			$(".combo-p").remove();
			$(".window").remove();
			$(".window-shadow").remove();;
			$(".window-mask").remove();
			
			$(".c-ff-input-warning").remove();
			$(".pika-single").remove();
			// ****防止页面DIV过多，造成缓慢**********
		}); 
		
		
		/* // 对名称添加焦点事件---判断是否输入，和名称是否重复
		$("#name").blur(function(){
			var name = $("#name").val();
			if(name == null || name.trim() == ""){
				$("#msg").show();
				$("#repeat").hide();
				$("#name").val("");	// 将输入框中的空格去掉
				return ;
			}else{
				$("#msg").hide();
			}
			
			// Ajax异步提交，校验该名称是否已经存在
			$.ajax({
				type : "POST",
				url : "${ctx}/puborgauthz/existNameAuthz.do",
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
		});
		
		
		// 保存功能信息----表单提交会跳转页面，所以使用Ajax异步提交，局部刷新
		$("#save").click(function(){
			
			// 对输入框名称进行校验
			var name = $("#name").val();
			if(name == null || name.trim() == ""){
				$("#msg").show();
				$("#repeat").hide();
				$("#name").val("");	// 将输入框中的空格去掉
				return ;
			}else{
				$("#msg").hide();
			}
			
			// Ajax异步提交，校验该名称是否已经存在
			$.ajax({
				type : "POST",
				url : "${ctx}/puborgauthz/existNameAuthz.do",
				data : "name="+name,
				success : function(msg){
					if(msg == "success"){
						$("#repeat").hide();
						// 获取树形下拉框中的 ID 值
						var comTree = $("#parentId").combotree('tree');
						var treeData = comTree.tree('getSelected');
						var parentId = "";
						// 判断是否选择节点
						if(treeData == null || treeData.id.trim() == ""){
							parentId = "";
							$("#msg2").show();
							return ;
						}else{
							parentId = treeData.id;
						}
						var uri = $("#uri").val();
						var desc = $("#desc").val();
						$('#authzForm').form('submit',{
							url : '${ctx}/puborgauthz/saveAuthz.do',
							success : function(data){
								$.messager.alert("提示","数据保存成功！","info");
								$('.right-panel').load('${ctx}/puborgauthz/authzMain.ihp');
							}
						});
					}else if(msg == "exist"){
						$("#repeat").show();
						$("#msg").hide();
						return ;
					}
				}
			});
		}); */
		//pub版验证非空和字段长度以及是否重复============================================================
		// 保存功能信息----表单提交会跳转页面，所以使用Ajax异步提交，局部刷新
		$("#save").click(function(){
			/* // 对父节点判断
			// 获取树形下拉框中的 ID 值
			var comTree = $("#parentId").combotree('tree');
			var treeData = comTree.tree('getSelected');
			var parentId = "";
			// 判断是否选择节点
			
			if(treeData == null || treeData.id.trim() == ""){
				parentId = "";
				$("#msg2").show();
				$("#empty").hide();
				return ;
			}else{
				parentId = treeData.id;
			} */
			// **********
			$("#authzForm").form({
				url : "${ctx}/puborgauthz/saveAuthz.do",
				onSubmit : doCheck,
				success : function(msg){
					if(msg == "success"){
						$.messager.alert("提示","数据保存成功！","info");
						$('.one-center-panel').load('${ctx}/puborgauthz/authzMain.ihp');
					}
				}
			});
			$("#authzForm").submit();
			// **********
		});
		function doCheck(){
			
			if($('#authzForm').check()==true){
				// Ajax异步提交，校验该名称是否已经存在
				var flag = true;
				
				var name = $("#name").val();
				if($.trim(name)==""){
					$("#repeat").hide();
					$("#msg").hide();
					$("#msg2").hide();
					$("#empty").show();
					return false;
					//flag = false;
				}
				$.ajax({
					type : "POST",
					url : "${ctx}/puborgauthz/existNameAuthz.do",
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
				return flag;
			}else{
				return false;
			}
		}
		
	}); 
</script>
</head>
<body>
<div class="box">
<div class="box-head">
	<div class="box-title">
		<h3>授权新增</h3>
		<a id="back" href="#" class='box-icon-a icon-back' style='float:right ;vertical-align: middle;margin-right:20px;height: 20px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;返回</a>
	</div>
</div>
<div class="box-container" style="display:inline-block; padding-left:50px; " >
	<form method='post' id='authzForm' name='authzForm' action='${ctx}/puborgauthz/saveAuthz.do' >
	
		<div class="f-div-label-c4"><label>名称<font color="red">&nbsp;*&nbsp;</font>:</label></div>
			<div class="f-div-input-c4">
				<input id="name" type="text" class=c-ff-input name="model.name" _nullable=false _nullablemsg=请填写名称  _maxlength=50 _maxlengthmsg='最大长度为50'>	<br/>
				<p id="msg" style="display : none;"><font color="red">* 名称必须填写</font></p>
				<p id="repeat" style="display : none;"><font color="red">* 该名称已存在,请重新填写!</font></p>
				<p id="empty" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
			</div>
		<div class="f-div-row">
			<div class="f-div-label-c4"><label>对应功能<font color="red">&nbsp;*&nbsp;</font>:</label></div>
			<div class="f-div-input-c4">
				<select id="parent" name="model.function.id" style="width : 210px"></select>
				<p id="msg2" style="display : none;"><font color="red">* 功能必须选择</font></p>
			</div>
		
		</div>
		<div  class="f-div-row">
			<div class="f-div-label-c4"><label>描述:</label></div>
			<div class="f-div-input-c4"><textarea id="desc" name="model.descp" rows="5" cols="20"></textarea></div>
		</div>
		
		<div class="f-div-btn" >
			<input id="save" type="button" class="normal-btn" value=保存>&nbsp;&nbsp;
			<input type=reset class=normal-btn value=重置>&nbsp;&nbsp;
		</div>
		
	</form>
	
</div>
</div>
</body>
</html>


