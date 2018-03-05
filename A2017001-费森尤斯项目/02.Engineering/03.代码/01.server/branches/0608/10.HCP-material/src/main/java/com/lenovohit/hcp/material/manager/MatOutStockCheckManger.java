package com.lenovohit.hcp.material.manager;

import com.lenovohit.hcp.base.model.HcpUser;

public interface MatOutStockCheckManger {
	
	void matOutCheck(String appBill,String comm, HcpUser hcpUser);

}
