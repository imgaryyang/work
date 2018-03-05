package com.lenovohit.hcp.base.model;

/**
 * 查询条件model
 * @description
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月26日
 */
public class SearchInput {
	private String name;
	private String wbCode;
	private String pyCode;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getWbCode() {
		return wbCode;
	}

	public void setWbCode(String wbCode) {
		this.wbCode = wbCode;
	}

	public String getPyCode() {
		return pyCode;
	}

	public void setPyCode(String pyCode) {
		this.pyCode = pyCode;
	}
}
