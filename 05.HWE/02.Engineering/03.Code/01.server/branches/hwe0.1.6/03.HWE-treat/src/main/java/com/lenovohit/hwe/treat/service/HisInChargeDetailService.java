package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.InChargeDetail;
import com.lenovohit.hwe.treat.model.Inpatient;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**    
 *         
 * 类描述：    患者住院缴费信息
 *@author GW
 *@date 2018年2月1日          
 *     
 */
public interface HisInChargeDetailService {	
	
	/**    
	 * 功能描述：根据查询条件查询患者住院信息列表
	 *@param inpatient
	 *@param variables
	 *@return       
	 *@author GW
	 *@date 2018年2月1日             
	*/
	public RestListResponse<InChargeDetail> findDailyList(Inpatient inpatient, Map<String, ?> variables);
}
