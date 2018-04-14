package com.lenovohit.hwe.treat.service.impl;


import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.TestDetail;
import com.lenovohit.hwe.treat.service.HisTestDetailService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**
 * 
 * @author xiaweiyi
 */
public class HisTestDetailRestServiceImpl implements HisTestDetailService {

	GenericRestDto<TestDetail> dto;

	public HisTestDetailRestServiceImpl(final GenericRestDto<TestDetail> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public RestEntityResponse<TestDetail> getInfo(TestDetail request, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestListResponse<TestDetail> findList(TestDetail request, Map<String, ?> variables) {
		return dto.getForList("hcp/app/onws/phaPatlis/listDetail", request, variables);
	}

}
