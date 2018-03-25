package com.lenovohit.hwe.treat.web.rest;

import java.math.BigDecimal;
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

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.model.Deposit;
import com.lenovohit.hwe.treat.model.Trade;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/hwe/treat/deposit")
public class DepositRestController extends OrgBaseRestController {
	@Autowired
	private GenericManager<Deposit, String> depositManager;
	
	@Value("${his.baseUrl}")
	private String baseUrl;
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
  	public Result getInfo(@PathVariable("id") String id){
  		Deposit model = this.depositManager.get(id);
  		return ResultUtils.renderPageResult(model);
  	}
  	
  	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
  	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit, 
  			@RequestParam(value = "data", defaultValue = "") String data){
  		Deposit query =  JSONUtils.deserialize(data, Deposit.class);
  		StringBuilder jql = new StringBuilder( " from Deposit where 1=1 ");
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
  		if(!StringUtils.isEmpty(query.getAppType())){
  			jql.append(" and appType = ? ");
  			values.add(query.getAppType());
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
  		
  		this.depositManager.findPage(page);
  		return ResultUtils.renderPageResult(page);
  	}

  	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
  	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
  		Deposit query =  JSONUtils.deserialize(data, Deposit.class);
  		StringBuilder jql = new StringBuilder( " from Deposit where 1=1 ");
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
  		if(!StringUtils.isEmpty(query.getAppType())){
  			jql.append(" and appType = ? ");
  			values.add(query.getAppType());
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
  		
  		List<Deposit> deposits = this.depositManager.find(jql.toString(),values.toArray());
  		return ResultUtils.renderSuccessResult(deposits);
  	}
  	/**    
  	 * 功能描述：创建预存记录
  	 *@param data
  	 *@return       
  	 *@author GW
  	 *@date 2018年3月20日             
  	*/
  	@RequestMapping(value="/recharge",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
  	public Result forCreate(@RequestBody String data){
  		Deposit deposit =  JSONUtils.deserialize(data, Deposit.class);
  		deposit.setDepositTime(new Date());
  		Deposit saved = this.depositManager.save(deposit);
  		return ResultUtils.renderSuccessResult(saved);
  	}

  	@RequestMapping(value = "/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
  	public Result forRemove(@PathVariable("id") String id){
  		try {
  			this.depositManager.delete(id);
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
  			idSql.append("DELETE FROM TREAT_DEPOSIT WHERE ID IN (");
  			for(int i = 0 ; i < ids.size() ; i++) {
  				idSql.append("?");
  				idvalues.add(ids.get(i).toString());
  				if(i != ids.size() - 1) idSql.append(",");
  			}
  			idSql.append(")");
  			this.depositManager.executeSql(idSql.toString(), idvalues.toArray());
  		} catch (Exception e) {
  			e.printStackTrace();
  			throw new BaseException("删除失败");
  		}
  		return ResultUtils.renderSuccessResult();
  	}
@RequestMapping(value="/callback",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
  	public Result DepositCallback(@RequestBody String data){
  		Trade trade =  JSONUtils.deserialize(data, Trade.class);
  		if (StringUtils.isEmpty(trade.getBizNo())) {
  			ResultUtils.renderFailureResult();
  		}
  		// 1.回写运存表
  		Deposit depositModel = this.depositManager.get(trade.getBizNo());
  		
		if (trade.getPayChannleCode().equals("wxpay")) {
			depositModel.setTradeChannel("W");
			depositModel.setTradeChannelCode("9998");
  		} else if (trade.getPayChannleCode().equals("aliPay")) {
  			depositModel.setTradeChannel("Z");
  			depositModel.setTradeChannelCode("9999");
  		}

		depositModel.setTradeNo(trade.getTradeNo()); 
		depositModel.setStatus(trade.getStatus());
  		Deposit saved = this.depositManager.save(depositModel);
  		
  	
		RestTemplate restTemplate = new RestTemplate();
    	ResponseEntity<Deposit> response = restTemplate.postForEntity(baseUrl + "hcp/app/test/deposit/recharge", depositModel, Deposit.class);
    	if(response.getStatusCode() == HttpStatus.OK){
    		Deposit resultDeposit = response.getBody();
    		depositModel.setNo(resultDeposit.getNo());
    		depositModel.setTradeTime(resultDeposit.getTradeTime());
    		depositModel.setBalance(resultDeposit.getBalance());
    		this.depositManager.save(depositModel);
    	}
  		return ResultUtils.renderSuccessResult();
  	}}
