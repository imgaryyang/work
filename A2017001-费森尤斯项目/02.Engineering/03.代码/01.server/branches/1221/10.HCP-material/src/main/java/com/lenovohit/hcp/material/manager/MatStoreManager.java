package com.lenovohit.hcp.material.manager;

import java.util.List;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.material.model.MatBuyBill;
import com.lenovohit.hcp.material.model.MatInputInfo;
import com.lenovohit.hcp.material.model.MatOutputInfo;

/**
 * 
 * @description 结账统一接口
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月17日
 */
public interface MatStoreManager {
	/* 入库 */
	List<MatInputInfo> matInput(List<MatInputInfo> inputList, HcpUser hcpUser);
	/* 出库 */
	void matOutput(List<MatOutputInfo> outputList, HcpUser hcpUser);
	/* 发药出库-不按批次批号扣库存明细，而是循环先进先出 */
	void dispenseOutput(List<MatOutputInfo> outputList, HcpUser hcpUser);
	//采購核准入庫 add by jiangyong
	void matInputByBill(MatBuyBill matBuyBill, List<MatInputInfo> inputList, HcpUser hcpUser);
}
