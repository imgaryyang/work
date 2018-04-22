package com.lenovohit.ssm.treat.manager;

import java.util.List;

import com.lenovohit.ssm.payment.manager.HisPayManager;
import com.lenovohit.ssm.treat.model.Patient;
import com.lenovohit.ssm.treat.model.UnPayedFeeRecord;

public interface HisFeeManager extends HisPayManager{
	
	
	/**
	 * 待缴费明细查询	fee/list	get
	 * @param patient
	 * @return
	 */
	List<UnPayedFeeRecord> getUnPayedFees(Patient patient);
	
	
	/**
	 *  缴费记账	fee/paid	post 继承自父类
	 * @param order
	 * @param settle
	 */
	//void bizAfterPay(Order order,Settlement settle);
}
