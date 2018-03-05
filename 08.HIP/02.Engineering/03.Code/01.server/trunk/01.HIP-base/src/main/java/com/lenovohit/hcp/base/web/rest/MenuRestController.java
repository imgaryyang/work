package com.lenovohit.hcp.base.web.rest;


import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.Menu;

/**
 * 管理端用户管理
 * 
 */
@RestController
@RequestMapping("/hcp/base/menu")
public class MenuRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<Menu, String> menuManager;
	

	@RequestMapping(value = "/get/{chanel}/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getPage(@PathVariable("chanel") String chanel,@PathVariable("start") String start, @PathVariable("limit") String limit){
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		if(chanel.equals("base")){
			page.setQuery("from Menu where 1=1 and  pathname not like '%/operation%' order by sort");
		}
		else{
			page.setQuery("from Menu where 1=1 order by sort");
		}
		menuManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Menu> menus = menuManager.find(" from Menu menu where 1 = 1 order by menu.sort ");
		return ResultUtils.renderSuccessResult(menus);
	}
	
	@RequestMapping(value = "/mylist", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyList() {
		HcpUser user = this.getCurrentUser();
		if("00000000000000000000000000000000".equals(user.getId())){
			return ResultUtils.renderSuccessResult(menuManager.findAll());
		}
		String sql = "SELECT " + "DISTINCT menu.ID,menu.NAME,menu.ALIAS,menu.Code,menu.PATHNAME,menu.ICON,menu.PARENT,menu.SORT "
				+ "FROM HCP_MENU menu " 
				+ "LEFT JOIN HCP_ROLE_MENU_RELA rela ON rela.MENU_ID = menu.ID "
				+ "LEFT JOIN HCP_ROLE role ON rela.ROLE_ID = role.ID "
				+ "LEFT JOIN HCP_USER_ROLE_RELA u ON u.ROLE_ID = rela.ROLE_ID "
				+ "WHERE u.USER_ID = ? "
				+ "ORDER BY menu.SORT ";
		List<?> result = menuManager.findBySql(sql, user.getId());
		List<Menu> menus = new ArrayList<Menu>();
		for(Object m : result){
			Object[] array =( Object[])m;
			Menu menu = new Menu();
			menu.setId(Object2String(array[0]));
			menu.setName(Object2String(array[1]));
			menu.setAlias(Object2String(array[2]));
			menu.setCode(Object2String(array[3]));
			menu.setPathname(Object2String(array[4]));
			menu.setIcon(Object2String(array[5]));
			menu.setParent(Object2String(array[6]));
			menus.add(menu);
		}
		return ResultUtils.renderSuccessResult(menus);
	}
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateMenu(@RequestBody String data){
		Menu menu =  JSONUtils.deserialize(data, Menu.class);
		
		//调整同级其它菜单位置
		if (menu.getId() != null) {  //修改
			Menu oldMenu = menuManager.findOneByProp("id", menu.getId());
			int oldMenuSort = oldMenu.getSort();
			System.out.println(oldMenuSort);
			if (oldMenuSort > menu.getSort()) {  //向前调整位置
				//大于等于现有位置且小于原位置的同级菜单 +1
				String sql = "UPDATE HCP_MENU SET SORT = SORT + 1 WHERE PARENT = ? and ID != ? and SORT >= ? and Sort < ?";
		        int rst = menuManager.executeSql(sql, menu.getParent(), menu.getId(), menu.getSort(), oldMenuSort);
		        System.out.println(rst);
			} else if (oldMenuSort < menu.getSort()) {  //向后调整
				//小于等于现有位置且大于原位置的同级菜单 +1
				String sql = "UPDATE HCP_MENU SET SORT = SORT - 1 WHERE PARENT = ? and ID != ? and SORT <= ? and Sort > ?";
		        int rst = menuManager.executeSql(sql, menu.getParent(), menu.getId(), menu.getSort(), oldMenuSort);
		        System.out.println(rst);
			}
		} else {  //新建时，将排序位置大于或等于新菜单位置的同级菜单 +1
			String sql = "UPDATE HCP_MENU SET SORT = SORT + 1 WHERE PARENT = ? and SORT >= ?";
	        int rst = menuManager.executeSql(sql, menu.getParent(), menu.getSort());
		}
        
		//TODO 校验
		Menu saved = this.menuManager.save(menu);
        
		return ResultUtils.renderSuccessResult(saved);
	}
	
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id){
		try {
			this.menuManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		System.out.println(data);
		@SuppressWarnings("rawtypes")
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM HCP_MENU  WHERE ID IN (");
			for(int i = 0 ; i < ids.size() ; i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			System.out.println(idvalues);
			this.menuManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	public String Object2String(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}

}
