package com.lenovohit.ssm.treat.manager;

import com.lenovohit.ssm.treat.model.PacsRecord;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;

public interface HisPacsManager {
	/**
	 * 查询pacs列表	pacs/page	get
	 * 根据病人编号查询PACS列表 PACS0001
	 * @param patient
	 * @return
	 */
	public HisListResponse<PacsRecord> getPacsRecords(PacsRecord param);
	/**
	 * 查询pacs报告详细信息（pacs报告结果）	pacs/{id}	get
	 * @param record
	 * @return
	 */
	public PacsRecord getPacsImage(PacsRecord PacsRecord);
	
	public String getPacsImagePath();
	
	/**
	 * pacs打印回传	pacs/printed	post
	 * @param record
	 * @return
	 */
	public PacsRecord print(PacsRecord record);
}
