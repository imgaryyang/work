package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.MedicalRecord;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;

public interface HisMedicalRecordService {	
	
	public RestEntityResponse<MedicalRecord> getInfo(MedicalRecord request, Map<String, ?> variables);
}
