package com.lenovohit.hcp.pharmacy.manager;

import com.lenovohit.hcp.base.model.HcpUser;

public interface PhaOutStockCheckManger {
	
	void phaOutCheck(String appBill,String comm, HcpUser hcpUser);

}
