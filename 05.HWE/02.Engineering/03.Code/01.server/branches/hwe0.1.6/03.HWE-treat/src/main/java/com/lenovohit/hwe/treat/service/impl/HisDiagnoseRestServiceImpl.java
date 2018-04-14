package com.lenovohit.hwe.treat.service.impl;


import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.Diagnose;
import com.lenovohit.hwe.treat.service.HisDiagnoseService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**
 * 
 * @author xiaweiyi
 */
public class HisDiagnoseRestServiceImpl implements HisDiagnoseService {
	
	GenericRestDto<Diagnose> dto;

	public HisDiagnoseRestServiceImpl(final GenericRestDto<Diagnose> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public RestEntityResponse<Diagnose> getInfo(Diagnose request, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestListResponse<Diagnose> findList(Diagnose request, Map<String, ?> variables) {
		return dto.getForList("hcp/app/odws/diagnose/list", request, variables);
	}

}
