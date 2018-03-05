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
import com.lenovohit.mnis.base.model.ContactWays;

@RestController
@RequestMapping("/mnis/base/contact/")
public class ContactRestController extends BaseController {
	
	@Autowired
	private GenericManager<ContactWays, String> contactWaysManager;
	
	@RequestMapping(value = "create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		ContactWays model = JSONUtils.deserialize(data, ContactWays.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		
		model = this.contactWaysManager.save(model);
		return ResultUtils.renderSuccessResult(model);
	}
	
	@RequestMapping(value = "{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入Id为空！");
		}
		ContactWays model = this.contactWaysManager.get(id);
		
		return ResultUtils.renderSuccessResult(model);
	}
	
	@RequestMapping(value = "{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id, @RequestBody String data) {
		log.info("修改详情，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		ContactWays model = JSONUtils.deserialize(data, ContactWays.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入ID不可为空！");
		}

		ContactWays tModel = this.contactWaysManager.get(id);
		if (null == tModel) {
			throw new BaseException("更新记录不存在！");
		}
		if(model.getFkId() != null){
			tModel.setFkId(model.getFkId());;
		}
		if(model.getFkType() != null){
			tModel.setFkType(model.getFkType());;
		}
		if(model.getType() != null){
			tModel.setType(model.getType());;
		}
		if(model.getContent() != null){
			tModel.setContent(model.getContent());;
		}
		if(model.getMemo() != null){
			tModel.setMemo(model.getMemo());;
		}
		
		tModel = this.contactWaysManager.save(tModel);

		return ResultUtils.renderSuccessResult(tModel);
	}
	
	
	@RequestMapping(value = "{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入Id为空！");
		}
		ContactWays model = this.contactWaysManager.delete(id);
		
		return ResultUtils.renderSuccessResult(model);
	}
	
	
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start, @PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("查询列表数据，输入查询条件为：【" + data + "】");
		ContactWays model = JSONUtils.deserialize(data, ContactWays.class);
		
		StringBuffer jql = new StringBuffer("from ContactWays n where 1=1 ");
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
			if(StringUtils.isNotBlank(model.getType())){
				jql.append(" and n.type = ?");
				values.add(model.getType());
			}
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.contactWaysManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}
	
	@RequestMapping(value = "/all", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAllList(@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("查询列表数据，输入查询条件为：【" + data + "】");
		ContactWays model = JSONUtils.deserialize(data, ContactWays.class);
		
		StringBuffer jql = new StringBuffer("from ContactWays n where 1=1 ");
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
			if(StringUtils.isNotBlank(model.getType())){
				jql.append(" and n.type = ?");
				values.add(model.getType());
			}
		}
		
		List<ContactWays> list = this.contactWaysManager.find(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(list);
	}
}
