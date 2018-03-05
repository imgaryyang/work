package com.lenovohit.hcp.hrp.manager.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.hrp.manager.InstrmOutputInfoMng;
import com.lenovohit.hcp.hrp.manager.InstrmStoreMng;
import com.lenovohit.hcp.hrp.model.InstrmInputInfo;
import com.lenovohit.hcp.hrp.model.InstrmOutputInfo;

@Service
@Transactional
public class InstrmOutputManagerImpl implements InstrmOutputInfoMng {

	@Autowired
	private GenericManager<InstrmOutputInfo, String> instrmOutputInfoManager;

	@Autowired
	private InstrmStoreMng instrmStoreMng;

	@Override
	public void createOutputInfo(List<InstrmOutputInfo> instrmOutputInfos, HcpUser hcpUser) {

		List<InstrmInputInfo> inputList = new ArrayList<InstrmInputInfo>();
		Date now =  new Date();
		for( InstrmOutputInfo model : instrmOutputInfos ){
			InstrmInputInfo input = new InstrmInputInfo();
			if( model==null || StringUtils.isBlank(model.getId())){
				throw new RuntimeException("数据不合法：出库单Id不能为空");
			}
			model.setUpdateOper(hcpUser.getName());
			model.setUpdateTime(now);
			this.instrmOutputInfoManager.save(model);
			
			input.setHosId(model.getHosId());
			input.setDeptId(model.getToDept().getId());
			input.setInType("I3");
			input.setInstrmInfo(model.getInstrmInfo());
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
		
		instrmStoreMng.instrmInput(inputList, hcpUser);
	}

}
