package com.lenovohit.els.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.Constants;
import com.lenovohit.bdrp.org.model.Org;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.els.model.ElsOrg;

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
