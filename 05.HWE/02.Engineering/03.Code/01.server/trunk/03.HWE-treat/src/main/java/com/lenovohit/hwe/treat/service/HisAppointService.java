package com.lenovohit.hwe.treat.service;

import java.util.Map;

import com.lenovohit.hwe.treat.model.Appoint;
import com.lenovohit.hwe.treat.model.Department;
import com.lenovohit.hwe.treat.model.Doctor;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

public interface HisAppointService {
	public RestEntityResponse<Appoint> getInfo(Appoint request, Map<String, ?> variables);
	// 3.4.10 排班号源列表查询
	public RestListResponse<Appoint> findList(Appoint request, Map<String, ?> variables);
	// 3.4.2 可预约科室列表查询
	public RestListResponse<Department> findDeptList(Department request, Map<String, ?> variables);
	// 3.4.3 可预约医生列表查询
	public RestListResponse<Doctor> findDocList(Doctor request, Map<String, ?> variables);

//	public RestListResponse<Doctor> findSepillList(Doctor request, Map<String, ?> variables);
	// 3.4.5 患者预约
	public RestEntityResponse<Appoint> reserve(Appoint request, Map<String, ?> variables);
	// 3.4.6 患者挂号
	public RestEntityResponse<Appoint> regist(Appoint request, Map<String, ?> variables);
	// 3.4.7 患者签到
	public RestEntityResponse<Appoint> sign(Appoint request, Map<String, ?> variables);
	// 3.4.8 患者取消
	public RestEntityResponse<Appoint> cancel(Appoint request, Map<String, ?> variables);
	// 3.4.11 患者预约记录查询
	public RestListResponse<Appoint> findReservedList(Appoint request, Map<String, ?> variables);
	// 3.4.12 患者挂号记录查询
	public RestListResponse<Appoint> findRegistList(Appoint request, Map<String, ?> variables);
	
}
