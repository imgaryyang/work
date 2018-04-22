package com.lenovohit.ssm.treat.manager;

import java.util.List;

import com.lenovohit.ssm.treat.model.AssayItem;
import com.lenovohit.ssm.treat.model.AssayRecord;
import com.lenovohit.ssm.treat.model.Patient;

public interface HisAssayManager {
	/**
	 * 查询化验单列表	assay/page	get
	 * @param patient
	 * @return
	 */
	List<AssayRecord> getAssayRecordPage(Patient patient);
	/**
	 * 查询化验单明细（化验结果）	assay/{id}	get
	 * @param record
	 * @return
	 */
	List<AssayItem> getAssayItem(String id);
	/**
	 * 化验单打印回传	assay/printed	post
	 * @param record
	 * @return
	 */
	AssayRecord print(AssayRecord record);
}
