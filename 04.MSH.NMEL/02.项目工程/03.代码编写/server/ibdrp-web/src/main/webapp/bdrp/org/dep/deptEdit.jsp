<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>

<title>编辑部门</title>

<script type="text/javascript">
$(document).ready(function(){
	$.initSpecInput();
	$(".combo-p").remove();
	$(".window").remove();
	$(".window-shadow").remove();;
	$(".window-mask").remove();
	$(".c-ff-input-warning").remove();
	var parentId = $('#parentid').val();
	var orgId = $('#orgId').val();
	
	$('#parent').combotree({
		url : '${ctx}/bdrp/org/dep/tree',
		required : false,
		method : "GET",
		formatter : function(node) {
			node.text = node.name;
			delete node.name;
			return node.text;
		}
	});
	
	$('#parent').combotree('setValue',parentId);
	
	var deptid = $('#deptid').val();
	
	loadPerson("0","5",deptid);


	// 返回功能主页面 
	$("#back").click(function(){
		var orgId = $('#orgId').val();
		$(".combo-p").remove();
		$(".window").remove();
		$(".window-shadow").remove();;
		$(".window-mask").remove();
		$(".c-ff-input-warning").remove();
		$('.one-center-panel').load('${ctx}/bdrp/org/dep/main');
	}); 
	

	$('#addBtn').click(function(){
		
		var deptid = $('#deptid').val();
		var orgId = $('#orgId').val();
		$('#personList').window({    
		    title: '人员信息',    
		    width : 600,
			height :600,
			collapsible : false,
			minimizable : false,
			maximizable : false,
			closed : true,
			modal : true,
			resizable : false, 
		    href: '${ctx}/bdrp/org/dep/toLinkPerson',
		    queryParams : {orgId : orgId,deptid : deptid,start : '0',pageSize : '10'},
		}); 
		$('#personList').window('open');
	});
	
	$('#saveBtn').click(function(){
		var orgId = $('#orgId').val();
		$('#deptForm').form('submit',{
			url : '${ctx}/bdrp/org/dep/update',
			onSubmit : doCheck,
			method : 'PUT',
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
					// ****防止页面DIV过多，造成缓慢**********
				}
			},
			error : function(){
				alert("保存失败！");
			}
		});
	});
});


function loadPerson(start,limit,deptid){
	$('#persons').empty();
	var html = "";
	$.ajax({
		type : 'get',
		url : '${ctx}/bdrp/org/dep/postLinkedUsers',
		data : {start: start, limit:limit, deptid:deptid},
		dataType : 'json',
		success : function(data){
			html = "<table class=l1-tab><thead><tr>";
			html += "<th class=l1-col-info style='width:20%;'>姓名</th>";
			html += "<th class=l1-col-info style='width:15%;'>性别</th>";
			html += "<th class=l1-col-info style='width:15%;'>岗位</th>";
			html += "<th class=l1-col-info style='width:20%;'>职位</th>";
			html += "<th class=l1-col-info style='width:20%;'>操作</th>";
			html += "</tr></thead><tbody>";
			$.each(data.data.result, function(index,result){
				html += "<tr class=l1-row>";
				html += "<td class=l1-col-info >"+result.name+"</td>";
				if(result.sex == '1'){
					html += "<td class=l1-col-info>男</td>";
				}else{
					html += "<td class=l1-col-info>女</td>";
				}
				html += "<td class=l1-col-info >"+"kong"+"</td>";
				html += "<td class=l1-col-info >"+"kong"+"</td>";
				html += "<td class=l1-col-info><a href=# onclick='removePerson(\""+result.id+"\")''>移除 </a></td></tr>";
			}); 
			
			html += "</tbody></table>";
			
			html += "<div class=turn-page>";
 			if(data.data.start > 0){
				var _start = data.data.start - data.data.pageSize;
				html += "<a _start="+_start+" href='javascript:void(0)' onClick='loadPerson("+_start+","+data.data.pageSize+",\""+deptid+"\")'>上一页</a>";
			}
			if((data.data.start + data.data.pageSize) < data.data.total){
				var _start = data.data.start + data.data.pageSize ;
				html += "<a _start="+_start+" href='javascript:void(0)' onClick='loadPerson("+_start+","+data.data.pageSize+",\""+deptid+"\")'>下一页</a>";
			}
			html +="&nbsp;&nbsp;&nbsp;&nbsp;共<font>"+data.data.total+"</font>条记录";  
		
			$('#persons').append(html);
		},
		error : function(){
			
		}
	});
}
function doCheck(){
	if($('#deptForm').check() == true){
		var name = $('#name').val();
		var orgId = $('#orgId').val();
		var deptName = $('#deptName').val();
		var flag = true;
		if(name != deptName){
			$.ajax({
				type : "GET",
				async: false,
				url : "${ctx}/bdrp/org/dep/exist",
				data : {name:name,orgId:orgId},
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
						flag = false;
				}
			});
		}else{
			$("#repeat").show();
			$("#msg").hide();
			flag = false;
		}
		return flag;
	}else{
		return false;
	}
}

