package com.lenovohit.hcp.payment.utils;

import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.payment.model.HcpSettlement;

public class StateUtils {
	public static final boolean isSettlementPayed(HcpSettlement settlement) {
		return StringUtils.equals(settlement.getStatus(), HcpSettlement.SETTLE_STAT_PAY_SUCCESS)
				|| StringUtils.equals(settlement.getStatus(), HcpSettlement.SETTLE_STAT_PAY_FINISH);
	}

	public static final boolean isSettlementPayFailed(HcpSettlement settlement) {
		return StringUtils.equals(settlement.getStatus(), HcpSettlement.SETTLE_STAT_EXCEPTIONAL)
				|| StringUtils.equals(settlement.getStatus(), HcpSettlement.SETTLE_STAT_PAY_FAILURE);
	}

	public static final boolean isSettlementPayClosed(HcpSettlement settlement) {
		return StringUtils.equals(settlement.getStatus(), HcpSettlement.SETTLE_STAT_CLOSED);
	}

	public static final boolean isSettlementPayInit(HcpSettlement settlement) {
		return StringUtils.equals(settlement.getStatus(), HcpSettlement.SETTLE_STAT_CLOSED);
	}
}
