package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.Consume;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisConsumeService {
	
	/**
	 * 3.5.9 预存扣款
	 * <p>Title: spend</p> 
	 * <p>Description: </p>
	 * @param request 
	 * @param variables
	 * @return
	 */
	public RestEntityResponse<Consume> spend(Consume request, Map<String, ?> variables);

	/**
	 * 3.5.10	预存记录查询
	 * <p>Title: findList</p> 
	 * <p>Description: </p>
	 * @param request
	 * @param variables
	 * @return
	 */
	public RestListResponse<Consume> findList(Consume request, Map<String, ?> variables);
	
}
