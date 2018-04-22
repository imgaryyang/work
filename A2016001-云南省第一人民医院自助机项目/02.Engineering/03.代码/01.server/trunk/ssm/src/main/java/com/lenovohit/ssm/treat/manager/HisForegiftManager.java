package com.lenovohit.ssm.treat.manager;

import com.lenovohit.ssm.payment.manager.HisPayManager;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.treat.model.ForegiftRecord;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisResponse;

public interface HisForegiftManager extends HisPayManager{
	/**
	 * 预缴状态查询，是否允许预存/退款（PRESTORE0009）
	 * @return
	 */
	HisResponse foregiftState();
	/**
	 * 银行卡住院预缴充值（PRESTORE0008）
	 * @param order
	 * @return
	 */
	HisEntityResponse<ForegiftRecord> cardRecharge(Order order, Settlement settle);
	
	/**
	 * 门诊预存转住院预缴（PRESTORE0003）
	 * @param order
	 * @return
	 */
	HisEntityResponse<ForegiftRecord> balanceRecharge(Order order, Settlement settle);
	
}
