package com.lenovohit.elh.treat.web.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
//import java.util.Map;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.bdrp.Constants;
import com.lenovohit.bdrp.org.model.Org;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
//import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.el.ElConstants;
import com.lenovohit.el.base.model.User;
import com.lenovohit.elh.base.model.Department;
import com.lenovohit.elh.base.model.Doctor;
import com.lenovohit.elh.base.model.Hospital;
import com.lenovohit.elh.base.model.Patient;
import com.lenovohit.elh.treat.model.CheckDetail;
import com.lenovohit.elh.treat.model.Diagnosis;
import com.lenovohit.elh.treat.model.DrugDetail;
import com.lenovohit.elh.treat.model.DrugOrder;
import com.lenovohit.elh.treat.model.MedicalCheck;
import com.lenovohit.elh.treat.model.Register;
import com.lenovohit.elh.treat.model.TreatDetail;
import com.lenovohit.elh.treat.model.Treatment;
import com.lenovohit.elh.treat.vom.DiagnosisVom;
import com.lenovohit.elh.treat.vom.DrugOrderVom;
import com.lenovohit.elh.treat.vom.MedicalCheckVom;
import com.lenovohit.elh.treat.vom.RegisterVom;

@RestController
@RequestMapping("/elh/treat")
public class TreatmentRestController extends BaseRestController {
	
	@Autowired
	private GenericManager<TreatDetail, String> treatDetailManager;

	@Autowired
	private GenericManager<CheckDetail, String> checkDetailManager;

	@Autowired
	private GenericManager<DrugDetail, String> drugDetailManager;

	@Autowired
	private GenericManager<Register, String> registerManager;
	
	@Autowired
	private GenericManager<Diagnosis, String> diagnosisManager;
	
	@Autowired
	private GenericManager<MedicalCheck, String> medicalCheckManager;

	@Autowired
	private GenericManager<DrugOrder, String> drugOrderManager;
	
	@Autowired
	private GenericManager<Treatment, String> treatmentManager;
	
	@Autowired
	private GenericManager<Patient, String> patientManager;
	
	
	
	/******************************************************机构端方法*************************************************************************/	
	/**
	 * 查询在此医院看过病的所有就诊人
	 * 
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/patient/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPatientList(@PathVariable(value = "start") int start, @PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		
		Patient patient = JSONUtils.deserialize(data, Patient.class);
		StringBuilder sb = new StringBuilder("select distinct t from Patient t,Treatment treat where treat.patientId = t.id and treat.hospitalId = ? ");
		List<String> cdList = new ArrayList<String>();
		cdList.add(orgId);
		if(null != patient){
			if (!StringUtils.isEmpty(patient.getStatus())) {
				sb.append(" and t.status=? ");
				cdList.add(patient.getStatus());
			}
			if (!StringUtils.isEmpty(patient.getName())) {
				sb.append(" and t.name like ? ");
				cdList.add("%" + patient.getName() + "%");
			}
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setValues(cdList.toArray());
		page.setQuery(sb.toString());
		this.patientManager.findPage(page);
		return ResultUtils.renderSuccessResult(page);
	}
	/**
	 * 查询挂号记录列表 ELH_TREAT_006
	 * 
	 * @param start
	 * @param pageSize
	 * @param userId
	 * @return
	 */
	@RequestMapping(value = "/register/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forRegisterList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		RegisterVom params = JSONUtils.deserialize(data, RegisterVom.class);
		if(null==params)params= new RegisterVom();
		Page page = new Page();
		try {
			page.setStart(start);
			page.setPageSize(pageSize);
			StringBuilder jql = new StringBuilder();
			jql.append("select rt,td from Register rt,TreatDetail td where rt.id=td.id and td.hospitalId = ? ");
			List<String> values = new ArrayList<String>();
			values.add(orgId);
			
			if (!(StringUtils.isEmpty(params.getDepartmentId()))) {
				jql.append(" and td.deptId = ? ");
				values.add(params.getDepartmentId());
			}
			if (!(StringUtils.isEmpty(params.getDoctorId()))) {
				jql.append(" and rt.doctorId = ? ");
				values.add(params.getDepartmentId());
			}
			if (!(StringUtils.isEmpty(params.getNo()))) {
				jql.append(" and rt.no = ? ");//号码
				values.add(params.getNo());
			}
			if (!(StringUtils.isEmpty(params.getAppointNo()))) {
				jql.append(" and rt.appointNo = ? ");//预约码 预约挂号换号时用
				values.add(params.getAppointNo());
			}
			if (!(StringUtils.isEmpty(params.getType()))) {
				jql.append(" and rt.type = ? ");//挂号类别 
				values.add(params.getType());
			}
			if(!(StringUtils.isEmpty(params.getPatientName()))){
				jql.append(" and td.patientName = ? ");
				values.add("%"+params.getPatientName() +"%");
			}
			page.setQuery(jql.toString());
			page.setValues(values.toArray());
			this.treatDetailManager.findPage(page);

			List<?> register = (List<?>) page.getResult();
			List<RegisterVom> result = new ArrayList<RegisterVom>();
			if(null != register){
				for (Object both : register) {
					Object[] b = (Object[]) both;
					Register rt = (Register) b[0];
					TreatDetail td = (TreatDetail) b[1];
					RegisterVom vom = new RegisterVom(rt, td);
					result.add(vom);
				}
			}
			page.setResult(result);
			return ResultUtils.renderSuccessResult(page);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("");
		}

	}

