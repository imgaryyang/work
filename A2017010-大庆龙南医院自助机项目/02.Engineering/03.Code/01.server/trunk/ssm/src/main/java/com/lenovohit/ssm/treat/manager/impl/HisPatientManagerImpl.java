package com.lenovohit.ssm.treat.manager.impl;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.treat.dao.HisRestDao;
import com.lenovohit.ssm.treat.manager.HisPatientManager;
import com.lenovohit.ssm.treat.model.ChargeItem;
import com.lenovohit.ssm.treat.model.Patient;
import com.lenovohit.ssm.treat.transfer.dao.RestEntityResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestListResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestRequest;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;

public class HisPatientManagerImpl implements HisPatientManager{
	@Autowired
	private HisRestDao hisRestDao;
	
	/**
	 * 根据病人信息获取病人编号 - 患者卡信息(PATIENT001)
	 * @param param
	 * @return
	 */
	@Deprecated
	public HisEntityResponse<Patient> getPatientNo(Patient param){
		Map<String, Object> reqMap = new HashMap<String,Object>();
		//入参字段映射
		putNullToMap(reqMap, "IdenNo", param.getIdNo());                 //身份账号
		putNullToMap(reqMap, "Name", param.getName());                   //姓名
		putNullToMap(reqMap, "Tel", param.getTelephone());               //联系方式
		putNullToMap(reqMap, "Sex", param.getGender());                  //性别(1-男; 2-女)
		putNullToMap(reqMap, "Birthday", param.getBirthday());           //生日(2016-11-30)
		
		RestEntityResponse response = hisRestDao.postForEntity("PATIENT001", RestRequest.SEND_TYPE_LOCATION, reqMap);
		HisEntityResponse<Patient> result = new HisEntityResponse<Patient>(response);
		Map<String, Object> resMap = response.getEntity();
		
		if(response.isSuccess() && null != resMap) {
			//出参字段映射
			Patient patient = new Patient();
			patient.setNo(object2String(resMap.get("PATIENTNO")));
			patient.setIdNo(object2String(resMap.get("IDNO")));
			patient.setGuaranteeIdCard(object2String(resMap.get("GUARANTEEIDCARD")));
			patient.setGuaranteeName(object2String(resMap.get("GUARANTEENAME")));
			patient.setGuaranteeType(object2String(resMap.get("GUARANTEETYPE")));
			patient.setBlack(object2String(resMap.get("IsBlack")));
			
			result.setEntity(patient);
		}
		
		return result;
	}
	
	/**
	 * 患者基本信息查询(PATIENT0021)
	 * 卡内数据（就诊卡/社保卡）
	 * @param param
	 * @return
	 */
	public HisEntityResponse<Patient> getPatientByPatientNo(Patient param){
	    Map<String,Object> reqMap = new HashMap<String,Object>();
        //入参字段映射
    	putNullToMap(reqMap, "PatientNO", param.getNo());
	    
		RestListResponse response = hisRestDao.postForList("PATIENT002", RestRequest.SEND_TYPE_LOCATION, reqMap);
		HisEntityResponse<Patient> result = new HisEntityResponse<Patient>(response);
		List<Map<String, Object>> resMaplist = response.getList();
		List<Patient> resList = new ArrayList<Patient>();
		Patient patient = null;
		if(response.isSuccess() && null != resMaplist){
			for(Map<String, Object> resMap : resMaplist){
				patient = new Patient();
				patient.setIdNo(object2String(resMap.get("ID_NO")));
				patient.setMedicalCardNo(object2String(resMap.get("CARDNO")));
				patient.setNo(object2String(resMap.get("PATIENTNO")));
				patient.setName(object2String(resMap.get("PATIENT_NAME")));
				patient.setBirthday(object2String(resMap.get("BIRTHDAY")));
				patient.setTelephone(object2String(resMap.get("TELEPHONENUM")));
				patient.setStatus(object2String(resMap.get("STATUS")));
				patient.setGender(object2String(resMap.get("SEX")));
				patient.setBalance(new BigDecimal(resMap.get("BALANCE")==null?"0.0":resMap.get("BALANCE").toString()));
				patient.setCreateTime(object2String(resMap.get("CREATETIME")));
				patient.setRelationCard(object2String(resMap.get("GLKH")));
				patient.setRelationType(object2String(resMap.get("GLLX")));
				patient.setUnitCode(object2String(resMap.get("DWDM")));
				patient.setKtfs(object2String(resMap.get("KTFS")));
				patient.setAccStatus(object2String(resMap.get("YC_ZTBZ")));
				patient.setAccStatusName(object2String(resMap.get("YC_STATUS")));
				patient.setLhz(object2String(resMap.get("LHZ")));
				
				resList.add(patient);
			}
			if(resMaplist.isEmpty()){
				// 没查到
			}else if(resMaplist.size() == 1 ){
				result.setEntity(resList.get(0));
			}else{
				throw new BaseException("同一个病人编号下有多个档案");
			}
		}
		return result;
	}
	
