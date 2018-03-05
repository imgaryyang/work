package com.lenovohit.hcp.material.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
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
import com.lenovohit.hcp.material.model.MatPriceView;

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
	
	@Autowired
	private GenericManager<MatPriceView, String> matPriceViewManager;

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
			//MatInfo matInfo = matInfoManager.get(p.getMatInfo().getId());
			//获取药品在当前医院的价格
			StringBuilder jql = new StringBuilder("from MatPriceView where 1=1 ");
			List<Object> values = new ArrayList<Object>();

			jql.append("and hosId = ? ");
			values.add(hcpUser.getHosId());
			
			jql.append("and materialId = ? ");
			values.add(p.getMatInfo().getId());
			
			MatPriceView matInfo = matPriceViewManager.findOne(jql.toString(), values.toArray());
			
			//MatPriceView matInfo = matPriceViewManager.get(p.getMatInfo().getId());
			System.out.println(p.getMatInfo());
			p.setSalePrice(matInfo.getSalePrice());
			if(p.getSalePrice()!=null){
				p.setSaleCose( p.getSalePrice().multiply(new BigDecimal( p.getBuyNum())));
			}
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
