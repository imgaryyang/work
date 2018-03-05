package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.Schedule;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisScheduleService {
	
	public RestEntityResponse<Schedule> getInfo(Schedule request, Map<String, ?> variables);
	// 3.4.9 科室排班列表查询
	public RestListResponse<Schedule> findList(Schedule request, Map<String, ?> variables);
}
