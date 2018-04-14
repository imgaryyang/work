package com.lenovohit.ssm.treat.manager;

import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.treat.model.ChargeItem;
import com.lenovohit.ssm.treat.model.Patient;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;

public interface HisPatientManager {
	/**
	 * 患者卡信息(PATIENT001)
	 * 通过患者基本信息获取患者病人编号及状态
	 * @param param
	 * @return
	 */
	@Deprecated
	HisEntityResponse<Patient> getPatientNo(Patient param);
	/**
	 * 患者所有档案查询(PATIENT044)
	 * 病人编号
	 * @param param
	 * @return
	 */
	HisListResponse<Patient> getPatients(Patient param);
	/**
	 * 患者基本信息查询(PATIENT002)
	 * 病人编号
	 * @param param
	 * @return
	 */
	HisEntityResponse<Patient> getPatientByPatientNo(Patient param);
	/**
	 * 患者基本信息查询(PATIENT0021)
	 * 卡内数据
	 * @param param
	 * @return
	 */
	HisEntityResponse<Patient> getPatientByCardNo(Patient param);
	
	/**
	 * 患者基本信息查询(PATIENT0022)
	 * 身份证
	 * @param param
	 * @return
	 */
    HisListResponse<Patient> getPatientByIdNo(Patient param);
	
	/**
	 * 患者基本信息建档并开通预存(PATIENT0031)
	 * @param patient
	 * @return
	 */
	HisEntityResponse<Patient> createProfile(Patient patient);
	
	/**
	 * 患者基本信息建档并开通预存(PATIENT0031)
	 * @param patient
	 * @return
	 */
	HisEntityResponse<Patient> createProfileWithoutIdNo(Patient patient);
	
	/**
	 * 患者基本信息更新(PATIENT004)
	 * @param patient
	 * @return
	 */
	HisEntityResponse<Patient> updatePatient(Patient patient);
	
	/**
	 * 支付就诊卡,扣款动作由socket完成
	 * @param patient
	 * @return
	 */
	@Deprecated 
	HisEntityResponse<Patient> payCard(Order cardOrder);
	
	/**
	 * 2.5患者就诊卡绑定(PATIENT0041)
	 * @param patient
	 * @return
	 */
	HisEntityResponse<Patient> bindCard(Patient patient);
	
	/**
	 * 2.5患者就诊卡挂失/启用(PATIENT0042)
	 * @param patient
	 * @return
	 */
	HisEntityResponse<Patient> changeCardStatus(Patient patient);
	
	/**
	 * 收费项目信息查询(BASE000019)
	 * @param patient
	 * @return
	 */
	HisEntityResponse<ChargeItem> chargeItemInfo(String xmid);
	
	/******************************新增档案不关联方案*********************/
	
	/**
	 * 患者基本信息查询
	 * 传入患者身份证号码，获取没有关联社保卡的病人自费卡信息
	 * @param param 身份证号码
	 * @return
	 */
	HisListResponse<Patient> getSelfPatientByIdNo(Patient param);
	
	/**
	 * 患者基本信息查询
	 * 根据医保卡号，获取该医保卡关联的自费卡信息
	 * @param param 医保卡号
	 * @return
	 */
	HisListResponse<Patient> getRelaCardByMiCardNo(Patient param);
	
}
