package com.lenovohit.hwe.treat.transfer;

import java.util.List;

public class RestListResponse<T> extends RestResponse {
	public RestListResponse(){
		super();
	}
	public RestListResponse(RestResponse reponse){
		super();
		if(null == reponse){
			return;
		}

		this.setSuccess(reponse.getSuccess());
		this.setMsg(reponse.getMsg());
		this.setResult(reponse.getResult());
		this.setList(null);
	}
	public RestListResponse(RestResponse reponse, List<T> list){
		super();
		if(null == reponse){
			return;
		}
		
		this.setSuccess(reponse.getSuccess());
		this.setMsg(reponse.getMsg());
		this.setResult(reponse.getResult());
		this.setList(list);
	}
	private List<T> list;
	
	public List<T> getList() {
		return list;
	}
	public void setList(List<T> list) {
		this.list = list;
	}
	
}
