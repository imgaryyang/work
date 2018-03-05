package com.lenovohit.hcp.base.web.rest;


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

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.utils.PinyinUtil;
import com.lenovohit.hcp.base.utils.WubiUtil;

/**
 * 医院基本信息管理
 */
@RestController
@RequestMapping("/hcp/base/dept")
public class DepartmentRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<Department, String> departmentManager;
	//获取专科菜单
	@RequestMapping(value = "/deptlist", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDeptList() {
		String hosId = this.getCurrentUser().getHosId() ;
		List<Department> Depts = departmentManager.find(" from Department dept where hosId = ? order by deptId ",hosId);
		return ResultUtils.renderSuccessResult(Depts);
	}
	
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		
		Department model= departmentManager.get(id);
		System.out.print(model);
		return ResultUtils.renderSuccessResult(model);
	}
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		JSONObject jsonObj = JSONObject.parseObject(data);
		String hosId = jsonObj.getString("hosId");
		List<Department> models = departmentManager.find(" from Department dept where hosId = ?",StringUtils.isEmpty(hosId)?this.getCurrentUser().getHosId():hosId);
		return ResultUtils.renderSuccessResult(models);
	}
	//新建科室
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreate(@RequestBody String data){
		Department model =  JSONUtils.deserialize(data, Department.class);
		
		/*if(model.getHosId() == null)
			model.setHosId(hosId);*/
		if(model.getSpellCode()== null)
			model.setSpellCode(PinyinUtil.getFirstSpell(model.getDeptName()));
		if(model.getWbCode()== null)
			model.setWbCode(WubiUtil.getWBCode(model.getDeptName()));
		//getWBCode
		model.setStopFlag("1");
		//TODO 校验
		List<Department> Depts = departmentManager.find(" from Department dept where deptName = ?",model.getDeptName());
		if(Depts.size()!=0){
			return  ResultUtils.renderFailureResult("科室名称已存在，请重新输入");
		}
		else{
			Department saved = this.departmentManager.save(model);
			return ResultUtils.renderSuccessResult(saved);
		}
	}
	//更新科室信息
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		Department model =  JSONUtils.deserialize(data, Department.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		this.departmentManager.save(model);
		return ResultUtils.renderSuccessResult();
	}
	//删除某个科室信息
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id){
		try {
			this.departmentManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	//删除选中的科室信息
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		@SuppressWarnings("rawtypes")
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM B_deptinfo  WHERE ID IN (");
			for(int i=0;i<ids.size();i++){
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size()-1)idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.departmentManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 传入多个科室id查询科室信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/findByIds", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forFindByIds(@RequestBody String data) {
		@SuppressWarnings("rawtypes")
		List ids = JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append(" from Department dept where where id in (");
			for (int i = 0; i < ids.size(); i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			List<Department> Depts = departmentManager.find(idSql.toString());
			return ResultUtils.renderSuccessResult(Depts);
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("查询失败");
		}
	}
	
	@RequestMapping(value = "/listByDeptType", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forListByDeptType(@RequestParam(value = "data", defaultValue = "") String data) {
		@SuppressWarnings("rawtypes")
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idValues = new ArrayList<String>();
		String hosId = this.getCurrentUser().getHosId();
		idValues.add(hosId);
		idSql.append("SELECT dept from Department dept WHERE hosId = ? and deptType IN (");
		for(int i=0;i<ids.size();i++){
			idSql.append("?");
			idValues.add(ids.get(i).toString());
			if(i != ids.size()-1)idSql.append(",");
		}
		idSql.append(") order by deptId");
		System.out.println(idValues);
		
		List<Department> models = departmentManager.find(idSql.toString(), idValues.toArray());
		return ResultUtils.renderSuccessResult(models);
	}
	
	@RequestMapping(value = "/listByDeptIsRegDept", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forListByDeptIsRegDept(@RequestParam(value = "data", defaultValue = "") String data) {
		@SuppressWarnings("rawtypes")
		Department model =  JSONUtils.deserialize(data, Department.class);
		StringBuilder jql = new StringBuilder();
		List<String> values = new ArrayList<String>();
		jql.append("SELECT dept from Department dept WHERE 1=1");
		if(StringUtils.isNotBlank(model.getIsRegdept())){
			jql.append(" and dept.isRegdept = ? ");
			values.add(model.getIsRegdept());
		}
		jql.append(" and dept.hosId = ? ");
		values.add(this.getCurrentUser().getHosId());
		jql.append(" order by deptId ");
		System.out.println(values);
		
		List<Department> models = departmentManager.find(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult(models);
	}
	
	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}
}
