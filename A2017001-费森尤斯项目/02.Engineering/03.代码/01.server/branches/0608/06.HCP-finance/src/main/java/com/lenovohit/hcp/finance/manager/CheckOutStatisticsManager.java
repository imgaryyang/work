package com.lenovohit.hcp.finance.manager;

import java.util.List;

import com.lenovohit.hcp.finance.model.AccountItemStatisticsDto;
import com.lenovohit.hcp.finance.model.OperBalance;
import com.lenovohit.hcp.finance.model.PayWayStatisticsDto;

/**
 * 挂号以及门诊结账统计manager
 * @description
 * @author jatesun
 * @version 1.0.0
 * @date 2017年5月27日
 */
public interface CheckOutStatisticsManager {
	// PAY_MODE
	List<PayWayStatisticsDto> listPayWayStatistics(List<OperBalance> balances);

	List<AccountItemStatisticsDto> listAccountItemStatistics(List<OperBalance> balances);
}
