package com.lenovohit.hwe.treat.service.impl;
import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.Drug;
import com.lenovohit.hwe.treat.service.HisDrugService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**
 * 
 * @author xiaweiyi
 */
public class HisDrugRestServiceImpl implements HisDrugService {
	GenericRestDto<Drug> dto;

	public HisDrugRestServiceImpl(final GenericRestDto<Drug> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public RestEntityResponse<Drug> getInfo(Drug model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestListResponse<Drug> findList(Drug model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

}
