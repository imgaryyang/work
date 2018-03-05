package com.lenovohit.hwe.treat.service.impl;


import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.Consume;
import com.lenovohit.hwe.treat.service.HisConsumeService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**
 * @ClassName: HisConsumeRestServiceImpl 
 * @Description: 消费记录管理
 * @Compony: Lenovohit
 * @Author: zhangyushuang@lenovohit.com
 * @date 2018年1月24日 上午11:12:43  
 *
 */
public class HisConsumeRestServiceImpl implements HisConsumeService {
	
	GenericRestDto<Consume> dto;

	public HisConsumeRestServiceImpl(final GenericRestDto<Consume> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public RestEntityResponse<Consume> spend(Consume request, Map<String, ?> variables) {
		RestEntityResponse<Consume> response = new RestEntityResponse<Consume>();
		response.setSuccess("true");
		response.setEntity(request);
		return response;
	}

	@Override
	public RestListResponse<Consume> findList(Consume request, Map<String, ?> variables) {
		return null;
	}

}
