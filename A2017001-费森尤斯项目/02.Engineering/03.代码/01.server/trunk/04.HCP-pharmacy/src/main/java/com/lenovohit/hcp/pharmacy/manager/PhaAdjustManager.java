package com.lenovohit.hcp.pharmacy.manager;

import java.util.List;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.pharmacy.model.PhaAdjust;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;

public interface PhaAdjustManager {
	/* 药品调价 */
	public void create(List<PhaAdjust> adjustList, List<PhaDrugInfo> drugList, HcpUser user);
}
