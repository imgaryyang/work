package com.lenovohit.hcp.odws.manager;

import java.util.List;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.onws.moddel.PatStore;
import com.lenovohit.hcp.onws.moddel.PatStoreExec;
import com.lenovohit.hcp.onws.moddel.PatientStoreRecord;

/**    
 *         
 * 类描述： 保管执行单   
 *@author GW
 *@date 2017年6月17日          
 *     
 */
public interface PatStoreMng {

	public void saveItemShort(PatientStoreRecord record,List<PatStoreExec> patStoreExecList, HcpUser user);
	
	public void saveChargeDetailOfMaterial(PatientStoreRecord record, HcpUser user,String appNo);
	
	public void deleteItemShort(PatStore query, HcpUser user);
	
}
