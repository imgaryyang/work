package com.lenovohit.ssm.treat.manager.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.ssm.treat.dao.HisRestDao;
import com.lenovohit.ssm.treat.manager.HisInpatientManager;
import com.lenovohit.ssm.treat.model.Inpatient;
import com.lenovohit.ssm.treat.model.InpatientBill;
import com.lenovohit.ssm.treat.transfer.dao.RestListResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestRequest;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;

public class HisInpatientManagerImpl implements HisInpatientManager {
	@Autowired
	private HisRestDao hisRestDao;
	
//	/**
//	 * 住院患者信息查询(INP000004)
//	 * 根据身份证号/住院号/住院流水号/状态查询住院患者信息
//	 * @param patient
//	 * @return
//	 */
//	public HisEntityResponse getBaseInfo(Inpatient param){
//
//		Map<String, Object> reqMap = new HashMap<String,Object>();
//		//入参字段映射
//		reqMap.put("IdenNo", param.getIdenNo());
//		reqMap.put("patientno", param.getPatientNo());
//		reqMap.put("inpatientno", param.getInpatientno());
//		reqMap.put("Status", param.getStatus());
//		
//		HisEntityResponse response = hisRestDao.postForEntity("INP000004", reqMap);
//		Map<String, Object> resMap = response.getEntity();
//		
//		if(null != resMap) {
//			//出参字段映射
//			Inpatient inpatient = new Inpatient();
//			inpatient.setInpatientno(object2String(resMap.get("inpatientno")));//TODO 病人编号
//			inpatient.setPatientNo(object2String(resMap.get("patientno")));
//			inpatient.setCardNo(object2String(resMap.get("cardno")));
//			inpatient.setName(object2String(resMap.get("Name")));
//			inpatient.setInDate(object2String(resMap.get("indate")));
//			inpatient.setOutDate(object2String(resMap.get("outdate")));
//			inpatient.setStatus(object2String(resMap.get("status")));
//			inpatient.setSex(object2String(resMap.get("sex")));
//			inpatient.setBedNo(object2String(resMap.get("bedno")));
//			inpatient.setIdenNo(object2String(resMap.get("idenno")));
//			inpatient.setMobile(object2String(resMap.get("mobile")));
//			inpatient.setBirthday(object2String(resMap.get("birthday")));
//			inpatient.setDeptNo(object2String(resMap.get("deptno")));
//			inpatient.setDeptName(object2String(resMap.get("deptname")));
//			inpatient.setInDiagnoseNo(object2String(resMap.get("indiagnoseno")));
//			inpatient.setInDiagnose(object2String(resMap.get("indiagnose")));
//			inpatient.setNurId(object2String(resMap.get("nurid")));
//			inpatient.setNurName(object2String(resMap.get("nurname")));
//			inpatient.setSelfBalance(object2String(resMap.get("selfbalance")));
//			inpatient.setDrId(object2String(resMap.get("drid")));
//			inpatient.setDrName(object2String(resMap.get("drname")));
//			
//			response.setHisEntity(inpatient);
//		}
//		
//		return response;
//	}
	
