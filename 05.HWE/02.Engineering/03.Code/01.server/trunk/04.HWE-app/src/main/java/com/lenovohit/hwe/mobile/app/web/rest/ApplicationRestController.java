package com.lenovohit.hwe.mobile.app.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.mobile.app.model.Application;
import com.lenovohit.hwe.mobile.core.web.rest.MobileBaseRestController;

@RestController
@RequestMapping("hwe/app/base")
public class ApplicationRestController extends MobileBaseRestController {
	@Autowired
	private GenericManager<Application, String> applicationManager;
	
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		Application model = this.applicationManager.get(id);
		return ResultUtils.renderPageResult(model);
	}
	
}
