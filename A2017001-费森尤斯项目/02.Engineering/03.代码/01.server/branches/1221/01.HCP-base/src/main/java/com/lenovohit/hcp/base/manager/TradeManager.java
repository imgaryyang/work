package com.lenovohit.hcp.base.manager;

import java.math.BigDecimal;

import com.lenovohit.hcp.payment.model.HcpOrder;

/**
 * 收银台供外部调用manager，暂时写在base里，在payment实现。后续独立平台修改，改为http或其他方式
 * @description
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月21日
 */
public interface TradeManager {
	public HcpOrder createOrder(String orderNo, String operator, BigDecimal amt);

	public HcpOrder createOrder(HcpOrder order);
}