	/**
	 * 查询挂号记录详情 ELH_TREAT_007
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/register/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forRegisterInfo(@PathVariable(value = "id") String id) {
		Register rg = registerManager.get(id);
		TreatDetail td = treatDetailManager.get(id);
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		if(!loginOrg.getId().equals(td.getHospitalId())){
			return ResultUtils.renderFailureResult("无权查看其它医院的挂号记录");
		}
		RegisterVom vom = new RegisterVom(rg, td);
		return ResultUtils.renderSuccessResult(vom);
	}

	/**
	 * 查询看诊记录 ELH_TREAT_011
	 * 
	 * @param start
	 * @param pageSize
	 * @param id
	 * @return
	 */
	
	@RequestMapping(value = "/diagnosis/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDiagnosisList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		DiagnosisVom params = JSONUtils.deserialize(data, DiagnosisVom.class);
		if(null==params)params= new DiagnosisVom();
		Page page = new Page();
		try {
			page.setStart(start);
			page.setPageSize(pageSize);
			StringBuilder jql = new StringBuilder();
			jql.append("select rt,td from Diagnosis rt,TreatDetail td where rt.id=td.id and td.hospitalId = ? ");
			List<String> values = new ArrayList<String>();
			values.add(orgId);
			
			if (!(StringUtils.isEmpty(params.getDeptId()))) {
				jql.append(" and td.deptId = ? ");
				values.add(params.getDeptId());
			}
			if (!(StringUtils.isEmpty(params.getDoctorId()))) {
				jql.append(" and rt.doctorId = ? ");
				values.add(params.getDoctorId());
			}
			if(!(StringUtils.isEmpty(params.getPatientName()))){
				jql.append(" and td.patientName = ? ");
				values.add("%"+params.getPatientName() +"%");
			}
			page.setQuery(jql.toString());
			page.setValues(values.toArray());
			this.treatDetailManager.findPage(page);

			List<?> diagnosiss = (List<?>) page.getResult();
			List<DiagnosisVom> result = new ArrayList<DiagnosisVom>();
			if(null != diagnosiss){
				for (Object both : diagnosiss) {
					Object[] b = (Object[]) both;
					Diagnosis rt = (Diagnosis) b[0];
					TreatDetail td = (TreatDetail) b[1];
					DiagnosisVom vom = new DiagnosisVom(rt, td);
					result.add(vom);
				}
			}
			
			page.setResult(result);
			return ResultUtils.renderSuccessResult(page);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("");
		}

	}
	
	/**
	 * 查询挂号记录详情 ELH_TREAT_007
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/diagnosis/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDiagnosisInfo(@PathVariable(value = "id") String id) {
		Diagnosis di = diagnosisManager.get(id);
		TreatDetail td = treatDetailManager.get(id);
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		if(!loginOrg.getId().equals(td.getHospitalId())){
			return ResultUtils.renderFailureResult("无权查看其它医院的挂号记录");
		}
		DiagnosisVom vom = new DiagnosisVom(di, td);
		return ResultUtils.renderSuccessResult(vom);
	}

	/**
	 * 查询检查单列表 ELH_TREAT_013
	 * 
	 * @param start
	 * @param pageSize
	 * @param patient
	 * @param userId
	 * @return
	 */

	@RequestMapping(value = "/medicalcheck/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMedicalCheckList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		MedicalCheckVom params = JSONUtils.deserialize(data, MedicalCheckVom.class);
		if(null==params)params= new MedicalCheckVom();
		Page page = new Page();
		try {
			page.setStart(start);
			page.setPageSize(pageSize);
			StringBuilder jql = new StringBuilder();
			jql.append("select mc,td from MedicalCheck mc,TreatDetail td where mc.id=td.id and td.hospitalId = ? ");
			List<String> values = new ArrayList<String>();
			values.add(orgId);

			if (!(StringUtils.isEmpty(params.getDeptId()))) {
				jql.append(" and td.deptId = ? ");
				values.add(params.getDeptId());
			}
			if(!(StringUtils.isEmpty(params.getPatientName()))){
				jql.append(" and td.patientName = ? ");
				values.add("%"+params.getPatientName() +"%");
			}

			page.setQuery(jql.toString());
			page.setValues(values.toArray());
			this.treatDetailManager.findPage(page);

			List<?> medicalcheck = (List<?>) page.getResult();
			List<MedicalCheckVom> result = new ArrayList<MedicalCheckVom> ();
			if(null != medicalcheck){
				for (Object both : medicalcheck) {
					Object[] b = (Object[]) both;

					MedicalCheck mc = (MedicalCheck) b[0];
					TreatDetail td = (TreatDetail) b[1];

					System.out.println(mc.getId());
					System.out.println(td.getId());

					MedicalCheckVom vom = new MedicalCheckVom(mc, td);
					result.add(vom);
				}
			}
			page.setResult(result);
			return ResultUtils.renderSuccessResult(page);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("");
		}

	}

