package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.Pacs;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisPacsService {
	
	public RestEntityResponse<Pacs> getInfo(Pacs model, Map<String, ?> variables);
	
	public RestListResponse<Pacs> findList(Pacs model, Map<String, ?> variables);
}
