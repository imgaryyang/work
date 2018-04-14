package com.lenovohit.hwe.treat.service.impl;


import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.Activity;
import com.lenovohit.hwe.treat.service.HisActivityService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**
 * 
 * @author xiaweiyi
 */
public class HisActivityRestServiceImpl implements HisActivityService {
	
	GenericRestDto<Activity> dto;

	public HisActivityRestServiceImpl(final GenericRestDto<Activity> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public RestEntityResponse<Activity> getInfo(Activity request, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestListResponse<Activity> findList(Activity request, Map<String, ?> variables) {
		return dto.getForList("hcp/app/odws/visitRecord/list", request, variables);
	}

}
