package com.lenovohit.hcp.pharmacy.manager.impl;

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
import com.lenovohit.hcp.pharmacy.manager.PhaBuyBillManager;
import com.lenovohit.hcp.pharmacy.manager.PhaStoreManager;
import com.lenovohit.hcp.pharmacy.model.PhaBuyBill;
import com.lenovohit.hcp.pharmacy.model.PhaBuyDetail;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaInputInfo;

@Service
@Transactional
public class PhaBuyBillManagerImpl implements PhaBuyBillManager {

	@Autowired
	private GenericManager<PhaBuyBill, String> phaBuyBillManager;
	@Autowired
	private GenericManager<PhaBuyDetail, String> phaBuyDetailManager;
	@Autowired
	private GenericManager<PhaDrugInfo, String> phaDrugInfoManager;
	@Autowired
	private IRedisSequenceManager redisSequenceManager;
	
	@Autowired
	private PhaStoreManager phaStoreManager;

	@Override
	public void createBuyBill(PhaBuyBill phaBuyBill, HcpUser hcpUser) {
		
		Date now =  new Date();
		if( StringUtils.isEmpty(phaBuyBill.getId())){
			phaBuyBill.setCreateOper(hcpUser.getName());
			phaBuyBill.setCreateTime(now);
			phaBuyBill.setUpdateTime(now);
		}
		phaBuyBill.setUpdateOper(hcpUser.getName());
		phaBuyBill.setUpdateTime(now);
		if( StringUtils.isEmpty(phaBuyBill.getId())){
			String buyBill = redisSequenceManager.get("PHA_BUYBILL", "BUY_BILL");
			System.out.println("buyBill："+buyBill);
			phaBuyBill.setBuyBill(buyBill);
		}
		this.phaBuyBillManager.save(phaBuyBill);
		System.out.println("phaBuyBill.getBuyDetail().size() :"+phaBuyBill.getBuyDetail().size());
		System.out.println("phaBuyBill :"+phaBuyBill.getId());
		List<PhaBuyDetail> ps = phaBuyBill.getBuyDetail();
		for( PhaBuyDetail p : ps)
		{
			PhaDrugInfo drugInfo = phaDrugInfoManager.get(p.getDrugInfo().getId());
			System.out.println(p.getDrugInfo());
			p.setMinUnit(drugInfo.getMiniUnit());
			p.setSalePrice(drugInfo.getSalePrice());
			p.setSaleCose( p.getSalePrice().multiply(new BigDecimal( p.getBuyNum())));
			p.setDrugType(drugInfo.getDrugType());
			System.out.println("明细表："+ drugInfo.getMiniUnit()+"|"+drugInfo.getSalePrice()+"|"+drugInfo.getDrugType());
			p.setCreateTime(now);
			p.setUpdateTime(now);
			p.setBuyBill(phaBuyBill.getBuyBill());
			p.setPhaBuyBill(phaBuyBill);
			this.phaBuyDetailManager.save(p);
		}
//		this.phaBuyDetailManager.batchSave(ps);
	}

	public void doProcureInstock(PhaBuyBill model, HcpUser user){
		
		PhaBuyBill newModel= this.phaBuyBillManager.get(model.getId());
		Date now =  new Date();
		//HcpUser user = this.getCurrentUser();
		if(newModel.getBuyState().equals("1") && model.getBuyState().equals("2")){
		  newModel.setAuitdOper(user.getName());
		  newModel.setAuitdTime(now);
		}
		if(!StringUtils.isEmpty(model.getBuyCost())){
			newModel.setBuyCost(model.getBuyCost());
		}
		if(!StringUtils.isEmpty(model.getCompany())){
			newModel.setCompany(model.getCompany());
		}
		newModel.setUpdateOper(user.getName());
		newModel.setUpdateTime(now);
		newModel.setBuyState(model.getBuyState());
		this.phaBuyBillManager.save(newModel);
		
		List<PhaInputInfo> inputList =  model.getInputInfos();
		List<PhaInputInfo> returnInputList = phaStoreManager.phaInput(inputList, user);
		
		List<PhaBuyDetail> buyDetails = model.getBuyDetail();
		
		for (PhaBuyDetail buyDetailTmp : buyDetails){
  		  for(PhaInputInfo inputInfoTmp : returnInputList){
  			  if (inputInfoTmp.getDrugInfo().getId() == buyDetailTmp.getDrugInfo().getId()){
  				
  				buyDetailTmp.setBatchNo(inputInfoTmp.getBatchNo());
  			  }
  		  }
  	    }		
		
		for( PhaBuyDetail detailModel : buyDetails ){
			System.out.println("detailModel.getId():" + detailModel.getId());
			if( StringUtils.isEmpty(detailModel.getId())){
				detailModel.setCreateOper(user.getName());
				detailModel.setCreateTime(now);
			}
			detailModel.setUpdateOper(user.getName());
			detailModel.setUpdateTime(now);
		}
		System.out.println("====batchSave======");
		this.phaBuyDetailManager.batchSave(buyDetails);
	}
}
