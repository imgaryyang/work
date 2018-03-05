package com.lenovohit.hcp.base.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.dto.InnerData;
import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.manager.PrintDataManager;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.ItemInfo;
import com.lenovohit.hcp.finance.model.InvoiceInfo;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;

//门诊发票明细打印数据
@Service("clinicChargeDetailsPrintDataManager")
public class ClinicChargeDetailsPrintDataManagerImpl extends AbstractPrintDataManagerImpl {
	@Autowired
	protected GenericManager<RegInfo, String> regInfoManager;
	@Autowired
	protected GenericManager<InvoiceInfo, String> invoiceInfoManager;
	@Autowired
	protected GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	@Autowired
	private GenericManager<ItemInfo, String> itemInfoManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		String [] bizList = bizId.split("&&&");
		String regId = bizList[0];
		String invoiceNo = bizList[1];
		RegInfo regInfo = regInfoManager.get(regId);
		if (regInfo == null)
			throw new RuntimeException("不存在挂号记录信息");
		String hql = "from InvoiceInfo where invoiceSource = '2' and regId = ? and invoiceNo = ?  and plusMinus = ? ";// 传的bizid为挂号id（32位）
		List<InvoiceInfo> invoiceInfos = invoiceInfoManager.find(hql, regId,invoiceNo, 1);
		if (invoiceInfos.size() < 1)
			throw new RuntimeException("没有对应的门诊发票信息");
		List<OutpatientChargeDetail> resultDetails = new ArrayList<>();
		for (InvoiceInfo info : invoiceInfos) {
			String sql = "from OutpatientChargeDetail where invoiceNo = ? and plusMinus = ? ";
			List<OutpatientChargeDetail> details = outpatientChargeDetailManager.find(sql, info.getInvoiceNo(),
					new BigDecimal("1"));
			resultDetails.addAll(details);
		}
		List<InnerData> innerDatas = new ArrayList<>();
		for (OutpatientChargeDetail o : resultDetails) {
			InnerData innerData = new InnerData();
			innerData.setT1(getDictName("DRUG_TYPE", o.getDrugFlag()));
			innerData.setT2(o.getItemName());
			ItemInfo info = itemInfoManager.get(o.getItemCode());
			innerData.setT3(info == null ? o.getItemCode() : info.getItemCode());
			innerData.setT4(o.getSpecs());
			innerData.setT5(o.getUnit());
			innerData.setT6(o.getQty() == null ? "" : o.getQty().toString());
			innerData.setT7(o.getSalePrice() == null ? "" : o.getSalePrice().toString());
			innerData.setT8(formatBigDecimal(o.getTotCost()));
			innerData.setT9(formatBigDecimal(o.getTotCost()));
			innerData.setT10(o.getExeDept() == null ? "" : o.getExeDept().getDeptName());
			innerDatas.add(innerData);
		}
		Map<String, List<InnerData>> map = new HashMap<>();
		map.put("0", innerDatas);
		PrintData data = new PrintData();
		data.setT1(regInfo.getPatient().getName());
		data.setT2(getDictName("FEE_TYPE", regInfo.getFeeType()));
		data.setT3(regInfo.getRegId());
		data.setT4(user.getName());
		data.setT5(DateUtils.date2String(invoiceInfos.get(0).getInvoiceTime(), "yyyy-MM-dd HH:mm:ss"));
		data.setMap(map);
		return data;
	}

}
