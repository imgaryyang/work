package com.lenovohit.bdrp.org.manager.impl;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONException;
import com.lenovohit.bdrp.Constants;
import com.lenovohit.bdrp.authority.model.Menu;
import com.lenovohit.bdrp.org.manager.PrivilegeManager;
import com.lenovohit.core.dao.GenericDao;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;

@Component
public class PrivilegeManagerImpl implements PrivilegeManager {
	@Autowired
	public GenericDao<Menu, String> menuDao;
	private String cacheDir = ".cache";

//	@Override
//	public void afterPropertiesSet() throws Exception {
//		String path = sc.getRealPath("/");
//		if(!path.endsWith("/")){
//			path += "/";
//		}
//		this.cacheAllModulesByRole(path);
//	}
	
	/**
	 * 将json缓存到文件中
	 */
	public void cacheModules(String basePath,String[] jsons, String roleId) throws IOException {
	    String jsonFile =roleId + "_1.json";
	    String filePath = basePath + this.cacheDir + "/";
	    
	    String allJsonFile =roleId + "_2.json";
	    
	    File dir = new File(filePath);
	    if (!dir.exists()) dir.mkdir();
	    
	    this.saveToFile(filePath+jsonFile, jsons[0]);
	    this.saveToFile(filePath+allJsonFile, jsons[1]);
	}
	/**
	 * 将字符串保存到文件中
	 * @param path
	 * @param content
	 * @throws IOException
	 */
	private void saveToFile(String path,String content) throws IOException{
		File f = new File(path);
	    if (!f.exists())f.createNewFile();
	    FileUtils.writeStringToFile(f, content, "utf-8");
	}
	/**
	 * 将modules按照角色缓存到文件中
	 * @param basePath
	 * @throws JSONException
	 * @throws IOException
	 */
	public void cacheAllModulesByRole(String basePath) throws JSONException, IOException{
		String roleSql = "select CAST(id AS VARCHAR2(32)) from IH_BASE_ROLE ";
		@SuppressWarnings("unchecked")
		List<Object> roles = (List<Object>) this.menuDao.findBySql(roleSql);
		if(null==roles){
			roles= new ArrayList<Object>();
		}
		roles.add("allRole");
		for(Object role : roles){
			String jsons[] = this.initModulesJson(role.toString());
			this.cacheModules(basePath, jsons, role.toString());
		}
	}
	/**
	 * 从缓存文件中获取modules
	 */
	public String[] getCachedModules(String roleId,String basePath) throws IOException{
		String jsonFile =roleId + "_1.json";
	    String filePath = basePath + this.cacheDir + "/";
	    
	    String allJsonFile =roleId + "_2.json";
	    
	    File dir = new File(filePath);
	    if (!dir.exists()) dir.mkdir();
	    
	    File fJson = new File(filePath+jsonFile);
	    if(!fJson.exists())return null;
	    String json = FileUtils.readFileToString(fJson);
	    
	    File fAllJson = new File(filePath+allJsonFile);
	    if(!fAllJson.exists())return null;
	    String allJson = FileUtils.readFileToString(fAllJson);
		
	    return new String[]{json,allJson};
	}
	/**
	 * 根据角色初始化Modules的json
	 */
	@SuppressWarnings("unchecked")
	public String[] initModulesJson(String roleId) {
		List<Object[]> menus= null;
		if("allRole".equals(roleId)){
			String sql = "select  distinct  m.id  ,m.code,m.name,  m.parent  ,f.uri,m.descp,m.icon,m.sorter from IH_MENU m left join IH_ACCESS a on a.id=m.aid left join IH_FUNCTION f on f.id=a.FUNCTION  left join IH_ROLE_ACC ac on ac.AID=a.id left join IH_BASE_ROLE r on r.id=ac.rid";
			 menus = (List<Object[]>) this.menuDao.findBySql(sql); 
		}else{
			String sql = "select  distinct  m.id  ,m.code,m.name,  m.parent  ,f.uri,m.descp,m.icon,m.sorter from IH_MENU m left join IH_ACCESS a on a.id=m.aid left join IH_FUNCTION f on f.id=a.FUNCTION  left join IH_ROLE_ACC ac on ac.AID=a.id left join IH_BASE_ROLE r on r.id=ac.rid where ac.RID=?";
			 menus = (List<Object[]>) this.menuDao.findBySql(sql,roleId); 
		}
		
		
		List<Menu> memuLst = new ArrayList<Menu>();
		List<Menu> allMemuLst = new ArrayList<Menu>();
		List<Menu> retLst = new ArrayList<Menu>();
		Menu mt = null;
		Map<String, Menu> tmpMap = new HashMap<String, Menu>();
		List<String> parentIdList = new ArrayList<String>();
		List<Menu> mainMenu = new ArrayList<Menu>();
		for (Object[] obj : menus) {
			mt = new Menu();
			mt.setId(convertStrNull(obj[0]));
			mt.setCode(convertStrNull(obj[1]));
			mt.setName(convertStrNull(obj[2]));
			mt.setParentId(convertStrNull(obj[3]));
			mt.setUrl(convertStrNull(obj[4]));
			mt.setDescp(convertStrNull(obj[5]));
			mt.setIconPath(convertStrNull(obj[6]));
			mt.setSort((Integer.parseInt(String.valueOf(obj[7]))));
			if (StringUtils.isBlank(convertStrNull(obj[3]))) {
				mainMenu.add(mt);
			} else {
				parentIdList.add(convertStrNull(obj[3]));
				mt.setParentId(convertStrNull(obj[3]));
				memuLst.add(mt);
			}
			tmpMap.put(mt.getId(), mt);
			allMemuLst.add(mt);
		}
		for (String id : tmpMap.keySet()) {
			if (null != tmpMap.get(tmpMap.get(id).getParentId())) {
				tmpMap.get(tmpMap.get(id).getParentId()).getChildren()
						.add(tmpMap.get(id));
			} else {
				mainMenu.add(tmpMap.get(id));
			}
		}
		for (Menu m : mainMenu) {
			construtMenu(memuLst, m.getId(), m);
			if (!retLst.contains(m))
				retLst.add(m);
		}

		Collections.sort(retLst);
		String json = JSONUtils.serialize(retLst);
		String ajson = JSONUtils.serialize(allMemuLst);
		return new String[]{json,ajson};
	}
	/**
	 * 构建菜单层次机构
	 * @param srcMenu
	 * @param pid
	 * @param tarMenu
	 */
	protected void construtMenu(List<Menu> srcMenu,String pid,Menu tarMenu){
		Set<Menu> chMenu = getChildren(srcMenu,tarMenu.getId(),tarMenu);
		if(chMenu.size()>0){
			tarMenu.getChildren().addAll(chMenu);
		}
	}
	/**
	 * 查找菜单集合中符合条件的菜单
	 * @param srcMenu
	 * @param pid
	 * @param tarMenu
	 * @return
	 */
	protected Set<Menu> getChildren(List<Menu> srcMenu,String pid, Menu tarMenu){
		TreeSet<Menu> retuMenu = new TreeSet<Menu>(new Comparator<Menu>(){
			public int compare(Menu o1, Menu o2) {
				int n1 = o1.getSort();
			    int n2 = o2.getSort();
			    if(n1==n2){
			    	return 0;
			    }else if(n1>n2){
			    	return 1;
			    }else if(n1<n2){
			    	return -1;
			    }
				return 0;
			}
			  });
		for(Menu menu : srcMenu){
			if(pid.equals(menu.getParentId())){
				construtMenu(srcMenu,menu.getId(),menu);
				retuMenu.add(menu);
			}
		}
		return retuMenu;
	}
	
