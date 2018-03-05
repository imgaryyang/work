package com.lenovohit.hcp.hrp.manager;

import java.util.List;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.hrp.model.InstrmOutputInfo;

/**
 * 
 * @description 
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月17日
 */
public interface InstrmOutputInfoMng {
	/* 生成采购订单 */
	void createOutputInfo(List<InstrmOutputInfo> phaOutputInfos, HcpUser hcpUser);
}
