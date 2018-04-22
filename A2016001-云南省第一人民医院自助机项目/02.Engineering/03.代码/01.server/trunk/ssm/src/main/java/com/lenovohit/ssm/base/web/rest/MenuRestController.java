package com.lenovohit.ssm.base.web.rest;

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
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.Machine;
import com.lenovohit.ssm.base.model.Menu;
import com.lenovohit.ssm.base.model.Operator;
import com.lenovohit.ssm.base.model.User;
@RestController
@RequestMapping("/ssm/base/menu")
public class MenuRestController  extends SSMBaseRestController {


	@Autowired
	private GenericManager<Menu, String> menuManager;
	

	@RequestMapping(value = "/client/get/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getClientPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery("from Menu where type='client' order by sort");
		menuManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	@RequestMapping(value = "/mng/get/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getMngPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery("from Menu where type='mng' order by sort");
		menuManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "")String data){
		
		Menu query =  JSONUtils.deserialize(data, Menu.class);
		StringBuilder jql = new StringBuilder( " from Menu where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getName())){
			jql.append(" and name like ? ");
			values.add("%"+query.getName()+"%");
		}
		if(!StringUtils.isEmpty(query.getCode())){
			jql.append(" and code like ? ");
			values.add("%"+query.getCode()+"%");
		}
		if(!StringUtils.isEmpty(query.getPathname())){
			jql.append(" and pathname like ? ");
			values.add("%"+query.getPathname()+"%");
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		menuManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
	}
	@RequestMapping(value = "/client/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forClientList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Menu> menus = menuManager.find(" from Menu menu where menu.type = ? order by menu.sort ","client");
		return ResultUtils.renderSuccessResult(menus);
	}
	@RequestMapping(value = "/mng/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMngList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Menu> menus = menuManager.find(" from Menu menu where menu.type = ? order by menu.sort","mng" );
		return ResultUtils.renderSuccessResult(menus);
	}
	@RequestMapping(value = "/operator/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forOperatorList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Menu> menus = menuManager.find(" from Menu menu where menu.type = ? order by menu.sort","operator" );
		return ResultUtils.renderSuccessResult(menus);
	}
	@RequestMapping(value = "/client/mylist", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forClientMyList() {
		Machine machine = this.getCurrentMachine();
		String sql = "SELECT " + "DISTINCT menu.ID,menu.NAME,menu.ALIAS,menu.Code,menu.PATHNAME,menu.ICON,menu.PARENT,menu.COLOR,"
				+ "menu.COLSPAN,menu.ROWSPAN,menu.URL,menu.SORT,menu.TEMPLATE,menu.RULES  "
				+ "FROM SSM_MENU menu " 
				+ "LEFT JOIN SSM_ROLE_MENU_RELA rela ON rela.MENU_ID = menu.ID "
				+ "LEFT JOIN SSM_ROLE role ON rela.ROLE_ID = role.ID "
				+ "LEFT JOIN SSM_MACHINE_ROLE_RELA u ON u.ROLE_ID = rela.ROLE_ID "
				+ "WHERE menu.TYPE = ? "
				+ "AND u.MACHINE_ID = ? "
				+ "ORDER BY menu.SORT ";
		List<?> result = menuManager.findBySql(sql,"client", machine.getId());
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
			menu.setColor(Object2String(array[7]));
			menu.setColspan(Object2String(array[8]));
			menu.setRowspan(Object2String(array[9]));
			menu.setUrl(Object2String(array[10]));
			menu.setSort(Integer.parseInt(Object2String(array[11])));
			menu.setTemplate(Object2String(array[12]));
			menu.setRules(Object2String(array[13]));
			menus.add(menu);
		}
		return ResultUtils.renderSuccessResult(menus);
	}
	@RequestMapping(value = "/operator/mylist", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyOperatorList() {
		Operator operator = this.getCurrentOperator();
		String sql = "SELECT " + "DISTINCT menu.ID,menu.NAME,menu.ALIAS,menu.Code,menu.PATHNAME,menu.ICON,menu.PARENT,menu.COLOR,"
				+ "menu.COLSPAN,menu.ROWSPAN,menu.SORT "
				+ "FROM SSM_MENU menu " 
				+ "LEFT JOIN SSM_ROLE_MENU_RELA rela ON rela.MENU_ID = menu.ID "
				+ "LEFT JOIN SSM_ROLE role ON rela.ROLE_ID = role.ID "
				+ "LEFT JOIN SSM_OPERATOR_ROLE_RELA u ON u.ROLE_ID = rela.ROLE_ID "
				+ "WHERE menu.TYPE = ? "
				+ "AND u.OPERATOR_ID = ? "
				+ "ORDER BY menu.SORT ";	
		List<?> result = menuManager.findBySql(sql,"operator", operator.getId());
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
			menu.setColor(Object2String(array[7]));
			menu.setColspan(Object2String(array[8]));
			menu.setRowspan(Object2String(array[9]));
			menus.add(menu);
		}
		return ResultUtils.renderSuccessResult(menus);
	}
	@RequestMapping(value = "/mng/mylist", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMngMyList() {
		User user = this.getCurrentUser();
		if ("402a53455a8e71eb015a8e71eb110000".equals(user.getId())) { // 如果是风晴雪
			String sql = "SELECT " + "DISTINCT menu.ID,menu.NAME,menu.ALIAS,menu.Code,menu.PATHNAME,menu.ICON,menu.PARENT,menu.SORT "
					+ "FROM SSM_MENU menu " 
	//				+ "LEFT JOIN SSM_ROLE_MENU_RELA rela ON rela.MENU_ID = menu.ID "
	//				+ "LEFT JOIN SSM_ROLE role ON rela.ROLE_ID = role.ID "
	//				+ "LEFT JOIN SSM_USER_ROLE_RELA u ON u.ROLE_ID = rela.ROLE_ID "
					+ "WHERE menu.TYPE = ? "
	//				+ "and u.USER_ID = ? "
					+ "ORDER BY menu.SORT ";
			List<?> result = menuManager.findBySql(sql,"mng"/*, user.getId()*/);
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
		} else {
			String sql = "SELECT DISTINCT menu.ID,menu.NAME,menu.ALIAS,menu.Code,menu.PATHNAME,menu.ICON,menu.PARENT,menu.SORT "
					+ "FROM SSM_MENU menu " 
					+ "LEFT JOIN SSM_ROLE_MENU_RELA rela ON rela.MENU_ID = menu.ID "
					+ "LEFT JOIN SSM_ROLE role ON rela.ROLE_ID = role.ID "
					+ "LEFT JOIN SSM_USER_ROLE_RELA u ON u.ROLE_ID = rela.ROLE_ID "
					+ "WHERE menu.TYPE = ? "
					+ "AND u.USER_ID = ? "
					+ "ORDER BY menu.SORT ";
			List<?> result = menuManager.findBySql(sql, "mng", user.getId());
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
				String sql = "UPDATE SSM_MENU SET SORT = SORT + 1 WHERE PARENT = ? and ID != ? and SORT >= ? and Sort < ?";
		        int rst = menuManager.executeSql(sql, menu.getParent(), menu.getId(), menu.getSort(), oldMenuSort);
		        System.out.println(rst);
			} else if (oldMenuSort < menu.getSort()) {  //向后调整
				//小于等于现有位置且大于原位置的同级菜单 +1
				String sql = "UPDATE SSM_MENU SET SORT = SORT - 1 WHERE PARENT = ? and ID != ? and SORT <= ? and Sort > ?";
		        int rst = menuManager.executeSql(sql, menu.getParent(), menu.getId(), menu.getSort(), oldMenuSort);
		        System.out.println(rst);
			}
		} else {  //新建时，将排序位置大于或等于新菜单位置的同级菜单 +1
			String sql = "UPDATE SSM_MENU SET SORT = SORT + 1 WHERE PARENT = ? and SORT >= ?";
	       /* int rst = */menuManager.executeSql(sql, menu.getParent(), menu.getSort());
		}
        
		//TODO 校验
		Menu saved = this.menuManager.save(menu);
        
		return ResultUtils.renderSuccessResult(saved);
	}
	
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id){
		System.out.println(id);
		try {
			//TODO 校验
			if(!"".equals(id) && id!=null){
			Menu menu = this.menuManager.delete(id);
			return ResultUtils.renderSuccessResult(menu);
		}
			this.menuManager.delete(id);	
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderFailureResult();
	}
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM SSM_MENU  WHERE ID IN (");
			for(int i = 0 ; i < ids.size() ; i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			if(!"".equals(idvalues) && idvalues!=null){
				this.menuManager.executeSql(idSql.toString(), idvalues.toArray());
				return ResultUtils.renderSuccessResult(idvalues);
			}
		}  catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderFailureResult();
	}
	
	public String Object2String(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}


}
