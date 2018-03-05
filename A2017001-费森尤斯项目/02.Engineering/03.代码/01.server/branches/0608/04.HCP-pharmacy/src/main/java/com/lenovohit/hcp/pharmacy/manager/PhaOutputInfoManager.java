package com.lenovohit.hcp.pharmacy.manager;

import java.util.List;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.pharmacy.model.PhaOutputInfo;

/**
 * 
 * @description 
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月17日
 */
public interface PhaOutputInfoManager {
	/* 生成采购订单 */
	void createOutputInfo(List<PhaOutputInfo> phaOutputInfos, HcpUser hcpUser);
}
