package com.lenovohit.hcp.pharmacy.manager.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.pharmacy.manager.PhaOutStockCheckManger;
import com.lenovohit.hcp.pharmacy.manager.PhaStoreManager;
import com.lenovohit.hcp.pharmacy.model.PhaApplyIn;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaOutputInfo;

@Service
@Transactional
public class PhaOutStockCheckManagerImpl implements PhaOutStockCheckManger {
	
	@Autowired
	private GenericManager<PhaApplyIn, String> phaApplyInManager;
	@Autowired
	private IRedisSequenceManager redisSequenceManager;
	@Autowired
	private PhaStoreManager phaStoreManager;
	

	@Override
	public void phaOutCheck(String appBill, String comm, HcpUser hcpUser) {
		List<PhaApplyIn> appList=LoadApplyInListByAppBill(appBill);
		List<PhaOutputInfo> outStockList= MakeOutStockList(comm, hcpUser, appList);
		try {
			phaStoreManager.phaOutput(outStockList, hcpUser);
			updateAppInDetail(appBill, comm, hcpUser);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e.getMessage());
		}
	}

	private void updateAppInDetail(String appBill,String comm,HcpUser hcpUser){
		StringBuilder jql = new StringBuilder( " update PHA_APPLYIN set CHECK_OPER = ?,CHECK_TIME = ?,APP_STATE = ?,COMM = ? where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		values.add(hcpUser.getName());
		Date date=new Date();
		values.add(date);
		values.add("3");
		
		if(StringUtils.isNotEmpty(comm)){
			values.add(comm);	
		}else{
			values.add(null);	
		}
		
		jql.append(" And HOS_ID = ?");
		values.add(hcpUser.getHosId());
		jql.append(" And FROM_DEPT_ID = ?");
		values.add(hcpUser.getLoginDepartment().getId());
						
		if(StringUtils.isNotEmpty(appBill)){
			jql.append(" And APP_BILL = ?");
			values.add(appBill);
			
		}
		try {
			phaApplyInManager.executeSql(jql.toString(), values.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e.getMessage());
		}
	}
	
	
	//构造出库outStockList
	private List<PhaOutputInfo> MakeOutStockList(String comm, HcpUser hcpUser, List<PhaApplyIn> appList) {
		List<PhaOutputInfo> outStockList = new ArrayList<PhaOutputInfo>(); 
		int i=0;
		for (PhaApplyIn phaApplyIn : appList) {
			i++;
			PhaOutputInfo outputInfo =new PhaOutputInfo();
			outputInfo.setHosId(phaApplyIn.getHosId());
			outputInfo.setAppBill(phaApplyIn.getAppBill());
			
			String outBill = redisSequenceManager.get("PHA_OUTPUTINFO", "OUT_BILL");//获取出库单号
			if(StringUtils.isNotEmpty(outBill)){
				outputInfo.setOutBill(outBill);
			}
			
			Department deptInfo=new Department();
			deptInfo.setId(hcpUser.getLoginDepartment().getId());
			outputInfo.setDeptInfo(deptInfo);
			
			Department toDept=new Department();
			toDept.setId(phaApplyIn.getDeptId());
			outputInfo.setToDept(toDept);
			
			outputInfo.setOutType("O6");
			outputInfo.setBillNo(i);
			
			PhaDrugInfo drugInfo=new PhaDrugInfo();
			if(StringUtils.isNotBlank(phaApplyIn.getDrugInfo())&& StringUtils.isNotBlank(phaApplyIn.getDrugInfo().getId())){
				drugInfo.setId(phaApplyIn.getDrugInfo().getId());
			}
			outputInfo.setDrugInfo(drugInfo);
			
			outputInfo.setBatchNo(phaApplyIn.getBatchNo());
			outputInfo.setApprovalNo(phaApplyIn.getApprovalNo());
			
			Company companyInfo=new Company();
			companyInfo.setId(phaApplyIn.getCompany());
			outputInfo.setCompanyInfo(companyInfo);
			
			Company producerInfo=new Company();
			producerInfo.setId(phaApplyIn.getProducer());
			outputInfo.setProducerInfo(producerInfo);
			
			outputInfo.setProduceDate(phaApplyIn.getProduceDate());
			outputInfo.setValidDate(phaApplyIn.getValidDate());
			outputInfo.setBuyPrice(phaApplyIn.getBuyPrice());
			outputInfo.setSalePrice(phaApplyIn.getSalePrice());
			outputInfo.setOutSum(phaApplyIn.getAppNum());
			outputInfo.setOutputState("5");
			outputInfo.setComm(comm);
			
			outStockList.add(outputInfo);
		}
		return outStockList;
	}

    //获取请领单明细
	private List<PhaApplyIn> LoadApplyInListByAppBill(String appBill) {
		StringBuilder jql =new StringBuilder();
		List<Object> values=new ArrayList<Object>();
		jql.append(" from PhaApplyIn where appBill = ? ");
		if(!StringUtils.isEmpty(appBill)){
			values.add(appBill);
			List<PhaApplyIn> appList= phaApplyInManager.find(jql.toString(), values.toArray());
			return appList;
		}else{
			throw new RuntimeException("请领单号appBill不能为空！");
		}
	}

}
