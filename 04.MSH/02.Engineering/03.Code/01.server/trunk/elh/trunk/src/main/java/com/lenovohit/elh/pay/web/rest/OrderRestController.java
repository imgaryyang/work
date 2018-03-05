package com.lenovohit.elh.pay.web.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
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
import com.lenovohit.core.web.controller.BaseController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.el.ElConstants;
import com.lenovohit.el.base.model.User;
import com.lenovohit.elh.pay.model.Order;

@RestController
@RequestMapping("/elh/order/")
public class OrderRestController extends BaseController {
	@Autowired
	private GenericManager<Order, String> orderManager;
	/******************************************************机构端方法*************************************************************************/	
	@RequestMapping(value = "{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入Id为空！");
		}
		Order model = this.orderManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}
	

	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("查询列表数据，输入查询条件为：【" + data + "】");
		Map<?,?> dataMap = JSONUtils.deserialize(data, Map.class);
		
		StringBuffer jql = new StringBuffer("select o, up from Order o, UserPatient up where o.patientId = up.id");
		List<String> values = new ArrayList<String>();
		if(null != dataMap.get("patientId")){
			jql.append(" and o.patientId = ?");
			values.add(dataMap.get("patientId").toString());
		}
		if(null != dataMap.get("treatmentId")){
			jql.append(" and o.treatmentId = ?");
			values.add(dataMap.get("treatmentId").toString());
		}
		if(null != dataMap.get("hospitalId")){
			jql.append(" and o.hospitalId = ?");
			values.add(dataMap.get("hospitalId").toString());
		}
		if(null != dataMap.get("status")){
			jql.append(" and o.status = ?");
			values.add(dataMap.get("status").toString());
		}
		if(null != dataMap.get("name")){
			jql.append(" and up.name like ?");
			values.add("%"+ dataMap.get("name").toString() +"%");
		}
		if(null != dataMap.get("mobile")){
			jql.append(" and up.mobile = ?");
			values.add(dataMap.get("mobile").toString());
		}
		if(null != dataMap.get("idno")){
			jql.append(" and up.idno = ?");
			values.add(dataMap.get("idno").toString());
		}
		jql.append(" order by o.createTime desc");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.orderManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}
	/******************************************************机构端方法end*************************************************************************/	
	/******************************************************app端方法*************************************************************************/	
	
	@RequestMapping(value = "my/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyOrders(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize) {
		User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		if (null == _user) {
			return ResultUtils.renderFailureResult("请先登录系统");
		}
		String userId = _user.getId();
		StringBuffer jql = new StringBuffer("select distinct(o) from Order o, UserPatient up where o.patientId = up.patientId");
		List<String> values = new ArrayList<String>();
		if(StringUtils.isNoneBlank(userId)){
			jql.append(" and up.userId = ?");
			values.add(userId);
		}
		jql.append(" order by o.createTime desc");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.orderManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}
	@RequestMapping(value = "my/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyOrderInfo(@PathVariable("id") String id) {
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入Id为空！");
		}
		Order model = this.orderManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}
	/******************************************************app端方法end*************************************************************************/	
	/******************************************************运营端方法*************************************************************************/	
	/******************************************************运营端方法end*************************************************************************/	
}
