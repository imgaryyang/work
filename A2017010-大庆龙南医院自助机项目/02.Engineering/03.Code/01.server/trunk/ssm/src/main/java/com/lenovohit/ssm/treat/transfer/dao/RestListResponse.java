package com.lenovohit.ssm.treat.transfer.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;

public class RestListResponse extends RestResponse {
	public RestListResponse(){
		super();
	}
	public RestListResponse(RestResponse reponse){
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
			try {
				List<String> list = JSONUtils.parseObject(content,new TypeReference<List<String>>(){});
				this.list = new ArrayList<Map<String,Object>>();
				for(String json : list){
					Map<String,Object> map = JSONUtils.parseObject(json,new TypeReference<Map<String,Object>>(){});
					this.list.add(map);
				}
			} catch (Exception e) {
				throw new RuntimeException(e);
			} 
		}
	}
	private List<Map<String,Object>> list;
	public List<Map<String,Object>> getList() {
		return list;
	}
	public void setList(List<Map<String,Object>> entity) {
		this.list = entity;
	}
	
}
