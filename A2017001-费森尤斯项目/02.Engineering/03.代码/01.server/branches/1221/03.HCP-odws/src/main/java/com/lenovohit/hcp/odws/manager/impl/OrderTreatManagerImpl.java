/**
 * 
 */
package com.lenovohit.hcp.odws.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.BeanUtils;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.odws.manager.OrderRetreatManager;
import com.lenovohit.hcp.odws.model.MedicalOrder;
import com.lenovohit.hcp.pharmacy.model.PhaRecipe;

/**
 * @author duanyanshan
 * @date 2017年11月10日 下午5:27:54
 */
@Service
@Transactional
public class OrderTreatManagerImpl implements OrderRetreatManager{
	
	@Autowired
	private GenericManager<PhaRecipe, String> phaRecipeManager;
	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	@Autowired
	private GenericManager<MedicalOrder, String> medicalOrderManager;
	@Autowired
	private IRedisSequenceManager redisSequenceManager;

	/* 医生站退药编辑
	 * @see com.lenovohit.hcp.pharmacy.manager.PhaRecipeBackManager#orderBack(java.util.List, com.lenovohit.hcp.base.model.HcpUser)
	 */
	@Override
	public String orderBack(List<MedicalOrder> list) {
		try{
			//1，医嘱表ow_order 增加一条数据，创建id关联（id为上一个医嘱，不是根医嘱的），新数据状态置为1（新开立），旧数据置为4(已作废)；
			//以字符串的形式传递值查询为[]，不明白为什么
			String str ="";   //orderId拼接
			List<String> orderValues = new ArrayList<>();
			String recipeIds = "";    //处方号拼接
			List<String> recipeValues = new ArrayList<>();
			Map<String,List<MedicalOrder>> map = handleData(list);
			if(list != null && list.size()>0){
				for (String key : map.keySet()) {
					//新建处方号
					String recipeId = redisSequenceManager.get("OW_ORDER", "RECIPE_ID");
					List<MedicalOrder> orderList = new ArrayList<MedicalOrder>();
					for(MedicalOrder order : map.get(key)){
						MedicalOrder orderTmp = new MedicalOrder();
						BeanUtils.copyProperties(order, orderTmp);
						//医嘱id和hosId组成唯一键所以要更新
						String orderId = redisSequenceManager.get("OW_ORDER", "ORDER_ID");
						//id为空orderId会自动获取，不需要创建
						//str += "'"+order.getId()+"',";//sql中作为字符串处理要加单引号
						str+=" ? ,";
						orderValues.add(order.getId());
						//recipeIds +="'"+order.getRecipeId()+"',";
						recipeIds+=" ? ,";
						recipeValues.add(order.getRecipeId());
						orderTmp.setId(null);
						orderTmp.setOrderState(MedicalOrder.ORDER_STATE_NEW);
						orderTmp.setRecipeId(recipeId);
						orderTmp.setOrderId(orderId);
						orderTmp.setDataFrom(order.getId());
						orderTmp.setChargeFlag("0");
						medicalOrderManager.save(orderTmp);
						orderList.add(orderTmp);
					} 
					//将新的医嘱记录更新到map中
					map.put(key, orderList);
			    }
			}
			if(!"".equals(str)){
				//原有数据状态置为正在申请退药(并插入冲销记录)
				List<Object> values = new ArrayList<Object>();
				StringBuilder jql = new StringBuilder("from MedicalOrder re where re.id in ( "+str.substring(0, str.length()-1)+" )");
				//values.add(str.substring(0, str.length()-1));
				List<MedicalOrder> rList = medicalOrderManager.find(jql.toString(), orderValues.toArray());
				List<MedicalOrder> oList = new ArrayList<>();
				if(rList !=null && rList.size()>0){
					for(MedicalOrder order : rList){
						order.setOrderState(MedicalOrder.ORDER_STATE_PROCESSING);
						oList.add(order);
					}
					//medicalOrderManager.batchSave(rList);
					medicalOrderManager.batchSave(oList);
				}
			}
		
			//2，收费明细表oc_chargeDetail新增抵充数据和新数据，创建id关联，
			//旧数据状态置为5（已申请未退药），抵充数据置为负且状态设置为6（抵充），新数据状态置为1和2（已缴费未发药和已发药  ，根据实际情况给状态）。
			if(!"".equals(recipeIds)){
				//原有数据状态置为已作废
				StringBuilder jql = new StringBuilder("from OutpatientChargeDetail re where re.recipeId in ( "+recipeIds.substring(0, recipeIds.length()-1)+" ) ");
				//values.add(recipeIds.substring(0, recipeIds.length()-1));
				List<OutpatientChargeDetail> rList = outpatientChargeDetailManager.find(jql.toString(), recipeValues.toArray());
		    
				getTakeOutDetail(rList,map);
				if(rList !=null && rList.size()>0){
					//通过医嘱表的durg_flag字段标识是药品或项目，如果有药品则apply_state全部置为5，如果全是项目则置成7；
					for(OutpatientChargeDetail order : rList){
						//如果是未发药1并且是药品则置为7未退费
						if(OutpatientChargeDetail.APPLY_STATE_PAY_UNMEDICINE.equals(order.getApplyState()) && order.getDrugFlag().equals(MedicalOrder.DRUG_FLAG_PATENT_MEDICINE)){//状态为1
							order.setApplyState(OutpatientChargeDetail.APPLY_STATE_APPLY_CHARGE);//状态为7，未退费
						}
						else{//
							if(order.getDrugFlag().equals(MedicalOrder.DRUG_FLAG_PATENT_MEDICINE)){
								//只要包含药品全部置成5
								alterOldChargeDetail(rList);
								break;
							}
							else{
								order.setApplyState(OutpatientChargeDetail.APPLY_STATE_APPLY_CHARGE);//状态为7，未退费
							}
						}
					}
					outpatientChargeDetailManager.batchSave(rList);
				}
			}
		
			//3，药品请领表pha_recipe同上
			if(!"".equals(recipeIds)){
				//原有数据状态置为已作废
				List<Object> values = new ArrayList<Object>();
				StringBuilder jql = new StringBuilder("from PhaRecipe re where re.recipeId in ( "+recipeIds.substring(0, recipeIds.length()-1)+" )  ");
				//values.add(recipeIds.substring(0, recipeIds.length()-1));
				List<PhaRecipe> rList = phaRecipeManager.find(jql.toString(), recipeValues.toArray());
		    
				getTakeOutRecipe(rList,map);
				if(rList !=null && rList.size()>0){
					for(PhaRecipe order : rList){
						if(!PhaRecipe.APPLY_STATE_CHARGED.equals(order.getApplyState())){
							order.setApplyState(PhaRecipe.APPLY_STATE_APPLY);
						}else{
							order.setApplyState(PhaRecipe.APPLY_STATE_RETURNED);
						}
						phaRecipeManager.save(order);
					}
				}
			}
			return "success";
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			throw new RuntimeException("退费操作失败！");
		}
		
	}
	
