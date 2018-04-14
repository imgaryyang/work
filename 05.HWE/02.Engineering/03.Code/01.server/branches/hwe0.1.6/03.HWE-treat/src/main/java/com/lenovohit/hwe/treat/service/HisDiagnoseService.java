package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.Diagnose;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisDiagnoseService {
	
	public RestEntityResponse<Diagnose> getInfo(Diagnose request, Map<String, ?> variables);
	
	public RestListResponse<Diagnose> findList(Diagnose request, Map<String, ?> variables);
}
