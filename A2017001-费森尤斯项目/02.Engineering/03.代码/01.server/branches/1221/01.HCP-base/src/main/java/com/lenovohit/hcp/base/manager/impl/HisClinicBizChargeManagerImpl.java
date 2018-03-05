package com.lenovohit.hcp.base.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.finance.model.InvoiceInfo;
import com.lenovohit.hcp.finance.model.InvoiceManage;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.odws.model.MedicalOrder;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaRecipe;

@Service("hisClinicBizChargeManager")
public class HisClinicBizChargeManagerImpl extends AbstractHisBizChargeManagerImpl {
	
	@Autowired
	private GenericManager<MedicalOrder, String> medicalOrderManager;
	@Autowired
	private GenericManager<PhaRecipe, String> phaRecipeManager;
	@Autowired
	private GenericManager<PhaDrugInfo, String> phaDrugInfoManager;
	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	@Override
	protected String getInvoiceSource() {
		return InvoiceInfo.INVOICE_SOURCE_PAY;
	}

	@Override
	protected String getInvoiceType() {
		return InvoiceManage.INVOICE_TYPE_CLINIC;
	}

	@Override
	protected List<OutpatientChargeDetail> getChargeDetailInfo(List<String> chargeDetailIds) {
		List<OutpatientChargeDetail> details = new ArrayList<>();
		for (String s : chargeDetailIds) {
			OutpatientChargeDetail detail = outpatientChargeDetailManager.get(s);
			if (detail != null)
				details.add(detail);
		}
		return details;
	}

	@Override
	protected void updatePaySuccessOtherInfo(HcpUser operator, BigDecimal amt, String orderId, String invoiceNo,
			RegInfo regInfo, List<OutpatientChargeDetail> details) {
		//医嘱表更新列表
		List<MedicalOrder> medicalOrderList = new ArrayList<MedicalOrder>();
		//请领单
		List<PhaRecipe> recipeList = new ArrayList<PhaRecipe>();
		if(details!=null&&details.size()>0){
			for(OutpatientChargeDetail detail :details){
				if(StringUtils.isNotBlank(detail.getItemCode())){
					//请领单
					PhaRecipe recipe = new PhaRecipe();	
					if(detail!=null&&("001".equals(detail.getFeeCode()) || "002".equals(detail.getFeeCode()) || "003".equals(detail.getFeeCode()))){//为药品时插入请领
						//含有dataFrom说明是退药时新增的数据，在退药已插入数据并保留原有数据状态
						if(StringUtils.isEmpty(detail.getDataFrom())){
							//如果医嘱存在，更新医嘱信息，插入请领单
							recipe.setHosId(detail.getHosId());
							recipe.setApplyType("1"); 						// 申请类型|APPLY_TYPE
							recipe.setApplyNum(detail.getQty()); 		// 申请数量
							if(detail.getDays()!=null){
								recipe.setDays(new BigDecimal(detail.getDays())); 		// 草药付数|默认为1
							}
							recipe.setApplyTime(new Date()); 				// 申请时间
							recipe.setApplyDept(detail.getRecipeDept().getId()); // 申请科室
							recipe.setApplyUnit(detail.getUnit()); // 申请单位
							//TODO医嘱中不存在（可能需要换算）
							PhaDrugInfo drugInfo = phaDrugInfoManager.get(detail.getItemCode());
							if(drugInfo!=null){
								BigDecimal packQty = new BigDecimal(drugInfo.getPackQty());
								recipe.setDrugCode(drugInfo.getId()); 				//药品id
								recipe.setMinUnit(drugInfo.getMiniUnit()); // 最小单位
								recipe.setDoseOnce(drugInfo.getBaseDose()); 	// 一次剂量
								recipe.setDoseUnit(drugInfo.getDoseUnit()); 	// 剂量单位
								recipe.setApplication(drugInfo.getUsage()); 	// 用法
								recipe.setFreq(drugInfo.getFreqCode()); 			// 频次
								recipe.setMinNum(packQty.multiply(detail.getQty())); // 最小单位数量
							}
							recipe.setDeptId(detail.getExeDept().getId()); 		// 库房
							recipe.setDrugCode(detail.getItemCode()); 	// 药品编码
							recipe.setTradeName(detail.getItemName()); 	// 商品名称
							recipe.setSpecs(detail.getSpecs()); 			// 药品规格
							recipe.setSalePrice(detail.getSalePrice()); 	// 零售价
							recipe.setDrugType(detail.getFeeCode()); 			// 药品分类
							recipe.setRecipeNo(detail.getRecipeNo()); 		//处方序号
							recipe.setRegId(detail.getRegId());				//挂号id
							recipe.setApplyState("1"); 							// 申请状态|APPLY_STATE（1：提交未发药   2：已发药   3：已退药）
							if(detail.getOrder()!=null){
								recipe.setOrderId(detail.getOrder().getId()); 		// 医嘱ID
							}
							recipe.setRecipeId(detail.getRecipeId()); 	// 处方ID
							recipe.setPlusMinus("1");
							//TODO 医嘱状态修改
							//从收费明细中取出医嘱id做状态更新
							if(detail.getOrder() != null){
								MedicalOrder medicalOrder = detail.getOrder();
								recipe.setComboNo(medicalOrder.getComboNo()); 		// 组号
								recipe.setDays(medicalOrder.getDays()); 			// 草药付数|默认为1
								recipe.setApplication(medicalOrder.getUsage()); 	// 用法
								recipe.setFreq(medicalOrder.getFreq()); 			// 频次
								recipe.setFreqDesc(medicalOrder.getFreqDesc());		//频次详情 		
								medicalOrder.setOrderState(medicalOrder.ORDER_STATE_CHARGED);//已计费
								medicalOrder.setChargeFlag("1");
								medicalOrderList.add(medicalOrder);
							}
							recipeList.add(recipe);
						}
						else{
							//当是退药的收费明细时，更改退药的新医嘱的医嘱状态为1已收费
							//从收费明细中取出医嘱id做状态更新
							if(detail.getOrder() != null){
								MedicalOrder medicalOrder = detail.getOrder();
								//medicalOrder.setOrderState(medicalOrder.ORDER_STATE_CHARGED);//已计费
								medicalOrder.setChargeFlag("1");
								//medicalOrderList.add(medicalOrder);
							}
						}
					}else{
						//从收费明细中取出医嘱id做状态更新
						if(detail!=null&&detail.getOrder() != null){
							MedicalOrder medicalOrder = detail.getOrder();
							recipe.setComboNo(medicalOrder.getComboNo()); 		// 组号
							recipe.setDays(medicalOrder.getDays()); 			// 草药付数|默认为1
							recipe.setApplication(medicalOrder.getUsage()); 	// 用法
							recipe.setFreq(medicalOrder.getFreq()); 			// 频次
							recipe.setFreqDesc(medicalOrder.getFreqDesc());		//频次详情 		
							medicalOrder.setOrderState(medicalOrder.ORDER_STATE_CHARGED);//已计费
							medicalOrder.setChargeFlag("1");
							medicalOrderList.add(medicalOrder);
						}
					}
				}else{
					 throw new RuntimeException("收费数据出错！！");
				}
			}
			//更新医嘱状态
			if(StringUtils.isNotEmpty(medicalOrderList)&&medicalOrderList.size()>0){
				medicalOrderManager.batchSave(medicalOrderList);
			}
			//插入请领单
			if(StringUtils.isNotEmpty(recipeList)&&recipeList.size()>0){
				phaRecipeManager.batchSave(recipeList);
			}
		}
	}

