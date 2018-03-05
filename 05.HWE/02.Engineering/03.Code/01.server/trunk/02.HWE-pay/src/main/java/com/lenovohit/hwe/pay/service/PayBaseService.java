package com.lenovohit.hwe.pay.service;

import com.lenovohit.hwe.pay.model.Settlement;

public interface PayBaseService {
	public void prePay(Settlement settlement);
	public void payCallback(Settlement settlement);
	public void refund(Settlement settlement);
	public void query(Settlement settlement);
	public void refundQuery(Settlement settlement);
}
