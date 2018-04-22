package com.lenovohit.ssm.treat.manager.impl;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.ssm.payment.manager.HisPayManager;
import com.lenovohit.ssm.treat.dao.FrontendRestDao;
import com.lenovohit.ssm.treat.manager.HisSMSManager;

public class HisSMSManagerImpl implements HisSMSManager{

	@Autowired
	private FrontendRestDao frontendRestDao;
	
	@Override
	public String verifyCode(String phoneNo) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean verify(String phoneNo, String code) {
		// TODO Auto-generated method stub
		return false;
	}}
