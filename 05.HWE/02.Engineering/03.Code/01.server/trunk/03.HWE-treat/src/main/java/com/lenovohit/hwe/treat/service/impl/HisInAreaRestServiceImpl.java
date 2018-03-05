package com.lenovohit.hwe.treat.service.impl;
import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.InArea;
import com.lenovohit.hwe.treat.service.HisInAreaService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**
 * 
 * @author xiaweiyi
 */
public class HisInAreaRestServiceImpl implements HisInAreaService {
	GenericRestDto<InArea> dto;

	public HisInAreaRestServiceImpl(final GenericRestDto<InArea> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public RestEntityResponse<InArea> getInfo(InArea model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestListResponse<InArea> findList(InArea model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

}
