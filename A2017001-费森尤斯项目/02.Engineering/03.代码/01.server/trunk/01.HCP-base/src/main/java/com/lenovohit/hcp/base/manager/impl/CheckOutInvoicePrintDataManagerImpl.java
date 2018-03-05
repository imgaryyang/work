package com.lenovohit.hcp.base.manager.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.hcp.base.dto.InnerData;
import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.finance.model.InvoiceInfo;
import com.lenovohit.hcp.finance.model.OperBalance;

//结账单发票明细打印
@Service("checkOutInvoicePrintDataManager")
public class CheckOutInvoicePrintDataManagerImpl extends AbstractPrintDataManagerImpl {
	@Autowired
	private GenericManager<OperBalance, String> operBalanceManager;
	@Autowired
	private GenericManager<InvoiceInfo, String> invoiceInfoManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		OperBalance balance = operBalanceManager.get(bizId);
		if (balance == null)
			throw new RuntimeException("没有对应的结账信息");
		PrintData data = new PrintData();
		data.setT1(DateUtils.date2String(balance.getStartTime(), "yyyy-MM-dd HH:mm:ss"));
		data.setT2(DateUtils.date2String(balance.getEndTime(), "yyyy-MM-dd HH:mm:ss"));
		data.setT3(DateUtils.getCurrentDateStr("yyyy-MM-dd HH:mm:ss"));
		data.setT4(balance.getCreateOper());
		List<InvoiceInfo> infos = invoiceInfoManager.findByProp("balanceId", balance.getId());
		List<InnerData> innerDatas = new ArrayList<>();
		for (InvoiceInfo info : infos) {
			InnerData innerData = new InnerData();
			innerData.setT1(info.getInvoiceNo());
			innerData.setT2(info.getPatientInfo().getPatientId());
			innerData.setT3(info.getPatientInfo().getName());
			innerData.setT4(getDictName("FEE_TYPE", info.getFeeType(),user.getHosId()));
			innerData.setT5(formatBigDecimal(info.getTotCost()));
			innerData.setT6(formatBigDecimal(info.getTotCost()));
			innerData.setT7(getChargeInfo(info.getPlusMinus().toString()));
			innerData.setT8(
					InvoiceInfo.PLUSMINUS_MINUS.equals(info.getPlusMinus().toString()) ? info.getInvoiceNo() : "");
			innerData.setT9(DateUtils.date2String(info.getInvoiceTime(), "yyyy-MM-dd HH:mm:ss"));
			innerData.setT10(info.getInvoiceOperName());
			innerDatas.add(innerData);
		}
		Map<String, List<InnerData>> result = new HashMap<>();
		result.put("0", innerDatas);
		data.setMap(result);
		return data;
	}

	private String getChargeInfo(String type) {
		if (InvoiceInfo.PLUSMINUS_PLUS.equals(type))
			return "正常缴费";
		else
			return "正常退费";
	}
}
