/**
 * 
 */
package com.lenovohit.hcp.odws.manager;

import java.util.List;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.odws.model.MedicalOrder;

/**
 * @author duanyanshan
 * @date 2017年11月10日 下午5:27:31
 */
public interface OrderRetreatManager {

	//医生站退药编辑
	public String orderBack(List<MedicalOrder> list, HcpUser user);
}
