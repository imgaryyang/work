package com.lenovohit.ssm.treat.manager;

import com.lenovohit.ssm.treat.model.PrescriptionItem;
import com.lenovohit.ssm.treat.model.PrescriptionRecord;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;

/**
 * 处方单
 * @author fanyang
 *
 */
public interface HisPrescriptionManager {
	/**
	 * 根据病人编号查询处方单记录
	 * @param param
	 * @return
	 */
	public HisListResponse<PrescriptionRecord> getPrescriptionRecords(PrescriptionRecord param);
	
	/**
	 * 根据处方编号查询处方信息
	 * @param param
	 * @return
	 */
	public HisListResponse<PrescriptionItem> getPrescription(PrescriptionRecord param);
	
	/**
	 * 打印回传
	 * @param record
	 * @return
	 */
	public HisEntityResponse<PrescriptionRecord> prescriptionRecordPrint(PrescriptionRecord param);
}
