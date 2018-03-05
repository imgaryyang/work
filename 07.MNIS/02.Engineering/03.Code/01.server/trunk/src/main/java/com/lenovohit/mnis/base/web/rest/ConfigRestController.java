  package com.lenovohit.mnis.base.web.rest;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.authority.web.rest.AuthorityRestController;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.mnis.base.model.Config;

/**
 * 配置管理
 * 
 */
@RestController
@RequestMapping("/mnis/base/config")
public class ConfigRestController extends AuthorityRestController {

	@Autowired
	private GenericManager<Config, String> configManager;
	
	@RequestMapping(value = "/list/{system}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getSystemCongfigs(@PathVariable("system") String system){
		List<Config> configs = this.configManager.find("from Config where system = ? ", system);
		return ResultUtils.renderPageResult(configs);
	}
	
}
