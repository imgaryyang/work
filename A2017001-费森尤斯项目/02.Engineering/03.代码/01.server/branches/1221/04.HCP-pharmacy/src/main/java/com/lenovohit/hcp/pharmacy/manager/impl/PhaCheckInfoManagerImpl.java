package com.lenovohit.hcp.pharmacy.manager.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.pharmacy.manager.PhaCheckInfoManager;
import com.lenovohit.hcp.pharmacy.model.PhaCheckInfo;
import com.lenovohit.hcp.pharmacy.model.PhaStoreInfo;
import com.lenovohit.hcp.pharmacy.model.PhaStoreSumInfo;

@Service
@Transactional
public class PhaCheckInfoManagerImpl implements PhaCheckInfoManager {

	@Autowired
	private GenericManager<PhaCheckInfo, String> phaCheckInfoManager;
	@Autowired
	private GenericManager<PhaStoreInfo, String> phaStoreInfoManager;
	@Autowired
	private GenericManager<PhaStoreSumInfo, String> phaStoreSumInfoManager;
	
	public void updateStockInfo(List<PhaCheckInfo> checkList, HcpUser user) {
		//更新数据为盘清
		phaCheckInfoManager.batchSave(checkList);
		//更新库存表
		updateStoreInfo(user,checkList);
		updateStoreSumInfo(checkList);
	}

	/**    
	 * 功能描述：盘点结束后更新库存表
	 *@param deptId
	 *@param hosId
	 *@param checkList       
	 *@author GW
	 *@date 2017年5月12日             
	*/
	private void updateStoreInfo(HcpUser user, List<PhaCheckInfo> checkList) {
		String deptId = user.getLoginDepartment().getId();
		String hosId = user.getHosId();
		List<PhaStoreInfo> storeList = new ArrayList<PhaStoreInfo>();  
		if(checkList!=null && checkList.size()>0){
			for(PhaCheckInfo check :checkList){
				if(check.getProfitFlag()!=null && 0!=check.getProfitFlag()){
					String storeId = check.getStoreId();		//库存id
					String drugInfo = check.getDrugInfo().getId();	//物资id
					String batchNo = check.getBatchNo();		//批次
					String appNo = check.getApprovalNo();		//批号
					//查询条件列表
					List<Object> values = new ArrayList<Object>();
					StringBuilder jql = new StringBuilder( " from PhaStoreInfo where stop = '1' ");
					if(!StringUtils.isEmpty(deptId)){
						jql.append(" and deptId = ?");
						values.add(deptId);
					}
					if(!StringUtils.isEmpty(hosId)){
						jql.append(" and hosId = ? ");
						values.add(hosId);
					}
					if(!StringUtils.isEmpty(storeId)){
						jql.append(" and storeId = ?");
						values.add(storeId);
					}
					if(!StringUtils.isEmpty(drugInfo)){
						jql.append(" and drugInfo.id = ?");
						values.add(drugInfo);
					}
					
					if(!StringUtils.isEmpty(batchNo)){
						jql.append(" and batchNo = ? ");
						values.add(batchNo);
					}
					if(!StringUtils.isEmpty(appNo)){
						jql.append(" and approvalNo = ? ");
						values.add(appNo);
					}
					PhaStoreInfo storeInfo = phaStoreInfoManager.findOne(jql.toString(), values.toArray());
					if(storeInfo!=null){
						storeInfo.setStoreSum(check.getWriteSum());
						if(check.getWriteSum().compareTo(BigDecimal.ZERO)!=0){//盘点后库存不为0
							if(check.getDrugInfo().getPackQty()!=null){
								BigDecimal sum = check.getWriteSum().divide(new BigDecimal(check.getDrugInfo().getPackQty()), 4, RoundingMode.HALF_UP);//盘点数量除以包装数量
								if(check.getDrugInfo().getBuyPrice()!=null && check.getDrugInfo().getSalePrice()!=null){
									storeInfo.setSaleCost(check.getDrugInfo().getSalePrice().multiply(sum).setScale(4,BigDecimal.ROUND_HALF_UP));//重新计算金额
									storeInfo.setBuyCost(sum.multiply(check.getDrugInfo().getBuyPrice()).setScale(4,BigDecimal.ROUND_HALF_UP));//同上
								} else {
									throw new  RuntimeException("购入价（售价）不能为空请到基本信息中维护后操作！");
								}
							}else{
								throw new  RuntimeException("包装数量不能为空请到基本信息中维护后操作！");
							}
						}else{
							storeInfo.setSaleCost(new BigDecimal(0));
							storeInfo.setBuyCost(new BigDecimal(0));
						}
						storeList.add(storeInfo);
					}
				}
			}
			phaStoreInfoManager.batchSave(storeList);
		}
	}

