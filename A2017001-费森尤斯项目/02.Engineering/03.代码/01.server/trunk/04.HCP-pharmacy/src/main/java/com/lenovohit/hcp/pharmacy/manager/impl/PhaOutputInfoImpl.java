package com.lenovohit.hcp.pharmacy.manager.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.pharmacy.manager.PhaOutputInfoManager;
import com.lenovohit.hcp.pharmacy.manager.PhaStoreManager;
import com.lenovohit.hcp.pharmacy.model.PhaInputInfo;
import com.lenovohit.hcp.pharmacy.model.PhaOutputInfo;

@Service
@Transactional
public class PhaOutputInfoImpl implements PhaOutputInfoManager {

	@Autowired
	private GenericManager<PhaOutputInfo, String> phaOutputInfoManager;

	@Autowired
	private PhaStoreManager phaStoreManager;

	@Override
	public List<PhaInputInfo> createOutputInfo(List<PhaOutputInfo> phaOutputInfos, HcpUser hcpUser) {

		List<PhaInputInfo> inputList = new ArrayList<PhaInputInfo>();
		Date now =  new Date();
		for( PhaOutputInfo model : phaOutputInfos ){
			PhaInputInfo input = new PhaInputInfo();
			if( model==null || StringUtils.isBlank(model.getId())){
				throw new RuntimeException("数据不合法：出库单Id不能为空");
			}
			model.setUpdateOper(hcpUser.getName());
			model.setUpdateTime(now);
			this.phaOutputInfoManager.save(model);
			
			input.setHosId(model.getHosId());
			input.setDeptId(model.getToDept().getId());
			input.setInType("I3");
			input.setDrugInfo(model.getDrugInfo());
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
		
		phaStoreManager.phaInput(inputList, hcpUser);
		
		return inputList;
	}

}
