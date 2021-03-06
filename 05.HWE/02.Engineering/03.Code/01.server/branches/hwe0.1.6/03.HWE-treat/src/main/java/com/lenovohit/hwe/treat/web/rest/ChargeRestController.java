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

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.model.Charge;
import com.lenovohit.hwe.treat.model.ChargeDetail;
import com.lenovohit.hwe.treat.service.HisChargeService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;

@RestController
@RequestMapping("/hwe/treat/charge/")
public class ChargeRestController extends OrgBaseRestController {

	@Autowired
	private GenericManager<Charge, String> chargeManager;
	@Autowired
	private HisChargeService hisChargeService;
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
  	public Result getInfo(@PathVariable("id") String id){
  		Charge model = this.chargeManager.get(id);
  		return ResultUtils.renderPageResult(model);
  	}
  	
  	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
  	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit, 
  			@RequestParam(value = "data", defaultValue = "") String data){
  		Charge query =  JSONUtils.deserialize(data, Charge.class);
  		StringBuilder jql = new StringBuilder( " from Charge where 1=1 ");
  		List<Object> values = new ArrayList<Object>();
  		
  		if(!StringUtils.isEmpty(query.getHosId())){
  			jql.append(" and hosId = ? ");
  			values.add(query.getHosId());
  		}
  		if(!StringUtils.isEmpty(query.getHosNo())){
  			jql.append(" and hosNo = ? ");
  			values.add(query.getHosNo());
  		}
  		if(!StringUtils.isEmpty(query.getDepId())){
  			jql.append(" and depId = ? ");
  			values.add(query.getDepId());
  		}
  		if(!StringUtils.isEmpty(query.getDepNo())){
  			jql.append(" and depNo = ? ");
  			values.add(query.getDepNo());
  		}
  		if(!StringUtils.isEmpty(query.getDocId())){
  			jql.append(" and docId = ? ");
  			values.add(query.getDocId());
  		}
  		if(!StringUtils.isEmpty(query.getDocNo())){
  			jql.append(" and docNo = ? ");
  			values.add(query.getDocNo());
  		}
  		if(!StringUtils.isEmpty(query.getActId())){
  			jql.append(" and actId = ? ");
  			values.add(query.getActId());
  		}
  		if(!StringUtils.isEmpty(query.getActNo())){
  			jql.append(" and actNo = ? ");
  			values.add(query.getActNo());
  		}
  		if(!StringUtils.isEmpty(query.getMiType())){
  			jql.append(" and miType = ? ");
  			values.add(query.getMiType());
  		}
  		if(!StringUtils.isEmpty(query.getStatus())){
  			jql.append(" and status = ? ");
  			values.add(query.getStatus());
  		}
  		jql.append("order by createdAt");
  		
  		Page page = new Page();
  		page.setStart(start);
  		page.setPageSize(limit);
  		page.setQuery(jql.toString());
  		page.setValues(values.toArray());
  		
  		this.chargeManager.findPage(page);
  		return ResultUtils.renderPageResult(page);
  	}

  	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
  	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
  		Charge query =  JSONUtils.deserialize(data, Charge.class);
  		StringBuilder jql = new StringBuilder( " from Charge where 1=1 ");
  		List<Object> values = new ArrayList<Object>();
  		
  		if(!StringUtils.isEmpty(query.getHosId())){
  			jql.append(" and hosId = ? ");
  			values.add(query.getHosId());
  		}
  		if(!StringUtils.isEmpty(query.getHosNo())){
  			jql.append(" and hosNo = ? ");
  			values.add(query.getHosNo());
  		}
  		if(!StringUtils.isEmpty(query.getDepId())){
  			jql.append(" and depId = ? ");
  			values.add(query.getDepId());
  		}
  		if(!StringUtils.isEmpty(query.getDepNo())){
  			jql.append(" and depNo = ? ");
  			values.add(query.getDepNo());
  		}
  		if(!StringUtils.isEmpty(query.getDocId())){
  			jql.append(" and docId = ? ");
  			values.add(query.getDocId());
  		}
  		if(!StringUtils.isEmpty(query.getDocNo())){
  			jql.append(" and docNo = ? ");
  			values.add(query.getDocNo());
  		}
  		if(!StringUtils.isEmpty(query.getActId())){
  			jql.append(" and actId = ? ");
  			values.add(query.getActId());
  		}
  		if(!StringUtils.isEmpty(query.getActNo())){
  			jql.append(" and actNo = ? ");
  			values.add(query.getActNo());
  		}
  		if(!StringUtils.isEmpty(query.getMiType())){
  			jql.append(" and miType = ? ");
  			values.add(query.getMiType());
  		}
  		if(!StringUtils.isEmpty(query.getStatus())){
  			jql.append(" and status = ? ");
  			values.add(query.getStatus());
  		}
  		jql.append("order by createdAt");
  		
  		List<Charge> charges = this.chargeManager.find(jql.toString(),values.toArray());
  		return ResultUtils.renderSuccessResult(charges);
  	}
  	
  	@RequestMapping(value="",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
  	public Result forCreate(@RequestBody String data){
  		Charge charge =  JSONUtils.deserialize(data, Charge.class);
  		Charge saved = this.chargeManager.save(charge);
  		return ResultUtils.renderSuccessResult(saved);
  	}

  	@RequestMapping(value = "/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
  	public Result forRemove(@PathVariable("id") String id){
  		try {
  			this.chargeManager.delete(id);
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
  			idSql.append("DELETE FROM TREAT_CHARGE WHERE ID IN (");
  			for(int i = 0 ; i < ids.size() ; i++) {
  				idSql.append("?");
  				idvalues.add(ids.get(i).toString());
  				if(i != ids.size() - 1) idSql.append(",");
  			}
  			idSql.append(")");
  			this.chargeManager.executeSql(idSql.toString(), idvalues.toArray());
  		} catch (Exception e) {
  			e.printStackTrace();
  			throw new BaseException("删除失败");
  		}
  		return ResultUtils.renderSuccessResult();
  	}
  	
	@RequestMapping(value = "prePayInfo", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result prePayInfo(@RequestParam(value = "data", defaultValue = "") String data) {
		List<ChargeDetail> chagerList = JSONUtils.parseObject(data, new TypeReference<List<ChargeDetail>>() {});
		System.out.println("==============自费预结算开始===================");
		RestEntityResponse<Charge> response = this.hisChargeService.prepay(chagerList);
		System.out.println("==============自费预结算结束===================");
		if(response.isSuccess())
			return ResultUtils.renderSuccessResult(response.getEntity());
		else 
			return ResultUtils.renderFailureResult(response.getMsg());
	}
}
