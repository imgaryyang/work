package com.lenovohit.hwe.treat.service.impl;


import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.Hospital;
import com.lenovohit.hwe.treat.service.HisHospitalService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;

/**
 * 
 * @author xiaweiyi
 */
public class HisHospitalRestServiceImpl implements HisHospitalService {

	GenericRestDto<Hospital> dto;

	public HisHospitalRestServiceImpl(final GenericRestDto<Hospital> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public RestEntityResponse<Hospital> getInfo(Hospital hospital, Map<String, ?> variables) {
		return dto.getForEntity("hcp/app/base/hospital/get", null, variables);
	}
}
