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
import com.lenovohit.hcp.base.model.Frequency;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.finance.model.InvoiceInfo;
import com.lenovohit.hcp.finance.model.InvoiceManage;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaRecipe;

@Service("hisClinicPricChargeManager")
public class HisClinicPricChargeManagerImpl extends AbstractHisBizChargeManagerImpl {
	
	@Autowired
	private GenericManager<PhaRecipe, String> phaRecipeManager;
	@Autowired
	private GenericManager<PhaDrugInfo, String> phaDrugInfoManager;
	@Autowired
	private GenericManager<Frequency, String> frequencyManager;
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
		// TODO 更新？
		//请领单
		List<PhaRecipe> recipeList = new ArrayList<PhaRecipe>();
		if(details!=null&&details.size()>0){
			for(OutpatientChargeDetail detail :details){
				//请领单
				PhaRecipe recipe = new PhaRecipe();	
				if(detail!=null&&("001".equals(detail.getFeeCode()) || "002".equals(detail.getFeeCode()) || "003".equals(detail.getFeeCode()))){//为药品时插入请领
					//如果医嘱存在，更新医嘱信息，插入请领单
					recipe.setHosId(detail.getHosId());
					recipe.setApplyType("1"); 						// 申请类型|APPLY_TYPE
					recipe.setDays(new BigDecimal(detail.getDays())); 		// 草药付数|默认为1
					recipe.setApplyTime(new Date()); 				// 申请时间
					recipe.setApplyDept(detail.getRecipeDept().getId()); // 申请科室
					recipe.setApplyNum(detail.getPackQty()); 		// 申请数量
					recipe.setApplyUnit(detail.getPackUnit()); // 申请单位
					recipe.setMinUnit(detail.getUnit()); // 最小单位
					recipe.setMinNum(detail.getQty()); // 最小单位数量
					PhaDrugInfo drugInfo = phaDrugInfoManager.get(detail.getItemCode());
					if(drugInfo!=null){
						recipe.setDrugCode(drugInfo.getId()); 				//药品id
						recipe.setDoseOnce(drugInfo.getBaseDose()); 	// 一次剂量
						recipe.setDoseUnit(drugInfo.getDoseUnit()); 	// 剂量单位
						recipe.setApplication(drugInfo.getUsage()); 	// 用法
						if(drugInfo.getFreqCode()!=null){
							recipe.setFreq(drugInfo.getFreqCode()); 		// 频次
							Frequency frequency = frequencyManager.findOneByProp("freqId", drugInfo.getFreqCode());
							if(frequency!=null){
								recipe.setFreqDesc(frequency.getFreqName());//频次详情
							}
						}
					}
					recipe.setDeptId(detail.getExeDept().getId()); 		// 库房
					recipe.setDrugCode(detail.getItemCode()); 	// 药品编码
					recipe.setTradeName(detail.getItemName()); 	// 商品名称
					recipe.setSpecs(detail.getSpecs()); 			// 药品规格
					//TODO  后续如果明细中保存的是最小规格价格不需要转换  否则需要转换
					recipe.setSalePrice(detail.getSalePrice()); 	// 零售价
					recipe.setDrugType(detail.getFeeCode()); 		// 药品分类
					recipe.setRecipeNo(detail.getRecipeNo()); 		//处方序号
					recipe.setRegId(detail.getRegId());				//挂号id
					//recipe.setComboNo(detail.getComboNo()); 		// 组号
					recipe.setApplyState("1"); 							// 申请状态|APPLY_STATE（1：提交未发药   2：已发药   3：已退药）
					if(detail.getOrder()!=null){
						recipe.setOrderId(detail.getOrder().getId()); 		// 医嘱ID
					}
					recipe.setRecipeId(detail.getRecipeId()); 	// 处方ID
					recipe.setPlusMinus("1");
					//TODO 医嘱状态修改
					recipeList.add(recipe);
				}
			}
			//插入请领
			if(StringUtils.isNotEmpty(recipeList)&&recipeList.size()>0){
				phaRecipeManager.batchSave(recipeList);
			}
		}
	}

	/* 
	 * 
	 *     收费失败：1.删除请领 2.删除收费明细
	 */
	@Override
	protected void doBizAfterPayFailed(String operator, BigDecimal amt, String orderId, List<String> chargeDetailIds) {
		// TODO 失败业务？
		List<OutpatientChargeDetail> detailList = getChargeDetailInfo(chargeDetailIds);
		List<String> recipeIds = new ArrayList<String>();
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
		}
		List<String> rIds = new ArrayList<String>();
		StringBuilder sqlRe = new StringBuilder("delete from PHA_RECIPE ocd where 1=1  AND ocd.id in ( ");
		for (int i = 0; i < recipeIds.size(); i++) {
			sqlRe.append(" ? ");
			rIds.add(recipeIds.get(i).toString());
			if (i != recipeIds.size() - 1)
				sqlRe.append(",");
		}
		sqlRe.append(" )");
		//删除请领
		phaRecipeManager.executeSql(sqlRe.toString(), rIds.toArray());
		
		List<String> idvalues = new ArrayList<String>();
		StringBuilder sql = new StringBuilder("delete from OC_CHARGEDETAIL ocd where 1=1  AND ocd.id in ( ");
		for (int i = 0; i < chargeDetailIds.size(); i++) {
			sql.append(" ? ");
			idvalues.add(chargeDetailIds.get(i).toString());
			if (i != chargeDetailIds.size() - 1)
				sql.append(",");
		}
		sql.append(" )");
		//删除原有收费明细
		outpatientChargeDetailManager.executeSql(sql.toString(), idvalues.toArray());
	}

	@Override
	protected void refundUpdateOtherInfos(InvoiceInfo info) {

	}

}
