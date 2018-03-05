package com.lenovohit.el.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.el.base.model.HomeMenu;

/**
 * APP用户管理
 * 
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/el/homeMenu")
public class HomeMenuRestController extends BaseRestController {
	
	@Autowired
	private GenericManager<HomeMenu, String> homeMenuManager;

	/*
	 * ELB_OPT_001 5.9.1 查询易民生首页菜单列表
	 */
	@RequestMapping(value = "/getHomeMemu", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forGetHomeMemu(@RequestParam(value = "data", defaultValue = "") String data) {
		// 数据校验
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		HomeMenu model = JSONUtils.deserialize(data, HomeMenu.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		
		// 业务数据校验
		if (StringUtils.isEmpty(model.getAppId())) {
			throw new BaseException("应用编号为空！");
		}
		
		String jql = "from HomeMenu u where u.appId = ? ";
		List<HomeMenu> list = homeMenuManager.find(jql, model.getAppId());

		return ResultUtils.renderSuccessResult(list);
	}

}
