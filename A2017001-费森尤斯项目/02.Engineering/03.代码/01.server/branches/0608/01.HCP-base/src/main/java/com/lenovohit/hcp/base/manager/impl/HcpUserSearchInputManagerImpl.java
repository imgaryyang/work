package com.lenovohit.hcp.base.manager.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.lenovohit.hcp.base.manager.SearchInputManager;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.SearchInput;

@Service("hcpUserSearchInputManager")
public class HcpUserSearchInputManagerImpl extends AbstractHcpUserSearchInputManagerImpl {

	@Override
	protected List<HcpUser> listHcpUser() {
		return hcpUserManager.findAll();
	}

}
