package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.Foregift;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisForegiftService {	
	
	public RestEntityResponse<Foregift> recharge(Foregift request, Map<String, ?> variables);
	
	public RestEntityResponse<Foregift> transfer(Foregift request, Map<String, ?> variables);
	
	public RestListResponse<Foregift> findList(Foregift request, Map<String, ?> variables);
}
