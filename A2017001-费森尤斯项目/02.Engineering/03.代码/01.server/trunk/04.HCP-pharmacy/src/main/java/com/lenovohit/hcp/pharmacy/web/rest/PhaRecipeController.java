package com.lenovohit.hcp.pharmacy.web.rest;

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
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.pharmacy.manager.PhaRecipeBackManager;
import com.lenovohit.hcp.pharmacy.model.PhaDrugPriceView;
import com.lenovohit.hcp.pharmacy.model.PhaRecipe;
import com.lenovohit.hcp.pharmacy.model.RecipeInfo;

@RestController
@RequestMapping("/hcp/pharmacy/phaRecipe/")
public class PhaRecipeController extends HcpBaseRestController {
	private static final String PAYED_UNGET_MEDICINE = "1";// 缴费未发药
	private static final String PAYED_GET_MIDICINE = "2";// 已发药
	private static final String PAYED_BACK_MEDICINE = "3";// 已退药
	private static final String PAYBACK_MEDICINE = "4";// 已退费
	@Autowired
	private GenericManager<PhaRecipe, String> phaRecipeManager;
	@Autowired
	private GenericManager<RecipeInfo, String> recipeInfoManager;
	@Autowired
	private GenericManager<PhaDrugPriceView, String> phaDrugPriceViewManager;
	@Autowired
	private PhaRecipeBackManager phaRecipeBackManager;

	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		PhaRecipe model = JSONUtils.deserialize(data, PhaRecipe.class);
		buildModel(model);
		PhaRecipe saved = this.phaRecipeManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}

	@RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		try {
			this.phaRecipeManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/removeAll", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data) {
		@SuppressWarnings("rawtypes")
		List ids = JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM PHA_RECIPE WHERE ID IN (");
			for (int i = 0; i < ids.size(); i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.phaRecipeManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		PhaRecipe model = JSONUtils.deserialize(data, PhaRecipe.class);
		if (model == null || StringUtils.isBlank(model.getId())) {
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
		model.setApplyState(PAYED_BACK_MEDICINE);
		this.phaRecipeManager.save(model);
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/update/{id}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdateById(@PathVariable("id") String id) {
		if (StringUtils.isBlank(id)) {
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		PhaRecipe model = phaRecipeManager.get(id);
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
		model.setApplyState(PAYED_BACK_MEDICINE);
		// TODO 生成新的申请单号（规则未定）
		this.phaRecipeManager.save(model);
		model.setId("");
		model.setApplyNo(String.valueOf(Math.round(Math.random() * 100000000)));
		model.setPlusMinus("-1");
		this.phaRecipeManager.save(model);
		return ResultUtils.renderSuccessResult();
	}

	
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		PhaRecipe query = JSONUtils.deserialize(data, PhaRecipe.class);
		Date[] date = query.getDateRange();
		StringBuilder jql = new StringBuilder("from PhaRecipe re where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		if (date != null && date.length == 2) {
			jql.append("and re.createTime between ? and ? ");
			values.add(query.getDateRange()[0]);
			values.add(query.getDateRange()[1]);
		}
		if (StringUtils.isNotBlank(query.getApplyState())) {
			jql.append("and re.applyState = ? ");
			values.add(query.getApplyState());
		}
		if (StringUtils.isNotBlank(query.getRecipeId())) {
			jql.append("and re.recipeId = ? ");
			values.add(query.getRecipeId());
		}
		HcpUser user = this.getCurrentUser();
		jql.append(" and re.hosId = ? ");
		values.add(user.getHosId());
		
		if (!StringUtils.isEmpty(query.getPatientName())) {
			jql.append(" and re.regId in ( select id from  RegInfo  where patient.name like ?  ");
			values.add("%" + query.getPatientName() + "%");
			jql.append(")");
		}
		System.out.println(jql);
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		phaRecipeManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	
	
	@RequestMapping(value = "/page1/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage1(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		PhaRecipe query = JSONUtils.deserialize(data, PhaRecipe.class);
		Date[] date = query.getDateRange();
		StringBuilder jql = new StringBuilder("from RecipeInfo re where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		if (date != null && date.length == 2) {
			jql.append("and re.createTime between ? and ? ");
			values.add(query.getDateRange()[0]);
			values.add(query.getDateRange()[1]);
		}
		if (StringUtils.isNotBlank(query.getRecipeId())) {
			jql.append("and re.id like ? ");
			values.add("%"+query.getRecipeId()+"%");
		}
		HcpUser user = this.getCurrentUser();
		jql.append(" and re.hosId = ? ");
		values.add(user.getHosId());
		
		if (!StringUtils.isEmpty(query.getPatientName())) {
			jql.append(" and re.regId in ( select id from  RegInfo  where patient.name like ?  ");
			values.add("%" + query.getPatientName() + "%");
			jql.append(")");
		}
		System.out.println(jql);
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		
		recipeInfoManager.findPage(page);
		page.setResult(findDetailList((List<RecipeInfo>)page.getResult()));
		return ResultUtils.renderPageResult(page);
	}
	
	/**
	 * 获取药品信息
	 * @param recipeList
	 * @return
	 */
	public List<RecipeInfo> findDetailList(List<RecipeInfo> recipeList){
		if( recipeList != null && recipeList.size()>0){
			for(RecipeInfo r : recipeList){
				List<PhaRecipe> rList = phaRecipeManager.findByProp("recipeId", r.getId());
				r.setDetailList(rList);
			}
		}
		return recipeList;
		
	}
	
	/**
	 * 确认退药
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/recipe/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result recipe(@PathVariable("id") String regId) {
		if (StringUtils.isBlank(regId)) {
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		try{
			phaRecipeBackManager.phaRecipe(regId, getCurrentUser());
			return ResultUtils.renderSuccessResult();
		}catch(Exception e){
			return ResultUtils.renderFailureResult(e.getMessage());
		}		
	}
	
	
	
	/**
	 * 驳回退药
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/back/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result back(@PathVariable("id") String regId) {
		if (StringUtils.isBlank(regId)) {
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		String returnValue = phaRecipeBackManager.phaRecipeBack(regId, getCurrentUser());
		if("success".equals(returnValue)){
			return ResultUtils.renderSuccessResult();
		}else{
			return ResultUtils.renderFailureResult("驳回失败！！！");
		}
	}

	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		PhaRecipe model = phaRecipeManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<PhaRecipe> models = phaRecipeManager.findAll();
		return ResultUtils.renderSuccessResult(models);
	}

	private void buildModel(PhaRecipe model) {
		Date now = new Date();
		HcpUser user = this.getCurrentUser();
		model.setHosId(user.getHosId());
		model.setCreateOper(user.getName());
		model.setCreateTime(now);
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
	}

}
