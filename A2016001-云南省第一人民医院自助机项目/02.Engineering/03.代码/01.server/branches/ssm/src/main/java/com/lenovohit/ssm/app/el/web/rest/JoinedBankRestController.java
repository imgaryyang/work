package com.lenovohit.ssm.app.el.web.rest;

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
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.app.el.model.JoinedBank;

/**
 * 合作银行信息管理
 * 
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/hwe/app/joinedBank")
public class JoinedBankRestController extends BaseRestController {

	@Autowired
	private GenericManager<JoinedBank, String> joinedBankManager;

	/**
	 * 
	 * 新增合作银行信息
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
	public Result forList(@PathVariable(value = "start") String start,
			@PathVariable(value = "pageSize") String pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery("from JoinedBank ");
		this.joinedBankManager.findPage(page);
		return ResultUtils.renderSuccessResult(page);
	}

}
