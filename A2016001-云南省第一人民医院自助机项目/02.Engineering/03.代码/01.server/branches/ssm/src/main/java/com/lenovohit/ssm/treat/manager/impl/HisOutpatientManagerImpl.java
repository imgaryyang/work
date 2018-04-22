package com.lenovohit.ssm.treat.manager.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.ssm.treat.dao.HisRestDao;
import com.lenovohit.ssm.treat.manager.HisOutpatientManager;
import com.lenovohit.ssm.treat.model.MedicalRecord;
import com.lenovohit.ssm.treat.model.Patient;
import com.lenovohit.ssm.treat.model.PayRecord;
import com.lenovohit.ssm.treat.transfer.dao.RestEntityResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestListResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestRequest;
import com.lenovohit.ssm.treat.transfer.dao.RestResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisResponse;

public class HisOutpatientManagerImpl implements HisOutpatientManager{
	@Autowired
	private HisRestDao hisRestDao;
	
	
	@Override
	public HisListResponse<PayRecord> getPayRecords(Patient param) {

	    Map<String, Object> reqMap = new HashMap<String,Object>();
        //入参字段映射
        putNullToMap(reqMap, "PatientNO", param.getNo());
        putNullToMap(reqMap, "Start_date", param.getStartTime());
        putNullToMap(reqMap, "End_date", param.getEndTime());
        
        RestListResponse response = hisRestDao.postForList("OUTP000007", RestRequest.SEND_TYPE_LOCATION, reqMap);
        HisListResponse<PayRecord> reuslt =new  HisListResponse<PayRecord>(response);
        List<Map<String,Object>> resMapList = response.getList();
        List<PayRecord> resList = new ArrayList<PayRecord>();
        PayRecord payRecord = null;
		if(null != resMapList){
			for(Map<String, Object> resMap : resMapList){
				payRecord = new PayRecord();
				payRecord.setPatientNo(object2String(resMap.get("PatientNO")));
				payRecord.setPatientName(object2String(resMap.get("PATIENT_NAME")));
				payRecord.setPayDate(object2String(resMap.get("PAY_DATE")));
				payRecord.setItemClass(object2String(resMap.get("ITEM_CLASS")));
				payRecord.setInsurClass(object2String(resMap.get("INSUR_CLASS")));
				payRecord.setMyselfScale(object2String(resMap.get("MYSELF_SCALE")));
				payRecord.setItemCode(object2String(resMap.get("ITEM_CODE")));
				payRecord.setItemName(object2String(resMap.get("ITEM_NAME")));
				payRecord.setItemSpec(object2String(resMap.get("ITEM_SPEC")));
				payRecord.setItemUnits(object2String(resMap.get("ITEM_UNITS")));
				payRecord.setItemAmount(object2String(resMap.get("ITEM_AMOUNT")));
				payRecord.setItemPrice(object2String(resMap.get("ITEM_PRICE")));
				payRecord.setItemCosts(object2String(resMap.get("ITEM_COSTS")));
				payRecord.setPerformDept(object2String(resMap.get("PERFORM_DEPT")));
				payRecord.setDoctorName(object2String(resMap.get("DOCTOR_NAME")));
				payRecord.setAdviceTime(object2String(resMap.get("ADVICE_TIME")));
				payRecord.setRecipeNo(object2String(resMap.get("RecipeNo")));
				
				resList.add(payRecord);
			}
		}
		reuslt.setList(resList);
		
        return reuslt;
	
	}

//	/**
//	 * 查询病人病情情况(OUTMR00001)
//	 * @param patient
//	 * @return
//	 */
//	public HisListResponse<MedicalRecord> getMedicalRecords(MedicalRecord param){
//	    Map<String, Object> reqMap = new HashMap<String, Object>();
//        //入参字段映射
//        putNullToMap(reqMap, "PatientNO", param.getPatientNo());
//        putNullToMap(reqMap, "RecordType", param.getIsPrint());
//        
//		RestListResponse response = hisRestDao.postForList("OUTMR00001", RestRequest.SEND_TYPE_LOCATION, reqMap);
//		HisListResponse<MedicalRecord> result = new HisListResponse<MedicalRecord>(response);
//		List<Map<String, Object>> resMaplist = response.getList();
//		List<MedicalRecord> resList = new ArrayList<MedicalRecord>();
//		MedicalRecord medicalRecord = null;
//		if(null != resMaplist){
//			for(Map<String, Object> resMap : resMaplist){
//				medicalRecord = new MedicalRecord();
//				medicalRecord.setRecordId(object2String(resMap.get("RECORDID")));
//				medicalRecord.setRecordName(object2String(resMap.get("RecordName")));
//				medicalRecord.setPatientNo(object2String(resMap.get("PATIENTNO")));
//				medicalRecord.setClinicalId(object2String(resMap.get("CLINICALID")));
//				medicalRecord.setSpecId(object2String(resMap.get("SPETID")));
//				medicalRecord.setDiseaseId(object2String(resMap.get("DISEASEID")));
//				medicalRecord.setOperaterId(object2String(resMap.get("OPERATERUSERID")));
//				medicalRecord.setPrintCount(object2String(resMap.get("PRINTCOUNT")));
//				medicalRecord.setFristInputTime(object2String(resMap.get("FIRSTINPUTTIME")));
//				medicalRecord.setmFotmatCode(object2String(resMap.get("MFOTMATCODE")));
//				medicalRecord.setPatientNo(param.getPatientNo());
//				
//				resList.add(medicalRecord);
//			}
//		}
//		result.setList(resList);
//		
//		return result;
//	}
	/**
	 * 3.15 HIS就诊记录查询（OUTP0000101）
	 * @param patient
	 * @return
	 */
	public HisListResponse<MedicalRecord> getMedicalRecords(MedicalRecord param){
		Map<String, Object> reqMap = new HashMap<String, Object>();
		//入参字段映射
		putNullToMap(reqMap, "PatientNo", param.getPatientNo());
		putNullToMap(reqMap, "StartTime", param.getStartTime());
		putNullToMap(reqMap, "EndTime", param.getEndTime());
		
		RestListResponse response = hisRestDao.postForList("OUTP0000101", RestRequest.SEND_TYPE_LOCATION, reqMap);
		HisListResponse<MedicalRecord> result = new HisListResponse<MedicalRecord>(response);
		List<Map<String, Object>> resMaplist = response.getList();
		List<MedicalRecord> resList = new ArrayList<MedicalRecord>();
		MedicalRecord medicalRecord = null;
		if(null != resMaplist){
			for(Map<String, Object> resMap : resMaplist){
				medicalRecord = new MedicalRecord();
				medicalRecord.setClinicalId(object2String(resMap.get("CLINICALID")));
				medicalRecord.setSpecId(object2String(resMap.get("SPECID")));
				medicalRecord.setRecordId(object2String(resMap.get("RECORDID")));
				medicalRecord.setSpecName(object2String(resMap.get("SPECNAME")));
				medicalRecord.setDoctorId(object2String(resMap.get("DOCTORID")));
				medicalRecord.setDoctorName(object2String(resMap.get("DOCTORNAME")));
				medicalRecord.setSpecStartTime(object2String(resMap.get("SPECSTARTTIME")));
				medicalRecord.setDiseaseType(object2String(resMap.get("DISEASETYPE")));
				switch(medicalRecord.getDiseaseType()){
					case "0": 
						medicalRecord.setDiseaseName("普通");
						break;
					case "2": 
						medicalRecord.setDiseaseName("特病");
						break;
					case "3": 
						medicalRecord.setDiseaseName("慢病");
						break;
					default:
						medicalRecord.setDiseaseName("普通");
				}
				medicalRecord.setDiseaseCode(object2String(resMap.get("DISEASECODE")));
				medicalRecord.setPrintCount(object2String(resMap.get("PRINTCOUNT")));
				medicalRecord.setmRSpecID(object2String(resMap.get("MRSpecID")));
				medicalRecord.setmFotmatCode(object2String(resMap.get("MFOTMATCODE")));
				medicalRecord.setPatientNo(param.getPatientNo());
				
				resList.add(medicalRecord);
			}
		}
		result.setList(resList);
		
		return result;
	}
	
