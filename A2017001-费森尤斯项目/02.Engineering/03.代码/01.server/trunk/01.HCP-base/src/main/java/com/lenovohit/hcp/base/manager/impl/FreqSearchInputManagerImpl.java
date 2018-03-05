package com.lenovohit.hcp.base.manager.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.manager.SearchInputManager;
import com.lenovohit.hcp.base.model.Frequency;
import com.lenovohit.hcp.base.model.SearchInput;

@Service("freqSearchInputManager")
public class FreqSearchInputManagerImpl implements SearchInputManager {
	@Autowired
	private GenericManager<Frequency, String> frequencyManager;

	@Override
	public Map<String, SearchInput> listSearchInput(String code,String hosId) {
		String hql = "from Frequency where 1 = 1 and hosId =? ";
		List<Object> values = new ArrayList<Object>();
		values.add(hosId);
		List<Frequency> frequencies = frequencyManager.find(hql,values.toArray());
		Map<String, SearchInput> result = new HashMap<>();
		for (Frequency info : frequencies) {
			String freqId = info.getFreqId();
			SearchInput input = new SearchInput();
			input.setName(info.getFreqName());
			input.setPyCode(info.getSpellCode());
			input.setWbCode(info.getWbCode());
			result.put(freqId, input);
		}
		return result;
	}

}
