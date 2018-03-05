package com.lenovohit.hwe.treat.service.impl;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.Profile;
import com.lenovohit.hwe.treat.service.HisProfileService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

@Service
public class HisProfileRestServiceImpl implements HisProfileService {
	
	GenericRestDto<Profile> dto;
	
	public HisProfileRestServiceImpl(final GenericRestDto<Profile> dto) {
		super();
		this.dto = dto;
	}
	
	public HisProfileRestServiceImpl(){
		
	}

	@Override
	public RestEntityResponse<Profile> getInfo(Profile model, Map<String, ?> variables) {
		//TODO 如果后续有数据字典或转换此处接收数据后还要处理
		return dto.getForEntity("hcp/app/base/profile/info", model);
	}
	@Override
	public RestListResponse<Profile> findList(Profile model, Map<String, ?> variables) {
		return dto.getForList("hcp/app/base/profile/list", model, variables);
	}
	@Override
	public RestEntityResponse<Profile> create(Profile model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public RestEntityResponse<Profile> update(Profile model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public RestEntityResponse<Profile> logoff(Profile model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public RestEntityResponse<Profile> logon(Profile model, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public RestEntityResponse<Profile> acctOpen(Profile request, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public RestEntityResponse<Profile> acctFreeze(Profile request, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public RestEntityResponse<Profile> acctUnfreeze(Profile request, Map<String, ?> variables) {
		// TODO Auto-generated method stub
		return null;
	}
	
}
