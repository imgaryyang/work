package com.lenovohit.hcp.base.manager.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.manager.MessageNotificationManager;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.material.model.MatBuyBill;
import com.lenovohit.hcp.pharmacy.model.PhaBuyBill;

@Service
public class MessageNotificationManagerImpl implements MessageNotificationManager {
	@Autowired
	protected GenericManager<PhaBuyBill, String> phaBuyBillManager;
	@Autowired
	protected GenericManager<MatBuyBill, String> matBuyBillManager;
	
	@Override
	public List<?> find(String modelName,HcpUser user) {
		String hosId = user.getHosId();
		if(StringUtils.isNotBlank(modelName)){
			if("pharmacy".equalsIgnoreCase(modelName)){//药库
				return findMessageOfPharmacy(hosId);
			}else if("material".equalsIgnoreCase(modelName)){//物资
				return findMessageOfMaterial(hosId);
			}else{
				return null;
			}
		} else {
			return null;
		}
	}
	
	/**    
	 * 功能描述：查询上报药品的采购计划
	 *@return       
	 *@author GW
	 *@date 2017年7月11日             
	*/
	public List<PhaBuyBill> findMessageOfPharmacy(String hosId) {
		String hql = " from PhaBuyBill where buyState = ? and hosId = ? ";
		List<PhaBuyBill> listModel = phaBuyBillManager.find(hql, "1",hosId);
		return listModel;
	}
	
	/**    
	 * 功能描述：查询上报的物资采购计划
	 *@return       
	 *@author GW
	 *@date 2017年7月11日             
	*/
	public List<MatBuyBill> findMessageOfMaterial(String hosId) {
		String hql = " from MatBuyBill where buyState = ? and hosId = ? ";
		List<Object> objs = new ArrayList<Object>();
		objs.add("1");
		objs.add(hosId);
		List<MatBuyBill> listModel = matBuyBillManager.find(hql, objs.toArray());
		return listModel;
	}
	
}