	@Override
	protected void doBizAfterPayFailed(String operator, BigDecimal amt, String orderId, List<String> chargeDetailIds) {
		// TODO 失败业务？
		List<OutpatientChargeDetail> detailList = getChargeDetailInfo(chargeDetailIds);
		List<String> recipeIds = new ArrayList<String>();
		//医嘱表更新列表
		List<MedicalOrder> medicalOrderList = new ArrayList<MedicalOrder>();
		for(OutpatientChargeDetail detail:detailList){
			if(detail.getFeeCode()!=null && ("001".equals(detail.getFeeCode())||
					"002".equals(detail.getFeeCode())||"003".equals(detail.getFeeCode()))){//为药品时删除请领
				String recipeId = detail.getRecipeId();
				if(recipeIds.size()>0 && !recipeIds.contains(recipeId)){//处方号不重复
					recipeIds.add(recipeId);
				} else {
					recipeIds.add(recipeId);
				}
			}
			if(detail.getOrder()!=null){
				MedicalOrder order = detail.getOrder();
				order.setChargeFlag("0");
				order.setOrderState(order.ORDER_STATE_NEW);
				medicalOrderList.add(order);
			}
		}
		
		//更新医嘱状态
		if(StringUtils.isNotEmpty(medicalOrderList)&&medicalOrderList.size()>0){
			medicalOrderManager.batchSave(medicalOrderList);
		}
		//插入请领单
		if(recipeIds!=null&&recipeIds.size()>0){
			StringBuilder sqlRe = new StringBuilder("delete from PHA_RECIPE ocd where 1=1  AND ocd.id in ( ");
			for (int i = 0; i < recipeIds.size(); i++) {
				sqlRe.append(" ? ");
				if (i != recipeIds.size() - 1)
					sqlRe.append(",");
			}
			sqlRe.append(" )");
			//删除请领
			phaRecipeManager.executeSql(sqlRe.toString(), recipeIds.toArray());
		}
	}

	@Override
	protected void refundUpdateOtherInfos(InvoiceInfo info) {

	}

}
