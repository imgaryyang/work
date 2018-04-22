package com.lenovohit.ssm.app.community.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.app.community.model.ConsultRecord;

@RestController
@RequestMapping("/hwe/app/consultRecord")
public class ConsultRecordRestController extends BaseRestController{
	
	@Autowired
	private GenericManager<ConsultRecord, String> consultRecordManager;
	
	
	
	@RequestMapping(value = "/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data){
		ConsultRecord model = JSONUtils.deserialize(data, ConsultRecord.class);
		ConsultRecord record = this.consultRecordManager.save(model);
		return ResultUtils.renderSuccessResult(record);
	}
	
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemove(@PathVariable("id") String id){
		ConsultRecord record = this.consultRecordManager.delete(id);
		return ResultUtils.renderSuccessResult(record);
	}
	
	@RequestMapping(value = "/update",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data){
		ConsultRecord model = JSONUtils.deserialize(data, ConsultRecord.class);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		ConsultRecord record = this.consultRecordManager.save(model);
		return ResultUtils.renderSuccessResult(record);
	}
	

	@RequestMapping(value = "/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(){
		List<ConsultRecord> list = consultRecordManager.findAll();
		return ResultUtils.renderSuccessResult(list);
	}
	
	@RequestMapping(value = "/page/{start}/{limit}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start , @PathVariable("limit") String limit ){
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder( " from ConsultRecord where 1=1 ");
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.consultRecordManager.findPage(page);
		return ResultUtils.renderSuccessResult(page);
	}
	
	
}
