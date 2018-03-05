package com.lenovohit.hcp.base.manager;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.lenovohit.hcp.base.model.HcpUser;

/**
 * 收银台返回经过公共处理后需要特殊处理的业务接口
 * 	比如：挂号收费成功需要处理挂号相关、门诊收费需要处理门诊收费
 * @description
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月21日
 */
public interface HisBizChargeManager {

	/**
	 * 调用收银台支付成功后执行的业务逻辑
	 * @param operator
	 * @param amt
	 * @param orderId
	 * @param chargeDetailIds
	 * @param payWays
	 */
	void bizAfterPaySuccess(String operator, BigDecimal amt, String orderId, List<String> chargeDetailIds,
			Map<String, BigDecimal> payWays);

	/**
	 * 调用收银台支付失败后执行的业务逻辑
	 * @param operator
	 * @param amt
	 * @param orderId
	 * @param chargeDetailIds
	 * @param payWays
	 */
	void bizAfterPayFailed(String operator, BigDecimal amt, String orderId, List<String> chargeDetailIds);

	/**
	 * 退款后的业务逻辑 TODO 暂时舍弃，使用下面的接口方法，待调用收银台再考虑
	 * @param chargeDetailIds
	 */
	// void bizAfterRefundSuccess(List<String> chargeDetailIds);

	/**
	 * 退款后的业务逻辑 TODO 2017年4月27日11:10:16，暂时不考虑调用收银台逻辑，只考虑内部逻辑，参数为hosId和invoiceNo 
	 * @param hosId
	 * @param invoiceNo
	 */
	void bizAfterRefundSuccess(String hosId, String invoiceNo,HcpUser user);
	// TODO 退款失败？
}
