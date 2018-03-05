package com.lenovohit.hcp.payment.manager;

import com.lenovohit.hcp.payment.model.HcpSettlement;

/**
 * 
 * @description 支付接口，定义了某种支付渠道需要实现的方法
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月11日
 */
public interface BasePayManager {
	/**
	 * 预支付方法。一般支付宝微信调用时都需要先调用支付宝或微信返回二维码之后扫码支付。
	 * 	这个方法就是为了通讯获取二维码，称为预支付
	 * @param settlement 结算单
	 */
	void precreate(HcpSettlement settlement);

	/**
	 * 回调方法，扫码支付成功后，支付宝或微信需要回调某个方法来通知支付完成或者失败，
	 * 	此方法即为处理返回逻辑
	 * @param settlement
	 */
	void payCallBack(HcpSettlement settlement);

	/**
	 * 退款方法，用于结算的退款
	 * @param settlement
	 */
	void refund(HcpSettlement settlement);

	void otRefund(HcpSettlement settlement);

}
