<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<title>编辑职位管理</title>
<script type="text/javascript">
	$(document).ready(function(){
		$.initSpecInput();
		var parentId = $('#parentId').val();
		$('#parent').combotree({
			url : '${ctx}/bdrp/org/post/tree',
			required : false,
			method : "GET",
			required : false,
			formatter : function(node) {
				node.text = node.name;
				delete node.name;
				node.state = "closed";
				return node.text;
			}
		});
		
		$('#parent').combotree('setValue',parentId);
		// 返回功能主页面 
		$("#back").click(function(){
			var oid=$("#oid").val();
			var orgname=$("#oname").val();
			$('.one-center-panel').load('${ctx}/bdrp/org/post/main');
			// ****防止页面DIV过多，造成缓慢**********
			$(".combo-p").remove();
			$(".window").remove();
			$(".window-shadow").remove();;
			$(".window-mask").remove();
			$(".c-ff-input-warning").remove();
			$(".pika-single").remove();
			// ****防止页面DIV过多，造成缓慢******
		}); 
		
		forLinkedUsersPub('0', '5', '${model.id }');
		
		
		// 打开添加浮动框
		$('#addPerson').click(function(){
			var name = $('#method').val();
			var pid = $('#meId').val();
			var oid = "${model.org.id }" ;
			$('#personList').window({    
			    title: '用户信息',    
			    width : 600,
				height :600,
				collapsible : false,
				minimizable : false,
				maximizable : false,
				closed : true,
				modal : true,
				resizable : false,  
			    href: '${ctx}/bdrp/org/post/toLinkPerson',
			    queryParams : {id : pid,start : '0',pageSize : '10',oid: oid,pname: name}
			});  
			$('#personList').window('open');
		}); 
		
	});
	//浮动框的全选
	function clickSCB(){
		//判断是否被选中
		var bischecked=$("#serviceCB").is(':checked');
		var service=$('input[name="checkService"]');
		bischecked ? service.attr('checked',true):service.attr('checked',false);
	}
	//获取浮动框的数据并保存服务
	function saveLinkService(){
		
		var sids='';
		$('input[name="checkService"]:checked').each(function(){
			sids="'"+$(this).val()+"',"+sids;
		});
		if(sids.length>0){
			 $.get('${ctx}/bdrp/org/post/saveLinkPerson?uIds='+sids+'&rId='+"${model.id }",
					 function(res){
							$.messager.alert("提示","用户添加成功！","info");
							$('#personList').window('close');
							forLinkedUsersPub('0', '5', '${model.id }');
			}); 
		}else{
			$.messager.alert("提示","用户未选择，请选择用户！","info");
		}
		
	} 
	//关闭浮动框
	function closeWin(){
		$('#personList').window('close');
	}
	//重新加载浮动框
	 function reloadPersonList(id,oid){
		var name = $('#pname').val();
		var url='${ctx}/bdrp/org/post/toLinkPerson?id='
			+id+ '&pname='+name+'&start='+0+'&pageSize='+10+'&oid='+oid;

		$('#personList').window('refresh',url);  
		
	}
	//重新加载浮动框----翻页
	function reloadPerson(start,limit,id,oid){
		var name = $('#pname').val();
		var url='${ctx}/bdrp/org/post/postLinkedUsers?id='
			+id+'&oid='+oid + '&pname='+name+'&start='+start+'&limit='+limit;
		$('#personList').window('refresh', url); 
	} 
	
	/****** 由于部门，岗位，职位 这个三个数据出现bug现在先不填充  ******/
	//包含的用户分页
	function forLinkedUsersPub(start, limit, id) {
		$("#content").empty();
		$.ajax({url : '${ctx}/bdrp/org/post/postLinkedUsers?limit='+ limit + '&start=' + start + '&id=' + id,
				type : 'get',
				data : '',
				dataType : 'json',
				success : function(data) {
					var rows = "<table class='l1-tab' ><thead><tr><th class='l1-col-info' width='100px;'>名称</th><th class='l1-col-info' width='80px;'>性别</th><th class='l1-col-info' width='100px;'>部门</th><th class='l1-col-info' width='100px;'>职位</th><th class='l1-col-info' width='100px;'>操作</th></tr></thead>";
					$.each(data.data.result,function(index, service) {	
						rows = rows + "<tr><td class='l1-col-info' width='100px;'>"+ service.name + "</td>";
						if(service.sex==1){
							rows = rows + "<td class='l1-col-info' width='80px;'>男 </td>";
						}else{
							rows = rows + "<td class='l1-col-info' width='80px;'>女 </td>";
						}
						<%--
						var deptname="";
						$.each(service.deps,function(index, dept){
							deptname=deptname+dept.name+",";
						});
						deptname=deptname.substring(0, deptname.length-1);
						//deptname=deptname.su
						var postname="";
						$.each(service.main,function(index, post){
							postname=postname+post.name+",";
						});
						postname=postname.substring(0, postname.length-1);
						--%>
						
						rows = rows + "<td class='l1-col-info' width='100px;'>"+"kong"+"</td>";
						rows = rows + "<td class='l1-col-info' width='100px;'> "+"kong"+"</td>";
						
						rows = rows + "<td class='l1-col-info' width='100px;'> <a href='#'  onclick=delPerson('" + service.id + "','" + id+ "'); >删除 </a> </td></tr>";
					});
					rows = rows + "</table>";
					rows = rows + "<div class=turn-page align='center'>";
					if (data.data.start >= data.data.pageSize) {
						rows = rows+ "<a href='#'  onclick=forLinkedUsersPub('"+ (data.data.start - data.data.pageSize) + "','"+ data.data.pageSize + "','" + id+ "');>上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
					}
					if ((data.data.totalCount - data.data.start) > data.data.pageSize) {
						rows = rows+ "<a href='#'  onclick=forLinkedUsersPub('"+ (data.data.start + data.data.pageSize) + "','"+ data.data.pageSize + "','" + id+ "');>下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
					}
					rows = rows+ "&nbsp;&nbsp;&nbsp;&nbsp;"+ (1 + data.data.start / data.data.pageSize)+ "&nbsp;页&nbsp;&nbsp;&nbsp;&nbsp;共&nbsp;<font>"+ data.data.total+ "</font>&nbsp;条记录</div>";
	
					
					$("#content").append(rows);
				}
			});

	}
	//删除用户
	function delPerson(pid, rid) {
		pid = "'" + pid + "'";
		$.get('${ctx}/bdrp/org/post/deletekPerson', {
			"uIds" : pid,
			"rId" : rid
		}, function(res) {
				$.messager.alert("提示","用户删除成功！","info");
				forLinkedUsersPub('0', '5', '${model.id }');
		});

	}
	
	
	 // 对名称添加焦点事件---判断是否输入
	function checkName2(){
		var oid=$("#oid").val();
		var name = $("#name").val();
		var id=$("#meId").val();
		$.ajax({
			type : "GET",
//			async: false,
			url : "${ctx}/bdrp/org/post/exist",
			data : {name:name,oid:oid,id:id},
			dataType : 'json',
			success : function(data,response){
				if(msg.success){
					$("#name2").show();
				}else {
					$("#name2").hide();
				}
			}
		});	
	} 
	// 对名称添加焦点事件---判断是否输入
	function checkName(){
		var id=$("#meId").val();
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
				data : {name:name,oid:oid,id:id},
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
		
		/* // 对父节点判断
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
		$("#menuParent").val(parentId); */
		var oid=$("#oid").val();
		var oname=$("#oname").val();
		$('#postForm').form('submit',{
			url : '${ctx}/bdrp/org/post/update',
			onSubmit : checkName,
			method : "POST",
			dataType : 'json',
			success : function(data){
				if(data){
					$.messager.alert("提示","数据保存成功！","info");
					$('.one-center-panel').load(
					'${ctx}/bdrp/org/post/main?orgId='+oid+'&orgname='+oname);
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
		<h3>职位修改</h3>
		<a id="back" href="#" class='box-icon-a icon-back' style='float:right ;vertical-align: middle;margin-right:20px;height: 20px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;返回</a>
	</div>
</div>
<div class="box-container" style="display:inline-block;">
	<form method='post' id='postForm' name='postForm' action='' >
		<!-- 隐藏功能的ID -->
		<input type="hidden" id="meId" name="id" value="${model.id }">
		<!-- 用户判断编码是否改变 -->
		<input type="hidden" id="meCode" name="meCode" value="${model.code }">
		<!-- 隐藏标签，功能的父节点ID -->
		<%-- <input type="hidden" id="meParent" name="parent.id" value="${model.parent.id }"> --%>
		<!-- 用于传递功能的父节点ID -->
		<input type="hidden" name="org.id" value="${model.org.id}" id="oid" >
		<input type="hidden"  value="${model.org.name }" id="oname" >
		<input type="hidden" id="parentId" value="${model.parent.id }">
		<div class="f-div-row">
			<div class="f-div-label-c4"><label>上级:</label></div>
			<div class="f-div-input-c4">
				<select id="parent" name="parent.id" style="width:210px"></select>
			</div>
		
			<div class="f-div-label-c4"><label>名称<font color="red">&nbsp;*&nbsp;</font>：</label></div>
			<div class="f-div-input-c4">
				<input  type="text" class=c-ff-input name="name" id="name" value="${model.name }"
				onblur="checkName2();" _nullable=false  _nullablemsg=请填写职位名称 _maxlength=50 _maxlengthmsg=名称长度超长>	<br/>
				
				<p id="name2" style="display : none;"><font color="red">* 该名称已存在,请重新填写!</font></p>
				<p id="emptyname" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
			</div>
		</div>
		<div  class="f-div-row">
			<div class="f-div-label-c4"><label>编号<font color="red">&nbsp;*&nbsp;</font>：</label></div>
			<div class="f-div-input-c4">
				<input id="code" type="text" class=c-ff-input name="code"  value="${model.code }" 
				 _nullable=false  _nullablemsg=请填写编号 _maxlength=50 _maxlengthmsg=名称长度超长><br>
				 <p id="emptycode" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
				
			</div>
		
			<div class="f-div-label-c4"><label>描述：</label></div>
			<div class="f-div-input-c4">
				<textarea id="descp" name="description" rows="3" cols="20"
				_maxlength=255 _maxlengthmsg=名称长度超长>${model.description}</textarea>
			</div>
		</div>
		
		<div id=cbBanks class=float-tp-holder>
			<div class=float-tp-title-holder>
				<a id=tp1 href='javascript:void(0)' class=float-tp-title-active>包含用户</a>
				<div class=float-right>
					<a id="addPerson" href="#" class='box-icon-a'>添加用户</a>
				</div>
			</div>
		</div>
			<!-- 填充的数据	 -->
				
		<div id="content" style="margin: 0px;">
					
		</div>

		<div class="f-div-btn">
			<input id="save" type="button" class="normal-btn" value=保存 onclick="onSubmit(); ">&nbsp;&nbsp;
			<input type=reset class=normal-btn value=重置>&nbsp;&nbsp;
		</div>
		
	</form>
	
	
		<div id="personList" class="easyui-window" closed="true"/>
	
	
</div>
</div>
</body>
</html>


