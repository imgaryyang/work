<%@ page language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ include file="/common/taglibs.jsp"%>
<%@ include file="/common/meta.jsp"%>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<title>首页</title>
<link href="${cdnserver}/semantic/semantic.min.css" rel="stylesheet" />
<script type="text/javascript"
	src="${cdnserver}/jQuery/2.0.0/jquery-2.0.0.min.js"></script>
<script type="text/javascript"
	src="${cdnserver}/semantic/semantic.min.js"></script>

<script type='text/javascript'>
	$(document).ready(function() {

	});
</script>

</head>
<body>
	<div class="ui teal inverted large top fixed hidden secondary menu">
		<div class="left menu">
			<a class="item"><i class="home icon"></i></a>
			<a class="item"><i class="sidebar icon"></i></a>
			<a class="item"><i class="user icon"></i></a>
			<a class="item"><i class="lock icon"></i></a>
		</div>

		<div class="right menu">
			<a class="item"><i class="search icon"></i></a> <a class="item"><i
				class="alarm icon"></i></a> <a class="item"><i class="sign out icon"></i></a>
		</div>
	</div>

	<!-- Sidebar Menu -->
	<div class="pusher">
		<div class="full height">
			<div class="toc">
				<div class="ui vertical sticky menu fixed" style="top:47px;">
					<a class="active item">Home</a>
					<a class="item">Work</a>
				</div>
			</div>
			
			<div class ="article">
				<div class="main ui container">
					ccccc
				</div>
			</div>
			
		</div>
	</div>
</body>
</html>
