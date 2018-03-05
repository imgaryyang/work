package com.lenovohit.el.base.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.controller.BaseController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.el.ElConstants;
import com.lenovohit.el.base.model.ContactWays;

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
