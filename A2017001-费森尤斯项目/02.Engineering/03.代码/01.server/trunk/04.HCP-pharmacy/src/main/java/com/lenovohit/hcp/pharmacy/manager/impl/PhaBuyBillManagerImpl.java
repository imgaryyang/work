package com.lenovohit.hcp.pharmacy.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.pharmacy.manager.PhaBuyBillManager;
import com.lenovohit.hcp.pharmacy.manager.PhaStoreManager;
import com.lenovohit.hcp.pharmacy.model.PhaActualBuy;
import com.lenovohit.hcp.pharmacy.model.PhaBuyBill;
import com.lenovohit.hcp.pharmacy.model.PhaBuyDetail;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaDrugPriceView;
import com.lenovohit.hcp.pharmacy.model.PhaInputInfo;

@Service
@Transactional
public class PhaBuyBillManagerImpl implements PhaBuyBillManager {
	
	private static Log log = LogFactory.getLog(PhaBuyBillManagerImpl.class);

	@Autowired
	private GenericManager<PhaBuyBill, String> phaBuyBillManager;
	@Autowired
	private GenericManager<PhaBuyDetail, String> phaBuyDetailManager;
	@Autowired
	private GenericManager<PhaDrugPriceView, String> phaDrugPriceViewManager;
	@Autowired
	private IRedisSequenceManager redisSequenceManager;
	@Autowired
	private GenericManager<PhaActualBuy, String> phaActualBuyManager;
	
	@Autowired
	private PhaStoreManager phaStoreManager;

	@Override
	public PhaBuyBill createBuyBill(PhaBuyBill phaBuyBill, HcpUser hcpUser) {
		
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
			//PhaDrugInfo drugInfo = phaDrugInfoManager.get(p.getDrugInfo().getId());
			StringBuilder jql = new StringBuilder("from PhaDrugPriceView where id = ? and pHosId= ? ");
			List<Object> values = new ArrayList<Object>();
			values.add(p.getDrugInfo().getId());
			values.add(hcpUser.getHosId());
			PhaDrugPriceView drugInfo = phaDrugPriceViewManager.findOne(jql.toString(), values.toArray());
			System.out.println(p.getDrugInfo());
			p.setMinUnit(drugInfo.getMiniUnit());
			p.setSalePrice(drugInfo.getSalePrice());
			if(p.getSalePrice()!=null && p.getBuyPrice()!=null){
				p.setSaleCose( p.getSalePrice().multiply(new BigDecimal( p.getBuyNum())));
			}else{
				log.error(DateUtils.date2String(new Date(), "yyyy-MM-dd hh:mm:ss")+hcpUser.getName()+"药品采购入库：");
				log.error(p.getTradeName()+":零售价不能为空");
				throw new RuntimeException(p.getTradeName()+":零售价不能为空");
			}
			p.setDrugType(drugInfo.getDrugType());
			System.out.println("明细表："+ drugInfo.getMiniUnit()+"|"+drugInfo.getSalePrice()+"|"+drugInfo.getDrugType());
			p.setCreateTime(now);
			p.setUpdateTime(now);
			p.setBuyBill(phaBuyBill.getBuyBill());
			p.setPhaBuyBill(phaBuyBill);
			this.phaBuyDetailManager.save(p);
		}
//		this.phaBuyDetailManager.batchSave(ps);
		
		return phaBuyBill;
	}

	public String doProcureInstock(PhaBuyBill model, HcpUser user){
		String inBill = "";
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
		
		
		List<PhaInputInfo> inputList =  model.getInputInfos();
		List<PhaInputInfo> returnInputList = phaStoreManager.phaInput(inputList, user);
		
		List<PhaBuyDetail> buyDetails = model.getBuyDetail();
		int flag = 0;   //是否按照采购计划入库标识
		for (PhaBuyDetail buyDetailTmp : buyDetails){
		  BigDecimal num = new BigDecimal(0);
		  BigDecimal inputnum = new BigDecimal(0);
		  
		  //加入实际入库信息表
		  PhaActualBuy buy = null;
		  
		  List<Object> values = new ArrayList<Object>();
		  StringBuilder jql = new StringBuilder( " from PhaActualBuy where detailId = ? ");
		  values.add(buyDetailTmp.getId());
		  buy= phaActualBuyManager.findOne(jql.toString(), values);
  		  for(PhaInputInfo inputInfoTmp : returnInputList){
  			  if(inputInfoTmp!=null && inputInfoTmp.getInBill()!=null){
  				  inBill = inputInfoTmp.getInBill();
  			  } else{
  				  log.error(new Date() +"采购核准入库失败：Redis服务器通讯失败");
  				  throw new RuntimeException("Redis服务器通讯失败");
  			  }
  			  if (buyDetailTmp.getDrugInfo().getId().equals(inputInfoTmp.getDrugInfo().getId())){
  				buyDetailTmp.setBatchNo(inputInfoTmp.getBatchNo());
  				
  			    inputnum = new BigDecimal(inputInfoTmp.getComm());
  			    if(buy!=null){
  			       num = buy.getBuyNum().subtract(inputnum);
  			    }else{
  			       num = new BigDecimal(buyDetailTmp.getAuitdNum()).subtract(inputnum);
  			    }
			    num = num.compareTo(BigDecimal.ZERO)>=0?num:BigDecimal.ZERO;
  			  }
  			  
  		  }
  		  System.out.println("detailModel.getId():" + buyDetailTmp.getId());
		  if( StringUtils.isEmpty(buyDetailTmp.getId())){
			  buyDetailTmp.setCreateOper(user.getName());
			  buyDetailTmp.setCreateTime(now);
		  }
		  
		  
		  if(buy!=null){
			  buy.setBuyNum(num);
		  }else{
			  buy = new PhaActualBuy();
			  buy.setBillId(model.getId());
			  buy.setDetailId(buyDetailTmp.getId());
			  buy.setBuyNum(num);
		  }
		  phaActualBuyManager.save(buy);
		  //入库标识且计划数量减去实际购买数量只差等于0时，才能修改为已入库状态
		  
		  if("instock".equals(model.getBuyState())&&buy.getBuyNum().compareTo(BigDecimal.ZERO)!=0){
			  flag++;
		  }
		  buyDetailTmp.setUpdateOper(user.getName());
		  buyDetailTmp.setUpdateTime(now);
  	    }		
		
		System.out.println("====batchSave======");
		this.phaBuyDetailManager.batchSave(buyDetails);
		
		if(flag==0){
			newModel.setBuyState("4");
		}
		this.phaBuyBillManager.save(newModel);
		return inBill;
	}
}
