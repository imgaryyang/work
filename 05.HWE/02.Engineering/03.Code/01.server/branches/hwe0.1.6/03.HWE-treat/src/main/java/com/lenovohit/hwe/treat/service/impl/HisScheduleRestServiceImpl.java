package com.lenovohit.hwe.treat.service.impl;
import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.Schedule;
import com.lenovohit.hwe.treat.service.HisScheduleService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;
/**
 * 
 * @author xiaweiyi
 */
public class HisScheduleRestServiceImpl implements HisScheduleService {
	GenericRestDto<Schedule> dto;

	public HisScheduleRestServiceImpl(final GenericRestDto<Schedule> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public RestEntityResponse<Schedule> getInfo(Schedule request, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestListResponse<Schedule> findList(Schedule request, Map<String, ?> variables) {
		return dto.getForList("hcp/app/his/schedule/list", request, variables);
	}
	
	
}
