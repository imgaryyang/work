package com.lenovohit.elh.treat.manager.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.elh.base.model.Department;
import com.lenovohit.elh.base.model.Doctor;
import com.lenovohit.elh.base.model.Hospital;
import com.lenovohit.elh.base.model.MedicalCard;
import com.lenovohit.elh.pay.model.Charge;
import com.lenovohit.elh.pay.model.Order;
import com.lenovohit.elh.treat.manager.HisManager;
import com.lenovohit.elh.treat.model.DrugOrder;
import com.lenovohit.elh.treat.model.MedicalCheck;
import com.lenovohit.elh.treat.model.RegistSource;
import com.lenovohit.elh.treat.model.Register;
import com.lenovohit.elh.treat.model.TreatDetail;
import com.lenovohit.elh.treat.model.Treatment;
import com.lenovohit.elh.treat.vom.ChargesTom;
import com.lenovohit.elh.treat.web.rest.TreatHisRestController;

public class HisManagerImpl implements HisManager{
	public final static String URL_REG_SOURCE="URL_REG_SOURCE";
	public final static String URL_LOCK_SOURCE="URL_LOCK_SOURCE";
	public final static String URL_REG="URL_REG";
	public final static String URL_PAY_CHARGES="URL_PAY_CHARGES";
	
	@Autowired
	private TreatHisRestController treatHisRestController;
	@Autowired
	private GenericManager<Treatment, String> treatmentManager;
	@Autowired
	private GenericManager<TreatDetail, String> treatDetailManager;
	@Autowired
	private GenericManager<MedicalCheck, String> medicalCheckManager;
	@Autowired
	private GenericManager<Doctor, String> doctorManager;
	@Autowired
	private GenericManager<Department, String> departmentManager;
	@Autowired
	private GenericManager<DrugOrder, String> drugOrderManager;
	
	private MuleRestClient getMuleClient(){
		MuleRestClient client = new MuleRestClient();
		client.setTreatHisRestController(treatHisRestController);
		client.setTreatmentManager(treatmentManager);
		client.setMedicalCheckManager(medicalCheckManager);
		client.setTreatDetailManager(treatDetailManager);
		client.setDoctorManager(doctorManager);
		client.setDepartmentManager(departmentManager);
		client.setDrugOrderManager(drugOrderManager);
		return client;
	}
	
	/**
	 * 请求号源
	 * @return
	 */
	@Override
	public List<RegistSource> getRegistSource(Hospital hospital,Department department, Doctor doctor, String reqType,String date){
		MuleRestClient client = this.getMuleClient();
		String json = client.get(URL_REG_SOURCE, "{"
				+ "\"hospital\":\""+hospital.getId()+"\","
				+ "\"department\":\""+department.getId()+"\","
				+ "\"doctor\":\""+((null != doctor)?doctor.getId():"")+"\","
				+ "\"date\":\""+((null != date)?date:"")+"\","
				+ "\"reqType\":\""+reqType+ "\"}");
		List<RegistSource> list = JSONUtils.parseObject(json,
				new TypeReference<List<RegistSource>>(){}
		);
		for(RegistSource source : list){
			source.setHospital(hospital.getId());
			source.setHospitalHlht(hospital.getIdHlht());
			source.setHospitalName(hospital.getName());
			source.setDepartment(department.getId());
			source.setDepartmentHlht(department.getIdHlht());
			source.setDepartmentName(department.getName());
			if(null!=doctor){
				source.setDoctor(doctor.getId());
				source.setDoctorName(doctor.getName());
				source.setDoctorHlht(doctor.getIdHlht());
			}
		}
		return list;
	}
	/**
	 * 锁定号源  在挂号表里面加上预约码
	 * @param source
	 * @return
	 */
	@Override
	public RegistSource lockRegistSource(RegistSource source){
		MuleRestClient client = this.getMuleClient();
		String json = client.get(URL_LOCK_SOURCE, JSONUtils.serialize(source));
		RegistSource lockedsource = JSONUtils.parseObject(json,RegistSource.class);
		source.setNo(lockedsource.getNo());
		return source;
	}
	/**
	 *  预约挂号
	 * @param source
	 * @return
	 */
	@Override
	public RegistSource registAppiont(RegistSource source){
		MuleRestClient client = this.getMuleClient();
		String json = client.get(URL_REG, JSONUtils.serialize(source));
		RegistSource appiontSource = JSONUtils.parseObject(json,RegistSource.class);
		source.setNo(appiontSource.getNo());
		source.setAppointNo(appiontSource.getAppointNo());
		return source;
	}
	/**
	 * 实时挂号 该接口不会被用到，当需要支付的项目支付后医院主动通知实时挂号接口完成。
	 * @param register
	 * @return
	 */
	@Override
	public Register registRealTime(Register register){
		return register;
	}
	@Override
	public List<Charge> payCharges(List<Charge> charges) {
		ChargesTom req = new ChargesTom();
		req.setCharges(charges);
		MuleRestClient client = this.getMuleClient();
		String json = client.get(URL_PAY_CHARGES, JSONUtils.serialize(req));
		ChargesTom result = JSONUtils.parseObject(json,ChargesTom.class);//TODO 在此认为charge的所有字段都会被返回，实际情况请对应charge赋值
		return result.getCharges();
	}
	@Override
	public Order siCardPay(Order order) {
		// TODO Auto-generated method stub
		return order;
	}
	@Override
	public List<MedicalCheck> requireCheck(List<MedicalCheck> check) {
		// TODO Auto-generated method stub
		return check;
	}

	@Override
	public MedicalCard getMedicalCard(String hospitalId, String cardNo) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public MedicalCard makeMedicalCard(MedicalCard card) {
		// TODO Auto-generated method stub
		return null;
	}
}
