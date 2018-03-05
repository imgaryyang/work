package com.infohold.el.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.infohold.core.dao.Page;
import com.infohold.core.exception.BaseException;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.JSONUtils;
import com.infohold.core.utils.StringUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.el.base.model.UserApp;

/**
 * 用户APP安装情况管理
 * 
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/el/userApp")
public class UserAppRestController extends BaseRestController {
	
	@Autowired
	private GenericManager<UserApp, String> userAppManager;

	/*
	 * ELH_MNG_013 查询患者（用户）已关联App 需标出首次注册APP 1
	 */
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAppList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data") String data) {

		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}
		
		UserApp model = JSONUtils.deserialize(data, UserApp.class);

		StringBuffer jql = new StringBuffer("from UserApp ua where 1=1 ");
		List<String> values = new ArrayList<String>();
		if(null != model){
			if(StringUtils.isNotBlank(model.getAppId())){
				jql.append(" and ua.appId = ?");
				values.add(model.getAppId());
			}
			if(StringUtils.isNotBlank(model.getUserId())){
				jql.append(" and ua.userId = ?");
				values.add(model.getUserId());
			}
			if(StringUtils.isNotBlank(model.getIos())){
				jql.append(" and ua.ios = ?");
				values.add(model.getIos());
			}
			if(StringUtils.isNotBlank(model.getAndroid())){
				jql.append(" and ua.android = ?");
				values.add(model.getAndroid());
			}
			if(StringUtils.isNotBlank(model.getVersion())){
				jql.append(" and ua.version = ?");
				values.add(model.getVersion());
			}
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.userAppManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}
}
