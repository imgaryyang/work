package com.lenovohit.hcp.pharmacy.manager;

import java.util.List;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.pharmacy.model.PhaInputInfo;
import com.lenovohit.hcp.pharmacy.model.PhaOutputInfo;

/**
 * 
 * @description 结账统一接口
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月17日
 */
public interface PhaStoreManager {
	/* 入库 */
	List<PhaInputInfo> phaInput(List<PhaInputInfo> inputList, HcpUser hcpUser);
	/* 出库 */
	void phaOutput(List<PhaOutputInfo> outputList, HcpUser hcpUser);
	/* 发药出库-不按批次批号扣库存明细，而是循环先进先出 */
	void dispenseOutput(List<PhaOutputInfo> outputList, HcpUser hcpUser);
}
