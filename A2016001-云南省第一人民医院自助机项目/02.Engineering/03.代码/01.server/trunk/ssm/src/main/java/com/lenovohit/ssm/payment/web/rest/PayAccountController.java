package com.lenovohit.ssm.payment.web.rest;

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
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.payment.model.PayAccount;

/**
 * 支付账户管理
 * 
 */
@RestController
@RequestMapping("/ssm/payment/account")
public class PayAccountController extends BaseRestController {
	@Autowired
	private GenericManager<PayAccount, String> payAccountManager;
	
	
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		PayAccount model = payAccountManager.get(id);
		return ResultUtils.renderPageResult(model);
	}
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery("from PayAccount where 1=1 payAccount by sort");
		payAccountManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<PayAccount> list = payAccountManager.findAll();
		return ResultUtils.renderSuccessResult(list);
	}
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreate(@RequestBody String data){
		PayAccount model =  JSONUtils.deserialize(data, PayAccount.class);
		//TODO 校验
		PayAccount saved = this.payAccountManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		PayAccount model =  JSONUtils.deserialize(data, PayAccount.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult();
		}
		this.payAccountManager.save(model);

		return ResultUtils.renderSuccessResult();
	}
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id){
		try {
			this.payAccountManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
}
