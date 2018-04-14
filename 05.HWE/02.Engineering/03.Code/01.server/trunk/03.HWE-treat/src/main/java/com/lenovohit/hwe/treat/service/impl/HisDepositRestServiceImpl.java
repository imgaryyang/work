package com.lenovohit.hwe.treat.service.impl;


import java.util.Map;

import org.springframework.beans.factory.annotation.Value;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.Deposit;
import com.lenovohit.hwe.treat.service.HisDepositService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**
 * 
 * @author xiaweiyi
 */
public class HisDepositRestServiceImpl implements HisDepositService {

	GenericRestDto<Deposit> dto;
	@Value("${his.baseUrl}")
	private String baseUrl;
	
	public HisDepositRestServiceImpl(final GenericRestDto<Deposit> dto) {
		super();
		this.dto = dto;
	}
	public HisDepositRestServiceImpl() {}
	
	@Override
	public RestEntityResponse<Deposit> getInfo(Deposit request, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public RestListResponse<Deposit> findList(Deposit request, Map<String, ?> variables) {
		return dto.getForList("hcp/app/test/deposit/list", request);
	}
	@Override
	public RestEntityResponse<Deposit> recharge(Deposit request, Map<String, ?> variables) {
		return dto.postForEntity("hcp/app/test/deposit/recharge", request);
	}
	@Override
	public RestEntityResponse<Deposit> freeze(Deposit request, Map<String, ?> variables) {
		return dto.postForEntity("hcp/app/test/deposit/freeze", request);
	}
	@Override
	public RestEntityResponse<Deposit> confirmFreeze(Deposit request, Map<String, ?> variables) {
		return dto.postForEntity("hcp/app/test/deposit/confirmFreeze", request);
	}
	@Override
	public RestEntityResponse<Deposit> unfreeze(Deposit request, Map<String, ?> variables) {
		return dto.postForEntity("hcp/app/test/deposit/unfreeze", request);
	}
	@Override
	public RestEntityResponse<Deposit> reufndCancel(Deposit request, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}
}
