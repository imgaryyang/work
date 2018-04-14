package com.lenovohit.hcp.test.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.authority.web.rest.AuthorityRestController;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.test.model.TestDeposit;
import com.lenovohit.hcp.test.model.TestProfile;
import com.lenovohit.hcp.test.model.TestTrade;

@RestController
@RequestMapping("/hcp/app/test/deposit")
public class DepositTestController extends AuthorityRestController {
	@Autowired
	private GenericManager<TestDeposit, String> testDepositManager;
	@Autowired
	private GenericManager<TestProfile, String> testProfileManager;

//	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
//	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
//		
//		
//		List<TestDeposit> list = this.testDepositManager.findAll();
//		return ResultUtils.renderSuccessResult(list);
//	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
  	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		System.out.println(data);
  		TestDeposit query =  JSONUtils.deserialize(data, TestDeposit.class);
  		StringBuilder jql = new StringBuilder( " from TestDeposit where 1=1 ");
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
  		if(!StringUtils.isEmpty(query.getTradeChannel())){
  			jql.append(" and tradeChannel in ('Z','W') ");
//  			values.add(query.getTradeChannel());
  		}
  		if(!StringUtils.isEmpty(query.getTradeNo())){
  			jql.append(" and tradeNo = ? ");
  			values.add(query.getTradeNo());
  		}
  		if(!StringUtils.isEmpty(query.getStatus())){
  			jql.append(" and status = ? ");
  			values.add(query.getStatus());
  		}
  		// 为了测试，his的模拟数据中，outTradeNo标识数据为充值(00)还是(04)预缴
  		if(!StringUtils.isEmpty(query.getBizType())){
  			jql.append(" and tradeTerminalCode = ? ");
  			values.add(query.getBizType());
  		}
  		
  		if(!StringUtils.isEmpty(query.getStatus())){
  			jql.append(" and status = ? ");
  			values.add(query.getStatus());
  		}
  		
  		if(query.getMinTradeTime() != null) {
  			jql.append(" and tradeTime >= ? ");
  			values.add(query.getMinTradeTime());
  		}
		if(query.getMaxTradeTime() != null) {
  			jql.append(" and tradeTime <= ? ");
  			values.add(query.getMaxTradeTime());
  		}
		if(!StringUtils.isEmpty(query.getType())) {
			jql.append(" and type in ( ? ) ");
			values.add(query.getType());
		}
		
  		jql.append("order by tradeTime desc ");
  		
  		List<TestDeposit> deposits = this.testDepositManager.find(jql.toString(),values.toArray());
  		return ResultUtils.renderSuccessResult(deposits);
  	}
	
	
	// 模拟his返回充值后的数据
	@RequestMapping(value = "/recharge", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public TestTrade recharge(@RequestBody String data) {
  		TestDeposit testDeposit =  JSONUtils.deserialize(data, TestDeposit.class);
  		TestDeposit saved = testDepositManager.save(testDeposit);
		
		TestTrade testTrade = new TestTrade();
		testTrade.setNo(saved.getId()); // his交易号，用时间戳来模拟
		testTrade.setBalance(new BigDecimal((System.currentTimeMillis() % 100)));
		return testTrade;
	}
	
	// 退款冻结
	@RequestMapping(value = "/freeze", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result freeze(@RequestBody String data) {
  		TestDeposit testDeposit =  JSONUtils.deserialize(data, TestDeposit.class);
  		String oriId = testDeposit.getId();
  		testDeposit.setId(null);
  		// 这里是模拟his接口，假设同意，同意后保存该条数据
  		TestDeposit saved = testDepositManager.save(testDeposit);
  		// 为了后续的模拟方便，保持HIS端的ID与APP端的ID一致
  		testDepositManager.executeSql("update TEST_TREAT_DEPOSIT set id = '" + oriId + "' where id='" + saved.getId() + "'");
		return ResultUtils.renderSuccessResult(saved);
//		return ResultUtils.renderFailureResult("余额不足",testDeposit);
	}
	
	// 退款冻结确认
	@RequestMapping(value = "/confirmFreeze", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result confirmFreeze(@RequestBody String data) {
  		TestDeposit testDeposit =  JSONUtils.deserialize(data, TestDeposit.class);
  		testDeposit.setStatus("0");		// 确认冻结，说明该条退款成功
  		TestDeposit saved = testDepositManager.save(testDeposit);
		return ResultUtils.renderSuccessResult(testDeposit);
	}
	
	// 退款冻结取消
	@RequestMapping(value = "/unfreeze", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result unfreeze(@RequestBody String data) {
  		TestDeposit testDeposit =  JSONUtils.deserialize(data, TestDeposit.class);
  		testDeposit.setStatus("9");		// 解冻，说明该条退款失败
  		TestDeposit saved = testDepositManager.save(testDeposit);
		return ResultUtils.renderSuccessResult(testDeposit);
	}
}
