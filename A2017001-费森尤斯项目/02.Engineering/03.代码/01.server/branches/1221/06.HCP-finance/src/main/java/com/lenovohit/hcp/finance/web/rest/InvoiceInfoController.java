package com.lenovohit.hcp.finance.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.finance.model.InvoiceInfo;
import com.lenovohit.hcp.finance.model.InvoiceInfoDetail;

/**
 * 发票管理
 */
@RestController
@RequestMapping("/hcp/finance/invoice")
public class InvoiceInfoController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<InvoiceInfo, String> invoiceInfoManager;
	
	@Autowired
	private GenericManager<InvoiceInfoDetail, String> invoiceInfoDetailManager;

}
