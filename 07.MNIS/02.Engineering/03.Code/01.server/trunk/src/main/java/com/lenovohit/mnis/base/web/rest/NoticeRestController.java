package com.lenovohit.mnis.base.web.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
import com.lenovohit.mnis.base.manager.SendNoticeManager;
import com.lenovohit.mnis.base.model.Notice;
import com.lenovohit.mnis.org.model.User;

@RestController
@RequestMapping("/mnis/base/notice/")
public class NoticeRestController extends BaseController {
	
	@Autowired
	private GenericManager<Notice, String> noticeManager;
	@Autowired
	private GenericManager<User, String> userManager;
	

	@RequestMapping(value = "create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		Notice model = JSONUtils.deserialize(data, Notice.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		
//			model.setUpdatedAt(updatedAt);
//			model.setCreatedAt(createdAt);
//			model.setUpdatedBy(updatedBy);
//			model.setCreatedBy(createdBy);
		model.setStatus(Notice.NOT_STATUE_INIT);
		
		model = this.noticeManager.save(model);
		return ResultUtils.renderSuccessResult(model);
	}
	
	@RequestMapping(value = "{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入Id为空！");
		}
		Notice model = this.noticeManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}
	
	@RequestMapping(value = "{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id, @RequestBody String data) {
		log.info("修改详情，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		Notice model = JSONUtils.deserialize(data, Notice.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入ID不可为空！");
		}

		Notice tModel = this.noticeManager.get(id);
		if (null == tModel) {
			throw new BaseException("更新记录不存在！");
		}
		if(model.getTitle() != null){
			tModel.setTitle(model.getTitle());;
		}
		if(model.getContent() != null){
			tModel.setContent(model.getContent());;
		}
		if(model.getTarget() != null){
			tModel.setTarget(model.getTarget());;
		}
		if(model.getType() != null){
			tModel.setType(model.getType());;
		}
		if(model.getMode() != null){
			tModel.setMode(model.getMode());;
		}
		if(model.getAppId() != null){
			tModel.setAppId(model.getAppId());;
		}
		if(model.getReceiverType() != null){
			tModel.setReceiverType(model.getReceiverType());;
		}
		if(model.getReceiverValue() != null){
			tModel.setReceiverValue(model.getReceiverValue());;
		}
		if(model.getOrgId() != null){
			tModel.setOrgId(model.getOrgId());;
		}
		if(model.getOrgName() != null){
			tModel.setOrgName(model.getOrgName());;
		}
		if(model.getMemo() != null){
			tModel.setMemo(model.getMemo());;
		}
		if(model.getStatus() != null){
			tModel.setStatus(model.getStatus());;
		}
		
		tModel = this.noticeManager.save(tModel);

		return ResultUtils.renderSuccessResult(tModel);
	}
	
	
	@RequestMapping(value = "{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入Id为空！");
		}
		Notice model = this.noticeManager.delete(id);
		
		return ResultUtils.renderSuccessResult(model);
	}
	
	
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start, @PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("查询列表数据，输入查询条件为：【" + data + "】");
		Notice model = JSONUtils.deserialize(data, Notice.class);
		
		StringBuffer jql = new StringBuffer("from Notice n where 1=1 ");
		List<String> values = new ArrayList<String>();
		if(null != model){
			if(StringUtils.isNotBlank(model.getTitle())){
				jql.append(" and n.title like ?");
				values.add("%"+ model.getTitle() +"%");
			}
			if(StringUtils.isNotBlank(model.getContent())){
				jql.append(" and n.content like ?");
				values.add("%"+ model.getContent() +"%");
			}
			if(StringUtils.isNotBlank(model.getTarget())){
				jql.append(" and n.target = ?");
				values.add( model.getTarget());
			}
			if(StringUtils.isNotBlank(model.getType())){
				jql.append(" and n.type = ?");
				values.add(model.getType());
			}
			if(StringUtils.isNotBlank(model.getMode())){
				jql.append(" and n.mode = ?");
				values.add(model.getMode());
			}
			if(StringUtils.isNotBlank(model.getAppId())){
				jql.append(" and n.appId like ?");
				values.add("%"+ model.getAppId() +"%");
			}
			if(StringUtils.isNotBlank(model.getReceiverType())){
				jql.append(" and n.receiverType = ?");
				values.add(model.getReceiverType());
			}
			if(StringUtils.isNotBlank(model.getReceiverValue())){
				jql.append(" and n.receiverValue like ?");
				values.add("%"+ model.getReceiverValue() +"%");
			}
			if(StringUtils.isNotBlank(model.getStatus())){
				jql.append(" and n.status = ?");
				values.add(model.getStatus());
			}
		}
		jql.append(" order by createdAt desc");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.noticeManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/my/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyList(@PathVariable(value = "start") int start, @PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("查询列表数据，输入查询条件为：【" + data + "】");
		Map map = JSONUtils.deserialize(data, Map.class);
		
		//User _user = (User)this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		//User _appUser = userManager.findOne("from User where appId=? and userId=?", _user.getAppId(), _user.getId());
		
		StringBuffer jql = new StringBuffer("from Notice n where 1=1 ");
		List<String> values = new ArrayList<String>();
		if(null != map){
			if(StringUtils.isNotBlank(objectToString(map.get("title")))){
				jql.append(" and n.title like ?");
				values.add("%"+ objectToString(map.get("title")) +"%");
			}
			if(StringUtils.isNotBlank(objectToString(map.get("target")))){
				jql.append(" and n.target = ?");
				values.add(objectToString(map.get("target")));
			}
			if(StringUtils.isNotBlank(objectToString(map.get("type")))){
				jql.append(" and n.type = ?");
				values.add(objectToString(map.get("type")));
			}
			if(StringUtils.isNotBlank(objectToString(map.get("mode")))){
				jql.append(" and n.mode = ?");
				values.add(objectToString(map.get("mode")));
			}
			//jql.append(" and n.appId like ?");
			//values.add("%"+ _user.getAppId() +"%");
			//jql.append(" and n.receiverType='0' or (n.receiverType='1' and receiverValue like ?) or (n.receiverType='2' and receiverValue like ?");
			//values.add("%"+ _user.getId() +"%");
			//values.add("%"+ _appUser.getLogGroups() +"%");
		}
		
		jql.append(" and n.state!='0' order by n.createdAt desc");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.noticeManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}

	private static String  objectToString(Object obj){
		if(obj==null) return "";
		return obj.toString();
	}
}
