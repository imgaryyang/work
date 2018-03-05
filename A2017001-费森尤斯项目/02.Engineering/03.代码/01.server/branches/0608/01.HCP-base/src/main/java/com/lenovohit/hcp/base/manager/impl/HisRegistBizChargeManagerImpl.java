package com.lenovohit.hcp.base.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.finance.model.InvoiceInfo;
import com.lenovohit.hcp.finance.model.InvoiceManage;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;

@Service("hisRegistBizChargeManager")
public class HisRegistBizChargeManagerImpl extends AbstractHisBizChargeManagerImpl {

	@Override
	protected String getInvoiceSource() {
		return InvoiceInfo.INVOICE_SOURCE_REGIST;
	}

	@Override
	protected String getInvoiceType() {
		return InvoiceManage.INVOICE_TYPE_REGIST;
	}

	@Override
	protected List<OutpatientChargeDetail> getChargeDetailInfo(List<String> chargeDetailIds) {
		List<OutpatientChargeDetail> details = new ArrayList<>();
		for (String s : chargeDetailIds) {
			OutpatientChargeDetail detail = outpatientChargeDetailManager.get(s);
			if (detail != null)
				details.add(detail);
		}
		return details;
	}

	@Override
	protected void updatePaySuccessOtherInfo(HcpUser operator, BigDecimal amt, String orderId, String invoiceNo,
			RegInfo regInfo, List<OutpatientChargeDetail> details) {
		regInfo.setInvoiceNo(invoiceNo);
		regInfoManager.save(regInfo);
	}

	@Override
	protected void doBizAfterPayFailed(String operator, BigDecimal amt, String orderId, List<String> chargeDetailIds) {
		// 挂号付费失败，将此笔挂号记录,收费明细记录删除
		String regId = outpatientChargeDetailManager.get(chargeDetailIds.get(0)).getRegId();
		RegInfo regInfo = regInfoManager.get(regId);
		if (regInfo != null) {
			regInfoManager.delete(regInfo);
		}
		for (String s : chargeDetailIds)
			outpatientChargeDetailManager.delete(s);
	}

	@Override
	protected void refundUpdateOtherInfos(InvoiceInfo info) {
		String hql = "from RegInfo where hosId = ? and invoiceNo = ? ";
		RegInfo regInfo = regInfoManager.findOne(hql, info.getHosId(), info.getInvoiceNo());
		regInfo.setCancelFlag(CANCLELED);
		regInfo.setRegState(RegInfo.REG_CANCELED);
		regInfo.setCancelOper(info.getCancelOper());
		regInfo.setCancelTime(info.getCancelTime());
		regInfoManager.save(regInfo);
	}

}
