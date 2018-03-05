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
import com.lenovohit.hcp.card.model.Patient;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.odws.model.Diagnose;
import com.lenovohit.hcp.odws.model.InquiryRecord;
import com.lenovohit.hcp.odws.model.MedicalOrder;
import com.lenovohit.hcp.onws.moddel.PhaLisResult;

/**
 * 
 * @description
 * @author redstar
 * @version 1.0.0
 * @date 2017年9月16日
 */
// 送检报告单打印数据
@Service("sendcheckLisPrintDataManager")
public class sendcheckLisPrintDataManager extends AbstractPrintDataManagerImpl {

	@Autowired
	private PatLisManagerImp patLisManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		
		PrintData data=null; 
		 Map<String, Object> maps=patLisManager.findLisResult(bizId);
		 
			List<InnerData> innerDatas = new ArrayList<>();
			List<PhaLisResult>  resultList=(List<PhaLisResult>) maps.get("RList");
			Map<String,Object> patient=(Map<String, Object>) maps.get("patient");
			for (PhaLisResult p : resultList) {
		
				InnerData innerData = new InnerData();
				innerData.setT1(p.getSinonym()); //检查项
				innerData.setT2(p.getValue());   //测定结果
				innerData.setT3(p.getUnit());    //检测单位
				innerData.setT4(p.getDisplowhigh()); //参考范围
				innerDatas.add(innerData);
			}
			Map<String, List<InnerData>> map = new HashMap<>();
			map.put("0", innerDatas);
			
			 data = buildPrintDataFromRegInfo(patient);
			 data.setMap(map);
			 return data;
	}

	private PrintData buildPrintDataFromRegInfo( Map<String, Object> patient) {
		PrintData data = new PrintData();
		data.setT1(patient.get("name").toString());
		data.setT2(patient.get("sex").toString().equals("2")? "女" :"男");
		
		data.setT3(patient.get("type").toString());
		data.setT4(patient.get("regNo").toString());
		
		data.setT5(patient.get("exambarcode").toString());
		
		return data;
	}

}
