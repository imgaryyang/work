package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.InArea;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisInAreaService {	
	
	public RestEntityResponse<InArea> getInfo(InArea request, Map<String, ?> variables);
	
	public RestListResponse<InArea> findList(InArea request, Map<String, ?> variables);
}
