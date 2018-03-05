package com.lenovohit.hcp.odws.manager.impl;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.dto.InnerData;
import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.manager.impl.AbstractPrintDataManagerImpl;
import com.lenovohit.hcp.base.model.Dictionary;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.HisOrder;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.odws.model.Diagnose;
import com.lenovohit.hcp.odws.model.InquiryRecord;
import com.lenovohit.hcp.odws.model.MedicalOrder;

/**
 * 
 * @description
 * @author redstar
 * @version 1.0.0
 * @date 2017年9月16日
 */
// 门诊病历单打印数据
@Service("patientRecordPrintDataManager")
public class patientRecordPrintDataManager extends AbstractPrintDataManagerImpl {

	@Autowired
	private GenericManager<InquiryRecord, String> inquiryRecordManager;
	@Autowired
	protected GenericManager<RegInfo, String> regInfoManager;
	@Autowired
	protected GenericManager<MedicalOrder, String> medicalOrderManager;
	@Autowired
	private GenericManager<Diagnose, String> diagnoseManager;


	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		
		PrintData data=null; 
		String regId;
		RegInfo info=(RegInfo) regInfoManager.findByProp("regId", bizId).get(0);
		//医嘱
		List<MedicalOrder> orders= medicalOrderManager.findByProp("regId", info.getId());
		//诊断
		String sql=" from Diagnose where regId = ? and iscurrent = 1 ";
		
		List<Object> values=new ArrayList<Object>();
		values.add(info.getId());
		List<Diagnose> diagnoses=diagnoseManager.find(sql, values.toArray());
		Diagnose diagnose=diagnoses.get(0);
	
		InquiryRecord record=(InquiryRecord) inquiryRecordManager.findByProp("regId", info.getId()).get(0);
			if (record == null)
				throw new RuntimeException("不存在该笔id对应的挂号信息");
			
			List<InnerData> innerDatas = new ArrayList<>();
			for (MedicalOrder m : orders) {
				InnerData innerData = new InnerData();
				innerData.setT1(m.getItemName());
				innerData.setT2(m.getSpecs()+"x"+m.getQty()+m.getUnit());
				if(m.getDrugFlag().equals(MedicalOrder.DRUG_FLAG_NON_DRUG)){
					innerData.setT3("检查");
				}
				else{
					innerData.setT3(getDictName("USAGE", m.getUsage(),user.getHosId()));
				}
				innerData.setT4(m.getFreqDesc());
				innerDatas.add(innerData);
			}
			Map<String, List<InnerData>> map = new HashMap<>();
			map.put("0", innerDatas);
			
			 data = buildPrintDataFromRegInfo(record,info,diagnose,orders);
			 data.setMap(map);
			 return data;
	}

	private PrintData buildPrintDataFromRegInfo(InquiryRecord record,RegInfo info,Diagnose diagnose,List<MedicalOrder> orders ) {
		PrintData data = new PrintData();
		data.setT1(info.getPatient().getName());
		data.setT2(info.getPatient().getSex().equals("2")? "女" :"男");
		Calendar c1 = Calendar.getInstance();
		Calendar c2 = Calendar.getInstance();
		c1.setTime(new Date());
		if(info.getPatient().getBirthday()==null){
			c2.setTime(new Date());
		}
		else{
			c2.setTime(info.getPatient().getBirthday());
		}
		
		int age=c1.get(Calendar.YEAR)-c2.get(Calendar.YEAR);
		data.setT3(age+"岁");
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");  
		data.setT4(sdf.format(info.getRegTime()));
		// data.setT6(StringUtils.isBlank(info.getRegTime()) ? "" : info.getRegTime().toString().substring(0, 10));
		data.setT5(info.getRegDept().getDeptName());
		data.setT7(record.getChiefComplaint());
		data.setT8(record.getPresentIllness());
		data.setT9(diagnose.getDiseaseName());
		return data;
	}

}
