package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.Inpatient;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**    
 *         
 * 类描述：    患者住院信息相关处理
 *@author GW
 *@date 2018年2月1日          
 *     
 */
public interface HisInpatientService {	
	
	/**    
	 * 功能描述：根据查询条件查询患者住院信息
	 *@param inpatient
	 *@param variables
	 *@return       
	 *@author GW
	 *@date 2018年2月1日             
	*/
	public RestEntityResponse<Inpatient> getInfo(Inpatient inpatient, Map<String, ?> variables);
	
	/**    
	 * 功能描述：根据查询条件查询患者住院信息列表
	 *@param inpatient
	 *@param variables
	 *@return       
	 *@author GW
	 *@date 2018年2月1日             
	*/
	public RestListResponse<Inpatient> findList(Inpatient inpatient, Map<String, ?> variables);
}