	private String convertStrNull(Object obj){
		String str = String.valueOf(obj);
    	if(str==null||"null".equals(str)){
    		str="";
    	}
    	return str;
	}
	
	@Override
	public String getPrivileges(String uid) {
		List<Object[]> menus= null;
		if(Constants.APP_SUPER_ID.equals(uid)){
			String sql = "select  distinct  m.id  ,m.code,m.name,  m.parent  ,f.uri,m.descp,m.icon,m.sorter from IH_MENU m left join IH_ACCESS a on a.id=m.aid left join IH_FUNCTION f on f.id=a.FUNCTION  left join IH_ROLE_ACC ac on ac.AID=a.id ";
			 menus = (List<Object[]>) this.menuDao.findBySql(sql); 
		}else{
			String sql = "select  distinct  m.id  ,m.code,m.name,  m.parent  ,f.uri,m.descp,m.icon,m.sorter from IH_MENU m left join IH_ACCESS a on a.id=m.aid left join IH_FUNCTION f on f.id=a.FUNCTION  left join IH_ROLE_ACC ac on ac.AID=a.id left join IH_PERSON_ROLE pr on pr.rid=ac.rid  where pr.PID=?";
			 menus = (List<Object[]>) this.menuDao.findBySql(sql,uid); 
		}
		
		
		List<Menu> memuLst = new ArrayList<Menu>();
		List<Menu> allMemuLst = new ArrayList<Menu>();
		List<Menu> retLst = new ArrayList<Menu>();
		Menu mt = null;
		Map<String, Menu> tmpMap = new HashMap<String, Menu>();
		List<String> parentIdList = new ArrayList<String>();
		List<Menu> mainMenu = new ArrayList<Menu>();
		for (Object[] obj : menus) {
			mt = new Menu();
			mt.setId(convertStrNull(obj[0]));
			mt.setCode(convertStrNull(obj[1]));
			mt.setName(convertStrNull(obj[2]));
			mt.setParentId(convertStrNull(obj[3]));
			mt.setUrl(convertStrNull(obj[4]));
			mt.setDescp(convertStrNull(obj[5]));
			mt.setIconPath(convertStrNull(obj[6]));
			mt.setSort((Integer.parseInt(String.valueOf(obj[7]))));
			if (StringUtils.isBlank(convertStrNull(obj[3]))) {
				mainMenu.add(mt);
			} else {
				parentIdList.add(convertStrNull(obj[3]));
				mt.setParentId(convertStrNull(obj[3]));
				memuLst.add(mt);
			}
			tmpMap.put(mt.getId(), mt);
			allMemuLst.add(mt);
		}
		for (String id : tmpMap.keySet()) {
			if (null != tmpMap.get(tmpMap.get(id).getParentId())) {
				tmpMap.get(tmpMap.get(id).getParentId()).getChildren()
						.add(tmpMap.get(id));
			} else {
				mainMenu.add(tmpMap.get(id));
			}
		}
		for (Menu m : mainMenu) {
			construtMenu(memuLst, m.getId(), m);
			if (!retLst.contains(m))
				retLst.add(m);
		}

		Collections.sort(retLst);
		String json = JSONUtils.serialize(retLst);
		return json;
	}
}
