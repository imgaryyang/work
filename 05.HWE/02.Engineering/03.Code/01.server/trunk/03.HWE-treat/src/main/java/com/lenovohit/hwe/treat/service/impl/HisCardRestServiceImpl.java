package com.lenovohit.hwe.treat.service.impl;
import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.Card;
import com.lenovohit.hwe.treat.service.HisCardService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**
 * 
 * @author xiaweiyi
 */
public class HisCardRestServiceImpl implements HisCardService {
	GenericRestDto<Card> dto;

	public HisCardRestServiceImpl(final GenericRestDto<Card> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public RestEntityResponse<Card> getInfo(Card model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public RestListResponse<Card> findList(Card model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestEntityResponse<Card> bind(Card model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestEntityResponse<Card> logoff(Card model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestEntityResponse<Card> logon(Card model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

}
