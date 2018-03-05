package com.lenovohit.hcp.hrp.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.hrp.manager.InstrmCheckInfoMng;
import com.lenovohit.hcp.hrp.model.InstrmCheckInfo;
import com.lenovohit.hcp.hrp.model.InstrmStoreInfo;

@Service
@Transactional
public class InstrmCheckManagerImpl implements InstrmCheckInfoMng {

	@Autowired
	private GenericManager<InstrmCheckInfo, String> instrmCheckInfoManager;
	@Autowired
	private GenericManager<InstrmStoreInfo, String> instrmStoreInfoManager;
	
	public void updateStockInfo(List<InstrmCheckInfo> checkList, HcpUser user) {
		//更新数据为盘清
		instrmCheckInfoManager.batchSave(checkList);
		//更新库存表
		updateStoreInfo(user,checkList);
	}

	/**    
	 * 功能描述：盘点结束后更新库存表
	 *@param deptId
	 *@param hosId
	 *@param checkList       
	 *@author GW
	 *@date 2017年5月12日             
	*/
	private void updateStoreInfo(HcpUser user, List<InstrmCheckInfo> checkList) {
		String deptId = user.getLoginDepartment().getId();
		String hosId = user.getHosId();
		List<InstrmStoreInfo> storeList = new ArrayList<InstrmStoreInfo>();  
		if(checkList!=null && checkList.size()>0){
			for(InstrmCheckInfo check :checkList){
				if(check.getProfitFlag()!=null && !"0".equals(check.getProfitFlag())){
					String storeId = check.getStoreId();		//库存id
					String instrmInfo = check.getInstrmInfo().getId();	//物资id
					String batchNo = check.getBatchNo();		//批次
					String appNo = check.getApprovalNo();		//批号
					//查询条件列表
					List<Object> values = new ArrayList<Object>();
					StringBuilder jql = new StringBuilder( " from InstrmStoreInfo where stop = '1' ");
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
					if(!StringUtils.isEmpty(instrmInfo)){
						jql.append(" and instrmInfo.id = ?");
						values.add(instrmInfo);
					}
					
					if(!StringUtils.isEmpty(batchNo)){
						jql.append(" and batchNo = ? ");
						values.add(batchNo);
					}
					if(!StringUtils.isEmpty(appNo)){
						jql.append(" and approvalNo = ? ");
						values.add(appNo);
					}
					InstrmStoreInfo storeInfo = instrmStoreInfoManager.findOne(jql.toString(), values.toArray());
					if(storeInfo!=null){
						storeInfo.setStoreSum(check.getWriteSum());
						if(check.getInstrmInfo().getBuyPrice()!=null && check.getInstrmInfo().getSalePrice()!=null){
							storeInfo.setSaleCost(check.getWriteSum().multiply(check.getInstrmInfo().getSalePrice()).setScale(4,BigDecimal.ROUND_HALF_UP));//重新计算金额
							storeInfo.setBuyCost(check.getWriteSum().multiply(check.getInstrmInfo().getBuyPrice()).setScale(4,BigDecimal.ROUND_HALF_UP));//同上
						} else {
							throw new  RuntimeException("购入价（售价）不能为空请到基本信息中维护后操作！");
						}
						storeList.add(storeInfo);
					}
					
				}
			}
			instrmStoreInfoManager.batchSave(storeList);
		}
	}

}
