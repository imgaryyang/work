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

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.ChargeDetail;
import com.lenovohit.hcp.base.model.ChargePkg;
import com.lenovohit.hcp.base.model.CommonItemInfo;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.utils.HcpDateUtils;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.card.model.Patient;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.odws.manager.OrderRetreatManager;
import com.lenovohit.hcp.odws.model.MedicalOrder;
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
		StringBuilder jql = new StringBuilder("from MedicalOrder where regId = ? and orderState = 4 order by recipeId, recipeNo ");
		values.add(regId);
		List<MedicalOrder> list = (List<MedicalOrder>) medicalOrderManager.find(jql.toString(), values.toArray());
		if(list.size()!=0){
			return ResultUtils.renderFailureResult("您的医嘱正在修改过程中，退药流程走完之后再来修改");
		}
		StringBuilder sql = new StringBuilder("from MedicalOrder where regId = ? and orderState != 5 order by recipeId, recipeNo ");
		List<MedicalOrder> lists = (List<MedicalOrder>) medicalOrderManager.find(sql.toString(), values.toArray());	
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
		List<MedicalOrder> models =  (List<MedicalOrder>) JSONUtils.parseObject(data,new TypeReference< List<MedicalOrder>>(){});
		try{
			orderReTreateManager.orderBack(models);
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
		if(reginfos.size()!=0)
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
		MedicalOrder saved = this.savItem(model);
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
			
			
			this.savItem(model);
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
	 * 保存医嘱明细
	 * @param model
	 * @return
	 */
	protected MedicalOrder savItem(MedicalOrder model) {
		// 当前登录用户
		HcpUser user = this.getCurrentUser();
		
		//获取该药品是否存在已收费
		List<Object> v = new ArrayList<Object>();
		StringBuilder j = new StringBuilder("from MedicalOrder a where a.regId = ? and a.drugFlag = ? and a.orderState = ? ");
		v.add(model.getRegId());
		
		v.add(model.getDrugFlag());
		v.add(MedicalOrder.ORDER_STATE_NEW);
		//v.add(MedicalOrder.REG_CANCELED);
		List<MedicalOrder> orderList = medicalOrderManager.find(j.toString(), v.toArray());
		
		
		
		// 如果处方号不存在（新增明细）
		if (StringUtils.isEmpty(model.getRecipeId())) {
			// 取已经存在的处方号及同处方明细数量
			String regId = model.getRegId();
			String jql = "select distinct drugFlag, recipeId, count(*) from MedicalOrder where regId = ? group by drugFlag, recipeId";
			List<Object> values = new ArrayList<Object>();
			values.add(regId);
			List<Object[]> recipeIdList = (List<Object[]>)medicalOrderManager.findByJql(jql, values);
			HashMap recipeIdMap = new HashMap();
			for (Object[] row : recipeIdList) {
				recipeIdMap.put((String)row[0], (String)row[1]);
				recipeIdMap.put((String)row[0] + "_count", (long)row[2]);
			}
			// 设置明细的处方号
			// 根据药品标识取已经存在的处方号 
			String recipeId = "";
			// 该药品已存在已交费的记录，则重新生成处方号
			if(orderList!=null && orderList.size()>0){
				recipeId = (String)recipeIdMap.get(model.getDrugFlag());
			}
			
			// 如果处方号不存在，则取新处方号
			recipeId = StringUtils.isEmpty(recipeId) ? redisSequenceManager.get("OW_ORDER", "RECIPE_ID") : recipeId;
			model.setRecipeId(recipeId);
			
			// 设置处方顺序号
			Long recipeNo = (Long)recipeIdMap.get(model.getDrugFlag() + "_count");
			model.setRecipeNo(null != recipeNo ? recipeNo.intValue() + 1 : 1);
		}
		
		model.setRecipeDept(user.getLoginDepartment().getId());
		model.setRecipeDoc(user.getId());
		model.setRecipeTime(DateUtils.getCurrentDate());
		// 如果是药品，则将执行科室 exeDept 复制到发药科室 drugDept
		if (MedicalOrder.DRUG_FLAG_PATENT_MEDICINE.equals(model.getDrugFlag()) || 
			MedicalOrder.DRUG_FLAG_HERBAL_MEDICINE.equals(model.getDrugFlag())) {
			model.setDrugDept(model.getExeDept());
		}
		// 医嘱状态 - 新开
		model.setOrderState(MedicalOrder.ORDER_STATE_NEW);
		// 收费标识 - 未收费
		model.setChargeFlag("0");
		// 发药状态 - 未发药
		model.setDispenseState("0");
		
		// 保存明细表信息
		MedicalOrder saved = medicalOrderManager.save(model);
		
		// 保存收费明细
		OutpatientChargeDetail savedChargeDetail = outpatientChargeDetailManager.save(this.getChargeDetailByOrder(saved));
		
		// 向医嘱表回填收费申请id
		saved.setApplyNo(savedChargeDetail.getId());
		saved = medicalOrderManager.save(saved);
		
		return saved;
	}
	
	/**
	 * 根据医嘱取收费明细
	 * @param order
	 * @return
	 */
	protected OutpatientChargeDetail getChargeDetailByOrder(MedicalOrder order) {
		OutpatientChargeDetail chargeDetail = new OutpatientChargeDetail();
		// 对应的收费明细存在，则先从数据库取收费明细，再赋值修改
		if (!StringUtils.isEmpty(order.getApplyNo())) {
			chargeDetail = outpatientChargeDetailManager.get(order.getApplyNo());
		}
		
		// 设置患者
		chargeDetail.setPatient(order.getPatientInfo());
		
		chargeDetail.setRegId(order.getRegId()); // 挂号id
		RegInfo ri = regInfoManager.get(order.getRegId());
		chargeDetail.setFeeType(ri.getFeeType()); // 费别
		
		chargeDetail.setPlusMinus(new BigDecimal(1)); // 正负标志
		chargeDetail.setRecipeId(order.getRecipeId()); // 处方号
		chargeDetail.setRecipeNo(order.getRecipeNo()); // 处方序号
		
		// 开方科室
		Department recipeDept = new Department();
		recipeDept.setId(order.getRecipeDept());
		chargeDetail.setRecipeDept(recipeDept);
		
		// 开方医生
		HcpUser recipeDoc = new HcpUser();
		recipeDoc.setId(order.getRecipeDoc());
		chargeDetail.setRecipeDoc(recipeDoc);
		
		chargeDetail.setRecipeTime(order.getRecipeTime()); // 开方时间
		chargeDetail.setDrugFlag(order.getDrugFlag()); // 药品标识
		chargeDetail.setItemCode(order.getItemId()); // 项目id
		chargeDetail.setItemName(order.getItemName()); // 项目名称
		chargeDetail.setSpecs(order.getSpecs()); // 规格
		chargeDetail.setQty(order.getQty()); // 数量
		chargeDetail.setDays(null != order.getDays() ? order.getDays().intValue() : null); // 执行天数
		chargeDetail.setUnit(order.getUnit()); // 包装单位
		chargeDetail.setSalePrice(order.getSalePrice()); // 单价
		chargeDetail.setTotCost(order.getQty().multiply(order.getSalePrice())); // 总价
		chargeDetail.setFeeCode(order.getFeeCode()); // 费用类型
		chargeDetail.setCombNo(null != order.getComboNo() ? String.valueOf(order.getComboNo()) : null); // 组合号 TODO: 收费表中combNo字段拼写错误，待修改
		
		// 执行科室
		Department exeDept = new Department();
		exeDept.setId(order.getExeDept());
		chargeDetail.setExeDept(exeDept);

		// 发药科室
		if (null != order.getDrugDept()) {
			Department drugDept = new Department();
			drugDept.setId(order.getDrugDept());
			chargeDetail.setDrugDept(drugDept);
		}
		
		chargeDetail.setOrder(order); // 医嘱
		chargeDetail.setApplyState("0"); // 申请状态 - 未收费
		
		return chargeDetail;
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
