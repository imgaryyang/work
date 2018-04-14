package com.lenovohit.hwe.ssm.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.ssm.model.Machine;
import com.lenovohit.hwe.ssm.model.SSMMenu;
@RestController("ssmMenuRestController")
@RequestMapping("/hwe/ssm/menu")
public class MenuRestController  extends SSMBaseRestController {


	@Autowired
	private GenericManager<SSMMenu, String> ssmMenuManager;
	

	@RequestMapping(value = "/client/get/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getClientPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery("from SSMMenu where type='client' order by sort");
		ssmMenuManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	@RequestMapping(value = "/client/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forClientList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<SSMMenu> ssmMenus = ssmMenuManager.find(" from SSMMenu ssmMenu where ssmMenu.type = ? order by ssmMenu.sort ","client");
		return ResultUtils.renderSuccessResult(ssmMenus);
	}
	@RequestMapping(value = "/client/mylist", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forClientMyList() {
		Machine machine = this.getCurrentMachine();
		String sql = "SELECT " + "DISTINCT menu.ID,menu.NAME,menu.ALIAS,menu.Code,menu.URI,menu.ICON,menu.PARENT,menu.COLOR,"
				+ "menu.COLSPAN,menu.ROWSPAN,menu.SORTER,menu.TEMPLATE,menu.RULES  "
				+ "FROM SSM_MENU menu " 
				+ "LEFT JOIN SSM_ROLE_MENU_RELA rela ON rela.MENU_ID = menu.ID "
				+ "LEFT JOIN HWE_ROLE role ON rela.ROLE_ID = role.ID "
				+ "LEFT JOIN SSM_MACHINE_ROLE_RELA u ON u.ROLE_ID = rela.ROLE_ID "
				+ "WHERE menu.TYPE = ? "
				+ "AND u.MACHINE_ID = ? "
				+ "ORDER BY menu.SORTER ";
		List<?> result = ssmMenuManager.findBySql(sql,"client", machine.getId());
		List<SSMMenu> ssmMenus = new ArrayList<SSMMenu>();
		for(Object m : result){
			Object[] array =( Object[])m;
			SSMMenu ssmMenu = new SSMMenu();
			ssmMenu.setId(Object2String(array[0]));
			ssmMenu.setName(Object2String(array[1]));
			ssmMenu.setAlias(Object2String(array[2]));
			ssmMenu.setCode(Object2String(array[3]));
			ssmMenu.setUri(Object2String(array[4]));
			ssmMenu.setIcon(Object2String(array[5]));
			ssmMenu.setParent(Object2String(array[6]));
			ssmMenu.setColor(Object2String(array[7]));
			ssmMenu.setColspan(Object2String(array[8]));
			ssmMenu.setRowspan(Object2String(array[9]));
			ssmMenu.setSorter(Integer.parseInt(Object2String(array[10])));
			ssmMenu.setTemplate(Object2String(array[11]));
			ssmMenu.setRules(Object2String(array[12]));
			ssmMenus.add(ssmMenu);
		}
		return ResultUtils.renderSuccessResult(ssmMenus);
	}
	
	public String Object2String(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}


}

//
//
//
//@RequestMapping(value = "/mng/get/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
//public Result getMngPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
//	Page page = new Page();
//	page.setStart(start);
//	page.setPageSize(limit);
//	page.setQuery("from SSMMenu where type='mng' order by sort");
//	ssmMenuManager.findPage(page);
//	return ResultUtils.renderPageResult(page);
//}
//@RequestMapping(value = "/mng/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
//public Result forMngList(@RequestParam(value = "data", defaultValue = "") String data) {
//	List<SSMMenu> ssmMenus = ssmMenuManager.find(" from SSMMenu ssmMenu where ssmMenu.type = ? order by ssmMenu.sort","mng" );
//	return ResultUtils.renderSuccessResult(ssmMenus);
//}
//@RequestMapping(value = "/operator/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
//public Result forOperatorList(@RequestParam(value = "data", defaultValue = "") String data) {
//	List<SSMMenu> ssmMenus = ssmMenuManager.find(" from SSMMenu ssmMenu where ssmMenu.type = ? order by ssmMenu.sort","operator" );
//	return ResultUtils.renderSuccessResult(ssmMenus);
//}
//@RequestMapping(value = "/operator/mylist", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
//public Result forMyOperatorList() {
//	Operator operator = this.getCurrentOperator();
//	String sql = "SELECT " + "DISTINCT ssmMenu.ID,ssmMenu.NAME,ssmMenu.ALIAS,ssmMenu.Code,ssmMenu.URI,ssmMenu.ICON,ssmMenu.PARENT,ssmMenu.COLOR,"
//			+ "ssmMenu.COLSPAN,ssmMenu.ROWSPAN,ssmMenu.SORTER "
//			+ "FROM SSM_MENU ssmMenu " 
//			+ "LEFT JOIN SSM_ROLE_MENU_RELA rela ON rela.MENU_ID = ssmMenu.ID "
//			+ "LEFT JOIN HWE_ROLE role ON rela.ROLE_ID = role.ID "
//			+ "LEFT JOIN SSM_OPERATOR_ROLE_RELA u ON u.ROLE_ID = rela.ROLE_ID "
//			+ "WHERE ssmMenu.TYPE = ? "
//			+ "AND u.OPERATOR_ID = ? "
//			+ "ORDER BY ssmMenu.SORTER ";	
//	List<?> result = ssmMenuManager.findBySql(sql,"operator", operator.getId());
//	List<SSMMenu> ssmMenus = new ArrayList<SSMMenu>();
//	for(Object m : result){
//		Object[] array =( Object[])m;
//		SSMMenu ssmMenu = new SSMMenu();
//		ssmMenu.setId(Object2String(array[0]));
//		ssmMenu.setName(Object2String(array[1]));
//		ssmMenu.setAlias(Object2String(array[2]));
//		ssmMenu.setCode(Object2String(array[3]));
//		ssmMenu.setPathname(Object2String(array[4]));
//		ssmMenu.setIcon(Object2String(array[5]));
//		ssmMenu.setParent(Object2String(array[6]));
//		ssmMenu.setColor(Object2String(array[7]));
//		ssmMenu.setColspan(Object2String(array[8]));
//		ssmMenu.setRowspan(Object2String(array[9]));
//		ssmMenus.add(ssmMenu);
//	}
//	return ResultUtils.renderSuccessResult(ssmMenus);
//}
//@RequestMapping(value = "/mng/mylist", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
//public Result forMngMyList() {
//	User user = this.getCurrentUser();
//	if ("402a53455a8e71eb015a8e71eb110000".equals(user.getId())) { // 如果是风晴雪
//		String sql = "SELECT " + "DISTINCT ssmMenu.ID,ssmMenu.NAME,ssmMenu.ALIAS,ssmMenu.Code,ssmMenu.URI,ssmMenu.ICON,ssmMenu.PARENT,ssmMenu.SORTER "
//				+ "FROM SSM_MENU ssmMenu " 
////				+ "LEFT JOIN SSM_ROLE_MENU_RELA rela ON rela.MENU_ID = ssmMenu.ID "
////				+ "LEFT JOIN HWE_ROLE role ON rela.ROLE_ID = role.ID "
////				+ "LEFT JOIN SSM_USER_ROLE_RELA u ON u.ROLE_ID = rela.ROLE_ID "
//				+ "WHERE ssmMenu.TYPE = ? "
////				+ "and u.USER_ID = ? "
//				+ "ORDER BY ssmMenu.SORTER ";
//		List<?> result = ssmMenuManager.findBySql(sql,"mng"/*, user.getId()*/);
//		List<SSMMenu> ssmMenus = new ArrayList<SSMMenu>();
//		for(Object m : result){
//			Object[] array =( Object[])m;
//			SSMMenu ssmMenu = new SSMMenu();
//			ssmMenu.setId(Object2String(array[0]));
//			ssmMenu.setName(Object2String(array[1]));
//			ssmMenu.setAlias(Object2String(array[2]));
//			ssmMenu.setCode(Object2String(array[3]));
//			ssmMenu.setPathname(Object2String(array[4]));
//			ssmMenu.setIcon(Object2String(array[5]));
//			ssmMenu.setParent(Object2String(array[6]));
//			ssmMenus.add(ssmMenu);
//		}
//		return ResultUtils.renderSuccessResult(ssmMenus);
//	} else {
//		String sql = "SELECT " + "DISTINCT ssmMenu.ID,ssmMenu.NAME,ssmMenu.ALIAS,ssmMenu.Code,ssmMenu.URI,ssmMenu.ICON,ssmMenu.PARENT,ssmMenu.SORTER "
//				+ "FROM SSM_MENU ssmMenu " 
//				+ "LEFT JOIN SSM_ROLE_MENU_RELA rela ON rela.MENU_ID = ssmMenu.ID "
//				+ "LEFT JOIN HWE_ROLE role ON rela.ROLE_ID = role.ID "
//				+ "LEFT JOIN SSM_USER_ROLE_RELA u ON u.ROLE_ID = rela.ROLE_ID "
//				+ "WHERE ssmMenu.TYPE = ? "
//				+ "and u.USER_ID = ? "
//				+ "ORDER BY ssmMenu.SORTER ";
//		List<?> result = ssmMenuManager.findBySql(sql,"mng", user.getId());
//		List<SSMMenu> ssmMenus = new ArrayList<SSMMenu>();
//		for(Object m : result){
//			Object[] array =( Object[])m;
//			SSMMenu ssmMenu = new SSMMenu();
//			ssmMenu.setId(Object2String(array[0]));
//			ssmMenu.setName(Object2String(array[1]));
//			ssmMenu.setAlias(Object2String(array[2]));
//			ssmMenu.setCode(Object2String(array[3]));
//			ssmMenu.setPathname(Object2String(array[4]));
//			ssmMenu.setIcon(Object2String(array[5]));
//			ssmMenu.setParent(Object2String(array[6]));
//			ssmMenus.add(ssmMenu);
//		}
//		return ResultUtils.renderSuccessResult(ssmMenus);
//	}
//}
//@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
//public Result forCreateSSMMenu(@RequestBody String data){
//	SSMMenu ssmMenu =  JSONUtils.deserialize(data, SSMMenu.class);
//	
//	//调整同级其它菜单位置
//	if (ssmMenu.getId() != null) {  //修改
//		SSMMenu oldSSMMenu = ssmMenuManager.findOneByProp("id", ssmMenu.getId());
//		int oldSSMMenuSort = oldSSMMenu.getSort();
//		System.out.println(oldSSMMenuSort);
//		if (oldSSMMenuSort > ssmMenu.getSort()) {  //向前调整位置
//			//大于等于现有位置且小于原位置的同级菜单 +1
//			String sql = "UPDATE SSM_MENU SET SORTER = SORTER + 1 WHERE PARENT = ? and ID != ? and SORTER >= ? and Sort < ?";
//	        int rst = ssmMenuManager.executeSql(sql, ssmMenu.getParent(), ssmMenu.getId(), ssmMenu.getSort(), oldSSMMenuSort);
//	        System.out.println(rst);
//		} else if (oldSSMMenuSort < ssmMenu.getSort()) {  //向后调整
//			//小于等于现有位置且大于原位置的同级菜单 +1
//			String sql = "UPDATE SSM_MENU SET SORTER = SORTER - 1 WHERE PARENT = ? and ID != ? and SORTER <= ? and Sort > ?";
//	        int rst = ssmMenuManager.executeSql(sql, ssmMenu.getParent(), ssmMenu.getId(), ssmMenu.getSort(), oldSSMMenuSort);
//	        System.out.println(rst);
//		}
//	} else {  //新建时，将排序位置大于或等于新菜单位置的同级菜单 +1
//		String sql = "UPDATE SSM_MENU SET SORTER = SORTER + 1 WHERE PARENT = ? and SORTER >= ?";
//       /* int rst = */ssmMenuManager.executeSql(sql, ssmMenu.getParent(), ssmMenu.getSort());
//	}
//    
//	//TODO 校验
//	SSMMenu saved = this.ssmMenuManager.save(ssmMenu);
//    
//	return ResultUtils.renderSuccessResult(saved);
//}
//
//@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
//public Result forDeleteSSMMenu(@PathVariable("id") String id){
//	try {
//		this.ssmMenuManager.delete(id);
//	} catch (Exception e) {
//		throw new BaseException("删除失败");
//	}
//	return ResultUtils.renderSuccessResult();
//}
//
//@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
//public Result forDeleteAll(@RequestBody String data){
//	System.out.println(data);
//	@SuppressWarnings("rawtypes")
//	List ids =  JSONUtils.deserialize(data, List.class);
//	StringBuilder idSql = new StringBuilder();
//	List<String> idvalues = new ArrayList<String>();
//	try {
//		idSql.append("DELETE FROM SSM_MENU  WHERE ID IN (");
//		for(int i = 0 ; i < ids.size() ; i++) {
//			idSql.append("?");
//			idvalues.add(ids.get(i).toString());
//			if(i != ids.size() - 1) idSql.append(",");
//		}
//		idSql.append(")");
//		System.out.println(idSql.toString());
//		System.out.println(idvalues);
//		this.ssmMenuManager.executeSql(idSql.toString(), idvalues.toArray());
//	} catch (Exception e) {
//		e.printStackTrace();
//		throw new BaseException("删除失败");
//	}
//	return ResultUtils.renderSuccessResult();
//}
