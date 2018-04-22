package com.lenovohit.ssm.app.el.web.rest;

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
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.app.el.model.CardMenu;

/**
 * 合作银行网点信息管理
 * 
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/hwe/app/cardMenu")
public class CardMenuRestController extends BaseRestController {
	
	@Autowired
	private GenericManager<CardMenu, String> cardMenuManager;

	/**
	 * 
	 * 新增卡功能列表
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		CardMenu model = JSONUtils.deserialize(data, CardMenu.class);
		model = this.cardMenuManager.save(model);
		
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 查询卡功能列表
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		CardMenu model = this.cardMenuManager.get(id);
		
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 维护卡功能列表
	 * 
	 * @param id
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id,
			@RequestBody String data) {
		CardMenu model = this.cardMenuManager.get(id);
		model = this.cardMenuManager.save(model);
		
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 删除卡功能列表
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		CardMenu model = this.cardMenuManager.delete(id);
		
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * ELB_CARD_018  卡功能列表  P2.2
	 * 
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") String start,
			@PathVariable(value = "pageSize") String pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		
		String jql = " from CardMenu where 1=1 ";
		List<Object> values= new ArrayList<Object>();
		if(StringUtils.isNotEmpty(data)){
			jql += " and typeId = ? ";
			values.add(data);
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(jql);
		page.setValues(values.toArray());
		this.cardMenuManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}

}
