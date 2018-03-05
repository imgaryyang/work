package com.lenovohit.hcp.hrp.manager;

import java.util.List;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.hrp.model.InstrmInputInfo;
import com.lenovohit.hcp.hrp.model.InstrmOutputInfo;

/**
 * 
 * @description 结账统一接口
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月17日
 */
public interface InstrmStoreMng {
	/* 入库 */
	List<InstrmInputInfo> instrmInput(List<InstrmInputInfo> inputList, HcpUser hcpUser);
	/* 出库 */
	void instrmOutput(List<InstrmOutputInfo> outputList, HcpUser hcpUser);
	/* 发药出库-不按批次批号扣库存明细，而是循环先进先出 */
	void dispenseOutput(List<InstrmOutputInfo> outputList, HcpUser hcpUser);
}
