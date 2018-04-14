package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.ChargeDetail;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisChargeDetailService {

	public RestEntityResponse<ChargeDetail> getInfo(ChargeDetail request, Map<String, ?> variables);
	
	public RestListResponse<ChargeDetail> findList(ChargeDetail request);
	
	public RestListResponse<ChargeDetail> unpaids(ChargeDetail request);
	
}
