package com.lenovohit.hcp.base.manager.impl;

import java.math.BigDecimal;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.hcp.base.manager.HisToOutChargeManager;
import com.lenovohit.hcp.base.manager.TradeManager;
import com.lenovohit.hcp.payment.model.HcpOrder;

@Service
@Transactional
public class HisToOutChargeManagerImpl implements HisToOutChargeManager {
	@Autowired
	private TradeManager tradeManager;

	@Override
	public HcpOrder createOrder(String orderNo, String operator, BigDecimal amt) {
		return tradeManager.createOrder(orderNo, operator, amt);
	}

}