	/**
	 * 患者基本信息查询(PATIENT0021)
	 * 卡内数据（就诊卡/社保卡）
	 * @param param
	 * @return
	 */
	public HisEntityResponse<Patient> getPatientByCardNo(Patient param){
	    Map<String,Object> reqMap = new HashMap<String,Object>();
        //入参字段映射
    	putNullToMap(reqMap, "CardNo", StringUtils.isNotEmpty(param.getMedicalCardNo())?param.getMedicalCardNo():param.getMiCardNo());
	    
    	RestListResponse response = hisRestDao.postForList("PATIENT0021", RestRequest.SEND_TYPE_LOCATION, reqMap);
    	HisEntityResponse<Patient> result = new HisEntityResponse<Patient>(response);
    	List<Map<String, Object>> resMaplist = response.getList();
		List<Patient> resList = new ArrayList<Patient>();
		Patient patient = null;
		if(response.isSuccess() && null != resMaplist){
			for(Map<String, Object> resMap : resMaplist){
				patient = new Patient();
				patient.setIdNo(object2String(resMap.get("ID_NO")));
				patient.setMedicalCardNo(object2String(resMap.get("CARDNO")));
				patient.setNo(object2String(resMap.get("PATIENTNO")));
				patient.setName(object2String(resMap.get("PATIENT_NAME")));
				patient.setBirthday(object2String(resMap.get("BIRTHDAY")));
				patient.setTelephone(object2String(resMap.get("TELEPHONENUM")));
				patient.setStatus(object2String(resMap.get("STATUS")));
				patient.setGender(object2String(resMap.get("SEX")));
				patient.setBalance(new BigDecimal(resMap.get("BALANCE")==null?"0.0":resMap.get("BALANCE").toString()));
				patient.setCreateTime(object2String(resMap.get("CREATETIME")));
				patient.setRelationCard(object2String(resMap.get("GLKH")));
				patient.setRelationType(object2String(resMap.get("GLLX")));
				patient.setUnitCode(object2String(resMap.get("DWDM")));
				patient.setKtfs(object2String(resMap.get("KTFS")));
				patient.setAccStatus(object2String(resMap.get("YC_ZTBZ")));
				patient.setAccStatusName(object2String(resMap.get("YC_STATUS")));
				patient.setLhz(object2String(resMap.get("LHZ")));
				
				resList.add(patient);
			}
			if(resMaplist.isEmpty()){
				// 没查到
			}else if(resMaplist.size() == 1 ){
				result.setEntity(resList.get(0));
			}else{
				throw new BaseException("同一个卡号"+reqMap.get("CardNo")+"下有多个档案");
			}
		}

		return result;
	}
	
