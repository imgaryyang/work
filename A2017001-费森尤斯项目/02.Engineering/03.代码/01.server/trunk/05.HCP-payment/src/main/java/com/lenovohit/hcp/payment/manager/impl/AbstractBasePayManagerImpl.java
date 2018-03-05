package com.lenovohit.hcp.payment.manager.impl;

import com.lenovohit.hcp.payment.manager.BasePayManager;
import com.lenovohit.hcp.payment.model.HcpSettlement;

/**
 * @description 实现basepay接口的抽象类，所有子类实现公用方法放在这里
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月11日
 */
public abstract class AbstractBasePayManagerImpl implements BasePayManager {

	@Override
	public void precreate(HcpSettlement settlement) {
		// TODO Auto-generated method stub

	}

	@Override
	public void payCallBack(HcpSettlement settlement) {
		// TODO Auto-generated method stub

	}

	@Override
	public void refund(HcpSettlement settlement) {
		// TODO Auto-generated method stub

	}

	@Override
	public void otRefund(HcpSettlement settlement) {
		// TODO Auto-generated method stub

	}

}
