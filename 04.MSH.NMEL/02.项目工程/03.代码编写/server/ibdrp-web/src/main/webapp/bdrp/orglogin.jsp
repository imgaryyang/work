<%@ page language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ include file="/common/taglibs.jsp"%>
<%@ include file="/common/meta.jsp"%>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<title>欢迎</title>

<link href="${cdnserver}/semantic/semantic.min.css" rel="stylesheet" />

<script type="text/javascript"
	src="${cdnserver}/jQuery/2.0.0/jquery-2.0.0.min.js"></script>

<script type="text/javascript"
	src="${cdnserver}/semantic/semantic.min.js"></script>

<style type="text/css">
body {
	background-color: #DADADA;
}

body>.grid {
	height: 100%;
}

.image {
	margin-top: -100px;
}

.column {
	max-width: 450px;
}
</style>
<script>
	$(document).ready(function() {
		$('.ui.form').form({
			fields : {
				email : {
					identifier : 'text',
					rules : [ {
						type : 'empty',
						prompt : '请输入用户名'
					} ]
				},
				password : {
					identifier : 'password',
					rules : [ {
						type : 'empty',
						prompt : '请输入密码'
					} ]
				}
			}
		});
	});
</script>
</head>
<body>


	<div class="ui middle aligned center aligned grid">
		<div class="column">
			<h2 class="ui grey image header">
				<img src="${cdnserver}/resources/images/logo.png" class="image" />
				<div class="content">使用账户登录</div>
			</h2>
			<form class="ui large form" action="${ctx}/login" method="post">
				<div class="ui stacked segment">
					<div class="field">
						<div class="ui left icon input">
							<i class="user icon"></i> <input type="text" name="username"
								placeholder="用户名">
						</div>
					</div>
					<div class="field">
						<div class="ui left icon input">
							<i class="lock icon"></i> <input type="password" name="password"
								placeholder="密码">
						</div>
					</div>
					<div class="ui fluid large blue submit button">Login</div>
				</div>

				<div class="ui error message"></div>

			</form>
		</div>
	</div>
</body>
</html>