	private void alterOldChargeDetail(List<OutpatientChargeDetail> rList) {
		for(OutpatientChargeDetail order : rList){
			order.setApplyState(OutpatientChargeDetail.APPLY_STATE_APPLY);//状态为5，已申请未退药
		}
	}

	//通过对比，获取抵充数据和新数据
	public void getTakeOutDetail(List<OutpatientChargeDetail> chargeList,Map<String,List<MedicalOrder>> map){
		for (String key : map.keySet()) {
			for(MedicalOrder order :map.get(key)){
				for(OutpatientChargeDetail detail : chargeList){
					if(key.equals(detail.getRecipeId()) && order.getItemId().equals(detail.getItemCode())){
						OutpatientChargeDetail outDetail = new OutpatientChargeDetail();
						OutpatientChargeDetail newDetail = new OutpatientChargeDetail();
						//生成新收费明细
						if(!order.getQty().equals(detail.getQty())){
							BeanUtils.copyProperties(detail, newDetail);
							newDetail.setQty(order.getQty());
							/*if(!OutpatientChargeDetail.APPLY_STATE_PAY_UNMEDICINE.equals(detail.getApplyState())){
								newDetail.setApplyState(OutpatientChargeDetail.APPLY_STATE_MEDICINED);
							}*/
							newDetail.setApplyState("0");
							newDetail.setDataFrom(detail.getId());
							newDetail.setId(null);
							MedicalOrder o = new MedicalOrder();
							o.setId(order.getId());
							newDetail.setOrder(o);
							newDetail.setTotCost(newDetail.getSalePrice().multiply(newDetail.getQty()).setScale(1, BigDecimal.ROUND_HALF_UP));
							newDetail.setRecipeId(order.getRecipeId());
							outpatientChargeDetailManager.save(newDetail);
						}
					
						//生成抵充数据
						BeanUtils.copyProperties(detail, outDetail);
						outDetail.setId(null);
						outDetail.setTotCost(outDetail.getSalePrice().multiply(outDetail.getQty()).setScale(1, BigDecimal.ROUND_HALF_UP).negate());
						outDetail.setApplyState(OutpatientChargeDetail.APPLY_STATE_TAKE_OUT);
						outDetail.setPlusMinus(new BigDecimal("-1"));
						outDetail.setQty(outDetail.getQty().negate());
						outDetail.setDataFrom(detail.getId());
						outpatientChargeDetailManager.save(outDetail);
					}
				}
			}
		}
	}
	
	
	//通过对比，获取抵充数据和新数据
	public void getTakeOutRecipe(List<PhaRecipe> recipeList,Map<String,List<MedicalOrder>> map){
		for (String key : map.keySet()) {
			for(MedicalOrder order :map.get(key)){
				for(PhaRecipe detail : recipeList){
					if(key.equals(detail.getRecipeId()) && order.getItemId().equals(detail.getDrugCode())){
						PhaRecipe outDetail = new PhaRecipe();
						PhaRecipe newDetail = new PhaRecipe();
						//生成新收费明细
						if(!order.getQty().equals(detail.getApplyNum())){
							BeanUtils.copyProperties(detail, newDetail);
							newDetail.setApplyNum(order.getQty());
							if(!PhaRecipe.APPLY_STATE_CHARGED.equals(detail.getApplyState())){
								newDetail.setApplyState(PhaRecipe.APPLY_STATE_DISPENSED);
							}
							newDetail.setDataFrom(detail.getId());
							newDetail.setId(null);
							newDetail.setApplyNo(null);
							newDetail.setRecipeId(order.getRecipeId());
							newDetail.setOrderId(order.getId());
							//newDetail.setApplyNo(String.valueOf(Math.round(Math.random() * 100000000)));
							phaRecipeManager.save(newDetail);
						}
					
						//生成抵充数据
						BeanUtils.copyProperties(detail, outDetail);
						outDetail.setId(null);
						outDetail.setApplyNo(null);
						outDetail.setApplyState(PhaRecipe.APPLY_STATE_TAKE_OUT);
						outDetail.setPlusMinus("-1");
						outDetail.setApplyNum(outDetail.getApplyNum().negate());
						outDetail.setDataFrom(detail.getId());
						phaRecipeManager.save(outDetail);
					}
				}
			}
		}
	}
	
