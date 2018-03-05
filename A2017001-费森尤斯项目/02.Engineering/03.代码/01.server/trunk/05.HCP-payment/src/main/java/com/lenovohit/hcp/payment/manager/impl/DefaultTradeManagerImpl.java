package com.lenovohit.hcp.payment.manager.impl;

import java.math.BigDecimal;
import java.util.Date;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.manager.TradeManager;
import com.lenovohit.hcp.payment.model.HcpOrder;

@Service
@Transactional
public class DefaultTradeManagerImpl implements TradeManager {
	@Autowired
	@Qualifier("hcpOrderManager")
	private GenericManager<HcpOrder, String> hcpOrderManager;

	@Override
	public HcpOrder createOrder(String orderNo, String operator, BigDecimal amt) {
		checkParams(orderNo, operator, amt);
		HcpOrder order = new HcpOrder(orderNo, operator, amt);
		order.setCreateTime(new Date());
		return hcpOrderManager.save(order);
	}

	@Override
	public HcpOrder createOrder(HcpOrder order) {
		checkParams(order.getOrderNo(), order.getOperator(), order.getAmt());
		order.setCreateTime(new Date());
		return hcpOrderManager.save(order);
	}

	private void checkParams(String orderNo, String operator, BigDecimal amt) {
		if (StringUtils.isBlank(orderNo))
			throw new RuntimeException("订单号不能为空");
		if (StringUtils.isBlank(operator))
			throw new RuntimeException("操作员不能为空");
		if (StringUtils.isBlank(amt))
			throw new RuntimeException("金额不能为空");
	}

}
