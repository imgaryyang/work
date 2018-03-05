package com.lenovohit.hcp.material.manager;

import java.util.List;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.material.model.MatOutputInfo;

/**
 * 
 * @description 
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月17日
 */
public interface MatOutputInfoManager {
	/* 生成采购订单 */
	void createOutputInfo(List<MatOutputInfo> matOutputInfos, HcpUser hcpUser);
}
