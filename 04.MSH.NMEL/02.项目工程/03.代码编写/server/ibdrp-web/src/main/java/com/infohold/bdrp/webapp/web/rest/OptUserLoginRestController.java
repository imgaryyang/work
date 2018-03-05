package com.infohold.bdrp.webapp.web.rest;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.infohold.bdrp.Constants;
import com.infohold.bdrp.authority.model.AuthUser;
import com.infohold.bdrp.authority.shiro.authc.AuthUserToken;
import com.infohold.bdrp.authority.shiro.authc.NoPasswordException;
import com.infohold.bdrp.org.model.OptUser;
import com.infohold.bdrp.org.model.Org;
import com.infohold.bdrp.tools.security.SecurityUtil;
import com.infohold.bdrp.tools.security.impl.SecurityConstants;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.ErrorMessage;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;

@RestController
@RequestMapping("/bdrp")
public class OptUserLoginRestController extends BaseRestController {

	@Value("${app.login.success.url}")
	private String successUrl;

	@Value("${app.login.url}")
	private String loginUrl;

	@Value("${app.reset.password.url:resetpassword}")
	private String resetPasswordUrl;
	
	@Autowired
	private GenericManager<Org, String> orgManager;
	
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public ModelAndView forLogin() {
		String username = this.getRequest().getParameter("username");
		String password = this.getRequest().getParameter("usepsswd");
		String random = (String) this.getSession().getAttribute(SecurityConstants.PARAM_KEY_LONIN_RANDOM);
		
		ModelAndView mv= new ModelAndView();
		String viewName = "redirect:" + successUrl; 
		log.info("用户【" + username + "】密码：【" + password + "】随机字符串【" + random + "】请求登录");
		ErrorMessage messageModel = null;
		try {
			OptUser tokenUser = new OptUser();
			tokenUser.setUsername(username);
			tokenUser.setPassword(password);
			Subject subject = SecurityUtils.getSubject();
			AuthUserToken<OptUser> token = new AuthUserToken<OptUser>(tokenUser);
			subject.login(token);
			if(Constants.APP_SUPER_ID.equals(((AuthUser)subject.getPrincipal()).getId())){
				AuthUser u = (AuthUser) subject.getPrincipal();
				this.getSession().setAttribute(Constants.USER_KEY, u);
				
				this.getSession().removeAttribute(SecurityConstants.PARAM_KEY_LONIN_RANDOM);
			}else {
				OptUser u = (OptUser) subject.getPrincipal();
				this.getSession().setAttribute(Constants.USER_KEY, u);
				
				Org org = this.orgManager.get(u.getOrgId());
				if(null != org){
					this.getSession().setAttribute(Constants.ORG_KEY, org);
				}
				this.getSession().removeAttribute(SecurityConstants.PARAM_KEY_LONIN_RANDOM);
			}
			
			
		} catch (NoPasswordException e) {
			e.printStackTrace();
			messageModel = new ErrorMessage();
			messageModel.setMessageType(ErrorMessage.MESSAGE_TYPE_ERROR);
			messageModel.setMessage("未设置密码！");
			viewName = "redirect:" + resetPasswordUrl;
		} catch (UnknownAccountException e) {
			e.printStackTrace();
			viewName = "redirect:" + loginUrl;
			messageModel = new ErrorMessage();
			messageModel.setMessageType(ErrorMessage.MESSAGE_TYPE_ERROR);
			messageModel.setMessage("用户不存在，请联系客服!");
		} catch (IncorrectCredentialsException e) {
			e.printStackTrace();
			viewName = "redirect:" + loginUrl;
			messageModel = new ErrorMessage();
			messageModel.setMessageType(ErrorMessage.MESSAGE_TYPE_ERROR);
			messageModel.setMessage("密码错误，请重新输入或找回密码!");
		} catch (AuthenticationException e){
			e.printStackTrace();
			viewName = "redirect:" + loginUrl;
			messageModel = new ErrorMessage();
			messageModel.setMessageType(ErrorMessage.MESSAGE_TYPE_ERROR);
			messageModel.setMessage("登录过程异常，请联系客服");
		}
		if(null != messageModel){
			this.getRequest().setAttribute("errMsg", messageModel.getMessage());
			this.getResponse().addHeader(ErrorMessage.RESPONSE_TYPE,
					ErrorMessage.MESSAGE_TYPE_ERROR);
			try {
				this.getResponse().addHeader(messageModel.getMessageType(),
						URLEncoder.encode(messageModel.getMessage(), "utf-8"));
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		}
		mv.setViewName(viewName);
		
		return mv;
	}

	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	public ModelAndView forLogout() {
		try {
			this.getSession().removeAttribute(Constants.USER_KEY);
			Subject subject = SecurityUtils.getSubject();
			subject.logout();
		} catch (AuthenticationException e) {
			e.printStackTrace();
		}
		return new ModelAndView("redirect:/login");
	}
	
	@RequestMapping(value = "/pre/{type}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPre(@PathVariable("type") String type) {
		
		String random = SecurityUtil.genRandom(16);
		if("login".equals(type)){
			this.getSession().setAttribute(SecurityConstants.PARAM_KEY_LONIN_RANDOM, random);
		}else{
			this.getSession().setAttribute(SecurityConstants.PARAM_KEY_PAY_RANDOM, random);
		}
		
		Map<String, Object> result = new HashMap<>();
		result.put("success", true);
		result.put("random", random);
		result.put("modulus1", SecurityConstants.KEY_PUBLIC_MODULUS1);
		result.put("exponent1", SecurityConstants.KEY_PUBLIC_EXPONENT1);
		result.put("modulus2", SecurityConstants.KEY_PUBLIC_MODULUS2);
		result.put("exponent2", SecurityConstants.KEY_PUBLIC_EXPONENT2);
		return ResultUtils.renderSuccessResult(result);
	}

}
