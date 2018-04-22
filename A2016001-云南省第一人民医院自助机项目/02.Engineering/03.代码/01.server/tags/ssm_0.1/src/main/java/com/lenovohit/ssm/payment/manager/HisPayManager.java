package com.lenovohit.ssm.payment.manager;

import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.Settlement;

public interface HisPayManager {
	/**
	 * @param order 订单
	 * @param settle 当前结算单
	 * TODO 泛型方法，获取返回值
	 */
	public void bizAfterPay(Order order,Settlement settle);
}
