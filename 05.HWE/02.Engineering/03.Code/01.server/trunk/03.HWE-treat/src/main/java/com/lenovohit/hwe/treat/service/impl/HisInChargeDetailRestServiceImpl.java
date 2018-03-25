package com.lenovohit.hwe.treat.service.impl;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.InChargeDetail;
import com.lenovohit.hwe.treat.model.Inpatient;
import com.lenovohit.hwe.treat.service.HisInChargeDetailService;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

@Service
public class HisInChargeDetailRestServiceImpl implements HisInChargeDetailService {
	
	GenericRestDto<InChargeDetail> dto;
	
	public HisInChargeDetailRestServiceImpl(final GenericRestDto<InChargeDetail> dto) {
		super();
		this.dto = dto;
	}
	
	public HisInChargeDetailRestServiceImpl(){
		
	}

	@Override
	public RestListResponse<InChargeDetail> findDailyList(Inpatient model, Map<String, ?> variables) {
		return dto.getForList("hcp/app/base/inpatient/list", model, variables);
	}	
}
