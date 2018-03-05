package com.lenovohit.hwe.pay.support.acctpay.balance.transfer;

public class RestEntityResponse<T> extends RestResponse {
	
	public RestEntityResponse(){
		super();
	}
	public RestEntityResponse(RestResponse reponse){
		super();
		if(null == reponse){
			return;
		}
		this.setSuccess(reponse.getSuccess());
		this.setMsg(reponse.getMsg());
		this.setResult(reponse.getResult());
		this.setEntity(null);
	}
	public RestEntityResponse(RestResponse reponse, T entity){
		super();
		if(null == reponse){
			return;
		}
		this.setSuccess(reponse.getSuccess());
		this.setMsg(reponse.getMsg());
		this.setResult(reponse.getResult());
		this.setEntity(entity);
	}
	private T entity;
	
	public T getEntity() {
		return entity;
	}
	public void setEntity(T entity) {
		this.entity = entity;
	}

}
