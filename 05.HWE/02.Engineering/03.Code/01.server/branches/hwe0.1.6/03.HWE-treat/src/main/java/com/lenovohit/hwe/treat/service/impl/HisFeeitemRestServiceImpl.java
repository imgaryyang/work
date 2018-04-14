package com.lenovohit.hwe.treat.service.impl;
import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.Feeitem;
import com.lenovohit.hwe.treat.service.HisFeeitemService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**
 * 
 * @author xiaweiyi
 */
public class HisFeeitemRestServiceImpl implements HisFeeitemService {
	GenericRestDto<Feeitem> dto;

	public HisFeeitemRestServiceImpl(final GenericRestDto<Feeitem> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public RestEntityResponse<Feeitem> getInfo(Feeitem model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestListResponse<Feeitem> findList(Feeitem model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

}
