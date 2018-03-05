package com.lenovohit.hwe.mobile.app.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.mobile.app.model.Application;
import com.lenovohit.hwe.mobile.core.web.rest.MobileBaseRestController;

@RestController
@RequestMapping("hwe/app/aboutUs")
public class ContactUsRestController extends MobileBaseRestController {
	@Autowired
	private GenericManager<Application, String> applicationManager;
	
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Application> application=applicationManager.findAll();
		return ResultUtils.renderSuccessResult(application.get(0));
	}
}
