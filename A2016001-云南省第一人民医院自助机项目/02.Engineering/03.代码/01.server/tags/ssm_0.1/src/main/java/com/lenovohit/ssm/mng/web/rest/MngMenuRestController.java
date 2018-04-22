package com.lenovohit.ssm.mng.web.rest;


import java.util.ArrayList;
import java.util.List;

import org.hibernate.SQLQuery;
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
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.mng.model.MngMenu;

/**
 * 管理端用户管理
 * 
 */
@RestController
@RequestMapping("/ssm/mng/menu")
public class MngMenuRestController extends BaseRestController {

	@Autowired
	private GenericManager<MngMenu, String> mngMenuManager;

	@RequestMapping(value = "/get/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery("from MngMenu where 1=1 order by sort");
		mngMenuManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<MngMenu> menus = mngMenuManager.find(" from MngMenu mngMenu where 1 = 1 order by mngMenu.sort ");
		return ResultUtils.renderSuccessResult(menus);
	}
	
	@RequestMapping(value = "/mylist", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<MngMenu> menus = mngMenuManager.findAll();
		return ResultUtils.renderSuccessResult(menus);
	}
	
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateMenu(@RequestBody String data){
		MngMenu menu =  JSONUtils.deserialize(data, MngMenu.class);
		
		//调整同级其它菜单位置
		if (menu.getId() != null) {  //修改
			MngMenu oldMenu = mngMenuManager.findOneByProp("id", menu.getId());
			int oldMenuSort = oldMenu.getSort();
			System.out.println(oldMenuSort);
			if (oldMenuSort > menu.getSort()) {  //向前调整位置
				//大于等于现有位置且小于原位置的同级菜单 +1
				String sql = "UPDATE SSM_MENU_MNG SET SORT = SORT + 1 WHERE PARENT = ? and ID != ? and SORT >= ? and Sort < ?";
		        int rst = mngMenuManager.executeSql(sql, menu.getParent(), menu.getId(), menu.getSort(), oldMenuSort);
		        System.out.println(rst);
			} else if (oldMenuSort < menu.getSort()) {  //向后调整
				//小于等于现有位置且大于原位置的同级菜单 +1
				String sql = "UPDATE SSM_MENU_MNG SET SORT = SORT - 1 WHERE PARENT = ? and ID != ? and SORT <= ? and Sort > ?";
		        int rst = mngMenuManager.executeSql(sql, menu.getParent(), menu.getId(), menu.getSort(), oldMenuSort);
		        System.out.println(rst);
			}
		} else {  //新建时，将排序位置大于或等于新菜单位置的同级菜单 +1
			String sql = "UPDATE SSM_MENU_MNG SET SORT = SORT + 1 WHERE PARENT = ? and SORT >= ?";
	        int rst = mngMenuManager.executeSql(sql, menu.getParent(), menu.getSort());
		}
        
		//TODO 校验
		MngMenu saved = this.mngMenuManager.save(menu);
        
		return ResultUtils.renderSuccessResult(saved);
	}
	
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id){
		try {
			this.mngMenuManager.delete(id);
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
			idSql.append("DELETE FROM SSM_MENU_MNG  WHERE ID IN (");
			for(int i = 0 ; i < ids.size() ; i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			System.out.println(idvalues);
			this.mngMenuManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}

}
