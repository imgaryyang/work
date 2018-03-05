package com.lenovohit.hcp.base.transfer;

public class RestEntityResponse<T> extends RestResponse {
	public RestEntityResponse(){
		
	}
	public RestEntityResponse(RestResponse response){
		this.setSuccess(response.isSuccess());
		this.setResult(response.getResult());
	}
	private T entity;

	public T getEntity() {
		return entity;
	}

	public void setEntity(T result) {
		this.entity = result;
	}
}
