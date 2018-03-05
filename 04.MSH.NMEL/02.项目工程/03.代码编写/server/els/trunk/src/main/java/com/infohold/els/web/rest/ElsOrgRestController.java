package com.infohold.els.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.infohold.bdrp.Constants;
import com.infohold.bdrp.org.model.Org;
import com.infohold.core.exception.BaseException;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.StringUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.els.model.ElsOrg;

@RestController
@RequestMapping("/els/elsorg")
public class ElsOrgRestController extends BaseRestController {
	
	@Autowired
	private GenericManager<ElsOrg, String> elsOrgManager;
	
	/**
	 * 查询代发机构信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo() {
		
		String orgId = ((Org) this.getSession().getAttribute(Constants.ORG_KEY)).getId();

		if (StringUtils.isEmpty(orgId)){
			throw new BaseException("机构id为空！请重新登录！");
		}
		
		ElsOrg model = elsOrgManager.get(orgId);
		
		if (null == model) {
			throw new BaseException("没有此记录！");
		}
		
		return ResultUtils.renderSuccessResult(model);
	}
}
