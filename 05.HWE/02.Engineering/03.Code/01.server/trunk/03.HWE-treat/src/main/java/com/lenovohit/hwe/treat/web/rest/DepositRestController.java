package com.lenovohit.hwe.treat.web.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.model.Deposit;
import com.lenovohit.hwe.treat.model.Trade;
import com.lenovohit.hwe.treat.service.HisDepositService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestResponse;

@RestController
@RequestMapping("/hwe/treat/deposit")
public class DepositRestController extends OrgBaseRestController {
	@Autowired
	private GenericManager<Deposit, String> depositManager;
	@Autowired
	private HisDepositService hisDepositService;
	@Value("${pay.baseUrl}")
	private String payBaseUrl;
	@Value("${pay.refundUrl}")
	private String refundUrl;
		
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
  		
  		if(!StringUtils.isEmpty(query.getHosId())){
  			jql.append(" and hosId = ? ");
  			values.add(query.getHosId());
  		}
  		
  		if(!StringUtils.isEmpty(query.getHosNo())){
  			jql.append(" and hosNo = ? ");
  			values.add(query.getHosNo());
  		}
  		
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
  	
  	// 充值回调函数
  	@RequestMapping(value="/callback",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
  	public Result forCallback(@RequestBody String data){
  		Trade trade =  JSONUtils.deserialize(data, Trade.class);
  		if (StringUtils.isEmpty(trade.getBizNo())) {
  			ResultUtils.renderFailureResult();
  		}
  		Deposit depositModel = this.depositManager.get(trade.getBizNo());
  		
		if (trade.getPayChannleCode().equals("wxpay")) {
			depositModel.setTradeChannel("W");
			depositModel.setTradeChannelCode("9998");
  		} else if (trade.getPayChannleCode().equals("alipay")) {
  			depositModel.setTradeChannel("Z");
  			depositModel.setTradeChannelCode("9999");
  		}

		depositModel.setTradeNo(trade.getTradeNo()); 
		depositModel.setTradeTime(trade.getTradeTime());
		depositModel.setStatus(trade.getStatus());
		depositModel.setTradeTerminalCode("00");// 此为测试数据，用于区分hcp中deposit表的数据是门诊还是住院(当前的模拟数据都存储在了deposit表中了)
  		this.depositManager.save(depositModel);
  		
  		
  		Map<String, Object> variables = new HashMap<String, Object>();
  		variables.put("tradeModel", trade);
  		RestEntityResponse<Deposit> restResponse = hisDepositService.recharge(depositModel, variables);
    	if(restResponse.isSuccess()){
    		Deposit resultDeposit = restResponse.getEntity();
    		depositModel.setNo(resultDeposit.getNo());
    		depositModel.setDepositTime(resultDeposit.getDepositTime());
    		this.depositManager.save(depositModel);
    	}
  		return ResultUtils.renderSuccessResult();
  	}
  	
  	// 实质是生成退换的业务单
  	@RequestMapping(value="/refund",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
  	public Result refund(@RequestBody String data){		
		Deposit deposit =  JSONUtils.deserialize(data, Deposit.class);
		// 1.生成业务单 deposit
  		deposit.setDepositTime(new Date());
  		deposit.setType(Deposit.TYPE_REFUND);
  		deposit.setStatus(Deposit.STATUS_INITIAL);
  		Deposit saved = this.depositManager.save(deposit);
  		
  		// 2.调用"his退款冻结接口"
  		RestEntityResponse<Deposit> responseFreeze = hisDepositService.freeze(saved, null);
  		 // 2.1 his不同意退款
  		if (!responseFreeze.isSuccess()) {
  			// 将预存记录状态置为"关闭"
  			saved.setStatus(Deposit.STATUS_CLOSED);
  			this.depositManager.save(saved);
  			// 向调用端返回错误
  	  		return ResultUtils.renderFailureResult(responseFreeze.getMsg(), saved);  
  	    } else { 
  	    	// 2.1 his同意退款, 调用第三方退款接口
  	    	// 2.1.1 更新本地状态为受理中
  	    	Deposit freezeDepositModel = responseFreeze.getEntity();
  			saved.setStatus(Deposit.STATUS_IN_PROCESS);
  			saved.setNo(freezeDepositModel.getNo());
  			this.depositManager.save(saved);
  	  		
  	    	// 2.1.2 调用第三方支付接口
  			Map<String, Object> variables = new HashMap<String, Object>();
  			variables.put("amt", deposit.getAmt());
  			variables.put("appCode", deposit.getAppCode());
  			variables.put("settleTitle", "退款:" + deposit.getAmt() + "元");
  			variables.put("bizType", "00");
  			variables.put("bizNo", deposit.getId());
  			variables.put("bizUrl", "");
  			variables.put("bizTime", deposit.getDepositTime());
  			variables.put("oriTradeNo", deposit.getTradeNo());
  			
  			RestTemplate restTemplate = new RestTemplate();
			ResponseEntity<String> responseEntity = restTemplate.postForEntity(payBaseUrl + refundUrl, variables, String.class);
			RestResponse restResponse =  JSONUtils.deserialize(responseEntity.getBody(), RestResponse.class);
  	    	// 2.1.2.1 调用第三方接口通信成功
  	    	if(responseEntity.getStatusCode() == HttpStatus.OK && restResponse.isSuccess()){
  	    		Trade trade = JSONUtils.parseObject(restResponse.getResult(), Trade.class);  	    		 
  	    		// 2.1.2.1.1 退款成功
	    		if (trade.getStatus().equals(Trade.SETTLE_STAT_REFUND_SUCCESS)) {
  	    			saved.setStatus(Deposit.STATUS_SUCCESS);			// 成功
  	  	    		this.depositManager.save(saved);
	    			hisDepositService.confirmFreeze(saved, null);
  		    		return ResultUtils.renderSuccessResult("交易成功",saved);
	    		} else if (trade.getStatus().equals(Trade.SETTLE_STAT_REFUND_FAILURE)) { // 2.1.2.1.2 退款失败
	    			saved.setStatus(Deposit.STATUS_CLOSED);			// 交易关闭
	    			hisDepositService.unfreeze(saved, null);
	  	    		this.depositManager.save(saved);
		    		return ResultUtils.renderFailureResult("交易失败", saved);
	    		} else if (trade.getStatus().equals(Trade.SETTLE_STAT_EXCEPTIONAL)){ // 2.1.2.1.3 退款异常
	    			saved.setStatus(Deposit.STATUS_EXCEPTION);			// 交易异常
	    			this.depositManager.save(saved);
	    			// 这里并未对his进行冻结或者解冻
		    		return ResultUtils.renderFailureResult("交易异常", saved);
	    		}
  	    	} else {
  	 			saved.setStatus(Deposit.STATUS_EXCEPTION);			// 交易异常
    			this.depositManager.save(saved);
	    		return ResultUtils.renderFailureResult("交易异常", saved);  	    	
	    	}
  	    }
  		return ResultUtils.renderFailureResult();
  	}
}
