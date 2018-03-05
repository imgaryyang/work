package com.lenovohit.hcp.pharmacy.manager;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.pharmacy.model.PhaBuyBill;

/**
 * 
 * @description 
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月17日
 */
public interface PhaBuyBillManager {
	/* 生成采购订单 */
	public PhaBuyBill createBuyBill(PhaBuyBill phaBuyBill, HcpUser hcpUser);
	
	/* 采购核准入库 */
	public String doProcureInstock(PhaBuyBill model, HcpUser user);
}
