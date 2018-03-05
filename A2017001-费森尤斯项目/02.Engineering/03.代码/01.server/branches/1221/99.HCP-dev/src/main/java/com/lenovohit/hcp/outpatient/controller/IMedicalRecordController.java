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
import com.lenovohit.hcp.card.model.Card;
import com.lenovohit.hcp.card.model.Patient;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.odws.manager.OrderRetreatManager;
import com.lenovohit.hcp.odws.model.Diagnose;
import com.lenovohit.hcp.odws.model.InquiryRecord;
import com.lenovohit.hcp.odws.model.MedicalOrder;
import com.lenovohit.hcp.outpatient.model.IDiagnose;
import com.lenovohit.hcp.outpatient.model.IMedicalRecord;
import com.lenovohit.hcp.outpatient.model.IRecord;
import com.lenovohit.hcp.outpatient.model.IRecordDrug;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaRecipe;
import com.lenovohit.hcp.pharmacy.model.RecipeInfo;

/**
 * 病历查询
 */
@RestController
@RequestMapping("/hcp/app/odws/inquiry")
public class IMedicalRecordController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<InquiryRecord, String> inquiryRecordManager;
	@Autowired
	private GenericManager<Department, String> departmentManager;
	@Autowired
	private GenericManager<HcpUser, String> hcpUserManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	@Autowired
	private GenericManager<RegInfo, String> regInfoManager;
	@Autowired
	private GenericManager<Card, String> cardManager;
	
	



	/**
	 * 根据条件查询患者病历
	 * @param 
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		
		IMedicalRecord query = JSONUtils.deserialize(data, IMedicalRecord.class);
		StringBuilder jql = new StringBuilder("from InquiryRecord  where ");
		List<Object> values = new ArrayList<Object>();
		//医院编号
		if (!StringUtils.isEmpty(query.getHosNo())) {
			jql.append(" order.hosId = ? ");
			values.add(query.getHosNo());
		}else {
			ResultUtils.renderFailureResult("医院ID不能为空");
		}
		//医院名称
		if (!StringUtils.isEmpty(query.getHosName())) {
			jql.append("and hosId in ( select hosId from Hospital hos where hos.hosName like ? )  ");
			values.add("%" + query.getHosName() + "%");
		}
		//档案编号
		if (!StringUtils.isEmpty(query.getProNo())) {
			jql.append("and patientInfo.patientId = ? ");
			values.add(query.getProNo());
		}
		//档案名称
		if (!StringUtils.isEmpty(query.getProName())) {
			jql.append("and patientInfo.name like ? ");
			values.add("%" + query.getProName() + "%");
		}
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
		if (!StringUtils.isEmpty(query.getActNo())) {
			jql.append("and regId in (select id from RegInfo where regId = ? ) ");
			values.add(query.getActNo());
		}
		
		//开始日期 -结束日期
		if (query.getStartDate()!=null && query.getEndDate()!=null) {
			jql.append("and createTime between ? and ? ");
			values.add(query.getStartDate());
			values.add(query.getEndDate());
		} else {
			jql.append("and createTime between ? and ? ");
			values.add(HcpDateUtils.getBeginOfDay());
			values.add(HcpDateUtils.getEndOfDay());
		}
		
		List<InquiryRecord> inquiryRecords=(List<InquiryRecord>) inquiryRecordManager.findByJql(jql.toString(), values.toArray());
		List<IMedicalRecord> imedicalRecords=TransFormHisModel(inquiryRecords);
		return ResultUtils.renderPageResult(imedicalRecords);
	}



	/**
	 * @param inquiryRecords
	 * @return
	 */
	private List<IMedicalRecord> TransFormHisModel(List<InquiryRecord> inquiryRecords) {
		List<IMedicalRecord> imedicalRecords=new ArrayList<IMedicalRecord>();
		for(int i=0;i<inquiryRecords.size();i++){
			InquiryRecord inquiryRecord=inquiryRecords.get(i);
			imedicalRecords.add(TransFormModel(inquiryRecord));
		}
		return imedicalRecords;
	}



	/**
	 * @param diagnoses
	 * @return
	 */
	private IMedicalRecord TransFormModel(InquiryRecord inquiryRecord) {
		IMedicalRecord imedicalRecord = new IMedicalRecord();
		imedicalRecord.setHosNo(inquiryRecord.getHosId());
		imedicalRecord.setHosName(hospitalManager.get(inquiryRecord.getHosId()).getHosName());
		RegInfo  reginfo=regInfoManager.get(inquiryRecord.getRegId());
		imedicalRecord.setProNo(reginfo.getPatient().getPatientId());
		imedicalRecord.setProName(reginfo.getPatient().getName());
		imedicalRecord.setActNo(reginfo.getRegId());
		Card card = cardManager.findOneByProp("patientId", reginfo.getPatient().getPatientId());
		imedicalRecord.setCardNo(card != null ? card.getCardNo():null); 
		imedicalRecord.setCardType(card != null ? card.getCardType():null); 
		imedicalRecord.setChiefComplaint(inquiryRecord.getChiefComplaint());
		imedicalRecord.setPresentIllness(inquiryRecord.getPresentIllness());
		imedicalRecord.setPastHistory(inquiryRecord.getPastHistory());
		imedicalRecord.setAllergicHistory(inquiryRecord.getAllergicHistory());
		imedicalRecord.setPhysicalExam(inquiryRecord.getPhysicalExam());
		imedicalRecord.setOtherExam(inquiryRecord.getOtherExam());
		imedicalRecord.setMoOrder(inquiryRecord.getMoOrder());
		imedicalRecord.setWeight(inquiryRecord.getWeight());
		imedicalRecord.setHeight(inquiryRecord.getHeight());
		imedicalRecord.setSeeTime(inquiryRecord.getSeeTime());
		imedicalRecord.setSeeDept(inquiryRecord.getSeeDept().getId()); //看诊科室id
		imedicalRecord.setSeeDoc(inquiryRecord.getSeeDoc().getId()); 
		imedicalRecord.setMedicalRecordsType(inquiryRecord.getMedicalRecordsType());
		imedicalRecord.setBloodPressureprMax(inquiryRecord.getBloodPressureprMax());
		imedicalRecord.setBloodPressureprMin(inquiryRecord.getBloodPressureprMin());
		imedicalRecord.setTemperature(inquiryRecord.getTemperature());
		imedicalRecord.setPulseRate(inquiryRecord.getPulseRate());
		imedicalRecord.setBreath(inquiryRecord.getBreath());
		return imedicalRecord;
	}
	
	
}
