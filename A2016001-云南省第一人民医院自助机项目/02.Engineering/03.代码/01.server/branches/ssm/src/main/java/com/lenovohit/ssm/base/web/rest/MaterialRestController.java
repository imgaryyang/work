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
import com.lenovohit.ssm.base.model.User;



@RestController
@RequestMapping("/ssm/base/material")
public class MaterialRestController extends SSMBaseRestController {
	@Autowired
	private GenericManagerImpl<Material,String> materialManager;
	
	/**
	 * 保存材料
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreateMaterial(@RequestBody String data){
		Material material = JSONUtils.deserialize(data, Material.class);
		Date now =  new Date();
		String time = DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss");
		material.setCreateTime(time);
		User user = this.getCurrentUser();
		material.setCreateUser(user.getName());
		Material saved = this.materialManager.save(material);
		return ResultUtils.renderSuccessResult(saved);
	}
	/**
	 * 修改材料信息
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		Material model =  JSONUtils.deserialize(data, Material.class);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Material material = this.materialManager.get(model.getId());
		material.setAccount(model.getAccount());
		Date now =  new Date();
		String time = DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss");
		material.setCreateTime(time);
		material.setUnit(model.getUnit());
		material.setSupplier(model.getSupplier());
		material.setRemark(model.getRemark());
		this.materialManager.save(material);
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 查询材料数量
	 */
	@RequestMapping(value = "/selectAccount/{data}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result selectAccount(@PathVariable("data") String data) {
		Material material = null;
		int account = 0;
		if(data != null &&  data != ""){
			material = this.materialManager.get(data);
			account = material.getAccount();
		}
		return ResultUtils.renderSuccessResult(account);
	}
	/**
	 * 删除材料信息
	 */
	@RequestMapping(value = "/delete", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@RequestBody String data) {
		Material model =  JSONUtils.deserialize(data, Material.class);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		this.materialManager.delete(model);
		return ResultUtils.renderSuccessResult();
	}
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
		Material query =  JSONUtils.deserialize(data, Material.class);
		StringBuilder jql = new StringBuilder( " from Material where 1=1 ");
		List<Object> values = new ArrayList<Object>();

		if(!StringUtils.isEmpty(query.getName())){
			jql.append(" and name like ? ");
			values.add("%"+query.getName()+"%");
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		materialManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
	}
	/**
	 * 查询所有材料
	 */
	@RequestMapping(value = "/loadMaterials", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMaterials(){
		List<Material> list = materialManager.find(" from Material ");
		return ResultUtils.renderSuccessResult(list);
	}
}
