package com.lenovohit.ssm.payment.web.rest;

import java.math.BigDecimal;
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

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.payment.model.Order;

/**
 * 订单管理
 * 
 */
@RestController
@RequestMapping("/ssm/payment/order")
public class OrderRestController extends BaseRestController {
	@Autowired
	private GenericManager<Order, String> orderManager;
	
	
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		Order model = orderManager.get(id);
		return ResultUtils.renderPageResult(model);
	}
	@RequestMapping(value = "/page/rep/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forReportPage(@PathVariable("start") String start, @PathVariable("limit") String limit, @RequestParam(value = "data", defaultValue = "") String data){
		Order model =  JSONUtils.deserialize(data, Order.class);
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery("from Order where 1=1 and machineCode = ? order by createTime");
		List<Object> values = new ArrayList<Object>();
		values.add(model.getMachineCode());
		page.setValues(values.toArray());
		
		orderManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		
		System.out.println("data : " + data);
		Order query = JSONUtils.deserialize(data, Order.class);
		StringBuilder jql = new StringBuilder(" from Order where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		if (!StringUtils.isEmpty(query.getPatientName())) {
			jql.append(" and patientName like ? ");
			values.add("%"+query.getPatientName()+"%");
		}
		if (!StringUtils.isEmpty(query.getPatientNo())) {
			jql.append(" and patientNo like ? ");
			values.add("%"+query.getPatientNo()+"%");
		}
		if (!StringUtils.isEmpty(query.getPatientIdNo())) {
			jql.append(" and patientIdNo like ? ");
			values.add("%"+query.getPatientIdNo()+"%");
		}
		if (!StringUtils.isEmpty(query.getMachineCode())) {
			jql.append(" and machineCode like ? ");
			values.add("%"+query.getMachineCode()+"%");
		}
		if (!StringUtils.isEmpty(query.getOrderType())) {
			jql.append(" and orderType = ? ");
			values.add(query.getOrderType());
		}
		if (!StringUtils.isEmpty(query.getBizType() )) {
			jql.append(" and bizType = ? ");
			values.add(query.getBizType() );
		}
		if (!StringUtils.isEmpty(query.getStatus())) {
			jql.append(" and status = ? ");
			values.add(query.getStatus());
		}
		if (query.getAmt().compareTo(new BigDecimal(0)) != 0) {
			jql.append(" and amt = ? ");
			values.add(query.getAmt());
		}
		if (query.getRealAmt().compareTo(new BigDecimal(0)) != 0) {
			jql.append(" and realAmt = ? ");
			values.add(query.getRealAmt());
		}
		Date createTime = query.getCreateTime();
		if (null != createTime) {
			jql.append(" and createTime > ? ");
			createTime.setHours(0);
			createTime.setMinutes(0);
			createTime.setSeconds(0);
			values.add(createTime);
		}
		jql.append(" order by createTime desc ");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		orderManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Order> list = orderManager.findAll();
		return ResultUtils.renderSuccessResult(list);
	}
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreate(@RequestBody String data){
		Order model =  JSONUtils.deserialize(data, Order.class);
		//TODO 校验
		Order saved = this.orderManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		Order model =  JSONUtils.deserialize(data, Order.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult();
		}
		this.orderManager.save(model);

		return ResultUtils.renderSuccessResult();
	}
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id){
		try {
			this.orderManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/reportExp/{orderId}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forReportExp(@PathVariable("orderId") String settleId) {
		if(StringUtils.isEmpty(settleId)) return ResultUtils.renderFailureResult("结算单id不许为空");
		Order model = this.orderManager.get(settleId);
		if(null == model) return ResultUtils.renderFailureResult("不存在的结算单");
		if (model == null || StringUtils.isBlank(model.getId())) {
			return ResultUtils.renderFailureResult();
		}
		model.setOptTime(DateUtils.getCurrentDate());
		model.setOptId("");
		model.setOptName("");
		model.setOperation("订单金额异常");
		model.setOptStatus(Order.OPT_STAT_EXP);
		this.orderManager.save(model);

		return ResultUtils.renderSuccessResult(model);
	}
}