	/**
	 * 病历信息详情	明细使用html方式传输
	 * @param record
	 * @return
	 */
	public HisResponse getMedicalRecord(MedicalRecord param){
	    Map<String, Object> reqMap = new HashMap<String, Object>();
        //入参字段映射
	    putNullToMap(reqMap, "ClinicalID", param.getClinicalId());
        putNullToMap(reqMap, "RecordID", param.getRecordId());
        putNullToMap(reqMap, "MFotmatCode", param.getmFotmatCode());
        putNullToMap(reqMap, "SpetID", param.getSpecId());
        
        RestRequest request = new RestRequest();
		request.setCode("OUTMR00002");
		request.setParam(reqMap);
		request.setSendType(RestRequest.SEND_TYPE_LOCATION);
		
		RestResponse response = hisRestDao.post(request);
		HisResponse result = new HisResponse(response);
		
		return result;
	}
	/**
	 * 病历打印成功回调(OUTMR00003)
	 * @param record
	 * @return
	 */
	public HisEntityResponse<MedicalRecord> medicalRecordPrint(MedicalRecord param){
		Map<String, Object> reqMap = new HashMap<String, Object>();
        //入参字段映射
        putNullToMap(reqMap, "RecordID", param.getRecordId());
//		putNullToMap(reqMap, "HisUserid", param.getHisUserid());
        
		RestEntityResponse response = hisRestDao.postForEntity("OUTMR00003", RestRequest.SEND_TYPE_POST, reqMap)  ;
		HisEntityResponse<MedicalRecord> result  = new HisEntityResponse<MedicalRecord>(response);
		
		return result;
	}

	private void putNullToMap(Map<String, Object> map, String key, Object value){
		if(value == null || StringUtils.isBlank(value.toString())){
			map.put(key, "");
		} else {
			map.put(key, value);
		}
	}
	private String object2String(Object obj){
		return obj==null ? "":obj.toString();
	}
}
