package com.lenovohit.ssm.treat.transfer.manager;

import com.lenovohit.ssm.treat.transfer.dao.RestResponse;

public class HisEntityResponse<T> extends HisResponse {
	public HisEntityResponse(){
	}
	public HisEntityResponse(RestResponse reponse){
		super(reponse);
	}
	private T hisEntity;
	public T getEntity() {
		return hisEntity;
	}
	public void setEntity(T hisEntity) {
		this.hisEntity = hisEntity;
	}
}
