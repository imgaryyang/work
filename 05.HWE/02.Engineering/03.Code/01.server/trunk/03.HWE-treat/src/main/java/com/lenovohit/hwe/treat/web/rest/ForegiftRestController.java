package com.lenovohit.hwe.treat.web.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.model.Foregift;
import com.lenovohit.hwe.treat.model.Trade;

@RestController
@RequestMapping("/hwe/treat/foregift")
public class ForegiftRestController extends OrgBaseRestController {
	@Autowired
	private GenericManager<Foregift, String> foregiftManager;
	
	@Value("${his.baseUrl}")
	private String baseUrl;

	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
  	public Result getInfo(@PathVariable("id") String id){
  		Foregift model = this.foregiftManager.get(id);
  		return ResultUtils.renderPageResult(model);
  	}
  	
  	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
  	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit, 
  			@RequestParam(value = "data", defaultValue = "") String data){
  		Foregift query =  JSONUtils.deserialize(data, Foregift.class);
  		StringBuilder jql = new StringBuilder( " from Foregift where 1=1 ");
  		List<Object> values = new ArrayList<Object>();
  		
  		if(!StringUtils.isEmpty(query.getProId())){
  			jql.append(" and proId = ? ");
  			values.add(query.getProId());
  		}
  		if(!StringUtils.isEmpty(query.getProNo())){
  			jql.append(" and proNo = ? ");
  			values.add(query.getProNo());
  		}
  		if(!StringUtils.isEmpty(query.getUserId())){
  			jql.append(" and userId = ? ");
  			values.add(query.getUserId());
  		}
  		if(!StringUtils.isEmpty(query.getTradeChannel())){
  			jql.append(" and tradeChannel = ? ");
  			values.add(query.getTradeChannel());
  		}
  		if(!StringUtils.isEmpty(query.getTradeNo())){
  			jql.append(" and tradeNo = ? ");
  			values.add(query.getTradeNo());
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
  		
  		this.foregiftManager.findPage(page);
  		return ResultUtils.renderPageResult(page);
  	}

  	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
  	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
  		Foregift query =  JSONUtils.deserialize(data, Foregift.class);
  		StringBuilder jql = new StringBuilder( " from Foregift where 1=1 ");
  		List<Object> values = new ArrayList<Object>();
  		
  		if(!StringUtils.isEmpty(query.getProId())){
  			jql.append(" and proId = ? ");
  			values.add(query.getProId());
  		}
  		if(!StringUtils.isEmpty(query.getProNo())){
  			jql.append(" and proNo = ? ");
  			values.add(query.getProNo());
  		}
  		if(!StringUtils.isEmpty(query.getUserId())){
  			jql.append(" and userId = ? ");
  			values.add(query.getUserId());
  		}
  		if(!StringUtils.isEmpty(query.getTradeChannel())){
  			jql.append(" and tradeChannel = ? ");
  			values.add(query.getTradeChannel());
  		}
  		if(!StringUtils.isEmpty(query.getTradeNo())){
  			jql.append(" and tradeNo = ? ");
  			values.add(query.getTradeNo());
  		}
  		if(!StringUtils.isEmpty(query.getStatus())){
  			jql.append(" and status = ? ");
  			values.add(query.getStatus());
  		}
  		jql.append("order by createdAt");
  		
  		List<Foregift> foregifts = this.foregiftManager.find(jql.toString(),values.toArray());
  		return ResultUtils.renderSuccessResult(foregifts);
  	}
  	
  	@RequestMapping(value="",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
  	public Result forCreate(@RequestBody String data){
  		Foregift foregift =  JSONUtils.deserialize(data, Foregift.class);
  		foregift.setForegiftTime(new Date());
  		Foregift saved = this.foregiftManager.save(foregift);
  		return ResultUtils.renderSuccessResult(saved);
  	}

  	@RequestMapping(value = "/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
  	public Result forRemove(@PathVariable("id") String id){
  		try {
  			this.foregiftManager.delete(id);
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
  			idSql.append("DELETE FROM TREAT_FOREGIFT WHERE ID IN (");
  			for(int i = 0 ; i < ids.size() ; i++) {
  				idSql.append("?");
  				idvalues.add(ids.get(i).toString());
  				if(i != ids.size() - 1) idSql.append(",");
  			}
  			idSql.append(")");
  			this.foregiftManager.executeSql(idSql.toString(), idvalues.toArray());
  		} catch (Exception e) {
  			e.printStackTrace();
  			throw new BaseException("删除失败");
  		}
  		return ResultUtils.renderSuccessResult();
  	}
  	
 	@RequestMapping(value="/callback",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
  	public Result foregiftCallback(@RequestBody String data){
  		Trade trade =  JSONUtils.deserialize(data, Trade.class);
  		if (StringUtils.isEmpty(trade.getBizNo())) {
  			ResultUtils.renderFailureResult();
  		}
  		// 1.回写运存表
  		Foregift foregiftModel = this.foregiftManager.get(trade.getBizNo());
  		
		if (trade.getPayChannleCode().equals("wxpay")) {
			foregiftModel.setTradeChannel("W");
  		} else if (trade.getPayChannleCode().equals("aliPay")) {
			foregiftModel.setTradeChannelCode("9998");
  		} else if (trade.getPayChannleCode().equals("alipay")) {
  			foregiftModel.setTradeChannel("Z");
  			foregiftModel.setTradeChannelCode("9999");
  		}

		foregiftModel.setTradeNo(trade.getTradeNo()); 
		foregiftModel.setTradeTime(trade.getTradeTime());
		foregiftModel.setStatus(trade.getStatus());
  		this.foregiftManager.save(foregiftModel);
  	
  		// wuxs will delete begin
  		// 此为测试数据，用于区分hcp中deposit表的数据是门诊还是住院(当前的模拟数据都存储在了deposit表中了)
  		foregiftModel.setTradeTerminalCode("04");
  		// wuxs will delete end
		RestTemplate restTemplate = new RestTemplate();
		// his端暂时用deposit来模拟foregift
    	ResponseEntity<Foregift> response = restTemplate.postForEntity(baseUrl + "hcp/app/test/foregift/recharge", foregiftModel, Foregift.class);
    	if(response.getStatusCode() == HttpStatus.OK){
    		Foregift resultForegift = response.getBody();
    		foregiftModel.setNo(resultForegift.getNo());
    		foregiftModel.setBalance(resultForegift.getBalance());
    		this.foregiftManager.save(foregiftModel);
    	}
  		return ResultUtils.renderSuccessResult();
  	}
}
