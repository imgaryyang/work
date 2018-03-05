package com.lenovohit.hcp.base.manager;

import com.lenovohit.hcp.payment.model.HisPayResult;

/**
 * his平台供外部调用统一入口，包括收费通知、退费通知等业务。主要是为了解析返回数据，
 * 	调用his内部处理逻辑
 * @description
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月21日
 */
public interface HisForOutChargeManager {
	/**
	 * 确认支付调用接口
	 * @param result
	 */
	void payConfirmed(HisPayResult result);
}
