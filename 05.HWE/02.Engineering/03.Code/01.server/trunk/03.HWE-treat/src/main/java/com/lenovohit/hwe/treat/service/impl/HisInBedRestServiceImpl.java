package com.lenovohit.hwe.treat.service.impl;
import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.InBed;
import com.lenovohit.hwe.treat.service.HisInBedService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**
 * 
 * @author xiaweiyi
 */
public class HisInBedRestServiceImpl implements HisInBedService {
	GenericRestDto<InBed> dto;

	public HisInBedRestServiceImpl(final GenericRestDto<InBed> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public RestEntityResponse<InBed> getInfo(InBed model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestListResponse<InBed> findList(InBed model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

}
