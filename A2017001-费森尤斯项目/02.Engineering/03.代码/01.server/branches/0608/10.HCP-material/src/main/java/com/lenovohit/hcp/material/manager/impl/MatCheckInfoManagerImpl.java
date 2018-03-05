package com.lenovohit.hcp.material.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.material.manager.MatCheckinfoManager;
import com.lenovohit.hcp.material.model.MatCheckInfo;
import com.lenovohit.hcp.material.model.MatStoreInfo;
import com.lenovohit.hcp.material.model.MatStoreSumInfo;

@Service
@Transactional
public class MatCheckInfoManagerImpl implements MatCheckinfoManager {

	@Autowired
	private GenericManager<MatCheckInfo, String> matCheckInfoManager;
	@Autowired
	private GenericManager<MatStoreInfo, String> matStoreInfoManager;
	@Autowired
	private GenericManager<MatStoreSumInfo, String> matStoreSumInfoManager;
	
	@Override
	public void updateStockInfo(List<MatCheckInfo> checkList, HcpUser user) {
		//更新数据为盘清
		matCheckInfoManager.batchSave(checkList);
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
	private void updateStoreInfo(HcpUser user, List<MatCheckInfo> checkList) {
		String deptId = user.getLoginDepartment().getId();
		String hosId = user.getHosId();
		List<MatStoreInfo> storeList = new ArrayList<MatStoreInfo>();  
		if(checkList!=null && checkList.size()>0){
			for(MatCheckInfo check :checkList){
				if(check.getProfitFlag()!=null && !"0".equals(check.getProfitFlag())){
					String storeId = check.getStoreId();		//库存id
					String storeMaterialId = check.getMaterialInfo().getId();	//物资id
					String batchNo = check.getBatchNo();		//批次
					String appNo = check.getApprovalNo();		//批号
					//查询条件列表
					List<Object> values = new ArrayList<Object>();
					StringBuilder jql = new StringBuilder( " from MatStoreInfo where stop = '1' ");
					if(!StringUtils.isEmpty(deptId)){
						jql.append(" and deptId = ?");
						values.add(deptId);
					}
					if(!StringUtils.isEmpty(hosId)){
						jql.append(" and hosId = ?");
						values.add(hosId);
					}
					if(!StringUtils.isEmpty(storeId)){
						jql.append(" and storeId = ?");
						values.add(storeId);
					}
					if(!StringUtils.isEmpty(storeMaterialId)){
						jql.append(" and materialInfo.id = ?");
						values.add(storeMaterialId);
					}
					
					if(!StringUtils.isEmpty(batchNo)){
						jql.append(" and batchNo = ? ");
						values.add(batchNo);
					}
					if(!StringUtils.isEmpty(appNo)){
						jql.append(" and approvalNo = ? ");
						values.add(appNo);
					}
					MatStoreInfo storeInfo = matStoreInfoManager.findOne(jql.toString(), values.toArray());
					if(storeInfo!=null){
						storeInfo.setStoreSum(check.getWriteSum());
						if(check.getMaterialInfo().getBuyPrice()!=null && check.getMaterialInfo().getSalePrice()!=null){
							storeInfo.setSaleCost(check.getWriteSum().multiply(check.getMaterialInfo().getSalePrice()).setScale(4,BigDecimal.ROUND_HALF_UP));//重新计算金额
							storeInfo.setBuyCost(check.getWriteSum().multiply(check.getMaterialInfo().getBuyPrice()).setScale(4,BigDecimal.ROUND_HALF_UP));//同上
						} else {
							throw new  RuntimeException("购入价（售价）不能为空请到基本信息中维护后操作！");
						}
						storeList.add(storeInfo);
					}
					
				}
			}
			matStoreInfoManager.batchSave(storeList);
		}
	}

	/**    
	 * 功能描述：更新库存汇总信息
	 *@param checkList       
	 *@author GW
	 *@date 2017年5月15日             
	*/
	private void updateStoreSumInfo(List<MatCheckInfo> checkList) {
		if(checkList!=null && checkList.size()>0){
			//更新汇总信息列表
			List<MatStoreSumInfo> storeSumList = new ArrayList<MatStoreSumInfo>();
			for(MatCheckInfo check :checkList){
				if(check.getProfitFlag()!=null && !"0".equals(check.getProfitFlag())){
					String storeMatId = check.getMaterialInfo().getId();	//物资id
					String deptId = check.getDeptId();					//科室（库房）
					String hosId = check.getHosId();					//医院ID
					//查询条件列表
					List<Object> values = new ArrayList<Object>();
					StringBuilder jql = new StringBuilder( " from MatStoreSumInfo where stop = '1' ");
					if(!StringUtils.isEmpty(deptId)){
						jql.append(" and deptId = ?");
						values.add(deptId);
					}
					if(!StringUtils.isEmpty(hosId)){
						jql.append(" and hosId = ?");
						values.add(hosId);
					}
					if(!StringUtils.isEmpty(storeMatId)){
						jql.append(" and materialInfo.id = ?");
						values.add(storeMatId);
					}
					
					MatStoreSumInfo storeSumInfo = matStoreSumInfoManager.findOne(jql.toString(), values.toArray());
					if(storeSumInfo!=null){//汇总表中存在该项信息
						//查询条件列表
						List<Object> storeValues = new ArrayList<Object>();
						StringBuilder jqlInfo = new StringBuilder( " from MatStoreInfo where stop = '1' ");
						if(!StringUtils.isEmpty(deptId)){
							jqlInfo.append(" and deptId = ?");
							storeValues.add(deptId);
						}
						if(!StringUtils.isEmpty(hosId)){
							jqlInfo.append(" and hosId = ?");
							storeValues.add(hosId);
						}
						if(!StringUtils.isEmpty(storeMatId)){
							jqlInfo.append(" and materialInfo.id = ?");
							storeValues.add(storeMatId);
						}
						List<MatStoreInfo> storeInfoList = matStoreInfoManager.find(jqlInfo.toString(), storeValues.toArray());
						if(storeInfoList!=null && storeInfoList.size()>0){//库存中存在此种物资
							BigDecimal storeSum = new BigDecimal(0);
							for(MatStoreInfo store:storeInfoList){
								if(store.getStoreSum()!=null){//库存明细中存在
									storeSum = storeSum.add(store.getStoreSum());
								}
							}
							storeSumInfo.setStoreSum(storeSum);
							if(check.getMaterialInfo().getBuyPrice()!=null && check.getMaterialInfo().getSalePrice()!=null){
								storeSumInfo.setSaleCost(check.getWriteSum().multiply(check.getMaterialInfo().getSalePrice()).setScale(4,BigDecimal.ROUND_HALF_UP));//重新计算金额
								storeSumInfo.setBuyCost(check.getWriteSum().multiply(check.getMaterialInfo().getBuyPrice()).setScale(4,BigDecimal.ROUND_HALF_UP));//同上
							} else {
								throw new  RuntimeException("购入价（售价）不能为空请到基本信息中维护后操作！");
							}
							storeSumList.add(storeSumInfo);
						}
					}
				}
			}
			matStoreSumInfoManager.batchSave(storeSumList);
		}
	}
	
}
