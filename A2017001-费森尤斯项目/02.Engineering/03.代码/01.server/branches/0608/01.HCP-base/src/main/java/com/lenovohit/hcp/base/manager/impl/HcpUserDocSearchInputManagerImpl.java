package com.lenovohit.hcp.base.manager.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lenovohit.hcp.base.model.HcpUser;

@Service("hcpUserDocSearchInputManager")
public class HcpUserDocSearchInputManagerImpl extends AbstractHcpUserSearchInputManagerImpl {

	@Override
	protected List<HcpUser> listHcpUser() {
		return hcpUserManager.findByProp("userType", HcpUser.USER_TYPE_DOCTOR);
	}

}
