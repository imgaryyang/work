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
import com.lenovohit.hwe.treat.model.Drug;

@RestController
@RequestMapping("/hwe/treat/drug")
public class DrugRestController extends OrgBaseRestController{
	
	@Autowired
	private GenericManager<Drug, String> drugManager;
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
  	public Result getInfo(@PathVariable("id") String id){
  		Drug model = this.drugManager.get(id);
  		return ResultUtils.renderPageResult(model);
  	}
  	
  	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
  	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit, 
  			@RequestParam(value = "data", defaultValue = "") String data){
  		Drug query =  JSONUtils.deserialize(data, Drug.class);
  		StringBuilder jql = new StringBuilder( " from Drug where 1=1 ");
  		List<Object> values = new ArrayList<Object>();
  		
  		if(!StringUtils.isEmpty(query.getHosId())){
  			jql.append(" and hosId = ? ");
  			values.add(query.getHosId());
  		}
  		if(!StringUtils.isEmpty(query.getHosNo())){
  			jql.append(" and hosNo = ? ");
  			values.add(query.getHosNo());
  		}
  		if(!StringUtils.isEmpty(query.getName())){
  			jql.append(" and name like ? ");
  			values.add("%"+ query.getName() + "%");
  		}
  		if(!StringUtils.isEmpty(query.getCode())){
  			jql.append(" and code = ? ");
  			values.add(query.getCode());
  		}
  		if(!StringUtils.isEmpty(query.getPinyin())){
  			jql.append(" and pinyin like ? ");
  			values.add("%"+ query.getPinyin() + "%");
  		}
  		if(!StringUtils.isEmpty(query.getWubi())){
  			jql.append(" and wubi like ? ");
  			values.add("%"+ query.getWubi() + "%");
  		}
  		if(!StringUtils.isEmpty(query.getProducer())){
  			jql.append(" and producer like ? ");
  			values.add("%"+ query.getProducer() + "%");
  		}
  		if(!StringUtils.isEmpty(query.getMiFlag())){
  			jql.append(" and miFlag = ? ");
  			values.add(query.getMiFlag());
  		}
  		if(!StringUtils.isEmpty(query.getStatus())){
  			jql.append(" and status = ? ");
  			values.add(query.getStatus());
  		}
  		jql.append("order by code");
  		
  		Page page = new Page();
  		page.setStart(start);
  		page.setPageSize(limit);
  		page.setQuery(jql.toString());
  		page.setValues(values.toArray());
  		
  		this.drugManager.findPage(page);
  		return ResultUtils.renderPageResult(page);
  	}

  	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
  	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
  		Drug query =  JSONUtils.deserialize(data, Drug.class);
  		StringBuilder jql = new StringBuilder( " from Drug where 1=1 ");
  		List<Object> values = new ArrayList<Object>();
  		
  		if(!StringUtils.isEmpty(query.getHosId())){
  			jql.append(" and hosId = ? ");
  			values.add(query.getHosId());
  		}
  		if(!StringUtils.isEmpty(query.getHosNo())){
  			jql.append(" and hosNo = ? ");
  			values.add(query.getHosNo());
  		}
  		if(!StringUtils.isEmpty(query.getName())){
  			jql.append(" and name like ? ");
  			values.add("%"+ query.getName() + "%");
  		}
  		if(!StringUtils.isEmpty(query.getCode())){
  			jql.append(" and code = ? ");
  			values.add(query.getCode());
  		}
  		if(!StringUtils.isEmpty(query.getPinyin())){
  			jql.append(" and pinyin like ? ");
  			values.add("%"+ query.getPinyin() + "%");
  		}
  		if(!StringUtils.isEmpty(query.getWubi())){
  			jql.append(" and wubi like ? ");
  			values.add("%"+ query.getWubi() + "%");
  		}
  		if(!StringUtils.isEmpty(query.getProducer())){
  			jql.append(" and producer like ? ");
  			values.add("%"+ query.getProducer() + "%");
  		}
  		if(!StringUtils.isEmpty(query.getMiFlag())){
  			jql.append(" and miFlag = ? ");
  			values.add(query.getMiFlag());
  		}
  		if(!StringUtils.isEmpty(query.getStatus())){
  			jql.append(" and status = ? ");
  			values.add(query.getStatus());
  		}
  		jql.append("order by code");
  		
  		List<Drug> drugs = this.drugManager.find(jql.toString(),values.toArray());
  		return ResultUtils.renderSuccessResult(drugs);
  	}
  	
  	@RequestMapping(value="",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
  	public Result forCreate(@RequestBody String data){
  		Drug drug =  JSONUtils.deserialize(data, Drug.class);
  		Drug saved = this.drugManager.save(drug);
  		return ResultUtils.renderSuccessResult(saved);
  	}

  	@RequestMapping(value = "/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
  	public Result forRemove(@PathVariable("id") String id){
  		try {
  			this.drugManager.delete(id);
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
  			idSql.append("DELETE FROM TREAT_DRUG WHERE ID IN (");
  			for(int i = 0 ; i < ids.size() ; i++) {
  				idSql.append("?");
  				idvalues.add(ids.get(i).toString());
  				if(i != ids.size() - 1) idSql.append(",");
  			}
  			idSql.append(")");
  			this.drugManager.executeSql(idSql.toString(), idvalues.toArray());
  		} catch (Exception e) {
  			e.printStackTrace();
  			throw new BaseException("删除失败");
  		}
  		return ResultUtils.renderSuccessResult();
  	}

}