	/**
	 * 患者基本信息查询(PATIENT0022)
	 * 身份证号
	 * @param param
	 * @return
	 */
	public HisListResponse<Patient> getPatientByIdNo(Patient param){
	    Map<String,Object> reqMap = new HashMap<String, Object>();
        //入参字段映射
    	putNullToMap(reqMap, "ID_NO", param.getIdNo());
	    
    	RestListResponse response = hisRestDao.postForList("PATIENT0022", RestRequest.SEND_TYPE_LOCATION, reqMap);
    	HisListResponse<Patient> result = new HisListResponse<Patient>(response);
    	List<Map<String, Object>> resMaplist = response.getList();
		List<Patient> resList = new ArrayList<Patient>();
		Patient patient = null;
		if(response.isSuccess() && null != resMaplist){
			for(Map<String, Object> resMap : resMaplist){
				patient = new Patient();
				patient.setIdNo(object2String(resMap.get("ID_NO")));
				patient.setMedicalCardNo(object2String(resMap.get("CARDNO")));
				patient.setNo(object2String(resMap.get("PATIENTNO")));
				patient.setName(object2String(resMap.get("PATIENT_NAME")));
				patient.setBirthday(object2String(resMap.get("BIRTHDAY")));
				patient.setTelephone(object2String(resMap.get("TELEPHONENUM")));
				patient.setStatus(object2String(resMap.get("STATUS")));
				patient.setGender(object2String(resMap.get("SEX")));
				patient.setBalance(new BigDecimal(resMap.get("BALANCE")==null?"0.0":resMap.get("BALANCE").toString()));
				patient.setCreateTime(object2String(resMap.get("CREATETIME")));
				patient.setRelationCard(object2String(resMap.get("GLKH")));
				patient.setRelationType(object2String(resMap.get("GLLX")));
				patient.setUnitCode(object2String(resMap.get("DWDM")));
				patient.setKtfs(object2String(resMap.get("KTFS")));
				patient.setAccStatus(object2String(resMap.get("YC_ZTBZ")));
				patient.setAccStatusName(object2String(resMap.get("YC_STATUS")));
				patient.setLhz(object2String(resMap.get("LHZ")));
				
				resList.add(patient);
			}
			result.setList(resList);
		}
		
		return result;
	}
	
