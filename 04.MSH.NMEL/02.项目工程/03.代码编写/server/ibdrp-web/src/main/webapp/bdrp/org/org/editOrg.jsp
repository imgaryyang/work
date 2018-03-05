<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<title>新增组织机构</title>

<script type="text/javascript">

	// ***************************
	$(document).ready(function(){
		$.initSpecInput();
		var parentId = $('#parentid').val();
		$('#parent').combotree({
			url : '${ctx}/bdrp/org/org/tree',
			required : false,
			method : "GET",
			formatter : function(node) {
				node.text = node.name;
				delete node.name;
				return node.text;
			}
		});
		$('#parent').combotree('setValue',parentId);
		// 返回功能主页面 
		$("#back").click(function(){
			$('.one-center-panel').load('${ctx}/bdrp/org/org/main');
			
			// ****防止页面DIV过多，造成缓慢**********
			$(".combo-p").remove();
			$(".window").remove();
			$(".window-shadow").remove();;
			$(".window-mask").remove();
			
			$(".c-ff-input-warning").remove();
			$(".pika-single").remove();
			// ****防止页面DIV过多，造成缓慢**********
		}); 
		$("#addPost").click(function(){
			var orgId = $('#orgId').val();
			$('.one-center-panel').load('${ctx}/bdrp/org/org/addPost/'+orgId);
			// ****防止页面DIV过多，造成缓慢**********
			$(".combo-p").remove();
			$(".window").remove();
			$(".window-shadow").remove();;
			$(".window-mask").remove();
			
			$(".c-ff-input-warning").remove();
			$(".pika-single").remove();
			// ****防止页面DIV过多，造成缓慢**********
		});
		$("#addDep").click(function(){
			var orgId = $('#orgId').val();
			$('.one-center-panel').load('${ctx}/bdrp/org/org/addDep/'+orgId);
			
		});
		
		// 保存机构信息----表单提交会跳转页面，所以使用Ajax异步提交，局部刷新
		$("#save").click(function(){
			/* // 对父节点判断
			// 获取树形下拉框中的 ID 值
			var comTree = $("#parentId").combotree('tree');
			// 如果选择了树形下拉框，那么treeData为Object，没选则为：null
			var treeData = comTree.tree('getSelected');
			var parentId = "";
			// 判断是否选择节点
			if(treeData == null){
				parentId = $("#orParent").val();
			}else if(treeData.id.trim() == ""){
				parentId = "";
			}else{
				parentId = treeData.id;
			}
			$("#orgParent").val(parentId); */
			
			
			
			// **********表单提交
			$("#orgForm").form({
				url : "${ctx}/bdrp/org/org/update",
				onSubmit : doCheck,
				dataType : 'json',
				method : 'PUT',
				success : function(msg){
					if(msg){
						$.messager.alert("提示","数据保存成功！","info");
						$('.one-center-panel').load('${ctx}/bdrp/org/org/main');
						
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
			$("#orgForm").submit();
			// **********
		});
		
	});
	
function doCheck(){
	var flag = false;
	$("#empty").hide();
	if($('#orgForm').check()==true){
		var name = $("#name").val();
		var id = $("#orgId").val();
		if($.trim(name)==""){
			$("#empty").show();
			return false;
			//flag = false;
		}
		$.ajax({
			type : "GET",
			url : "${ctx}/bdrp/org/org/exist",
			async : false,
			data : "name="+name+"&id="+id,
			dataType : 'json',
			success : function(msg){
				if(msg.success){
					$("#repeat").hide();
					flag = true;
					
				}else if(msg.msg == "exist"){
					$("#repeat").show();
					$("#msg").hide();
					flag = false;
				}
			},
			error : function(){
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
			<h3>机构新增</h3>
			
			<a id="back" href="#" class='box-icon-a icon-back' style='float:right ;vertical-align: middle;margin-right:20px;height: 20px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;返回</a>
			<a id="addDep" href="#" class='box-icon-a icon-back' style='float:right ;vertical-align: middle;margin-right:20px;height: 20px;'>新增部门</a>
			<a id="addPost" href="#" class='box-icon-a icon-back' style='float:right ;vertical-align: middle;margin-right:20px;height: 20px;'>新增职位</a>
		</div>
	</div>
	<div class="box-container" style="display:inline-block;">
		<form method='post' id='orgForm' name='orgForm' action=''>
			<br>
			<!-- 隐藏功能的ID -->
			<input type="hidden" id="orgId" name="id" value="${model.id }">
			<!-- 隐藏标签，要添加子节点的ID -->
			<input type="hidden" id="orParent" value="${model.parent.id }">
			<!-- 用于传递机构的父节点ID -->
			<input type="hidden" id="parentid" value="${model.parent.id }">
			
			<!-- 基本信息 -->
			<div id=cbBanks class=float-tp-holder>
				<div class=float-tp-title-holder>
					<a id=tp1 href='javascript:void(0)' class=float-tp-title-active>基本信息</a>
				</div>
				<div id=cbItems class=float-tp-item-holder>
				<div id="tp1item" >
					<div class="f-div-row">
						<div class="f-div-label-c4"><label>上级:</label></div>
						<div class="f-div-input-c4">
							<select id="parent" name="parent.id" style="width : 210px"></select>
						</div>
						<div class="f-div-label-c4"><label>简称:</label></div>
						<div class="f-div-input-c4"><input id="shortName" type="text" class=c-ff-input _maxlength=20 _maxlengthmsg='最大长度为20' name="shortName" value="${model.shortName }"></div>
					</div>
					<div  class="f-div-row">
						<div class="f-div-label-c4"><label>名称<font color="red">&nbsp;*&nbsp;</font>:</label></div>
						<div class="f-div-input-c4">
							<input id="name"" type="text" class=c-ff-input _nullable=false _nullablemsg=请填写名称 name="name" value="${model.name }">	
							<p id="msg" style="display : none;"><font color="red">* 功能名称必须填写</font></p>
							<p id="repeat" style="display : none;"><font color="red">* 该名称已存在,请重新填写!</font></p>
							<p id="empty" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
						</div>
						<div class="f-div-label-c4"><label>客户状态:</label></div>
						<div class="f-div-input-c4"><input id="status" type="text" class=c-ff-input _maxlength=1 _maxlengthmsg='最大长度为1' name="status" value="${model.status }"></div>
					</div>
					<div  class="f-div-row">
						<div class="f-div-label-c4"><label>行业分类</label></div>
						<div class="f-div-input-c4"><input id="categry" type="text" class=c-ff-input _maxlength=50 _maxlengthmsg='最大长度为50' name="categry" value="${model.categry }"></div>
						<div class="f-div-label-c4"><label>营业执照:</label></div>
						<div class="f-div-input-c4"><input id="licnum" type="text" class=c-ff-input _maxlength=50 _maxlengthmsg='最大长度为50' name="licnum" value="${model.licnum }"></div>
					</div>
					<div  class="f-div-row">
						<div class="f-div-label-c4"><label>英文名:</label></div>
						<div class="f-div-input-c4"><input id="enName" type="text" class=c-ff-input _maxlength=50 _maxlengthmsg='最大长度为50' name="enName" value="${model.enName }"></div>
						<div class="f-div-label-c4"><label>机构性质:</label></div>
						<div class="f-div-input-c4"><input id="type" type="text" class=c-ff-input _maxlength=50 _maxlengthmsg='最大长度为50' name="type" value="${model.type }"></div>
					</div>
					<div  class="f-div-row">
						<div class="f-div-label-c4"></div>
						<div class="f-div-input-c4"></div>
						<div class="f-div-label-c4"><label>机构地址:</label></div>
						<div class="f-div-input-c4"><input id="visaAddress" type="text" class=c-ff-input _maxlength=100 _maxlengthmsg='最大长度为100' name="visaAddress" value="${model.visaAddress }"></div>
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
						<div class="f-div-label-c4"><label>签发日期:</label></div>
						<div class=f-div-input-c4><input id="visaDate" type="text" class="c-ff-date" name="visaDate" value="${model.visaDate }"/></div>
						<div class="f-div-label-c4"><label>失效日期:</label></div>
						<div class="f-div-input-c4"><input id="expirDate" type="text" class="c-ff-date" name="expirDate" value="${model.expirDate }"/></div>
					</div>	
					<div  class="f-div-row">
						<div class="f-div-label-c4"><label>生效日期:</label></div>
						<div class="f-div-input-c4">
							<input id="effectDate" type="text" class="c-ff-date" name="effectDate" value="${model.effectDate }"/>
						</div>
						<div class="f-div-label-c4"><label>签发机构地址:</label></div>
						<div class="f-div-input-c4"><input id="visaAddress" type="text" class=c-ff-input _maxlength=100 _maxlengthmsg='最大长度为100' name="visaAddress" value="${model.visaAddress }"></div>
					</div>
					<div  class=f-div-row>
						<div class="f-div-label-c4"><label>证件类型:</label></div>
						<div class=f-div-input-c4>
							<c:if test="${model.idType == '' }">
								<select id="idType" class=c-ff-select name="idType">
									<option value="" selected="selected"></option>
									<option value="1">营业执照</option>
									<option value="2">许可证</option>
								</select>
							</c:if>
							<c:if test="${model.idType == '1' }">
								<select id="idType" class=c-ff-select name="idType">
									<option value=""></option>
									<option value="1" selected="selected">营业执照</option>
									<option value="2">许可证</option>
								</select>
							</c:if>
							<c:if test="${model.idType == '2' }">
								<select id="idType" class=c-ff-select name="idType">
									<option value=""></option>
									<option value="1">营业执照</option>
									<option value="2" selected="selected">许可证</option>
								</select>
							</c:if>
						</div>
						<div class="f-div-label-c4"><label>证件号码:</label></div>
						<div class="f-div-input-c4"><input id="idNo" type="text" class=c-ff-number _maxlength=18 _maxlengthmsg='最大长度为18' name="idNo" value="${model.idNo }"></div>
					</div>
					<div  class="f-div-row">
						<div class="f-div-label-c4"></div>
						<div class="f-div-input-c4"></div>
						<div class="f-div-label-c4"><label>备注:</label></div>
						<div class="f-div-input-c4">
							<textarea id="memo" _maxlength=500 _maxlengthmsg='最大长度为500' name="memo" rows="3" cols="10">${model.memo }</textarea>
						</div>
					</div>
				</div>
				</div>
			</div>
			<div class="f-div-btn">
				<input id="save" type="button" class="normal-btn" value=保存>&nbsp;&nbsp;
				<input type=reset class=normal-btn value=重置>&nbsp;&nbsp;
			</div>
		</form>
	</div>
</div>
</body>
</html>


