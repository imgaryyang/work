package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.RecordDrug;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisRecordDrugService {

	public RestEntityResponse<RecordDrug> getInfo(RecordDrug request, Map<String, ?> variables);
	
	public RestListResponse<RecordDrug> findList(RecordDrug request, Map<String, ?> variables);

}
