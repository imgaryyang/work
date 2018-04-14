package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.Profile;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisProfileService {
	
	/**    
	 * 功能描述：根据条件查询档案详细信息
	 *@param request
	 *@param variables
	 *@return       
	 *@author GW
	 *@date 2018年2月1日             
	*/
	RestEntityResponse<Profile> getInfo(Profile request, Map<String, ?> variables);
	
	/**    
	 * 功能描述：根据条件查询档案列表
	 *@param request
	 *@param variables
	 *@return       
	 *@author GW
	 *@date 2018年2月1日             
	*/
	RestListResponse<Profile> findList(Profile request, Map<String, ?> variables);
	
	RestEntityResponse<Profile> create(Profile request, Map<String, ?> variables);

	RestEntityResponse<Profile> update(Profile request, Map<String, ?> variables);
	
	RestEntityResponse<Profile> logoff(Profile request, Map<String, ?> variables);

	RestEntityResponse<Profile> logon(Profile request, Map<String, ?> variables);
	
	RestEntityResponse<Profile> acctOpen(Profile request, Map<String, ?> variables);

	RestEntityResponse<Profile> acctFreeze(Profile request, Map<String, ?> variables);

	RestEntityResponse<Profile> acctUnfreeze(Profile request, Map<String, ?> variables);

}
