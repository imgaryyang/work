package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.ConsultDept;
import com.lenovohit.hwe.treat.model.Department;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisDepartmentService {	
	public ConsultDept forConsultDept(Department dept);
	
	public RestEntityResponse<Department> getInfo(Department request, Map<String, ?> variables);
	
	public RestListResponse<Department> findList(Department request, Map<String, ?> variables);
}
