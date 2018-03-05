package com.infohold.el.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.infohold.core.dao.Page;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.JSONUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.el.base.model.JoinedBank;

/**
 * 合作银行信息管理
 * 
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/el/joinedBank")
public class JoinedBankRestController extends BaseRestController {

	@Autowired
	private GenericManager<JoinedBank, String> joinedBankManager;

	/**
	 * 
	 * 维护合作银行信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		JoinedBank model = JSONUtils.deserialize(data, JoinedBank.class);
		model = this.joinedBankManager.save(model);
		
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * ELB_ORG_007 查询合作银行信息 P2.3/P2.2
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		JoinedBank model = this.joinedBankManager.get(id);
		
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 维护合作银行信息
	 * 
	 * @param id
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id,
			@RequestBody String data) {
		JoinedBank model = this.joinedBankManager.get(id);
		model = this.joinedBankManager.save(model);
		
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 删除合作银行信息
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		JoinedBank model = this.joinedBankManager.delete(id);
		
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 查询合作银行列表
	 * 
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery("from JoinedBank ");
		this.joinedBankManager.findPage(page);
		return ResultUtils.renderSuccessResult(page);
	}

}
