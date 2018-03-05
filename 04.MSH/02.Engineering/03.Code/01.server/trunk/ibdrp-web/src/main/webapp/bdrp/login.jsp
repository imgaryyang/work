<%@ page language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ include file="/common/taglibs.jsp"%>
<%@ include file="/common/meta.jsp"%>
<%@ page import="com.lenovohit.bdrp.tools.security.SecurityUtil" %>
<%@ page import="com.lenovohit.bdrp.tools.security.impl.SecurityConstants" %>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<title>欢迎</title>

<link href="${cdnserver}/semantic/semantic.min.css" rel="stylesheet" />

<script type="text/javascript"
	src="${cdnserver}/jQuery/2.0.0/jquery-2.0.0.min.js"></script>

	
<script type="text/javascript"
	src="${cdnserver}/scripts/utils/security.js"></script>

	
<script>
	<%
		String random = SecurityUtil.genRandom(16);
		session.setAttribute(SecurityConstants.PARAM_KEY_LONIN_RANDOM,random);
	%>
	var random = "<%=random %>";
	var modulus="<%=SecurityConstants.KEY_PUBLIC_MODULUS1 %>", exponent="<%=SecurityConstants.KEY_PUBLIC_EXPONENT1 %>";
    var modulus2="<%=SecurityConstants.KEY_PUBLIC_MODULUS2 %>", exponent2="<%=SecurityConstants.KEY_PUBLIC_EXPONENT2 %>";
    
    $(function(){
        $("#btn").click(function(e){
            var epwd = $('#usepsswd').val();
            if (epwd.length != 256) {
				<!--调用客户js加密登录密码 -->
                $('#usepsswd').val(RSAUtils.encryptedPassword(random,epwd,modulus, exponent));
            }
            $("#login").submit();
         });
    });
</script>
</head>
<body style="padding: 10px 10px">
	<div class="ui middle aligned center aligned grid cards">
		<div class="ui card">
			<div class="content">
				<h2 class="ui grey image header">
					<img src="${cdnserver}/resources/images/logo.png" class="image" />
					<div class="content">使用账户登录</div>
				</h2>
			</div>
			<div class="content">
				<form id="login" class="ui large form" action="${ctx}/bdrp/login" method="post" >
					<div class="ui stacked segment">
						<div class="field">
							<div class="ui left icon input">
								<i class="user icon"></i> <input type="text" name="username"
									placeholder="用户名">
							</div>
						</div>
						<div class="field">
							<div class="ui left icon input">
								<i class="lock icon"></i> <input id= "usepsswd" type="password" name="usepsswd"
									placeholder="密码">
							</div>
						</div>
						<div id="btn" class="ui fluid large blue submit button">Login</div>
					</div>
					<div class="ui error message"></div>
				</form>
			</div>
		</div>
	</div>
</body>
</html>
