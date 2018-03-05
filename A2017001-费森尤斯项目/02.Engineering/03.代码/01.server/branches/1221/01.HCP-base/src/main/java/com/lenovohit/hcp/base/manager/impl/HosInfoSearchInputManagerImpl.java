package com.lenovohit.hcp.base.manager.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.manager.SearchInputManager;
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.base.model.SearchInput;

@Service("hosInfoSearchInputManager")
public class HosInfoSearchInputManagerImpl implements SearchInputManager {

	@Autowired
	private GenericManager<Hospital, String> hospitalManager;

	@Override
	public Map<String, SearchInput> listSearchInput(String code, String hosId) {
		Map<String, SearchInput> result = new HashMap<>();
		String hql = "from Hospital h where h.hosId in (select distinct(hosId) from Hospital)";
		List<Hospital> hospitals = (List<Hospital>) hospitalManager.find(hql);
		for (Hospital h : hospitals) {
			String key = h.getHosId();
			SearchInput input = new SearchInput();
			input.setName(h.getHosName());
			input.setPyCode(h.getSpellCode());
			input.setWbCode(h.getWbCode());
			result.put(key, input);
		}
		return result;
	}

}
