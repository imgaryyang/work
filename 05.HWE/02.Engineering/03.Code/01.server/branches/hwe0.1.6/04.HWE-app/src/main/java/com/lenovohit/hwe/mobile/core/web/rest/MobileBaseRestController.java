package com.lenovohit.hwe.mobile.core.web.rest;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.mobile.core.model.UserPatient;
import com.lenovohit.hwe.org.model.User;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;


public class MobileBaseRestController  extends OrgBaseRestController{
	@Autowired
	private GenericManager<UserPatient, String> userPatientManager;
	
	protected UserPatient getDefaultPatient(User user){
		String id = user.getId();
		String idNo = user.getIdNo();
		UserPatient userPatient = new UserPatient();
		if(!StringUtils.isEmpty(idNo)){
			userPatient = this.userPatientManager.findOne(" from UserPatient u where u.userId = ? and u.idNo = ? ", id, idNo);
			return userPatient;
		}
		return null;
	}
}
