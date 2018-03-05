<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<link rel="stylesheet" type="text/css" href="${ctx}/jQuery/plugin/pikaday.css">
<script type="text/javascript" src="${ctx}/jQuery/plugin/pikaday.jquery.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx }/jQuery/easyui-1.3.6/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="${ctx }/jQuery/easyui-1.3.6/themes/icon.css">
<script type="text/javascript" src="${ctx }/jQuery/easyui-1.3.6/scripts/jquery.easyui.min.js"></script>

<title>修改角色</title>
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
		
		//分页数据加载
		forLinkedUsersPub('0', '5', '${role.id }');
		// **************浮动窗   start****************
		
		// 打开添加浮动框
		$('#addPerson').click(function(){
			var name = $('#method').val();
			$('#personList').window({    
			    title: '用户信息',  
			    top:100,
			    left:350,
			    width: 600,    
			    height: 500,  
				closed : true,
				cache : false,
				closable:false,
				collapsible:false,
				minimizable:false,
				maximizable:false,
			    href: '${ctx}/puborgauthz/toLinkUserList.ihp',
			    queryParams : {id : '${role.id }',start : '0',limit : '10',oid: '${oid}',pname: name},
				modal: true
			});  
			$('#personList').window('open');
		}); 
	
		
		
	});
	function back() {
		var oid=$("#oid").val();
		var orgname=$("#orgName").val();
		
		$('.one-center-panel').load('${ctx}/puborgauthz/authzRole.ihp?orgId='+oid+"&orgname="+orgname);

	}
	
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
			 $.post('${ctx}/puborgauthz/linkToUser.ihp',{"uIds":sids,"rId":"${role.id }"},
					 function(res){
						if (res == "success") {
							$.messager.alert("提示","用户添加成功！","info");
							$('#personList').window('close');
							forLinkedUsersPub('0', '5', '${role.id }');
						}
			}); 
		}else{
			$.messager.alert("提示","用户未选择，请选择服务！","info");
		}
		
	}
	//关闭浮动框
	function closeWin(){
		$('#personList').window('close');
	}
	//重新加载浮动框
	 function reloadPersonList(id,oid){
		var name = $('#pname').val();
		var url='${ctx}/puborgauthz/toLinkUserList.ihp?id='
			+id+ '&pname='+name+'&start='+0+'&limit='+10+'&oid='+oid;

		$('#personList').window('refresh',url);  
		
	}
	//重新加载浮动框----翻页
	function reloadPerson(start,limit,id,oid){
		var name = $('#pname').val();
		var url='${ctx}/puborgauthz/toLinkUserList.ihp?id='
			+id+'&oid='+oid + '&pname='+name+'&start='+start+'&limit='+limit;
		$('#personList').window('refresh', url); 
	} 
	
	/****** 由于部门，岗位，职位 这个三个数据出现bug现在先不填充  ******/
	//包含的用户分页
	function forLinkedUsersPub(start, limit, id) {
		$("#content").empty();
		$.ajax({url : '${ctx}/puborgauthz/linkedUsers.ihp?limit='+ limit + '&start=' + start + '&rId=' + id,
				type : 'post',
				data : '',
				dataType : 'json',
				success : function(data) {
					var rows = "<table class='l1-tab' ><thead><tr><th class='l1-col-info' width='100px;'>名称</th><th class='l1-col-info' width='80px;'>性别</th><th class='l1-col-info' width='100px;'>部门</th><th class='l1-col-info' width='100px;'>职位</th><th class='l1-col-info' width='100px;'>岗位</th><th class='l1-col-info' width='100px;'>操作</th></tr></thead>";
					$.each(data.result,function(index, service) {							
						rows = rows + "<tr><td class='l1-col-info' width='100px;'>"+ service.name + "</td>";
						if(service.sex==1){
							rows = rows + "<td class='l1-col-info' width='80px;'>男 </td>";
						}else{
							rows = rows + "<td class='l1-col-info' width='80px;'>女 </td>";
						}
						var deptname="";
						$.each(service.deps,function(index, dept){
							deptname=deptname+dept.name+",";
						});
						deptname=deptname.substring(0, deptname.length-1);
						//deptname=deptname.su
						var postname="";
						$.each(service.posts,function(index, post){
							postname=postname+post.name+",";
						});
						postname=postname.substring(0, postname.length-1);
						var stationname="";
						$.each(service.stations,function(index, station){
							stationname=stationname+station.name+",";
						});
						stationname=stationname.substring(0, stationname.length-1);
						rows = rows + "<td class='l1-col-info' width='100px;'>"+deptname+"</td>";
						rows = rows + "<td class='l1-col-info' width='100px;'> "+postname+"</td>";
						rows = rows + "<td class='l1-col-info' width='100px;'>"+stationname+" </td>";	
						rows = rows + "<td class='l1-col-info' width='100px;'> <a href='#'  onclick=delPerson('" + service.id + "','" + id+ "'); >删除 </a> </td></tr>";
					});
					rows = rows + "</table>";
					rows = rows + "<div class=turn-page align='center'>";
					/* if (data.start < data.limit) {
						rows = rows+ "<a href='#'  onclick=forLinkedUsersPub('"+ data.start + "','" + data.limit + "','"+ id+ "');>上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
					} */
					if (data.start >= data.limit) {
						rows = rows+ "<a href='#'  onclick=forLinkedUsersPub('"+ (data.start - data.limit) + "','"+ data.limit + "','" + id+ "');>上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
					}
					if ((data.totalCount - data.start) > data.limit) {
						rows = rows+ "<a href='#'  onclick=forLinkedUsersPub('"+ (data.start + data.limit) + "','"+ data.limit + "','" + id+ "');>下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
					}
					/* if ((data.totalCount - data.start) <= data.limit) {
						rows = rows+ "<a href='#'  onclick=forLinkedUsersPub('"+ data.start + "','" + data.limit + "','"+ id+ "');>下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
					} */
					rows = rows+ "&nbsp;&nbsp;&nbsp;&nbsp;"+ (1 + data.start / data.limit)+ "&nbsp;页&nbsp;&nbsp;&nbsp;&nbsp;共&nbsp;<font>"+ data.totalCount+ "</font>&nbsp;条记录</div>";
	
					
					$("#content").append(rows);
				}
			});

	}
	
	//删除用户
	function delPerson(pid, rid) {
		pid = "'" + pid + "'";
		$.post('${ctx}/puborgauthz/removeUsers.ihp', {
			"uIds" : pid,
			"rId" : rid
		}, function(res) {
			if (res == "success") {
				$.messager.alert("提示","用户删除成功！","info");
				forLinkedUsersPub('0', '5', '${role.id }');
			}
		});

	}
	 // 对名称添加焦点事件---判断是否输入
	function checkName2(){
		var oid=$("#oid").val();
		var name = $("#name").val();
		$.ajax({
			type : "POST",
//			async: false,
			url : "${ctx}/puborgauthz/checkName.do",
			data : {name:name,oid:oid,id: '${role.id }'},
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
	// 对名称添加焦点事件---判断是否输入
	function checkName(){

		var oid=$("#oid").val();
		var name = $("#name").val();
		if($('#roleForm').check() == true){
			var flag = true;
			var name = $("#name").val();
			if($.trim(name)==""){
				$("#repeat").hide();
				$("#msg").hide();
				$("#empty").show();
				return false;
			}
			$.ajax({
				type : "POST",
				async: false,
				url : "${ctx}/puborgauthz/checkName.do",
				data : {name:name,oid:oid,id: '${role.id }'},
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
		
		
	}
	//修改提交
	function onSubmit() {

		var oid=$("#oid").val();
		var orgname=$("#orgName").val();
		$('#roleForm').form('submit',{
			url : '${ctx}/puborgauthz/saveRole.do',
			onSubmit : checkName,
			success : function(data){
				if(data == "success"){
					$.messager.alert("提示","数据修改成功！","info");
					$('.one-center-panel').load('${ctx}/puborgauthz/authzRole.ihp?orgId='+oid+"&orgname="+orgname);
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
	};
	
</script>

</head>
<body>
	<div class="box">
		<div class="box-head">
			<div class="box-title">
				<h3>角色修改</h3>
				<a href='#' class='box-icon-a icon-back' onclick='back();'
					style='float: right; vertical-align: middle; margin-right: 20px';height: 40px;>返回</a>
			</div>
		</div>
		
		
		
		
		
		<div class="box-container" style="display: inline-block;width: 100%;">
			<form method='post' id='roleForm' name='roleForm'>

				<div class="f-div-row">
					<div class="f-div-label-c4">
						<label>名称:</label> <span>*</span>
					</div>
					<div class="f-div-input-c4">
						<input value="${role.name }" id="name" class=c-ff-input name="model.name" onblur="checkName2();"
						 _nullable=false  _nullablemsg=请填写角色名称 _maxlength=50   _maxlengthmsg=该项长度为50>
<br />
					<p id="msg" style="display: none;">
						<font color="red">* 角色名称必须填写</font>
					</p>
					<p id="repeat" style="display: none;">
						<font color="red">* 该名称已存在,请重新填写!</font>
					</p>
					<p id="empty" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
					</div>
					
				
					<div class="f-div-label-c4">
						<label>描述：</label>

					</div>
					<div class="f-div-input-c4">
					<textarea id="descp" name="model.descp" rows="3" cols="20" _maxlength=255   _maxlengthmsg=该项长度为255>
					${role.descp }
					</textarea>
						<%-- input value="${role.descp }" type="text" class=c-ff-input
							id="descp" name="model.descp" style="width: 200px"
							maxlength="255" _nullable=false maxlength=255> --%>
					</div>
				</div>
				<input type="hidden" name="model.id" value="${role.id }" id="rid">
				<input type="hidden" name="model.org.id" value="${oid }" id="oid">
				<input type="hidden" name="model.org.name" value="${orgName }" id="orgName" >
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
				<input type="button" class="normal-btn" value=保存
					onclick="onSubmit();">&nbsp;&nbsp; <input type=reset
					class=normal-btn value=重置>&nbsp;&nbsp;
			</div>

			</form>
			
		</div>
		
	</div>
	
	<div id="personList" class="easyui-window" closed="true"/>
</body>
</html>


