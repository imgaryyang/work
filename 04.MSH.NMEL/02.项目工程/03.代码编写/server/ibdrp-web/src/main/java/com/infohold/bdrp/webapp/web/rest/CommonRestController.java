package com.infohold.bdrp.webapp.web.rest;

import java.io.IOException;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.infohold.bdrp.Constants;
import com.infohold.bdrp.authority.model.AuthUser;
import com.infohold.core.utils.FileUtils;
import com.infohold.core.web.rest.BaseRestController;

@RestController
@RequestMapping("/")
public class CommonRestController extends BaseRestController {
	
	@RequestMapping(value="homepage")
	public ModelAndView forHomePage(){
		ModelAndView mv = new ModelAndView("homepage");
		
		AuthUser u = (AuthUser) this.getSession().getAttribute(Constants.USER_KEY);
		if(!u.getId().equals(Constants.APP_SUPER_ID)){
			mv.setViewName("redirect:login");
		}
		
		PathMatchingResourcePatternResolver patternResolver = new PathMatchingResourcePatternResolver();
		try {
			Resource[] resources = patternResolver.getResources("classpath*:config/menus-default.json");
			for(Resource r : resources){
				String json = FileUtils.readStreamToString(r.getInputStream(), FileUtils.FILE_CHARSET_UTF8);
				mv.addObject("menusJson", json);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return mv;
		
	}
	
	@RequestMapping(value="login")
	public ModelAndView forLogin(){
		ModelAndView mv = new ModelAndView("redirect:/bdrp/login.jsp");
		return mv;
		
	}
	
}
