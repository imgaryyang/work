package com.lenovohit.mnis.base.web.rest;

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
import com.lenovohit.core.web.controller.BaseController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.mnis.base.model.Description;

@RestController
@RequestMapping("/mnis/base/desc/")
public class SectionalDescRestController extends BaseController {
	
	@Autowired
	private GenericManager<Description, String> descriptionManager;
	

	@RequestMapping(value = "create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		Description model = JSONUtils.deserialize(data, Description.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		
		model = this.descriptionManager.save(model);
		return ResultUtils.renderSuccessResult(model);
	}
	
	@RequestMapping(value = "{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入Id为空！");
		}
		Description model = this.descriptionManager.get(id);
		
		return ResultUtils.renderSuccessResult(model);
	}
	
	@RequestMapping(value = "{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id, @RequestBody String data) {
		log.info("修改详情，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		Description model = JSONUtils.deserialize(data, Description.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入ID不可为空！");
		}

		Description tModel = this.descriptionManager.get(id);
		if (null == tModel) {
			throw new BaseException("更新记录不存在！");
		}
		if(model.getFkId() != null){
			tModel.setFkId(model.getFkId());;
		}
		if(model.getFkType() != null){
			tModel.setFkType(model.getFkType());;
		}
		if(model.getCaption() != null){
			tModel.setCaption(model.getCaption());;
		}
		if(model.getBody() != null){
			tModel.setBody(model.getBody());;
		}
		if(model.getSort() != null){
			tModel.setSort(model.getSort());;
		}
		
		tModel = this.descriptionManager.save(tModel);

		return ResultUtils.renderSuccessResult(tModel);
	}
	
	
	@RequestMapping(value = "{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入Id为空！");
		}
		Description model = this.descriptionManager.delete(id);
		
		return ResultUtils.renderSuccessResult(model);
	}
	
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start, @PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("查询列表数据，输入查询条件为：【" + data + "】");
		Description model = JSONUtils.deserialize(data, Description.class);
		
		StringBuffer jql = new StringBuffer("from Description n where 1=1 ");
		List<String> values = new ArrayList<String>();
		if(null != model){
			if(StringUtils.isNotBlank(model.getFkId())){
				jql.append(" and n.fkId = ?");
				values.add(model.getFkId());
			}
			if(StringUtils.isNotBlank(model.getFkType())){
				jql.append(" and n.fkType = ?");
				values.add(model.getFkType());
			}
			if(StringUtils.isNotBlank(model.getCaption())){
				jql.append(" and n.caption like ?");
				values.add("%"+ model.getCaption() +"%");
			}
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.descriptionManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}
	

	@RequestMapping(value = "/all", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAllList(@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("查询列表数据，输入查询条件为：【" + data + "】");
		Description model = JSONUtils.deserialize(data, Description.class);
		
		StringBuffer jql = new StringBuffer("from Description n where 1=1 ");
		List<String> values = new ArrayList<String>();
		if(null != model){
			if(StringUtils.isNotBlank(model.getFkId())){
				jql.append(" and n.fkId = ?");
				values.add(model.getFkId());
			}
			if(StringUtils.isNotBlank(model.getFkType())){
				jql.append(" and n.fkType = ?");
				values.add(model.getFkType());
			}
			if(StringUtils.isNotBlank(model.getCaption())){
				jql.append(" and n.caption like ?");
				values.add("%"+ model.getCaption() +"%");
			}
		}
		
		List<Description>list =this.descriptionManager.find(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(list);
	}
}
