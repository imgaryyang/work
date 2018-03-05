<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
<title>修改公共角色</title>
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
		forLinkedServicesPub('0', '5', '${role.id }');
		// **************浮动窗   start****************
		
		// 打开添加服务浮动框
		$('#addService').click(function(){
			var name = $('#method').val();
			var dec = $('#context').val();
			$('#serviceList').window({    
			    title: '服务信息', 
			    top:100,
			    left:350,
			    width : 600,
				height : 500,
				collapsible : false,
				minimizable : false,
				maximizable : false,
				closed : true,
				modal : true,
				resizable : false,  
			   href: '${ctx}/puborgauthz/toLinkedServices.ihp',
			    queryParams : {id : '${role.id }',sname:name,sdescp:dec,start : '0',limit : '10'}
			});  
			$('#serviceList').window('open');
		}); 
	
		
	});
	//浮动框的全选
	function clickSCB(){
		//判断是否被选中
		var bischecked=$("#serviceCB").is(':checked');
		var service=$('input[name="checkService"]');
		/* 
        if(bischecked==false){
				alert(bischecked);
				service.attr('checked',false);}
        if(bischecked==true){
			alert(bischecked);
			service.attr('checked',true);
			} */
		bischecked ? service.attr('checked',true):service.attr('checked',false);
	}
	//获取浮动框的数据并保存服务
	function saveLinkService(){
		var sids='';
		$('input[name="checkService"]:checked').each(function(){
			sids="'"+$(this).val()+"',"+sids;
		});
		if(sids.length>0){
			 $.post('${ctx}/puborgauthz/linkToService.ihp',{"sIds":sids,"id":"${role.id }"},
					 function(res){
						if (res == "success") {
							$.messager.alert("提示","服务添加成功！","info");
							//$('#List').window('close');
							$('#serviceList').window('close');
							forLinkedServicesPub('0', '5', '${role.id }');
						}
			}); 
		}else{
			$.messager.alert("提示","服务未选择，请选择服务！","info");
		}
		
	}
	//关闭浮动框
	function closeWin(){
		$('#serviceList').window('close');
	}
	//重新加载浮动框
	 function reloadServiceList(id){
		var name = $('#sname').val();
		var dec = $('#sdescp').val(); 
		var url='${ctx}/puborgauthz/toLinkedServices.ihp?id='
			+id+'&sdescp='+dec + '&sname='+name+'&start='+0+'&limit='+10;

		$('#serviceList').window('refresh',url);  
		
	}
	//重新加载浮动框----翻页
	function reloadService(start,limit,id){
		//alert(id+","+start+",limit="+limit);
		var name = $('#sname').val();
		var dec = $('#sdescp').val(); 
		var url='${ctx}/puborgauthz/toLinkedServices.ihp?id='
			+id+'&sdescp='+dec + '&sname='+name+'&start='+start+'&limit='+limit;
		$('#serviceList').window('refresh', url); 
	} 
	//返回
	function back() {
		$('.one-center-panel').load('${ctx}/puborgauthz/roleMain.ihp');

	}
	//包含服务的分页
	function forLinkedServicesPub(start, limit, id) {
		$("#content").empty();
		$.ajax({url : '${ctx}/puborgauthz/linkedServices.ihp?limit='+ limit + '&start=' + start + '&id=' + id,
				type : 'post',
				data : '',
				dataType : 'json',
				success : function(data) {
					var rows = "<table class='l1-tab' ><thead><tr><th class='l1-col-info' width='200px;'>名称</th><th class='l1-col-info' width='300px;'>描述</th><th class='l1-col-info' width='100px;'>操作</th></tr></thead>";
					$.each(data.result,function(index, service) {							
						rows = rows + "<tr><td class='l1-col-info' width='200px;'>"+ service.name + "</td>";
						rows = rows + "<td class='l1-col-info' width='300px;'>" + service.descp + " </td>";
						rows = rows + "<td class='l1-col-info' width='100px;'> <a href='#'  onclick=delService('" + service.id + "','" + id+ "'); >删除 </a> </td></tr>";
					});
					rows = rows + "</table>";
					rows = rows + "<div class=turn-page align='center'>";
					/* if (data.start < data.limit) {
						rows = rows+ "<a href='#'  onclick=forLinkedServicesPub('"+ data.start + "','" + data.limit + "','"+ id+ "');>上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
					} */
					if (data.start >= data.limit) {
						rows = rows+ "<a href='#'  onclick=forLinkedServicesPub('"+ (data.start - data.limit) + "','"+ data.limit + "','" + id+ "');>上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
					}
					if ((data.totalCount - data.start) > data.limit) {
						rows = rows+ "<a href='#'  onclick=forLinkedServicesPub('"+ (data.start + data.limit) + "','"+ data.limit + "','" + id+ "');>下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
					}
					/* if ((data.totalCount - data.start) <= data.limit) {
						rows = rows+ "<a href='#'  onclick=forLinkedServicesPub('"+ data.start + "','" + data.limit + "','"+ id+ "');>下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
					} */
					rows = rows+ "&nbsp;&nbsp;&nbsp;&nbsp;"+ (1 + data.start / data.limit)+ "&nbsp;页&nbsp;&nbsp;&nbsp;&nbsp;共&nbsp;<font>"+ data.totalCount+ "</font>&nbsp;条记录</div>";
	
					
					$("#content").append(rows);
				}
			});

	}
	
	//删除服务
	function delService(sid, rid) {
		sid = "'" + sid + "'";
		$.post('${ctx}/puborgauthz/removeServices.ihp', {
			"sIds" : sid,
			"rId" : rid
		}, function(res) {
			if (res == "success") {
				$.messager.alert("提示","服务删除成功！","info");
				forLinkedServicesPub('0', '5', '${role.id }');
			}
		});

	}
	 // 对名称添加焦点事件---判断是否输入
	function checkName2(){
		var name = $("#name").val();
		$.ajax({
			type : "POST",
//			async: false,
			url : "${ctx}/puborgauthz/checkName.do",
			data : {name:name,id: '${role.id }'},
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
		// 判断是否输入名称
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
				data : {name:name,id: '${role.id }'},
				dataType : 'html',
				success : function(data,response){
					/* if(data == "false"){
						$.messager.alert("提示","角色名称重复,请重新填写！","info");
						flag = false;
					}else if(data == "true"){
						flag = true;
					} */
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
		
		$('#roleForm').form('submit',{
			url : '${ctx}/puborgauthz/saveRole.do',
			onSubmit : checkName,
			success : function(data){
				if(data == "success"){
					$.messager.alert("提示","数据修改成功！","info");
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
				$.messager.alert("提示","修改失败！","info");
			}
		});
		
	};
	/* function saveService(){
		//添加service
	    var obj=document.getElementsByName("sid");
		var sIds='';
		for(var i=0;i<obj.length;i++){
			sIds="'"+obj[i].value+"',"+sIds;//如果被选中	
		} 
		alert(sIds);
		$.post('${ctx}/puborgauthz/saveService.ihp', {
			"sIds" : sIds,
			"id" : '${role.id }'
		}, function(res) {
			if (res == "success") {
				alert(res);
			} 
		}); 
	}  */
	/* //弹出添加服务框
	function toAddService(id, start, limit) {
		
		$("#add_service_dlg").dialog("open");
		//加载数据
		$("#serviceName").val("");
		reloadService('${role.id }', '0', '10');
		//选择添加服务
	  	$("#checkAll").click(function(){
			//$("#checkAll").remove();
			if(this.checked){
				$("#seviceContent input[type='checkbox']:not('#checkAll')").each(function(i){
					$(this).attr("checked",true);
				});
				
			}else{
				$("#seviceContent input[type='checkbox']").attr("checked",false);
			}
		});  
		
	} */
	/* //关闭添加服务框
	function closeAddServiceDlg() {
		$("#add_service_dlg").dialog("close");
	} */
	/* //加载服务
	function reloadService(id, start, limit) {
		$("#seviceContent").html("");
		var method = $("#method").val();
		var context = $("#serviceName").val();
		alert("method="+method+",context="+context);
		var URL= '${ctx}/puborgauthz/toLinkedServices?limit=' + limit
		+ '&start=' + start + '&id=' + id + '&method=' + method
		+ '&context=' + context;
		alert(URL);
		$.ajax({
			url :URL,
			type : 'post',
			data : '',
			dataType : 'html',
			success : function(data) {
				var row=
				$("#seviceContent").html(data);
				
			}
		});
	} */
	/* function toSaveService(){
		var b=$("#seviceContent input:checked:not('#checkAll')");
		var str='';
		$.each(b,function(key,value){
			if(b.size()==(key+1)){
				str+=value.value;
			}else{
				str+=value.value+","
			}
		});
		alert("str="+str);
	} */
</script>

</head>
<body>
	<div class="box">
		<div class="box-head">
			<div class="box-title">
				<h3>公共角色修改</h3>
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
	class='c-ff-input' _nullable=false  _nullablemsg=请填写角色名称 _maxlength=50   _maxlengthmsg=长度超越>
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
					<textarea id="descp"  name="model.descp" rows="3" cols="20" _maxlength=255   _maxlengthmsg=长度超越>${role.descp }</textarea>
						
					</div>
				</div>
				<input type="hidden" name="model.id" value="${role.id }" id="rid">
			
		<div id=cbBanks class=float-tp-holder>
			<div class=float-tp-title-holder>
				<a id=tp1 href='javascript:void(0)' class=float-tp-title-active>包含服务</a>
				<div class=float-right>
					<a id="addService" href="#" class='box-icon-a'>添加服务</a>
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
	<div id="serviceList" class="easyui-window" closed="true"/>
	
</body>
</html>


