package com.lenovohit.hcp.hrp.manager.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.dto.InnerData;
import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.manager.impl.AbstractPrintDataManagerImpl;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.finance.model.InvoiceInfoDetail;
import com.lenovohit.hcp.hrp.model.InstrmInputInfo;

//入库单打印
@Service("instrmPrintDataManagerImpl")
public class instrmPrintDataManagerImpl extends AbstractPrintDataManagerImpl {
	@Autowired
	private GenericManager<InstrmInputInfo, String> instrmInputInfoManager;


	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		String hql = "from InstrmInputInfo where ";
		PrintData data = new PrintData();
		List<Object> values = new ArrayList<Object>();
		if(!"undefined".equals(bizId)&& bizId!=null){
			String[] _ids = bizId.split(",");
			for(String _id : _ids){
				hql+="id =? or";
				values.add(_id);
			}
			hql=hql.substring(0,hql.length()-2);
			List<InstrmInputInfo>_list= instrmInputInfoManager.find(hql,values);
			List<InnerData> innerDatas = new ArrayList<>();
			for (InstrmInputInfo _detail : _list) {
				InnerData innerData = new InnerData();
				innerData.setT1(formatBigDecimal (_detail.getSaleCost()));
				innerData.setT1(formatBigDecimal (_detail.getBuyCost()));
				innerDatas.add(innerData);
			}
			Map<String, List<InnerData>> result = new HashMap<>();
			result.put("0", innerDatas);
			data.setMap(result);
		}
		return data;
	}



}
