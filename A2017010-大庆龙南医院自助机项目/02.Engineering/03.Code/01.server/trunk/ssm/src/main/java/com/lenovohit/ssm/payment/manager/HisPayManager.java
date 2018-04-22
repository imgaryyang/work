package com.lenovohit.ssm.payment.manager;

import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.treat.transfer.manager.HisResponse;

public interface HisPayManager {
	/**
	 * 订单支付成功业务回调
	 * @param order 订单
	 * @param settle 当前结算单
	 * TODO 泛型方法，获取返回值
	 */
	public HisResponse bizAfterPay(Order order, Settlement settle);
	
	/**
	 * 订单退款成功业务回调
	 * @param order 订单
	 * @param settle 当前结算单
	 * TODO 泛型方法，获取返回值
	 */
	public HisResponse bizAfterRefund(Order order, Settlement settle);
}
