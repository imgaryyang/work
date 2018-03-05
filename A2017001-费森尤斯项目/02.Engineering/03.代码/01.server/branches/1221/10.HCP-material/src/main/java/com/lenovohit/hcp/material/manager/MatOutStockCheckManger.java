package com.lenovohit.hcp.material.manager;

import java.io.OutputStream;
import java.util.List;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.material.model.MatApplyIn;

public interface MatOutStockCheckManger {
	
	void matOutCheck(String appBill,String comm, HcpUser hcpUser);

	/**    
	 * 功能描述：请领单导出
	 *@param infoList
	 *@param out       
	 *@author GW
	 *@date 2017年7月5日             
	*/
	void exportDetailToExcel(List<MatApplyIn> infoList, OutputStream out);

}
