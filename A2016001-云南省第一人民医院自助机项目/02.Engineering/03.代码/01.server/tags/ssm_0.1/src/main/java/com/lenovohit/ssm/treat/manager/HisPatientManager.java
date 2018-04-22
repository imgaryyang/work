package com.lenovohit.ssm.treat.manager;

import com.lenovohit.ssm.treat.model.MedicalCard;
import com.lenovohit.ssm.treat.model.Patient;

public interface HisPatientManager {
	//	获取患者信息
	Patient getPatientByMI(String miCardNo);
	Patient getPatientByIDCard(String idCardNo);
	Patient getPatientByHisID(String hisId);
	
	/**
	 * 根据卡介质获取患者信息	patient/info	get
	 * @param param
	 * @return
	 */
	Patient getPatient(Patient param);
	
	/**
	 * 建档接口（返回卡号患者信息）	patient/profile/create	post
	 * @param patient
	 * @return
	 */
	Patient createProfile(Patient patient);
	
	/**
	 * 发卡	patient/card/issue	post
	 * @param patient
	 * @return
	 */
	MedicalCard issueCard(Patient patient);
	
	/**
	 * 开通预存	 patient/openDeposit	get
	 * @param patient
	 * @return
	 */
	Patient openDeposit(Patient patient);
}