	/**
	 * 患者基本信息建档并开通预存(PATIENT0031)
	 * @param patient
	 * @return
	 */
	public HisEntityResponse<Patient> createProfile(Patient param){
		Map<String, Object> reqMap = new HashMap<String, Object>();
		if(StringUtils.isEmpty(param.getSpell())){
			param.setSpell(StringUtils.getFirstUpPinyin(param.getName()));
		}
		if(StringUtils.isEmpty(param.getWubi())){
			param.setWubi(StringUtils.getWBCode(param.getName()));
		}

		// 入参字段映射 TODO商量自助机建档时不提供病人编号和就诊卡号
		putNullToMap(reqMap, "Unit_code", param.getUnitCode());
		putNullToMap(reqMap, "Card_NO", param.getMedicalCardNo()); // 建档时不提供卡号
		putNullToMap(reqMap, "PATIENT_NAME", param.getName());
		putNullToMap(reqMap, "ID_NO", param.getIdNo());
		putNullToMap(reqMap, "SEX", param.getGender());
		DateFormat format1 = new SimpleDateFormat("yyyyMMdd");
		DateFormat format2 = new SimpleDateFormat("yyyy-MM-dd");
		String birth = param.getBirthday();
		String birthday = birth;
		if(null!= birthday && birthday.length() == 8){
			try {
				birthday = format2.format(format1.parse(birth));
			} catch (ParseException e) {
			}
		}
		putNullToMap(reqMap, "birthday", birthday);
		putNullToMap(reqMap, "Telephonenum", param.getTelephone());
		putNullToMap(reqMap, "mobilephonenum", param.getMobile());
		putNullToMap(reqMap, "address", param.getAddress());
		putNullToMap(reqMap, "pinyin", param.getSpell());
		putNullToMap(reqMap, "Wubi", param.getWubi());
		putNullToMap(reqMap, "Opentype", param.getOpenType());
		putNullToMap(reqMap, "GuaranteeIdCard", param.getGuaranteeIdCard());
		putNullToMap(reqMap, "GuaranteeName", param.getGuaranteeName());
		putNullToMap(reqMap, "GuaranteeType", param.getGuaranteeType());
		putNullToMap(reqMap, "VerificationCode", param.getVerificationCode());
		putNullToMap(reqMap, "HisUserid", param.getHisUserid());
		putNullToMap(reqMap, "Occupationnum",param.getOccupationnum());
		putNullToMap(reqMap, "Nationality", param.getNationality());
		putNullToMap(reqMap, "Marriage", param.getMarriage());
		putNullToMap(reqMap, "NativePlace", param.getNativePlace());
		putNullToMap(reqMap, "Nation", param.getNation());
		
		putNullToMap(reqMap, "LXDZ_SHEN", param.getSheng());
		putNullToMap(reqMap, "LXDZ_SHI", param.getShi());
		putNullToMap(reqMap, "LXDZ_XIAN", param.getXian());
		putNullToMap(reqMap, "LXDZ_QT", param.getLocation());
		putNullToMap(reqMap, "GZDW", param.getCompany());
		putNullToMap(reqMap, "QTZJH", param.getOtherIdNO());
		
        RestEntityResponse response = hisRestDao.postForEntity("PATIENT0031", RestRequest.SEND_TYPE_POST, reqMap);
        HisEntityResponse<Patient> result = new HisEntityResponse<Patient>(response);
        Map<String,Object> resMap = response.getEntity();
      
		if(response.isSuccess() && null != resMap) {
			//出参字段映射
			Patient patient = new Patient();
	        patient.setNo(object2String(resMap.get("PatientNO")));
	        patient.setName(object2String(resMap.get("PatientName")));
	        
	        result.setEntity(patient);
		}
		
		return result;
	}
	/**
	 * 患者基本信息建档并开通预存(PATIENT0031)
	 * @param patient
	 * @return
	 */
	public HisEntityResponse<Patient> createProfileWithoutIdNo(Patient param){
		Map<String, Object> reqMap = new HashMap<String, Object>();
		if(StringUtils.isEmpty(param.getSpell())){
			param.setSpell(StringUtils.getFirstUpPinyin(param.getName()));
		}
		if(StringUtils.isEmpty(param.getWubi())){
			param.setWubi(StringUtils.getWBCode(param.getName()));
		}

		// 入参字段映射 TODO商量自助机建档时不提供病人编号和就诊卡号
		putNullToMap(reqMap, "Unit_code", param.getUnitCode());
		putNullToMap(reqMap, "Card_NO", param.getMedicalCardNo()); // 建档时不提供卡号
		putNullToMap(reqMap, "PATIENT_NAME", param.getName());
		putNullToMap(reqMap, "ID_NO", param.getIdNo());
		putNullToMap(reqMap, "SEX", param.getGender());
		DateFormat format1 = new SimpleDateFormat("yyyyMMdd");
		DateFormat format2 = new SimpleDateFormat("yyyy-MM-dd");
		String birth = param.getBirthday();
		String birthday = birth;
		if(null!= birthday && birthday.length() == 8){
			try {
				birthday = format2.format(format1.parse(birth));
			} catch (ParseException e) {
			}
		}
		putNullToMap(reqMap, "birthday", birthday);
		putNullToMap(reqMap, "Telephonenum", param.getTelephone());
		putNullToMap(reqMap, "mobilephonenum", param.getMobile());
		putNullToMap(reqMap, "address", param.getAddress());
		putNullToMap(reqMap, "pinyin", param.getSpell());
		putNullToMap(reqMap, "Wubi", param.getWubi());
		putNullToMap(reqMap, "Opentype", param.getOpenType());
		putNullToMap(reqMap, "GuaranteeIdCard", param.getGuaranteeIdCard());
		putNullToMap(reqMap, "GuaranteeName", param.getGuaranteeName());
		putNullToMap(reqMap, "GuaranteeType", param.getGuaranteeType());
		putNullToMap(reqMap, "VerificationCode", param.getVerificationCode());
		putNullToMap(reqMap, "HisUserid", param.getHisUserid());
		putNullToMap(reqMap, "Occupationnum",param.getOccupationnum());
		putNullToMap(reqMap, "Nationality", param.getNationality());
		putNullToMap(reqMap, "Marriage", param.getMarriage());
		putNullToMap(reqMap, "NativePlace", param.getNativePlace());
		putNullToMap(reqMap, "Nation", param.getNation());
		
		putNullToMap(reqMap, "LXDZ_SHEN", param.getSheng());
		putNullToMap(reqMap, "LXDZ_SHI", param.getShi());
		putNullToMap(reqMap, "LXDZ_XIAN", param.getXian());
		putNullToMap(reqMap, "LXDZ_QT", param.getLocation());
		putNullToMap(reqMap, "GZDW", param.getCompany());
		putNullToMap(reqMap, "QTZJH", param.getOtherIdNO());
		
        RestEntityResponse response = hisRestDao.postForEntity("PATIENT0032", RestRequest.SEND_TYPE_POST, reqMap);
        HisEntityResponse<Patient> result = new HisEntityResponse<Patient>(response);
        Map<String,Object> resMap = response.getEntity();
      
		if(response.isSuccess() && null != resMap) {
			//出参字段映射
			Patient patient = new Patient();
	        patient.setNo(object2String(resMap.get("PatientNO")));
	        patient.setName(object2String(resMap.get("PatientName")));
	        
	        result.setEntity(patient);
		}
		
		return result;
	}
	
	
	/**
	 * 2.4患者基本信息更新(PATIENT004)
	 * @param patient
	 * @return
	 */
	public HisEntityResponse<Patient> updatePatient(Patient param){
		Map<String, Object> reqMap = new HashMap<String, Object>();
		//入参字段映射
		putNullToMap(reqMap, "PatientNO", param.getNo());
		putNullToMap(reqMap, "Address", param.getAddress());
		putNullToMap(reqMap, "Telephonenum", param.getTelephone());
		putNullToMap(reqMap, "Mobilephonenum", param.getMobile());
		putNullToMap(reqMap, "status", param.getStatus());
		putNullToMap(reqMap, "HisUserid", param.getHisUserid());
		
        RestEntityResponse response = hisRestDao.postForEntity("PATIENT004", RestRequest.SEND_TYPE_POST, reqMap);
        HisEntityResponse<Patient> result = new HisEntityResponse<Patient>(response);
        //出参字段映射
        return result;
	}
	
