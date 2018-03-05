/**
 * 
 */
package com.lenovohit.hcp.pharmacy.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.BeanUtils;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.odws.model.MedicalOrder;
import com.lenovohit.hcp.pharmacy.manager.PhaRecipeBackManager;
import com.lenovohit.hcp.pharmacy.manager.PhaStoreManager;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaDrugPriceView;
import com.lenovohit.hcp.pharmacy.model.PhaInputInfo;
import com.lenovohit.hcp.pharmacy.model.PhaOutputInfo;
import com.lenovohit.hcp.pharmacy.model.PhaRecipe;

/**
 * @author duanyanshan
 * @date 2017年11月9日 下午5:47:45
 */
@Service
@Transactional
public class PhaRecipeBackManagerImpl implements PhaRecipeBackManager{
	
	private static final String PAYED_UNGET_MEDICINE = "1";// 缴费未发药
	private static final String PAYED_GET_MIDICINE = "2";// 已发药
	private static final String PAYED_BACK_MEDICINE = "3";// 已退药
	private static final String PAYBACK_MEDICINE = "4";// 已退费
	
	@Autowired
	private GenericManager<PhaRecipe, String> phaRecipeManager;
	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	@Autowired
	private GenericManager<PhaDrugPriceView, String> phaDrugPriceViewManager;
	@Autowired
	private PhaStoreManager phaStoreManager;
	@Autowired
	private GenericManager<MedicalOrder, String> medicalOrderManager;
	@Autowired
	private GenericManager<PhaOutputInfo, String> phaOutputInfoManager;

	/* 退药驳回
	 * @see com.lenovohit.hcp.pharmacy.manager.PhaRecipeBackManager#phaRecipeBack(java.lang.String)
	 */
	@Override
	public String phaRecipeBack(String regId, HcpUser user) {
		//将收费明细收费明细表oc_chargeDetail新数据和抵充数据删除，
		try{
			List<Object> value = new ArrayList<Object>();
			StringBuilder detailJql = new StringBuilder("from OutpatientChargeDetail re where re.regId = ? and re.dataFrom IS NOT NULL ");
			value.add(regId);
			List<OutpatientChargeDetail> dList = outpatientChargeDetailManager.find(detailJql.toString(), value.toArray());
			if(dList != null && dList.size()>0){
				for(OutpatientChargeDetail r : dList){
					this.outpatientChargeDetailManager.delete(r);
				}
			}
		
			//原数据恢复原有状态（2已发药） 
			List<Object> values = new ArrayList<Object>();
			StringBuilder jql = new StringBuilder("from OutpatientChargeDetail re where re.regId = ? and re.applyState = ? ");
			values.add(regId);
			values.add(PhaRecipe.APPLY_STATE_APPLY);
			List<OutpatientChargeDetail> oList = outpatientChargeDetailManager.find(jql.toString(), values.toArray());
			if(oList != null && oList.size()>0){
				for(OutpatientChargeDetail r : oList){
					Date now = new Date();
					r.setUpdateOper(user.getName());
					r.setUpdateTime(now);
					r.setApplyState(PAYED_GET_MIDICINE);
					this.outpatientChargeDetailManager.save(r);
				}
			}
		
			//药品请领表新数据和抵充数据删除；
			StringBuilder recipej = new StringBuilder("from PhaRecipe re where re.regId = ? and re.dataFrom IS NOT NULL ");
			List<PhaRecipe> rList = phaRecipeManager.find(recipej.toString(), value.toArray());
			//List<PhaRecipe> pList = phaRecipeManager.findByProp("recipeId", regId);
			if(rList != null && rList.size()>0){
				for(PhaRecipe r : rList){
					this.phaRecipeManager.delete(r);
				
				}
			}
			//原数据恢复原有状态
			StringBuilder j = new StringBuilder("from PhaRecipe re where re.regId = ? and re.applyState = ? ");
			List<PhaRecipe> pList = phaRecipeManager.find(j.toString(), values.toArray());
			//List<PhaRecipe> pList = phaRecipeManager.findByProp("recipeId", regId);
			if(pList != null && pList.size()>0){
				for(PhaRecipe r : pList){
					//修改原有记录状态
					Date now = new Date();
					r.setUpdateOper(user.getName());
					r.setUpdateTime(now);
					r.setApplyState(PhaRecipe.APPLY_STATE_DISPENSED);
					this.phaRecipeManager.save(r);
				
				}
			}
			//医嘱表删除新的，恢复原有状态
			List<Object> val = new ArrayList<Object>();
			StringBuilder orderJql = new StringBuilder("from MedicalOrder where  regId = ? ");
			val.add(regId);
			List<MedicalOrder> list = medicalOrderManager.find(orderJql.toString(), val.toArray());
			if(list != null && list.size()> 0){
				for(MedicalOrder order : list){
					if(MedicalOrder.ORDER_STATE_NEW.equals(order.getOrderState())){
						medicalOrderManager.delete(order);
					}else{
						order.setOrderState(MedicalOrder.ORDER_STATE_CHARGED);
						medicalOrderManager.save(order);
					}
				}
			}
			return "success";
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return "fail";
		}
		
	}
	
	
	/**
	 * 转换入库信息
	 * @param r
	 * @return
	 */
	public List<PhaInputInfo> input(PhaRecipe r, HcpUser user){
		
		List<PhaInputInfo> returnList = new ArrayList<PhaInputInfo>();
		PhaDrugPriceView phaDrugInfo = phaDrugPriceViewManager.get(r.getDrugCode());
		//获取出库信息
		List<Object> val = new ArrayList<Object>();
		StringBuilder jql = new StringBuilder("from PhaOutputInfo where  hosId = ? and  appBill = ? ");
		val.add(user.getHosId()); 
		val.add(r.getApplyNo()); // 出库申请单号
		PhaOutputInfo out = phaOutputInfoManager.findOne(jql.toString(), val.toArray());
		PhaInputInfo info = new PhaInputInfo();
		//退库到药品来源科室
		info.setDeptId(out.getDeptInfo().getId());
        info.setInType("I7");//退药入库
        info.setHosId(out.getHosId());
        info.setPlusMinus(-1);
        info.setDrugCode(out.getDrugCode());
        info.setDrugInfo(out.getDrugInfo());
        info.setTradeName(out.getTradeName());
        info.setSpecs(out.getSpecs());
        info.setDrugType(out.getDrugType());
        //info.setApprovalNo(phaDrugInfo.getApprovedId());
        info.setProducer(out.getProducerInfo().getId());
        info.setCompanyInfo(out.getCompanyInfo());
        info.setBuyCost(out.getBuyPrice().multiply(r.getApplyNum()));
        info.setSaleCost(out.getSalePrice().multiply(r.getApplyNum()));
        info.setBuyPrice(out.getBuyPrice());
        info.setSalePrice(out.getSalePrice());
	    //info.setInSum(r.getApplyNum().multiply(new BigDecimal(phaDrugInfo.getPackQty())));
        info.setInSum(r.getApplyNum());
	    info.setMinUnit(phaDrugInfo.getMiniUnit());
	    info.setInOper(user.getName());
	    info.setInTime(new Date());
	    info.setApprovalNo(out.getApprovalNo());
	    info.setInputState("4");
	    info.setProduceDate(out.getProduceDate());
	    
	    //有效期
	    info.setValidDate(out.getValidDate());

	    returnList.add(info);
		return returnList;
	}

