package com.lenovohit.hwe.pay.service;

import java.util.Map;

/**
 * 
 * @description 支付平台回调
 * @author zyus
 * @version 1.0.0
 * @date 2018年1月12日
 */
public interface TradeCallbackService {
	void callback(Map<String, Object> tradeModel);
}
