package com.lenovohit.ssm.treat.manager.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.ssm.treat.dao.FrontendRestDao;
import com.lenovohit.ssm.treat.manager.HisOutpatientManager;
import com.lenovohit.ssm.treat.model.MedicalRecord;
import com.lenovohit.ssm.treat.model.Patient;

public class HisOutpatientManagerImpl implements HisOutpatientManager{

	@Autowired
	private FrontendRestDao frontendRestDao;
	
	@Override
	public List<MedicalRecord> getMedicalRecordPage(Patient patient) {
		
		List<MedicalRecord> medicalRecord = frontendRestDao.getForList("outpatient/medicalRecord/page", MedicalRecord.class);
		
		return medicalRecord;
	}

	@Override
	public List<MedicalRecord> getMedicalRecord(String id) {
		List<MedicalRecord> medicalDetail = frontendRestDao.getForList("outpatient/medicalRecord/"+id, MedicalRecord.class);
		return medicalDetail;
	}

	@Override
	public MedicalRecord medicalRecordPrint(MedicalRecord record) {
		
		return null;
	}
	
}
