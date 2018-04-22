package com.lenovohit.ssm.payment.manager;

import com.lenovohit.ssm.payment.model.alipay.AlipayTradePrecreateRequest;
import com.lenovohit.ssm.payment.model.alipay.AlipayTradePrecreateResponse;

public interface AlipayManager {
	public AlipayTradePrecreateResponse precreate(AlipayTradePrecreateRequest request);
}
