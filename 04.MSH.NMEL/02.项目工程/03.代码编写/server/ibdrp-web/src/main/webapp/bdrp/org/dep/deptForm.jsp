<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<title>新增部门</title>
<script type="text/javascript">
$(document).ready(function(){
	$.initSpecInput();
	$(".combo-p").remove();
	$(".window").remove();
	$(".window-shadow").remove();;
	$(".window-mask").remove();
	$(".c-ff-input-warning").remove();
	
	var orgId = $('#orgId').val();
	
	var parentId = $('#parentid').val();
	$('#parent').combotree({
		url : '${ctx}/bdrp/org/dep/tree',
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
		var orgId = $('#orgId').val();
		var orgName = $('#orgName').val();
		$(".combo-p").remove();
		$(".window").remove();
		$(".window-shadow").remove();;
		$(".window-mask").remove();
		$(".c-ff-input-warning").remove();
		$('.one-center-panel').load('${ctx}/bdrp/org/dep/main');
	}); 
	
	$('#saveBtn').click(function(){
		var orgId = $('#orgId').val();
		var code = $('#code').val();
		$('#deptForm').form('submit',{
			url : '${ctx}/bdrp/org/dep/create',
			onSubmit : doCheck,
			dataType : 'json',
			success : function(msg){
				if(msg){
					$.messager.alert("提示","数据保存成功！","info");
					$('.one-center-panel').load('${ctx}/bdrp/org/dep/main');
					
					// ****防止页面DIV过多，造成缓慢**********
					$(".combo-p").remove();
					$(".window").remove();
					$(".window-shadow").remove();;
					$(".window-mask").remove();
					
					$(".c-ff-input-warning").remove();
					$(".pika-single").remove();
				}
			},
			error : function(){
				alert("保存失败！");
			}
		});
	});
	
});
function doCheck(){
	if($('#deptForm').check() == true){
		var name = $('#name').val();
		var orgId = $('#orgId').val();
		var flag = true;
		$.ajax({
			type : "GET",
			async: false,
			url : "${ctx}/bdrp/org/dep/exist",
			data : {name:name,orgId:orgId},
			dataType : 'json',
			success : function(msg){
				if(msg.msg == "exist"){
					$("#repeat").show();
					$("#msg").hide();
					flag = false;
				}else if(msg.success){
					$("#repeat").hide();
					flag = true;
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
		<h3>部门新增</h3>
		<a id="back"  href="#" class='box-icon-a icon-back' style='float:right ;vertical-align: middle;margin-right:20px;height: 20px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;返回</a>
	</div>
</div>
<div class="box-container" >
	<form method='post' id='deptForm' name='deptForm' action=''>
		<input type="hidden" id="orgId" name="org.id" value="${model.id}">
		<input type="hidden" id="parentid" value="${parentid}">
		<table class=f-tab width=100% border=0 cellspacing=0 cellpadding=0>
			<tr class=f-tab-row>
				<td class=f-tab-col-label><label>上级：</label></td>
				<td class=f-tab-col-input>
				<select id="parent" name="parent.id" style="width : 210px"></select>
				</td>
			</tr>
				<tr class=f-tab-row-sep>
				<td class=f-tab-col-label><label>名称<span>*</span>：</label></td>
				<td class=f-tab-col-input>
				<input type=text id=name name=name class='c-ff-input' _nullable=false _nullablemsg=请填写名称>
				<p id="msg" style="display : none;"><font color="red">* 功能名称必须填写</font></p>
				<p id="repeat" style="display : none;"><font color="red">* 该名称已存在,请重新填写!</font></p>
				</td>
			</tr>
			<tr class=f-tab-row>
				<td class=f-tab-col-label><label >编号<span>*</span>：</label></td>
				<td class=f-tab-col-input>
				<input type=text id=code name=code class='c-ff-input' _nullable=false _nullablemsg=请填写编号>
				</td>
			</tr>
				<tr class=f-tab-row-sep>
				<td class=f-tab-col-label><label>描述：</label></td>
				<td class=f-tab-col-input>
				<textarea class='c-ff-textarea' id=description name=description></textarea>
				</td>
			</tr>
			<tr class=f-tab-row/f-tab-row-sep>
				<td class=f-tab-col-label>&nbsp;</td>
				<td class=f-tab-col-input>
				<input id=saveBtn type=button class=normal-btn value=保存 >&nbsp;&nbsp;
				<input id=cancelBtn type=reset class=normal-btn value=重置>
				</td>
			</tr>
		</table>
	</form>
</div>
</div>
</body>
</html>


