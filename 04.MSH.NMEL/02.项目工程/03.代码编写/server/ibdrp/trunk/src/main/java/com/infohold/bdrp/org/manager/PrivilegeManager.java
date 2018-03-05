package com.infohold.bdrp.org.manager;

import java.io.IOException;

import com.alibaba.fastjson.JSONException;

public interface PrivilegeManager {
	
	public void cacheAllModulesByRole(String basePath) throws JSONException, IOException;
	public void cacheModules(String basePath,String[] jsons, String roleId) throws IOException;
	public String[] getCachedModules(String roleId,String basePath)throws IOException;
	public String[] initModulesJson(String roleId);
	
	public String getPrivileges(String pid);
	
}
