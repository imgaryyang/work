package com.lenovohit.hcp.pharmacy.manager.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.pharmacy.manager.PhaDrugInfoManager;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaDrugPrice;

@Service
@Transactional
public class PhaDrugInfoManagerImpl implements PhaDrugInfoManager {

	@Autowired
	private GenericManager<PhaDrugInfo, String> phaDrugInfoManager;
	@Autowired
	private GenericManager<PhaDrugPrice, String> phaDrugPriceManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	
	//子医院新增药品基本信息
	@Override
	public PhaDrugInfo createDrugPrice(PhaDrugPrice price, PhaDrugInfo phaDrugInfo, HcpUser hcpUser) {
		PhaDrugInfo drugInfo = phaDrugInfoManager.save(phaDrugInfo);
		price.setDrugInfo(drugInfo);
		price.setDrugCode(drugInfo.getDrugCode());
		price.setHosId(hcpUser.getHosId());
		this.phaDrugPriceManager.save(price);
		return drugInfo;
	}
	
	//集团新增药品基本信息
	@Override
	public PhaDrugInfo createDrugPriceGroup(PhaDrugPrice price, PhaDrugInfo phaDrugInfo, HcpUser hcpUser) {
		PhaDrugInfo drugInfo = phaDrugInfoManager.save(phaDrugInfo);
		price.setDrugInfo(drugInfo);
		price.setDrugCode(drugInfo.getDrugCode());
		price.setHosId(hcpUser.getHosId());
		this.phaDrugPriceManager.save(price);
		//当集团新建药品基本信息时，对各个下级医院也新增相应的信息
		this.createPhaDrugPrice(drugInfo, hcpUser);
		return drugInfo;
	}
	/**
	 * 当集团新建药品基本信息时，对各个下级医院也新增相应的药品价格信息
	 * @param drugInfo
	 * @param user
	 * @return
	 */
	private void createPhaDrugPrice(PhaDrugInfo drugInfo,HcpUser user){
		Date now = new Date();
		//1、获取集团下所有的下级医院
		StringBuilder jql = new StringBuilder("from Hospital where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		jql.append("and hosId != ? ");
		values.add(user.getHosId());
		List<Hospital> hospitals = hospitalManager.find(jql.toString(), values.toArray());
		//2、对每个下级医院新增相应的药品价格信息
		for(Hospital hos : hospitals){
			PhaDrugPrice d = new PhaDrugPrice();
			d.setHosId(hos.getHosId());
			d.setDrugCode(drugInfo.getDrugCode());
			d.setDrugInfo(drugInfo);
			d.setCenterCode(drugInfo.getCenterCode());
			d.setBuyPrice(drugInfo.getBuyPrice());
			d.setSalePrice(drugInfo.getSalePrice());
			d.setTaxBuyPrice(drugInfo.getTaxBuyPrice());
			d.setTaxSalePrice(drugInfo.getTaxSalePrice());
			d.setWholePrice(drugInfo.getWholePrice());
			d.setStopFlag(drugInfo.getStopFlag());
			
			d.setCreateOper(user.getName());
			d.setCreateOperId(user.getId());
			d.setCreateTime(now);
			d.setUpdateOper(user.getName());
			d.setUpdateOperId(user.getId());
			d.setUpdateTime(now);
			phaDrugPriceManager.save(d);
		}
	}
	
}
