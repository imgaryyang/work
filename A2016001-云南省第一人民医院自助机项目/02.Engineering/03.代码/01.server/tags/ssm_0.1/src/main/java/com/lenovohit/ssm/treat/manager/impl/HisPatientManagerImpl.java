package com.lenovohit.ssm.treat.manager.impl;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.ssm.treat.dao.FrontendRestDao;
import com.lenovohit.ssm.treat.manager.HisPatientManager;
import com.lenovohit.ssm.treat.model.MedicalCard;
import com.lenovohit.ssm.treat.model.Patient;

public class HisPatientManagerImpl implements HisPatientManager{

	@Autowired
	private FrontendRestDao frontendRestDao;

	@Override
	public Patient getPatientByMI(String miCardNo) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Patient getPatientByIDCard(String idCardNo) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Patient getPatientByHisID(String hisId) {
		return null;
	}

	@Override
	public Patient getPatient(Patient param) {
		Map<String, String> urlVariables = new HashMap<String,String>(); ;
		if(StringUtils.isEmpty(param.getId())){
			urlVariables.put("id", param.getId());
		}else if(StringUtils.isEmpty(param.getMiCardNo())){
			urlVariables.put("miCardNo", param.getId());
		}else if(StringUtils.isEmpty(param.getMedicalCardNo())){
			urlVariables.put("medicalCardNo", param.getMedicalCardNo());
		}if(StringUtils.isEmpty(param.getIdNo())){
			urlVariables.put("idCardNo", param.getIdNo());
		}
		return frontendRestDao.getForEntity("patient/info", Patient.class,urlVariables);
	}

	@Override
	public Patient createProfile(Patient patient) {
		return frontendRestDao.getForEntity("patient/info", Patient.class);
		//return frontendRestDao.postForEntity("patient/profile/create", patient,Patient.class);
	}

	@Override
	public MedicalCard issueCard(Patient patient) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Patient openDeposit(Patient patient) {
		return frontendRestDao.getForEntity("patient/openDeposit", Patient.class);
	}
	
}
