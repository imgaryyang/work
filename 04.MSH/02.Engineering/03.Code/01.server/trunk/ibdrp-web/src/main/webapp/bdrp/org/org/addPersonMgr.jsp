<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<link rel="stylesheet" type="text/css" href="${ctx}/jQuery/plugin/pikaday.css">
<script type="text/javascript" src="${ctx}/jQuery/plugin/pikaday.jquery.js"></script>
<title>新增组织机构</title>
<script type="text/javascript">
var htmlAddress = '';
htmlAddress += "<div class=f-div-row><div class=f-div-label-c4><label>省:</label></div><div class=f-div-input-c4><input type=text class=c-ff-input value=''  name=name></div><div class=f-div-label-c4><label>市:</label></div><div class=f-div-input-c4><input type=text class=c-ff-number name=status></div></div>";
htmlAddress += "<div  class=f-div-row><div class=f-div-label-c4><label>联系电话:</label></div><div class=f-div-input-c4><input type=text class=c-ff-input value=''  name=name></div><div class=f-div-label-c4><label>手机:</label></div><div class=f-div-input-c4><input type=text class=c-ff-number name=status></div></div>";
htmlAddress += "<div  class=f-div-row><div class=f-div-label-c4><label>联系电话1:</label></div><div class=f-div-input-c4><input type=text class=c-ff-input  name=name></div><div class=f-div-label-c4><label>手机1:</label></div><div class=f-div-input-c4><input type=text class=c-ff-number name=status></div></div>";
htmlAddress += "<div  class=f-div-row><div class=f-div-label-c4><label>邮政编码:</label></div><div class=f-div-input-c4><input type=text class=c-ff-input value=''  name=name></div><div class=f-div-label-c4><label>详细地址:</label></div><div class=f-div-input-c4><input type=text class=c-ff-number name=status></div></div>";
$(document).ready(function(){
	$('#address').append(htmlAddress);
});

function addAdress(){
	$('#address').append(htmlAddress);
}
</script>
</head>
<body>
<div class="box">
<div class="box-head">
	<div class="box-title">
		<h3>机构新增</h3>
		<a href='#' class='box-icon-a icon-back' style='float:right ;vertical-align: middle;margin-right:20px';height: 40px;>返回</a>
	</div>
</div>
<div class="box-container" style="display:inline-block;">
<form method='post' id='orgForm' name='orgForm' action='${ctx}/puborgauthz/saveOrg.do' onSubmit='return doCheck();'>
<div class="f-div-row">
	<div class="f-div-label-c4"><label>上级:</label></div>
	<div class="f-div-input-c4">
		<input id="parentId" class="fn-hide" name="parentid">
		<input id="parentName" class="c-ff-input c-ff-readonly" type="text" _nulllablemsg="请选择上级机构" _nulllabel="false" style="cursor:pointer;" _icons="clrBtn,icon-clear|selBtn,icon-d-arrow" name="parentName" readonly="readonly"> 
	</div>
	<div class="f-div-label-c4"><label>简称:</label></div>
	<div class="f-div-input-c4"><input type="text" class=c-ff-input name="shortName"></div>
</div>
<div  class="f-div-row">
	<div class="f-div-label-c4"><label>名称:</label></div>
	<div class="f-div-input-c4"><input type="text" class=c-ff-input name="name"></div>
	<div class="f-div-label-c4"><label>客户状态:</label></div>
	<div class="f-div-input-c4"><input type="text" class=c-ff-input name="status"></div>
</div>
<div  class="f-div-row">
	<div class="f-div-label-c4"><label>行业分类</label></div>
	<div class="f-div-input-c4"><input type="text" class=c-ff-input name="name"></div>
	<div class="f-div-label-c4"><label>营业执照:</label></div>
	<div class="f-div-input-c4"><input type="text" class=c-ff-input name="status"></div>
</div>
<div  class="f-div-row">
	<div class="f-div-label-c4"><label>英文名:</label></div>
	<div class="f-div-input-c4"><input type="text" class=c-ff-input name="name"></div>
	<div class="f-div-label-c4"><label>机构性质:</label></div>
	<div class="f-div-input-c4"><input type="text" class=c-ff-input name="status"></div>
</div>	
<div  class="f-div-row">
	<div class="f-div-label-c4"><label>机构地址:</label></div>
	<div class="f-div-input-c4"><input type="text" class=c-ff-input name="name"></div>
	<div class="f-div-label-c4"><label>签发地址:</label></div>
	<div class="f-div-input-c4"><input type="text" class=c-ff-input name="status"></div>
</div>	
<div  class=f-div-row>
	<div class="f-div-label-c4"><label>签发日期:</label></div>
	<div class=f-div-input-c4><input type="text" class=c-ff-date value=""  name="name"></div>
	<div class="f-div-label-c4"><label>失效日期:</label></div>
	<div class="f-div-input-c4"><input type="text" class=c-ff-date name="status"></div>
</div>	
<div  class="f-div-row">
	<div class="f-div-label-c4"><label>生效日期:</label></div>
	<div class="f-div-input-c4"><input type="text" class=c-ff-date name="name"></div>
	<div class="f-div-label-c4"><label>备注:</label></div>
	<div class="f-div-input-c4"><input type="text" class=c-ff-input name="status"></div>
</div>
<div  class=f-div-row>
	<div class="f-div-label-c4"><label>证件类型:</label></div>
	<div class=f-div-input-c4><input type="text" class=c-ff-input value=""  name="name"></div>
	<div class="f-div-label-c4"><label>证件号码:</label></div>
	<div class="f-div-input-c4"><input type="text" class=c-ff-number name="status"></div>
</div>

<div id="address"/>
<div class="f-div-btn">
	<input type="submit" class="normal-btn" value=保存>&nbsp;&nbsp;
	<input type=reset class=normal-btn value=重置>&nbsp;&nbsp;
	<input type="button" class="normal-btn" value=增加地址  onclick="addAdress()">
</div>
</form>
</div>
</div>
</body>
</html>