	/**
	 * 获取住院病人信息(INP0000041)
	 * 根据住院唯一标识(住院ID)，获取病人基本信息
	 * @param patient
	 * @return
	 */
	public HisListResponse<Inpatient> getInpatientByInpatientId(Inpatient param){

		Map<String, Object> reqMap = new HashMap<String,Object>();
		//入参字段映射
		reqMap.put("InpatientId", param.getInpatientId());
		
		RestListResponse response = hisRestDao.postForList("INP0000041", RestRequest.SEND_TYPE_LOCATION, reqMap);
		HisListResponse<Inpatient> result = new HisListResponse<Inpatient>(response);
		List<Map<String, Object>> resMapList = response.getList();
		List<Inpatient>  resList = new ArrayList<Inpatient>();
		Inpatient inpatient = null;
		if(null != resMapList) {
			for(Map<String, Object> resMap : resMapList){
				//出参字段映射
				inpatient = new Inpatient();
				inpatient.setMedicalRecordId(object2String(resMap.get("MEDICALRECORDID")));
				inpatient.setInpatientId(object2String(resMap.get("INPATIENTID")));
				inpatient.setInpatientNo(object2String(resMap.get("InpatientNo")));
				inpatient.setPatientNo(object2String(resMap.get("PATIENTNO")));
				inpatient.setPatientName(object2String(resMap.get("PATIENTNAME")));
				inpatient.setDeptId(object2String(resMap.get("DEPTID")));
				inpatient.setDeptName(object2String(resMap.get("DEPTNAME")));
				inpatient.setWardId(object2String(resMap.get("WARDID")));
				inpatient.setWardName(object2String(resMap.get("WARDNAME")));
				inpatient.setBedNo(object2String(resMap.get("BEDNO")));
				inpatient.setHospitalArea(object2String(resMap.get("HOSPITALAREA")));
				inpatient.setAdmission(object2String(resMap.get("ADMISSION")));
				inpatient.setNursingLevel(object2String(resMap.get("NURSINGLEVEL")));
				inpatient.setPayment(object2String(resMap.get("PAYMENT")));
				inpatient.setInDate(object2String(resMap.get("ADMISSIONTIME")));
				inpatient.setOutDate(object2String(resMap.get("DISCHARGEDDATE")));
				inpatient.setDrId(object2String(resMap.get("PHYSICIANID")));
				inpatient.setDrName(object2String(resMap.get("PHYSICIANNAME")));
				inpatient.setNurId(object2String(resMap.get("NURSEID")));
				inpatient.setNurName(object2String(resMap.get("NURSE1")));
				inpatient.setInDiagnose(object2String(resMap.get("INDIAGNOSE")));
				inpatient.setStatus(object2String(resMap.get("STATUSFLAG")));
				resList.add(inpatient);
			}
			
			result.setList(resList);
		}
		
		
		return result;
	}
	
