package com.infohold.el.web.rest;

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

import com.infohold.bdrp.Constants;
import com.infohold.bdrp.org.model.Org;
import com.infohold.core.dao.Page;
import com.infohold.core.exception.BaseException;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.JSONUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.el.base.model.AppAd;
import com.infohold.el.base.model.AppAdPos;
import com.infohold.el.base.model.Apps;

/**
 * APP广告管理
 * @author Administrator
 * TODO 添加登录机构的校验
 */
@RestController
@RequestMapping("/el/ad")
public class AppAdRestController extends BaseRestController {
	
	@Autowired
	private GenericManager<AppAd, String> appAdManager;
	@Autowired
	private GenericManager<AppAdPos, String> appAdPosManager;
	
	@Autowired
	private GenericManager<Apps, String> appsManager;
	/******************************************************运营端方法*************************************************************************/	
	/**
	 * 查询广告列表(运营端用)
	 * @param start
	 * @param pageSize
	 * @param state 1 - 正常                        2 - 下线
	 * APP端用户看上线的广告，运营维护人员看所有
	 * APP端 state=1;运营端state=0
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/mng/list/{adPosId}/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(
			@PathVariable(value = "adPosId") String adPosId,
			@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		if(adPosId == null || adPosId.equals(" ")){
			return ResultUtils.renderFailureResult("亲，广告位代码为空哦！");
		}
		StringBuilder sb = new StringBuilder("from AppAd where 1 = 1 ");
		List<String> params = new ArrayList<String>();
		sb.append(" and adPosId = ? ");
		params.add((String) adPosId);

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(sb.toString());
		page.setValues(params.toArray());
		this.appAdManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}
	/******************************************************运营端方法end*************************************************************************/	
	
	
	/******************************************************机构端方法*************************************************************************/	
	
	
	/**
	 * 查询机构拥有的广告位列表
	 * @param adPosId
	 * @return
	 */
	@RequestMapping(value = "/position/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPositionListInfo(@PathVariable("adPosId") String adPosId) {
		
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		
		List<Apps> apps = appsManager.find("from Apps where bizId = ? ", orgId);
		StringBuilder  sb = new StringBuilder();
		sb.append("from AppAdPos pos where appId in ( ");
		for(int i=0;i<apps.size();i++){
			if(i!=0)sb.append(",");
			sb.append("'").append(apps.get(i).getId()).append("'");
		}
		List<AppAdPos> posList= this.appAdPosManager.find(sb.toString());
		return ResultUtils.renderSuccessResult(posList);
	}
	
	/**
	 * 新增广告信息	
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		
		//TODO 校验登录机构
		AppAd model = JSONUtils.deserialize(data, AppAd.class);
		if(model.getAdPosId() == null || model.getAdPosId().equals("")){
			return ResultUtils.renderFailureResult("广告位不能为空");
		}
		if(model.getImage() == null || model.getImage().equals("")){
			return ResultUtils.renderFailureResult("图片路径不能为空");
		}
		
		int sortNo = model.getSortNum();
		
		List<AppAd> list = this.appAdManager.find("from AppAd where sortNum = ? ", sortNo);
		if(list.size() > 0){
			throw new BaseException("重复的序号");
		}
		/*for(int i = 0; i < list.size(); i ++){
			int sortNo1 = list.get(i).getSortNum();
			if(sortNo1 == sortNo){
				return ResultUtils.renderFailureResult("排序重复了，麻烦小主修改一下！");
			}
		}*/
		
		model = this.appAdManager.save(model);
		return ResultUtils.renderSuccessResult(model);
	}
	
	/**
	 * 查询广告信息
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		if(id == null || id.equals(" ")){
			return ResultUtils.renderFailureResult("亲，广告id为空哦！");
		}
		AppAd model = this.appAdManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}
	
	/**
	 * 维护广告信息
	 * @param id
	 * @param data
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id, @RequestBody String data) {
		if(id == null || id.equals(" ")){
			return ResultUtils.renderFailureResult("亲，广告id为空哦！");
		}
		AppAd model = this.appAdManager.get(id);//获取此条数据
		Map param =  JSONUtils.deserialize(data, Map.class);//前台传过来的数据进行反序列化 TODO
		
		if(null != param.get("adPosId")){
			model.setAdPosId(param.get("adPosId").toString());
		}
		if(null != param.get("image")){
			model.setImage(param.get("image").toString());
		}
		if(null != param.get("memo")){
			model.setMemo(param.get("memo").toString());
		}
		int sortNo = Integer.parseInt(String.valueOf(param.get("sortNum")));
		if(null != param.get("sortNum").toString()){
			List<AppAd> list = this.appAdManager.find("from AppAd where sortNum = ? ", sortNo);//TODO SORT直接查
			if(list.size() > 0){
				int sortNo1 = model.getSortNum();
				if(sortNo != sortNo1){
					throw new BaseException("排序重复了，麻烦小主修改一下！");
				}
			}
			model.setSortNum(sortNo);
		}
		if(null != param.get("linkArticle")){
			model.setLinkArticle(param.get("linkArticle").toString());
		}
		if(null != param.get("article")){
			model.setArticle(param.get("article").toString());
		}
		if(null != param.get("state")){
			model.setState(param.get("state").toString());
		}
		
		model = this.appAdManager.save(model);//保存
		return ResultUtils.renderSuccessResult(model);
	}
	
	/**
	 * 删除广告
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		if(id == null || id.equals(" ")){
			return ResultUtils.renderFailureResult("亲，广告id为空哦！");
		}
		AppAd model = this.appAdManager.delete(id);
		return ResultUtils.renderSuccessResult(model);
	}
	
	/**
	 * 首页广告上线   ELH_APP_004  HMP2.1
	 * @param id
	 * @param state
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/upline/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpline(@PathVariable("id") String id) {
		AppAd model = appAdManager.get(id);
		model.setState("1");		
		model = this.appAdManager.save(model);
		
		return ResultUtils.renderSuccessResult(model);		
	}
	/**
	 * 首页广告下线   ELH_APP_004  HMP2.1
	 * @param id
	 * @param state
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/offline/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forOffline(@PathVariable("id") String id) {
		AppAd model = appAdManager.get(id);
		model.setState("0");		
		model = this.appAdManager.save(model);
		
		return ResultUtils.renderSuccessResult(model);		
	}
	/******************************************************机构端方法end*************************************************************************/	
	
	/******************************************************app端方法*************************************************************************/	
	
	/**
	 * 查询广告列表(医院专属APP用)
	 * @param adPosId
	 * @return
	 */
	@RequestMapping(value = "/app/list/{adPosId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forListInfo(@PathVariable("adPosId") String adPosId) {
		List<AppAd> list = this.appAdManager.find("from AppAd where adPosId = ?", adPosId);
		
		return ResultUtils.renderSuccessResult(list);
	}
	/******************************************************app端方法end*************************************************************************/	
	
}




