<%@ page language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ include file="/common/taglibs.jsp"%>
<%@ include file="/common/meta.jsp"%>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<title>首页</title>

<link href="${cdnserver}/resources/styles/base.css"
	rel="stylesheet" />
<link href="${cdnserver}/resources/styles/common.css"
	rel="stylesheet" />
<link href="${cdnserver}/resources/styles/pub-base.css"
	rel="stylesheet" />
<link href="${cdnserver}/jQuery/plugin/pikaday.css"
	rel="stylesheet" />

<script type="text/javascript"
	src="${cdnserver}/jQuery/2.0.0/jquery-2.0.0.min.js"></script>
<script language="JavaScript" type="text/javascript"
	src="${cdnserver}/scripts/common.js"></script>
<script language="JavaScript" type="text/javascript"
	src="${cdnserver}/scripts/pub-base.js"></script>
<script language="JavaScript" type="text/javascript"
	src="${cdnserver}/scripts/utils/numeral.min.js"></script>
<script language="JavaScript" type="text/javascript"
	src="${cdnserver}/scripts/utils/moment.js"></script>
<script type="text/javascript"
	src="${cdnserver}/jQuery/plugin/pikaday.jquery.js"></script>

<link rel="stylesheet" type="text/css"
	href="${cdnserver}/jQuery/easyui-1.3.6/themes/default/easyui.css" />
<link rel="stylesheet" type="text/css"
	href="${cdnserver}/jQuery/easyui-1.3.6/themes/icon.css" />
<script type="text/javascript"
	src="${cdnserver}/jQuery/easyui-1.3.6/scripts/jquery.easyui.min.js"></script>

<script type='text/javascript'>
	$menus = ${menusJson};
	var nmn = '';
	var nsmn = "";
	var $CTX = '${ctx}';

	$(document)
			.ready(
					function() {
						var html = "";
						for (var i = 0; i < $menus.length; i++) {
							if (typeof nmn == 'undefined' || nmn == '') {
								nmn = "#_nav_m_" + $menus[i].code;
							}
							html += "<li id='_nav_m_"+$menus[i].code+"'> <a href='#' onClick=changeMenu('"
									+ $menus[i].url
									+ "','"
									+ $menus[i].code
									+ "')>" + $menus[i].name + "</a>";
							if ($menus[i].children != null) {
								var children = $menus[i].children;
								html += "<p class='_pub_base_sub_nav'>";
								for (var j = 0; j < children.length; j++) {
									if (typeof nsmn == 'undefined'
											|| nsmn == '') {
										nsmn = "#_nav_s_m_" + children[j].code;
										$('.one-center-panel').load(
												children[j].url);
									}
									html += "<a id='_nav_s_m_"
											+ children[j].code
											+ "' onClick=loadPanel('"
											+ children[j].url + "','"
											+ children[j].code
											+ "') method='#'>"
											+ children[j].name + "</a>";
									if (j != children.length - 1) {
										html += "<span class='_pub_base_sub_nav_sep'>|</span>";
									}
								}
								html += "</p>";
							}
							html += "</li>"
						}

						$('#_pub_base_tnavmenu').append(html);
						$(nmn).addClass('_pub_base_navmenu_h');
						$(nmn).children('a:first').addClass(
								'_pub_base_navmenu_a_h');
						if ($(nmn).children('p:first').length == 0) {
							$('#_pub_base_nav').height(42);
						} else {
							$(nmn).children('p:first').show();
							$(nsmn).addClass('_pub_base_sub_nav_a');
						}
					});
	function changeMenu(url, code) {
		$(nmn).removeClass();
		$(nmn).children('a:first').removeClass();
		if ($(nmn).children('p:first').length == 0) {
			$('#_pub_base_nav').height(42);
		} else {
			$(nmn).children('p:first').hide();
		}
		nmn = '#_nav_m_' + code;
		$(nmn).addClass('_pub_base_navmenu_h');
		$(nmn).children('a:first').addClass('_pub_base_navmenu_a_h');
		if ($(nmn).children('p:first').length == 0) {
			$('#_pub_base_nav').height(42);
		} else {
			$(nmn).children('p:first').show();
			//		   $(nsmn).addClass('_pub_base_sub_nav_a');
		}
	}

	function loadPanel(url, code) {
		//url="bdrp/person/personList.jsp";
		$(nsmn).removeClass();
		nsmn = "#_nav_s_m_" + code;
		$(nsmn).addClass('_pub_base_sub_nav_a');
		$(".combo-p").remove();
		$(".window").remove();
		$(".window-shadow").remove();
		;
		$(".window-mask").remove();
		$(".c-ff-input-warning").remove();
		$('.one-center-panel').load(url);
	}
	function logout(){
		document.location.href='/bdrp/logout';
	}

	function changePasswd(){
		document.location.href='/bdrp/logout';
	}
</script>

</head>
<body style="padding: 0; border: 0; margin: 0 0 15px 0;">

	<div class='_pub_base_topbar'>
		<ul id="_pub_base_topmenu">
			<span class="_pub_base_top_text">欢迎您，<a id='_USERNAME_HREF'
				hidefocus href="javascript:void(0)">${user.name}</a>！
			</span>
			<li class="_pub_base_topmenu_split"><div></div></li>
			<li><a href="javascript:void(0)" isTop=true method="changePasswd">修改密码</a></li>
			<li class="_pub_base_topmenu_split"><div></div></li>
			<li><a href="javascript:void(0)" isTop=true method="#">软件许可</a></li>
			<li class="_pub_base_topmenu_split"><div></div></li>
			<li><a href="javascript:void(0)" isTop=true method="feedback">反馈</a></li>
			<li class="_pub_base_topmenu_split"><div></div></li>
			<li><a href="javascript:void(0)" isTop=true method="about">关于</a></li>
			<li class="_pub_base_topmenu_split"><div></div></li>
			<li><a href="javascript:logout()" isTop=true method="logout">退出</a></li>
		</ul>
	</div>

	<div class="_pub_base_container">
		<div id='_pub_base_top' class='_pub_base_header'>
			<div class='_pub_base_logo'>
				<div></div>
			</div>
			<div id='_pub_base_nav' class='_pub_base_nav'>
				<ul id="_pub_base_tnavmenu" />
			</div>
		</div>

		<div class="_pub_base_ui_content">
			<div class="one-center-panel"></div>
		</div>

		<div class=_pub_base_footer_split>&nbsp;</div>
		<div class="_pub_base_footer">
			<br /> &copy 2012-2013 InfoHold Group. All Rights Reseved.
		</div>
	</div>
</body>
</html>
