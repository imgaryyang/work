package com.lenovohit.hcp.odws.web.rest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.ChargeDetail;
import com.lenovohit.hcp.base.model.ChargePkg;
import com.lenovohit.hcp.base.model.CommonItemInfo;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.card.model.Patient;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.odws.manager.OrderManager;
import com.lenovohit.hcp.odws.manager.OrderRetreatManager;
import com.lenovohit.hcp.odws.model.MedicalOrder;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaRecipe;
import com.lenovohit.hcp.pharmacy.model.RecipeInfo;

/**
 * 医嘱
 */
@RestController
@RequestMapping("/hcp/odws/medicalOrder")
public class MedicalOrderController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<MedicalOrder, String> medicalOrderManager;

	@Autowired
	private GenericManager<ChargePkg, String> chargePkgManager;
	
	@Autowired
	private GenericManager<ChargeDetail, String> chargeDetailManager;

	@Autowired
	private IRedisSequenceManager redisSequenceManager;
	
	@Autowired
	private GenericManager<CommonItemInfo, String> commonItemInfoManager;
	
	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	
	@Autowired
	private GenericManager<RegInfo, String> regInfoManager;
	
	@Autowired
	private GenericManager<PhaRecipe, String> phaRecipeManager;
	
	@Autowired
	private GenericManager<RecipeInfo, String> recipeInfoManager;
	
	@Autowired
	private OrderRetreatManager orderReTreateManager;
	
	@Autowired
	private GenericManager<PhaDrugInfo, String> phaDrugInfoManager;
	
	@Autowired
	private OrderManager orderManager;
	
	/**
	 * 根据挂号id取所有已下医嘱
	 * @param regId
	 * @return
	 */
	@RequestMapping(value = "/list/{regId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDiagnosisPage(@PathVariable("regId") String regId) {
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder("from MedicalOrder where regId = ? and ( orderState = 1 or orderState = 2 or orderState = 3 ) order  by recipeId, recipeNo ");
		values.add(regId);
		List<MedicalOrder> list = (List<MedicalOrder>) medicalOrderManager.find(jql.toString(), values.toArray());
		return ResultUtils.renderPageResult(list);
	}
	/**
	 * 根据挂号id取所有已下医嘱，如果该医嘱已经修改过，则返回提示信息。
	 * @param regId
	 * @return
	 */
	@RequestMapping(value = "/listorder/{regId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result listorders(@PathVariable("regId") String regId) {
		List<Object> values = new ArrayList<Object>();
		//StringBuilder jql = new StringBuilder("from MedicalOrder where regId = ? and orderState = 4 order by recipeId, recipeNo ");
		values.add(regId);
		//List<MedicalOrder> list = (List<MedicalOrder>) medicalOrderManager.find(jql.toString(), values.toArray());
		//if(list.size()!=0){
		//	return ResultUtils.renderFailureResult("您的医嘱正在修改过程中，退药流程走完之后再来修改");
		//}
		StringBuilder sql = new StringBuilder("from MedicalOrder where regId = ? and orderState != 5 order by recipeId, recipeNo ");
		List<MedicalOrder> lists = (List<MedicalOrder>) medicalOrderManager.find(sql.toString(), values.toArray());	
		for(MedicalOrder order : lists){
			if(order.getItemId() != null){
				PhaDrugInfo info = this.phaDrugInfoManager.findOneByProp("id", order.getItemId());
				order.setPhaDrugInfo(info);
			}
		}
		return ResultUtils.renderPageResult(lists);
	}
	
	
	/**
	 * 门诊退药
	 * @param regId
	 * @return
	 */
	@RequestMapping(value = "/withDrawal", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result withDrawal(@RequestBody String data) {
		System.out.println(data);
		HcpUser user=this.getCurrentUser();
		List<MedicalOrder> models =  (List<MedicalOrder>) JSONUtils.parseObject(data,new TypeReference< List<MedicalOrder>>(){});
		try{
			orderReTreateManager.orderBack(models,user);
			return ResultUtils.renderSuccessResult();
		}catch(Exception e){
			System.err.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		
	}
	
	/**
	 * 根据条件查询患者医嘱
	 * @param 
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		System.out.println(data);
		HcpUser user = this.getCurrentUser();
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		MedicalOrder query = JSONUtils.deserialize(data, MedicalOrder.class);
		System.out.println(query);
		Date[] date = query.getDateRange();
		StringBuilder jql = new StringBuilder("from RegInfo ri where hosId = ? ");
		List<Object> values = new ArrayList<Object>();
		values.add(user.getHosId());

		if (date != null && date.length == 2) {
			jql.append("and ri.createTime between ? and ? ");
			values.add(query.getDateRange()[0]);
			values.add(query.getDateRange()[1]);
		}
		// 诊疗卡/患者姓名/患者身份证号
		if (StringUtils.isNotBlank(query.getMedicalCardNo()) || StringUtils.isNotBlank(query.getPatientName()) || StringUtils.isNotBlank(query.getIdNo())) {
			// 诊疗卡
			if (!StringUtils.isEmpty(query.getMedicalCardNo())) {
				jql.append("and ri.patient.medicalCardNo like ? ");
				values.add("%" + query.getMedicalCardNo() + "%");
			}
			// 患者姓名
			if (!StringUtils.isEmpty(query.getPatientName())) {
				jql.append("and ri.patient.name like ? ");
				values.add("%" + query.getPatientName() + "%");
			}
			// 患者身份证号
			if (!StringUtils.isEmpty(query.getIdNo())) {
				jql.append("and ri.patient.idNo like ? ");
				values.add("%" + query.getIdNo() + "%");
			}
		}
		jql.append(" order by ri.regTime desc ");
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		regInfoManager.findPage(page);
		List<RegInfo> reginfos=(List<RegInfo>) page.getResult();
		if(reginfos!=null&&reginfos.size()!=0)
		{
		for(int i=0;i<reginfos.size();i++){
			List<MedicalOrder> orders=medicalOrderManager.findByProp("regId", reginfos.get(i).getId());
			reginfos.get(i).setOrders(orders);
		}
		page.setResult(reginfos);
		}
		return ResultUtils.renderPageResult(page);
	}
	/**
	 * 保存医嘱明细（门诊医生站医生直接开立医嘱明细）
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/item/save", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSaveItem(@RequestBody String data) {
		MedicalOrder model = JSONUtils.deserialize(data, MedicalOrder.class);
		MedicalOrder saved = orderManager.savItem(model,this.getCurrentUser());
		return ResultUtils.renderSuccessResult(saved);
	}
	
	/**
	 * 保存医嘱明细（门诊医生站医生通过模板开立医嘱）
	 * @param tmplId
	 * @return
	 */
	@RequestMapping(value = "/item/saveByTmpl/{tmplId}/{regId}/{patientId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forSaveByTmpl(@PathVariable("tmplId") String tmplId, @PathVariable("regId") String regId, @PathVariable("patientId") String patientId) {
		// 获取组套及组套明细信息
		ChargePkg tmpl = chargePkgManager.get(tmplId);
		List<ChargeDetail> tmplItems = chargeDetailManager.find("from ChargeDetail where comboId = '" + tmplId + "' order by comboSort");
		// 获取所有明细对应的通用收费项id
		List<Object> itemIds = (List<Object>)chargeDetailManager.findByJql("select itemId from ChargeDetail where comboId = '" + tmplId + "' order by comboSort");
		// 获取收费项详情
		StringBuffer ids = new StringBuffer("(");
		int i = 0;
		for (Object id : itemIds) {
			if (i != 0) ids.append(",");
			ids.append("'" + (String)id + "'");
			i += 1;
		}
		ids.append(")");
		if(ids.toString().equals("()")){
			return ResultUtils.renderFailureResult("该套餐下没有套餐明细");
		}
		List<CommonItemInfo> commonItems = (List<CommonItemInfo>)commonItemInfoManager.find("from CommonItemInfo where itemId in " + ids);
		HashMap<String, CommonItemInfo> commonItemsMap = new HashMap<String, CommonItemInfo>();
		for (CommonItemInfo item : commonItems) {
			commonItemsMap.put(item.getItemId(), item);
		}
		
		
		// 获取已有的医嘱
		List<Object> values = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder("from MedicalOrder a where a.regId = ? ");
		values.add(regId);
		
		List<MedicalOrder> orderList = medicalOrderManager.find(jql.toString(), values);
		// 根据组套明细循环插入医嘱表
		for (ChargeDetail item : tmplItems) {
			MedicalOrder model = new MedicalOrder();
			MedicalOrder order=isHasItemCode(orderList,item.getItemCode());
			//如果已经存在该条医嘱（组号也相同），且未收费，则合并；
			if(order != null && "1".equals(order.getOrderState()) && item.getComboNo().equals(order.getComboNo())){
				model = order;
				model.setQty(order.getQty().add(item.getDefaultNum()));
			}else{
				model.setRegId(regId); // 挂号id
				Patient p = new Patient();
				p.setId(patientId);
				model.setPatientInfo(p); // 患者id
				model.setDrugFlag(item.getDrugFlag()); // 药品标识
				model.setComboNo(item.getComboNo()); // 组合号
				
				model.setItemId(item.getItemId()); // 项目id
				model.setItemCode(item.getItemCode()); // 项目编码
				model.setItemName(item.getItemName()); // 项目名称
				model.setFeeCode(commonItemsMap.get(item.getItemId()).getFeeCode()); // 费用分类
				model.setSpecs(commonItemsMap.get(item.getItemId()).getItemSpecs()); // 药品规格
				model.setUnit(commonItemsMap.get(item.getItemId()).getItemUnit()); // 包装单位
				model.setSalePrice(commonItemsMap.get(item.getItemId()).getSalePrice()); // 售价
				
				model.setUsage(item.getUsage()); // 用法
				model.setFreq(item.getFreq()); // 频次
				model.setFreqDesc(item.getFreqDesc()); // 频次描述
				model.setDays(item.getDays()); // 执行天数
				model.setQty(item.getDefaultNum()); // 总数量
				model.setDoseOnce(item.getDosage()); // 一次剂量
				model.setDoseUnit(item.getDosageUnit()); // 剂量单位
				
				model.setExeDept(item.getDefaultDept()); // 执行科室
			}
			
			
			orderManager.savItem(model,this.getCurrentUser());
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 判断已有医嘱是否包含该药品
	 * @param orderList
	 * @param comboNo
	 * @return
	 */
	protected MedicalOrder isHasItemCode(List<MedicalOrder> orderList, String itemCode){
		MedicalOrder MedicalOrder = null;
		if(orderList!=null&&orderList.size()>0){
			for(MedicalOrder order : orderList){
				if(itemCode.equals(order.getItemCode()) || order.getItemCode() == itemCode){
					MedicalOrder = order; 
				}
			}
		}
		return MedicalOrder;
	}
	
	

	/**
	 * 删除明细
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/item/remove/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteItem(@PathVariable("id") String id) {
		
		try {
			
			MedicalOrder toDel = this.medicalOrderManager.get(id);
			//如果是组套，会删除整个组套
			if(toDel.getComboNo()!=null){
				List<Object> val = new ArrayList<Object>();
				StringBuilder jql = new StringBuilder("from MedicalOrder where comboNo = ?  and regId = ? order by recipeId, recipeNo ");
				val.add(toDel.getComboNo());
				val.add(toDel.getRegId());
				List<MedicalOrder> list = medicalOrderManager.find(jql.toString(), val.toArray());
				if(list!=null && list.size()>0){
					for(MedicalOrder order: list){
						// 更改排序
						List<Object> values = new ArrayList<Object>();
						values.add(order.getRecipeId());
						values.add(order.getRecipeNo());
						this.medicalOrderManager.executeSql("update OW_ORDER set RECIPE_NO = RECIPE_NO - 1 where RECIPE_ID = ? and RECIPE_NO > ? ", values.toArray());
						
						this.medicalOrderManager.delete(order.getId());
						
						// 更改收费明细中的排序
						this.outpatientChargeDetailManager.executeSql("update OC_CHARGEDETAIL set RECIPE_NO = RECIPE_NO - 1 where RECIPE_ID = ? and RECIPE_NO > ? ", values.toArray());
						// 删除收费明细
						this.outpatientChargeDetailManager.executeSql("delete from OC_CHARGEDETAIL where ORDER_ID = '" + order.getId() + "'");
					}
				}
			}else{
				// 更改排序
				List<Object> values = new ArrayList<Object>();
				values.add(toDel.getRecipeId());
				values.add(toDel.getRecipeNo());
				this.medicalOrderManager.executeSql("update OW_ORDER set RECIPE_NO = RECIPE_NO - 1 where RECIPE_ID = ? and RECIPE_NO > ? ", values.toArray());
				
				this.medicalOrderManager.delete(id);
				
				// 更改收费明细中的排序
				this.outpatientChargeDetailManager.executeSql("update OC_CHARGEDETAIL set RECIPE_NO = RECIPE_NO - 1 where RECIPE_ID = ? and RECIPE_NO > ? ", values.toArray());
				// 删除收费明细
				this.outpatientChargeDetailManager.executeSql("delete from OC_CHARGEDETAIL where ORDER_ID = '" + toDel.getId() + "'");
			}
			
			
			
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 明细成组
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/item/makeGruop", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result makeGroup(@RequestParam(value = "data", defaultValue = "") String data) {
		List ids =  JSONUtils.deserialize(data, List.class);
		// 取自增组合号
		int comboNo = redisSequenceManager.getSeq("OW_ORDER", "COMBO_NO").getSeq().intValue();
		// 需要组合的id
		StringBuffer idsSymbol = new StringBuffer("");
		List<Object> values = new ArrayList<Object>();
		values.add(comboNo);
		for(int i = 0; i < ids.size(); i++){
			idsSymbol.append("?");
			values.add(ids.get(i).toString());
			if(i != ids.size() - 1) idsSymbol.append(",");
		}
		// 更新医嘱表组合号
		StringBuffer jql = new StringBuffer("update OW_ORDER set COMBO_NO = ? where ID in (").append(idsSymbol).append(")");
		this.medicalOrderManager.executeSql(jql.toString(), values.toArray());
		// 更新收费表组合号
		jql = new StringBuffer("update OC_CHARGEDETAIL set COMB_NO = ? where ORDER_ID in (").append(idsSymbol).append(")");
		this.outpatientChargeDetailManager.executeSql(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 从组合中删除
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/item/deleteFromGroup", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result deleteFromGroup(@RequestParam(value = "data", defaultValue = "") String data) {
		List ids =  JSONUtils.deserialize(data, List.class);
		// 需要组合的id
		StringBuffer idsSymbol = new StringBuffer("");
		List<Object> values = new ArrayList<Object>();
		values.add(null);
		for(int i = 0; i < ids.size(); i++){
			idsSymbol.append("?");
			values.add(ids.get(i).toString());
			if(i != ids.size() - 1) idsSymbol.append(",");
		}
		// 更新医嘱表组合号
		StringBuffer jql = new StringBuffer("update OW_ORDER set COMBO_NO = ? where ID in (").append(idsSymbol).append(")");
		this.medicalOrderManager.executeSql(jql.toString(), values.toArray());
		// 更新收费表组合号
		jql = new StringBuffer("update OC_CHARGEDETAIL set COMB_NO = ? where ORDER_ID in (").append(idsSymbol).append(")");
		this.outpatientChargeDetailManager.executeSql(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 明细排序
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/item/sort", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result sortItems(@RequestParam(value = "data", defaultValue = "") String data) {
		List ids =  JSONUtils.deserialize(data, List.class);
		
		StringBuffer orderJql = new StringBuffer("update OW_ORDER set RECIPE_NO = ? where ID = ? ");
		StringBuffer cdJql = new StringBuffer("update OC_CHARGEDETAIL set RECIPE_NO = ? where ORDER_ID = ? ");
		for(int i = 0; i < ids.size(); i++){
			List<Object> values = new ArrayList<Object>();
			values.add(i + 1);
			values.add(ids.get(i).toString());
			this.medicalOrderManager.executeSql(orderJql.toString(), values.toArray());
			this.outpatientChargeDetailManager.executeSql(cdJql.toString(), values.toArray());
		}
		return ResultUtils.renderSuccessResult();
	}
	
	
	/**
	 * 根据条件查询退药情况
	 * @param 
	 * @return
	 */
	@RequestMapping(value = "/loadBack/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result loadBack(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data) {
		HcpUser user = this.getCurrentUser();
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		MedicalOrder query = JSONUtils.deserialize(data, MedicalOrder.class);
		System.out.println(query);
		Date[] date = query.getDateRange();
		StringBuilder jql = new StringBuilder("from RecipeInfo ri where ri.hosId = ? and ri.applyState = ?  ");
		List<Object> values = new ArrayList<Object>();
		
		values.add(user.getHosId());
		values.add(RecipeInfo.APPLY_STATE_APPLY);  //已申请未退药
		if (date != null && date.length == 2) {
			jql.append("and ri.createTime between ? and ? ");
			values.add(query.getDateRange()[0]);
			values.add(query.getDateRange()[1]);
		}
		// 诊疗卡/患者姓名/患者身份证号
		if (StringUtils.isNotBlank(query.getMedicalCardNo()) || StringUtils.isNotBlank(query.getPatientName()) || StringUtils.isNotBlank(query.getIdNo())) {
			// 诊疗卡
			if (!StringUtils.isEmpty(query.getMedicalCardNo())) {
				jql.append("and ri.medicalCardNo like ? ");
				values.add("%" + query.getMedicalCardNo() + "%");
			}
			// 患者姓名
			if (!StringUtils.isEmpty(query.getPatientName())) {
				jql.append("and ri.name like ? ");
				values.add("%" + query.getPatientName() + "%");
			}
			// 患者身份证号
			if (!StringUtils.isEmpty(query.getIdNo())) {
				jql.append("and ri.idNo like ? ");
				values.add("%" + query.getIdNo() + "%");
			}
		}
		
		jql.append(" order by ri.regTime desc ");
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		recipeInfoManager.findPage(page);
		List<RecipeInfo> reginfos=(List<RecipeInfo>) page.getResult();
		if(reginfos!=null && reginfos.size()!=0)
		{
		for(int i=0;i<reginfos.size();i++){
			StringBuilder j = new StringBuilder("from PhaRecipe ri where ri.hosId = ? and ri.regId = ? and ri.applyState in (? , ?) order by ri.drugCode ");
			List<Object> v = new ArrayList<Object>();
			v.add(user.getHosId());
			v.add(reginfos.get(i).getId());
			v.add(PhaRecipe.APPLY_STATE_DISPENSED);
			v.add(PhaRecipe.APPLY_STATE_APPLY);
			List<PhaRecipe> orders=phaRecipeManager.find(j.toString(), v.toArray());
			List<PhaRecipe> ordList = new ArrayList<PhaRecipe>();
			
			//数据处理：获取退药的数量
			if(orders != null && orders.size()>0){
				for(int s = 0;s<orders.size(); s++){
					if(PhaRecipe.APPLY_STATE_DISPENSED.equals(orders.get(s).getApplyState())){
						if(s>0 && orders.get(s-1).getId().equals(orders.get(s).getDataFrom())){
							orders.get(s).setApplyNum(orders.get(s-1).getApplyNum().subtract(orders.get(s).getApplyNum()));
						}
						if(s < orders.size()-1 && orders.get(s+1).getId().equals(orders.get(s).getDataFrom())){
							orders.get(s).setApplyNum(orders.get(s+1).getApplyNum().subtract(orders.get(s).getApplyNum()));
						}
						if(orders.get(s).getApplyNum().compareTo(BigDecimal.ZERO)!=0){
							ordList.add(orders.get(s));
						}
						
					}
				}
			}
			reginfos.get(i).setDetailList(ordList);
		}
		page.setResult(reginfos);
		}
		return ResultUtils.renderPageResult(page);
	}
	
}
