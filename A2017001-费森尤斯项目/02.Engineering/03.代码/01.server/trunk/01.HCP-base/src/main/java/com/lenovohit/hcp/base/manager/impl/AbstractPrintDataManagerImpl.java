package com.lenovohit.hcp.base.manager.impl;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.manager.PrintDataManager;
import com.lenovohit.hcp.base.model.Dictionary;
import com.lenovohit.hcp.base.model.HcpUser;

public abstract class AbstractPrintDataManagerImpl implements PrintDataManager {
	@Autowired
	private GenericManager<Dictionary, String> dictionaryManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		// TODO Auto-generated method stub
		return null;
	}

	protected String formatBigDecimal(BigDecimal number) {
		if (StringUtils.isBlank(number))
			return "0.00";
		return number.setScale(2, BigDecimal.ROUND_HALF_UP).toString();
	}

	protected String getDictName(String columnName, String columnKey,String hosId) {
		String hql = "from Dictionary where columnName = ? and columnKey = ? and hosId = ? ";
		Dictionary dictionary = dictionaryManager.findOne(hql, columnName, columnKey,hosId);
		if (dictionary != null)
			return dictionary.getColumnVal();
		return columnKey;
	}
}
