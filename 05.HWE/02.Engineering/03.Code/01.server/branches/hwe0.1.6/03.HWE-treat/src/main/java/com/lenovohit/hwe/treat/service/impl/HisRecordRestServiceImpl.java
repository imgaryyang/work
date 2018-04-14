package com.lenovohit.hwe.treat.service.impl;


import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.Record;
import com.lenovohit.hwe.treat.service.HisRecordService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**
 * 
 * @author xiaweiyi
 */
public class HisRecordRestServiceImpl implements HisRecordService {
	
	GenericRestDto<Record> dto;

	public HisRecordRestServiceImpl(final GenericRestDto<Record> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public RestEntityResponse<Record> getInfo(Record request, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestListResponse<Record> findList(Record request, Map<String, ?> variables) {
		return dto.getForList("hcp/app/odws/medicalOrder/list", request, variables);
	}

}
