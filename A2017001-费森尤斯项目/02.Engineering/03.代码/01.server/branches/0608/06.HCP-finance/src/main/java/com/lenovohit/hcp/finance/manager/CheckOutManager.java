package com.lenovohit.hcp.finance.manager;

import com.lenovohit.hcp.finance.model.CheckOutDto;
import com.lenovohit.hcp.finance.model.OperBalance;

/**
 * 
 * @description 结账统一接口
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月17日
 */
public interface CheckOutManager {

	/**
	 * 获取结账信息
	 * 	1发票来源invoicesource、invoice_oper当前操作工号、invoicetime在结账区间。
	 * 		结账时间取oper_balance的balance——time最大时间，发票人员为invoice_oper
	 *  2费用分类，发票号关联查询oc_invoiceinfo_detail 费用分类fee_code汇总费用
	 *  3支付方式，发票号关联oc_payway按支付方式汇总支付金额、退费金额。
	 */
	CheckOutDto getCheckOutMsg(String hosId, String invoiceSource, String invoiceOper);

	/**
	 * 获取已经结账的信息，最近一笔结账的信息
	 * 	tip：取oper_balance中未审结的记录（ischeck不为2）。取消结账是查出一笔已结账再取消
	 * @return
	 */
	CheckOutDto getCheckedMsg(String hosId, String invoiceSource, String invoiceOper);

	/**
	 * 结账
	 * 	界面信息归纳写入收费员结账信息
	 */
	OperBalance checkOut(String hosId, CheckOutDto dto);

	/**
	 * 取消结账
	 * 	结账id直接删除状态为0未审、1打回的数据  2不允许取消结账
	 */
	void cancelCheckOut(String balanceId);
}