	/**
	 * 支付就诊卡 特殊处理，不走统一支付，但是接口是一个
	 * @param patient
	 * @return
	 */
	public HisEntityResponse<Patient> payCard(Order cardOrder){
		return null;
	}
	/**
	 * 2.5患者就诊卡绑定(PATIENT0041)
	 * @param patient
	 * @return
	 */
	public HisEntityResponse<Patient> bindCard(Patient param){//TODO patient entity为空
	    Map<String, Object> reqMap = new HashMap<String,Object>();
        //入参字段映射
	    putNullToMap(reqMap, "CardNo", param.getMedicalCardNo());
	    putNullToMap(reqMap, "PatientNO", param.getNo());
		putNullToMap(reqMap, "HisUserid", param.getHisUserid());
	    
        RestEntityResponse response = hisRestDao.postForEntity("PATIENT0041", RestRequest.SEND_TYPE_LOCATION, reqMap);
        HisEntityResponse<Patient> result = new HisEntityResponse<Patient>(response);
        //出参字段映射
        return result;
	}
	
	/**
	 * 2.5患者就诊卡挂失/启用(PATIENT0042)
	 * @param patient
	 * @return
	 */
	public HisEntityResponse<Patient> changeCardStatus(Patient param){
	    Map<String, Object> reqMap = new HashMap<String,Object>();
        //入参字段映射
	    putNullToMap(reqMap, "PatientNO", param.getNo());
	    putNullToMap(reqMap, "status", param.getCardStatus());
		putNullToMap(reqMap, "HisUserid", param.getHisUserid());
	    
        RestEntityResponse response = hisRestDao.postForEntity("PATIENT0042", RestRequest.SEND_TYPE_POST, reqMap);
        HisEntityResponse<Patient> result = new HisEntityResponse<Patient>(response);
        //出参字段映射
        return result;
	}
	
	/**
	 * 收费项目信息查询(BASE000019)
	 * @param patient
	 * @return
	 */
	public HisEntityResponse<ChargeItem> chargeItemInfo(String xmid){
	    Map<String, Object> reqMap = new HashMap<String, Object>();
        //入参字段映射
	    putNullToMap(reqMap, "XMID", xmid);
	    
        RestEntityResponse response = hisRestDao.postForEntity("BASE000019", RestRequest.SEND_TYPE_LOCATION, reqMap);
        HisEntityResponse<ChargeItem> result = new HisEntityResponse<ChargeItem>(response);
        Map<String, Object> resMap = response.getEntity();
        
		if(response.isSuccess() && null != resMap) {
			//出参字段映射
			ChargeItem chargeItem = new ChargeItem();
			chargeItem.setXmid(object2String(resMap.get("XMID")));
			chargeItem.setMc(object2String(resMap.get("MC")));
			chargeItem.setDj(object2String(resMap.get("DJ")));
			chargeItem.setZtbz(object2String(resMap.get("ZTBZ")));
	        result.setEntity(chargeItem);
		}
		
		return result;
	}
	/************************** 社保卡自费不绑定方案新增 2017-6-4 **********************************/
	
