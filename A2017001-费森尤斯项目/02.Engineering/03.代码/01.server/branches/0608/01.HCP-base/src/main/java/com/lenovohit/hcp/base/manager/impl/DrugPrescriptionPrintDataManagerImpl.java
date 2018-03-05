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
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.odws.model.Diagnose;
import com.lenovohit.hcp.odws.model.MedicalOrder;

//药品处方单打印数据 TODO 暂时只有来自医嘱，没有划价
@Service("drugPrescriptionPrintDataManager")
public class DrugPrescriptionPrintDataManagerImpl extends AbstractPrintDataManagerImpl {
	@Autowired
	protected GenericManager<RegInfo, String> regInfoManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	@Autowired
	private GenericManager<Diagnose, String> diagnoseManager;
	@Autowired
	private GenericManager<MedicalOrder, String> medicalOrderManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		RegInfo info = regInfoManager.get(bizId);
		if (info == null)
			throw new RuntimeException("没有对应的挂号记录信息");
		String hosId = user.getHosId();
		Hospital hospital = hospitalManager.findOneByProp("hosId", hosId);
		if (hospital == null)
			throw new RuntimeException("没有对应的医院信息，请检查");
		Diagnose diagnose = diagnoseManager.findOneByProp("regId", bizId);
		if (diagnose == null)
			throw new RuntimeException("没有对应的诊断信息");
		List<MedicalOrder> orders = medicalOrderManager.findByProp("regId", bizId);
		if (orders.size() < 1)
			throw new RuntimeException("没有对应的医嘱信息");
		BigDecimal totalAmt = new BigDecimal("0");
		List<InnerData> innerDatas = new ArrayList<>();
		for (MedicalOrder m : orders) {
			totalAmt = totalAmt.add(m.getSalePrice());
			InnerData innerData = new InnerData();
			innerData.setT1(m.getItemName() + "(" + m.getSpecs() + ")");
			innerData.setT2(StringUtils.isBlank(m.getQty()) ? "" : m.getQty().toString());
			innerData.setT3(m.getUnit());
			innerData.setT4(m.getDoseOnce() + m.getDoseUnit() + "/次");
			innerData.setT5(m.getFreq());
			innerData.setT6(getDictName("USAGE", m.getUsage()));
			innerData.setT7((StringUtils.isBlank(m.getDays()) ? "" : m.getDays().toString()) + "天");
			innerData.setT8(formatBigDecimal(m.getSalePrice().multiply(m.getQty())));
			innerDatas.add(innerData);
		}
		Map<String, List<InnerData>> map = new HashMap<>();
		map.put("0", innerDatas);
		PrintData data = new PrintData();
		buildBasePrintData(info, hospital, diagnose, orders, formatBigDecimal(totalAmt), data);
		data.setMap(map);
		return data;
	}

	private void buildBasePrintData(RegInfo info, Hospital hospital, Diagnose diagnose, List<MedicalOrder> orders,
			String totalAmt, PrintData data) {
		data.setT1(hospital.getHosName());
		data.setT2(info.getRegId());
		data.setT3(orders.get(0).getRecipeId());
		data.setT4(DateUtils.date2String(orders.get(0).getRecipeTime(), "yyyy-MM-dd HH:mm:ss"));
		data.setT5(info.getPatient().getName());
		data.setT6(getDictName("SEX", info.getPatient().getSex()));
		data.setT7(getDictName("FEE_TYPE", info.getFeeType()));
		data.setT8(info.getRegDept().getDeptName());
		data.setT9(String.valueOf(DateUtils.getDiffYears(info.getPatient().getBirthday(), new Date(), false)));// 年龄
		data.setT10(info.getRegId());
		String address = StringUtils.isNotBlank(info.getPatient().getIdAddress()) ? info.getPatient().getIdAddress()
				: "";
		String phone = StringUtils.isNotBlank(info.getPatient().getMobile()) ? info.getPatient().getMobile() : "";
		data.setT11(address + " " + phone);
		data.setT12(diagnose.getDiseaseName());
		data.setT13(diagnose.getDiseaseDoc().getName());
		data.setT14("");// 审核
		data.setT15(totalAmt);// 金额
		data.setT16("");// 调配
		data.setT17("");// 核对
		data.setT18("");// 发药
	}

}
