package com.infohold.elh.base.web.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.infohold.bdrp.Constants;
import com.infohold.bdrp.org.model.Org;
import com.infohold.core.dao.Page;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.JSONUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.elh.base.model.Department;
import com.infohold.elh.base.model.Hospital;

/**
 * 科室管理
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/elh/department")
public class DepartmentRestController extends BaseRestController {
	@Autowired
	private GenericManager<Department, String> departmentManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;

	/******************************************************机构端方法*************************************************************************/
	/**
	 * ELH_HOSP_005	查询当前机构科室列表	HMP1.2		1
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return RESTful
	 */
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		
		Department model = JSONUtils.deserialize(data, Department.class);
		StringBuilder sb = new StringBuilder(" from Department where hospitalId = ? and flag = ? ");
		List<String> cdList = new ArrayList<String>();
		cdList.add(orgId);
		cdList.add("1");
		if(model != null){
//			if (model.getHospitalId() != null) {
//				sb.append(" and hospitalId = ?");
//				cdList.add(model.getHospitalId());
//			}
			if (model.getType() != null) {
				sb.append(" and type like ?");
				cdList.add("%" + model.getType() + "%");
			}
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(sb.toString());
		page.setValues(cdList.toArray());
		this.departmentManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}
	/**
	 * ELH_HOSP_007	维护医院科室信息	HMP1.2		1
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		Hospital hospital = this.hospitalManager.get(orgId);
		if(null==hospital){
			return ResultUtils.renderFailureResult("没有对应的医院");
		}		
		Department department = JSONUtils.deserialize(data, Department.class);
		department.setHospitalId(orgId);
		department.setFlag("1");
		department = this.departmentManager.save(department);
		return ResultUtils.renderSuccessResult(department);
	}
	/**
	 * ELH_HOSP_006	查询医院科室信息	HMP1.2		1
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		Department department = this.departmentManager.get(id);
		/*Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		if(!orgId.equals(department.getHospitalId())){
			return ResultUtils.renderFailureResult("科室不属于当前机构");
		}*/
		return ResultUtils.renderSuccessResult(department);
	}
	/**
	 * ELH_HOSP_007	维护医院科室信息	HMP1.2		1
	 * @param id
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id, @RequestBody String data) {
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		Department department = this.departmentManager.get(id);
		if(!orgId.equals(department.getHospitalId())){
			return ResultUtils.renderFailureResult("科室不属于当前机构");
		}
		Hospital hospital = this.hospitalManager.get(orgId);
		if(null==hospital){
			return ResultUtils.renderFailureResult("没有对应的医院");
		}	
		Department param = JSONUtils.deserialize(data, Department.class);
		if(null==param)param = new Department();
		if(null!=param.getCode()){
			department.setCode(param.getCode());
		}
		if(null!=param.getName()){
			department.setName(param.getName());
		}
		if(null!=param.getAddress()){
			department.setAddress(param.getAddress());
		}
		if(null!=param.getBrief()){
			department.setBrief(param.getBrief());
		}
		if(null!=param.getDescription()){
			department.setDescription(param.getDescription());
		}
		if(null!=param.getFlag()){
			department.setFlag(param.getFlag());
		}
		department.setHospitalId(orgId);
		department.setIsSpecial(param.getIsSpecial());
		
		if(null!=param.getType()){
			department.setType(param.getType());
		}
		Department savedDepartment = this.departmentManager.save(department);
		return ResultUtils.renderSuccessResult(savedDepartment);
	}
	/**
	 * ELH_HOSP_007	设置特色科室special
	 * @param id
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/special/set/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forSetSpecial(@PathVariable("id") String id) {
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		Department department = this.departmentManager.get(id);
		if(!orgId.equals(department.getHospitalId())){
			return ResultUtils.renderFailureResult("科室不属于当前机构");
		}
		department.setIsSpecial(true);
		Department savedDepartment = this.departmentManager.save(department);
		return ResultUtils.renderSuccessResult(savedDepartment);
	}
	/**
	 * ELH_HOSP_007	设置特色科室special
	 * @param id
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/special/move/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forMoveSpecial(@PathVariable("id") String id) {
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		Department department = this.departmentManager.get(id);
		if(!orgId.equals(department.getHospitalId())){
			return ResultUtils.renderFailureResult("科室不属于当前机构");
		}
		department.setIsSpecial(false);
		Department savedDepartment = this.departmentManager.save(department);
		return ResultUtils.renderSuccessResult(savedDepartment);
	}
	/**
	 * ELH_HOSP_008	删除科室	HMP1.2		1 TODO 改成上下线
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		Department department = this.departmentManager.get(id);
		if(!orgId.equals(department.getHospitalId())){
			return ResultUtils.renderFailureResult("科室不属于当前机构");
		}
		department.setFlag("0");//逻辑删除
		department = this.departmentManager.save(department);
		return ResultUtils.renderSuccessResult(department);
	}
	/******************************************************机构端方法end*************************************************************************/
	/******************************************************app端方法*************************************************************************/
	/**
	 * ELH_HOSP_005	根据医院查询科室列表	HMP1.2		1
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/app/listByHos/{hospitalId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAll(@PathVariable(value = "hospitalId") String hospitalId,@RequestParam(value = "data", defaultValue = "") String data) {
		Department department = JSONUtils.deserialize(data, Department.class);
		StringBuilder sb = new StringBuilder();
		sb.append(" from Department where hospitalId = ? and flag = ? ");
		List<Object> cdList = new ArrayList<Object>();
		cdList.add(hospitalId);
		cdList.add("1");
		if(null!= department){
			if (department.getType() != null) {
				sb.append(" and type like ?");
				cdList.add("%" + department.getType() + "%");
			}
			if (department.getIsSpecial()) {
				sb.append(" and isSpecial = ?");
				cdList.add(department.getIsSpecial());
			}
		}
		List<Department> result = this.departmentManager.find(sb.toString(), cdList.toArray());
		Page page = new Page();
		page.setResult(result);
		page.setTotal((null==result)?0:result.size());
		return ResultUtils.renderSuccessResult(page);
	}
	/**
	 * ELH_HOSP_005	app查询科室列表
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/app/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAppList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		Department model = JSONUtils.deserialize(data, Department.class);
		StringBuilder sb = new StringBuilder(" from Department where flag = ? ");
		List<Object> cdList = new ArrayList<Object>();
		cdList.add("1");
		if(model != null){
			if (model.getHospitalId() != null) {
				sb.append(" and hospitalId = ?");
				cdList.add(model.getHospitalId());
			}
			if (model.getType() != null) {
				sb.append(" and type like ?");
				cdList.add("%" + model.getType() + "%");
			}
			if (model.getIsSpecial()) {
				sb.append(" and isSpecial = ?");
				cdList.add(model.getIsSpecial());
			}
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(sb.toString());
		page.setValues(cdList.toArray());
		this.departmentManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	
	}
	/******************************************************app端方法end*************************************************************************/
	/******************************************************运营端方法*************************************************************************/
	/******************************************************运营端方法end*************************************************************************/
	
}




