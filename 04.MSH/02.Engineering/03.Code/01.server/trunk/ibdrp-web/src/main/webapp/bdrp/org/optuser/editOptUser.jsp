<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<title>新增人员</title>

<style type="text/css">
.box-icon-a {
	display: inline;
	padding-left: 13px;
	background-repeat: no-repeat;
	background-position: 1px 50%;
}
</style>
<script type="text/javascript">



$(document).ready(function(){
		$.initSpecInput();
	}); 
	
	// 返回功能主页面 
	function back(){
		var orgId = $('#orgId').val();
		var orgName = $('#orgName').val();
		$('.one-center-panel').load('${ctx}/bdrp/org/optuser/main?orgId='+orgId+'&orgName='+orgName);
		// ****防止页面DIV过多，造成缓慢**********
		$(".combo-p").remove();
		$(".window").remove();
		$(".window-shadow").remove();;
		$(".window-mask").remove();
		$(".c-ff-input-warning").remove();
	
		// ****防止页面DIV过多，造成缓慢**********
	}
	function check(){
		if($('#optUserForm').check() == true){
			var username = $("#username").val();
			var name = $("#name").val();
			var mobile = $("#mobile").val();
			
			if($.trim(mobile)==""){
				$("#emptymobile").show();
			}
			if($.trim(name)==""&&$.trim(username)!=""){
				
				$("#emptyusername").hide();
				$("#emptyname").show();
				return false;
				//flag = false;
			}
			if($.trim(username)==""&&$.trim(name)!=""){
				$("#emptyname").hide();
				
				$("#emptyusername").show();
				return false;
				//flag = false;
			}
			if($.trim(username)==""&&$.trim(name)==""){
				$("#emptyname").show();
				
				$("#emptyusername").show();
				return false;
				//flag = false;
			}
			return true;
		}else{
			return false;
		}
	}
	function onSubmit(){
		var orgName=$("#orgName").val();
		var orgId=$("#orgId").val();
		$('#optUserForm').form('submit',{
			url : '${ctx}/bdrp/org/optuser/update',
			onSubmit : check,
			//dataType : 'json',
			method : 'POST',
			success : function(data){
				if(data ){
					$.messager.alert("提示","数据保存成功！","info");
					$('.one-center-panel').load('${ctx}/bdrp/org/optuser/main?orgId='+orgId+'&orgName='+orgName);
					// ****防止页面DIV过多，造成缓慢**********
					$(".combo-p").remove();
					$(".window").remove();
					$(".window-shadow").remove();;
					$(".window-mask").remove();

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
			<h3>操作人员编辑</h3>
			<a href='#' class='box-icon-a icon-back' onclick='back();'
					style='float: right; vertical-align: middle; margin-right: 20px';height: 40px;>返回</a>
		</div>
	</div>
	<div class="box-container" style="display:inline-block;">
		<form method='post' id='optUserForm' name='optUserForm' action='' >
			</br>
			<input type="hidden" name="id" value="${model.id }">
			<%-- <input type="hidden" id="orgname" value="${orgname }">
			<input type="hidden" id="orgid" value="${orgid }">
			<!-- 登录账户类型  -->
			<input type="hidden" name="model.type" value="${model.type }"> 
			
			<!-- 判断是否点击 部门 -->
			<input type="hidden" name="deptid" id="deptid" value="${model.dep.id }" >
			<!-- 判断是否点击职位 -->
			<input type="hidden" name="postid" id="postid" value="${model.post.id }">
			<!-- 判断是否点击职位 -->
			<input type="hidden" name="password" id="password" value="${model.password }"> --%>
			<!-- 基本信息 -->
			<div id=cbBanks class=float-tp-holder>
				<div class=float-tp-title-holder>
					<a id=tp1 href='javascript:void(0)' class=float-tp-title-active>基本信息</a>
				</div>
				<div id=cbItems class=float-tp-item-holder>
				<div id="tp1item" >
					<div class="f-div-row">
						<div class="f-div-label-c4"><label>用户名<font color="red">&nbsp;*&nbsp;</font>：</label></div>
						<div class="f-div-input-c4">
						<input id="username" type="text" class=c-ff-input name="username" value="${model.username }" readonly="readonly"
						_nullable=false  _nullablemsg=请填写用户名 _maxlength=100 _maxlengthmsg=该项长度为100><br/>
						<p id="usernamemsg" style="display : none;"><font color="red">* 用户名必须填写</font></p>
						<p id="emptyusername" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
						</div>
						<div class="f-div-label-c4"><label>姓名<font color="red">&nbsp;*&nbsp;</font>：</label></div>
						<div class="f-div-input-c4"><input id="name" type="text" class=c-ff-input name="name" value="${model.name }"
						 _nullable=false  _nullablemsg=请填写姓名 _maxlength=100 _maxlengthmsg=该项长度为100><br/>
						<p id="namemsg" style="display : none;"><font color="red">* 姓名必须填写</font></p>
						<p id="emptyname" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
						</div>
					</div>
					<div  class="f-div-row">
					<div class="f-div-label-c4"><label>手机号<font color="red">&nbsp;*&nbsp;</font>：</label></div>
						<div class="f-div-input-c4">
						<input id="mobile" type="text" class=c-ff-input name="mobile"  value="${model.mobile }"
						  _nullable=false  _nullablemsg=请填写手机号 _maxlength=11 _maxlengthmsg=该项长度为11 _minlength=11 _minlengthmsg=该项长度为11><br/>
						<p id="mobilesg" style="display : none;"><font color="red">* 手机号必须填写</font></p>
						<p id="emptymobile" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
						</div>
					<div class="f-div-label-c4"><label>所属机构：</label></div>
						<div class="f-div-input-c4">
						<input id="orgName" type="text" class=c-ff-input name="orgName" _maxlength=100 _maxlengthmsg=该项长度为100 readonly="readonly" value="${model.org.name}">
							<input type="hidden" id="orgId"   name="orgId" value="${model.org.id}">
						</div>
					</div>
					 <div  class="f-div-row">
					 	<div class="f-div-label-c4"><label>电子邮箱：</label></div>
						<div class="f-div-input-c4"><input id="email" type="text" class=c-ff-input name="email" value="${model.email}" _maxlength=50 _maxlengthmsg=该项长度为50>	</div>
						<div class="f-div-label-c4"><label>其他联系方式：</label></div>
						<div class="f-div-input-c4"><input id="otherContactWay" type="text" class=c-ff-input name="otherContactWay" value="${model.otherContactWay }" _maxlength=100 _maxlengthmsg=该项长度为100></div>
					</div> 
					<div class="f-div-label-c4">
					<label>状态：</label></div>
						<div class="f-div-input-c4">
						<c:if test="${model.state.equals('0') }">
							<input id="state" type="radio" class=c-ff-radio name="state" value="0" checked="checked">&nbsp;&nbsp;启用&nbsp;&nbsp;&nbsp;&nbsp;
							<input id="state" type="radio" class=c-ff-radio name="state" value="1" >&nbsp;&nbsp;禁用
						</c:if>
						<c:if test="${model.state.equals('1') }">
							<input id="state" type="radio" class=c-ff-radio name="state" value="0" >&nbsp;&nbsp;启用&nbsp;&nbsp;&nbsp;&nbsp;
							<input id="state" type="radio" class=c-ff-radio name="state" value="1" checked="checked">&nbsp;&nbsp;禁用
						</c:if>	
					</div>
				</div>
				</div>
			</div>
			
			<div class="f-div-btn">
				<input type="button" class="normal-btn" value=保存 onclick="onSubmit();">&nbsp;&nbsp;
				<input type=reset class=normal-btn value=重置>&nbsp;&nbsp;
			</div>
		</form>
	</div>
</div>
</body>
</html>


