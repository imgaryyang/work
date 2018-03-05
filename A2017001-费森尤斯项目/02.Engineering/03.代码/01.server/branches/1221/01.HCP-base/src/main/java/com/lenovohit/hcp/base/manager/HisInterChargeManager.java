package com.lenovohit.hcp.base.manager;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.HisOrder;
import com.lenovohit.hcp.payment.model.HcpOrder;
import com.lenovohit.hcp.payment.model.HisPayResult;

/**
 * his内部平台统一处理收费接口，包括收银台交互（收款、退款等）、返回数据通用部分处理等
 * @description
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月20日
 */
public interface HisInterChargeManager {

	public static final String CHARGE_TYPE_REGIST = "1";// 挂号收费
	public static final String CHARGE_TYPE_CLINIC = "2";// 门诊收费

	/**
	 * 调用收银台支付功能
	 * @param operator 当前操作员姓名
	 * @param amt
	 * @param detailIds 收费明细ids（id推荐uuid，但是也可以是挂号id，处方id，只要对应的处理manager处理合适即可）
	 * @param type 发票类型(挂号、门诊等，具体参考数据字典)
	 * @param hosId 医院id
	 * @param bizBeanName 业务回调manager
	 */
	HisOrder handleChargeToPay(String operator, BigDecimal amt, List<String> detailIds, String type, String hosId,
			String bizBeanName);

	/**
	 * 生成his平台订单
	 * @param operator
	 * @param amt
	 * @param detailIds
	 * @param type
	 * @param bizBeanName
	 * @param orderNo
	 * @return
	 */
	HisOrder createAndSaveHisOrder(String operator, BigDecimal amt, List<String> detailIds, String type,
			String bizBeanName, String orderNo);

	/**
	 * 处理收银台支付返回返回
	 * @param operator
	 * @param amt
	 * @param orderId
	 * @param payWays
	 */
	void handleChargePayReturn(Boolean success, String operator, BigDecimal amt, String orderNo,
			Map<String, BigDecimal> payWays);

	/**
	 * 处理收银台返回
	 * @param result
	 */
	void handleChargeReturn(HisPayResult result);
}
