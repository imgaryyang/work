package com.lenovohit.hwe.treat.service.impl;
import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.Foregift;
import com.lenovohit.hwe.treat.service.HisForegiftService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**
 * 
 * @author xiaweiyi
 */
public class HisForegiftRestServiceImpl implements HisForegiftService {
	GenericRestDto<Foregift> dto;

	public HisForegiftRestServiceImpl(final GenericRestDto<Foregift> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public RestEntityResponse<Foregift> recharge(Foregift request, Map<String, ?> variables) {
		return dto.postForEntity("hcp/app/test/foregift/recharge", request);
	}
	
	@Override
	public RestEntityResponse<Foregift> transfer(Foregift request, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestListResponse<Foregift> findList(Foregift request, Map<String, ?> variables) {
		return dto.getForList("hcp/app/test/foregift/list", request);
	}

}
