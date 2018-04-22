package com.lenovohit.ssm.app.elh.base.web.rest;

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

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.bdrp.Constants;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.app.elh.base.model.AppDepartment;
import com.lenovohit.ssm.app.elh.base.model.Hospital;
import com.lenovohit.ssm.base.model.Org;

import oracle.net.aso.l;

/**
 * 科室管理
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/hwe/app/department")
public class DepartmentRestController extends BaseRestController {
	@Autowired
	private GenericManager<AppDepartment, String> appDepartmentManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;

	
	
	@RequestMapping(value = "/demo", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result demo(){
		List<AppDepartment> list = this.appDepartmentManager.findAll();
		return ResultUtils.renderSuccessResult(list);
	}
	/******************************************************机构端方法*************************************************************************/
	/**
	 * ELH_HOSP_005	查询当前机构科室列表	HMP1.2		1
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return RESTful
	 */
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") String start,
			@PathVariable(value = "pageSize") String pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
//		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
//		if(null==loginOrg || "".equals(loginOrg)){
//			return ResultUtils.renderFailureResult("未找到当前登录机构1");
//		}
//		String orgId = loginOrg.getId();
		System.out.println("1111111111111");
		System.out.println(this.appDepartmentManager);
		String orgId = "8a942af05f53130a015f5359ac500001";
		AppDepartment model = JSONUtils.deserialize(data, AppDepartment.class);
		StringBuilder sb = new StringBuilder(" from AppDepartment where hospitalId = ? and flag = ? ");
		List<String> cdList = new ArrayList<String>();
		cdList.add(orgId);
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
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(sb.toString());
		page.setValues(cdList.toArray());
		this.appDepartmentManager.findPage(page);
		
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
			return ResultUtils.renderFailureResult("未找到当前登录机构2");
		}
		String orgId = loginOrg.getId();
		Hospital hospital = this.hospitalManager.get(orgId);
		if(null==hospital){
			return ResultUtils.renderFailureResult("没有对应的医院");
		}		
		AppDepartment department = JSONUtils.deserialize(data, AppDepartment.class);
		department.setHospitalId(orgId);
		department.setFlag("1");
		department = this.appDepartmentManager.save(department);
		return ResultUtils.renderSuccessResult(department);
	}
	/**
	 * ELH_HOSP_006	查询医院科室信息	HMP1.2		1
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/select/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		System.out.println(id);
//		JSONObject query = JSONObject.parseObject(id);
//		String depid = query.getString("id");
		AppDepartment department = this.appDepartmentManager.get(id);
//		AppDepartment department2 = this.appDepartmentManager.findOne(" from AppDepartment where id = ?", id);
		String sql = " select * from ELH_DEPARTMENT where id = '"+id+"'";
		List list = this.appDepartmentManager.findBySql(sql);
		return ResultUtils.renderSuccessResult(list);
	}
	/**
	 * ELH_HOSP_007	维护医院科室信息	HMP1.2		1
	 * @param id
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id, @RequestBody String data) {
//		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
//		if(null==loginOrg || "".equals(loginOrg)){
//			return ResultUtils.renderFailureResult("未找到当前登录机构4");
//		}
//		String orgId = loginOrg.getId();
		AppDepartment department = this.appDepartmentManager.get(id);
//		if(!orgId.equals(department.getHospitalId())){
//			return ResultUtils.renderFailureResult("科室不属于当前机构");
//		}
//		Hospital hospital = this.hospitalManager.get(orgId);
//		if(null==hospital){
//			return ResultUtils.renderFailureResult("没有对应的医院");
//		}	
		AppDepartment param = JSONUtils.deserialize(data, AppDepartment.class);
		if(null==param)param = new AppDepartment();
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
//		department.setHospitalId(orgId);
		department.setIsSpecial(param.getIsSpecial());
		
		if(null!=param.getType()){
			department.setType(param.getType());
		}
		AppDepartment savedDepartment = this.appDepartmentManager.save(department);
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
			return ResultUtils.renderFailureResult("未找到当前登录机构5");
		}
		String orgId = loginOrg.getId();
		AppDepartment department = this.appDepartmentManager.get(id);
		if(!orgId.equals(department.getHospitalId())){
			return ResultUtils.renderFailureResult("科室不属于当前机构");
		}
		department.setIsSpecial(true);
		AppDepartment savedDepartment = this.appDepartmentManager.save(department);
		return ResultUtils.renderSuccessResult(savedDepartment);
	}
	/**
	 * ELH_HOSP_007	移除特色科室special
	 * @param id
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/special/move/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forMoveSpecial(@PathVariable("id") String id) {
//		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
//		if(null==loginOrg || "".equals(loginOrg)){
//			return ResultUtils.renderFailureResult("未找到当前登录机构6");
//		}
//		String orgId = loginOrg.getId();
		AppDepartment department = this.appDepartmentManager.get(id);
//		if(!orgId.equals(department.getHospitalId())){
//			return ResultUtils.renderFailureResult("科室不属于当前机构");
//		}
		department.setIsSpecial(false);
		AppDepartment savedDepartment = this.appDepartmentManager.save(department);
		return ResultUtils.renderSuccessResult(savedDepartment);
	}
	/**
	 * ELH_HOSP_008	删除科室	HMP1.2		1 TODO 改成上下线
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
//		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
//		if(null==loginOrg || "".equals(loginOrg)){
//			return ResultUtils.renderFailureResult("未找到当前登录机构7");
//		}
//		String orgId = loginOrg.getId();
		AppDepartment department = this.appDepartmentManager.get(id);
//		if(!orgId.equals(department.getHospitalId())){
//			return ResultUtils.renderFailureResult("科室不属于当前机构");
//		}
		department.setFlag("0");//逻辑删除
		department = this.appDepartmentManager.save(department);
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
		AppDepartment department = JSONUtils.deserialize(data, AppDepartment.class);
		StringBuilder sb = new StringBuilder();
		sb.append(" from AppDepartment where hospitalId = ? and flag = ? ");
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
		List<AppDepartment> result = this.appDepartmentManager.find(sb.toString(), cdList.toArray());
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
	public Result forAppList(@PathVariable(value = "start") String start,
			@PathVariable(value = "pageSize") String pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		AppDepartment model = JSONUtils.deserialize(data, AppDepartment.class);
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
		this.appDepartmentManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	
	}
	/******************************************************app端方法end*************************************************************************/
	/******************************************************运营端方法*************************************************************************/
	/******************************************************运营端方法end*************************************************************************/
	
}




