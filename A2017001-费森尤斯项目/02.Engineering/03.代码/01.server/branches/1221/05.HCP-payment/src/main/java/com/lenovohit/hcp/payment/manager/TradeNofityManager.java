package com.lenovohit.hcp.payment.manager;

/**
 * 
 * @description 支付平台调用外部通知接口
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月12日
 */
public interface TradeNofityManager {
	/**
	 * 支付后通知接口
	 * @param isSuccess
	 * @param orderId(为32位uuid)
	 */
	void payResultNofity(boolean isSuccess, String orderNo);
}