	/**
	 * 查询检查单详情 ELH_TREAT_014
	 * 
	 * @param start
	 * @param pageSize
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/medicalcheck/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMedicalCheckInfo(@PathVariable(value = "id") String id) {
		
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		TreatDetail td = treatDetailManager.get(id);
		if(!orgId.equals(td.getHospitalId())){
			return ResultUtils.renderFailureResult("无权查看其它医院的挂号记录");
		}
		
		MedicalCheck mc = medicalCheckManager.get(id);
		List<CheckDetail> details = checkDetailManager.find(
				" from CheckDetail cd where cd.checkOrder = ?", id);
		MedicalCheckVom vom = new MedicalCheckVom(mc, td);
		vom.setDetails(details);
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("mc", mc);
		map.put("details", details);
		return ResultUtils.renderSuccessResult(map);
	}

	/**
	 * 查询药单列表
	 * 
	 * @param start
	 * @param pageSize
	 * @param patient
	 * @param userId
	 * @return
	 */

	@RequestMapping(value = "/drugorder/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDrugOrderList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		DrugOrderVom params = JSONUtils.deserialize(data, DrugOrderVom.class);
		if(null ==params )params = new DrugOrderVom();
		Page page = new Page();
		try {
			page.setStart(start);
			page.setPageSize(pageSize);
			StringBuilder jql = new StringBuilder();
			jql.append("select dro,td from DrugOrder dro,TreatDetail td where dro.id=td.id and td.hospitalId = ? ");
			List<String> values = new ArrayList<String>();
			values.add(orgId);

			if (!(StringUtils.isEmpty(params.getDeptId()))) {
				jql.append(" and td.deptId = ? ");
				values.add(params.getDeptId());
			}
			if(!(StringUtils.isEmpty(params.getPatientName()))){
				jql.append(" and td.patientName = ? ");
				values.add("%"+params.getPatientName() +"%");
			}

			page.setQuery(jql.toString());
			page.setValues(values.toArray());

			this.treatDetailManager.findPage(page);

			List<?> drugOrder = (List<?>) page.getResult();
			List<DrugOrderVom> result = new ArrayList<DrugOrderVom>();
			if(null != drugOrder){
				for (Object both : drugOrder) {
					Object[] b = (Object[]) both;

					DrugOrder dro = (DrugOrder) b[0];
					TreatDetail td = (TreatDetail) b[1];

					System.out.println(dro.getId());
					System.out.println(td.getId());

					DrugOrderVom vom = new DrugOrderVom(dro, td);
					result.add(vom);
				}
			}
			page.setResult(result);
			return ResultUtils.renderSuccessResult(page);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult();
		}
	}

	/**
	 * 查询药单 ELH_TREAT_020
	 * @param id
	 * @return
	 */
	 

	@RequestMapping(value = "/drugorder/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDrugOrderInfo(@PathVariable(value = "id") String id) {
		
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		TreatDetail td = treatDetailManager.get(id);
		if(!loginOrg.getId().equals(td.getHospitalId())){
			return ResultUtils.renderFailureResult("无权查看其它医院的挂号记录");
		}
		
		DrugOrder dro = drugOrderManager.get(id);
		List<DrugDetail> details = drugDetailManager.find(
				" from DrugDetail cd where cd.drugOrder = ?", id);
		DrugOrderVom vom = new DrugOrderVom(dro,td);
		vom.setDetails(details);
		
		return ResultUtils.renderSuccessResult(vom);
	}

