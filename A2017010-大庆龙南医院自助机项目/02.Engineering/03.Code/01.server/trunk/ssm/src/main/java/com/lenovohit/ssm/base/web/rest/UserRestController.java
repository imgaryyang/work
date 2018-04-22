package com.lenovohit.ssm.base.web.rest;


import java.util.ArrayList;
import java.util.Date;
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
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.User;

/**
 * 用户基本信息管理
 */
@RestController
@RequestMapping("/ssm/base/user")
public class UserRestController extends SSMBaseRestController {

	@Autowired
	private GenericManager<User, String> userManager;
	//private GenericManager<HcpAccount, String> hcpAccountManager;
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<User> models = userManager.findAll();
		return ResultUtils.renderSuccessResult(models);
	}
	
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data){
		User current = this.getCurrentUser();
		User query =  JSONUtils.deserialize(data, User.class);
		StringBuilder jql = new StringBuilder( " from User where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getHosId())){
			jql.append(" and enName like ? ");
			values.add("%"+query.getHosId()+"%");
		}
		if(!StringUtils.isEmpty(query.getName())){
			jql.append(" and name like ? ");
			values.add("%"+query.getName()+"%");
		}
		if(!StringUtils.isEmpty(query.getIdNo())){
			jql.append(" and idNo like ? ");
			values.add("%"+query.getIdNo()+"%");
		}
		if(!StringUtils.isEmpty(query.getMobile())){
			jql.append(" and mobile like ? ");
			values.add("%"+query.getMobile()+"%");
		}
		jql.append(" and hosId = ? ");
		values.add(current.getHosId());
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		userManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
	}
	/**
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateUser(@RequestBody String data){
		User model =  JSONUtils.deserialize(data, User.class);
		User current = this.getCurrentUser();
		Date now =  new Date();
		String time = DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss");
		model.setCreateDate(time);
		model.setEffectDate(time);
		model.setHosId(current.getHosId());
		//TODO 校验
		User saved = this.userManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}
	
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		User model =  JSONUtils.deserialize(data, User.class);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		this.userManager.save(model);
		return ResultUtils.renderSuccessResult();
	}
	
	@RequestMapping(value = "/enable/{id}",method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forEnableUser(@PathVariable("id") String id){
		try {	
			User user = this.userManager.get(id);
			user.setActive(true);
			user.setExpired(true);
			user.setExpirDate(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
			this.userManager.save(user);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	@RequestMapping(value = "/disable/{id}",method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forDisableUser(@PathVariable("id") String id){
		try {	
			User user = this.userManager.get(id);
			user.setActive(false);
			user.setExpired(true);
			user.setExpirDate(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
			this.userManager.save(user);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	@RequestMapping(value = "/enableAll",method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forEnableAll(@RequestBody String data){
		@SuppressWarnings("rawtypes")
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder userSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			userSql.append(" UPDATE HCP_USER SET ACTIVE='1'  WHERE ID IN (");
			for(int i=0;i<ids.size();i++){
				userSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size()-1)userSql.append(",");
			}
			userSql.append(")");
			this.userManager.executeSql(userSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("启用失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	@RequestMapping(value = "/disableAll",method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forDisableAll(@RequestBody String data){
		@SuppressWarnings("rawtypes")
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder userSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			userSql.append(" UPDATE HCP_USER SET DELETE_FLAG='0'  WHERE ID IN (");
			for(int i=0;i<ids.size();i++){
				userSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size()-1)userSql.append(",");
			}
			userSql.append(")");
			this.userManager.executeSql(userSql.toString(), idvalues.toArray());
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
