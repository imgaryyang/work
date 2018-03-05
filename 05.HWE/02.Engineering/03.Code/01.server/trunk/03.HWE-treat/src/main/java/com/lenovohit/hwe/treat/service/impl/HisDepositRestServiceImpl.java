package com.lenovohit.hwe.treat.service.impl;


import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.AccountInfo;
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
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public RestEntityResponse<Deposit> freeze(Deposit request, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public RestEntityResponse<Deposit> confirmFreeze(Deposit request, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public RestEntityResponse<Deposit> unfreeze(Deposit request, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public RestEntityResponse<Deposit> reufndCancel(Deposit request, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}
}
