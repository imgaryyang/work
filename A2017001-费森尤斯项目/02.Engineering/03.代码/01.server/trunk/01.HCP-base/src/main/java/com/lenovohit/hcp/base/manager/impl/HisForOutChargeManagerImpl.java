package com.lenovohit.hcp.base.manager.impl;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.manager.HisForOutChargeManager;
import com.lenovohit.hcp.base.manager.HisInterChargeManager;
import com.lenovohit.hcp.payment.model.HisPayResult;

@Service
public class HisForOutChargeManagerImpl implements HisForOutChargeManager {
	@Autowired
	private HisInterChargeManager hisInterChargeManager;

	@Override
	public void payConfirmed(HisPayResult result) {
		checkResult(result);
		doPayConfirmed(result);
	}

	private void doPayConfirmed(HisPayResult result) {
		hisInterChargeManager.handleChargeReturn(result);
	}

	private void checkResult(HisPayResult result) {
		if (StringUtils.isBlank(result.getOrderNo()))
			throw new RuntimeException("订单号不能为空");
		if (StringUtils.isBlank(result.getOperator()))
			throw new RuntimeException("操作员不能为空");
		if (StringUtils.isBlank(result.getAmt()))
			throw new RuntimeException("订单金额不能为空");
		if(result.isSuccess()){
			Map<String, BigDecimal> map = result.getResultMap();
			if (map.keySet().size() <= 0)
				throw new RuntimeException("返回的结算方式必须一种或者多种");
		}
	}

}
