/**
 * 
 */
package com.lenovohit.hcp.odws.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.odws.manager.OrderManager;
import com.lenovohit.hcp.odws.model.MedicalOrder;

/**
 * @author duanyanshan
 * @date 2018年1月10日 下午5:36:38
 */
@Service
@Transactional
public class OrderManagerImpl implements OrderManager{
	
	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	
	@Autowired
	private GenericManager<RegInfo, String> regInfoManager;
	
	@Autowired
	private GenericManager<MedicalOrder, String> medicalOrderManager;
	
	@Autowired
	private IRedisSequenceManager redisSequenceManager;
	
	/**
	 * 保存医嘱明细
	 * @param model
	 * @return
	 */
	public MedicalOrder savItem(MedicalOrder model,HcpUser user) {
		
		//获取该药品是否存在已收费
		List<Object> v = new ArrayList<Object>();
		StringBuilder j = new StringBuilder("from MedicalOrder a where a.hosId = ? and a.regId = ? and a.drugFlag = ? and a.orderState = ? ");
		v.add(user.getHosId());
		v.add(model.getRegId());
		
		v.add(model.getDrugFlag());
		v.add(MedicalOrder.ORDER_STATE_NEW);
		//v.add(MedicalOrder.REG_CANCELED);
		List<MedicalOrder> orderList = medicalOrderManager.find(j.toString(), v.toArray());
		
		
		
		// 如果处方号不存在（新增明细）
		if (StringUtils.isEmpty(model.getRecipeId())) {
			// 取已经存在的处方号及同处方明细数量
			String regId = model.getRegId();
			String jql = "select distinct drugFlag, recipeId, count(*) from MedicalOrder where hosId = ? and regId = ? group by drugFlag, recipeId";
			List<Object> values = new ArrayList<Object>();
			values.add(user.getHosId());
			values.add(regId);
			List<Object[]> recipeIdList = (List<Object[]>)medicalOrderManager.findByJql(jql, values.toArray());
			HashMap recipeIdMap = new HashMap();
			if(recipeIdList!=null && recipeIdList.size()>0){
				for (Object[] row : recipeIdList) {
					recipeIdMap.put((String)row[0], (String)row[1]);
					recipeIdMap.put((String)row[0] + "_count", (long)row[2]);
				}
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
		
		// 如果录入数量为包装单位   则需要数量转换
		if("1".equals(model.getDrugFlag()) && !model.getUnit().equals(model.getPackUnit())){
			model.setQty(model.getQty().multiply(model.getPackQty()));
		}else if("1".equals(model.getDrugFlag()) && model.getUnit().equals(model.getPackUnit())){
			if(StringUtils.isEmpty(model.getId())){
			   model.setSalePrice(model.getSalePrice().divide(model.getQty(),4,BigDecimal.ROUND_HALF_UP));
			}
			model.setQty(model.getPackQty());
		}else if("3".equals(model.getDrugFlag())){
			model.setQty(model.getPackQty());
		}
		
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
		chargeDetail.setUnit(order.getUnit()); // 单位
		chargeDetail.setPackQty(order.getPackQty());  //输入数量
		chargeDetail.setPackUnit(order.getPackUnit());  //输入单位
		chargeDetail.setSalePrice(order.getSalePrice()); // 单价（换算 为最小单位单价）
		if(order.getPackQty()!=null){
			chargeDetail.setTotCost(order.getPackQty().multiply(order.getSalePrice())); // 总价
		}
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

}
