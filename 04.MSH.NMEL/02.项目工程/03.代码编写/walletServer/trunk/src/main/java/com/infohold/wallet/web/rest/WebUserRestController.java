package com.infohold.wallet.web.rest;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import com.infohold.el.base.model.User;

@RestController
@RequestMapping("/wallet/web")
public class WebUserRestController extends BaseRestController {
	@Autowired
	private GenericManager<User, String> userManager;
	@RequestMapping(value = "/showsession", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTest() {
		Enumeration<String> names = this.getSession().getAttributeNames();
		Map<String,Object> session = new HashMap<String,Object>();
		while(names.hasMoreElements()){
			String name = names.nextElement();
			Object value  =  this.getSession().getAttribute(name);
			System.out.println("********  "+name+" : " + value);
		}
		return ResultUtils.renderSuccessResult(session);
	}
	
	@RequestMapping(value = "/user/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}
		User model = JSONUtils.deserialize(data, User.class);

		StringBuffer jql = new StringBuffer("from User user where 1=1 ");
		List<String> values = new ArrayList<String>();
		if (null != model) {
			if (StringUtils.isNotBlank(model.getName())) {
				jql.append(" and user.name like ?");
				values.add("%" + model.getName() + "%");
			}
			if (StringUtils.isNotBlank(model.getGender())) {
				jql.append(" and user.gender = ?");
				values.add(model.getGender());
			}
			if (StringUtils.isNotBlank(model.getMobile())) {
				jql.append(" and user.mobile = ?");
				values.add(model.getMobile());
			}
			if (StringUtils.isNotBlank(model.getIdCardNo())) {
				jql.append(" and user.idCardNo = ?");
				values.add(model.getIdCardNo());
			}
		}

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.userManager.findPage(page);

		return ResultUtils.renderSuccessResult(page);
	}
	
	/*
	 * 用户信息查询
	 */
	@RequestMapping(value = "/user/{userId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("userId") String userId, @RequestParam(value = "data") String data) {
		User model = JSONUtils.deserialize(data, User.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		StringBuffer jql = new StringBuffer(
				"select distinct user,appUser from User user, AppUser appUser where user.id=appUser.userId");
		List<String> values = new ArrayList<String>();
		jql.append(" and appUser.userId = ?");
		values.add(userId);
		
		if (StringUtils.isNotBlank(model.getName())) {
			jql.append(" and user.name like ?");
			values.add("%" + model.getName() + "%");
		}
		if (StringUtils.isNotBlank(model.getGender())) {
			jql.append(" and user.gender = ?");
			values.add(model.getGender());
		}
		if (StringUtils.isNotBlank(model.getMobile())) {
			jql.append(" and user.mobile = ?");
			values.add(model.getMobile());
		}
		if (StringUtils.isNotBlank(model.getIdCardNo())) {
			jql.append(" and user.idCardNo = ?");
			values.add(model.getIdCardNo());
		}

		Page page = new Page();
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.userManager.findPage(page);

		return ResultUtils.renderSuccessResult(page);
	}
}
