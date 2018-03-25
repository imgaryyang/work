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
import com.lenovohit.hwe.mobile.app.model.App;
import com.lenovohit.hwe.mobile.core.web.rest.MobileBaseRestController;

@RestController
@RequestMapping("hwe/app/base")
public class AppRestController extends MobileBaseRestController {
	@Autowired
	private GenericManager<App, String> appManager;
	
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		App model = this.appManager.get(id);
		return ResultUtils.renderPageResult(model);
	}
	
}
