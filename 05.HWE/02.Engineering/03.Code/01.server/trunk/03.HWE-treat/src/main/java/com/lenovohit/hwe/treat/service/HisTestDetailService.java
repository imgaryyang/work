package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.TestDetail;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisTestDetailService {
	
	public RestEntityResponse<TestDetail> getInfo(TestDetail model, Map<String, ?> variables);
	
	public RestListResponse<TestDetail> findList(TestDetail model, Map<String, ?> variables);
}
