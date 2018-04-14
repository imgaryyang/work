package com.lenovohit.hwe.treat.service.impl;
import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.Doctor;
import com.lenovohit.hwe.treat.service.HisDoctorService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**
 * 
 * @author xiaweiyi
 */
public class HisDoctorRestServiceImpl implements HisDoctorService {
	GenericRestDto<Doctor> dto;

	public HisDoctorRestServiceImpl(final GenericRestDto<Doctor> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public RestEntityResponse<Doctor> getInfo(Doctor model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestListResponse<Doctor> findList(Doctor model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

}