	/**
	 * 根据身份证号查询自费档信息
	 * @param param
	 * @return
	 */
	public HisListResponse<Patient> getSelfPatientByIdNo(Patient param){
	    Map<String,Object> reqMap = new HashMap<String, Object>();
        //入参字段映射
    	putNullToMap(reqMap, "ID_NO", param.getIdNo());
	    
    	RestListResponse response = hisRestDao.postForList("PATIENT0025", RestRequest.SEND_TYPE_LOCATION, reqMap);
    	HisListResponse<Patient> result = new HisListResponse<Patient>(response);
    	List<Map<String, Object>> resMaplist = response.getList();
		List<Patient> resList = new ArrayList<Patient>();
		Patient patient = null;
		if(response.isSuccess() && null != resMaplist){
			for(Map<String, Object> resMap : resMaplist){
				patient = new Patient();
				patient.setIdNo(object2String(resMap.get("ID_NO")));
				patient.setMedicalCardNo(object2String(resMap.get("CARDNO")));
				patient.setNo(object2String(resMap.get("PATIENTNO")));
				patient.setName(object2String(resMap.get("PATIENT_NAME")));
				patient.setBirthday(object2String(resMap.get("BIRTHDAY")));
				patient.setTelephone(object2String(resMap.get("TELEPHONENUM")));
				patient.setStatus(object2String(resMap.get("STATUS")));
				patient.setGender(object2String(resMap.get("SEX")));
				patient.setBalance(new BigDecimal(resMap.get("BALANCE")==null?"0.0":resMap.get("BALANCE").toString()));
				patient.setCreateTime(object2String(resMap.get("CREATETIME")));
				patient.setRelationCard(object2String(resMap.get("GLKH")));
				patient.setRelationType(object2String(resMap.get("GLLX")));
				patient.setUnitCode(object2String(resMap.get("DWDM")));
				patient.setKtfs(object2String(resMap.get("KTFS")));
				patient.setAccStatus(object2String(resMap.get("YC_ZTBZ")));
				patient.setAccStatusName(object2String(resMap.get("YC_STATUS")));
				patient.setLhz(object2String(resMap.get("LHZ")));
				
				resList.add(patient);
			}
			result.setList(resList);
		}
		
		return result;
	}
	/**
	 * 根据社保卡内数据关联社保卡关联自费档信息
	 * @param param
	 * @return
	 */
	public HisListResponse<Patient> getRelaCardByMiCardNo(Patient param){
	    Map<String,Object> reqMap = new HashMap<String, Object>();
        //入参字段映射
    	putNullToMap(reqMap, "CardNo", param.getMiCardNo());
	    
    	RestListResponse response = hisRestDao.postForList("PATIENT0026", RestRequest.SEND_TYPE_LOCATION, reqMap);
    	HisListResponse<Patient> result = new HisListResponse<Patient>(response);
    	List<Map<String, Object>> resMaplist = response.getList();
		List<Patient> resList = new ArrayList<Patient>();
		Patient patient = null;
		if(response.isSuccess() && null != resMaplist){
			for(Map<String, Object> resMap : resMaplist){
				patient = new Patient();
				patient.setIdNo(object2String(resMap.get("ID_NO")));
				patient.setMedicalCardNo(object2String(resMap.get("CARDNO")));
				patient.setNo(object2String(resMap.get("PATIENTNO")));
				patient.setName(object2String(resMap.get("PATIENT_NAME")));
				patient.setBirthday(object2String(resMap.get("BIRTHDAY")));
				patient.setTelephone(object2String(resMap.get("TELEPHONENUM")));
				patient.setStatus(object2String(resMap.get("STATUS")));
				patient.setGender(object2String(resMap.get("SEX")));
				patient.setBalance(new BigDecimal(resMap.get("BALANCE")==null?"0.0":resMap.get("BALANCE").toString()));
				patient.setCreateTime(object2String(resMap.get("CREATETIME")));
				patient.setRelationCard(object2String(resMap.get("GLKH")));
				patient.setRelationType(object2String(resMap.get("GLLX")));
				patient.setUnitCode(object2String(resMap.get("DWDM")));
				patient.setKtfs(object2String(resMap.get("KTFS")));
				patient.setAccStatus(object2String(resMap.get("YC_ZTBZ")));
				patient.setAccStatusName(object2String(resMap.get("YC_STATUS")));
				patient.setLhz(object2String(resMap.get("LHZ")));
				
				resList.add(patient);
			}
			result.setList(resList);
		}
		
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
		return obj==null ? "" : obj.toString();
	}
}