	/* 确认退药
	 * @see com.lenovohit.hcp.pharmacy.manager.PhaRecipeBackManager#phaRecipe(java.lang.String)
	 */
	@Override
	public String phaRecipe(String regId, HcpUser user) {
		try {
		    List<Object> values = new ArrayList<Object>();
		    StringBuilder jql = new StringBuilder("from PhaRecipe re where re.regId = ?  and re.applyState in (? , ?) order by re.dataFrom ");
		    values.add(regId);
		    values.add(PhaRecipe.APPLY_STATE_DISPENSED);
		    values.add(PhaRecipe.APPLY_STATE_APPLY);
			List<PhaRecipe> orders=phaRecipeManager.find(jql.toString(), values.toArray());
			List<PhaRecipe> ordList = new ArrayList<PhaRecipe>();
			
			//数据处理：获取退药的数量
			if(orders != null && orders.size()>0){
				for(int s = 0;s<orders.size(); s++){
					if(PhaRecipe.APPLY_STATE_APPLY.equals(orders.get(s).getApplyState())){
						if(s>0 && orders.get(s).getId()!=null && orders.get(s).getId().equals(orders.get(s-1).getDataFrom())){
							orders.get(s).setApplyNum(orders.get(s).getApplyNum().subtract(orders.get(s-1).getApplyNum()));
						}
						if(s < orders.size()-1 && orders.get(s).getId().equals(orders.get(s+1).getDataFrom())){
							orders.get(s).setApplyNum(orders.get(s).getApplyNum().subtract(orders.get(s+1).getApplyNum()));
						}
						if(orders.get(s).getApplyNum().compareTo(BigDecimal.ZERO)!=0){
							ordList.add(orders.get(s));
						}
						
					}
				}
			}
			
		    //List<PhaRecipe> rList = phaRecipeManager.find(jql.toString(), values.toArray());
		    if(ordList != null && ordList.size()>0){
			    for(PhaRecipe r : ordList){
				   //修改原有记录状态
				   Date now = new Date();
				   r.setUpdateOper(user.getName());
				   r.setUpdateTime(now);
				   r.setApplyState(PAYED_BACK_MEDICINE);
				   this.phaRecipeManager.save(r);
				
				   //修改库存信息
				   List<PhaInputInfo> returnList = phaStoreManager.phaInput(input(r,user), user);
			    }
		    }
		
		    //修改缴费明细状态
		    StringBuilder j = new StringBuilder("from OutpatientChargeDetail re where re.regId = ? and re.applyState = ? ");
		    values.clear();
		    values.add(regId);
		    values.add(PhaRecipe.APPLY_STATE_APPLY);
		    List<OutpatientChargeDetail> oList = outpatientChargeDetailManager.find(j.toString(), values.toArray());
		    //List<OutpatientChargeDetail> oList = outpatientChargeDetailManager.findByProp("regId", regId);
		    if(oList != null && oList.size()>0){
			    for(OutpatientChargeDetail r : oList){
				   Date now = new Date();
				   r.setUpdateOper(user.getName());
				   r.setUpdateTime(now);
				   r.setApplyState(OutpatientChargeDetail.APPLY_STATE_APPLY_CHARGE);
				   this.outpatientChargeDetailManager.save(r);
			    }
		    }
		    return "success";
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return "fail";
		}
		
	}


	
	
}