	/**
	 * 获取住院病人信息(INP0000042)
	 * 根据病人编号，获取住院病人基本信息
	 * @param patient
	 * @return
	 */
	public HisListResponse<Inpatient> getInpatientByPatientNo(Inpatient param){

		Map<String, Object> reqMap = new HashMap<String,Object>();
		//入参字段映射
		reqMap.put("PatientNo", param.getPatientNo());
		
		RestListResponse response = hisRestDao.postForList("INP0000042", RestRequest.SEND_TYPE_LOCATION, reqMap);
		HisListResponse<Inpatient> result = new HisListResponse<Inpatient>(response);
		List<Map<String, Object>> resMapList = response.getList();
		List<Inpatient>  resList = new ArrayList<Inpatient>();
		Inpatient inpatient = null;
		if(null != resMapList) {
			for(Map<String, Object> resMap : resMapList){
				if(null != resMap.get("DISCHARGEDDATE") && !"".equals(resMap.get("DISCHARGEDDATE")) ){//只获取在院病人
					continue;
				}
				//出参字段映射
				inpatient = new Inpatient();
				inpatient.setMedicalRecordId(object2String(resMap.get("MEDICALRECORDID")));
				inpatient.setInpatientId(object2String(resMap.get("INPATIENTID")));
				inpatient.setInpatientNo(object2String(resMap.get("INPATIENTNO")));
				inpatient.setPatientNo(object2String(resMap.get("PATIENTNO")));
				inpatient.setPatientName(object2String(resMap.get("PATIENTNAME")));
				inpatient.setDeptId(object2String(resMap.get("DEPTID")));
				inpatient.setDeptName(object2String(resMap.get("DEPTNAME")));
				inpatient.setWardId(object2String(resMap.get("WARDID")));
				inpatient.setWardName(object2String(resMap.get("WARDNAME")));
				inpatient.setBedNo(object2String(resMap.get("BEDNO")));
				inpatient.setHospitalArea(object2String(resMap.get("HOSPITALAREA")));
				inpatient.setAdmission(object2String(resMap.get("ADMISSION")));
				inpatient.setNursingLevel(object2String(resMap.get("NURSINGLEVEL")));
				inpatient.setPayment(object2String(resMap.get("PAYMENT")));
				inpatient.setInDate(object2String(resMap.get("ADMISSIONTIME")));
				inpatient.setOutDate(object2String(resMap.get("DISCHARGEDDATE")));
				inpatient.setDrId(object2String(resMap.get("PHYSICIANID")));
				inpatient.setDrName(object2String(resMap.get("PHYSICIANNAME")));
				inpatient.setNurId(object2String(resMap.get("NURSEID")));
				inpatient.setNurName(object2String(resMap.get("NURSE1")));
				inpatient.setInDiagnose(object2String(resMap.get("INDIAGNOSE")));
				inpatient.setStatus(object2String(resMap.get("STATUSFLAG")));
				resList.add(inpatient);
			}
			
			result.setList(resList);
		}
		
		return result;
	}
	/**
	 * 3.20 HIS住院费用查询（INP0000161）
	 * @param baseInfo
	 * @param date
	 * @return
	 */
	public HisListResponse<InpatientBill> getInpatientBill(Inpatient param){
	    Map<String, Object> reqMap = new HashMap<String, Object>();
        //入参字段映射
        reqMap.put("InpatientId", param.getInpatientId());
        reqMap.put("BeginDate", param.getBeginDate()); //YYYY-MM-DD
        reqMap.put("EndDate", param.getEndDate());//YYYY-MM-DD
//        and jysj between to_date(:BeginDate,'yyyy-mm-dd hh24:mi:ss') and to_date(:EndDate,'yyyy-mm-dd hh24:mi:ss')
		RestListResponse response = hisRestDao.postForList("INP0000161", RestRequest.SEND_TYPE_LOCATION, reqMap);
		HisListResponse<InpatientBill> result = new HisListResponse<InpatientBill>(response);
		List<Map<String, Object>> resMaplist = response.getList();
		List<InpatientBill> resList = new ArrayList<InpatientBill>();
		InpatientBill inpatientBill = null;
		if(null != resMaplist){
			for(Map<String, Object> resMap : resMaplist){
				inpatientBill = new InpatientBill();
				inpatientBill.setRecipeNo(object2String(resMap.get("RECIPENO")));
				inpatientBill.setIndeptId(object2String(resMap.get("INDEPTID")));
				inpatientBill.setIndeptName(object2String(resMap.get("IndeptName")));
				inpatientBill.setDoctorId(object2String(resMap.get("DOCTORID")));
				inpatientBill.setDoctorName(object2String(resMap.get("DOCTORNAME")));
				inpatientBill.setItemId(object2String(resMap.get("ITEMID")));
				inpatientBill.setItemName(object2String(resMap.get("ITEMNAME")));
				inpatientBill.setFeeType(object2String(resMap.get("FEETYPE")));
				inpatientBill.setDose(object2String(resMap.get("DOSE")));
				inpatientBill.setFrequency(object2String(resMap.get("FREQUENCY")));
				inpatientBill.setUsage(object2String(resMap.get("USAGE")));
				inpatientBill.setDosage(object2String(resMap.get("DOSAGE")));
				inpatientBill.setDosageSpec(object2String(resMap.get("DOSAGESPEC")));
				inpatientBill.setItemPrice(object2String(resMap.get("ITEMPRICE")));
				inpatientBill.setItemNum(object2String(resMap.get("ITEMNUM")));
				inpatientBill.setItemSepc(object2String(resMap.get("ITEMSEPC")));
				inpatientBill.setPaymentStatus(object2String(resMap.get("PAYMENTSTATUS")));
				inpatientBill.setExecStatus(object2String(resMap.get("EXECSTATUS")));
				inpatientBill.setPaymentTime(object2String(resMap.get("PAYMENTTIME")));
				
				resList.add(inpatientBill);
			}
		}
		result.setList(resList);
		
		return result;
	}
	
	private String object2String(Object obj){
		return obj==null ? "":obj.toString();
	}
}
