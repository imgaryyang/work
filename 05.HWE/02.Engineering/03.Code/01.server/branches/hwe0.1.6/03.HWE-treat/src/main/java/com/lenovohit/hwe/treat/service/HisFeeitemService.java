package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.Feeitem;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisFeeitemService {	
	
	public RestEntityResponse<Feeitem> getInfo(Feeitem request, Map<String, ?> variables);
	
	public RestListResponse<Feeitem> findList(Feeitem request, Map<String, ?> variables);
}