	/**
	 * 查看就诊记录列表 ELH_TREAT_024
	 * 
	 * @param start
	 * @param pageSize
	 * @param status
	 * @param patient
	 * @param userId
	 * @return
	 */
	@RequestMapping(value = "/treatment/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forListTreatment(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		Treatment params = JSONUtils.deserialize(data, Treatment.class);
		if(null ==params )params = new Treatment();
		Page page = new Page();
		try {
			page.setStart(start);
			page.setPageSize(pageSize);
			StringBuilder jql = new StringBuilder();
			jql.append("select tm from Treatment tm where tm.hospitalId = ? ");
			List<String> values = new ArrayList<String>();
			values.add(orgId);
			
			if (!(StringUtils.isEmpty(params.getStatus()))) {
				jql.append(" and tm.status = ? ");
				values.add(params.getStatus());
			}

			if (!(StringUtils.isEmpty(params.getStatus()))) {
				jql.append(" and tm.patientId = ? ");
				values.add(params.getStatus());
			}
			if (!(StringUtils.isEmpty(params.getCardNo()))) {
				jql.append(" and tm.cardNo = ? ");
				values.add(params.getCardNo());
			}
			if (!(StringUtils.isEmpty(params.getCardType()))) {
				jql.append(" and tm.cardType = ? ");
				values.add(params.getStatus());
			}
			if(!(StringUtils.isEmpty(params.getPatientName()))){
				jql.append(" and td.patientName = ? ");
				values.add("%"+params.getPatientName() +"%");
			}
			page.setQuery(jql.toString());
			page.setValues(values.toArray());
			this.treatmentManager.findPage(page);
			return ResultUtils.renderSuccessResult(page);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult();
		}
	}
	/**
	 * 查看就诊记录 ELH_TREAT_025
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/treatment/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTreatmentInfo(@PathVariable(value = "id") String id) {
		

		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构");
		}
		String orgId = loginOrg.getId();
		Treatment treatment = this.treatmentManager.get(id);
		if(!orgId.equals(treatment.getHospitalId())){
			return ResultUtils.renderFailureResult("无权查看其它医院的就诊记录");
		}
		
		Map<String, Object> map = new HashMap<String, Object>();
		List<?> drugOrder = (List<?>) this.drugOrderManager.findByJql(" select dro,td from DrugOrder dro, TreatDetail td where td.treatment = ? and dro.id = td.id ", id);
		
		List<DrugOrderVom> drugList = new ArrayList<DrugOrderVom>();
		for (Object both : drugOrder) {
			Object[] b = (Object[]) both;
			DrugOrder dro = (DrugOrder) b[0];
			TreatDetail td = (TreatDetail) b[1];
			List<DrugDetail> details = drugDetailManager.find(
					" from DrugDetail cd where cd.drugOrder = ?", dro.getId());
			dro.setDetails(details);
			DrugOrderVom vom = new DrugOrderVom(dro, td);
			drugList.add(vom);
		}

		List<?> medicalCheck = (List<?>) this.medicalCheckManager.findByJql(" select mc,td from MedicalCheck mc, TreatDetail td where td.treatment = ? and mc.id = td.id ", id);
		List<MedicalCheckVom> checkList = new ArrayList<MedicalCheckVom>();
		for (Object both : medicalCheck) {
			Object[] b = (Object[]) both;
			MedicalCheck mc = (MedicalCheck) b[0];
			TreatDetail td = (TreatDetail) b[1];
			MedicalCheckVom checkVom = new MedicalCheckVom(mc, td);
			checkList.add(checkVom);
		}
		
		map.put("tretment",treatment);
		map.put("drugOrder",drugList);
		map.put("medicalCheck",checkList);
		return ResultUtils.renderSuccessResult(map);
	}
	
	/******************************************************机构端方法end*************************************************************************/	
	
	/******************************************************app端方法*************************************************************************/
	
	/**
	 * 查询检查单列表 ELH_TREAT_013
	 * 
	 * @param start
	 * @param pageSize
	 * @param patient
	 * @param userId
	 * @return
	 */

