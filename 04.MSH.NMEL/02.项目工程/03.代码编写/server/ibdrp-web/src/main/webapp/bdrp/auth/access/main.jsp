<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<head>
<title>授权管理</title>
<script type="text/javascript">
	$(document).ready(function(){
		
		$('#parent').combotree({
			url : '${ctx}/bdrp/auth/function/tree',
			required : false,
			method : "GET",
			formatter : function(node) {
				node.text = node.name;
				delete node.name;
				return node.text;
			}
		});
		
		$('.turn-page>a').on('click', function(){
			$('#Start').val($(this).attr('_start'));
			var start = $('#Start').val();
			$('#authzForm').form('submit',{
				url : '${ctx}/bdrp/auth/access/main?start=' + start,
				success : function(data){
					
				}
			});
			
		});
		
	});
	function addAuthz(){
		$('.one-center-panel').load('${ctx}/bdrp/auth/access/add.jsp');
	}

	function search2(){
		var name = $('#name').val();
		var desc = $('#desc').val();
		/* if(func==null||func==""){
			var func = $('#func').val();	
		}else{ */
			var t = $('#parent').combotree('tree');	// 获取树对象
			var n = t.tree('getSelected');		// 获取选择的节点
			 if(n==null){
				 if($('#func').val()!=""){func=$('#func').val();
				 $('#parent').combotree('setValue',func);
				 }else{
				func="";
				$('#parent').combotree('setValue',func);
				 }
			}else{ 
			var func =n.text;
			$("#func").val(func);
			$('#parent').combotree('setValue',func);
			 }  
			
		/* } */
		$('.one-center-panel').load('${ctx}/bdrp/auth/access/main',{name:name,desc:desc,func:func});
	}
	
	function del(id){
		$.messager.confirm("确认删除", "你确定要删除选中项吗？", function(flag){
			if(flag == true){
				$.ajax({
					type :"delete",
					url : "${ctx}/bdrp/auth/access/remove/"+id,
					data : {},
					dataType : "json",
					success : function(msg){
						if(msg.success){
							$.messager.alert("提示","删除成功","info");
							$(".one-center-panel").load('${ctx}/bdrp/auth/access/main');
						}
					}
				});
			}
		});
	}
	

	
	function edit(id){
		$('.one-center-panel').load('${ctx}/bdrp/auth/access/edit/'+id);
	}
	
	function PageUp(start){
		var authzid = $('#authzid').val();
		var name = $('#name').val();
		var desc = $('#desc').val();
		var func = $('#func').val();
		$('#parent').combotree('setValue',func);
		/* var t = $('#func').combotree('tree');	// 获取树对象
		var n = t.tree('getSelected');		// 获取选择的节点
		if(n==null){
			func="";
		}else{
		var func =n.text;
		}  */
		$(".one-center-panel").load('${ctx}/bdrp/auth/access/main',{authzid:authzid,start:start,name:name,desc:desc,func:func});

	}

	function PageDown(start){
		var authzid = $('#authzid').val();
		var name = $('#name').val();
		var desc = $('#desc').val();
		var func = $('#func').val();
		$('#parent').combotree('setValue',func);
		/* var t = $('#func').combotree('tree');	// 获取树对象
		var n = t.tree('getSelected');		// 获取选择的节点
		if(n==null){
			func="";
		}else{
		var func =n.text;
		}  */
		
		$(".one-center-panel").load('${ctx}/bdrp/auth/access/main',{authzid:authzid,start:start,name:name,desc:desc,func:func});
	} 
	
	function functree(){
		$('#func').combotree({    
		    url: '${ctx}/bdrp/auth/access/combotreeFunction.do'
		}); 
	} 
	function reset2(){
		$("#name").val("");
		$("#desc").val("");
		$("#func").val("");
		$('#parent').combotree('setValue',"");
		
	}
	
	
</script>
<style type="text/css">
	#createAthuz_1{
		padding-left:810px;
	}
