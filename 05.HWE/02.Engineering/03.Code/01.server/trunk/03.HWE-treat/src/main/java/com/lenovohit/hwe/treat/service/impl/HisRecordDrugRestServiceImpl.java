package com.lenovohit.hwe.treat.service.impl;


import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.RecordDrug;
import com.lenovohit.hwe.treat.service.HisRecordDrugService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**
 * 
 * @author xiaweiyi
 */
public class HisRecordDrugRestServiceImpl implements HisRecordDrugService {
	
	GenericRestDto<RecordDrug> dto;

	public HisRecordDrugRestServiceImpl(final GenericRestDto<RecordDrug> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public RestEntityResponse<RecordDrug> getInfo(RecordDrug request, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestListResponse<RecordDrug> findList(RecordDrug request, Map<String, ?> variables) {
		return dto.getForList("hcp/app/odws/medicalOrder/listDetail", request, variables);
	}

}
