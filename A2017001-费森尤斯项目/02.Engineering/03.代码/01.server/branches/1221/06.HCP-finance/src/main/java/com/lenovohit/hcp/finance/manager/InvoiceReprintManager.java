package com.lenovohit.hcp.finance.manager;

import com.lenovohit.hcp.finance.web.rest.InvoiceReprintController.UserNow;

/**
 * 
 * @description 结账统一接口
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月17日
 */
public interface InvoiceReprintManager {
	/* 退费 */
	void forRefund(String hosId, String invoiceNo, UserNow userNow);
	/* 发票重打 */
	void forReprint(String hosId, String invoiceNo, UserNow userNow);
	void forRefundOtherInfo(String hosId, String invoiceNo, UserNow userNow, String regId);
}
