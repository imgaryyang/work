package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.InBed;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisInBedService {	
	
	public RestEntityResponse<InBed> getInfo(InBed request, Map<String, ?> variables);
	
	public RestListResponse<InBed> findList(InBed request, Map<String, ?> variables);
}
