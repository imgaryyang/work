package com.lenovohit.hcp.payment.manager.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.manager.HisForOutChargeManager;
import com.lenovohit.hcp.payment.manager.TradeNofityManager;
import com.lenovohit.hcp.payment.model.HcpOrder;
import com.lenovohit.hcp.payment.model.HcpSettlement;
import com.lenovohit.hcp.payment.model.HisPayResult;

@Service
public class TradeNotifyManagerImpl implements TradeNofityManager {
	@Autowired
	private GenericManager<HcpSettlement, String> hcpSettlementManager;
	@Autowired
	private GenericManager<HcpOrder, String> hcpOrderManager;
	@Autowired
	// TODO 现在接口调用，后续独立可改为webservice、http、rpc等
	private HisForOutChargeManager hisForOutChargeManager;

	@Override
	public void payResultNofity(boolean isSuccess, String orderNo) {
		HcpOrder order = hcpOrderManager.findOneByProp("orderNo", orderNo);
		List<HcpSettlement> settlements = hcpSettlementManager.findByProp("order", order);
		HisPayResult result = new HisPayResult();
		result.setSuccess(isSuccess);
		result.setOrderNo(order.getOrderNo());
		result.setOperator(order.getOperator());
		result.setAmt(order.getAmt());
		Map<String, BigDecimal> map = result.getResultMap();
		for (HcpSettlement h : settlements) {
			map.put(h.getPayChannelCode(), h.getAmt());
		}
		hisForOutChargeManager.payConfirmed(result);
	}

}