function removePerson(personid){
	var deptid = $('#deptid').val();

 	var a=confirm("你确定要移除该职员吗 ？");
	if(a==true){
		$.ajax({
			url : '${ctx}/bdrp/org/dep/deletekPerson',
			data : { personid: personid ,deptid : deptid},
			dataType : 'json',
			success : function(data){
					alert("删除成功！");
					loadPerson("0","5",deptid);
			},
			error : function(){
				alert("删除失败!");
			}
		});
	}; 
}

function PageTurn(start,limit){
	var deptid = $('#deptid').val();
	var orgid = $('#orgId').val();
	$('#personList').window('refresh', '${ctx}/puborgauthz/noDeptPerson.ihp?orgId='+orgid+'&deptid='+deptid + '&start='+start+'&limit='+limit); 
}

function bint(){
	var deptid = $('#deptid').val();
	var orgid = $('#orgId').val();
	var i = 0;
	var sids='';
	$('input[name="checkperson"]:checked').each(function(){
		sids="'"+$(this).val()+"',"+sids;
	});
	$.ajax({
		url : '${ctx}/bdrp/org/dep/saveLinkPerson',
		traditional:true,
		data : {personids : sids,deptid : deptid,orgid : orgid},
		dataType : 'json',
		success : function(data){
				loadPerson("0","5",deptid);
		//		$('.right-panel').load('${ctx}/puborgauthz/editDept.ihp?id=' + deptid);
		},
		error : function(){
			
		}
	});
	$('#personList').window('close');
}

function closePanel(){
	$('#personList').window('close');
}

function selectAll(){
	var bischecked=$("#All").is(':checked');
	var service=$('input[name="checkperson"]');
	bischecked ? service.attr('checked',true):service.attr('checked',false);
}
</script>
</head>
<body>
<div class="box">
<div class="box-head">
	<div class="box-title">
		<h3>部门修改</h3>
		<a id="back"  href="#" class='box-icon-a icon-back' style='float:right ;vertical-align: middle;margin-right:20px;height: 20px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;返回</a>
	</div>
</div>
<div class="box-container" >
<form method='post' id='deptForm' name='deptForm' action=''>
<input type="hidden" id="orgId" name="org.id" value="${model.org.id }">
<input type="hidden" id="parentid" value="${model.parent.id }">
<input type="hidden" id="deptName" value="${model.name }">
<input type="hidden" id="deptid" name="id" value="${model.id }">

		<table class=f-tab width=100% border=0 cellspacing=0 cellpadding=0>
			<tr class=f-tab-row>
				<td class=f-tab-col-label-nowidth style="width:10%"><label>上级：</label></td>
				<td class=f-tab-col-input-nowidth style="width:30%">
				<select id="parent" name="parent.id" style="width:210px"></select>
				</td>
				<td class=f-tab-col-label-nowidth><label>名称<span style="color:red">&nbsp;*&nbsp;</span>：</label></td>
				<td class=f-tab-col-input-nowidth>
				<input type=text id=name name=name value="${model.name }" class='c-ff-input' _nullable=false _nullablemsg=请填写名称>
				<p id="repeat" style="display : none;"><font color="red">* 该名称已存在,请重新填写!</font></p>
				<p id="empty" style="display : none;"><font color="red">* 输入不许为空格!</font></p>
				</td>
			</tr>
			<tr class=f-tab-row>
				<td class=f-tab-col-label-nowidth><label >编号<span style="color:red">&nbsp;*&nbsp;</span>：</label></td>
				<td class=f-tab-col-input-nowidth>
				<input type=text id=code name=code value="${model.code }" class='c-ff-input' _nullable=false _nullablemsg=请填写编号>
				</td>
				<td class=f-tab-col-label-nowidth><label>描述：</label></td>
				<td class=f-tab-col-input-nowidth>
				<textarea class='c-ff-textarea' id=description name=description>${model.description}</textarea>
				</td>
			</tr>
			<tr>
			<td colspan=4>
			
					<div class=float-tp-title-holder>
					<a id=tp1 hidefocus href='javascript:void(0)' class=float-tp-title-active>职员信息</a>
					<div class=float-right>
						<a id=addBtn>添加职员</a>
					</div>
					</div>
				
				<div id=persons class=float-tp-item-holder/>
			
			</td>
			</tr>
			<tr class=f-tab-row/f-tab-row-sep>
				<td class=f-tab-col-input-nowidth colspan=4 align=center >
				<input id=saveBtn type=button class=normal-btn value=保存>&nbsp;&nbsp;
				<input id=cancelBtn type=reset class=normal-btn value=重置>
				</td>
			</tr>
		</table>
	</form>
</div>
</div>
<div id="personList" class="easyui-window" closed="true"/>
</body>
</html>


