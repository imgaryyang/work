package com.lenovohit.hcp.base.manager.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.manager.SearchInputManager;
import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.SearchInput;

@Service("materialCompanyInfoSupplySearchInputManager")
public class MaterialCompanyInfoSupplySearchInputManagerImpl implements SearchInputManager {

	@Autowired
	private GenericManager<Company, String> matCompanyInfoManager;

	@Override
	public Map<String, SearchInput> listSearchInput(String code) {
		String hql = "from MatCompanyInfo where companyType = ? and stopFlag = ?";
		List<Company> companyInfos = matCompanyInfoManager.find(hql, "2", true);
		System.out.println(companyInfos.size());
		Map<String, SearchInput> result = new HashMap<>();
		for (Company info : companyInfos) {
			String companyId = info.getId();
			SearchInput input = new SearchInput();
			input.setName(info.getCompanyName());
			input.setPyCode(info.getCompanySpell());
			input.setWbCode(info.getCompanyWb());
			result.put(companyId, input);
		}
		return result;
	}

}
