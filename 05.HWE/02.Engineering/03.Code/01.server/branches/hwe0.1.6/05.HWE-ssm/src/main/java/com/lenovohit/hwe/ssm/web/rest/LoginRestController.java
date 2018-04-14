package com.lenovohit.hwe.ssm.web.rest;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextAware;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.authority.shiro.authc.AuthAccountToken;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.impl.GenericManagerImpl;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.base.model.Config;
import com.lenovohit.hwe.org.model.Account;
import com.lenovohit.hwe.org.model.User;
import com.lenovohit.hwe.ssm.model.Machine;

@RestController("ssmLoginController")
@RequestMapping("/hwe/ssm/auth")
public class LoginRestController extends SSMBaseRestController  implements ApplicationContextAware {
	@Autowired
	private GenericManagerImpl<Config,String> configManager;
	@RequestMapping(value="/login",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forLogin(@RequestBody String data) {
		Account account =  JSONUtils.deserialize(data, Account.class);
		try {
			Subject subject = SecurityUtils.getSubject();
			AuthAccountToken token = new AuthAccountToken(account);
			subject.login(token);
		} catch (AuthenticationException e) {
			return ResultUtils.renderFailureResult();
		}
		User user = this.getCurrentUser();
		return ResultUtils.renderSuccessResult(user);
	}
	@RequestMapping(value="/logout",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forLogout() {
		try {
			Subject subject = SecurityUtils.getSubject();
			subject.logout();
		} catch (AuthenticationException e) {
			return ResultUtils.renderFailureResult();
		}
		return ResultUtils.renderSuccessResult();
	}
	
	@RequestMapping(value="/userInfo",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCurrentUser() {
		User user = this.getCurrentUser();
		return ResultUtils.renderSuccessResult(user);
	}
	
	@RequestMapping(value="/machineInfo",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCurrentMachine() {
		Machine machine = this.getCurrentMachine();
		
		Page page = new Page();
		page.setStart(0);
		page.setPageSize(10);
		page.setQuery("from Config order by sort");
		configManager.findPage(page);
		return ResultUtils.renderSuccessResult( page);
		
		// return ResultUtils.renderSuccessResult(machine);
	}
	@RequestMapping(value="/machine/config",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forMachineConfig() {
		List<Config> configs = configManager.findAll();
		Map<String,Object> configMap = new HashMap<String,Object>();
		for(Config config : configs ){
			configMap.put(
				config.getCode(),
				covertConfig(config.getType(),config.getValue())
			);
		}
		return ResultUtils.renderSuccessResult(configMap);
	}
	private Object covertConfig(String type,String value){
		
		if("string".equals(type)){
			if(StringUtils.isEmpty(value))return "";
			return value.toString();
		}
		
		if("number".equals(type)){
			if(StringUtils.isEmpty(value))return 0;
			return new BigDecimal(value.toString());
		}
		
		if("bool".equals(type)){
			if("true".equals(value))return true;
			if("false".equals(value))return false;
			return true;
		}
		if(StringUtils.isEmpty(value))return "";
		return value.toString();
	}
}
