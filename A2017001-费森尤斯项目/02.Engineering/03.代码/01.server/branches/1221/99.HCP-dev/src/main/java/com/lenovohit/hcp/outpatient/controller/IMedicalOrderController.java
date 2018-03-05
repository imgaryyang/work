package com.lenovohit.hcp.outpatient.controller;

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
import com.lenovohit.hcp.appointment.model.IActivity;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.ChargeDetail;
import com.lenovohit.hcp.base.model.ChargePkg;
import com.lenovohit.hcp.base.model.CommonItemInfo;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.base.utils.HcpDateUtils;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.card.model.Patient;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.odws.manager.OrderRetreatManager;
import com.lenovohit.hcp.odws.model.MedicalOrder;
import com.lenovohit.hcp.outpatient.model.IRecord;
import com.lenovohit.hcp.outpatient.model.IRecordDrug;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaRecipe;
import com.lenovohit.hcp.pharmacy.model.RecipeInfo;

/**
 * 处方查询
 */
@RestController
@RequestMapping("/hcp/app/odws/medicalOrder")
public class IMedicalOrderController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<MedicalOrder, String> medicalOrderManager;
	@Autowired
	private GenericManager<Department, String> departmentManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	@Autowired
	private GenericManager<HcpUser, String> hcpUserManager;
	@Autowired
	private GenericManager<RegInfo, String> regInfoManager;
	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	@Autowired
	private GenericManager<CommonItemInfo, String> commonItemManager;
	@Autowired
	private GenericManager<PhaDrugInfo, String> phaDrugManager;
	
	



	/**
	 * 根据条件查询患者医嘱
	 * @param 
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		
		IRecord query = JSONUtils.deserialize(data, IRecord.class);
		StringBuilder jql = new StringBuilder("from MedicalOrder order  where ");
		List<Object> values = new ArrayList<Object>();
		//医院编号
		if (!StringUtils.isEmpty(query.getHosNo())) {
			jql.append(" order.hosId = ? ");
			values.add(query.getHosNo());
		}else {
			ResultUtils.renderFailureResult("医院ID不能为空");
		}
		if(query!=null){
		//医院名称
		/*if (!StringUtils.isEmpty(query.getHosName())) {
			jql.append("and hosId in ( select hosId from Hospital hos where hos.hosName like ? )  ");
			values.add("%" + query.getHosName() + "%");
		}*/
		//档案编号
		if (!StringUtils.isEmpty(query.getProNo())) {
			jql.append(" and order.patientInfo.patientId = ? ");
			values.add(query.getProNo());
		}
		//档案名称
		/*if (!StringUtils.isEmpty(query.getProName())) {
			jql.append("and patientInfo.name like ? ");
			values.add("%" + query.getProName() + "%");
		}*/
		// 诊疗卡
		if (!StringUtils.isEmpty(query.getCardNo())) {
			jql.append("and patient.medicalCardNo = ? ");
			values.add(query.getCardNo());
		}
		//卡状态
		if(!StringUtils.isEmpty(query.getCardType())){
			jql.append("and  patient.patientId in ( select patientId from Card where cardType  = ? ) ");
			values.add(query.getCardType());
		}
		//诊疗活动编号
		/*if (!StringUtils.isEmpty(query.getActNo())) {
			jql.append("and order.regId in (select id from RegInfo where regId = ? ) ");
			values.add(query.getActNo());
		}*/
		//处方编号
		if (!StringUtils.isEmpty(query.getRecipeNo())) {
			jql.append("and order.recipeId = ? ");
			values.add(query.getRecipeNo());
		}
		//开始日期 -结束日期
		/*if (query.getStartDate()!=null && query.getEndDate()!=null) {
			jql.append("and ri.createTime between ? and ? ");
			values.add(query.getStartDate());
			values.add(query.getEndDate());
		} else {
			jql.append("and ri.createTime between ? and ? ");
			values.add(HcpDateUtils.getBeginOfDay());
			values.add(HcpDateUtils.getEndOfDay());
		}*/
		}
		List<MedicalOrder> medicalOrders=(List<MedicalOrder>) medicalOrderManager.findByJql(jql.toString(), values.toArray());
		List<IRecord> irecords=TransFormHisModel(medicalOrders);
		return ResultUtils.renderPageResult(irecords);
	}



	/**
	 * @param medicalOrders
	 * @return
	 */
	private List<IRecord> TransFormHisModel(List<MedicalOrder> medicalOrders) {
		List<IRecord> irecords=new ArrayList<IRecord>();
		for(int i=0;i<medicalOrders.size();i++){
			MedicalOrder medicalOrder=medicalOrders.get(i);
			irecords.add(TransFormModel(medicalOrder));
		}
		return irecords;
	}



	/**
	 * @param medicalOrder
	 * @return
	 */
	private IRecord TransFormModel(MedicalOrder medicalOrder) {
		IRecord irecord = new IRecord();
		irecord.setHosNo(medicalOrder.getHosId());
		//irecord.setHosName(hospitalManager.findOneByProp("hosId",medicalOrder.getHosId()).getHosName());
		Department dept=departmentManager.get(medicalOrder.getRecipeDept());
		irecord.setDepNo(dept!=null ? dept.getDeptId():null);
		irecord.setDepName(dept!=null ? dept.getDeptName():null);
		HcpUser doc=hcpUserManager.get(medicalOrder.getRecipeDoc());
		irecord.setDocNo(doc!=null ?doc.getUserId():null);
		irecord.setDocName(doc!=null ? doc.getName():null);
		irecord.setProNo(medicalOrder.getPatientInfo().getPatientId());
		irecord.setProName(medicalOrder.getPatientInfo().getName());
		RegInfo reg=regInfoManager.get(medicalOrder.getRegId());
		irecord.setActNo(reg!=null ? reg.getRegId():"");
		irecord.setFeeItemId(medicalOrder.getItemId());
		irecord.setFeeItemNo(medicalOrder.getItemCode());
		irecord.setApplyNo(medicalOrder.getApplyNo());
		irecord.setName(medicalOrder.getItemName());
		irecord.setCount(medicalOrder.getQty());
		irecord.setPrice(medicalOrder.getSalePrice());
		irecord.setAmt(medicalOrder.getQty().multiply(medicalOrder.getSalePrice()));
		irecord.setNeedPay(medicalOrder.getDispenseState()==MedicalOrder.ORDER_STATE_NEW ? "1":"0");
		irecord.setStatus(medicalOrder.getDispenseState());
		irecord.setId(medicalOrder.getOrderId());
		return irecord;
	}
	
	/**
	 * 根据条件查询患者医嘱明细
	 * @param
	 * @return
	 */
	@RequestMapping(value = "/listDetail", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result MedicalDetail(@RequestParam(value = "data", defaultValue = "") String data) {
		
		IRecordDrug query = JSONUtils.deserialize(data, IRecordDrug.class);
		StringBuilder jql = new StringBuilder("from OutpatientChargeDetail  where feeCode != '004' and feeCode != '007'  ");
		List<Object> values = new ArrayList<Object>();
		if(query!=null){
		//医院编号
		if (!StringUtils.isEmpty(query.getHosNo())) {
			jql.append("and hosId = ? ");
			values.add(query.getHosNo());
		}
		//医院名称
		if (!StringUtils.isEmpty(query.getHosName())) {
			jql.append("and hosId in ( select hosId from Hospital hos where hos.hosName like ? )  ");
			values.add("%" + query.getHosName() + "%");
		}
		//处方编号
		if (!StringUtils.isEmpty(query.getRecordNo())) {
			jql.append("and recipeId = ? )  ");
			values.add(query.getRecordNo());
		}
		//处方编号
		if (!StringUtils.isEmpty(query.getId())) {
			jql.append("and regId = ? )  ");
			values.add(query.getId());
		}
		}
		List<OutpatientChargeDetail> chargeDetails=(List<OutpatientChargeDetail>) outpatientChargeDetailManager.findByJql(jql.toString(), values.toArray());
		List<IRecordDrug> irecorddrugs=TransFormHisModels(chargeDetails);
		return ResultUtils.renderPageResult(irecorddrugs);
	}
	


	/**
	 * @param chargeDetails
	 * @return
	 */
	private List<IRecordDrug> TransFormHisModels(List<OutpatientChargeDetail> chargeDetails) {
		List<IRecordDrug> irecorddrugs=new ArrayList<IRecordDrug>();
		for(int i=0;i<chargeDetails.size();i++){
			OutpatientChargeDetail chargeDetail=chargeDetails.get(i);
			irecorddrugs.add(TransFormModel(chargeDetail));
		}
		return irecorddrugs;
	}
	private IRecordDrug TransFormModel(OutpatientChargeDetail chargeDetail) {

		IRecordDrug irecorddrug = new IRecordDrug();
		irecorddrug.setHosNo(chargeDetail.getHosId());
		//irecorddrug.setDrugNo(commonItemManager.findOneByProp("itemId",chargeDetail.getItemCode()).getItemCode());
		//irecorddrug.setDsNo(chargeDetail.getDrugDept()!=null ? departmentManager.get(chargeDetail.getDrugDept().getId()).getDeptId():"");
		irecorddrug.setName(chargeDetail.getItemName());
		irecorddrug.setUnit(chargeDetail.getUnit());
		if(chargeDetail.getItemCode()!=null){
			PhaDrugInfo drug= phaDrugManager.get(chargeDetail.getItemCode());
			if(drug!=null){
				irecorddrug.setDose(drug.getBaseDose()+"");
				irecorddrug.setPackages(drug.getPackQty()+"");
			}
			else{
				irecorddrug.setDose(null);
				irecorddrug.setPackages(null);
			}
		}
		irecorddrug.setCount(chargeDetail.getQty());
		irecorddrug.setPrice(chargeDetail.getSalePrice());
		//irecorddrug.setFrequency(chargeDetail.getOrder()!=null ? chargeDetail.getOrder().getFreq():null);
		//irecorddrug.setWay(chargeDetail.getOrder()!=null ? chargeDetail.getOrder().getUsage():null);
		irecorddrug.setWay(chargeDetail.getUnit());
		irecorddrug.setDose(chargeDetail.getDays()+"片");
		irecorddrug.setFrequency(chargeDetail.getCombNo());
		irecorddrug.setGroupNo(chargeDetail.getCombNo());
		irecorddrug.setStatus(chargeDetail.getApplyState());
		irecorddrug.setForm(chargeDetail.getSpecs());
		return irecorddrug;
	}


}
