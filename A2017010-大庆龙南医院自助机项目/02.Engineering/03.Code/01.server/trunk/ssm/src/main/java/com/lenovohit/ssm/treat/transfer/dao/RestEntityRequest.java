package com.lenovohit.ssm.treat.transfer.dao;

import com.lenovohit.core.utils.BeanUtils;
import com.lenovohit.ssm.treat.transfer.Mapper;

public class RestEntityRequest<T> extends  RestRequest{
	public void setParam(Object param,Class<T> type) {
		if(null == param)return;
		try {
			Class<?> mapperClass = Mapper.getMapper(type);
			Object mapper = mapperClass.newInstance();
			BeanUtils.copyProperties(param, mapper);
			this.setParam(mapper);
		} catch (Exception e) {
			this.setParam(param);
		}
	}
}
