package com.lenovohit.hwe.base.web.rest;

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

import com.lenovohit.bdrp.Constants;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.controller.BaseController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.base.model.News;
import com.lenovohit.hwe.org.model.Org;

@RestController
@RequestMapping("/hwe/base/news")
public class NewsRestController extends BaseController {
	
	@Autowired
	private GenericManager<News, String> newsManager;
	

	@RequestMapping(value = "/", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		News model = JSONUtils.deserialize(data, News.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		Date now = new Date();
		
		model.setUpdatedAt(now);
		model.setCreatedAt(now);
		//model.setState(News.NEWS_STATUE_ON);
		model = this.newsManager.save(model);
		
		return ResultUtils.renderSuccessResult(model);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id, @RequestBody String data) {
		log.info("修改详情，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}
	
		News model = JSONUtils.deserialize(data, News.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入ID不可为空！");
		}
	
		News tModel = this.newsManager.get(id);
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
		if(model.getDigest() != null){
			tModel.setDigest(model.getDigest());;
		}
		if(model.getBody() != null){
			tModel.setBody(model.getBody());;
		}
		if(model.getImage() != null){
			tModel.setImage(model.getImage());;
		}
		if(model.getFeededBy() != null){
			tModel.setFeededBy(model.getFeededBy());;
		}
		tModel = this.newsManager.save(tModel);
	
		return ResultUtils.renderSuccessResult(tModel);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入Id为空！");
		}
		News model = this.newsManager.get(id);
		
		return ResultUtils.renderSuccessResult(model);
	}

	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit, 
			@RequestParam(value = "data", defaultValue = "") String data){
		News model = JSONUtils.deserialize(data, News.class);
		if(model.getFkType()!=null&&model.getFkType()!=""){
			StringBuffer jql = new StringBuffer("from News n where 1=1 ");
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
				if(StringUtils.isNotBlank(model.getFeededBy())){
					jql.append(" and n.feededBy like ?");
					values.add("%"+ model.getFeededBy() +"%");
				}
			}
			jql.append(" order by createdAt desc");
			
			Page page = new Page();
			page.setStart(start);
			page.setPageSize(limit);
			page.setQuery(jql.toString());
			page.setValues(values.toArray());
			this.newsManager.findPage(page);
			
			return ResultUtils.renderSuccessResult(page);
		}else{
			return ResultUtils.renderFailureResult("类型不能为空");
		}
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		News query =  JSONUtils.deserialize(data, News.class);
		StringBuilder jql = new StringBuilder(" from News where 1=1 ");
		List<Object> values = new ArrayList<Object>();

		if(!StringUtils.isEmpty(query.getFkId())){
			jql.append(" and fkId = ? ");
			values.add(query.getFkId());
		}
		if(!StringUtils.isEmpty(query.getFkType())){
			jql.append(" and fkType = ? ");
			values.add(query.getFkType());
		}
		if(!StringUtils.isEmpty(query.getCaption())){
			jql.append(" and caption like ? ");
			values.add("'%"+ query.getCaption() + "%'");
		}
		if(!StringUtils.isEmpty(query.getDigest())){
			jql.append(" and digest like ? ");
			values.add("'%"+ query.getDigest() + "%'");
		}
		jql.append("order by createdAt");
		List<News> models = this.newsManager.find(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(models);
	}
	
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemove(@PathVariable("id") String id) {
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入Id为空！");
		}
		this.newsManager.delete(id);
		