</style>
<!-- 搜索 -->

	<div class="box">
    	<div class="box-head">
        	<div class="box-title">
            	<h3>授权管理</h3>
            	<div id="createAthuz_1"><input  class=mini-btn type="button" name="createAthuz" id="createAthuz" value="新增授权管理" onclick="addAuthz()""></div>
            </div>
        </div>
	<div class=box-container>
	
	

	
	<div class=search-panel>
		<form method="post" id="authzForm">
	<input type=hidden id=Start name=Start value='${pageBean.start}'>
	<input type=hidden id=PageSize name=PageSize value='${pageBean.pageSize}'>
	<input type=hidden id=nameval name=nameval value='$("#name").val()'>
	

		<div style=' float:left;  display:inline; width:33%;'>
			<label class=sp-label style='width:25%'>名称:</label>
			<div class=sp-cdt style='width:73%'>
			
			<input type=text  id="name" name="name"  value="${name}"  size=20>
			<input type="hidden"  id="func" name="func"  value="${func}"  size=20>
			<%-- <input type=hidden  id="funcv" name="funcv"  value="${func}"  size=20> --%>
			</div>
		</div>
		<div style=' float:left;  display:inline; width:32%;'>
			<label class=sp-label style="width:25%">对应功能:</label>
			<div class=sp-cdt style='width:73%'>
			<select id="parent" name="parentid" style="width:210px">
			<option>${func}</option>
			</select>
	 		<%-- <input type=text id="func" name="func" value="${func }" onclick="functree()">   --%>
	 		
	 		</div>
		</div>
		<div style=' float:left;display:inline; width:33%;'>
			<label class=sp-label style='width:25%'>描述 :</label>
			<div class=sp-cdt style='width:73%'><input type=text  id="desc" name="desc" value="${desc}" size=20></div>
		</div>
		
		<div class=sp-btns>
			<input type=button name=search id=search class=mini-btn value=搜索 onclick="search2();">&nbsp;&nbsp;&nbsp;&nbsp;
			<input type=button name=reset id=reset class=mini-btn value=重置 onclick="reset2();">
		</div>
		</form>
	</div>
	
	</div>

</div>
<table class="l1-tab" style='width:100%;'>
	<thead>
		<tr>
			<th class=l1-col-info style='width:1%;'></th>
			<th class=l1-col-info style='width:1%;'></th>
			<th class=l1-col-info style='width:20%;'>名称</th>
			<th class=l1-col-info style='width:20%;'>对应功能</th>
			<th class=l1-col-info style='width:20%;'>描述</th>
			<th class=l1-col-info style='width:18%;'>操作</th>
		</tr>
	</thead>
	<tbody>
		<c:forEach var="list" items="${pageBean.result}"  varStatus="status">
					
				   	<c:if test="${(status.count%2)==0}">
						<tr class=l1-row-sep ondblclick="edit('${list.id}');">
						<td><input type="hidden" id="id" value="${list.id }"></td>
						<td><input type="hidden" id="function_id" value="${list.function.id }"></td>
					 	<td class=l1-col-info >${list.name}</td>
						<td class=l1-col-info >${list.function.name}</td>
					    <td class=l1-col-info>${list.descp}</td>
						<td class=l1-col-info>
							<input type=button class=mini-btn  value="编辑" onclick="edit('${list.id}');">
							<input type=button class=mini-btn  value="删除" onclick="del('${list.id}');">
						</td>
					</tr> 
					
				 </c:if>	
				  <c:if test="${ (status.count%2)!=0}">
					<tr class=l1-row ondblclick="edit('${list.id}');">
					<td><input type="hidden" id="id" value="${list.id }"></td>
					<td><input type="hidden" id="function_id" value="${list.function.id }"></td>
						<td class=l1-col-info >${list.name}</td>
						<td class=l1-col-info >${list.function.name}</td>
					    <td class=l1-col-info>${list.descp}</td>
						<td class=l1-col-info>
							<input type=button class=mini-btn  value="编辑" onclick="edit('${list.id}');">
							<input type=button class=mini-btn  value="删除" onclick="del('${list.id}');">
						</td>
					  </tr>
				 </c:if>	 
				</c:forEach>
	</tbody>
</table>
<div class=turn-page>
	<c:if test="${pageBean.start > 0}"><a _start=${pageBean.start - pageBean.pageSize} href='javascript:void(0)' onClick='PageUp(${pageBean.start - pageBean.pageSize});'>上一页</a></c:if>
	<c:if test="${pageBean.start + pageBean.pageSize < pageBean.total}"><a _start=${pageBean.start + pageBean.pageSize} href='javascript:void(0)' onClick='PageDown(${pageBean.start + pageBean.pageSize});'>下一页</a></c:if>
	&nbsp;&nbsp;&nbsp;&nbsp;共<font>${pageBean.total}</font>条记录
</div>

</div>
</body>