package com.lenovohit.hwe.treat.service;

import java.util.List;
import java.util.Map;

import com.lenovohit.hwe.treat.model.Charge;
import com.lenovohit.hwe.treat.model.ChargeDetail;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisChargeService {	
	public RestEntityResponse<Charge> getInfo(Charge request, Map<String, ?> variables);
	
	public RestListResponse<Charge> findList(Charge request);
	
	public RestEntityResponse<Charge> prepay(Charge charge);
	
	public RestEntityResponse<Charge> pay(Charge model);
	
	public RestEntityResponse<Charge> hisCallBack(Charge charge);
	
}
