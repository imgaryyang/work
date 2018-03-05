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
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.dto.InnerData;
import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.ItemInfo;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.odws.model.Diagnose;

//治疗单打印数据
@Service("treatRecordPrintDataManager")
public class TreatRecordPrintDataManagerImpl extends AbstractPrintDataManagerImpl {
	@Autowired
	protected GenericManager<RegInfo, String> regInfoManager;
	@Autowired
	private GenericManager<Diagnose, String> diagnoseManager;
	@Autowired
	protected GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	@Autowired
	private GenericManager<ItemInfo, String> itemInfoManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		RegInfo info = regInfoManager.get(bizId);
		if (info == null)
			throw new RuntimeException("没有对应的挂号记录信息");
		Diagnose diagnose = diagnoseManager.findOneByProp("regId", bizId);
		if (diagnose == null)
			throw new RuntimeException("没有对应的诊断信息");
		PrintData data = buildBasePrintData(info, diagnose);
		Map<String, List<InnerData>> resultMap = buildInnerDatas(bizId);
		data.setMap(resultMap);
		return data;
	}

	private Map<String, List<InnerData>> buildInnerDatas(String bizId) {
		List<OutpatientChargeDetail> details = outpatientChargeDetailManager.findByProp("regId", bizId);
		List<InnerData> innerDatas = new ArrayList<>();
		for (OutpatientChargeDetail detail : details) {
			ItemInfo itemInfo = itemInfoManager.get(detail.getItemCode());
			if (itemInfo != null && itemInfo.isExec()) {
				InnerData innerData = new InnerData();
				innerData.setT1(detail.getItemName());
				innerData.setT2(detail.getQty() == null ? "" : detail.getQty().toString());
				innerData.setT3(detail.getUnit());
				innerData.setT4(detail.getSalePrice().toString());
				innerData.setT5(formatBigDecimal(detail.getQty().multiply(detail.getSalePrice())));
				innerDatas.add(innerData);
			}
		}
		Map<String, List<InnerData>> resultMap = new HashMap<>();
		resultMap.put("0", innerDatas);
		return resultMap;
	}

	private PrintData buildBasePrintData(RegInfo info, Diagnose diagnose) {
		PrintData data = new PrintData();
		data.setT1(info.getPatient().getName());
		data.setT2(getDictName("SEX", info.getPatient().getSex()));
		data.setT3(getDictName("FEE_TYPE", info.getFeeType()));
		data.setT4(info.getRegDept().getDeptName());
		data.setT5(String.valueOf(DateUtils.getDiffYears(info.getPatient().getBirthday(), new Date(), false)));// 年龄
		data.setT6(info.getRegId());
		String address = StringUtils.isNotBlank(info.getPatient().getIdAddress()) ? info.getPatient().getIdAddress()
				: "";
		String phone = StringUtils.isNotBlank(info.getPatient().getMobile()) ? info.getPatient().getMobile() : "";
		data.setT7(address + " " + phone);
		data.setT8(diagnose.getDiseaseName());
		data.setT8("测试病种");
		return data;
	}

}
