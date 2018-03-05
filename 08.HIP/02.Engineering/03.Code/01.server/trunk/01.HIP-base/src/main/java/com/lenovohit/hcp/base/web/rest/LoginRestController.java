package com.lenovohit.hcp.base.web.rest;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextAware;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.authority.shiro.authc.AuthAccountToken;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpAccount;
import com.lenovohit.hcp.base.model.HcpUser;

@RestController
@RequestMapping("/hcp/base/auth")
public class LoginRestController extends HcpBaseRestController  implements ApplicationContextAware {
	
	@Autowired
	private GenericManager<Department, String> departmentManager;
	
	/**
	 * 用户登录
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/login",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forLogin(@RequestBody String data) {
		try {
			HcpAccount account =  JSONUtils.deserialize(data, HcpAccount.class);
			Subject subject = SecurityUtils.getSubject();
			AuthAccountToken token = new AuthAccountToken(account);
			subject.login(token);
			HcpUser user = this.getCurrentUser();
			return ResultUtils.renderSuccessResult(user);
		} catch (AuthenticationException e) {
			return ResultUtils.renderFailureResult("账户名或密码错误，请重新输入！");
		} catch (Exception e) {
			return ResultUtils.renderFailureResult("无法检索到此用户，请重新输入！");
		}
	}
	
	/**
	 * 用户登出
	 * @return
	 */
	@RequestMapping(value="/logout",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forLogout() {
		try {
			Subject subject = SecurityUtils.getSubject();
			subject.logout();
		} catch (AuthenticationException e) {
			return ResultUtils.renderFailureResult("账户退出异常！");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 获取当前登录用户的用户信息
	 * @return
	 */
	@RequestMapping(value="/userInfo",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCurrentUser() {
		HcpUser user = this.getCurrentUser();
		return ResultUtils.renderSuccessResult(user);
	}
	
	/**
	 * 记录用户选择的登录科室
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/chooseLoginDept/{id}",method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forChooseLoginDept(@PathVariable("id") String id) {
		Department dept = this.departmentManager.get(id);
		HcpUser currentUser = this.getCurrentUser();
		currentUser.setLoginDepartment(dept);
		return ResultUtils.renderSuccessResult(currentUser);
	}
}
