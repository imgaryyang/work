package com.lenovohit.hwe.treat.service.impl;
import java.util.Map;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.Appoint;
import com.lenovohit.hwe.treat.model.Department;
import com.lenovohit.hwe.treat.model.Doctor;
import com.lenovohit.hwe.treat.service.HisAppointService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;
/**
 * 
 * @author xiaweiyi
 */
public class HisAppointRestServiceImpl implements HisAppointService {
	GenericRestDto<Appoint> dto;
	GenericRestDto<Department> deptDto;
	GenericRestDto<Doctor> docDto;

	public HisAppointRestServiceImpl(final GenericRestDto<Appoint> dto, final GenericRestDto<Department> deptDto, final GenericRestDto<Doctor> docDto) {
		super();
		this.dto = dto;
		this.deptDto = deptDto;
		this.docDto = docDto;
	}

	@Override
	public RestEntityResponse<Appoint> getInfo(Appoint request, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RestListResponse<Appoint> findList(Appoint request, Map<String, ?> variables) {
		return dto.getForList("hcp/app/his/appoint/list", request, variables);
	}

	@Override
	public RestListResponse<Department> findDeptList(Department request, Map<String, ?> variables) {
		return deptDto.getForList("hcp/app/his/appoint/deptList", request, variables);
	}

	@Override
	public RestListResponse<Doctor> findDocList(Doctor request, Map<String, ?> variables) {
		return docDto.getForList("hcp/app/his/appoint/docList", request, variables);
	}

	@Override
	public RestEntityResponse<Appoint> reserve(Appoint request, Map<String, ?> variables) {
		return dto.postForEntity("hcp/app/his/appoint/reserve", request); 
	}

	@Override
	public RestEntityResponse<Appoint> regist(Appoint request, Map<String, ?> variables) {
		return dto.postForEntity("hcp/app/his/appoint/regist", request, variables); 
	}

	@Override
	public RestEntityResponse<Appoint> sign(Appoint request, Map<String, ?> variables) {
		return dto.postForEntity("hcp/app/his/appoint/sign", request); 
	}

	@Override
	public RestEntityResponse<Appoint> cancel(Appoint request, Map<String, ?> variables) {
		return dto.postForEntity("hcp/app/his/appoint/cancel", request); 
	}

	@Override
	public RestListResponse<Appoint> findReservedList(Appoint request, Map<String, ?> variables) {
		return dto.getForList("hcp/app/his/appoint/reserved/list", request, variables);
	}

	@Override
	public RestListResponse<Appoint> findRegistList(Appoint request, Map<String, ?> variables) {
		return dto.getForList("hcp/app/his/appoint/regist/list", request, variables);
	}
	
}
