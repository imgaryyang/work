package com.lenovohit.ssm.treat.manager;

import java.util.List;

import com.lenovohit.ssm.treat.model.AssayRecord;

public interface HisAssayManager {
	/**
	 * 查询化验单列表	assay/page	get
	 * @param patient
	 * @return
	 */
	List<AssayRecord> getAssayRecords(AssayRecord AssayRecord);
	/**
	 * 查询化验单明细（化验结果）	assay/{id}	get
	 * @param record
	 * @return
	 */
	public String getAssayImage(AssayRecord AssayRecord);
	/**
	 * 化验单打印回传	assay/printed	post
	 * @param record
	 * @return
	 */
	public AssayRecord print(AssayRecord record);
	
	/**
	 * 获取提示信息
	 * @param record
	 * @return
	 */
	public AssayRecord getTipsMsg(AssayRecord record);
	
}
