package com.lenovohit.hwe.treat.service.impl;


import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.RecordTest;
import com.lenovohit.hwe.treat.service.HisRecordTestService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**
 * 
 * @author xiaweiyi
 */
public class HisRecordTestRestServiceImpl implements HisRecordTestService {

	GenericRestDto<RecordTest> dto;

	public HisRecordTestRestServiceImpl(final GenericRestDto<RecordTest> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public RestEntityResponse<RecordTest> getInfo(RecordTest model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestListResponse<RecordTest> findList(RecordTest model, Map<String, ?> variables) {
		return dto.getForList("hcp/app/onws/phaPatlis/list", model, variables);
	}

}
