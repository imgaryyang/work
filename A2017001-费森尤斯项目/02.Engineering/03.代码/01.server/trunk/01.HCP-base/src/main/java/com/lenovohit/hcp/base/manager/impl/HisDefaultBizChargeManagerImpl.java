package com.lenovohit.hcp.base.manager.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.finance.model.InvoiceInfo;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;

@Service("hisDefaultBizChargeManager")
public class HisDefaultBizChargeManagerImpl extends AbstractHisBizChargeManagerImpl {

	@Override
	protected void refundUpdateOtherInfos(InvoiceInfo info) {
		// TODO Auto-generated method stub

	}

	@Override
	protected void doBizAfterPayFailed(String operator, BigDecimal amt, String orderId, List<String> chargeDetailIds) {
		// TODO Auto-generated method stub

	}

	@Override
	protected void updatePaySuccessOtherInfo(HcpUser operator, BigDecimal amt, String orderId, String invoiceNo,
			RegInfo regInfo, List<OutpatientChargeDetail> details) {
		// TODO Auto-generated method stub

	}

	@Override
	protected String getInvoiceSource() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected String getInvoiceType() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected List<OutpatientChargeDetail> getChargeDetailInfo(List<String> chargeDetailIds) {
		// TODO Auto-generated method stub
		return null;
	}

}
