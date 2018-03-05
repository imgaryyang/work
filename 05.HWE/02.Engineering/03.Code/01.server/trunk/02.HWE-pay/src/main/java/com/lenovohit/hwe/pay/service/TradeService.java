package com.lenovohit.hwe.pay.service;

import com.lenovohit.hwe.pay.exception.PayException;
import com.lenovohit.hwe.pay.model.Bill;
import com.lenovohit.hwe.pay.model.Settlement;

/**
 * 收银台供外部调用Service
 * @description
 * @author zyus
 * @version 1.0.0
 * @date 2018年1月16日
 */
public interface TradeService {

	public void createPay(Bill bill) throws PayException;
	public void prePay(Settlement settle) throws PayException;
	public void payCallback(Settlement settle) throws PayException;
	public void payQuery(Settlement settle) throws PayException;
	public void createRefund(Bill bill) throws PayException;
	public void refund(Settlement settle) throws PayException;
	public void refundQuery(Settlement settle) throws PayException;
}
