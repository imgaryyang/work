package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.Drug;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisDrugService {
	
	public RestEntityResponse<Drug> getInfo(Drug request, Map<String, ?> variables);
	
	public RestListResponse<Drug> findList(Drug request, Map<String, ?> variables);
}
