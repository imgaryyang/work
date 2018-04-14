  package com.lenovohit.hwe.treat.web.rest;


import java.util.ArrayList;
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
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.model.Hospital;

/**
 * 医院管理
 * 
 */
@RestController
@RequestMapping("/hwe/treat/hospital")
public class HospitalRestController extends OrgBaseRestController {

	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getInfo(@PathVariable("id") String id){
		Hospital model = this.hospitalManager.get(id);
		return ResultUtils.renderPageResult(model);
	}
	
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit, 
			@RequestParam(value = "data", defaultValue = "") String data){
		Hospital query =  JSONUtils.deserialize(data, Hospital.class);
		StringBuilder jql = new StringBuilder( " from Hospital where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getOrgId())){
			jql.append(" and orgId = ? ");
			values.add(query.getOrgId());
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

		if(!StringUtils.isEmpty(query.getLevel())){
			jql.append(" and level = ? ");
			values.add(query.getLevel());
		}
		
		if(!StringUtils.isEmpty(query.getStatus())){
			jql.append(" and status = ? ");
			values.add(query.getStatus());
		}
		
		jql.append("order by name");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		
		this.hospitalManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		Hospital query =  JSONUtils.deserialize(data, Hospital.class);
		StringBuilder jql = new StringBuilder( " from Hospital where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getOrgId())){
			jql.append(" and orgId = ? ");
			values.add(query.getOrgId());
		}
		
		if(!StringUtils.isEmpty(query.getName())){
			jql.append(" and name like ? ");
			values.add("'%"+ query.getName() + "%'");
		}
		
		if(!StringUtils.isEmpty(query.getNo())){
			jql.append(" and no = ? ");
			values.add(query.getNo());
		}
		
		if(!StringUtils.isEmpty(query.getType())){
			jql.append(" and type = ? ");
			values.add(query.getType());
		}
		if(!StringUtils.isEmpty(query.getLevel())){
			jql.append(" and level = ? ");
			values.add(query.getLevel());
		}
		
		if(!StringUtils.isEmpty(query.getStatus())){
			jql.append(" and status = ? ");
			values.add(query.getStatus());
		}
		
		jql.append("order by name");
		
		List<Hospital> hospitals = this.hospitalManager.find(jql.toString(),values.toArray());
		return ResultUtils.renderSuccessResult(hospitals);
	}
	
	@RequestMapping(value="",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreate(@RequestBody String data){
		Hospital model =  JSONUtils.deserialize(data, Hospital.class);
		Hospital saved = this.hospitalManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}

	@RequestMapping(value = "/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemove(@PathVariable("id") String id){
		try {
			this.hospitalManager.delete(id);
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
			idSql.append("DELETE FROM TREAT_HOSPITAL WHERE ID IN (");
			for(int i = 0 ; i < ids.size() ; i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			this.hospitalManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 查找离指定位置最近的医院
	 * @param id
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/nearest/{longitude}/{latitude}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getNearest(@PathVariable("longitude") String longitude, @PathVariable("latitude") String latitude) {
		try {
			String sql = "SELECT H.ID, H.DISTANCE FROM ("
					+ "SELECT FN_GET_DISTANCE_KMS('" + latitude + "', '" + longitude + "', LATITUDE, LONGITUDE) AS DISTANCE, ID FROM TREAT_HOSPITAL ORDER BY DISTANCE"
					+ ") AS H LIMIT 1";
			List<Object[]> nearest = (List<Object[]>)hospitalManager.findBySql(sql);
			Hospital model = this.hospitalManager.get((String)(nearest.get(0)[0]));
			return ResultUtils.renderPageResult(model);
		} catch(Exception e) {
			return ResultUtils.renderFailureResult();
		}
	}
}
