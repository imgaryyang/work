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
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.pharmacy.manager.PhaAdjustManager;
import com.lenovohit.hcp.pharmacy.model.PhaAdjust;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaStoreInfo;
import com.lenovohit.hcp.pharmacy.model.PhaStoreSumInfo;

@Service
@Transactional
public class PhaAdjustManagerImpl implements PhaAdjustManager {

	@Autowired
	private GenericManager<PhaAdjust, String> phaAdjustManager;
	
	@Autowired
	private GenericManager<PhaDrugInfo, String> phaDrugInfoManager;
	
	@Autowired
	private GenericManager<PhaStoreInfo, String> phaStoreInfoManager;
	
	@Autowired
	private GenericManager<PhaStoreSumInfo, String> phaStoreSumInfoManager;
	
	@Override
	public void create(List<PhaAdjust> adjustList, List<PhaDrugInfo> drugList, HcpUser user) {
		
		List<PhaAdjust> adjusUpdate = new ArrayList<PhaAdjust>();
		List<PhaDrugInfo> drugListUpdate = new ArrayList<PhaDrugInfo>();
		if(adjustList!=null && adjustList.size()>0){
			Date now =  new Date();

			String userName = user.getName();
			String userId = user.getUserId();
			for (int i=0;i<adjustList.size();i++){
				PhaAdjust model =  adjustList.get(i);
				PhaDrugInfo drugInfo = drugList.get(i);
				model.setAdjustState("2");			//已执行状态
				model.setStoreId("0");				//库存id暂时没有任何意义
				model.setStartSale(drugInfo.getSalePrice());//原售价
				model.setStartBuy(drugInfo.getBuyPrice());	//原进价
				model.setSpecs(drugInfo.getDrugSpecs());	//药品规格
				if(model!=null && StringUtils.isNotBlank(model.getEndSale())){
					//更新库存信息表
					updataStoreInfo(model.getDrugCode(),model.getEndSale());
					//更新库存汇总表
					BigDecimal sum = updataStoreSum(model.getDrugCode(),model.getEndSale());
					if(sum!=null && StringUtils.isNotEmpty(sum)){//调价时库存数量
						model.setChargeSum(sum);
					}
					if(model.getEndSale()!=null&&model.getStartSale().compareTo(model.getEndSale())==1){//起始价大于调整后的价格
						model.setProfitFlag(-1);
					}
					drugInfo.setSalePrice(model.getEndSale());	//调整后价格
					drugInfo.setUpdateOper(userName);
					drugInfo.setUpdateOperId(userId);
					drugInfo.setUpdateTime(now);
					//条件单相关值处理
					model.setId(null);//其中保存的值为药品基本信息id
					//更新时间和人员信息保存
					model.setCreateOper(userName);
					model.setCreateOperId(userId);
					model.setCreateTime(now);
					model.setUpdateOper(userName);
					model.setUpdateOperId(userId);
					model.setUpdateTime(now);
					adjusUpdate.add(model);
					drugListUpdate.add(drugInfo);
				}
			}
		}
		this.phaAdjustManager.batchSave(adjusUpdate);
		this.phaDrugInfoManager.batchSave(drugListUpdate);
	}

	/**    
	 * 功能描述：修改库存中药品价格
	 *@param drugCode
	 *@param salePrice
	 *@return       
	 *@author gw
	 *@date 2017年4月18日             
	*/
	private void updataStoreInfo(String drugCode, BigDecimal salePrice) {
		if(StringUtils.isNotEmpty(salePrice)){//当调价为空时不更新库存中药品价格
			StringBuilder jql = new StringBuilder();
			List<Object> values = new ArrayList<Object>();
			jql.append("from PhaStoreInfo store where  store.drugCode = ? ");
			values.add(drugCode);
			//根据用品编码查询库存信息
			List<PhaStoreInfo> storeInfoList =  (List<PhaStoreInfo>) phaStoreInfoManager.find(jql.toString(), values.toArray());
			if(storeInfoList!=null && storeInfoList.size()>0){
				for(PhaStoreInfo storeInfo:storeInfoList){//循环修改库存表中相关数据
					storeInfo.setSalePrice(salePrice);
				}
				phaStoreInfoManager.batchSave(storeInfoList);
			}
		}
	}
	
	/**    
	 * 功能描述：根据药品编码获取库存汇总相关信息并更新价格
	 *@param drugCode
	 *@param salePrice
	 *@return       
	 *@author gw
	 *@date 2017年4月18日             
	*/
	private BigDecimal updataStoreSum(String drugCode, BigDecimal salePrice) {
		List<PhaStoreSumInfo> storeSumInfoList = null;
		BigDecimal sum = new BigDecimal(0);//库存数量
		if(StringUtils.isNotEmpty(salePrice)){//调价为空时不更新药品价格
			StringBuilder jql = new StringBuilder();
			List<Object> values = new ArrayList<Object>();
			jql.append("from PhaStoreSumInfo where  drugCode = ? ");
			values.add(drugCode);
			storeSumInfoList = phaStoreSumInfoManager.find(jql.toString(), values.toArray());
			if (storeSumInfoList!=null){
				for(PhaStoreSumInfo info :storeSumInfoList){
					sum = sum.add(info.getStoreSum());
					info.setSalePrice(salePrice);
				}
				phaStoreSumInfoManager.batchSave(storeSumInfoList);
			}
		}
		return sum;
	}

}
