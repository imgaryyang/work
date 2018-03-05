package com.lenovohit.hcp.base.transfer;

import java.util.List;

public class RestListResponse<T> extends RestResponse {
	public RestListResponse(){
		
	}
	public RestListResponse(RestResponse response){
		this.setSuccess(response.isSuccess());
		this.setResult(response.getResult());
	}
	private List<T> list;

	public List<T> getList() {
		return list;
	}

	public void setList(List<T> result) {
		this.list = result;
	}
}