	@RequestMapping(value = "/my/medicalcheck/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyMedicalCheckList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		if (null == _user) {
			return ResultUtils.renderFailureResult("请先登录系统");
		}
		String userId = _user.getId();
		MedicalCheckVom params = JSONUtils.deserialize(data, MedicalCheckVom.class);
		if(null ==  params)params = new MedicalCheckVom();
		Page page = new Page();
		try {
			page.setStart(start);
			page.setPageSize(pageSize);
			StringBuilder jql = new StringBuilder();
			jql.append("select mc,td,hospital from MedicalCheck mc,TreatDetail td,Treatment tm,Hospital hospital ")
				.append("where mc.id=td.id and tm.id = td.treatment and tm.hospitalId = hospital.id and tm.appUser = ? ");
			List<String> values = new ArrayList<String>();
			values.add(userId);

			if (!(StringUtils.isEmpty(params.getDeptId()))) {
				jql.append(" and td.deptId = ? ");
				values.add(params.getDeptId());
			}
			if(!(StringUtils.isEmpty(params.getPatientId()))){
				jql.append(" and td.patientId = ? ");
				values.add(params.getPatientId());
			}
			if(!(StringUtils.isEmpty(params.getPatientName()))){
				jql.append(" and td.patientName = ? ");
				values.add("%"+params.getPatientName() +"%");
			}

			page.setQuery(jql.toString());
			page.setValues(values.toArray());
			this.treatDetailManager.findPage(page);

			List<?> medicalcheck = (List<?>) page.getResult();
			List<MedicalCheckVom> result = new ArrayList<MedicalCheckVom> ();
			if(null != medicalcheck){
				for (Object both : medicalcheck) {
					Object[] b = (Object[]) both;

					MedicalCheck mc = (MedicalCheck) b[0];
					TreatDetail td = (TreatDetail) b[1];
					Hospital hospital = (Hospital) b[2];

					MedicalCheckVom vom = new MedicalCheckVom(mc, td);
					vom.setHospital(hospital);
					result.add(vom);
				}
			}
			page.setResult(result);
			return ResultUtils.renderSuccessResult(page);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("查询出现异常"+e.getMessage());
		}

	}

	/**
	 * 查询检查单详情 ELH_TREAT_014
	 * 
	 * @param start
	 * @param pageSize
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/my/medicalcheck/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyMedicalCheckInfo(@PathVariable(value = "id") String id) {
		User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		if (null == _user) {
			return ResultUtils.renderFailureResult("请先登录系统");
		}
		String userId = _user.getId();
		
		TreatDetail td = treatDetailManager.get(id);
		Treatment tm = treatmentManager.get(td.getTreatment());
		
		if(!userId.equals(tm.getAppUser())){
			return ResultUtils.renderFailureResult("无权查看其它APP用户的检查单");
		}
		
		MedicalCheck mc = medicalCheckManager.get(id);
		List<CheckDetail> details = checkDetailManager.find(
				" from CheckDetail cd where cd.checkOrder = ?", id);
		MedicalCheckVom vom = new MedicalCheckVom(mc, td);
		vom.setDetails(details);
		return ResultUtils.renderSuccessResult(vom);
	}
	/**
	 * 查询药单列表
	 * 
	 * @param start
	 * @param pageSize
	 * @param patient
	 * @param userId
	 * @return
	 */

	@RequestMapping(value = "/my/drugorder/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyDrugOrderList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		
		User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		if (null == _user) {
			return ResultUtils.renderFailureResult("请先登录系统");
		}
		String userId = _user.getId();
		DrugOrderVom params = JSONUtils.deserialize(data, DrugOrderVom.class);
		if(null == params ) params = new DrugOrderVom();
		Page page = new Page();
		try {
			page.setStart(start);
			page.setPageSize(pageSize);
			StringBuilder jql = new StringBuilder();
			jql.append("select dro,td from DrugOrder dro,TreatDetail td,Treatment tm where dro.id=td.id and tm.id = td.treatment and tm.appUser = ? ");
			List<String> values = new ArrayList<String>();
			values.add(userId);

			if (!(StringUtils.isEmpty(params.getDeptId()))) {
				jql.append(" and td.deptId = ? ");
				values.add(params.getDeptId());
			}
			if(!(StringUtils.isEmpty(params.getPatientName()))){
				jql.append(" and td.patientName = ? ");
				values.add("%"+params.getPatientName() +"%");
			}

			page.setQuery(jql.toString());
			page.setValues(values.toArray());

			this.treatDetailManager.findPage(page);

			List<?> drugOrder = (List<?>) page.getResult();
			List<DrugOrderVom> result = new ArrayList<DrugOrderVom>();
			if(null != drugOrder){
				for (Object both : drugOrder) {
					Object[] b = (Object[]) both;

					DrugOrder dro = (DrugOrder) b[0];
					TreatDetail td = (TreatDetail) b[1];

					System.out.println(dro.getId());
					System.out.println(td.getId());

					DrugOrderVom vom = new DrugOrderVom(dro, td);
					result.add(vom);
				}
			}
			page.setResult(result);
			return ResultUtils.renderSuccessResult(page);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult();
		}
	}
	
	@RequestMapping(value = "/my/drugorder/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyDrugOrderInfo(@PathVariable(value = "id") String id) {
		
		User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		if (null == _user) {
			return ResultUtils.renderFailureResult("请先登录系统");
		}
		String userId = _user.getId();
		
		TreatDetail td = treatDetailManager.get(id);
		Treatment tm = treatmentManager.get(td.getTreatment());
		
		if(!userId.equals(tm.getAppUser())){
			return ResultUtils.renderFailureResult("无权查看其它APP用户的取药单");
		}
		
		DrugOrder dro = drugOrderManager.get(id);
		List<DrugDetail> details = drugDetailManager.find(
				" from DrugDetail cd where cd.drugOrder = ?", id);
		DrugOrderVom vom = new DrugOrderVom(dro,td);
		vom.setDetails(details);
		
		return ResultUtils.renderSuccessResult(vom);
	}
	@RequestMapping(value = "/my/treatment/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyTreatmentInfo(@PathVariable(value = "id") String id) {
		
		User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
		if (null == _user) {
			return ResultUtils.renderFailureResult("请先登录系统");
		}
		String userId = _user.getId();
		
		Treatment tm = treatmentManager.get(id);
		if(!userId.equals(tm.getAppUser())){
			return ResultUtils.renderFailureResult("无权查看其它APP用户的就诊记录");
		}
		
		Map<String, Object> map = new HashMap<String, Object>();
		List<?> drugOrder = (List<?>) this.drugOrderManager.findByJql(" select dro,td from DrugOrder dro, TreatDetail td where td.treatment = ? and dro.id = td.id ", id);
		List<DrugOrderVom> drugList = new ArrayList<DrugOrderVom>();
		for (Object both : drugOrder) {
			Object[] b = (Object[]) both;
			DrugOrder dro = (DrugOrder) b[0];
			TreatDetail td = (TreatDetail) b[1];
			List<DrugDetail> details = drugDetailManager.find(
					" from DrugDetail cd where cd.drugOrder = ?", dro.getId());
			dro.setDetails(details);
			DrugOrderVom vom = new DrugOrderVom(dro, td);
			drugList.add(vom);
		}

		List<?> medicalCheck = (List<?>) this.medicalCheckManager.findByJql(" select mc,td from MedicalCheck mc, TreatDetail td where td.treatment = ? and mc.id = td.id ", id);
		List<MedicalCheckVom> checkList = new ArrayList<MedicalCheckVom>();
		for (Object both : medicalCheck) {
			Object[] b = (Object[]) both;
			MedicalCheck mc = (MedicalCheck) b[0];
			TreatDetail td = (TreatDetail) b[1];
			MedicalCheckVom checkVom = new MedicalCheckVom(mc, td);
			checkList.add(checkVom);
		}
		
		map.put("tretment",tm);
		map.put("drugOrder",drugList);
		map.put("medicalCheck",checkList);
		return ResultUtils.renderSuccessResult(map);
	}
	@RequestMapping(value = "/my/treatment/unclose/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyTreatmentListUnClosed(@RequestParam(value = "data", defaultValue = "") String data) {
		Map<String,String> param;
		if(StringUtils.isEmpty(data)){
			param = new HashMap<String,String>();
		}else{
			param = JSONUtils.parseObject(data,new TypeReference<Map<String,String>>(){});
		}
		param.put("status", "0");
		return forMyTreatmentList(param);
	}
	
	@RequestMapping(value = "/my/treatment/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyTreatmentList(@RequestParam(value = "data", defaultValue = "") String data) {
		Map<String,String> param;
		if(StringUtils.isEmpty(data)){
			param = new HashMap<String,String>();
		}else{
			param = JSONUtils.parseObject(data,new TypeReference<Map<String,String>>(){});
		}
		return forMyTreatmentList(param);
	}
	
	private Result forMyTreatmentList(Map<String,String> params) {
		Page page = new Page();
		try {
			StringBuilder sb = new StringBuilder();
			sb.append(
					"SELECT tm.ID AS ID_0, tm.APP_USER AS APP_USER_1, tm.CARD_NO AS CARD_NO_2,")
					.append("tm.CARD_TYPE AS CARD_TYPE_3, tm.CARD_TYPE_NAME AS CARD_TYPE_NAME_4, tm.CREATE_TIME AS CREATE_TIME_5, ")
					.append("tm.DEPARTMENT AS DEPARTMENT_6, tm.DEPARTMENT_NAME AS DEPARTMENT_NAME_7, tm.DOCTOR AS DOCTOR_8,")
					.append("tm.DOCTOR_NAME AS DOCTOR_NAME_9, tm.HOSPITAL AS HOSPITAL_10, tm.HOSPITAL_NAME AS HOSPITAL_NAME_11,")
					.append("tm.ID_HLHT AS ID_HLHT_12_0, tm.MEDCIAL_RESULT AS MEDCIAL_RESULT_13, tm.NOTIFICATION AS NOTIFICATION_14,")
					.append("tm.PATIENT_HLHT AS PATIENT_HLHT_15, tm.PATIENT AS PATIENT_16, tm.PATIENT_NAME AS PATIENT_NAME_17,")
					.append("tm.START_TIME AS START_TIME_18, tm.STATUS AS STATUS_19, tm.TYPE AS TYPE_20, ")
					.append("tm.UPDATE_TIME AS UPDATE_TIME_21,tm.CARD_TYPE_NAME AS CARD_TYPE_NAME_22, ")

					.append("hosp.ADDRESS AS ADDRESS_0_1, hosp.BAD_COMMENT AS BAD_COMMENT_1, hosp.COMMENT AS COMMENT_2, ")
					.append("hosp.DESCRIPTION AS DESCRIPTION_3_0, hosp.EXPERT_BACKGROUND AS EXPERT_BACKGROUND_4, hosp.FAVS AS FAVS_5, ")
					.append("hosp.FEATURE_BACKGROUND AS FEATURE_BACKGROUND_6, hosp.GOOD_COMMENT AS GOOD_COMMENT_7, hosp.HOME_URL AS HOME_URL_8,  ")
					.append("hosp.ID_HLHT AS ID_HLHT_9, hosp.LATITUDE AS LATITUDE_10, hosp.LIKES AS LIKES_11, hosp.LONGITUDE AS LONGITUDE_12, ")
					.append("hosp.NAME AS NAME_13, hosp.SCENERY_NUM AS SCENERY_NUM_14, hosp.SCENERY_THUMB AS SCENERY_THUMB_15, ")
					.append("hosp.STARS AS STARS_16, hosp.TRANSPORT AS TRANSPORT_17, ")

					.append("doc.BIRTHDAY AS BIRTHDAY_0, doc.CERT_NUM AS CERT_NUM_1, doc.CLINIC AS CLINIC_2,")
					.append("doc.CLINIC_DESC AS CLINIC_DESC_3, doc.DEGREES AS DEGREES_4, doc.DEPARTMENT AS DEPARTMENT_5,")
					.append("doc.DEPT_NAME AS DEPT_NAME_6, doc.ENTRY_DATE AS ENTRY_DATE_7, doc.ENTRY_TIME AS ENTRY_TIME_8,")
					.append("doc.GENDER AS GENDER_9, doc.HOS_NAME AS HOS_NAME_10, doc.HOSPITAL AS HOSPITAL_11,")
					.append("doc.ID_HLHT AS ID_HLHT_12_1, doc.IS_EXPERT AS IS_EXPERT_13, doc.JOB_NUM AS JOB_NUM_14,")
					.append("doc.JOB_TITLE AS JOB_TITLE_15, doc.MAJOR AS MAJOR_16, doc.NAME AS NAME_17, ")
					.append("doc.PORTRAIT AS PORTRAIT_18, doc.SORTNO AS PORTRAIT_19, doc.SPECIALITY AS SPECIALITY_20,")

					.append("dept.ADDRESS AS ADDRESS_0_2, dept.BRIEF AS BRIEF_1, dept.CODE AS CODE_2, ")
					.append("dept.DESCRIPTION AS DESCRIPTION_3_1, dept.FLAG AS FLAG_4, dept.HOSPITAL AS HOSPITAL_5,")
					.append("dept.ID_HLHT AS ID_HLHT_6, dept.IS_SPECIAL AS IS_SPECIAL_7, dept.NAME AS NAME_8_1, ")
					.append("dept.SORTNO AS SORTNO_9, dept.TYPE AS TYPE_10, ")

					.append("patient.ADDRESS as ADDRESS_0,  patient.BIRTHDAY as BIRTHDAY_1, ")//patient.ALIAS as ALIAS_1,
					.append("patient.EMAIL as EMAIL_2, patient.GENDER as GENDER_3, patient.HEIGHT as HEIGHT_4, ")
					.append("patient.IDNO as IDNO_5, patient.MOBILE as MOBILE_6, patient.NAME as NAME_7_2, ")
					.append("patient.PHOTO as PHOTO_8,")//patient.PATIENT_ID as PATIENT_ID_9,  patient.RELATIONSHI as RELATIONSHI_9, 
					.append("patient.STATUS as STATUS_9,  patient.USER_TYPE as USER_TYPE_10, patient.WEIGHT as WEIGHT_11 ")//patient.USER_ID as USER_ID_13,

					.append("FROM ELH_TREATMENT tm left join ELH_HOSPITAL hosp  on hosp.ID=tm.HOSPITAL ")
					.append("LEFT JOIN ELH_DOCTOR doc on doc.ID=tm.DOCTOR ")
					.append("LEFT JOIN ELH_DEPARTMENT dept on dept.ID=tm.DEPARTMENT ")
					.append("LEFT JOIN ELH_PATIENT patient on patient.ID=tm.PATIENT where 1=1 ");
			
			List<String> values = new ArrayList<String>();
			Object status = params.get("status");
			if (!(null==status || "".equals(status))) {
				sb.append(" and tm.STATUS = ? ");
				values.add(status.toString());
			}
			
			Object patient = params.get("patient");
			if (!(null==patient || "".equals(patient))) {
				sb.append(" and tm.PATIENT = ? ");
				values.add(patient.toString());
			}
			
			User _user = (User) this.getSession().getAttribute(ElConstants.APP_USER_KEY);
			if (null == _user) {
				return ResultUtils.renderFailureResult("请先登录系统");
			}
			sb.append(" and tm.APP_USER = ? ");
			values.add(_user.getId());
			page.setQuery(sb.toString());
			page.setValues(values.toArray());
			List<?> result = this.treatmentManager.findBySql(sb.toString(), values.toArray());
			List<Treatment> treatments = new ArrayList<Treatment>();
			for(Object row : result){
				Object[] vlaues = (Object[])row;
				Treatment tm =  this.parseTreatment(vlaues, 0);//23
				Hospital hosp = this.parseHospital(vlaues, 23);//18
				hosp.setId(tm.getHospitalId());
				Doctor doctor = this.parseDoctor(vlaues, 23+18);//21
				doctor.setId(tm.getDoctorId());
				Department department = this.parseDepartment(vlaues, 23+18+21);//11
				department.setId(tm.getDepartmentId());
				Patient userPatient = this.parsePatient(vlaues, 23+18+21+11);
				userPatient.setId(tm.getPatientId());
				tm.setHospital(hosp);
				tm.setDoctor(doctor);
				tm.setDepartment(department);
				tm.setPatient(userPatient);
				treatments.add(tm);
			}
			page.setResult(treatments);
			page.setPageSize((null==treatments)?0:treatments.size());
			page.setTotal(treatments.size());
			return ResultUtils.renderSuccessResult(page);
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult();
		}
	}
	private String getString(Object value){
		return value==null?null:value.toString();
	}
	private int getInt(Object value){
		return value==null?0:Integer.parseInt(value.toString());
	}
	private double getDouble(Object value){
		return value==null?0:Double.parseDouble(value.toString());
	}
	private Treatment parseTreatment(Object[] values,int start){
		Treatment tm = new Treatment();
		tm.setId(getString(values[start+0]));
		tm.setAppUser(getString(values[start+1]));
		tm.setCardNo(getString(values[start+2]));
		tm.setCardType(getString(values[start+3]));
		tm.setCardTypeName(getString(values[start+4]));
		tm.setCreateTime(getString(values[start+5]));
		tm.setDepartmentId(getString(values[start+6]));
		tm.setDepartmentName(getString(values[start+7]));
		tm.setDoctorId(getString(values[start+8]));
		tm.setDoctorName(getString(values[start+9]));
		tm.setHospitalId(getString(values[start+10]));
		tm.setHospitalName(getString(values[start+11]));
		tm.setIdHlht(getString(values[start+12]));
		tm.setMedcialResult(getString(values[start+13]));
		tm.setNotification(getString(values[start+14]));
		tm.setPatientHlht(getString(values[start+15]));
		tm.setPatientId(getString(values[start+16]));
		tm.setPatientName(getString(values[start+17]));
		tm.setStartTime(getString(values[start+18]));
		tm.setStatus(getString(values[start+19]));
		tm.setType(getString(values[start+20]));
		tm.setUpdateTime(getString(values[start+21]));
		tm.setCardTypeName(getString(values[start+22]));
		return tm;
	}
	private Doctor parseDoctor(Object[] values,int start){
		Doctor doctor = new Doctor();
		//doctor.setId(getString(values[start+0]));
		doctor.setBirthday(getString(values[start+0]));
		doctor.setCertNum(getString(values[start+1]));
		doctor.setClinic(getString(values[start+2]));
		doctor.setClinicDesc(getString(values[start+3]));
		doctor.setDegrees(getString(values[start+4]));
		doctor.setDepartmentId(getString(values[start+5]));
		doctor.setDeptName(getString(values[start+6]));
		doctor.setEntryDate(getString(values[start+7]));
		//doctor.setEntryTime(getString(values[start+8]));
		doctor.setGender(getString(values[start+9]));
		doctor.setHosName(getString(values[start+10]));
		doctor.setHospitalId(getString(values[start+11]));
		doctor.setIdHlht(getString(values[start+12]));
		doctor.setIsExpert(getString(values[start+13]));
		doctor.setJobNum(getString(values[start+14]));
		doctor.setJobTitle(getString(values[start+15]));
		doctor.setMajor(getString(values[start+16]));
		doctor.setName(getString(values[start+17]));
		doctor.setPortrait(getString(values[start+18]));
		doctor.setSortno(getInt(values[start+19]));
		doctor.setSpeciality(getString(values[start+20]));
		return doctor;
	}
	private Hospital parseHospital(Object[] values,int start){
		Hospital hosp = new Hospital();
		hosp.setAddress(getString(values[start+0]));
		hosp.setBadComment(getInt(values[start+1]));
		hosp.setComment(getString(values[start+2]));
		hosp.setDescription(getString(values[start+3]));
		hosp.setExpertBackground(getString(values[start+4]));
		hosp.setFavs(getInt(values[start+5]));
		hosp.setFeatureBackground(getString(values[start+6]));
		hosp.setGoodComment(getInt(values[start+7]));
		hosp.setHomeUrl(getString(values[start+8]));
		hosp.setIdHlht(getString(values[start+9]));
		hosp.setLatitude(getInt(values[start+10]));
		hosp.setLikes(getInt(values[start+11]));
		hosp.setLongitude(getInt(values[start+12]));
		hosp.setName(getString(values[start+13]));
		hosp.setSceneryNum(getInt(values[start+14]));
		hosp.setSceneryThumb(getString(values[start+15]));
		hosp.setStars(getString(values[start+16]));
		hosp.setTransport(getString(values[start+17]));	
		return hosp;
	}
	private Department parseDepartment(Object[] values,int start){
		Department dept = new Department();
		dept.setAddress(getString(values[start+0]));
		dept.setBrief(getString(values[start+1]));
		dept.setCode(getString(values[start+2]));
		dept.setDescription(getString(values[start+3]));
		dept.setFlag(getString(values[start+4]));
		dept.setHospitalId(getString(values[start+5]));
		dept.setIdHlht(getString(values[start+6]));
		dept.setIsSpecial("1".equals(getString(values[start+7])));
		dept.setName(getString(values[start+8]));
		dept.setSortno(getInt(values[start+9]));
		dept.setType(getString(values[start+10]));
		return dept;
	}
	
	private Patient parsePatient(Object[] values,int start){
		Patient patient = new Patient();
		patient.setAddress(getString(values[start+0]));
		//patient.setAlias(getString(values[start+1]));
		patient.setBirthday(getString(values[start+1]));
		patient.setEmail(getString(values[start+2]));
		patient.setGender(getString(values[start+3]));
		patient.setHeight(getDouble(values[start+4]));
		patient.setIdno(getString(values[start+5]));
		patient.setMobile(getString(values[start+6]));
		patient.setName(getString(values[start+7]));
		//patient.setPatientId(getString(values[start+9]));
		patient.setPhoto(getString(values[start+8]));
		//patient.setRelationshi(getString(values[start+11]));
		patient.setStatus(getString(values[start+9]));
		//patient.setUserId(getString(values[start+13]));
		patient.setUserType(getString(values[start+10]));
		patient.setWeight(getDouble(values[start+11]));
		return patient;
	}
	/******************************************************app端方法end*************************************************************************/	
	
	/******************************************************运营端方法*************************************************************************/	
	/******************************************************运营端方法end*************************************************************************/	
	
}