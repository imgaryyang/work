package com.lenovohit.hcp.pharmacy.manager;

import java.util.List;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.pharmacy.model.PhaOutputInfo;

public interface PhaOutStockCheckManger {
	
	public List<PhaOutputInfo> phaOutCheck(String appBill,String comm, HcpUser hcpUser);

}
