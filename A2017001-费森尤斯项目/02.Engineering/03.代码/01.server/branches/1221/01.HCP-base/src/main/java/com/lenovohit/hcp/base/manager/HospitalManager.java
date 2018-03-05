package com.lenovohit.hcp.base.manager;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.Hospital;

/**
 * 集团管理医院
 * @description
 * @author gw
 * @version 1.0.0
 * @date 2017年10月12日
 */
public interface HospitalManager {
	public Hospital createHospital(String superHospitalId,Hospital hospital,HcpUser user);

}
