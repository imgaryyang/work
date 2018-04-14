package com.lenovohit.ssm.treat.manager;

import java.math.BigDecimal;

import com.lenovohit.ssm.payment.manager.HisPayManager;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.PayAccount;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.treat.model.ConsumeRecord;
import com.lenovohit.ssm.treat.model.DepositRecord;
import com.lenovohit.ssm.treat.model.HisOrder;
import com.lenovohit.ssm.treat.model.Patient;
import com.lenovohit.ssm.treat.model.PayHistory;
import com.lenovohit.ssm.treat.model.FeeHistory;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisResponse;

public interface HisDepositManager extends HisPayManager{
	
	/**
	 * 开通预存（PRESTORE0001）
	 * @param patient
	 * @return
	 */
	HisEntityResponse<Patient> openDeposit(Patient patient);
	/**
	 * 预存账户微信支付宝卡充值(自动生成请求流水号)(PATIENT0061)
	 * @param order
	 * @return
	 */
	HisEntityResponse<DepositRecord> wxAlipayRecharge(Order order, Settlement settle);
	
	/**
	 * 预存账户现金充值（PRESTORE0002）
	 * @param order
	 * @return
	 */
	HisEntityResponse<DepositRecord> cashRecharge(Order order, Settlement settle);
	
	/**
	 * 银行卡门诊预存充值（PRESTORE0004）
	 * @param order
	 * @return
	 */
	HisEntityResponse<DepositRecord> cardRecharge(Order order, Settlement settle);
	/**
	 * 2.8.2充值/退款记录查询(PATIENT0082)
	 * @param patient
	 * @return
	 */
	HisListResponse<DepositRecord> rechargeRecords(Patient param);
	/**
	 * 2.9就诊卡消费记录查询(PATIENT009)
	 * @param patient
	 * @return
	 */
	HisListResponse<ConsumeRecord> consumeRecords(Patient param);
	/**
	 * 【充值查询】充值明细查询（PRESTORE0011）
	 * @param patient
	 * @return
	 */
	HisListResponse<PayAccount> rechargeAccounts(Patient param);
	
	/**
	 * 【充值查询】50天内信用卡充值金额（PRESTORE0013）
	 * @param patient
	 * @return
	 */
	HisEntityResponse<BigDecimal> rechargeCreditIn50(Patient param);
	/**
	 * 【充值查询】充值明细查询（PRESTORE0011）
	 * @param patient
	 * @return
	 */
	HisListResponse<HisOrder> rechargeDetails(HisOrder param);
	
	/**
	 * 预存状态查询，是否允许预存/退款（PRESTORE0009）
	 * @return
	 */
	HisResponse depositState();
	/**
	 * 预存账户银行退还金额冻结（PRESTORE0005）
	 * @param order
	 * @return
	 */
	HisEntityResponse<HisOrder> freezeRefund(Order order, Settlement settle);
	
	/**
	 * 预存账户银行退还确认交易（PRESTORE0006）
	 * @param order
	 * @return
	 */
	HisEntityResponse<HisOrder> confirmRefund(Order order, Settlement settle);
	
	/**
	 * 预存账户银行退还金额解冻（PRESTORE0007）
	 * @param order
	 * @return
	 */
	HisEntityResponse<HisOrder> unfreezeRefund(Order order, Settlement settle);
	
	/**
	 * 预存账户银行退还金额确认取消（PRESTORE00014）
	 * @param order
	 * @return
	 */
	HisEntityResponse<HisOrder> cancelRefund(Order order, Settlement settle);
	/**
	 * 缴费明细查询
	 * @param baseInfo
	 * @return
	 */
	HisListResponse<PayHistory> payHistoryRecords(Patient baseInfo);
	/**
	 * 门诊收费清单查询（FEE00001）
	 * @param FeeHistory
	 * @return
	 */
	HisListResponse<FeeHistory> feeHistoryRecords(FeeHistory param);
//	/**
//	 * 住院收费清单查询（FEE00001）
//	 * @param FeeitemHistory
//	 * @return
//	 */
//	HisListResponse<FeeitemHistory> feeitemHistoryRecords(FeeitemHistory param);
//	
}
