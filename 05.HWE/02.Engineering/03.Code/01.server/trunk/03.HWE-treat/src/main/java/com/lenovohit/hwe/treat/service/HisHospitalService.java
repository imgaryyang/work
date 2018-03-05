package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.Hospital;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;

public interface HisHospitalService {

	public RestEntityResponse<Hospital> getInfo(Hospital request, Map<String, ?> variables);
	
}
