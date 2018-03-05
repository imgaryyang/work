<%@ page isErrorPage="true" language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<%@ page import="com.lenovohit.core.exception.BaseException" %>
<%@ page import="com.lenovohit.core.exception.ExceptionType" %>
<%@ page import="com.lenovohit.core.web.utils.ErrorMessage" %>
<%@ page import="java.net.URLEncoder" %>
<%
	Exception ex = (Exception)request.getAttribute("_ex");
out.print(ex);
%>
