<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>RSA</title>
    <script type="text/javascript" src="js/jquery-1.8.0.min.js"></script>
    <script type="text/javascript" src="js/security.js"></script>
    <script type="text/javascript">
	var random = "";
	var modulus, exponent;
        $(function(){
			<!--调用后台actio 从密钥文件publickey.txt中获取公钥信息--> 
        	 $.getJSON('${pageContext.request.contextPath }/user!keyPair.action',function(data){
        		 modulus = data.modulus, exponent = data.exponent;
        	 });
        	<!--调用认证初始化函数，获取随机数 --> 
        	 $.getJSON('${pageContext.request.contextPath }/user!getRandom.action',function(data){
        		 random=data;
        	 });
        	 
        	 $('#randomNUM').val(random);
        			 
            $("#btn").click(function(){
                        var epwd = $('#password').val();
                        if (epwd.length != 256) {
							<!--调用客户js加密登录密码 --> 
                            $('#password').val(RSAUtils.encryptedPassword(random,epwd,modulus, exponent));
                        }
                        $("#login").submit();
             });
        });
    </script>
  </head>
   
  <body>
    <form id="login" name="login" action="${pageContext.request.contextPath }/user!login.action" method="post">
					<input type="hidden" id="uid" name="randomNUM" value ="randomNUM"/>
       账号（UID）：<input type="text" id="uid" name="uid" value ="zhangsan"/>
           密码：<input type="password" id="password" name="password" value ="12323"/>
        <input id="btn" type="button" value="提 交" />
    </form>
  </body>
</html>
