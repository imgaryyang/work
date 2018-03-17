package com.lenovohit.hwe.treat.service.impl;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.Inpatient;
import com.lenovohit.hwe.treat.model.InpatientChargeDetail;
import com.lenovohit.hwe.treat.service.HisInpatientService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

@Service
public class HisInpatientRestServiceImpl implements HisInpatientService {
	
	GenericRestDto<Inpatient> dto;
	GenericRestDto<InpatientChargeDetail> inpatientDailyDto;
	
	public HisInpatientRestServiceImpl(final GenericRestDto<Inpatient> dto, final GenericRestDto<InpatientChargeDetail> inpatientDailyDto) {
		super();
		this.dto = dto;
		this.inpatientDailyDto = inpatientDailyDto;
	}
	
	public HisInpatientRestServiceImpl(){
		
	}
	
	@Override
	public RestEntityResponse<Inpatient> getInfo(Inpatient model, Map<String, ?> variables) {
		//TODO 如果后续有数据字典或转换此处接收数据后还要处理
		return dto.getForEntity("hcp/app/base/inpatient/info", model);
	}
	@Override
	public RestListResponse<InpatientChargeDetail> findDailyList(Inpatient model, Map<String, ?> variables) {
		return inpatientDailyDto.getForList("hcp/app/base/inpatient/list", model, variables);
	}	
}
