package com.lenovohit.hwe.treat.web.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.model.ConsultDept;
import com.lenovohit.hwe.treat.model.Department;

@RestController
@RequestMapping("/hwe/treat/department")
public class DepartmentRestController extends OrgBaseRestController{
	
	@Autowired
	private GenericManager<Department, String> departmentManager;
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
  	public Result getInfo(@PathVariable("id") String id){
  		Department model = this.departmentManager.get(id);
  		return ResultUtils.renderPageResult(model);
  	}
  	
  	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
  	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit, 
  			@RequestParam(value = "data", defaultValue = "") String data){
  		Department query =  JSONUtils.deserialize(data, Department.class);
  		StringBuilder jql = new StringBuilder( " from Department where 1=1 ");
  		List<Object> values = new ArrayList<Object>();
  		
  		if(!StringUtils.isEmpty(query.getHosId())){
  			jql.append(" and hosId = ? ");
  			values.add(query.getHosId());
  		}
  		if(!StringUtils.isEmpty(query.getHosNo())){
  			jql.append(" and hosNo = ? ");
  			values.add(query.getHosNo());
  		}
  		if(!StringUtils.isEmpty(query.getParentId())){
  			jql.append(" and parentId = ? ");
  			values.add(query.getParentId());
  		}
  		if(!StringUtils.isEmpty(query.getParentNo())){
  			jql.append(" and parentNo = ? ");
  			values.add(query.getParentNo());
  		}
  		if(!StringUtils.isEmpty(query.getName())){
  			jql.append(" and name like ? ");
  			values.add("%"+ query.getName() + "%");
  		}
  		if(!StringUtils.isEmpty(query.getNo())){
  			jql.append(" and no = ? ");
  			values.add(query.getNo());
  		}
  		if(!StringUtils.isEmpty(query.getType())){
  			jql.append(" and type = ? ");
  			values.add(query.getType());
  		}
  		if(!StringUtils.isEmpty(query.getStatus())){
  			jql.append(" and status = ? ");
  			values.add(query.getStatus());
  		}
  		jql.append("order by sort");
  		
  		Page page = new Page();
  		page.setStart(start);
  		page.setPageSize(limit);
  		page.setQuery(jql.toString());
  		page.setValues(values.toArray());
  		
  		this.departmentManager.findPage(page);
  		return ResultUtils.renderPageResult(page);
  	}

  	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
  	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
  		Department query =  JSONUtils.deserialize(data, Department.class);
  		StringBuilder jql = new StringBuilder( " from Department where 1=1 ");
  		List<Object> values = new ArrayList<Object>();
  		
  		if(!StringUtils.isEmpty(query.getHosId())){
  			jql.append(" and hosId = ? ");
  			values.add(query.getHosId());
  		}
  		if(!StringUtils.isEmpty(query.getHosNo())){
  			jql.append(" and hosNo = ? ");
  			values.add(query.getHosNo());
  		}
  		if(!StringUtils.isEmpty(query.getParentId())){
  			jql.append(" and parentId = ? ");
  			values.add(query.getParentId());
  		}
  		if(!StringUtils.isEmpty(query.getParentNo())){
  			jql.append(" and parentNo = ? ");
  			values.add(query.getParentNo());
  		}
  		if(!StringUtils.isEmpty(query.getName())){
  			jql.append(" and name like ? ");
  			values.add("%"+ query.getName() + "%");
  		}
  		if(!StringUtils.isEmpty(query.getNo())){
  			jql.append(" and no = ? ");
  			values.add(query.getNo());
  		}
  		if(!StringUtils.isEmpty(query.getType())){
  			jql.append(" and type = ? ");
  			values.add(query.getType());
  		}
  		if(!StringUtils.isEmpty(query.getStatus())){
  			jql.append(" and status = ? ");
  			values.add(query.getStatus());
  		}
  		jql.append("order by sort");
  		
  		List<Department> departments = this.departmentManager.find(jql.toString(),values.toArray());
  		return ResultUtils.renderSuccessResult(departments);
  	}
  	
  	@RequestMapping(value="",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
  	public Result forCreate(@RequestBody String data){
  		Department model =  JSONUtils.deserialize(data, Department.class);
  		Department saved = this.departmentManager.save(model);
  		return ResultUtils.renderSuccessResult(saved);
  	}

  	@RequestMapping(value = "/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
  	public Result forRemove(@PathVariable("id") String id){
  		try {
  			this.departmentManager.delete(id);
  		} catch (Exception e) {
  			throw new BaseException("删除失败");
  		}
  		return ResultUtils.renderSuccessResult();
  	}
  	
  	@SuppressWarnings("rawtypes")
  	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
  	public Result forRemoveAll(@RequestBody String data){
  		List ids =  JSONUtils.deserialize(data, List.class);
  		StringBuilder idSql = new StringBuilder();
  		List<String> idvalues = new ArrayList<String>();
  		try {
  			idSql.append("DELETE FROM TREAT_DEPARTMENT WHERE ID IN (");
  			for(int i = 0 ; i < ids.size() ; i++) {
  				idSql.append("?");
  				idvalues.add(ids.get(i).toString());
  				if(i != ids.size() - 1) idSql.append(",");
  			}
  			idSql.append(")");
  			this.departmentManager.executeSql(idSql.toString(), idvalues.toArray());
  		} catch (Exception e) {
  			e.printStackTrace();
  			throw new BaseException("删除失败");
  		}
  		return ResultUtils.renderSuccessResult();
  	}
  	
  	/**
	 * @param data
	 * @return  返回以type为key的科室map
	 */
	@RequestMapping(value = "/tree", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTree(@RequestParam(value = "data", defaultValue = "") String data) {
		Department model = JSONUtils.deserialize(data, Department.class);
		StringBuilder sb = new StringBuilder(" from Department where 1=1 ");
		List<Object> cdList = new ArrayList<Object>();
		//cdList.add("1");
		if(model != null){
			if (model.getHosId() != null) {
				sb.append(" and hosId = ?");
				cdList.add(model.getHosId());
			}
			
		}
		sb.append(" order by type ");
		List<Department> list = this.departmentManager.find(sb.toString(),cdList.toArray());
		
		//转换为Map
		ConsultDept dept = new ConsultDept();
		Map<String,List<Department>> map = new HashMap<String,List<Department>>();
		if(list!=null && list.size()>0){
			List<Department> dlist = new ArrayList<Department>();
			List<String> typelist = new ArrayList<String>();
			for(int i=0;i<list.size();i++){
				
				if(i==0){
					dlist.add(list.get(0));
					typelist.add(list.get(0).getType());
				}else{
					if(list.get(i-1).getType().equals(list.get(i).getType())){
						dlist.add(list.get(i));
					}else{
						List<Department> d = new ArrayList<Department>();
						d.addAll(dlist);
						map.put(list.get(i-1).getType()+"", d);
						dlist.clear();
						dlist.add(list.get(i));
						typelist.add(list.get(i).getType());
					}
				}
				if(i==list.size()-1){
					map.put(list.get(i).getType()+"", dlist);		
				}
			}	
			dept.setMap(map);
			dept.setTypeList(typelist);
			dept.setDeptList(list);
		}
		return ResultUtils.renderSuccessResult(dept);
	}
	
  	/**
	 * @param data
	 * @return  返回以type为key的科室map
	 */
	@RequestMapping(value = "/select", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAppList(@RequestParam(value = "data", defaultValue = "") String data) {
		Department model = JSONUtils.deserialize(data, Department.class);
		StringBuilder sb = new StringBuilder(" from Department where 1=1 ");
		List<Object> cdList = new ArrayList<Object>();
		//cdList.add("1");
		if(model != null){
			if (model.getHosId() != null) {
				sb.append(" and hosId = ?");
				cdList.add(model.getHosId());
			}
			
		}
		sb.append(" order by type ");
		List<Department> list = this.departmentManager.find(sb.toString(),cdList.toArray());
		
		//转换为Map
		ConsultDept dept = new ConsultDept();
		Map<String,List<Department>> map = new HashMap<String,List<Department>>();
		if(list!=null && list.size()>0){
			List<Department> dlist = new ArrayList<Department>();
			List<String> typelist = new ArrayList<String>();
			for(int i=0;i<list.size();i++){
				
				if(i==0){
					dlist.add(list.get(0));
					typelist.add(list.get(0).getType());
				}else{
					if(list.get(i-1).getType().equals(list.get(i).getType())){
						dlist.add(list.get(i));
					}else{
						List<Department> d = new ArrayList<Department>();
						d.addAll(dlist);
						map.put(list.get(i-1).getType()+"", d);
						dlist.clear();
						dlist.add(list.get(i));
						typelist.add(list.get(i).getType());
					}
				}
				if(i==list.size()-1){
					map.put(list.get(i).getType()+"", dlist);		
				}
			}	
			dept.setMap(map);
			dept.setTypeList(typelist);
			dept.setDeptList(list);
		}
		return ResultUtils.renderSuccessResult(dept);
	}
}
