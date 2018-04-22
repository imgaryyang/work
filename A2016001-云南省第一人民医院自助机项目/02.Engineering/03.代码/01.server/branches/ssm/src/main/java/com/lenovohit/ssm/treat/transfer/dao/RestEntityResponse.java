package com.lenovohit.ssm.treat.transfer.dao;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;

public class RestEntityResponse extends RestResponse {
	public RestEntityResponse(){
		super();
	}
	public RestEntityResponse(RestResponse reponse){
		super();
		if(null == reponse){
			return;
		}
		
		this.setResult(reponse.getResult());
		String resultCode = reponse.getResultcode();
		this.setResultcode(resultCode);
		String content = reponse.getContent();
		this.setContent(content);
		if(!StringUtils.isEmpty(content) && "1".equals(resultCode) ){
			List<String> list = JSONUtils.parseObject(content, new TypeReference<List<String>>(){});
			if(list != null && list.size() ==1){
				this.entity = JSONUtils.parseObject(list.get(0), new TypeReference<Map<String,Object>>(){});
			}
		}
	}
	private Map<String, Object> entity;
	
	public Map<String, Object> getEntity() {
		return entity;
	}
	public void setEntity(Map<String, Object> entity) {
		this.entity = entity;
	}

}
