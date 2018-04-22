package com.lenovohit.ssm.payment.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.ssm.payment.model.Order;

/**
 * APP用户管理
 * 
 */
@RestController
@RequestMapping("/ssm/payment/order")
public class OrderRestController extends BaseRestController {
	@Autowired
	private GenericManager<Order, String> orderManager;
	/**
	 * 生成订单
	 */	
	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}

}
