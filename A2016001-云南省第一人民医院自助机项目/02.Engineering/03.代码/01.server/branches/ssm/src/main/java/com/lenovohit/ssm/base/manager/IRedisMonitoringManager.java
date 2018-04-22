package com.lenovohit.ssm.base.manager;

import java.util.List;

public interface IRedisMonitoringManager {
	public void set(String key, Object value);  

    public Object get(String key);
    
    public void setList(String key , List<String> list);
    
    public List<String> getList(String key);
}
