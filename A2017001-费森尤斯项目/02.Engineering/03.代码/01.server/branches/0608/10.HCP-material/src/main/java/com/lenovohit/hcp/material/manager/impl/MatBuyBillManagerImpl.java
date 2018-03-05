package com.lenovohit.hcp.material.manager.impl;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.material.manager.MatBuyBillManager;
import com.lenovohit.hcp.material.model.MatBuyBill;
import com.lenovohit.hcp.material.model.MatBuyDetail;
import com.lenovohit.hcp.material.model.MatInfo;

@Service
@Transactional
public class MatBuyBillManagerImpl implements MatBuyBillManager {

	@Autowired
	private GenericManager<MatBuyBill, String> matBuyBillManager;
	@Autowired
	private GenericManager<MatBuyDetail, String> matBuyDetailManager;
	@Autowired
	private GenericManager<MatInfo, String> matInfoManager;
	@Autowired
	private IRedisSequenceManager redisSequenceManager;

	@Override
	public void createBuyBill(MatBuyBill matBuyBill, HcpUser hcpUser) {
		
		Date now =  new Date();
		if( StringUtils.isEmpty(matBuyBill.getId())){
			matBuyBill.setCreateOper(hcpUser.getName());
			matBuyBill.setCreateTime(now);
			matBuyBill.setUpdateTime(now);
		}
		matBuyBill.setUpdateOper(hcpUser.getName());
		matBuyBill.setUpdateTime(now);
		if( StringUtils.isEmpty(matBuyBill.getId())){
			String buyBill = redisSequenceManager.get("PHA_BUYBILL", "BUY_BILL");
			System.out.println("buyBill："+buyBill);
			matBuyBill.setBuyBill(buyBill);
		}
		this.matBuyBillManager.save(matBuyBill);
		System.out.println("MatBuyBill.getBuyDetail().size() :"+matBuyBill.getBuyDetail().size());
		System.out.println("MatBuyBill :"+matBuyBill.getId());
		List<MatBuyDetail> ps = matBuyBill.getBuyDetail();
		for( MatBuyDetail p : ps)
		{
			MatInfo matInfo = matInfoManager.get(p.getMatInfo().getId());
			System.out.println(p.getMatInfo());
			p.setSalePrice(matInfo.getSalePrice());
			p.setSaleCose( p.getSalePrice().multiply(new BigDecimal( p.getBuyNum())));
			p.setMaterialType(matInfo.getMaterialType());
			System.out.println("明细表："+"|"+p.getSalePrice()+"|"+p.getMaterialCode());
			p.setMaterialCode(matInfo.getMaterialCode());
			p.setCreateTime(now);
			p.setUpdateTime(now);
			p.setBuyBill(matBuyBill.getBuyBill());
			p.setMatBuyBill(matBuyBill);
			this.matBuyDetailManager.save(p);
		}
//		this.MatBuyDetailManager.batchSave(ps);
	}

}
