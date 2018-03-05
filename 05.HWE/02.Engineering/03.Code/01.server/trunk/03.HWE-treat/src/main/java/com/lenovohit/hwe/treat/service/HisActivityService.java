package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.Activity;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisActivityService {
	public RestEntityResponse<Activity> getInfo(Activity request, Map<String, ?> variables);
	
	public RestListResponse<Activity> findList(Activity request, Map<String, ?> variables);
	
}
