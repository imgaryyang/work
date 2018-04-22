package com.lenovohit.ssm.base.web.rest;

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

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.impl.GenericManagerImpl;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.Material;
import com.lenovohit.ssm.base.model.MaterialDetailIn;
import com.lenovohit.ssm.base.model.User;

@RestController
@RequestMapping("/ssm/base/materialDetailIn")
public class MaterialDetailInRestController extends SSMBaseRestController {
	@Autowired
	private GenericManagerImpl<MaterialDetailIn, String> materialDetailInManager;
	@Autowired
	private GenericManagerImpl<Material, String> materialManager;
	
	
	/**
	 * 入库信息保存
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreateMaterial(@RequestBody String data){
		MaterialDetailIn materialDetail = JSONUtils.deserialize(data, MaterialDetailIn.class);
		
		User user = this.getCurrentUser();
		materialDetail.setOperator(user.getName());
		Date now =  new Date();
		String time = DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss");
		materialDetail.setInPutTime(time);
		MaterialDetailIn saved = this.materialDetailInManager.save(materialDetail);
		
		String id = materialDetail.getMaterial().getId();
		Material material = materialManager.get(id);
		int account = materialDetail.getInPutAccount();
		int oldAccount = material.getAccount();
		int newAccount = account + oldAccount;
		material.setAccount(newAccount);
		materialManager.save(material);
		return ResultUtils.renderSuccessResult(saved);
	}
	/**
	 * 同步材料数量
	 */
	public void updateMaterialAccount(String id){
		StringBuilder jql = new StringBuilder(" select sum(inPutAccount) from MaterialDetailIn where material.id = ?");
		long account = materialDetailInManager.getCount(jql.toString(), id);
		System.out.println(account);
	}
	/**
	 * 修改入库信息
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		MaterialDetailIn model =  JSONUtils.deserialize(data, MaterialDetailIn.class);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		User user = this.getCurrentUser();
		model.setOperator(user.getName());
		Date now =  new Date();
		String time = DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss");
		model.setInPutTime(time);
		//获取原来的入库数
		MaterialDetailIn materialDetailIn = this.materialDetailInManager.get(model.getId());
		int oldAccount = materialDetailIn.getInPutAccount();
		//获取新的入库数
		int inPutAccount = model.getInPutAccount();
		Material material = this.materialManager.get(materialDetailIn.getMaterial().getId());
		int account = material.getAccount();
		int newAccount = account + (inPutAccount-oldAccount);
		material.setAccount(newAccount);
		
		this.materialDetailInManager.save(model);
		this.materialManager.save(material);
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 删除入库信息
	 */
	@RequestMapping(value = "/delete", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@RequestBody String data) {
		MaterialDetailIn model =  JSONUtils.deserialize(data, MaterialDetailIn.class);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		MaterialDetailIn materialDetailIn = this.materialDetailInManager.get(model.getId());
		int inPutAccount = materialDetailIn.getInPutAccount();
		
		Material material = this.materialManager.get(materialDetailIn.getMaterial().getId());
		int account = material.getAccount();
		int newAccount = account - inPutAccount;
		material.setAccount(newAccount);
		this.materialManager.save(material);
		this.materialDetailInManager.delete(model);
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 分页查询
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/in/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data){
		MaterialDetailIn query =  JSONUtils.deserialize(data, MaterialDetailIn.class);
		List<Object> values = new ArrayList<Object>();
		Page page = new Page();
		StringBuilder jql = new StringBuilder( " from MaterialDetailIn where 1=1 ");
		if(query.getMaterial()!=null){
			if(query.getMaterial().getId()!=null && query.getMaterial().getId()!=""){
				jql.append(" and material.id = ?");
				values.add(query.getMaterial().getId());
			}
		}
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		materialManager.findPage(page);
		materialDetailInManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
}
