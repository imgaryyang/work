package com.lenovohit.ssm.treat.manager;

import com.lenovohit.ssm.treat.model.Inpatient;
import com.lenovohit.ssm.treat.model.InpatientBill;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;

public interface HisInpatientManager {
	
//	/**
//	 * 住院患者信息查询(INP000004)
//	 * 根据身份证号/住院号/住院流水号/状态查询住院患者信息
//	 * @param patient
//	 * @return
//	 */
//	public HisEntityResponse getBaseInfo(Inpatient inpatient);
	
	/**
	 * 获取住院病人信息(INP0000041)
	 * 根据住院唯一标识(住院ID)，获取病人基本信息
	 * @param patient
	 * @return
	 */
	public HisListResponse<Inpatient> getInpatientByInpatientId(Inpatient inpatient);
	
	/**
	 * 获取住院病人信息(INP0000042)
	 * 根据病人编号，获取住院病人基本信息
	 * @param patient
	 * @return
	 */
	public HisListResponse<Inpatient> getInpatientByPatientNo(Inpatient inpatient);
	
	/**
	 * HIS住院费用查询（INP0000161）
	 * 根据住院ID获取住院费用明细列表
	 * @param baseInfo
	 * @return
	 */
	public HisListResponse<InpatientBill> getInpatientBill(Inpatient baseInfo);
}
