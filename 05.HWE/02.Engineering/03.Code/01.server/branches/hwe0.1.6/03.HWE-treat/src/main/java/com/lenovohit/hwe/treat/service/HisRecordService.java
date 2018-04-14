package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.Record;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisRecordService {

	public RestEntityResponse<Record> getInfo(Record request, Map<String, ?> variables);
	
	public RestListResponse<Record> findList(Record request, Map<String, ?> variables);
	
}
