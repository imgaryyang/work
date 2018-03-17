package com.lenovohit.hcp.baseinfo.controller;


import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.Hospital;
import com.lenovohit.hcp.base.model.IInpatient;
import com.lenovohit.hcp.base.model.IInpatientDaily;
import com.lenovohit.hcp.base.model.IProfile;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.card.manager.PatientCardManager;
import com.lenovohit.hcp.card.model.Patient;

/**
 * @author red
 * @date 2017年12月23日
 * 患者基本信息管理
 */

@RestController
@RequestMapping("/hcp/app/base/inpatient")
public class IInpatientRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<Patient, String> patientManager;
	
	@Autowired
	private GenericManager<IInpatient, String> inPatientManager;
	
	@Autowired
	private GenericManager<IInpatientDaily, String> inPatientDailyManager;
	
	@Autowired
	private PatientCardManager patientCardManager;
	@Autowired
	private GenericManager<Hospital, String> hospitalManager;
	
	/**
	 * 查询当前患者住院单
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/info", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInPatientInfo(@RequestParam(value = "data", defaultValue = "") String data){
		
		//IInpatient query =  JSONUtils.deserialize(data, IInpatient.class);
		// 查询条件
		JSONObject query = JSONObject.parseObject(data);
		String proNo = query.getString("proNo");
		String hosNo = query.getString("hosNo");
		
		StringBuilder jql = new StringBuilder("from IInpatient where 1=1  ");
		List<Object> values = new ArrayList<Object>();
		if(query!=null){
			//医院编号
			if (!StringUtils.isEmpty(hosNo)) {
				jql.append("and hosId = ? ");
				values.add(hosNo);
			}
			//档案编号
			if(!StringUtils.isEmpty(proNo)){
				jql.append("and proNo = ? ");
				values.add(proNo);
			}
		}
		IInpatient inPatient = this.inPatientManager.findOne(jql.toString(), values.toArray());
		if(inPatient!=null){
			return ResultUtils.renderSuccessResult(inPatient);
		}else{
			return ResultUtils.renderFailureResult("该患者无住院信息");
		}
	}

	/**
	 * 查询患者住院日清单
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data){
		//IInpatient query =  JSONUtils.deserialize(data, IInpatient.class);
		// 查询条件
		JSONObject query = JSONObject.parseObject(data);
		String proNo = query.getString("proNo");
		String hosNo = query.getString("hosNo");
		String startDate = query.getString("startDate");
		String endDate = query.getString("endDate");
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date1 = null;
		Date date2 = null;
		try {
			date1 = format.parse((startDate)+" 00:00:00");
			date2 = format.parse((endDate)+" 23:59:59");
		} catch (ParseException e) {
			e.printStackTrace();
		}
		StringBuilder jql = new StringBuilder("from IInpatientDaily where 1=1  ");
		List<Object> values = new ArrayList<Object>();
		if(query!=null){
			//医院编号
			if (!StringUtils.isEmpty(hosNo)) {
				jql.append("and hosId = ? ");
				values.add(hosNo);
			}
		  	//档案编号
			if(!StringUtils.isEmpty(proNo)){
				jql.append("and proNo = ? ");
				values.add(proNo);
			}
			//档案编号
			if(!StringUtils.isEmpty(startDate)){
				jql.append("and chargeTime >= ? ");
				values.add(date1);
			}
			//档案编号
			if(!StringUtils.isEmpty(endDate)){
				jql.append("and chargeTime <= ? ");
				values.add(date2);
			}
		}
		List<IInpatientDaily> inpatientDaily =(List<IInpatientDaily>) this.inPatientDailyManager.findByJql(jql.toString(), values.toArray());
		//List<IInpatient> iprofiles=TransFormModels(patients);
		if(inpatientDaily!=null){
			return ResultUtils.renderSuccessResult(inpatientDaily);
		}else{
			return ResultUtils.renderFailureResult("该患者无住院信息");
		}
	}
	
	private List<IInpatient> TransFormModels(List<Patient> patients) {
		List<IInpatient> iprofiles=new ArrayList<IInpatient>();
		for(int i=0;i<patients.size();i++){
			IInpatient transFormModels = TransFormModel(patients.get(i));
			iprofiles.add(transFormModels);
		}
		return iprofiles;
	}
	
	private IInpatient TransFormModels(Patient patients) {
		IInpatient transFormModels = TransFormModel(patients);
		return transFormModels;
	}
	
	private IInpatient TransFormModel(Patient patient) {
		
			IInpatient inpatient=new IInpatient();
			inpatient.setProNo(patient.getPatientId());
			inpatient.setProName(patient.getName());
			inpatient.setMobile(patient.getMobile());
			inpatient.setIdNo(patient.getIdNo());
			inpatient.setHosNo(patient.getHosId());
			inpatient.setHosName(hospitalManager.findOneByProp("hosId",patient.getHosId()).getHosName());
			
		return inpatient;
	}
	
	/**
	 * 建档
	 * @param patientId
	 * @return
	 */
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreatePatient(@RequestBody String data){
		try{
			IProfile model =  JSONUtils.deserialize(data, IProfile.class);
			String jql = "from Patient where hosId = ? and idNo = ? ";
			List<Object> values = new ArrayList<Object>();
			values.add(model.getHosNo());
			values.add(model.getIdno());
			//根据医院id和身份证id，来查看在该医院，身份证是否被占用
			List<Patient> patient = patientManager.find(jql, values.toArray());
			if(patient.size()>0){
				return ResultUtils.renderFailureResult("身份证账号已被占用，建档失败！");
			}
			Patient saved = patientCardManager.createCard(CoventModeltoHis(model));
			IInpatient iprofile=TransFormModel(saved);
			return ResultUtils.renderSuccessResult(iprofile);
		}catch(Exception e){
			e.printStackTrace();
			System.err.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
	
	@SuppressWarnings("deprecation")
	private Patient CoventModeltoHis(IProfile model) {
		Patient patient=new Patient();
		if(!model.getNo().equals("")){
			patient.setPatientId(model.getNo());
		}
		patient.setName(model.getPatientName());
		patient.setIdentityPic(model.getPhoto());
		patient.setSex(model.getGender());
		patient.setBirthday(new Date(model.getBirthDay()));
		patient.setMobile(model.getMobile());
		patient.seteMail(model.getEmail());
		patient.setNation(model.getNation());
		patient.setIdAddress(model.getAddress());
		patient.setNationality(model.getNationality());
		patient.setIdAddress(model.getOrigin());;
		patient.setIdNo(model.getIdno());
		patient.setMiCardNo(model.getMiCardNo());
		patient.setHosId(model.getHosNo());
		
		return patient;
	}

	/**
	 * 更新
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		try{
			IProfile model =  JSONUtils.deserialize(data,IProfile.class);
			if(model==null || StringUtils.isBlank(model.getNo())){
				return ResultUtils.renderFailureResult("不存在此对象");
			}
			if(model.getNo()!=null){
				Patient patient = this.patientManager.findOneByProp("patientId", model.getNo());
				//获取当前登入用户信息
				List<Object> values = new ArrayList<Object>();
				if(!patient.getIdNo().equals(model.getIdno())){
					String jql = "from Patient where hosId = ? and  idNo = ?  ";
					values.add(patient.getHosId());
					values.add(model.getIdno());
					//根据医院id和身份证id，来查看在该医院，身份证是否被占用
					List<Patient> patientList = patientManager.find(jql, values.toArray());
					if(patientList.size()>0){
						return ResultUtils.renderFailureResult("身份证账号已被占用，更新失败！");
					}
				}
				if((model.getCardNo() != null || model.getCardNo() != "") && !model.getCardNo().equals(patient.getMedicalCardNo()) ){
					//根据医院id和诊疗卡id，来查看在该医院，诊疗卡是否被占用
					String sql = "from Patient where hosId = ? and  medicalCardNo = ?   ";
					values = new ArrayList<Object>();
					values.add(patient.getHosId());
					values.add(model.getCardNo());
					List<Patient> patients = patientManager.find(sql, values.toArray());
					if(patients.size()>0){
						return ResultUtils.renderFailureResult("诊疗卡已被占用，更新失败！");
					}
				}
			}
			Patient saved = patientCardManager.updateCard(CoventModeltoHis(model));
			return ResultUtils.renderSuccessResult(TransFormModel(saved));
		}catch(Exception e){
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
	
	
	
	/**
	 * 档案注销
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/cancel", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCancel(@RequestBody String data) {
		try{
			IProfile query =  JSONUtils.deserialize(data, IProfile.class);
			
			StringBuilder jql = new StringBuilder("from Patient where 1=1  ");
			List<Object> values = new ArrayList<Object>();
			//医院编号
			if (!StringUtils.isEmpty(query.getHosNo())) {
				jql.append("and hosId = ? ");
				values.add(query.getNo());
			}
			//医院名称
			if (!StringUtils.isEmpty(query.getHosName())) {
				jql.append("and hosId in ( select hosId from Hospital hos where hos.hosName like ? )  ");
				values.add("%" + query.getHosName() + "%");
			}
			//档案编号
			if(!StringUtils.isEmpty(query.getNo())){
				jql.append("and id like ? ");
				values.add("%" + query.getNo() + "%");
			}
			//姓名
			if(!StringUtils.isEmpty(query.getPatientName())){
				jql.append("and name like ? ");
				values.add("%" + query.getPatientName() + "%");
			}
			List<Patient> patient=(List<Patient>) this.patientManager.findByJql(jql.toString(), values.toArray());
			patient.get(0).setStopFlag("0");
			return ResultUtils.renderSuccessResult(TransFormModel(patient.get(0)));
		}catch(Exception e){
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
	/**
	 * 档案解锁
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/unlock", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result unLock(@RequestBody String data) {
		try{
			IProfile query =  JSONUtils.deserialize(data, IProfile.class);
			
			StringBuilder jql = new StringBuilder("from Patient  ");
			List<Object> values = new ArrayList<Object>();
			if(query!=null){
				jql.append("where 1=1");
			
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
			if(!StringUtils.isEmpty(query.getNo())){
				jql.append("and patientId like ? ");
				values.add("%" + query.getNo() + "%");
			}
			//姓名
			if(!StringUtils.isEmpty(query.getPatientName())){
				jql.append("and name like ? ");
				values.add("%" + query.getPatientName() + "%");
			}
			}
			List<Patient> patient=(List<Patient>) this.patientManager.findByJql(jql.toString(), values.toArray());
			patient.get(0).setStopFlag("1");
			return ResultUtils.renderSuccessResult(TransFormModel(patient.get(0)));
		}catch(Exception e){
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
}