		return ResultUtils.renderSuccessResult();
	}

	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemoveAll(@RequestBody String data){
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM BASE_NEWS  WHERE ID IN (");
			for(int i = 0 ; i < ids.size() ; i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			this.newsManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	@RequestMapping(value = "/upLine/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpLine(@PathVariable("id") String id) {
		News tModel = this.newsManager.get(id);
		if (null == tModel) {
			throw new BaseException("更新记录不存在！");
		}
		tModel.setStatus("0");//0下线，与pd不一致
		tModel = this.newsManager.save(tModel);
		
		return ResultUtils.renderSuccessResult(tModel);
	}
	
	@RequestMapping(value = "/offLine/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forOffLine(@PathVariable("id") String id) {
		News tModel = this.newsManager.get(id);
		if (null == tModel) {
			throw new BaseException("更新记录不存在！");
		}
		tModel.setStatus("1");//0下线，与pd不一致
		tModel = this.newsManager.save(tModel);
		
		return ResultUtils.renderSuccessResult(tModel);
	}
	
	@RequestMapping(value = "/org/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forOrgCreate(@RequestBody String data) {
		
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		News model = JSONUtils.deserialize(data, News.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		
		model.setFkId(orgId);
		model = this.newsManager.save(model);
		return ResultUtils.renderSuccessResult(model);
	}
	
	@RequestMapping(value = "/org/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forOrgInfo(@PathVariable("id") String id) {
		
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		
		if (StringUtils.isEmpty(id) && StringUtils.isEmpty(orgId) ) {
			throw new BaseException("输入Id为空！");
		}
		News model = this.newsManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}
	
	@RequestMapping(value = "/org/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forOrgUpdate(@PathVariable("id") String id, @RequestBody String data) {
		
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		
		log.info("修改详情，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		News model = JSONUtils.deserialize(data, News.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入ID不可为空！");
		}

		News tModel = this.newsManager.get(id);
		
		if (null == tModel) {
			throw new BaseException("更新记录不存在！");
		}
		
		if(!orgId.equals(tModel.getFkId())){
			return ResultUtils.renderFailureResult("不能修改其他机构的新闻");
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
		if(model.getDigest() != null){
			tModel.setDigest(model.getDigest());;
		}
		if(model.getBody() != null){
			tModel.setBody(model.getBody());;
		}
		if(model.getImage() != null){
			tModel.setImage(model.getImage());;
		}
		if(model.getFeededBy() != null){
			tModel.setFeededBy(model.getFeededBy());;
		}
		
		tModel = this.newsManager.save(tModel);

		return ResultUtils.renderSuccessResult(tModel);
	}
	@RequestMapping(value = "/org/upLine/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forOrgUpLine(@PathVariable("id") String id) {
		
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		
		News tModel = this.newsManager.get(id);
		if (null == tModel) {
			throw new BaseException("更新记录不存在！");
		}
		if(!orgId.equals(tModel.getFkId())){
			return ResultUtils.renderFailureResult("不能修改其他机构的新闻");
		}
		tModel.setStatus("1");//0下线，与pd不一致
		tModel = this.newsManager.save(tModel);
		return ResultUtils.renderSuccessResult(tModel);
	}
	@RequestMapping(value = "/org/offLine/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forOrgOffLine(@PathVariable("id") String id) {
		
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		
		News tModel = this.newsManager.get(id);
		if (null == tModel) {
			throw new BaseException("更新记录不存在！");
		}
		if(!orgId.equals(tModel.getFkId())){
			return ResultUtils.renderFailureResult("不能修改其他机构的新闻");
		}
		tModel.setStatus("0");//0下线，与pd不一致
		tModel = this.newsManager.save(tModel);
		return ResultUtils.renderSuccessResult(tModel);
	}
	
	@RequestMapping(value = "/org/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forOrgDelete(@PathVariable("id") String id) {
		
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入Id为空！");
		}
		News model = this.newsManager.delete(id);
		if(!orgId.equals(model.getFkId())){
			return ResultUtils.renderFailureResult("不能修改其他机构的新闻");
		}
		return ResultUtils.renderSuccessResult(model);
	}
	
	
	@RequestMapping(value = "/org/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forOrgList(@PathVariable(value = "start") int start, @PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		
		log.info("查询列表数据，输入查询条件为：【" + data + "】");
		News model = JSONUtils.deserialize(data, News.class);
		
		StringBuffer jql = new StringBuffer("from News n where fkId = ? ");
		List<String> values = new ArrayList<String>();
		values.add(orgId);
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
			if(StringUtils.isNotBlank(model.getFeededBy())){
				jql.append(" and n.feededBy like ?");
				values.add("%"+ model.getFeededBy() +"%");
			}
		}
		jql.append(" order by createdAt desc");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.newsManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}
}
