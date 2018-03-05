package com.infohold.bdrp.webapp.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.infohold.core.web.controller.BaseController;


@Controller
@RequestMapping("/")
public class HomeController  extends BaseController {
	
	@RequestMapping(method=RequestMethod.GET)
	public String index(Model model){
		return "index";
	}
	
	
	@RequestMapping(value="/homepage1",method=RequestMethod.GET)
	public String forHomePage(){
		return "main";
	}
	
}
