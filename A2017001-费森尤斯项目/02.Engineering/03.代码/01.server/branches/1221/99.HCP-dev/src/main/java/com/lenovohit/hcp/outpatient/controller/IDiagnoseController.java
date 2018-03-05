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
import com.lenovohit.hcp.odws.model.Diagnose;
import com.lenovohit.hcp.odws.model.MedicalOrder;
import com.lenovohit.hcp.outpatient.model.IDiagnose;
import com.lenovohit.hcp.outpatient.model.IRecord;
import com.lenovohit.hcp.outpatient.model.IRecordDrug;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaRecipe;
import com.lenovohit.hcp.pharmacy.model.RecipeInfo;

/**
 * 诊断查询
 */
@RestController
@RequestMapping("/hcp/app/odws/diagnose")
public class IDiagnoseController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<Diagnose, String> diagnoseManager;
	@Autowired
	private GenericManager<Department, String> departmentManager;
	@Autowired
	private GenericManager<HcpUser, String> hcpUserManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	@Autowired
	private GenericManager<RegInfo, String> regInfoManager;
	
	



	/**
	 * 根据条件查询患者医嘱
	 * @param 
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		
		IDiagnose query = JSONUtils.deserialize(data, IDiagnose.class);
		StringBuilder jql = new StringBuilder("from Diagnose ");
		List<Object> values = new ArrayList<Object>();
		//query.setActNo("2c90a80c5ffb1743015ffb8db5f6000e");
		/*jql.append("and hosId = ? ");
		values.add("004");*/

		//诊疗活动编号
		if (!StringUtils.isEmpty(query.getId())) {
			jql.append(" where regId = ? ");
			values.add(query.getId());
		} else {
			return ResultUtils.renderFailureResult("诊疗活动ID不能为空！");
		}
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
			jql.append(" patientInfo.patientId = ? ");
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
		//诊疗活动编号
		/*if (!StringUtils.isEmpty(query.getId())) {
			jql.append("and regId = ? ");
			values.add(query.getId());
		}*/
		
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
		}
		@SuppressWarnings("unchecked")
		List<Diagnose> diagnoses=(List<Diagnose>) diagnoseManager.findByJql(jql.toString(), values.toArray());
		System.err.println(jql.toString());
		System.out.println(values.toArray());
		System.err.println(diagnoses);
		List<IDiagnose> idiagnoses=TransFormHisModel(diagnoses);
		System.err.println(idiagnoses);
		return ResultUtils.renderPageResult(idiagnoses);
	}



	/**
	 * @param diagnoses
	 * @return
	 */
	private List<IDiagnose> TransFormHisModel(List<Diagnose> diagnoses) {
		List<IDiagnose> idiagnoses=new ArrayList<IDiagnose>();
		for(int i=0;i<diagnoses.size();i++){
			Diagnose diagnose=diagnoses.get(i);
			idiagnoses.add(TransFormModel(diagnose));
		}
		return idiagnoses;
	}



	/**
	 * @param diagnoses
	 * @return
	 */
	private IDiagnose TransFormModel(Diagnose diagnose) {
		/*StringBuilder jql = new StringBuilder("select diagnose.*,reginfo.reg_id,hospital.hos_name,dept.dept_id,dept.dept_name from OW_DIAGNOSE   diagnose   "
				+ "inner join  REG_INFO reginfo  on reginfo.id = diagnose.reg_id "
				+ " inner join  b_deptinfo  dept on dept.id = diagnose.disease_dept "
				+ "inner join b_hosinfo hospital on hospital.id = diagnose.hos_id "
				+ "  AND diagnose.id = ?  ");*/
		IDiagnose idiagnose = new IDiagnose();
		RegInfo reginfo=regInfoManager.get(diagnose.getRegId());
		idiagnose.setActNo(reginfo!=null? reginfo.getRegId():null);
		Department dept=departmentManager.get(diagnose.getDiseaseDept().getId());
		idiagnose.setDepNo(dept.getDeptId());
		idiagnose.setDepName(dept.getDeptName());
		HcpUser doc = hcpUserManager.get(diagnose.getDiseaseDoc().getId());
		idiagnose.setDocNo(doc.getUserId());
		idiagnose.setDocName(doc.getName());
		idiagnose.setDiseaseNo(diagnose.getDiseaseNo());
		idiagnose.setDiseaseType(diagnose.getDiseaseType());
		idiagnose.setDiseaseName(diagnose.getDiseaseName());
		idiagnose.setDiseaseTime(diagnose.getDiseaseTime());
		idiagnose.setIsCurrent(diagnose.getIscurrent());
		idiagnose.setStatus(diagnose.getStopFlag());
		idiagnose.setHosNo(diagnose.getHosId());
		Hospital hospital=hospitalManager.get(diagnose.getHosId());
		idiagnose.setHosName(hospital!=null ? hospital.getHosName():null);
		return idiagnose;
	}
	
	
}
