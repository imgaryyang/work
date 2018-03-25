package com.lenovohit.hwe.treat.service.impl;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.lenovohit.hwe.treat.dao.HisRestDao;
import com.lenovohit.hwe.treat.dao.HisRestEntityResponse;
import com.lenovohit.hwe.treat.dao.HisRestListResponse;
import com.lenovohit.hwe.treat.dao.HisRestRequest;
import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.ConsultDept;
import com.lenovohit.hwe.treat.model.Department;
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
	private HisRestDao hisRestDao;

	public HisDepartmentRestServiceImpl(final GenericRestDto<Department> dto, final GenericRestDto<ConsultDept> consultDeptDto) {
		super();
		this.dto = dto;
		this.consultDeptDto = consultDeptDto;
	}

	public HisRestDao getHisRestDao() {
		return hisRestDao;
	}


	public void setHisRestDao(HisRestDao hisRestDao) {
		this.hisRestDao = hisRestDao;
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
		HisRestListResponse response = hisRestDao.postForList("APPOINT001", HisRestRequest.SEND_TYPE_LOCATION, variables);
		return parseList(response);
	}
	
	private Department parseEntity(Map<String, Object> entity) {
		if (entity == null) {
			return null;
		}

		Department _entity = new Department();
		_entity.setNo(entity.get("DEPT_CODE").toString());
		_entity.setName(entity.get("DEPT_NAME").toString());
		_entity.setDescription(entity.get("DEPT_INTRODUCE").toString());
		_entity.setPinyin(entity.get("PINYIN").toString());
		
		return _entity;
	}
	
	private RestEntityResponse<Department> parseEntity(HisRestEntityResponse entityResponse) {
		if (entityResponse == null) {
			return null;
		}
		RestEntityResponse<Department> response = new RestEntityResponse<Department>();
		response.setSuccess(entityResponse.getResultcode());
		response.setMsg(entityResponse.getResult());
		if (entityResponse.isSuccess()) {
			Department entity = parseEntity(entityResponse.getEntity());
			response.setEntity(entity);
		}
		return response;
	}
	
	private RestListResponse<Department> parseList(HisRestListResponse listResponse) {
		if (listResponse == null) {
			return null;
		}
		RestListResponse<Department> response = new RestListResponse<Department>();
		response.setSuccess(listResponse.getResultcode());
		response.setMsg(listResponse.getResult());

		if (listResponse.isSuccess()) {
			List<Department> list = new ArrayList<Department>();
			for(Map<String, Object> _entity : listResponse.getList()){
				list.add(parseEntity(_entity));
			}
			response.setList(list);
		}
		return response;
	}
}
