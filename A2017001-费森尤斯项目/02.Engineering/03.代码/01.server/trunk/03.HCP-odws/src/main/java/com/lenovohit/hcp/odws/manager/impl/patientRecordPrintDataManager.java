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
		String sql=" from Diagnose where regId = ?  ";
		
		List<Object> values=new ArrayList<Object>();
		values.add(info.getId());
		List<Diagnose> diagnoses=diagnoseManager.find(sql, values.toArray());
	
		List<InquiryRecord> recordList= inquiryRecordManager.findByProp("regId", info.getId());
			if (recordList == null || recordList.size()<1)
				throw new RuntimeException("本次就诊的病历信息尚未保存！");
			
			InquiryRecord record = recordList.get(0);
			List<InnerData> innerDatas = new ArrayList<>();
			for (Diagnose m : diagnoses) {
				InnerData innerData = new InnerData();
				innerData.setT1(m.getDiseaseName());
				innerDatas.add(innerData);
			}
			Map<String, List<InnerData>> map = new HashMap<>();
			map.put("0", innerDatas);
			
			 data = buildPrintDataFromRegInfo(record,info);
			 data.setMap(map);
			 return data;
	}

	private PrintData buildPrintDataFromRegInfo(InquiryRecord record,RegInfo info ) {
		PrintData data = new PrintData();
		data.setT1(info.getPatient().getName());
		data.setT2(info.getPatient().getSex().equals("2")? "女" :"男");
		Calendar c1 = Calendar.getInstance();
		Calendar c2 = Calendar.getInstance();
		c1.setTime(new Date());
		if(info.getPatient().getBirthday()==null){
			c2.setTime(new Date());
			data.setT3("未知");
		}
		else{
			c2.setTime(info.getPatient().getBirthday());
			int age=c1.get(Calendar.YEAR)-c2.get(Calendar.YEAR);
			data.setT3(age+"岁");
		}
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");  
		data.setT4(sdf.format(info.getRegTime()));
		data.setT5(info.getRegDept().getDeptName());
		data.setT7(record.getChiefComplaint()!=null ? record.getChiefComplaint() : "");
		data.setT8(record.getPresentIllness()!=null ? record.getPresentIllness() : "");
		data.setT10(record.getPastHistory()!=null ? record.getPastHistory() : "");//既往病史
		data.setT11(record.getPhysicalExam()!=null ? record.getPhysicalExam() : "");//体格检查
		data.setT12(record.getOtherExam()!=null ? record.getOtherExam() : ""); //辅助检查
		data.setT13((record.getWeight()!=null ? record.getWeight() : "")+"kg"); //体重
		data.setT14((record.getHeight()!=null ? record.getHeight() : "")+"cm"); //身高
		data.setT15((record.getBloodPressureprMin()!=null ? record.getBloodPressureprMin() : "")+"/"+(record.getBloodPressureprMax()!=null ? record.getBloodPressureprMax():"")+"mmHg"); //血压
		data.setT17(record.getTemperature()!=null ? record.getTemperature()+"℃" : ""); //体温
		data.setT18(record.getPulseRate()!=null ? record.getPulseRate()+"bpm" : ""); //心率
		data.setT19(record.getBreath()!=null ? record.getBreath()+"次/分" : ""); //呼吸
		data.setT20(record.getMoOrder()!=null ? record.getMoOrder() : ""); //注意事项
		
		return data;
	}

}
