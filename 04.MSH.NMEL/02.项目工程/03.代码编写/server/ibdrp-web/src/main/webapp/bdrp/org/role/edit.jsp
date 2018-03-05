<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<html>
<head>
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
		forLinkedUsersPub('0', '5', '${model.id }');
		// **************浮动窗   start****************

		// 打开添加浮动框
		$('#addPerson').click(function() {
			var name = $('#method').val();
			$('#personList').window({
				title : '用户信息',
				top : 100,
				left : 350,
				width : 600,
				height : 500,
				closed : true,
				cache : false,
				closable : false,
				collapsible : false,
				minimizable : false,
				maximizable : false,
				method : "GET",
				href : '${ctx}/bdrp/org/role/user/unlinked',
				queryParams : {
					rid : '${model.id }',
					start : '0',
					limit : '10',
					orgId : '${param.orgId}',
					pname : name
				},
				modal : true
			});
			$('#personList').window('open');
		});

	});
	function back() {
		$('.one-center-panel').load('${ctx}/bdrp/org/role/main?orgId=${param.orgId}&orgName=${param.orgName}');
	}

	//浮动框的全选
	function clickSCB() {
		//判断是否被选中
		var bischecked = $("#serviceCB").is(':checked');
		var service = $('input[name="checkService"]');
		bischecked ? service.attr('checked', true) : service.attr('checked',
				false);
	}
	//获取浮动框的数据并保存服务
	function saveLinkService() {
		var sids = '';
		$('input[name="checkService"]:checked').each(function() {
			sids = "'" + $(this).val() + "'," + sids;
		});
		if (sids.length > 0) {
			$.post('${ctx}/bdrp/org/role/user/link', {
				"uIds" : sids,
				"rId" : "${model.id }"
			}, function(res) {
				if (res && res.success) {
					$.messager.alert("提示", "用户添加成功！", "info");
					$('#personList').window('close');
					forLinkedUsersPub('0', '5', '${model.id }');
				}
			});
		} else {
			$.messager.alert("提示", "用户未选择，请选择服务！", "info");
		}

	}
	//关闭浮动框
	function closeWin() {
		$('#personList').window('close');
	}
	//重新加载浮动框
	function reloadPersonList(id) {
		var name = $('#pname').val();
		var url = '${ctx}/bdrp/org/role/' + id + '/users?pname=' + name
				+ '&start=' + 0 + '&limit=' + 10 + '&orgId=${param.orgId}';
		$('#personList').window('refresh', url);
	}
	//重新加载浮动框----翻页
	function reloadPerson(start, limit, id) {
		var name = $('#pname').val();
		var url = '${ctx}/bdrp/org/role/' + id + '/users?pname=' + name
				+ '&start=' + 0 + '&limit=' + 10 + '&orgId=${param.orgId}';
		$('#personList').window('refresh', url);
	}

	/****** 由于部门，岗位，职位 这个三个数据出现bug现在先不填充  ******/
	//包含的用户分页
	function forLinkedUsersPub(start, limit, id) {
		$("#content").empty();
		$.ajax({
			url : '${ctx}/bdrp/org/role/' + id + '/users?limit='
					+ limit + '&start=' + start + '&rId=' + id,
			type : "GET",
			data : '',
			dataType : 'json',
			success : function(data) {
				var rows = "<table class='l1-tab' ><thead><tr><th class='l1-col-info' width='100px;'>名称</th><th class='l1-col-info' width='100px;'>操作</th></tr></thead>";
				$.each(data.result,
				function(index, service) {
					rows = rows
							+ "<tr><td class='l1-col-info' width='100px;'>"
							+ service.name + "</td>";
					rows = rows
							+ "<td class='l1-col-info' width='100px;'> <a href='#'  onclick=delPerson('"
							+ service.id + "','" + id
							+ "'); >删除 </a> </td></tr>";
				});
				rows = rows + "</table>";
				rows = rows + "<div class=turn-page align='center'>";
				if (data.start >= data.pageSize) {
					rows = rows
							+ "<a href='#'  onclick=forLinkedUsersPub('"
							+ (data.start - data.pageSize) + "','"
							+ data.pageSize + "','" + id
							+ "');>上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
				}
				if ((data.totalCount - data.start) > data.pageSize) {
					rows = rows
							+ "<a href='#'  onclick=forLinkedUsersPub('"
							+ (data.start + data.pageSize) + "','"
							+ data.pageSize + "','" + id
							+ "');>下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
				}
				/* if ((data.totalCount - data.start) <= data.pageSize) {
					rows = rows+ "<a href='#'  onclick=forLinkedUsersPub('"+ data.start + "','" + data.pageSize + "','"+ id+ "');>下一页</a>&nbsp;&nbsp;&nbsp;&nbsp;";
				} */
				rows = rows
						+ "&nbsp;&nbsp;&nbsp;&nbsp;"
						+ (1 + data.start / data.pageSize)
						+ "&nbsp;页&nbsp;&nbsp;&nbsp;&nbsp;共&nbsp;<font>"
						+ data.total + "</font>&nbsp;条记录</div>";

				$("#content").append(rows);
			}
		});

	}

	//删除用户
	function delPerson(pid, rid) {
		$.ajax({
			type : "DELETE",
			url : '${ctx}/bdrp/org/role/user/remove?pid=' + pid
					+ '&rid=' + rid,
			//data : {"pid" : pid,"rid" : rid},
			dataType : "json",
			success : function(msg) {
				if (msg.success) {
					$.messager.alert("提示", "删除成功", "info");
					forLinkedUsersPub('0', '5', '${model.id }');
				} else {
					$.messager.alert("错误", "该功能已被使用，无法删除！");
				}
			},
			error : function() {
				$.messager.alert("错误", "删除失败！");
			}
		});
	}
	// 对名称添加焦点事件---判断是否输入
	function checkName2() {
		var id = $("#rid").val();
		var name = $("#name").val();
		$.ajax({
			type : "GET",
			url : "${ctx}/bdrp/org/role/exist",
			data : {
				name : name,
				id : id,
				orgId : '${param.orgId}'
			},
			dataType : 'json',
			success : function(data, response) {
				if (!data.success) {
					$("#msg").hide();
					$("#repeat").show();
				} else {
					$("#msg").hide();
					$("#repeat").hide();
				}
			}
		});
	}
	// 对名称添加焦点事件---判断是否输入
	function checkName() {
		// 判断是否输入名称
		var id = $("#rid").val();
		if ($('#roleForm').check() == true) {
			var flag = true;
			var name = $("#name").val();
			if ($.trim(name) == "") {
				$("#repeat").hide();
				$("#msg").hide();
				$("#empty").show();
				return false;
			}
			$.ajax({
				type : "GET",
				async : false,
				url : "${ctx}/bdrp/org/role/exist",
				data : {
					name : name,
					id : id,
					orgId : '${param.orgId}'
				},
				dataType : 'json',
				success : function(data, response) {
					if (!data.success) {
						$("#msg").hide();
						$("#repeat").show();
						flag = false;
					} else {
						$("#msg").hide();
						$("#repeat").hide();
						flag = true;
					}
				},
				error : function() {
					flag = false;
				}
			});
			return flag;
		} else {
			return false;
		}

	}
	//修改提交
	function onSubmit() {
		$('#roleForm').form(
			'submit',
			{
				url : '${ctx}/bdrp/org/role/${model.id }',
				onSubmit : checkName,
				success : function(data) {
					var result = $.parseJSON(data);
					if (result.success) {
						$.messager.alert("提示", "数据修改成功！", "info");
						$('.one-center-panel').load('${ctx}/bdrp/org/role/main?orgId=${param.orgId}&orgName=${param.orgName}');
						// ****防止页面DIV过多，造成缓慢**********
						$(".combo-p").remove();
						$(".window").remove();
						$(".window-shadow").remove();
						;
						$(".window-mask").remove();
						$(".c-ff-input-warning").remove();
						$(".pika-single").remove();
						// ****防止页面DIV过多，造成缓慢******
					}
				},
				error : function() {
					$.messager.alert("提示", "修改失败！", "info");
				}
			});
	};
