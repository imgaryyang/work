package com.lenovohit.hcp.base.manager.impl;

import org.springframework.stereotype.Service;

import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.manager.PrintDataManager;
import com.lenovohit.hcp.base.model.HcpUser;

@Service("defaultPrintDataManager")
public class DefaultPrintDataManagerImpl implements PrintDataManager {

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		PrintData data = new PrintData();
		data.setT1("挂号、退费当天有效");
		data.setT2("退费必须提供病人联及医生联");
		data.setT3("赵数虹");
		data.setT4("普通外科");
		data.setT5("1.00");
		data.setT6("2017-04-27");
		data.setT7("梁洁怡");
		data.setT8("2017042700001");
		data.setT9("4.00");
		return data;
	}

}
