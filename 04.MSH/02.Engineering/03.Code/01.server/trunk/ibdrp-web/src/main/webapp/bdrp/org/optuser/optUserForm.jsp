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
var htmlAddress = '';
htmlAddress += "<div id=cbBanks class=float-tp-holder><div class=float-tp-title-holder><a id=tp1 href='javascript:void(0)' class=float-tp-title-active>地址信息</a></div><div id=cbItems class=float-tp-item-holder><div id=tp1item >";
htmlAddress += "<div class=f-div-row><div class=f-div-label-c4><label>省:</label></div><div class=f-div-input-c4><input _maxlength=6 _maxlengthmsg=该项长度为6 id='province'  type=text class=c-ff-input value=''  name='model.province'></div><div class=f-div-label-c4><label>市:</label></div><div class=f-div-input-c4><input id='city'  _maxlength=6 _maxlengthmsg=该项长度为6 type=text class=c-ff-number name='model.city'></div></div>";
htmlAddress += "<div  class=f-div-row><div class=f-div-label-c4><label>联系电话:</label></div><div class=f-div-input-c4><input  _maxlength=50 _maxlengthmsg=该项长度为50 id='phone' type=text class=c-ff-input value=''  name='model.phone'></div><div class=f-div-label-c4><label>手机:</label></div><div class=f-div-input-c4><input id='mobile' _maxlength=50 _maxlengthmsg=该项长度为50 type=text class=c-ff-number name='model.mobile'></div></div>";
htmlAddress += "<div  class=f-div-row><div class=f-div-label-c4><label>联系电话1:</label></div><div class=f-div-input-c4><input _maxlength=50 _maxlengthmsg=该项长度为50 id='phone1' type=text class=c-ff-input  name='model.phone1'></div><div class=f-div-label-c4><label>手机1:</label></div><div class=f-div-input-c4><input id='mobile1' _maxlength=50 _maxlengthmsg=该项长度为50 type=text class=c-ff-number name='model.mobile1'></div></div>";
htmlAddress += "<div  class=f-div-row><div class=f-div-label-c4><label>邮政编码:</label></div><div class=f-div-input-c4><input _maxlength=6 _maxlengthmsg=该项长度为6 id='zip' type=text class=c-ff-input value=''  name='model.zip' ></div><div class=f-div-label-c4><label>详细地址:</label></div><div class=f-div-input-c4><input id='address' _maxlength=100 _maxlengthmsg=该项长度为100 type=text class=c-ff-number name='model.address'></div></div>";
htmlAddress += "</div></div></div>";
$(document).ready(function(){
	$.initSpecInput();
	
});
	
	
	// 返回功能主页面 
	function back(){
		var orgId = $('#orgId').val();
		var orgName=$('#orgName').val();
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
			url : "${ctx}/bdrp/org/optuser/create",
			onSubmit : check,
			dataType : 'json',
			success : function(data){
				data = $.parseJSON(data);
				//alert(data);
				if(data.success){
					$('.one-center-panel').load('${ctx}/bdrp/org/optuser/main?orgId='+orgId+'&orgName='+orgName);
					// ****防止页面DIV过多，造成缓慢**********
					$(".combo-p").remove();
					$(".window").remove();
					$(".window-shadow").remove();;
					$(".window-mask").remove();
					$(".c-ff-input-warning").remove();
				
					// ****防止页面DIV过多，造成缓慢**********

					$.messager.alert("提示","数据保存成功！","info");
				}else{
					$.messager.alert("提示","用户名重复，请重新输入！","info");
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
			<h3>操作人员新增</h3>
			<a href='#' class='box-icon-a icon-back' onclick='back();'
					style='float: right; vertical-align: middle; margin-right: 20px';height: 40px;>返回</a>
		</div>
	</div>
	<div class="box-container" style="display:inline-block;">
		<form method='post' id='optUserForm' name='optUserForm' action='' >
			<br>
			<!-- 登录账户类型  -->
			<input type="hidden" name="type">
			<%-- <input type="hidden" id="orgname" value="${orgname }">
			<input type="hidden" id="orgid" value="${orgid }"> --%>
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
						<input id="username" type="text" class=c-ff-input name="username"
						  _nullable=false  _nullablemsg=请填写用户名 _maxlength=100 _maxlengthmsg=该项长度为100><br/>
						<p id="usernamemsg" style="display : none;"><font color="red">* 用户名必须填写</font></p>
						<p id="emptyusername" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
						</div>
						<div class="f-div-label-c4"><label>姓名<font color="red">&nbsp;*&nbsp;</font>：</label></div>
						<div class="f-div-input-c4"><input id="name" type="text" class=c-ff-input name="name"
						 _nullable=false  _nullablemsg=请填写姓名 _maxlength=100 _maxlengthmsg=该项长度为100><br/>
						<p id="namemsg" style="display : none;"><font color="red">* 姓名必须填写</font></p>
						<p id="emptyname" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
						</div>
					</div>
					<div  class="f-div-row">
					<div class="f-div-label-c4"><label>手机号<font color="red">&nbsp;*&nbsp;</font>：</label></div>
						<div class="f-div-input-c4">
						<input id="mobile" type="text" class=c-ff-input name="mobile"
						  _nullable=false  _nullablemsg=请填写手机号 _maxlength=11 _maxlengthmsg=该项长度为11 _minlength=11 _minlengthmsg=该项长度为11><br/>
						<p id="mobilesg" style="display : none;"><font color="red">* 手机号必须填写</font></p>
						<p id="emptymobile" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
						</div>
						<div class="f-div-label-c4"><label>所属机构：</label></div>
						<div class="f-div-input-c4">
							<input id="orgName" type="text" class=c-ff-input name="orgName" _maxlength=100 _maxlengthmsg=该项长度为100 readonly="readonly" value="${param.orgName}">
							<input type="hidden" id="orgId"   name="orgId" value="${param.orgId}" >
						</div>
					</div>
					<div  class="f-div-row">
						<div class="f-div-label-c4"><label>电子邮箱：</label></div>
						<div class="f-div-input-c4"><input id="email" type="text" class=c-ff-input name="email" _maxlength=50 _maxlengthmsg=该项长度为50>	</div>
						<div class="f-div-label-c4"><label>其他联系方式：</label></div>
						<div class="f-div-input-c4"><input id="otherContactWay" type="text" class=c-ff-input name="otherContactWay" _maxlength=100 _maxlengthmsg=该项长度为100></div>
					</div>
					<div  class="f-div-row">
						<div class="f-div-label-c4"><label>状态：</label></div>
						<div class="f-div-input-c4">
							<input id="state" type="radio" class=c-ff-radio name="state" value="0" checked="checked" >&nbsp;&nbsp;启用&nbsp;&nbsp;&nbsp;&nbsp;
							<input id="state" type="radio" class=c-ff-radio name="state" value="1" >&nbsp;&nbsp;禁用
						</div>
					</div>
			<div id="address">
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