</script>

</head>
<body>
	<div class="box">
		<div class="box-head">
			<div class="box-title">
				<h3>${param.orgName }-角色修改</h3>
				<a href='#' class='box-icon-a icon-back' onclick='back();'
					style='float: right; vertical-align: middle; margin-right: 20px';height: 40px;>返回</a>
			</div>
		</div>

		<div class="box-container" style="display: inline-block; width: 100%;">
			<form method='PUT' id='roleForm' name='roleForm'>

				<div class="f-div-row">
					<div class="f-div-label-c4">
						<label>名称:</label> <span>*</span>
					</div>
					<div class="f-div-input-c4">
						<input value="${model.name }" id="name" class=c-ff-input
							name="name" onblur="checkName2();" _nullable=false
							_nullablemsg=请填写角色名称 _maxlength=50 _maxlengthmsg=该项长度为50>
						<br />
						<p id="msg" style="display: none;">
							<font color="red">* 角色名称必须填写</font>
						</p>
						<p id="repeat" style="display: none;">
							<font color="red">* 该名称已存在,请重新填写!</font>
						</p>
						<p id="empty" style="display: none;">
							<font color="red">* 输入不许为空格!</font>
						</p>
					</div>


					<div class="f-div-label-c4">
						<label>描述：</label>

					</div>
					<div class="f-div-input-c4">
						<textarea id="memo" name="memo" rows="3" cols="20" _maxlength=255
							_maxlengthmsg=该项长度为255>${model.memo }</textarea>
					</div>
				</div>
				<input type="hidden" name="id" value="${model.id }" id="rid">
				<input type="hidden" name="org.id" value="${param.orgId }"
					id="org.id"> 
				<input type="hidden" name="orgId" value="${param.orgId }"
					id="orgId"> 
				<input type="hidden" name="org.name"
					value="${param.orgName }" id="orgName">
				<div id=cbBanks class=float-tp-holder>
					<div class=float-tp-title-holder>
						<a id=tp1 href='javascript:vorgId(0)' class=float-tp-title-active>包含用户</a>
						<div class=float-right>
							<a id="addPerson" href="#" class='box-icon-a'>添加用户</a>
						</div>
					</div>
				</div>
				<!-- 填充的数据	 -->

				<div id="content" style="margin: 0px;"></div>

				<div class="f-div-btn">
					<input type="button" class="normal-btn" value=保存
						onclick="onSubmit();">&nbsp;&nbsp; <input type=reset
						class=normal-btn value=重置>&nbsp;&nbsp;
				</div>

			</form>

		</div>

	</div>

	<div id="personList" class="easyui-window" closed="true" />
</body>
</html>


