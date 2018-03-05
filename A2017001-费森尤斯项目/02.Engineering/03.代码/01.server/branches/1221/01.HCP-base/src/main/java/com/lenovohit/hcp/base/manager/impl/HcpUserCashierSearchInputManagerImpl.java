package com.lenovohit.hcp.base.manager.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.model.HcpUser;

@Service("hcpUserCashierSearchInputManager")
public class HcpUserCashierSearchInputManagerImpl extends AbstractHcpUserSearchInputManagerImpl {

	@Override
	protected List<HcpUser> listHcpUser() {
		return hcpUserManager.findByProp("userType", HcpUser.USER_TYPE_CASHIER);
	}

}
