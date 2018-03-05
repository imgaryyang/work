package com.lenovohit.hcp.appointment.manager;

import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.HisOrder;
import com.lenovohit.hcp.payment.model.HcpOrder;

/**
 * 
 * @description 挂号接口操作类，挂号的业务操作接口
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月13日
 */
public interface RegisterManager {

	/**
	 * 挂号操作
	 * 	1生成流水号、发票号（fm_invoice_manage）21状态，记录reg_info表
	 * 	2记录收费明细表（oc_chargedetail）
	 * 	3发票信息表(oc_invoiceinfo)
	 * 	4发票分类表(oc_invoiceinfo_detail)
	 *  5门诊支付方式表（oc_payway）插入以便后续调用收银台
	 * @param info
	 */
	@Deprecated
	RegInfo register(RegInfo info);

	/**
	 * 新的挂号流程，先调用收银台
	 * 1生成流水号、21状态，记录reg_info表
	 * 2记录收费明细表（oc_chargedetail）
	 * 问题：返回hcporder，供收银台使用，后续独立应该没有任何返回或者返回true false。涉及收银台相关全都不应该在his出现
	 * @param info
	 * @return
	 */
	HisOrder registerToPay(RegInfo info);

	/**
	 * 退号操作 TODO 退号主体逻辑如果后台退费，也应该写在回调里，不应该写在这里
	 * 前置：已挂号并且未就诊
	 * 	1生成一条负的invoiceinfo信息。
	 *  2更新reg_info（原）reg_state为12,记录canceloper caceltime
	 *  3更新oc_chargedetail为apply-state4、cancel1 canceloper canceltime
	 *  4oc——invoiceinfo cancle cancel信息
	 *  5oc-invoice-detail cancel相关
	 *  6oc-payway cancel相关
	 * @param regId
	 */
	void cancel(RegInfo info,HcpUser user);

}
