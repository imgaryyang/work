package com.lenovohit.ssm.treat.manager;

import java.util.List;

import com.lenovohit.ssm.payment.model.Fee;
import com.lenovohit.ssm.treat.model.MedicalRecord;
import com.lenovohit.ssm.treat.model.Patient;

public interface HisOutpatientManager {
	/**
	 * 就诊记录查询	outpatient/medicalRecord/page	get
	 * @param patient
	 * @return
	 */
	List<MedicalRecord> getMedicalRecordPage(Patient patient);
	
	/**
	 * 病历信息详情	outpatient/medicalRecord/{id}	get
	 * @param record
	 * @return
	 */
	List<MedicalRecord> getMedicalRecord(String id);
	/**
	 * 病历打印成功回传	outpatient/medicalRecord/printed	post
	 * @param record
	 * @return
	 */
	MedicalRecord medicalRecordPrint(MedicalRecord record);

}
