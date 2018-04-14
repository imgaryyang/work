package com.lenovohit.ssm.treat.manager.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.ssm.treat.dao.HisRestDao;
import com.lenovohit.ssm.treat.manager.HisGuideManager;
import com.lenovohit.ssm.treat.model.Clinical;
import com.lenovohit.ssm.treat.model.Guide;
import com.lenovohit.ssm.treat.transfer.dao.RestEntityResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestListResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestRequest;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;

public class HisGuideManagerImpl implements HisGuideManager{
	@Autowired
	private HisRestDao hisRestDao;
	
	
	@Override
	public HisListResponse<Clinical> getClinicals(Clinical param) {
		Map<String, Object> reqMap = new HashMap<String, Object>();
		// 入参字段映射
		reqMap.put("PatientNo", param.getPatientNo());
		reqMap.put("StartTime", param.getStartTime());
		reqMap.put("EndTime", param.getEndTime());
		
		RestListResponse response = hisRestDao.postForList("OUTP0000101", RestRequest.SEND_TYPE_LOCATION, reqMap);
		HisListResponse<Clinical> result = new HisListResponse<Clinical>(response);
		
		List<Map<String, Object>> resMaplist = response.getList();
		List<Clinical> resList = new ArrayList<Clinical>();
		Clinical clinical = null;
		if(response.isSuccess() && null != resMaplist){
			for(Map<String, Object> resMap : resMaplist){
				clinical = new Clinical();
				clinical.setClinicalId(object2String(resMap.get("CLINICALID")));//诊疗活动ID	
				clinical.setSpecID(object2String(resMap.get("SPECID")));//接诊专科
				clinical.setRecordID(object2String(resMap.get("RECORDID")));//病情记录ID	
				clinical.setSpecName(object2String(resMap.get("SPECNAME")));//接诊专科名称	
				clinical.setDoctorID(object2String(resMap.get("DOCTORID")));//接诊医师
				clinical.setDoctorName(object2String(resMap.get("DOCTORNAME")));//接诊医生姓名
				clinical.setSpecStartTime(object2String(resMap.get("SPECSTARTTIME")));//接诊开始时间	SPECStartTime
				clinical.setDiseaseCode(object2String(resMap.get("DISEASECODE")));//病种代码 	DiseaseCode
				clinical.setDiseaseType(object2String(resMap.get("DISEASETYPE")));//病种类型	
				clinical.setPrintCount(object2String(resMap.get("PRINTCOUNT")));//打印次数	printCount
				clinical.setMrSpecID(object2String(resMap.get("MRSPECID")));//病例专科ID	MRSpecID
				clinical.setmFotmatCode(object2String(resMap.get("MFOTMATCODE")));//格式代码	MFotmatCode
				resList.add(clinical);
			}
			
			result.setList(resList);
		}
		return result;
	}
	
	@Override
	public HisListResponse<Clinical> getClinical(String  clinicalId) {
		Map<String, Object> reqMap = new HashMap<String, Object>();
		// 入参字段映射
		reqMap.put("ClinicalID", clinicalId);
		RestListResponse response = hisRestDao.postForList("OUTP0000102", RestRequest.SEND_TYPE_LOCATION, reqMap);
		HisListResponse<Clinical> result = new HisListResponse<Clinical>(response);
		List<Map<String, Object>> resMaplist = response.getList();
		List<Clinical> resList = new ArrayList<Clinical>();
		Clinical clinical = null;
		if(response.isSuccess() && null != resMaplist){
			for(Map<String, Object> resMap : resMaplist){
				clinical = new Clinical();
				clinical.setClinicalId(object2String(resMap.get("CLINICALID")));//诊疗活动ID	
				clinical.setSpecID(object2String(resMap.get("SPECID")));//接诊专科
				clinical.setRecordID(object2String(resMap.get("RECORDID")));//病情记录ID	
				clinical.setSpecName(object2String(resMap.get("SPECNAME")));//接诊专科名称	
				clinical.setDoctorID(object2String(resMap.get("DOCTORID")));//接诊医师
				clinical.setDoctorName(object2String(resMap.get("DOCTORNAME")));//接诊医生姓名
				clinical.setSpecStartTime(object2String(resMap.get("SPECSTARTTIME")));//接诊开始时间	SPECStartTime
				clinical.setDiseaseCode(object2String(resMap.get("DISEASECODE")));//病种代码 	DiseaseCode
				clinical.setDiseaseType(object2String(resMap.get("DISEASETYPE")));//病种类型	
				clinical.setPrintCount(object2String(resMap.get("PRINTCOUNT")));//打印次数	printCount
				clinical.setMrSpecID(object2String(resMap.get("MRSPECID")));//病例专科ID	MRSpecID
				clinical.setmFotmatCode(object2String(resMap.get("MFOTMATCODE")));//格式代码	MFotmatCode
				resList.add(clinical);
			}
			
			result.setList(resList);
		}
		return result;
	}
	
	@Override
	public HisListResponse<Guide> getGuides(Clinical param) {
		Map<String,Object> reqMap = new HashMap<String,Object>();
        //入参字段映射
        reqMap.put("zlhdid", param.getClinicalId());// 诊疗活动ID		Varchar2(28)	
        
        RestListResponse response = hisRestDao.postForList("MZSF000003", RestRequest.SEND_TYPE_LOCATION, reqMap);
		HisListResponse<Guide> result = new HisListResponse<Guide>(response);
		
		List<Map<String, Object>> resMaplist = response.getList();
		List<Guide> resList = new ArrayList<Guide>();
		if(response.isSuccess() && null != resMaplist){
			for(Map<String, Object> resMap : resMaplist){
				Guide guide = new Guide();
	        	guide.setYzlb(object2String(resMap.get("yzlb")));//医嘱类别	yzlb
	        	guide.setMc(object2String(resMap.get("mc")));//项目名称	mc
	        	guide.setUniqueflag(object2String(resMap.get("uniqueflag")));//处方号	uniqueflag
	        	guide.setAddr(object2String(resMap.get("addr")));//地址	addr
	        	guide.setSf(object2String(resMap.get("sf")));//收费方式	sf
	        	guide.setYy(object2String(resMap.get("yy")));//是否需预约	yy
	        	guide.setNote(object2String(resMap.get("note")));//说明	note
	        	guide.setJyid(object2String(resMap.get("jyid")));//交易ID	jyid
				resList.add(guide);
			}
			result.setList(resList);
		}
		return result;
	}
	private String object2String(Object obj){
		return obj==null ? "" : obj.toString();
	}
}
