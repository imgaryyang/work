package com.lenovohit.hcp.base.manager;

import java.util.Map;

import com.lenovohit.hcp.base.model.SearchInput;

/**
 * 根据定义的码值查询搜索条件
 * @description
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月26日
 */
public interface SearchInputManager {

	Map<String, SearchInput> listSearchInput(String code, String hosId);
}
