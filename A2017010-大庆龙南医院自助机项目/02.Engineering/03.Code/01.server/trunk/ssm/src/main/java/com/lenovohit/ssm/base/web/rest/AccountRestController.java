package com.lenovohit.ssm.base.web.rest;


import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.authority.utils.AuthUtils;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.Account;
import com.lenovohit.ssm.base.model.User;

/**
 * 账户基本信息管理
 */
@RestController
@RequestMapping("/ssm/base/account")
public class AccountRestController extends SSMBaseRestController {
	private final Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private GenericManager<Account, String> accountManager;
	@Autowired
	private GenericManager<User, String> userManager;
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Account> models = accountManager.findAll();
		return ResultUtils.renderSuccessResult(models);
	}
	@RequestMapping(value = "/listByUser/{userId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forUserAccounts(@PathVariable("userId") String userId) {
		User user = this.userManager.get(userId);
		User current = this.getCurrentUser();
		if(user == null)return ResultUtils.renderFailureResult("不存在的用户");
		if(!user.getHosId().equals(current.getHosId()))return ResultUtils.renderFailureResult("不允许修改其他医院的用户账户信息");
		List<Account> models = accountManager.find("from Account account where userId = ? ", userId);
		return ResultUtils.renderSuccessResult(models);
	}
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data){
		Account query =  JSONUtils.deserialize(data, Account.class);
		StringBuilder jql = new StringBuilder( " from Account where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getUsername())){
			jql.append(" and username like ? ");
			values.add("%"+query.getUsername()+"%");
		}
		if(!StringUtils.isEmpty(query.getUserId())){
			jql.append(" and userId like ? ");
			values.add("%"+query.getUserId()+"%");
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		
		accountManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
	}
	
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreate(@RequestBody String data){
		Account model =  JSONUtils.deserialize(data, Account.class);
		model.setPassword("666666");
		AuthUtils.encryptAccount(model);
		//TODO 校验
		Account saved = this.accountManager.save(model);
		
		return ResultUtils.renderSuccessResult(saved);
	}
	
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		Account model =  JSONUtils.deserialize(data, Account.class);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		this.accountManager.save(model);
		
		return ResultUtils.renderSuccessResult();
	}
	@RequestMapping(value = "/restPwd/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result resetPwd(@PathVariable("id") String id) {
		Account model = this.accountManager.get(id);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		model.setPassword("666666");
		AuthUtils.encryptAccount(model);
		this.accountManager.save(model);
		
		return ResultUtils.renderSuccessResult();
	}
	@RequestMapping(value = "/changePwd", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forChangePwd(@RequestBody String data) {
		Account model =  JSONUtils.deserialize(data, Account.class);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Account account = this.accountManager.get(model.getId());
		account.setPassword(model.getPassword());
		AuthUtils.encryptAccount(model);
		this.accountManager.save(model);
		
		return ResultUtils.renderSuccessResult();
	}
	
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id){
		try {
			this.accountManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		@SuppressWarnings("rawtypes")
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			//idSql.append("DELETE FROM HCP_ACCOUNT WHERE ID IN (");
			idSql.append(" UPDATE HCP_ACCOUNT SET STATUS='0' WHERE ID IN (");
			for(int i=0;i<ids.size();i++){
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size()-1)idSql.append(",");
			}
			idSql.append(")");
			logger.info(idSql.toString());
			this.accountManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}

}
