package com.lenovohit.hcp.base.web.rest;


import java.util.ArrayList;
import java.util.List;

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
import com.lenovohit.hcp.base.model.HcpAccount;
import com.lenovohit.hcp.base.model.HcpUser;

/**
 * 账户基本信息管理
 */
@RestController
@RequestMapping("/hcp/base/account")
public class AccountRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<HcpAccount, String> hcpAccountManager;
	@Autowired
	private GenericManager<HcpUser, String> hcpUserManager;
	
	/**
	 * 查询登录账户列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<HcpAccount> models = hcpAccountManager.findAll();
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 根据user id取用户对应的登录账户号
	 * @param userId
	 * @return
	 */
	@RequestMapping(value = "/listByUser/{userId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forUserAccounts(@PathVariable("userId") String userId) {
		HcpUser user = this.hcpUserManager.get(userId);
		HcpUser current = this.getCurrentUser();
		if(user == null)return ResultUtils.renderFailureResult("不存在的用户");
		//此校验暂时不做（根据用户id进行查询）
		//if(!user.getHosId().equals(current.getHosId()))return ResultUtils.renderFailureResult("不允许修改其他医院的用户账户信息");
		List<HcpAccount> models = hcpAccountManager.find("from HcpAccount account where userId = ? ", userId);
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 翻页显示登录账户列表
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data){
		HcpAccount query =  JSONUtils.deserialize(data, HcpAccount.class);
		StringBuilder jql = new StringBuilder( " from HcpAccount where 1=1 ");
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
		
		hcpAccountManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
	}
	
	/**
	 * 创建登录账户
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreate(@RequestBody String data){
		HcpAccount model =  JSONUtils.deserialize(data, HcpAccount.class);
		
		if (StringUtils.isEmpty(model.getUsername()))
			return ResultUtils.renderFailureResult("请填写登录账户名！");
		
		List<HcpAccount> accounts = (List<HcpAccount>)hcpAccountManager.find("from HcpAccount where username = '" + model.getUsername() + "' ");
		if (accounts.size() > 0)
			return ResultUtils.renderFailureResult("您填写的登录账户名已经存在，请重新填写！");
		
		model.setPassword("666666");
		AuthUtils.encryptAccount(model);
		//TODO 校验
		HcpAccount saved = this.hcpAccountManager.save(model);
		
		return ResultUtils.renderSuccessResult(saved);
	}
	
	/**
	 * 修改登录账户
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		HcpAccount model =  JSONUtils.deserialize(data, HcpAccount.class);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		this.hcpAccountManager.save(model);
		
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 重置密码
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/restPwd/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result resetPwd(@PathVariable("id") String id) {
		HcpAccount model = this.hcpAccountManager.get(id);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		model.setPassword("666666");
		AuthUtils.encryptAccount(model);
		this.hcpAccountManager.save(model);
		
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 修改密码
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/changePwd", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forChangePwd(@RequestBody String data) {
		HcpAccount model =  JSONUtils.deserialize(data, HcpAccount.class);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("用户不存在");
		}
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder(" from HcpAccount where userId = ? ");
		values.add(model.getId());
		
		HcpAccount account = this.hcpAccountManager.findOne(jql.toString(), values);
		model.setUsername(account.getUsername());

		AuthUtils.encryptAccount(model);
		if(model.getPassword().equals(account.getPassword())){
			account.setPassword(model.getNewPassword());
			AuthUtils.encryptAccount(account);
			this.hcpAccountManager.save(account);
		}else{
			return ResultUtils.renderFailureResult("原密码输入错误，请重新输入！");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 删除登录账户
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id){
		try {
			this.hcpAccountManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 删除指定的多个登录账户
	 * @param data
	 * @return
	 */
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
			System.out.println(idSql.toString());
			this.hcpAccountManager.executeSql(idSql.toString(), idvalues.toArray());
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
