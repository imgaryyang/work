package com.lenovohit.hcp.material.manager.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.material.manager.MatInfoRestManager;
import com.lenovohit.hcp.material.model.MatInfo;
import com.lenovohit.hcp.material.model.MatPrice;
@Service
@Transactional
public class MatInfoRestManagerImpl implements MatInfoRestManager {
	
	@Autowired
	private GenericManager<MatInfo, String> matInfoManager;
	@Autowired
	private GenericManager<MatPrice, String> matPriceManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;

	/**
	 * 子医院新增物资价格信息
	 */
	@Override
	public MatInfo createMatInfo(MatInfo matInfo, HcpUser user) {
		// TODO 校验
		MatInfo saved = this.matInfoManager.save(matInfo);
		
		//将价格保存物资价格表
		StringBuilder jql = new StringBuilder("from MatPrice where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		jql.append("and hosId = ? ");
		values.add(user.getHosId());
		jql.append("and matInfo.id = ? ");
		values.add(saved.getId());
		List<MatPrice> priceList = matPriceManager.find(jql.toString(), values.toArray());
		MatPrice price = null;
		if(priceList!=null && priceList.size()>0){
			price = priceList.get(0);
		}
		this.matPriceManager.save(converTo(matInfo,price,user));
		return saved;
	}
	/**
	 * 当集团新增物资基本信息时，对各个下级医院也新增相应的物资价格信息
	 */
	@Override
	public MatInfo createMatInfoGroup(MatInfo matInfo, HcpUser user) {
		// TODO 校验
		MatInfo saved = this.matInfoManager.save(matInfo);
		
		//将价格保存物资价格表
		StringBuilder jql = new StringBuilder("from MatPrice where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		jql.append("and hosId = ? ");
		values.add(user.getHosId());
		
		jql.append("and matInfo.id = ? ");
		values.add(saved.getId());
		
		MatPrice price = matPriceManager.findOne(jql.toString(), values.toArray());
		this.matPriceManager.save(converTo(matInfo,price,user));
		//当集团新增物资基本信息时，对各个下级医院也新增相应的物资价格信息
		this.createMatInfoPrice(saved, user);
		return saved;
	}
	
	/**
	 * 
	 * @param matInfo
	 * @return
	 */
	public MatPrice converTo(MatInfo matInfo, MatPrice price ,HcpUser user){
		if(price == null){
			price = new MatPrice();
		}
		price.setMatInfo(matInfo);
		price.setMaterialCode(matInfo.getMaterialCode());
		price.setCenterCode(matInfo.getCenterCode());
		price.setBuyPrice(matInfo.getBuyPrice());
		price.setWholePrice(matInfo.getWholePrice());
		price.setSalePrice(matInfo.getSalePrice());
		price.setTaxBuyPrice(matInfo.getTaxBuyPrice());
		price.setTaxSalePrice(matInfo.getTaxSalePrice());
		price.setStopFlag(matInfo.getStopFlag());
		price.setItemCode(matInfo.getItemCode());
		price.setFeeFlag(matInfo.getFeeFlag());
		price.setHosId(user.getHosId());
	    return price;
	}
	
	/**
	 * 当集团新增物资基本信息时，对各个下级医院也新增相应的物资价格信息
	 * @param matInfo
	 * @param user
	 */
	private void createMatInfoPrice(MatInfo matInfo, HcpUser user){
		Date now = new Date();
		//1、获取集团下所有的下级医院
		StringBuilder jql = new StringBuilder("from Hospital where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		jql.append("and hosId != ? ");
		values.add(user.getHosId());
		List<Hospital> hospitals = hospitalManager.find(jql.toString(), values.toArray());
		//2、对每个下级医院新增相应的药品价格信息
		for(Hospital hos : hospitals){
			MatPrice d = new MatPrice();
			d.setHosId(hos.getHosId());
			d.setMaterialCode(matInfo.getMaterialCode());
			d.setMatInfo(matInfo);
			d.setCenterCode(matInfo.getCenterCode());
			d.setBuyPrice(matInfo.getBuyPrice());
			d.setSalePrice(matInfo.getSalePrice());
			d.setTaxBuyPrice(matInfo.getTaxBuyPrice());
			d.setTaxSalePrice(matInfo.getTaxSalePrice());
			d.setWholePrice(matInfo.getWholePrice());
			d.setStopFlag(matInfo.getStopFlag());
			
			d.setCreateOper(user.getName());
			d.setCreateOperId(user.getId());
			d.setCreateTime(now);
			d.setUpdateOper(user.getName());
			d.setUpdateOperId(user.getId());
			d.setUpdateTime(now);
			matPriceManager.save(d);
		}
		
	}

}
