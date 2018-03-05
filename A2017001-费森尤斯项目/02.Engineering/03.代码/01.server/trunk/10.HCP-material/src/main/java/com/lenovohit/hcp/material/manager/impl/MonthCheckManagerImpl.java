package com.lenovohit.hcp.material.manager.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.BeanUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.material.manager.MonthCheckManager;
import com.lenovohit.hcp.material.model.MatMonthCheck;
import com.lenovohit.hcp.material.model.MatStoreInfo;

@Service
@Transactional
public class MonthCheckManagerImpl implements MonthCheckManager {

	@Autowired
	private GenericManager<MatMonthCheck, String> matMonthCheckManager;
	@Autowired
	private GenericManager<MatStoreInfo, String> matStoreInfoManager;
	
	@Override
	public String addMonthCheck(HcpUser user) {
		String msg = null;
		if(user!=null){
			List<MatStoreInfo> storeList = matStoreInfoManager.findByProp("hosId", user.getHosId());
			if(storeList!=null && storeList.size()>0){
				//将物资库存信息快照到月结表中
				msg = copyStoreToMonthCheck(storeList,user);
			}else{
				msg="当前医院无物资库存信息！";
			}
		}else{
			msg = "无法获取当前登陆用户信息！";
		}
		return msg;
	}

	/**    
	 * 功能描述：将物资库存信息快照到月结表中
	 *@param storeList       
	 *@author GW
	 *@date 2017年8月7日             
	*/
	private String copyStoreToMonthCheck(List<MatStoreInfo> storeList,HcpUser user) {
		List<MatMonthCheck> monthCheckList = new ArrayList<MatMonthCheck>();
		String msg = null;
		if(storeList!=null && storeList.size()>0){
			Date date = new Date();				//创建时间
			String userName = user.getName();	//用户名
			String userId = user.getId();		//用户id
			for(MatStoreInfo store:storeList){
				MatMonthCheck monthCheck = new MatMonthCheck();
				//将库存信息拷贝到月结中
				BeanUtils.copyProperties(store, monthCheck);
				//更新月结表中创建时间和创建人信息
				monthCheck.setId(null);
				monthCheck.setCreateTime(date);
				monthCheck.setCreateOper(userName);
				monthCheck.setCreateOperId(userId);
				monthCheck.setUpdateTime(date);
				monthCheck.setUpdateOper(userName);
				monthCheck.setUpdateOperId(userId);
				monthCheck.setMonthcheckTime(date);
				monthCheck.setMonthcheckOpera(userName);
				monthCheckList.add(monthCheck);
			}
			matMonthCheckManager.batchSave(monthCheckList);
		}else{
			msg="本院不存在";
		}
		return msg;
	}

	@Override
	public List<Date> findMonthCheckTime() {
		StringBuilder jql = new StringBuilder( "select DISTINCT MONTHCHECK_TIME from MATERIAL_MONTHCHECK ORDER BY MONTHCHECK_TIME");
		List<Date> dateList = (List<Date>) matMonthCheckManager.findBySql(jql.toString());
		return dateList;
	}
	
}
