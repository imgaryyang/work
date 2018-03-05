package com.lenovohit.hcp.material.manager;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.material.model.MatBuyBill;

/**
 * 
 * @description 
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月17日
 */
public interface MatBuyBillManager {
	/* 生成采购订单 */
	void createBuyBill(MatBuyBill matBuyBill, HcpUser hcpUser);
}
