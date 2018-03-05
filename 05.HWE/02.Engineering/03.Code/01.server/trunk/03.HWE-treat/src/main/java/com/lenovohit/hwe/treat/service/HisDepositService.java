package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.Deposit;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisDepositService {
	
	public RestEntityResponse<Deposit> getInfo(Deposit request, Map<String, ?> variables);
	
	public RestListResponse<Deposit> findList(Deposit request, Map<String, ?> variables);
	
	public RestEntityResponse<Deposit> recharge(Deposit request, Map<String, ?> variables);
	
	public RestEntityResponse<Deposit> freeze(Deposit request, Map<String, ?> variables);
	
	public RestEntityResponse<Deposit> confirmFreeze(Deposit request, Map<String, ?> variables);
	
	public RestEntityResponse<Deposit> unfreeze(Deposit request, Map<String, ?> variables);
	
	public RestEntityResponse<Deposit> reufndCancel(Deposit request, Map<String, ?> variables);
	
}
