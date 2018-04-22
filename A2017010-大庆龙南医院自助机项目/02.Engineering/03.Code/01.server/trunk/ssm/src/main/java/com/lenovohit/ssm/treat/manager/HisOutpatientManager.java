package com.lenovohit.ssm.treat.manager;

import com.lenovohit.ssm.treat.model.MedicalRecord;
import com.lenovohit.ssm.treat.model.Patient;
import com.lenovohit.ssm.treat.model.PayRecord;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisResponse;

public interface HisOutpatientManager {
	/**
	 * 门诊已交费记录明细查询(OUTP000007)
	 * @param patient
	 * @return
	 */
	HisListResponse<PayRecord> getPayRecords(Patient param);
	/**
	 * 患者历次门诊诊疗信息(OUTP0000101)
	 * @param patient
	 * @return
	 */
	HisListResponse<MedicalRecord> getMedicalRecords(MedicalRecord param);
	
	/**
	 * 根据记录id获取门诊病历(OUTMR00002)
	 * @param record
	 * @return
	 */
	HisResponse getMedicalRecord(MedicalRecord record);
	
	/**
	 * 病历打印成功回调(OUTMR00003)
	 * @param record
	 * @return
	 */
	HisEntityResponse<MedicalRecord> medicalRecordPrint(MedicalRecord record);

}
