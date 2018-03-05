package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.Doctor;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisDoctorService {
	
	public RestEntityResponse<Doctor> getInfo(Doctor request, Map<String, ?> variables);

	public RestListResponse<Doctor> findList(Doctor request, Map<String, ?> variables);
}
