package com.infohold.el.base.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
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
import com.infohold.core.web.controller.BaseController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.el.ElConstants;
import com.infohold.el.base.model.ContactWays;

@RestController
@RequestMapping("/el/base/")
public class CommonController extends BaseController {
	
	@Autowired
	private GenericManager<ContactWays, String> contactWaysManager;
	/**
	 * web端当前登录用户信息 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "user/my", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forCurrentUserInfo() {
		Object user = this.getSession().getAttribute(ElConstants.USER_KEY);
		return ResultUtils.renderSuccessResult(user);
	}
}