	/**    
	 * 功能描述：更新库存汇总信息
	 *@param checkList       
	 *@author GW
	 *@date 2017年5月15日             
	*/
	private void updateStoreSumInfo(List<PhaCheckInfo> checkList) {
		if(checkList!=null && checkList.size()>0){
			//更新汇总信息列表
			List<PhaStoreSumInfo> storeSumList = new ArrayList<PhaStoreSumInfo>();
			for(PhaCheckInfo check :checkList){
				if(check.getProfitFlag()!=null && 0!=check.getProfitFlag()){
					String drugInfo = check.getDrugInfo().getId();	//物资id
					String deptId = check.getDeptId();					//科室（库房）
					String hosId = check.getHosId();					//医院ID
					//查询条件列表
					List<Object> values = new ArrayList<Object>();
					StringBuilder jql = new StringBuilder( " from PhaStoreSumInfo where stop = '1' ");
					if(!StringUtils.isEmpty(deptId)){
						jql.append(" and deptId = ?");
						values.add(deptId);
					}
					if(!StringUtils.isEmpty(hosId)){
						jql.append(" and hosId = ? ");
						values.add(hosId);
					}
					if(!StringUtils.isEmpty(drugInfo)){
						jql.append(" and drugInfo.id = ?");
						values.add(drugInfo);
					}
					
					PhaStoreSumInfo storeSumInfo = phaStoreSumInfoManager.findOne(jql.toString(), values.toArray());
					if(storeSumInfo!=null){//汇总表中存在该项信息
						//查询条件列表
						List<Object> storeValues = new ArrayList<Object>();
						StringBuilder jqlInfo = new StringBuilder( " from PhaStoreInfo where stop = '1' ");
						if(!StringUtils.isEmpty(deptId)){
							jqlInfo.append(" and deptId = ?");
							storeValues.add(deptId);
						}
						if(!StringUtils.isEmpty(hosId)){
							jqlInfo.append(" and hosId = ? ");
							storeValues.add(hosId);
						}
						if(!StringUtils.isEmpty(drugInfo)){
							jqlInfo.append(" and drugInfo.id = ?");
							storeValues.add(drugInfo);
						}
						List<PhaStoreInfo> storeInfoList = phaStoreInfoManager.find(jqlInfo.toString(), storeValues.toArray());
						if(storeInfoList!=null && storeInfoList.size()>0){//库存中存在此种物资
							BigDecimal storeSum = new BigDecimal(0);
							for(PhaStoreInfo store:storeInfoList){
								if(store.getStoreSum()!=null){//库存明细中存在
									storeSum = storeSum.add(store.getStoreSum());
								}
							}
							storeSumInfo.setStoreSum(storeSum);
							if(check.getWriteSum().compareTo(BigDecimal.ZERO)!=0){//盘点后库存不为0
								if(check.getDrugInfo().getPackQty()!=null){
									BigDecimal sum = check.getWriteSum().divide(new BigDecimal(check.getDrugInfo().getPackQty()), 4, RoundingMode.HALF_UP);//盘点数量除以包装数量
									if(check.getDrugInfo().getBuyPrice()!=null && check.getDrugInfo().getSalePrice()!=null){
										storeSumInfo.setSaleCost(check.getDrugInfo().getSalePrice().multiply(sum).setScale(4,BigDecimal.ROUND_HALF_UP));//重新计算金额
										storeSumInfo.setBuyCost(sum.multiply(check.getDrugInfo().getBuyPrice()).setScale(4,BigDecimal.ROUND_HALF_UP));//同上
									} else {
										throw new  RuntimeException("购入价（售价）不能为空请到基本信息中维护后操作！");
									}
								}else{
									throw new  RuntimeException("包装数量不能为空请到基本信息中维护后操作！");
								}
							}else{
								storeSumInfo.setSaleCost(new BigDecimal(0));
								storeSumInfo.setBuyCost(new BigDecimal(0));
							}
							storeSumList.add(storeSumInfo);
						}
					}
				}
			}
			phaStoreSumInfoManager.batchSave(storeSumList);
		}
	}
	
}
