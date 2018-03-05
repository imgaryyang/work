package com.lenovohit.hcp.base.manager.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.manager.SearchInputManager;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.SearchInput;

public abstract class AbstractHcpUserSearchInputManagerImpl implements SearchInputManager {
	@Autowired
	protected GenericManager<HcpUser, String> hcpUserManager;

	@Override
	public Map<String, SearchInput> listSearchInput(String code) {
		Map<String, SearchInput> result = new HashMap<>();
		List<HcpUser> infos = listHcpUser();
		for (HcpUser e : infos) {
			String key = e.getName();
			SearchInput input = new SearchInput();
			input.setName(e.getName());
			input.setPyCode(e.getPinyin());
			input.setWbCode("");
			result.put(key, input);
		}
		return result;
	}

	protected abstract List<HcpUser> listHcpUser();
}
