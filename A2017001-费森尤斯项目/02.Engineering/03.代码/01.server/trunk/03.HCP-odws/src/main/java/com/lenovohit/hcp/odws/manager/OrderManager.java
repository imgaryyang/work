/**
 * 
 */
package com.lenovohit.hcp.odws.manager;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.odws.model.MedicalOrder;

/**
 * @author duanyanshan
 * @date 2018年1月10日 下午5:34:29
 */
public interface OrderManager {
	
	public MedicalOrder savItem(MedicalOrder model,HcpUser user);

}
