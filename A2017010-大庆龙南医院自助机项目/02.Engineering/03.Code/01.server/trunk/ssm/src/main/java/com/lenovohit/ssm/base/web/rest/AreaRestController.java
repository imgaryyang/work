package com.lenovohit.ssm.base.web.rest;

import java.util.ArrayList;
import java.util.Date;
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
import com.lenovohit.core.manager.impl.GenericManagerImpl;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.Area;
import com.lenovohit.ssm.base.model.User;
@RestController
@RequestMapping("/ssm/base/area")
public class AreaRestController extends SSMBaseRestController {
	@Autowired
	private GenericManagerImpl<Area,String> areaManager;
	
	@RequestMapping(value = "/get/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery("from Area order by sort");
		areaManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getMyPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "")String data){
		
		Area query =  JSONUtils.deserialize(data, Area.class);
		StringBuilder jql = new StringBuilder( " from Area where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getName())){
			jql.append(" and name like ? ");
			values.add("%"+query.getName()+"%");
		}
		if(!StringUtils.isEmpty(query.getCode())){
			jql.append(" and code like ? ");
			values.add("%"+query.getCode()+"%");
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		areaManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Area> areas = areaManager.find(" from Area area  ");
		return ResultUtils.renderSuccessResult(areas);
	}
	
	@RequestMapping(value = "/mylist", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyList() {
		List<Area> areas = areaManager.find(" from Area area ");
		return ResultUtils.renderSuccessResult(areas);
	}
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateArea(@RequestBody String data){
		Area area =  JSONUtils.deserialize(data, Area.class);
		User user = this.getCurrentUser();
		Date now = new Date();
		/*area.setUpdateTime(now);
		area.setUpdateUser(user.getName());
		area.setRegTime(now);
		area.setRegUser(user.getName());*/
		
		Area saved = this.areaManager.save(area);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value="/update",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forUpdateArea(@RequestBody String data){
		Area area =  JSONUtils.deserialize(data, Area.class);
		User user = this.getCurrentUser();
		Date now = new Date();
		/*area.setUpdateTime(now);
		area.setUpdateUser(user.getName());*/
		Area saved = this.areaManager.save(area);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteArea(@PathVariable("id") String id){
		try {
			//TODO 校验
			this.areaManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		@SuppressWarnings("rawtypes")
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM HCP_ROLE  WHERE ID IN (");
			for(int i = 0 ; i < ids.size() ; i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			System.out.println(idvalues);
			this.areaManager.executeSql(idSql.toString(), idvalues.toArray());
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
