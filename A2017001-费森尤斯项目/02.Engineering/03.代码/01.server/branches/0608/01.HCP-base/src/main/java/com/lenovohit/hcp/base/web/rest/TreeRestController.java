package com.lenovohit.hcp.base.web.rest;


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
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.Dictionary;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.Tree;

/**
 * 多级字典管理
 */
@RestController
@RequestMapping("/hcp/base/tree")
public class TreeRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<Tree, String> treeManager;
	
	/**
	 * 分页查询
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data){
		Tree query =  JSONUtils.deserialize(data, Tree.class);
		StringBuilder jql = new StringBuilder( "from Tree where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		if(!StringUtils.isEmpty(query.getDictType())){
			jql.append("and dictType = ? ");
			values.add(query.getDictType());
		}
		if(query.getParentId() == null){
			jql.append("and parentId = ? ");
			values.add(query.getParentId());
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		treeManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	
	/**
	 * 查询单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		Tree model= treeManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}
	
	/**
	 * 查询列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		Tree query =  JSONUtils.deserialize(data, Tree.class);List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder( "from Tree where 1=1 ");
		
		if(!StringUtils.isEmpty(query.getDictType())){
			jql.append("and dictType = ? ");
			values.add(query.getDictType());
		}
		if(query.getParentId() == null || query.getParentId().equals("")){
			jql.append("and parentId is null ");
			//values.add(query.getParentId());
		} else {
			jql.append("and parentId = ? ");
			values.add(query.getParentId());
		}
		jql.append("order by key, sortId ");
		
		List<Tree> models = treeManager.find(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 根据多个dictType取对应的所有多级字典项第一级
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/listFirstLevel", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forListByColumnNames(@RequestParam(value = "data", defaultValue = "") String data) {
		@SuppressWarnings("rawtypes")
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idValues = new ArrayList<String>();
		idSql.append("SELECT tree from Tree tree WHERE parentId is null and dictType IN (");
		for(int i=0;i<ids.size();i++){
			idSql.append("?");
			idValues.add(ids.get(i).toString());
			if(i != ids.size()-1)idSql.append(",");
		}
		idSql.append(") order by key, sortId");
		
		List<Tree> models = treeManager.find(idSql.toString(), idValues.toArray());
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 查询列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/listByDictType", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forListByDictType(@RequestParam(value = "data", defaultValue = "") String data) {
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idValues = new ArrayList<String>();
		idSql.append("SELECT tree from Tree tree WHERE dictType IN (");
		for(int i=0;i<ids.size();i++){
			idSql.append("?");
			idValues.add(ids.get(i).toString());
			if(i != ids.size()-1)idSql.append(",");
		}
		idSql.append(") order by key, sortId");
		
		List<Tree> models = treeManager.find(idSql.toString(), idValues.toArray());
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 新建
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateMenu(@RequestBody String data){
		Tree model =  JSONUtils.deserialize(data, Tree.class);
		Date now =  new Date();
		HcpUser user = this.getCurrentUser();
		model.setCreateOper(user.getName());
		model.setCreateTime(now);
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
		//TODO 校验
		Tree saved = this.treeManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}
	
	/**
	 * 更新
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		Tree model =  JSONUtils.deserialize(data, Tree.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Date now =  new Date();
		HcpUser user = this.getCurrentUser();
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
		this.treeManager.save(model);
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 删除单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id){
		try {
			this.treeManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 删除多项
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/remove",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		@SuppressWarnings("rawtypes")
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM B_TREE_VALUE WHERE ID IN (");
			for(int i=0;i<ids.size();i++){
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size()-1)idSql.append(",");
			}
			idSql.append(")");
			this.treeManager.executeSql(idSql.toString(), idvalues.toArray());
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
