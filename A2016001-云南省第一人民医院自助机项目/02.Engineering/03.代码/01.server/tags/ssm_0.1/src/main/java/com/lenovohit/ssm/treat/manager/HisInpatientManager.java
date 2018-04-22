package com.lenovohit.ssm.treat.manager;

import java.math.BigDecimal;
import java.util.List;

import com.lenovohit.ssm.treat.model.InpatientBill;
import com.lenovohit.ssm.treat.model.InpatientDailyBillDetail;
import com.lenovohit.ssm.treat.model.InpatientInfo;
import com.lenovohit.ssm.treat.model.Patient;

public interface HisInpatientManager {
	/**
	 * 查询住院基本信息	inpatient/{patientId}	get
	 * @param patient
	 * @return
	 */
	InpatientInfo getBaseInfo(Patient patient);
	/**
	 * 按照日期查询住院清单	inpatient/dailyBill/list	get
	 * @param baseInfo
	 * @param date
	 * @return
	 */
	List<InpatientDailyBillDetail> getDailyBill(InpatientInfo baseInfo,String date);
	/**
	 * 住院费用查询	inpatient/inpatientBill/list	get
	 * @param patient
	 * @return
	 */
	List<InpatientBill>  getInpatientBill(InpatientInfo baseInfo);
	
	/**
	 * 查询住院预缴费余额	inpatient/deposit/balance	get
	 * @param patient
	 * @return
	 */
	BigDecimal depositBalance(Patient patient);
	
	/**
	 * 住院预缴	inpatient/deposit/book	post
	 * @param order
	 * @param settle
	 */
	//void bizAfterPay(Order order,Settlement settle);
}
