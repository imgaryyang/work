package com.lenovohit.ssm.app.elh.base.web.rest;

import java.io.IOException;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.subject.Subject;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.lenovohit.core.utils.FileUtils;
import com.lenovohit.core.web.rest.BaseRestController;

@RestController
@RequestMapping("/hwe/app/hos")
public class CustomeHosLoginRestController extends BaseRestController {

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public ModelAndView forLogin() {
//		String username = this.getRequest().getParameter("username");
//		String password = this.getRequest().getParameter("password");
//		try {
//			AuthUser tokenUser = new DefaultAuthUser();
//			tokenUser.setUsername(username);
//			tokenUser.setPassword(password);
//			Subject subject = SecurityUtils.getSubject();
//			AuthUserToken token = new AuthUserToken(tokenUser);
//			subject.login(token);
//		} catch (AuthenticationException e) {
//			e.printStackTrace();
//			// 用户名密码校验失败
//			// System.out.println("用户名密码校验失败");
//			return new ModelAndView("redirect:/login.jsp");
//		}
		return new ModelAndView("redirect:/homepage");
	}

	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	public ModelAndView forLogout() {
		try {
			Subject subject = SecurityUtils.getSubject();
			subject.logout();
		} catch (AuthenticationException e) {
			e.printStackTrace();
		}
		return new ModelAndView("redirect:/login.jsp");
	}

	@RequestMapping(value = "/homepage")
	public ModelAndView forHomePage() {
		ModelAndView mv = new ModelAndView("homepage");
		PathMatchingResourcePatternResolver patternResolver = new PathMatchingResourcePatternResolver();
		try {
			Resource[] resources = patternResolver.getResources("classpath*:config/menus-default.json");
			for (Resource r : resources) {
				String json = FileUtils.readStreamToString(r.getInputStream(), FileUtils.FILE_CHARSET_UTF8);
				mv.addObject("menusJson", json);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return mv;
	}
	/******************************************************机构端方法*************************************************************************/
	/******************************************************机构端方法end*************************************************************************/
	/******************************************************app端方法*************************************************************************/
	/******************************************************app端方法end*************************************************************************/
	/******************************************************运营端方法*************************************************************************/
	/******************************************************运营端方法end*************************************************************************/
	
}
