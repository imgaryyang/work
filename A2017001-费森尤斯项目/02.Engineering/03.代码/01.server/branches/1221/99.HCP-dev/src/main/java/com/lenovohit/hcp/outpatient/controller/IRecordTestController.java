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
import com.lenovohit.hcp.base.model.ItemShortDetail;
import com.lenovohit.hcp.base.utils.HcpDateUtils;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.card.model.Patient;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.odws.manager.OrderRetreatManager;
import com.lenovohit.hcp.odws.manager.PatLisManager;
import com.lenovohit.hcp.odws.model.Diagnose;
import com.lenovohit.hcp.odws.model.InquiryRecord;
import com.lenovohit.hcp.odws.model.MedicalOrder;
import com.lenovohit.hcp.onws.moddel.PatStore;
import com.lenovohit.hcp.onws.moddel.PatStoreExec;
import com.lenovohit.hcp.onws.moddel.PatientStoreRecord;
import com.lenovohit.hcp.onws.moddel.PhaLisResult;
import com.lenovohit.hcp.onws.moddel.PhaPatLis;
import com.lenovohit.hcp.outpatient.model.IDiagnose;
import com.lenovohit.hcp.outpatient.model.IMedicalRecord;
import com.lenovohit.hcp.outpatient.model.IRecord;
import com.lenovohit.hcp.outpatient.model.IRecordDrug;
import com.lenovohit.hcp.outpatient.model.IRecordTest;
import com.lenovohit.hcp.outpatient.model.ITestDetail;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaRecipe;
import com.lenovohit.hcp.pharmacy.model.RecipeInfo;

/**
 * 检验查询
 */
@RestController
@RequestMapping("/hcp/app/onws/phaPatlis")
public class IRecordTestController extends HcpBaseRestController {
	
	private GenericManager<Department, String> departmentManager;
	@Autowired
	private GenericManager<HcpUser, String> hcpUserManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	@Autowired
	private GenericManager<RegInfo, String> regInfoManager;
	@Autowired
	private GenericManager<PhaPatLis, String> patlisManager;
	@Autowired
	private GenericManager<PhaLisResult, String> PhaLisResultManager;
	
	



	/**
	 * 根据条件查询检查
	 * @param 
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		
		IRecordTest query = JSONUtils.deserialize(data, IRecordTest.class);
		StringBuilder jql = new StringBuilder("from PhaPatLis where ");
		List<Object> values = new ArrayList<Object>();
	
		//医院编号
		if (!StringUtils.isEmpty(query.getHosNo())) {
			jql.append(" hosId = ? ");
			values.add(query.getHosNo());
		}
		//医院名称
		if (!StringUtils.isEmpty(query.getHosName())) {
			jql.append("and hosId in ( select hosId from Hospital hos where hos.hosName like ? )  ");
			values.add("%" + query.getHosName() + "%");
		}
		//档案编号
		if (!StringUtils.isEmpty(query.getProNo())) {
			jql.append("and patient.patientId = ? ");
			values.add(query.getProNo());
		}
		//档案名称
		if (!StringUtils.isEmpty(query.getProName())) {
			jql.append("and patient.name like ? ");
			values.add("%" + query.getProName() + "%");
		}
		// 诊疗卡
		if (!StringUtils.isEmpty(query.getCardNo())) {
			jql.append("and  patient.medicalCardNo = ? ");
			values.add(query.getCardNo());
		}
		//卡类型
		if(!StringUtils.isEmpty(query.getCardType())){
			jql.append("and  patient.patientId in ( select patientId from Card where cardType  = ? ) ");
			values.add(query.getCardType());
		}
		// 条码
		if (!StringUtils.isEmpty(query.getBarcode())) {
			jql.append("and barcode = ? )");
			values.add(query.getBarcode());
		}
		//开始日期 -结束日期
		/*if (query.getStartDate()!=null && query.getEndDate()!=null) {
			jql.append("and createTime between ? and ? ");
			values.add(query.getStartDate());
			values.add(query.getEndDate());
		} else {
			jql.append("and createTime between ? and ? ");
			values.add(HcpDateUtils.getBeginOfDay());
			values.add(HcpDateUtils.getEndOfDay());
		}*/
		
		
		
