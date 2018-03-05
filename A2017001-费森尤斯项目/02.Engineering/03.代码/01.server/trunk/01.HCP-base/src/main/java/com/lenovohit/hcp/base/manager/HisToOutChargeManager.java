package com.lenovohit.hcp.base.manager;

import java.math.BigDecimal;

import com.lenovohit.hcp.payment.model.HcpOrder;

/**
 * his平台调用外部收费统一接口,包括订单生成,退费等
 * @description
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月21日
 */
public interface HisToOutChargeManager {
	HcpOrder createOrder(String orderNo, String operator, BigDecimal amt);
}
