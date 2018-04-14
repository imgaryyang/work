package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.RecordTest;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisRecordTestService {
	
	public RestEntityResponse<RecordTest> getInfo(RecordTest model, Map<String, ?> variables);
	
	public RestListResponse<RecordTest> findList(RecordTest model, Map<String, ?> variables);
}
