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
		List<InnerData> newInnerDatas = new ArrayList<>();
		for (MedicalOrder m : orders) {
			if (MedicalOrder.DRUG_FLAG_NON_DRUG.equals(m.getDrugFlag())) continue;
			InnerData innerData = new InnerData();
			if(m.getComboNo()!=null){
				innerData.setT10(m.getComboNo().toString());
			}else{
				innerData.setT10("");
			}
			totalAmt = totalAmt.add(m.getSalePrice().multiply(m.getPackQty()));
			
			innerData.setT1(m.getItemName() + "(" + m.getSpecs() + ")");
			innerData.setT2(StringUtils.isBlank(m.getPackQty()) ? " " : m.getPackQty().toString());
			innerData.setT3(m.getPackUnit());
			innerData.setT4(StringUtils.isBlank(m.getDoseOnce())? "":m.getDoseOnce() + m.getDoseUnit() + "/次");
			innerData.setT5(StringUtils.isBlank(m.getFreq()) ? "":m.getFreq());
			innerData.setT6(getDictName("USAGE", m.getUsage(),user.getHosId()));
			innerData.setT7((StringUtils.isBlank(m.getDays()) ? "" : m.getDays().toString()) + "天");
			innerData.setT8(formatBigDecimal(m.getSalePrice().multiply(m.getPackQty())));
			innerData.setT11(" ");
			innerData.setT15(m.getId());
			if(m.getComboNo()==null){
				innerData.setT9("");
			}
			else{
				innerData.setT9(m.getComboNo()+"");
			}
			innerDatas.add(innerData);
		}
		Map<String, List<InnerData>> map = new HashMap<>();
		Integer comNo=0;
		Map<String, List<InnerData>> mapRecipe = new HashMap<>();
		for(InnerData d:innerDatas){
			String t10 = d.getT10();
			if(StringUtils.isEmpty(t10)){
				t10 = "empty";
				comNo++;
			}
			List<InnerData> dList = mapRecipe.get(t10);
			if(dList !=null && dList.size()>0){
				InnerData t = dList.get(0);
				if("empty".equals(t10)){
					d.setT11(comNo.toString());
				}
				dList.add(d);
			} else {
				if(!"empty".equals(t10)){
					comNo++;
				}
				List<InnerData> list = new ArrayList<>();
				d.setT11(comNo.toString());
				list.add(d);
				mapRecipe.put(t10, list);
			}
		}
		
		Integer num = 0;
		for (List<InnerData> list : mapRecipe.values()) {
			int i = 0;
			for(InnerData d:list){
				if(StringUtils.isNotBlank(d.getT11())){
					num++;
					d.setT11(num.toString());
				}
				newInnerDatas.add(d);
			}
		}
		map.put("0", newInnerDatas);
		PrintData data = new PrintData();
		buildBasePrintData(info, hospital, diagnose, orders, formatBigDecimal(totalAmt), data,user);
		data.setMap(map);
		return data;
	}

	private void buildBasePrintData(RegInfo info, Hospital hospital, Diagnose diagnose, List<MedicalOrder> orders,
			String totalAmt, PrintData data,HcpUser user) {
		data.setT1(hospital.getHosName());
		data.setT2(info.getRegId());
		data.setT3(orders.get(0).getRecipeId());
		data.setT4(DateUtils.date2String(orders.get(0).getRecipeTime(), "yyyy-MM-dd HH:mm:ss"));
		data.setT5(info.getPatient().getName());
		data.setT6(getDictName("SEX", info.getPatient().getSex(),user.getHosId()));
		data.setT7(getDictName("FEE_TYPE", info.getFeeType(),user.getHosId()));
		data.setT8(info.getRegDept().getDeptName());
		if(info.getPatient().getBirthday()==null){
			data.setT9("未知");
		}
		else{
			data.setT9(String.valueOf(DateUtils.getDiffYears(info.getPatient().getBirthday(), new Date(), false)));// 年龄
		}
		data.setT10(info.getRegId());
		String address = StringUtils.isNotBlank(info.getPatient().getIdAddress()) ? info.getPatient().getIdAddress()
				: "";
		String phone = StringUtils.isNotBlank(info.getPatient().getMobile()) ? info.getPatient().getMobile() : "";
		//data.setT11(address + " " + phone);
		data.setT12(diagnose.getDiseaseName());
		data.setT13(diagnose.getDiseaseDoc().getName());
		data.setT14("");// 审核
		data.setT15(totalAmt);// 金额
		data.setT16("");// 调配
		data.setT17("");// 核对
		data.setT18("");// 发药
	}

}
