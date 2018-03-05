package com.lenovohit.hwe.treat.service.impl;
import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.Department;
import com.lenovohit.hwe.treat.model.ConsultDept;
import com.lenovohit.hwe.treat.service.HisDepartmentService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**
 * 
 * @author xiaweiyi
 */
public class HisDepartmentRestServiceImpl implements HisDepartmentService {
	GenericRestDto<Department> dto;
	GenericRestDto<ConsultDept> consultDeptDto;

	public HisDepartmentRestServiceImpl(final GenericRestDto<Department> dto, final GenericRestDto<ConsultDept> consultDeptDto) {
		super();
		this.dto = dto;
		this.consultDeptDto = consultDeptDto;
	}

	@Override
	public ConsultDept forConsultDept(Department dept) {
		RestEntityResponse<ConsultDept> restResponse = consultDeptDto.getForEntity("hcp/test/department/select", dept); 
		if(null != restResponse && restResponse.isSuccess()){
			return restResponse.getEntity();
		} else {
			return null;
		}
	}

	@Override
	public RestEntityResponse<Department> getInfo(Department dept, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestListResponse<Department> findList(Department dept, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}
}
