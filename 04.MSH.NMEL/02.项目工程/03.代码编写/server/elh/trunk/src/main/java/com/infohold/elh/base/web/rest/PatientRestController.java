package com.infohold.elh.base.web.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextAware;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.infohold.bdrp.Constants;
import com.infohold.bdrp.org.model.Person;
import com.infohold.core.dao.Page;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.JSONUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.elh.base.model.MedicalCard;
import com.infohold.elh.base.model.Patient;
import com.infohold.elh.base.model.UserPatient;


/**
 * 就诊人管理
 * 
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/elh/patient")
public class PatientRestController extends BaseRestController implements ApplicationContextAware {
	@Autowired
	private GenericManager<Patient, String> patientManager;
	@Autowired
	private GenericManager<UserPatient, String> userPatientManager;
	@Autowired
	private GenericManager<MedicalCard, String> medicalCardManager;
	@Autowired
	private GenericManager<Person, String> personManager;

	/**
	 *	保存就诊人信息
	 * 	就诊人在添加常用就诊人时
	 * @param data
	 * @return
	 */
	@Deprecated
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		Patient patient = JSONUtils.deserialize(data, Patient.class);
		patient = this.patientManager.save(patient);
		return ResultUtils.renderSuccessResult(patient);
	}

	/**
	 * ELH_BASE_003 查询就诊人信息
	 * 运营端可能使用
	 * @param id
	 * @return
	 */
	@Deprecated
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		Patient patient  = this.patientManager.get(id);
		//String sql = ("from MedicalCard t where t.state=1 and t.patientId=?");
		//List<MedicalCard> cards =this.medicalCardManager.find(sql, id);
		//patient.setCardCount(size);
		return ResultUtils.renderSuccessResult(patient);
	}

	/**
	 * ELH_BASE_002 维护就诊人信息
	 * 运营端可能使用
	 * @param id
	 * @param data
	 * @return
	 */
	@Deprecated
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id, @RequestBody String data) {
		Patient patient  = this.patientManager.get(id);
		
		Map userPatientData = JSONUtils.deserialize(data, Map.class);
		/*if (null != userPatientData.get("user")) {
			patient.setUserId(userPatientData.get("userId").toString()); // 用户
		}
		if (null != userPatientData.get("patientt")) {
			patient.setPatientId(userPatientData.get("Patientt").toString()); // 就诊人
		}*/
		if (null != userPatientData.get("usertype")) {
			patient.setUserType(userPatientData.get("usertype").toString()); // 用户类型
		}
		if (null != userPatientData.get("name")) {
			patient.setName(userPatientData.get("name").toString()); // 姓名
		}
		if (null != userPatientData.get("gender")) {
			patient.setGender(userPatientData.get("gender").toString()); // 性别
		}
		/*if (null != userPatientData.get("relationshi")) {
			patient.setRelationshi(userPatientData.get("relationshi").toString()); // 关系
		}
		if (null != userPatientData.get("alias")) {
			patient.setAlias(userPatientData.get("alias").toString()); // 别名
		}*/
		if (null != userPatientData.get("idno")) {
			patient.setIdno(userPatientData.get("idno").toString()); // 身份证号码
		}
		if (null != userPatientData.get("photo")) {
			patient.setPhoto(userPatientData.get("photo").toString()); // 头像
		}
		if (null != userPatientData.get("mobile")) {
			patient.setMobile(userPatientData.get("mobile").toString()); // 手机
		}
		if (null != userPatientData.get("email")) {
			patient.setEmail(userPatientData.get("email").toString()); // 邮箱
		}
		if (null != userPatientData.get("address")) {
			patient.setAddress(userPatientData.get("address").toString()); // 地址
		}
		if (null != userPatientData.get("status")) {
			patient.setStatus(userPatientData.get("status").toString()); // 状态
		}
		if (null != userPatientData.get("birthday")) {
			patient.setBirthday(userPatientData.get("birthday").toString()); // 出生日期
		}
		if (null != userPatientData.get("height")) {
			patient.setHeight((Double)userPatientData.get("height")); // 身高
		}
		if (null != userPatientData.get("weight")) {
			patient.setWeight((Double)userPatientData.get("weight")); // 体重
		}
		Patient savedPatient = this.patientManager.save(patient);
		return ResultUtils.renderSuccessResult(savedPatient);
	}

	/**
	 * ELH_BASE_004 删除常用就诊人 
	 * 
	 * @param id
	 * @return
	 */
	@Deprecated
	@RequestMapping(value = "/delBindPatient/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		Patient patient  = this.patientManager.get(id);
		//userPatient.setUnbindedAt(DateUtils.getCurrentDateTimeStr());
		if(!patient.getStatus().equals("0")){
			patient.setStatus("0");
		}
		Patient savedPatient = this.patientManager.save(patient);
		return ResultUtils.renderSuccessResult(savedPatient);
	}

	/**
	 * ELH_BASE_001 查询就诊人列表 
	 * 
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@Deprecated
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start, @PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("查询列表数据，输入查询条件为：【" + data + "】");
		Patient patient = JSONUtils.deserialize(data, Patient.class);;
		StringBuilder sb = new StringBuilder("from Patient t where 1=1 ");
		List<String> cdList = new ArrayList<String>();
		if(null != patient){
			if (StringUtils.isEmpty(patient.getStatus())) {
				sb.append(" and t.status=? ");
				cdList.add(patient.getStatus());
			}
			if (StringUtils.isEmpty(patient.getName())) {
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
		
		/*List<Patient> list = (List<Patient>) page.getResult();
		Patient _userPatient = null;
		String jql = "from MedicalCard t where t.state=1 and t.patientId=?";
		for(int i=0; null!=list&&i<list.size(); i++){
			_userPatient = list.get(i);
			_userPatient.setCardCount(this.patientManager.getCount(jql, _userPatient.getId()));
		}*/
		return ResultUtils.renderSuccessResult(page);
	}
	/******************************************************机构端方法*************************************************************************/
	/******************************************************机构端方法end*************************************************************************/
	/******************************************************app端方法*************************************************************************/
	/******************************************************app端方法end*************************************************************************/
	/******************************************************运营端方法*************************************************************************/
	/******************************************************运营端方法end*************************************************************************/
	
}