		jql.append("order by createTime ");
		List<PhaPatLis> patlis= (List<PhaPatLis>) patlisManager.findByJql(jql.toString(), values.toArray());
		List<IRecordTest> irecordTests=TransFormHisModel(patlis);
		return ResultUtils.renderPageResult(irecordTests);
	}



	/**
	 * @param patlis
	 * @return
	 */
	private List<IRecordTest> TransFormHisModel(List<PhaPatLis> patlis) {
		List<IRecordTest> irecordTests=new ArrayList<IRecordTest>();
		for(int i=0;i<patlis.size();i++){
			PhaPatLis patli=patlis.get(i);
			irecordTests.add(TransFormModel(patli));
		}
		return irecordTests;
	}



	/**
	 * @param diagnoses
	 * @return
	 */
	private IRecordTest TransFormModel(PhaPatLis patli) {
		IRecordTest irecordTest = new IRecordTest();
		irecordTest.setHosNo(patli.getHosId());
		Hospital hos=hospitalManager.get(patli.getHosId());
		irecordTest.setHosName(hos!=null ? hos.getHosName():null);
		RegInfo reg=regInfoManager.get(patli.getRegId());
		irecordTest.setProNo(reg!=null ? reg.getPatient().getPatientId():null);
		irecordTest.setProName(reg!=null ? reg.getPatient().getName():null);
		irecordTest.setItemName(patli.getItemName());
		PhaLisResult result=PhaLisResultManager.findOneByProp("exambarcode", patli.getExambarcode());
		irecordTest.setOptDocName(result!=null ? result.getUsrnam():null);
		irecordTest.setAuditDocName(result!=null ? result.getApprvedby():null );
		irecordTest.setBarcode(patli.getExambarcode());
		irecordTest.setSampleNo(patli.getSpecimencode());
		irecordTest.setSample(patli.getSpecimenname());
		irecordTest.setCollectTime(patli.getSpecimendate());
		irecordTest.setReceiveTime(patli.getSenddate());
		irecordTest.setReportTime(patli.getCreateTime());
		irecordTest.setComment(patli.getMemo());
		irecordTest.setPkgName("化验");
		irecordTest.setStatus(patli.getStateFlag());
		
		return irecordTest;
	}
	
	@RequestMapping(value = "/listDetail", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDetail(@RequestParam(value = "data", defaultValue = "") String data) {
		
		 ITestDetail query = JSONUtils.deserialize(data, ITestDetail.class);
		StringBuilder jql = new StringBuilder("from PhaLisResult  where 1=1 ");
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
			jql.append("and  patient.medicalCardNo = ? ");
			values.add(query.getCardNo());
		}
		//卡类型
		if(!StringUtils.isEmpty(query.getCardType())){
			jql.append("and  patient.patientId in ( select patientId from Card where cardType  = ? ) ");
			values.add(query.getCardType());
		}
		// 条码
		if (!StringUtils.isEmpty(query.getTestId())) {
			jql.append("and exambarcode = ? ");
			values.add(query.getTestId());
		}
		
		}
		List<PhaLisResult> results=(List<PhaLisResult>) patlisManager.findByJql(jql.toString(), values.toArray());
		List<ITestDetail> itestDetails=TransFormHisModels(results);
		return ResultUtils.renderPageResult(itestDetails);
	}



	/**
	 * @param results
	 * @return
	 */
	private List<ITestDetail> TransFormHisModels(List<PhaLisResult> results) {
		List<ITestDetail> itestDetails=new ArrayList<ITestDetail>();
		for(int i=0;i<results.size();i++){
			PhaLisResult result=results.get(i);
			itestDetails.add(ConventModel(result));
		}
		return itestDetails;
	}



	/**
	 * @param result
	 * @return
	 */
	private ITestDetail ConventModel(PhaLisResult result) {
		ITestDetail itestDetail=new ITestDetail();
		itestDetail.setSubjectCode(result.getItemNo());
		itestDetail.setSubject(result.getAnalyte());
		itestDetail.setResult(result.getValue());
		itestDetail.setUnit(result.getUnit());
		itestDetail.setReference(result.getDisplowhigh());
		itestDetail.setFlag(result.getFlag());
		return itestDetail;
	}
	
}
