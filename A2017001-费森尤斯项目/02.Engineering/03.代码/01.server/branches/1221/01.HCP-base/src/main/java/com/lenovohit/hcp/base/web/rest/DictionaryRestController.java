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
import com.lenovohit.hcp.base.utils.PinyinUtil;
import com.lenovohit.hcp.base.utils.WubiUtil;

/**
 * 单级数据字典管理
 */
@RestController
@RequestMapping("/hcp/base/dictionary")
public class DictionaryRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<Dictionary, String> dictionaryManager;
	
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
		Dictionary query =  JSONUtils.deserialize(data, Dictionary.class);
		StringBuilder jql = new StringBuilder( "from Dictionary where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
		jql.append(" and hosId = ? ");
		values.add(user.getHosId());
		if(!StringUtils.isEmpty(query.getColumnGroup())){
			jql.append("and ( columnGroup like ? or columnDis like ? ) ");
			values.add("%"+query.getColumnGroup()+"%");
			values.add("%"+query.getColumnGroup()+"%");
		}
		if(!StringUtils.isEmpty(query.getColumnName())){
			jql.append("and columnName = ? ");
			values.add(query.getColumnName().toUpperCase());
		}
		if(!StringUtils.isEmpty(query.getColumnDis())){
			jql.append("and columnDis = ? ");
			values.add(query.getColumnDis());
		}
		

		if(!StringUtils.isEmpty(query.getColumnKey())){
			jql.append("and columnKey like ? ");
			values.add("%"+query.getColumnKey()+"%");
		}
		if(!StringUtils.isEmpty(query.getColumnVal())){
			jql.append("and columnVal like ? ");
			values.add("%"+query.getColumnVal()+"%");
		}
		//增加排序字段
		jql.append("order by columnGroup, columnName, sortId ");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		dictionaryManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	
	/**
	 * 查询单项
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		Dictionary model= dictionaryManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}
	
	/**
	 * 查询列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Dictionary> models = dictionaryManager.findAll();
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 新建
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateMenu(@RequestBody String data){
		Dictionary model =  JSONUtils.deserialize(data, Dictionary.class);
		System.out.println(model);
		model.setSpellCode(PinyinUtil.getFirstSpell(model.getColumnVal()));
		model.setWbCode(WubiUtil.getWBCode(model.getColumnVal()));
		//TODO 校验
		String sqlv1="select * from b_dicvalue where COLUMN_GROUP=? and COLUMN_KEY=? and HOS_ID = ? and COLUMN_NAME = ? ";
		String sqlv2="select * from b_dicvalue where COLUMN_GROUP=? and COLUMN_VAL=? and HOS_ID = ? and COLUMN_NAME = ? ";
		List<Object> values1=new ArrayList<Object>();
		values1.add(model.getColumnGroup());
		values1.add(model.getColumnKey());
		values1.add(this.getCurrentUser().getHosId());
		values1.add(model.getColumnName());
		List<Object> values2=new ArrayList<Object>();
		values2.add(model.getColumnGroup());
		values2.add(model.getColumnVal());
		values2.add(this.getCurrentUser().getHosId());
		values2.add(model.getColumnName());
		List<Dictionary> keys=(List<Dictionary>) this.dictionaryManager.findBySql(sqlv1, values1.toArray());
		List<Dictionary> values=(List<Dictionary>) this.dictionaryManager.findBySql(sqlv2, values2.toArray());
		if(keys.size()!=0){
			return ResultUtils.renderFailureResult("该分类下的键已存在");
		}
		else if(values.size()!=0){
			return ResultUtils.renderFailureResult("该分类下的值已存在");
		}
		else{
			Dictionary saved = this.dictionaryManager.save(model);
			return ResultUtils.renderSuccessResult(saved);
		}
		
	}
	
	/**
	 * 更新
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		Dictionary model =  JSONUtils.deserialize(data, Dictionary.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		model.setSpellCode(PinyinUtil.getFirstSpell(model.getColumnVal()));
		model.setWbCode(WubiUtil.getWBCode(model.getColumnVal()));
		this.dictionaryManager.save(model);
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
			this.dictionaryManager.delete(id);
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
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		@SuppressWarnings("rawtypes")
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM B_DICVALUE  WHERE ID IN (");
			for(int i=0;i<ids.size();i++){
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size()-1)idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.dictionaryManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 获取字典所有类型
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/type/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTypeList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Dictionary> models = dictionaryManager.find(" select distinct dict.columnGroup as columnGroup, dict.columnName as columnName, dict.columnDis as columnDis from Dictionary dict where 1 = 1 ");
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 根据多个columnName取对应的所有字典项
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/listByColName", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forListByColumnNames(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			@SuppressWarnings("rawtypes")
			List ids =  JSONUtils.deserialize(data, List.class);
			StringBuilder idSql = new StringBuilder();
			List<String> idValues = new ArrayList<String>();
			String hosId = this.getCurrentUser().getHosId();
			idValues.add(hosId);
			
			idSql.append("SELECT dict from Dictionary dict WHERE dict.hosId = ? and columnName IN (");
			for(int i=0;i<ids.size();i++){
				idSql.append("?");
				idValues.add(ids.get(i).toString());
				if(i != ids.size()-1)idSql.append(",");
			}
			idSql.append(") and stop = true order by columnName");
			List<Dictionary> models = dictionaryManager.find(idSql.toString(), idValues.toArray());
			return ResultUtils.renderSuccessResult(models);
		} catch (Exception e) {
			return ResultUtils.renderFailureResult("查询失败");
		}
	}
	
	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}

}