	/**
	 * 将list转换为Map
	 * @param list
	 * @return
	 */
	public Map handleData(List<MedicalOrder> list){
		Map map = new HashMap<String,List<MedicalOrder>>();
		if(list!=null&&list.size()>0){
			/*List<MedicalOrder> orderList = new ArrayList<MedicalOrder>();
			for(int i = 0;i<list.size();i++){
				if(i==0){
					orderList.add(list.get(0));
				}else{
					if(list.get(i-1).getRecipeId().equals(list.get(i).getRecipeId())){
						orderList.add(list.get(i));
					}else{
						map.put(list.get(i-1).getRecipeId()+"", orderList);
						orderList.clear();
						orderList.add(list.get(i));
					}
				}
				if(i==list.size()-1){
					map.put(list.get(i).getRecipeId()+"", orderList);
				}
			}
		}*/
			//这样写会不会更简单点
		for(int i=0;i<list.size();i++){
			MedicalOrder medicalOrder=list.get(i);
			if( map.get(medicalOrder.getRecipeId())==null){
				List<MedicalOrder> temOrders=new ArrayList<MedicalOrder>();
				temOrders.add(medicalOrder);
				map.put(medicalOrder.getRecipeId(), temOrders);
			}
			else{
				List<MedicalOrder> orders=(List<MedicalOrder>) map.get(medicalOrder.getRecipeId());
				orders.add(medicalOrder);
				map.put(medicalOrder.getRecipeId(), orders);
			}
		}
		
		
	}
		return map;
	}
}
