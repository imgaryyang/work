package com.lenovohit.ssm.treat.transfer.manager;

import java.util.List;

import com.lenovohit.ssm.treat.transfer.dao.RestResponse;

public class HisListResponse<T> extends HisResponse {
	public HisListResponse(){
	}
	public HisListResponse(RestResponse reponse){
		super(reponse);
	}
	private List<T> hisList;
	public List<T> getList() {
		return hisList;
	}
	public void setList(List<T> hisList) {
		this.hisList = hisList;
	}
	
}
