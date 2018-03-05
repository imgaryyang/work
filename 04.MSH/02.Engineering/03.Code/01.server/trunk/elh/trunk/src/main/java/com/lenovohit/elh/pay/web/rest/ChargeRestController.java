package com.lenovohit.elh.pay.web.rest;

import java.util.ArrayList;
import java.util.List;

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
import com.lenovohit.elh.pay.model.Charge;

@RestController
@RequestMapping("/elh/charge/")
public class ChargeRestController extends BaseController {
	
	@Autowired
	private GenericManager<Charge, String> chargeManager;
	
	
	@RequestMapping(value = "{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入Id为空！");
		}
		Charge model = this.chargeManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}
	

	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start, @PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("查询列表数据，输入查询条件为：【" + data + "】");
		Charge model = JSONUtils.deserialize(data, Charge.class);
		
		StringBuffer jql = new StringBuffer("from Charge n where 1=1 ");
		List<String> values = new ArrayList<String>();
		if(null != model){
			if(StringUtils.isNotBlank(model.getType())){
				jql.append(" and n.type = ?");
				values.add(model.getType());
			}
			if(StringUtils.isNotBlank(model.getOrderId())){
				jql.append(" and n.orderId = ?");
				values.add(model.getOrderId());
			}
			if(StringUtils.isNotBlank(model.getComment())){
				jql.append(" and n.comment ?");
				values.add("%"+ model.getComment() +"%");
			}
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.chargeManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}
	/******************************************************app端方法*************************************************************************/	
	
	@RequestMapping(value = "my/listByOrder/{orderId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forFindByOrder(@PathVariable(value = "orderId") String orderId) {
		log.info("查询订单详情列表，订单为：【" + orderId + "】");
		
		StringBuffer jql = new StringBuffer("from Charge n where 1=1");
		List<String> values = new ArrayList<String>();
		if(StringUtils.isNotBlank(orderId)){
			jql.append(" and n.orderId = ?");
			values.add(orderId);
		}
		jql.append(" order by n.createTime desc");

		List<Charge> cList = this.chargeManager.find(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(cList);
	}
	/******************************************************app端方法*************************************************************************/	
	
}
