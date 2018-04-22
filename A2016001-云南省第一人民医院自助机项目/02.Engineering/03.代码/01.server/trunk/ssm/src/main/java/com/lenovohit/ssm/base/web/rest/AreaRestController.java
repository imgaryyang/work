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
import com.lenovohit.core.manager.impl.GenericManagerImpl;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.Area;
@RestController
@RequestMapping("/ssm/base/area")
public class AreaRestController extends SSMBaseRestController {
	@Autowired
	private GenericManagerImpl<Area,String> areaManager;
	
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
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
	/**
	 * 加载所有区域
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Area> areas = areaManager.find(" from Area order by sort");
		return ResultUtils.renderSuccessResult(areas);
	}
	/**
	 * 根据父id加载区域信息
	 */
	@RequestMapping(value = "/areaList/{parent}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forListByParent(@PathVariable(value = "parent") String parent) {
		List<Area> areas = areaManager.find(" from Area where parent = ? ",parent);
		return ResultUtils.renderSuccessResult(areas);
	}
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM SSM_AREA  WHERE ID IN (");
			for(int i = 0 ; i < ids.size() ; i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			this.areaManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 新增地址
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreateArea(@RequestBody String data){
		Area area =  JSONUtils.deserialize(data, Area.class);
		
		//调整同级其它地址位置
		if (area.getId() != null) {  //修改
			Area oldArea = areaManager.get(area.getId());
			int oldAreaSort = oldArea.getSort();
			if (oldAreaSort > area.getSort()) {  //向前调整位置
				//大于等于现有位置且小于原位置的同级地址 +1
				String sql = "UPDATE SSM_AREA SET SORT = SORT + 1 WHERE PARENT = ? and ID != ? and SORT >= ? and Sort < ?";
		        areaManager.executeSql(sql, area.getParent(), area.getId(), area.getSort(), oldAreaSort);
			} else if (oldAreaSort < area.getSort()) {  //向后调整
				//小于等于现有位置且大于原位置的同级地址 +1
				String sql = "UPDATE SSM_AREA SET SORT = SORT - 1 WHERE PARENT = ? and ID != ? and SORT <= ? and Sort > ?";
		        areaManager.executeSql(sql, area.getParent(), area.getId(), area.getSort(), oldAreaSort);
			}
		} else {  //新建时，将排序位置大于或等于新地址位置的同级地址 +1
			String sql = "UPDATE SSM_AREA SET SORT = SORT + 1 WHERE PARENT = ? and SORT >= ?";
	        areaManager.executeSql(sql, area.getParent(), area.getSort());
		}
		Area saved = this.areaManager.save(area);
		        
		return ResultUtils.renderSuccessResult(saved);
	}
}
