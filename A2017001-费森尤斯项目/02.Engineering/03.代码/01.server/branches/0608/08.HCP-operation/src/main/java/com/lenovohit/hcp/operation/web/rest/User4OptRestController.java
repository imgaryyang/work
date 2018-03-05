package com.lenovohit.hcp.operation.web.rest;

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
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.HcpUserDept;
import com.lenovohit.hcp.base.utils.PinyinUtil;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;

/**
 * 用户基本信息管理
 */
@RestController
@RequestMapping("/hcp/operation/user")
public class User4OptRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<HcpUser, String> hcpUserManager;
	// private GenericManager<HcpAccount, String> hcpAccountManager;

	@Autowired
	private GenericManager<HcpUserDept, String> hcpUserDeptManager;
	
	@Autowired
	private GenericManager<Department, String> departmentManager;

	/**
	 * 查询所有科室列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/listDept", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listDept(@RequestParam(value = "data", defaultValue = "") String data) {
		Department query = JSONUtils.deserialize(data, Department.class);
		StringBuilder jql = new StringBuilder(" from Department where 1=1 ");
		List<Object> values = new ArrayList<Object>();

		if (!StringUtils.isEmpty(query.getHosId())) {
			jql.append(" and hosId = ? ");
			values.add(query.getHosId());
		}

		List<Department> models = departmentManager.find(jql.toString());
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 查询所有用户列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<HcpUser> models = hcpUserManager.findAll();
		return ResultUtils.renderSuccessResult(models);
	}

	/**
	 * 根据条件查询用户列表
	 * 
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		System.err.println("### forPage");
		
		HcpUser current = this.getCurrentUser();
		HcpUser query = JSONUtils.deserialize(data, HcpUser.class);
		StringBuilder jql = new StringBuilder(" from HcpUser where 1=1 ");
		List<Object> values = new ArrayList<Object>();

		if (!StringUtils.isEmpty(query.getDeptId())) {
			jql.append(" and deptId = ? ");
			values.add(query.getDeptId());
		}
		if (!StringUtils.isEmpty(query.getName())) {
			jql.append(" and name like ? ");
			values.add("%" + query.getName() + "%");
		}
		if (!StringUtils.isEmpty(query.getIdNo())) {
			jql.append(" and idNo like ? ");
			values.add("%" + query.getIdNo() + "%");
		}
		if (!StringUtils.isEmpty(query.getMobile())) {
			jql.append(" and mobile like ? ");
			values.add("%" + query.getMobile() + "%");
		}
		if (!StringUtils.isEmpty(query.getHosId())) {
			jql.append(" and hosId = ? ");
			values.add(query.getHosId());
		}
		

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		hcpUserManager.findPage(page);

		return ResultUtils.renderPageResult(page);
	}

	/**
	 * 新增用户信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/* TEXT_PLAIN_UTF_8 */)
	public Result forCreateUser(@RequestBody String data) {
		HcpUser model = JSONUtils.deserialize(data, HcpUser.class);
		HcpUser current = this.getCurrentUser();
		Date now = new Date();
		String time = DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss");
		model.setCreateDate(time);
		model.setEffectDate(time);
		model.setHosId(current.getHosId());
		model.setPinyin(PinyinUtil.getFullSpell(model.getName()));
		// TODO 校验
		HcpUser saved = this.hcpUserManager.save(model);
		saved.setLoginDepts(model.getLoginDepts());
		saved.setLoginDeptsCode(model.getLoginDeptsCode());
		saved.setLoginDeptsName(model.getLoginDeptsName());

		// 更新用户登录部门
		this.updateUserDept(saved);

		return ResultUtils.renderSuccessResult(saved);
	}

	/**
	 * 修改用户信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		HcpUser model = JSONUtils.deserialize(data, HcpUser.class);
		if (model == null || StringUtils.isBlank(model.getId())) {
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		model.setPinyin(PinyinUtil.getFullSpell(model.getName()));

		HcpUser saved = this.hcpUserManager.save(model);
		saved.setLoginDepts(model.getLoginDepts());
		saved.setLoginDeptsCode(model.getLoginDeptsCode());
		saved.setLoginDeptsName(model.getLoginDeptsName());

		// 更新用户登录部门
		this.updateUserDept(saved);
		return ResultUtils.renderSuccessResult();
	}

	/**
	 * 更新用户登录部门信息
	 * 
	 * @return
	 * @throws Exception
	 */
	private void updateUserDept(HcpUser user) {
		if (StringUtils.isEmpty(user.getLoginDepts()))
			return;
		// String ids = user.getLoginDepts().replaceAll("\\[",
		// "(").replaceAll("\\]", ")");
		String loginDepts = user.getLoginDepts().replaceAll("\\[", "").replaceAll("\\]", "").replaceAll("\"", "");
		String[] depts = loginDepts.split(",");
		String[] deptsCode = user.getLoginDeptsCode().split(";");
		String[] deptsName = user.getLoginDeptsName().split(";");

		// 删除已有登录科室
		hcpUserDeptManager.executeSql("DELETE FROM HCP_USER_DEPT WHERE USER_ID = '" + user.getId() + "'");

		// 插入新的登录部门
		if (depts.length > 0)
			for (int i = 0; i < depts.length; i += 1) {
				HcpUserDept model = new HcpUserDept();
				model.setUserId(user.getId());
				model.setUserName(user.getName());
				model.setDeptId(depts[i]);
				model.setDeptCode(deptsCode[i]);
				model.setDeptName(deptsName[i]);
				model.setStopFlag("1");
				hcpUserDeptManager.save(model);
			}
	}

	/**
	 * 根据用户id取登录科室
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/depts", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDeptsList(@RequestParam(value = "data", defaultValue = "") String data) {
		HcpUserDept model = JSONUtils.deserialize(data, HcpUserDept.class);
		List<HcpUserDept> models = hcpUserDeptManager.find(
				" from HcpUserDept u where u.deptId IS NOT NULL and u.deptId <> '' and u.userId = ?",
				model.getUserId());
		return ResultUtils.renderSuccessResult(models);
	}

	/**
	 * 根据用户id数组取登录科室
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/deptsByIds", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDeptsListByIds(@RequestParam(value = "data", defaultValue = "") String data) {
		List ids =  JSONUtils.deserialize(data, List.class);
		// 需要组合的id
		StringBuffer idsSymbol = new StringBuffer("");
		for(int i = 0; i < ids.size(); i++){
			idsSymbol.append("'" + ids.get(i).toString() +"'");
			if(i != ids.size() - 1) idsSymbol.append(",");
		}
		
		StringBuffer jql = new StringBuffer(" from HcpUserDept u where u.deptId IS NOT NULL and u.deptId <> '' and u.userId in (").append(idsSymbol.toString()).append(")");
		List<HcpUserDept> models = hcpUserDeptManager.find(jql.toString());
		return ResultUtils.renderSuccessResult(models);
	}

	/**
	 * 根据科室取医生
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/doctorsInDept", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDeptDoctors(@RequestParam(value = "data", defaultValue = "") String data) {
		HcpUser model = JSONUtils.deserialize(data, HcpUser.class);
		List<HcpUser> models = hcpUserManager.find(" from HcpUser u where u.deptId = ?", model.getDeptId());
		return ResultUtils.renderSuccessResult(models);
	}

	/**
	 * 根据用户id数组取用户基本信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/users", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forUsersList(@RequestParam(value = "data", defaultValue = "") String data) {

		// 取当前用户
		HcpUser user = this.getCurrentUser();

		List ids = JSONUtils.deserialize(data, List.class);
		StringBuffer sb = new StringBuffer("");
		List<String> idvalues = new ArrayList<String>();
		idvalues.add(user.getHosId());
		for (int i = 0; i < ids.size(); i++) {
			idvalues.add(ids.get(i).toString());
			sb.append("?");
			if (i != ids.size() - 1)
				sb.append(",");
		}

		String jql = " from HcpUser u where u.hosId = ? and u.id in (" + sb.toString() + ")";

		List<HcpUser> models = hcpUserManager.find(jql, idvalues.toArray());
		return ResultUtils.renderSuccessResult(models);
	}

	@RequestMapping(value = "/enable/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forEnableUser(@PathVariable("id") String id) {
		try {
			HcpUser user = this.hcpUserManager.get(id);
			user.setActive(true);
			user.setExpired(true);
			user.setExpirDate(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
			this.hcpUserManager.save(user);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/disable/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forDisableUser(@PathVariable("id") String id) {
		try {
			HcpUser user = this.hcpUserManager.get(id);
			user.setActive(false);
			user.setExpired(true);
			user.setExpirDate(DateUtils.date2String(new Date(), "yyyy-MM-dd HH:mm:ss"));
			this.hcpUserManager.save(user);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/enableAll", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forEnableAll(@RequestBody String data) {
		@SuppressWarnings("rawtypes")
		List ids = JSONUtils.deserialize(data, List.class);
		StringBuilder userSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			userSql.append(" UPDATE HCP_USER SET ACTIVE='1'  WHERE ID IN (");
			for (int i = 0; i < ids.size(); i++) {
				userSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					userSql.append(",");
			}
			userSql.append(")");
			this.hcpUserManager.executeSql(userSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("启用失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/disableAll", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forDisableAll(@RequestBody String data) {
		@SuppressWarnings("rawtypes")
		List ids = JSONUtils.deserialize(data, List.class);
		StringBuilder userSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			userSql.append(" UPDATE HCP_USER SET DELETE_FLAG='0'  WHERE ID IN (");
			for (int i = 0; i < ids.size(); i++) {
				userSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					userSql.append(",");
			}
			userSql.append(")");
			this.hcpUserManager.executeSql(userSql.toString(), idvalues.toArray());
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
