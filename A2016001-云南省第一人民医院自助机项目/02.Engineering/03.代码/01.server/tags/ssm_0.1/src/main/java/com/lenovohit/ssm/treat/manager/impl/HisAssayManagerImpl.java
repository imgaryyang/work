package com.lenovohit.ssm.treat.manager.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.ssm.treat.dao.FrontendRestDao;
import com.lenovohit.ssm.treat.manager.HisAssayManager;
import com.lenovohit.ssm.treat.model.AssayItem;
import com.lenovohit.ssm.treat.model.AssayRecord;
import com.lenovohit.ssm.treat.model.MedicalRecord;
import com.lenovohit.ssm.treat.model.Patient;

public class HisAssayManagerImpl implements HisAssayManager{

	@Autowired
	private FrontendRestDao frontendRestDao;
	
	@Override
	public List<AssayRecord> getAssayRecordPage(Patient patient) {
		List<AssayRecord> assayRecord = frontendRestDao.getForList("assay/page", AssayRecord.class);
		return assayRecord;
	}

	@Override
	public List<AssayItem> getAssayItem(String id) {
		List<AssayItem> assayItem = frontendRestDao.getForList("assay/"+id, AssayItem.class);
		return assayItem;
	}

	@Override
	public AssayRecord print(AssayRecord record) {
		// TODO Auto-generated method stub
		return null;
	}
}
