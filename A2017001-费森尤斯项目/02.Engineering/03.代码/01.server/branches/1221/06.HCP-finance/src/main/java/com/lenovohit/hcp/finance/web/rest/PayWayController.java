package com.lenovohit.hcp.finance.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.finance.model.PayWay;

/**
 * 账户基本信息管理
 */
@RestController
@RequestMapping("/hcp/finance/payWay")
public class PayWayController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<PayWay, String> payWayManager;

}
