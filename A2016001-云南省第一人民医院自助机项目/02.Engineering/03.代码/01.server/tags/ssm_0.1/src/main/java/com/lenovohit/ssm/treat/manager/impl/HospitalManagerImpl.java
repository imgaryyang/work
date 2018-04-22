package com.lenovohit.ssm.treat.manager.impl;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.ssm.treat.dao.FrontendRestDao;
import com.lenovohit.ssm.treat.manager.HospitalManager;

public class HospitalManagerImpl implements HospitalManager{

	@Autowired
	private FrontendRestDao frontendRestDao;
	
}
