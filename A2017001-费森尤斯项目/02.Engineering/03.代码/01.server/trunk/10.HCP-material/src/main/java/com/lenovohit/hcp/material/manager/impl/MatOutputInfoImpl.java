package com.lenovohit.hcp.material.manager.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.material.manager.MatOutputInfoManager;
import com.lenovohit.hcp.material.manager.MatStoreManager;
import com.lenovohit.hcp.material.model.MatInputInfo;
import com.lenovohit.hcp.material.model.MatOutputInfo;

@Service
@Transactional
public class MatOutputInfoImpl implements MatOutputInfoManager {

	@Autowired
	private GenericManager<MatOutputInfo, String> matOutputInfoManager;

	@Autowired
	private MatStoreManager matStoreManager;

	@Override
	public void createOutputInfo(List<MatOutputInfo> matOutputInfos, HcpUser hcpUser) {

		List<MatInputInfo> inputList = new ArrayList<MatInputInfo>();
		Date now =  new Date();
		for( MatOutputInfo model : matOutputInfos ){
			MatInputInfo input = new MatInputInfo();
			if( model==null || StringUtils.isBlank(model.getId())){
				throw new RuntimeException("数据不合法：出库单Id不能为空");
			}
			model.setUpdateOper(hcpUser.getName());
			model.setUpdateTime(now);
			this.matOutputInfoManager.save(model);
			
			input.setHosId(model.getHosId());
			input.setDeptId(model.getToDept().getId());
			input.setInType("I3");
			input.setMatInfo(model.getMatInfo());
			input.setBatchNo(model.getBatchNo());
			input.setApprovalNo(model.getApprovalNo());
			input.setProduceDate(model.getProduceDate());
			input.setValidDate(model.getValidDate());
			input.setBuyPrice(model.getBuyPrice());
			input.setSalePrice(model.getSalePrice());
			input.setInSum(model.getOutSum());
			input.setInOper(hcpUser.getName());
			input.setInTime(now);
			input.setInputState("4");
			input.setCompanyInfo(model.getCompanyInfo());
			inputList.add(input);
		}
		
		matStoreManager.matInput(inputList, hcpUser);
	}

}
