package com.lenovohit.hcp.pharmacy.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.pharmacy.manager.PhaAdjustManager;
import com.lenovohit.hcp.pharmacy.model.PhaAdjust;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;

@RestController
@RequestMapping("/hcp/pharmacy/phaAdjust")
public class PhaAdjustRestController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<PhaAdjust, String> phaAdjustManager;
	
	@Autowired
	private PhaAdjustManager phaAdjustMng;	
	
	/**
	 * 分页查询
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data){
		PhaAdjust query =  JSONUtils.deserialize(data, PhaAdjust.class);
		StringBuilder jql = new StringBuilder( "from PhaAdjust where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		if(!StringUtils.isEmpty(query.getDrugType())){
			jql.append(" and drugType like ? ");
			values.add("%"+query.getDrugType()+"%");
		}
		if(!StringUtils.isEmpty(query.getTradeName())){
			jql.append(" and (tradeName like ? or drugCode like ?) ");
			values.add("%"+query.getTradeName()+"%");
			values.add("%"+query.getTradeName()+"%");
		}
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		phaAdjustManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	
	/**
	 * 查询单项
	 * @param id
	 * @return
	 */ 
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		PhaAdjust model= phaAdjustManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}
	
	/**
	 * 查询列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<PhaAdjust> models = phaAdjustManager.findAll();
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 新建
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateMenu(@RequestBody String data){
		//调价单数据集
		List<PhaAdjust> adjustList = JSONUtils.parseObject(data, new TypeReference<List<PhaAdjust>>(){});
		//药品信息数据集
		List<PhaDrugInfo> drugList = JSONUtils.parseObject(data, new TypeReference<List<PhaDrugInfo>>(){});
		
		HcpUser user = this.getCurrentUser();
		
		phaAdjustMng.create(adjustList, drugList, user);
		
		return ResultUtils.renderSuccessResult();
	}
	
	
	
}
