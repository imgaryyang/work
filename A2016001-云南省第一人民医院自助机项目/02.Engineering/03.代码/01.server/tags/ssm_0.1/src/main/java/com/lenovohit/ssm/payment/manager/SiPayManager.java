package com.lenovohit.ssm.payment.manager;

import java.util.List;

import com.lenovohit.ssm.payment.model.Fee;
import com.lenovohit.ssm.payment.model.HisOrder;
import com.lenovohit.ssm.payment.model.Settlement;

public interface SiPayManager {
	/**
	 * 提交缴费明细，返回医院订单信息
	 */
	public HisOrder forPay(List<Fee> fees);
	/**
	 * 获取预结算上传报文
	 */
	public String getSiUpload(String hispitalNo);
	/**
	 * 通知his医保结算结果
	 */
	public void miPay(String miResponse);
	/**
	 * 通知his自费缴费结果
	 */
	public void ownPay(Settlement ownSettle);
	/**
	 * 通知his缴费完成
	 */
	
}
