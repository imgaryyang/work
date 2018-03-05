package com.lenovohit.hcp.pharmacy.manager.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.odws.model.MedicalOrder;
import com.lenovohit.hcp.pharmacy.manager.PhaDrugDispenseManager;
import com.lenovohit.hcp.pharmacy.manager.PhaStoreManager;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaOutputInfo;
import com.lenovohit.hcp.pharmacy.model.PhaRecipe;

@Service
@Transactional
public class PhaDrugDispenseManagerImpl implements PhaDrugDispenseManager {
	
	/**
	 * 门诊处方manager
	 */
	@Autowired
	private GenericManager<MedicalOrder, String> medicalOrderManager;
	
	/**
	 * 药品处方请领manager
	 */
	@Autowired
	private GenericManager<PhaRecipe, String> phaRecipeManager;
	
	/**
	 * 出入库接口manager
	 */
	@Autowired
	private PhaStoreManager phaStoreManager;

	/**
	 * 记录发药信息
	 */
	@Override
	public void dispense(String recipeId, HcpUser user) {

		try {
			// TODO: 暂时使用直接sql语句操作，后期独立部署的时候改为接口方式调用
			//step 1 : 更新医嘱表 ow_order 药品发放状态 dispense_state -> 1
			medicalOrderManager.executeSql("UPDATE OW_ORDER SET DISPENSE_STATE = '1' WHERE RECIPE_ID = ?", recipeId);
			//step 2 : 更新收费明细表 oc_chargedetail 申请状态 apply_state -> 2
			medicalOrderManager.executeSql("UPDATE OC_CHARGEDETAIL SET APPLY_STATE = '2' WHERE RECIPE_ID = ?", recipeId);
			//step 3 : 更新药品请领信息表 pha_recipe 申请状态 apply_state -> 2
			medicalOrderManager.executeSql("UPDATE PHA_RECIPE SET APPLY_STATE = '2' WHERE RECIPE_ID = ?", recipeId);
			//step 4 : 更新库存
			//取医嘱信息
			//取药品处方请领信息
			//List<MedicalOrder> orders =  (List<MedicalOrder>)medicalOrderManager.find("from MedicalOrder where recipeId = '" + recipeId + "' order by recipeNo");
			List<PhaRecipe> recipes =  (List<PhaRecipe>)phaRecipeManager.find("from PhaRecipe where recipeId = '" + recipeId + "' order by recipeNo");
			ArrayList<PhaOutputInfo> outputInfoList = new ArrayList<PhaOutputInfo>();
			for(int i = 0; i < recipes.size(); i++){
				PhaRecipe recipe = recipes.get(i);
				//MedicalOrder order = orders.get(i);
				PhaOutputInfo outputInfo = new PhaOutputInfo();
				
				outputInfo.setHosId(recipe.getHosId()); // 医院id
				// outputInfo.setOutBill();
				outputInfo.setAppBill(recipe.getApplyNo()); // 出库申请单号
				
				// 出库科室
				Department outputDept = new Department();
				outputDept.setId(recipe.getDeptId());
				outputInfo.setDeptInfo(outputDept);
				
				// 入库科室
				Department inputDept = new Department();
				inputDept.setId(recipe.getApplyDept());
				outputInfo.setToDept(inputDept);
				
				outputInfo.setOutType("06"); // 出库类型
				outputInfo.setBillNo(recipe.getRecipeNo()); // 序号
				outputInfo.setOutputState("2"); // 出库单状态 - 已出库
				outputInfo.setSalePrice(recipe.getSalePrice()); // 零售价
				outputInfo.setOutSum(recipe.getApplyNum()); // 出库数量
				
				// 药品信息
				PhaDrugInfo drugInfo = new PhaDrugInfo();
				drugInfo.setId(recipe.getDrugCode());
				outputInfo.setDrugInfo(drugInfo);
				
				outputInfoList.add(outputInfo);
	        }
			phaStoreManager.dispenseOutput(outputInfoList, user);
		} catch(RuntimeException e) {
			e.printStackTrace();
			throw new BaseException(e.getMessage());
		} catch(Exception e) {
			e.printStackTrace();
			throw new BaseException("处理发药信息出错！");
		}
	}

}
