package com.lenovohit.el.web.rest;

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
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.el.base.model.BankBranch;
import com.lenovohit.el.base.model.JoinedBank;

/**
 * 合作银行网点信息管理
 * 
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/el/bankBranch")
public class BankBranchRestController extends BaseRestController {
	
	@Autowired
	private GenericManager<BankBranch, String> bankBranchManager;
	
	@Autowired
	private GenericManager<JoinedBank, String> joinedBankManager;
	
	/**
	 * 
	 * 维护合作银行网点信息
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		BankBranch model = JSONUtils.deserialize(data, BankBranch.class);
		model = this.bankBranchManager.save(model);
		
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 查询合作银行网点信息
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		BankBranch model = this.bankBranchManager.get(id);
		
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 维护合作银行网点信息
	 * 
	 * @param id
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id,
			@RequestBody String data) {
		BankBranch model = this.bankBranchManager.get(id);
		model = this.bankBranchManager.save(model);
		
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * 删除合作银行网点信息
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		BankBranch model = this.bankBranchManager.delete(id);
		
		return ResultUtils.renderSuccessResult(model);
	}

	/**
	 * ELB_ORG_009  查询合作银行网点列表 P2.3.1
	 * 包含客服热线电话号码
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@SuppressWarnings({ "rawtypes"})
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam() String data) {
		
		Map map = JSONUtils.deserialize(data, Map.class);
		JoinedBank joinedBank = joinedBankManager.findOne("from JoinedBank t where t.bankNo=?", map.get("bankNo"));

		if(joinedBank==null){
			return ResultUtils.renderFailureResult("非合作银行暂时不提供银行网点查询服务");
		}
		StringBuffer jql = new StringBuffer(" from BankBranch where 1=1 ");
		List<String> values= new ArrayList<String>();
		if(joinedBank!=null && StringUtils.isNotEmpty(joinedBank.getId())){
			jql.append(" and bankId = ? ");
			values.add(joinedBank.getId());
		}
		if(map.get("cond")!=null && StringUtils.isNotEmpty(map.get("cond").toString())){
			jql.append(" and name like ? ");
			values.add("%"+map.get("cond").toString()+"%");
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.bankBranchManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}

}
