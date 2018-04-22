package com.lenovohit.ssm.treat.manager.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.ssm.treat.dao.HisRestDao;
import com.lenovohit.ssm.treat.manager.HisPrescriptionManager;
import com.lenovohit.ssm.treat.model.PrescriptionItem;
import com.lenovohit.ssm.treat.model.PrescriptionRecord;
import com.lenovohit.ssm.treat.transfer.dao.RestEntityResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestListResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestRequest;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;

public class HisPrescriptionManagerImpl implements HisPrescriptionManager {
	protected transient final Log log = LogFactory.getLog(getClass());
	@Autowired
	private HisRestDao hisRestDao;
	
	/**
	 * 根据病人编号查询处方记录
	 */
	@Override
	public HisListResponse<PrescriptionRecord> getPrescriptionRecords(PrescriptionRecord param) {
		Map<String, Object> reqMap = new HashMap<String, Object>();
		//入参字段映射
		putNullToMap(reqMap, "PatientNo", param.getPatientNo());
		putNullToMap(reqMap, "StartTime", param.getStartTime());
		putNullToMap(reqMap, "EndTime", param.getEndTime());
		
		//OUTP0000103患者历次门诊处方信息
		RestListResponse response = hisRestDao.postForList("OUTP0000103", RestRequest.SEND_TYPE_LOCATION, reqMap);
		HisListResponse<PrescriptionRecord> result = new HisListResponse<PrescriptionRecord>(response);
		List<Map<String, Object>> resMaplist = response.getList();
		List<PrescriptionRecord> resList = new ArrayList<PrescriptionRecord>();
		PrescriptionRecord prescriptionRecord = null;
		if(null != resMaplist){
			for(Map<String, Object> resMap : resMaplist){
				prescriptionRecord = new PrescriptionRecord();
				prescriptionRecord.setPrescriptionNo(object2String(resMap.get("CFH")));//处方号
				prescriptionRecord.setPharmacyWindow(object2String(resMap.get("YFMC")));//取药药房
				prescriptionRecord.setDate(object2String(resMap.get("YZSJ")));//处方日期
				prescriptionRecord.setDepartment(object2String(resMap.get("BMMC")));//科室
				prescriptionRecord.setPatientNo(object2String(resMap.get("BRBH")));//病人编号
				prescriptionRecord.setUnit(object2String(resMap.get("DWMC")));//单位
				prescriptionRecord.setPatientName(object2String(resMap.get("BRXM")));//病人姓名
				prescriptionRecord.setGender(object2String(resMap.get("BRXB")));//性别
				prescriptionRecord.setCostType(object2String(resMap.get("FB")));//费别
				prescriptionRecord.setAddress(object2String(resMap.get("LXDZ")));//地址
				prescriptionRecord.setMobilPhone(object2String(resMap.get("LXDH")));//手机
				prescriptionRecord.setClinicalDiagnosis(object2String(resMap.get("LCZD")));//临床诊断
				prescriptionRecord.setRemarks(object2String(resMap.get("BZ")));//备注
				prescriptionRecord.setDispensing(object2String(resMap.get("FYRY")));//发药人
				prescriptionRecord.setAuditor(object2String(resMap.get("SHRY")));//审核人
				prescriptionRecord.setDistributor(object2String(resMap.get("DPR")));//调配人
				prescriptionRecord.setChecker(object2String(resMap.get("HDR")));//核对人
				prescriptionRecord.setDoctor(object2String(resMap.get("YSXM")));//开单医生
				prescriptionRecord.setTotalAmount(object2String(resMap.get("ZJE")));//处方单总金额
				prescriptionRecord.setPrintFlag(object2String(resMap.get("DYBZ")));//0-未打印1-已打印
				
				//获取处方单类型
				String prescriptionNo = object2String(resMap.get("CFH"));
				if(prescriptionNo != null || prescriptionNo != ""){
					Map<String, Object> reqMap1 = new HashMap<String, Object>();
			        //入参字段映射
				    putNullToMap(reqMap1, "CFH", prescriptionNo);
					
					RestEntityResponse response1 = hisRestDao.postForEntity("OUTP0000105", RestRequest.SEND_TYPE_LOCATION, reqMap1);
			        Map<String, Object> resMap1 = response1.getEntity();
					if(response1.isSuccess() && null != resMap1) {
						//出参字段映射
						prescriptionRecord.setPrescriptionType(object2String(resMap1.get("ZLLX")));
					}
				}
				resList.add(prescriptionRecord);
			}
		}
		result.setList(resList);
		return result;
	}
	
	@Override
	public HisListResponse<PrescriptionItem> getPrescription(PrescriptionRecord param) {
		Map<String,Object> reqMap = new HashMap<String,Object>();
		//入参字段映射
        reqMap.put("CFH", param.getPrescriptionNo());//处方号
        
        RestListResponse response = hisRestDao.postForList("OUTP0000104", RestRequest.SEND_TYPE_LOCATION, reqMap);
        HisListResponse<PrescriptionItem> result = new HisListResponse<PrescriptionItem>(response);
        List<Map<String, Object>> resMaplist = response.getList();
		List<PrescriptionItem> resList = new ArrayList<PrescriptionItem>();
		PrescriptionItem prescriptionItem = null;
		if(null != resMaplist){
			for(Map<String, Object> resMap : resMaplist){
				prescriptionItem = new PrescriptionItem();
				prescriptionItem.setDrugName(object2String(resMap.get("MC")));
				prescriptionItem.setSpecifications(object2String(resMap.get("JXGG")));
				prescriptionItem.setUsageAndDosage(object2String(resMap.get("YCYL")));
				prescriptionItem.setNumber(object2String(resMap.get("SL")));
				
				resList.add(prescriptionItem);
			}
		}
		result.setList(resList);
		return result;
	}
	
	@Override
	public HisEntityResponse<PrescriptionRecord> prescriptionRecordPrint(PrescriptionRecord param) {
		Map<String, Object> reqMap = new HashMap<String, Object>();
		//入参字段映射
        putNullToMap(reqMap, "CFH", param.getPrescriptionNo());
        //门诊处方单打印成功回调(OUTMR00004)
        RestEntityResponse response = hisRestDao.postForEntity("OUTMR00004", RestRequest.SEND_TYPE_POST, reqMap)  ;
		HisEntityResponse<PrescriptionRecord> result  = new HisEntityResponse<PrescriptionRecord>(response);
		
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
