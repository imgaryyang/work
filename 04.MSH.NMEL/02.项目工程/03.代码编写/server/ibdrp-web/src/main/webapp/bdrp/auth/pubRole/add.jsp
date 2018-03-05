<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<title>新增公共角色</title>
<style type="text/css">
.box-icon-a {
	display: inline;
	padding-left: 13px;
	background-repeat: no-repeat;
	background-position: 1px 50%;
}
</style>
<script type="text/javascript">
	$(document).ready(function() {
		//初始化需要做输入校验的输入域
		$.initSpecInput();
		// ****防止页面DIV过多，造成缓慢**********
		$(".combo-p").remove();
		$(".window").remove();
		$(".window-shadow").remove();;
		$(".window-mask").remove();
		$(".c-ff-input-warning").remove();
		$(".pika-single").remove();
		// ****防止页面DIV过多，造成缓慢******
	});
	function back() {
		$('.one-center-panel').load('${ctx}/puborgauthz/roleMain.ihp');

	}

	 // 对名称添加焦点事件---判断是否输入
	function checkName2(){
		var name = $("#name").val();
		$.ajax({
			type : "POST",
//			async: false,
			url : "${ctx}/puborgauthz/checkName.do",
			data : {name:name},
			dataType : 'html',
			success : function(data,response){
				if(data == "false"){
					$("#msg").hide();
					$("#repeat").show();
				}else{
					$("#msg").hide();
					$("#repeat").hide();
				}
			}
		});	
	} 
	
	function checkName(){
		var name = $("#name").val();
		if($('#roleForm').check() == true){
			var flag = true;
			if($.trim(name)==""){
				$("#repeat").hide();
				$("#msg").hide();
				$("#empty").show();
				return false;
				//flag = false;
			}
			$.ajax({
				type : "POST",
				async: false,
				url : "${ctx}/puborgauthz/checkName.do",
				data : {name:name},
				dataType : 'html',
				success : function(data,response){
					if(data == "false"){
						$("#msg").hide();
						$("#repeat").show();
						//$.messager.alert("提示","部门名称重复,请重新填写！","info");
						flag = false;
					}else if(data == "true"){
						$("#msg").hide();
						$("#repeat").hide();
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
		/* if (name.trim().length > 0) {
			$.post('${ctx}/puborgauthz/checkName.ihp', {
				"name" : name,
				"id" : ''
			}, function(res) {
				if (res == "false") {
					$("#msg").hide();
					$("#repeat").show();
					
				} else {
					$("#roleForm").form({
						url : "${ctx}/puborgauthz/saveRole.do",
						success : function(msg){
						//	alert(msg);
							if(msg == "success"){
								$.messager.alert("提示","数据保存成功！","info");
								$('.right-panel').load(
								'${ctx}/puborgauthz/roleMain.ihp');
							}
						}
					});
					$("#roleForm").submit();
				}
			});
		} else {
			$("#msg").show();
			$("#repeat").hide();

		} */
		
	}
	function onSubmit(){
		$('#roleForm').form('submit',{
			url : '${ctx}/puborgauthz/saveRole.do',
			onSubmit : checkName,
			success : function(data){
				if(data == "success"){
					$.messager.alert("提示","数据保存成功！","info");
					$('.one-center-panel').load(
					'${ctx}/puborgauthz/roleMain.ihp');
					// ****防止页面DIV过多，造成缓慢**********
					$(".combo-p").remove();
					$(".window").remove();
					$(".window-shadow").remove();;
					$(".window-mask").remove();
					$(".c-ff-input-warning").remove();
					$(".pika-single").remove();
					// ****防止页面DIV过多，造成缓慢******
				}
			},
			error : function(){
			
				$.messager.alert("提示","数据保存失败！","info");
			}
		});
	};

</script>
</head>
<body>
		<div class=box>
		<div class=box-head>
			<div class='box-title'>
					<h3>公共角色新增</h3>
					<a href='#' class='box-icon-a icon-back' onclick='back();'
						style='float:right ;vertical-align: middle;margin-right:20px';height: 40px;>返回</a>
				</div>
			</div>
		
<div class="box-container" style="display:inline-block;">
<form method='post' id='roleForm' name='roleForm' action='' >

<div  class="f-div-row">
	<div class="f-div-label-c4"><label>名称：<font color="red">&nbsp;*&nbsp;</font>:</label></div>
	<div class="f-div-input-c4"><input type="text"  id="name" class=c-ff-input name="model.name" 
	class='c-ff-input' _nullable=false  _nullablemsg=请填写角色名称 onblur="checkName2();" _maxlength=50   _maxlengthmsg=该项长度为50>
	<br/>
				<p id="msg" style="display : none;"><font color="red">* 角色名称必须填写</font></p>
				<p id="repeat" style="display : none;"><font color="red">* 该名称已存在,请重新填写!</font></p>
				<p id="empty" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
			</div>
	
	<div class="f-div-label-c4"><label>描述：</label></div>
	<div class="f-div-input-c4">
	
	<textarea id="descp" name="model.descp" rows="3" cols="20" _maxlength=255 _maxlengthmsg=该项长度为255></textarea>
	</div>
</div>

<div class="f-div-btn">
	<input type="button" class="normal-btn" value=保存 onclick="onSubmit(); ">&nbsp;&nbsp;
	<input type=reset class=normal-btn value=重置>&nbsp;&nbsp;
</div>
</form>
</div> 
		</div>

</body>
</html>


