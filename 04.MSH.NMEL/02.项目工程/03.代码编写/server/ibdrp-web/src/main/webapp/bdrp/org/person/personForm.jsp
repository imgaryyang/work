<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<link rel="stylesheet" type="text/css" href="${cdnserver}/jQuery/plugin/pikaday.css">
<script type="text/javascript" src="${cdnserver}/jQuery/plugin/pikaday.jquery.js"></script>
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
//	$('#address').append(htmlAddress);
	$.initSpecInput();
	
	var orgId = $('#orgId').val();
	
	
	

//	$('#dep').combotree('setValue',parentId);
	
});
function addAdress(){
	$('#address').append(htmlAddress);
}
	$(document).ready(function(){
		$.initSpecInput();
	}); 
	
	
	// 返回功能主页面 
	function back(){
		$('.one-center-panel').load('${ctx}/bdrp/org/person/main');
		// ****防止页面DIV过多，造成缓慢**********
		$(".combo-p").remove();
		$(".window").remove();
		$(".window-shadow").remove();;
		$(".window-mask").remove();
		$(".c-ff-input-warning").remove();
	
		// ****防止页面DIV过多，造成缓慢**********
	}
	$("#orgWin").window({
		title : "选择机构",
		width : 500,
		height : 450,
		collapsible : false,
		minimizable : false,
		maximizable : false,
		closed : true,
		modal : true,
		resizable : false
		
	});  
	$('#orgGrid').click(function(){
		$("#orgGrid").val("");
		$('#gridOrg').treegrid({
			url : '${ctx}/bdrp/org/org/tree',
			idField : 'id',
			treeField: 'name',
			columns:[[
				{title : '名称',field : 'name',width : '150'},
				{title : '简称',field : 'shortName',width:'150'},
				{title : '机构号',field : 'brcCode',width:'130'}
			]],
			
				striped : true,
				singleSelect : false,
				queryParams : {
					start : '0',
					limit : '10'
				},
				method : 'get',
				loadFilter : pagerOrgFilter,
		//		fitColumns : true,
				pagination : true, //分页低栏
				rownumbers : true, //显示行号列
				pageSize : 10,
				pageList : [5,10,15,20],
				onBeforeLoad : loadorgChildren,
				onDblClickRow : orgClick
			});
		$("#orgWin").window('open');
	});
	
	
	function loadorgChildren(row) {
		if (row) {
			$('#gridOrg').treegrid('options').url = '${ctx}/bdrp/org/org/tree?parentid=' + row.id;
		}
	}
	
	function pagerOrgFilter(data) {
		$('#gridOrg').treegrid('options').url = '${ctx}/puborgauthz/rootOrgList.do';
		$('#gridOrg').treegrid('getPager').pagination({
			onSelectPage : function(pageNum, pageSize) {
				$('#gridOrg').treegrid('options').pageNumber = pageNum;
				$('#gridOrg').treegrid('options').pageSize = pageSize;
				$('#gridOrg').treegrid('getPager').pagination('refresh', {
					pageNumber : pageNum,
					pageSize : pageSize
				});
				var startNum = (pageNum - 1) * pageSize;
				var name = $('#orgName').val();
				$('#gridOrg').treegrid('reload', {
					start : startNum,
					limit : pageSize,
					name:name
				});
			}
		});
		return data;
	}
	$('#oid').val(row.id);
	$('#orgGrid').val(row.name);
	$('#dep').combotree({    
	    url: '${ctx}/puborgauthz/combotreeDep.do?oid='+row.id
	}); 
	function orgClick(row){
		$('#oid').val(row.id);
		$('#orgGrid').val(row.name);
		$('#post').val("");
		$('#dep').val("");
		$('#station').val("");
		$('#dep').combotree({
			url : '${ctx}/bdrp/org/dep/tree?oid='+row.id,
			method : "GET",
			required : false,
			formatter : function(node) {
				node.text = node.name;
				delete node.name;
				return node.text;
			}
		});
		
		$('#post').combotree({
			url : '${ctx}/bdrp/org/post/tree?oid='+row.id,
			method : "GET",
			required : false,
			formatter : function(node) {
				node.text = node.name;
				delete node.name;
				return node.text;
			}
		});
		$("#orgmsg").hide();
		$("#orgWin").window('close');
	}
	function search(){
		var name = $('#orgName').val();
		$('#gridOrg').treegrid('options').url = '${ctx}/bdrp/org/org/list';
		$('#gridOrg').treegrid('reload',{start:'0',limit:'10',name:name});
	}
	
	// 保存机构信息----表单提交会跳转页面，所以使用Ajax异步提交，局部刷新
	/*function onSubmit(){
		
	
		 //对名称的判断以及对机构名称的判断
		var name = $("#name").val();
		var orgname = $("#orgGrid").val();
		if(name == null || name.trim() == ""){
			alert("name");
			$("#namemsg").show();
			$("#name").val("");	// 将输入框中的空格去掉
			return ;
		}
		if(orgname == null || orgname.trim() == ""){
			alert("orgname");
			$("#orgmsg").show();
			return ;
		}
		if(name.trim().length>0 &&  orgname.trim().length>0){
			$("#personForm").form({
				url : "${ctx}/puborgauthz/savePerson.do",
				success : function(msg){
					if(msg == "success"){
						$.messager.alert("提示","数据保存成功！","info");
						$('.right-panel').load('${ctx}/puborgauthz/personMain.ihp');
					}
				}
			});
			$("#personForm").submit();
		} 
	}*/
	function check(){
		if($('#personForm').check() == true){
			var username = $("#username").val();
			var name = $("#name").val();
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
		var orgname=$("#orgname").val();
		var orgid=$("#orgid").val();
		$('#personForm').form('submit',{
			url : "${ctx}/bdrp/org/person/create",
			onSubmit : check,
			success : function(data){
				if(data){
					$.messager.alert("提示","数据保存成功！","info");
					$('.one-center-panel').load('${ctx}/bdrp/org/person/main');
					// ****防止页面DIV过多，造成缓慢**********
					$(".combo-p").remove();
					$(".window").remove();
					$(".window-shadow").remove();;
					$(".window-mask").remove();
					$(".c-ff-input-warning").remove();
				
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
			<h3>人员新增</h3>
			<a href='#' class='box-icon-a icon-back' onclick='back();'
					style='float: right; vertical-align: middle; margin-right: 20px';height: 40px;>返回</a>
		</div>
	</div>
	<div class="box-container" style="display:inline-block;">
		<form method='post' id='personForm' name='personForm' action='' >
			<br>
			<!-- 登录账户类型  -->
			<input type="hidden" name="type">
			<input type="hidden" id="orgname" value="${orgname }">
			<input type="hidden" id="orgid" value="${orgid }">
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
						  _nullable=false  _nullablemsg=请填写用户名 _maxlength=50 _maxlengthmsg=该项长度为50><br/>
						<p id="usernamemsg" style="display : none;"><font color="red">* 用户名必须填写</font></p>
						<p id="emptyusername" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
						</div>
						<div class="f-div-label-c4"><label>密码<font color="red">&nbsp;*&nbsp;</font>：</label></div>
						<div class="f-div-input-c4">
						<input id="password" type="password" class=c-ff-input name="password"
						  _nullable=false  _nullablemsg=请登录密码 _maxlength=50 _maxlengthmsg=该项长度为10><br/>
						<p id="usernamemsg" style="display : none;"><font color="red">* 用户名必须填写</font></p>
						<p id="emptyusername" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
						</div>
						
						<div class="f-div-label-c4"><label>名称<font color="red">&nbsp;*&nbsp;</font>：</label></div>
						<div class="f-div-input-c4"><input id="name" type="text" class=c-ff-input name="name"
						 _nullable=false  _nullablemsg=请填写名称 _maxlength=50 _maxlengthmsg=该项长度为50><br/>
						<p id="namemsg" style="display : none;"><font color="red">* 名称必须填写</font></p>
						<p id="emptyname" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
						</div>
					</div>
					<div  class="f-div-row">
						<div class="f-div-label-c4"><label>英文名：</label></div>
						<div class="f-div-input-c4"><input id="enName" type="text" class=c-ff-input name="enName" _maxlength=50 _maxlengthmsg=该项长度为50>	</div>
						<div class="f-div-label-c4"><label>简称：</label></div>
						<div class="f-div-input-c4"><input id="shortName" type="text" class=c-ff-input name="shortName" _maxlength=20 _maxlengthmsg=该项长度为20></div>
					</div>
					<div  class="f-div-row">
						<div class="f-div-label-c4"><label>所属机构<font color="red">&nbsp;*&nbsp;</font>：</label></div>
						<div class="f-div-input-c4">
						<input type="text" id="orgGrid"   class=c-ff-input  _nullable=false  _nullablemsg=请填写所属机构 readonly=true><br/>
						<p id="orgmsg" style="display : none;"><font color="red">* 机构必须填写</font></p>
							<input type="hidden" id="oid"   name="oid.id" >
							</div>
						<div class="f-div-label-c4"><label>部门：</label></div>
						<div class="f-div-input-c4">
						<!-- <input id="dep" type="text" class=c-ff-input name="model.dep.id"> -->
						<select id="dep" name="dep.id" style="width:225px">
						<option>请选择所属机构...</option>
						</select>
						</div>
					</div>
					<div  class="f-div-row">
						<div class="f-div-label-c4"><label>岗位：</label></div>
						<div class="f-div-input-c4">
						<!-- <input id="station" type="text" class=c-ff-input name="model.station.id"> -->
						<select id="station" name="station.id" style="width:225px">
						<option>请选择所属机构...</option>
						</select>
						</div>
						<div class="f-div-label-c4"><label>职位：</label></div>
						<div class="f-div-input-c4">
						<!-- <input id="post" type="text" class=c-ff-input name="model.post.id"> -->
						<select id="post" name="post.id" style="width:225px">
						<option>请选择所属机构...</option>
						</select>
						</div>
					</div>
					<div  class="f-div-row">
						<div class="f-div-label-c4"><label>是否激活：</label></div>
						<div class="f-div-input-c4">
						<input id="active" type="radio" class=c-ff-radio name="active" value="0" checked="checked" >&nbsp;&nbsp;是&nbsp;&nbsp;&nbsp;&nbsp;
						<input id="active" type="radio" class=c-ff-radio name="active" value="1" >&nbsp;&nbsp;否
						</div>
						<div class="f-div-label-c4"><label>是否过期：</label></div>
						<div class="f-div-input-c4">
						<input id="expired" type="radio" class=c-ff-radio name="expired" value="0" >&nbsp;&nbsp;是&nbsp;&nbsp;&nbsp;&nbsp;
						<input id="expired" type="radio" class=c-ff-radio name="expired" value="1" checked="checked">&nbsp;&nbsp;否
						</div>
					</div>
					<div  class="f-div-row">
						<div class="f-div-label-c4"><label>出生日期：</label></div>
						<div class="f-div-input-c4">
						<input id="bornDate" type="text" class=c-ff-date name="bornDate"/></div>
						
						
						<div class="f-div-label-c4"><label>性别：</label></div>
						<div class="f-div-input-c4">
						<input id="sex" type="radio" class="c-ff-radio" name="sex" value="1" checked="checked" >&nbsp;&nbsp;男&nbsp;&nbsp;&nbsp;&nbsp;
						<input id="sex" type="radio" class="c-ff-radio" name="sex" value="0" >&nbsp;&nbsp;女
						</div>
						</div>
					</div>
				</div>
				</div>
			
			
			<!-- 扩展信息 -->
			<div id=cbBanks class=float-tp-holder>
				<div class=float-tp-title-holder>
					<a id=tp1 href='javascript:void(0)' class=float-tp-title-active>扩展信息</a>
				</div>
				<div id=cbItems class=float-tp-item-holder>
				<div id="tp1item" >
					
					<div  class=f-div-row>
						<div class="f-div-label-c4"><label>签发日期：</label></div>
						<div class=f-div-input-c4><input id="visaDate" type="text" class="c-ff-date" name="visaDate"/></div>
						<div class="f-div-label-c4"><label>失效日期：</label></div>
						<div class="f-div-input-c4"><input id="expirDate" type="text" class="c-ff-date" name="expirDate"/></div>
					</div>	
					<div  class="f-div-row">
						<div class="f-div-label-c4"><label>生效日期：</label></div>
						<div class="f-div-input-c4">
							<input id="effectDate" type="text" class="c-ff-date" name="effectDate"/>
						</div>
						<div class="f-div-label-c4"><label>签发机构地址：</label></div>
						<div class="f-div-input-c4"><input _maxlength=100 _maxlengthmsg=该项长度为100 id="visaAddress" type="text" class=c-ff-input name="visaAddress"></div>
					</div>
					<div  class="f-div-row">
						<div class="f-div-label-c4"><label>民族：</label></div>
						<div class="f-div-input-c4">
							<select id="folk" class=c-ff-select name="folk">
								<option value=""></option>
								<option value="01">汉族</option>
								<option value="02">少数名族</option>
							</select>
						</div>
						<div class="f-div-label-c4"><label>最高学历：</label></div>
						<div class="f-div-input-c4"><input _maxlength=50 _maxlengthmsg=该项长度为50  id="eduLevel" type="text" class=c-ff-input name="eduLevel"></div>
					</div>
					<div  class="f-div-row">
						<div class="f-div-label-c4"><label>出生地：</label></div>
						<div class="f-div-input-c4">
							<input id="homePlace" type="text" _maxlength=50 _maxlengthmsg=该项长度为50 class=c-ff-input name="homePlace">
						</div>
						<div class="f-div-label-c4"><label>婚姻状况：</label></div>
						<div class="f-div-input-c4"><input _maxlength=1 _maxlengthmsg=该项长度为1 id="marrStatus" type="text" class=c-ff-input name="marrStatus"></div>
					</div>
					<div  class=f-div-row>
						<div class="f-div-label-c4"><label>证件类型：</label></div>
						<div class=f-div-input-c4>
							<select id="idType" class=c-ff-select name="idType">
								<option value=""></option>
								<option value="1">身份证</option>
								<option value="2">军人证</option>
							</select>
							<!-- 
							<input id="idType" type="text" class=c-ff-input name="model.idType">
							 -->
						</div>
						<div class="f-div-label-c4"><label>证件号码：</label></div>
						<div class="f-div-input-c4"><input _maxlength=18 _maxlengthmsg=该项长度为18 id="idNo" type="text" class=c-ff-number name="idNo"></div>
					</div>
					<div  class="f-div-row">
						
						<div class="f-div-label-c4"><label>客户状态：</label></div>
						<div class="f-div-input-c4"><input _maxlength=1 _maxlengthmsg=该项长度为1 id="status" type="text" class=c-ff-input name="status"></div>
						<div class="f-div-label-c4"></div>
						<div class="f-div-input-c4"></div>
					</div>
				</div>
				</div>
			</div>
			
				
		<!-- <div id=cbBanks class=float-tp-holder>
		<div class=float-tp-title-holder>
			<a id=tp1 href='javascript:void(0)' class=float-tp-title-active>地址信息</a>
		</div>
		<div id=cbItems class=float-tp-item-holder>
		<div id=tp1item >
			<div class=f-div-row>
				<div class=f-div-label-c4><label>省：</label></div>
				<div class=f-div-input-c4><input id="province" type=text class=c-ff-input  name="model.province"></div>
				<div class=f-div-label-c4><label>市：</label></div>
				<div class=f-div-input-c4><input id="city" type=text class=c-ff-input name="model.city"></div>
			</div>
			<div  class=f-div-row>
				<div class=f-div-label-c4><label>联系电话：</label></div>
				<div class=f-div-input-c4><input id="phone" type=text class=c-ff-input   name="model.phone"></div>
				<div class=f-div-label-c4><label>手机：</label></div>
				<div class=f-div-input-c4><input id="mobile" type=text class=c-ff-number name="model.mobile"></div>
			</div>
			<div  class=f-div-row>
				<div class=f-div-label-c4><label>联系电话1：</label>	</div>
				<div class=f-div-input-c4><input id="phone1" type=text class=c-ff-input  name="model.phone1"></div>
				<div class=f-div-label-c4><label>手机1：</label></div>
				<div class=f-div-input-c4><input id="mobile1" type=text class=c-ff-number name="model.mobile1"></div>
			</div>
			<div  class=f-div-row>
				<div class=f-div-label-c4><label>邮政编码：</label></div>
				<div class=f-div-input-c4><input id="zip" type=text class=c-ff-number   name="model.zip"></div>
				<div class=f-div-label-c4><label>详细地址：</label></div>
				<div class=f-div-input-c4><input id="address" type=text class=c-ff-input name="model.address"></div>
			</div>
		</div>
		</div>
		</div> -->
			<div id="address">
			</div>
			<div class="f-div-btn">
				<input type="button" class="normal-btn" value=保存 onclick="onSubmit();">&nbsp;&nbsp;
				<input type=reset class=normal-btn value=重置>&nbsp;&nbsp;
				<input type="button" class="normal-btn" value=增加地址  onclick="addAdress()">
			</div>
		</form>
	</div>
</div>
<div id="orgWin">
		<div id="toolbar" align="right">
			<table cellspacing=0 cellpadding=0 >
			<tbody>
			<tr>
			<td>名称：<input type="text" id="orgName" class="c-ff-input-nowidth normal-height" ></td>
			<td>&nbsp;</td>
			<td><a href="javascript:search()" class="l-btn l-btn-small l-btn-plain">
				<span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">检索</span><span class="l-btn-icon icon-search">&nbsp;</span></span>
				</a>&nbsp;&nbsp;</td>
			</tr>
			</tbody>
			</table>
		</div>
		<table id="gridOrg">
		</table>
</div>
</body>
</html>


